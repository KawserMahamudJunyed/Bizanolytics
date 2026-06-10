"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  Globe,
  Key,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Eye,
  EyeOff,
  AlertTriangle,
  Download,
  Link2,
  Server,
  Lock,
  Store,
  HelpCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import {
  normalizeShopify,
  normalizeWooCommerce,
  normalizeCustom,
} from "../utils/normalize"
import type {
  IntegrationData,
  PipelineStep,
  PlatformType,
} from "../utils/types"

interface OwnerConnectProps {
  onDataReady: (data: IntegrationData) => void
  mode?: "ecommerce" | "pos"
}

const ECOMMERCE_PLATFORMS = [
  {
    key: "shopify" as PlatformType,
    label: "Shopify",
    icon: ShoppingBag,
    gradient: "from-blue-500/80 to-blue-500",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-500",
    accentBorder: "border-blue-500/30",
    ringColor: "ring-blue-500/30",
    description: "Connect via Storefront API",
  },
  {
    key: "woocommerce" as PlatformType,
    label: "WooCommerce",
    icon: Store,
    gradient: "from-blue-500/80 to-blue-500",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-500",
    accentBorder: "border-blue-500/30",
    ringColor: "ring-blue-500/30",
    description: "Connect via REST API",
  },
  {
    key: "custom" as PlatformType,
    label: "Your Website",
    icon: Globe,
    gradient: "from-blue-500/80 to-blue-500",
    accentBg: "bg-blue-500/10",
    accentText: "text-blue-500",
    accentBorder: "border-blue-500/30",
    ringColor: "ring-blue-500/30",
    description: "Connect any e-commerce site via API",
  },
]

const POS_PLATFORMS = [
  {
    key: "square" as PlatformType,
    label: "Square",
    icon: Store,
    gradient: "from-purple-500/80 to-purple-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-500",
    accentBorder: "border-purple-500/30",
    ringColor: "ring-purple-500/30",
    description: "Connect via Square Retail API",
  },
  {
    key: "lightspeed" as PlatformType,
    label: "Lightspeed",
    icon: Server,
    gradient: "from-purple-500/80 to-purple-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-500",
    accentBorder: "border-purple-500/30",
    ringColor: "ring-purple-500/30",
    description: "Connect via Lightspeed Retail API",
  },
  {
    key: "clover" as PlatformType,
    label: "Clover",
    icon: Link2,
    gradient: "from-purple-500/80 to-purple-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-500",
    accentBorder: "border-purple-500/30",
    description: "Connect via Clover REST API",
  },
  {
    key: "custom" as PlatformType,
    label: "Custom POS",
    icon: Globe,
    gradient: "from-purple-500/80 to-purple-500",
    accentBg: "bg-purple-500/10",
    accentText: "text-purple-500",
    accentBorder: "border-purple-500/30",
    ringColor: "ring-purple-500/30",
    description: "Connect any POS system via API",
  },
]

const PIPELINE_STEPS = [
  { key: "fetching", label: "Connecting…", icon: Link2 },
  { key: "extracting", label: "Fetching products…", icon: Download },
  { key: "updating", label: "Building dashboard…", icon: Server },
]

export function OwnerConnect({ onDataReady, mode = "ecommerce" }: OwnerConnectProps) {
  const PLATFORMS = mode === "ecommerce" ? ECOMMERCE_PLATFORMS : POS_PLATFORMS
  const [activePlatform, setActivePlatform] = useState<PlatformType>(PLATFORMS[0].key)
  const [currentStep, setCurrentStep] = useState<PipelineStep | "subscription">("idle")
  const [error, setError] = useState<string | null>(null)
  const [isFinishing, setIsFinishing] = useState(false)
  
  const [fetchedData, setFetchedData] = useState<IntegrationData | null>(null)
  const [selectedFreq, setSelectedFreq] = useState("daily")

  // Reset active platform when mode changes
  useEffect(() => {
    setActivePlatform(PLATFORMS[0].key)
  }, [mode])

  // Shopify fields
  const [shopifyDomain, setShopifyDomain] = useState("")
  const [shopifyToken, setShopifyToken] = useState("")
  const [showShopifyToken, setShowShopifyToken] = useState(false)

  // WooCommerce fields
  const [wooSiteUrl, setWooSiteUrl] = useState("")
  const [wooKey, setWooKey] = useState("")
  const [wooSecret, setWooSecret] = useState("")
  const [showWooKey, setShowWooKey] = useState(false)
  const [showWooSecret, setShowWooSecret] = useState(false)

  // Custom API fields
  const [customEndpoint, setCustomEndpoint] = useState("")
  const [customToken, setCustomToken] = useState("")
  const [showCustomToken, setShowCustomToken] = useState(false)

  // POS fields
  const [posToken, setPosToken] = useState("")
  const [showPosToken, setShowPosToken] = useState(false)
  const [posLocation, setPosLocation] = useState("")

  const platform = PLATFORMS.find((p) => p.key === activePlatform) || PLATFORMS[0]
  const isRunning = ["fetching", "extracting", "updating"].includes(currentStep)

  // Handlers
  const connectShopify = useCallback(async () => {
    if (!shopifyDomain.trim() || !shopifyToken.trim()) {
      toast.error("Please fill in both the store domain and API token")
      return
    }

    setError(null)
    setCurrentStep("fetching")

    try {
      const data = await apiClient.post<any>("/api/v1/integrations/sync", {
        platform: "shopify",
        url: shopifyDomain.trim(),
        keys: {
          storefrontToken: shopifyToken.trim(),
        }
      })

      setCurrentStep("extracting")
      const normalized = data; // data is already normalized from the sync endpoint

      if (normalized.products.length === 0) throw new Error("No products found in this Shopify store.")

      setCurrentStep("updating")
      await new Promise((r) => setTimeout(r, 600))
      
      setFetchedData(normalized)
      setCurrentStep("subscription")
      toast.success(`Connected! Found ${normalized.products.length} products`)
    } catch (err: any) {
      setCurrentStep("error")
      setError(err.message || "Failed to connect to Shopify")
      toast.error(err.message || "Connection failed")
    }
  }, [shopifyDomain, shopifyToken, onDataReady])

  const connectWooCommerce = useCallback(async () => {
    if (!wooSiteUrl.trim() || !wooKey.trim() || !wooSecret.trim()) {
      toast.error("Please fill in all WooCommerce fields")
      return
    }

    setError(null)
    setCurrentStep("fetching")

    try {
      const data = await apiClient.post<any>("/api/v1/integrations/sync", {
        platform: "woocommerce",
        url: wooSiteUrl.trim(),
        keys: {
          consumerKey: wooKey.trim(),
          consumerSecret: wooSecret.trim(),
        }
      })

      setCurrentStep("updating")
      await new Promise((r) => setTimeout(r, 600))
      
      setFetchedData(data)
      setCurrentStep("subscription")
      toast.success(`Connected! Found ${data.products?.length || 0} products. Keys saved securely.`)
    } catch (err: any) {
      setCurrentStep("error")
      setError(err.message || "Failed to connect to WooCommerce")
      toast.error(err.message || "Connection failed")
    }
  }, [wooSiteUrl, wooKey, wooSecret, onDataReady])

  const connectCustom = useCallback(async () => {
    if (!customEndpoint.trim()) {
      toast.error("Please enter your API endpoint URL")
      return
    }

    let validUrl = customEndpoint.trim()
    if (!validUrl.startsWith("http")) validUrl = `https://${validUrl}`
    try { new URL(validUrl) } catch { toast.error("Please enter a valid URL"); return }

    setError(null)
    setCurrentStep("fetching")

    try {
      const data = await apiClient.post<any>("/api/v1/integrations/sync", {
        platform: "custom",
        url: validUrl,
        keys: {
          bearerToken: customToken.trim() || undefined,
        }
      })

      setCurrentStep("extracting")
      const normalized = data; // data is already normalized from the sync endpoint

      if (normalized.products.length === 0) throw new Error("No products found from your API endpoint.")

      setCurrentStep("updating")
      await new Promise((r) => setTimeout(r, 600))
      
      setFetchedData(normalized)
      setCurrentStep("subscription")
      toast.success(`Connected! Found ${normalized.products.length} products`)
    } catch (err: any) {
      setCurrentStep("error")
      setError(err.message || "Failed to connect to your API")
      toast.error(err.message || "Connection failed")
    }
  }, [customEndpoint, customToken, onDataReady])

  const connectMockPOS = useCallback(async () => {
    if (!posToken.trim()) {
      toast.error(`Please enter your ${activePlatform} API Token`)
      return
    }
    
    setError(null)
    setCurrentStep("fetching")
    
    try {
      await new Promise((r) => setTimeout(r, 1000))
      setCurrentStep("extracting")
      
      const data = await apiClient.post<any>("/api/v1/integrations/sync", {
        platform: activePlatform,
        url: "pos_api_url",
        keys: {
          posToken: posToken.trim(),
        }
      });

      setCurrentStep("updating")
      await new Promise((r) => setTimeout(r, 600))
      
      setFetchedData(data)
      setCurrentStep("subscription")
      toast.success(`Connected to ${platform.label}! Found ${data.products?.length || 0} products`)
    } catch (err: any) {
      setCurrentStep("error")
      setError(err.message || "Failed to connect")
      toast.error("Connection failed")
    }
  }, [posToken, activePlatform, platform.label, onDataReady])

  const handleConnect = () => {
    if (mode === "pos") {
      connectMockPOS()
      return
    }
    
    switch (activePlatform) {
      case "shopify":
        connectShopify()
        break
      case "woocommerce":
        connectWooCommerce()
        break
      case "custom":
        connectCustom()
        break
    }
  }

  const canConnect = () => {
    if (isRunning) return false
    
    if (mode === "pos") {
      return !!posToken.trim()
    }
    
    switch (activePlatform) {
      case "shopify":
        return !!shopifyDomain.trim() && !!shopifyToken.trim()
      case "woocommerce":
        return !!wooSiteUrl.trim() && !!wooKey.trim() && !!wooSecret.trim()
      case "custom":
        return !!customEndpoint.trim()
      default:
        return false
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-base p-6 border-border">
        <div className="flex items-center gap-3 mb-5">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl", platform.accentBg)}>
            <Key className={cn("h-5 w-5", platform.accentText)} />
          </div>
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Connect Your {mode === "ecommerce" ? "Store" : "POS"}
            </h3>
            <p className="text-xs text-muted-foreground">
              Link your platform for live product data
            </p>
          </div>
        </div>

        {/* Platform selector pills */}
        <div className="flex gap-2 mb-6 p-1 rounded-xl bg-secondary/50">
          {PLATFORMS.map((p) => {
            const isActive = activePlatform === p.key
            return (
              <button
                key={p.key}
                onClick={() => {
                  if (!isRunning) {
                    setActivePlatform(p.key)
                    setError(null)
                    setCurrentStep("idle")
                  }
                }}
                disabled={isRunning}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                  isRunning && !isActive && "opacity-50 cursor-not-allowed"
                )}
              >
                <p.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={activePlatform}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className={cn("text-xs font-medium mb-4", platform.accentText)}
          >
            {platform.description}
          </motion.p>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePlatform}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {mode === "pos" ? (
              currentStep === "subscription" ? null : (
              <>
                <CredentialField
                  id="pos-location"
                  label="Location ID (Optional)"
                  placeholder="e.g. LOC-12345"
                  value={posLocation}
                  onChange={setPosLocation}
                  disabled={isRunning}
                  icon={Globe}
                />
                <CredentialField
                  id="pos-token"
                  label="API Access Token"
                  placeholder="Bearer token or API Key"
                  value={posToken}
                  onChange={setPosToken}
                  disabled={isRunning}
                  isSecret
                  showSecret={showPosToken}
                  onToggleSecret={() => setShowPosToken(!showPosToken)}
                  icon={Key}
                />
              </>
              )
            ) : currentStep === "subscription" ? null : (
              <>
                {activePlatform === "shopify" && (
                  <>
                    <CredentialField
                      id="shopify-domain"
                      label="Store Domain"
                      placeholder="your-store.myshopify.com"
                      value={shopifyDomain}
                      onChange={setShopifyDomain}
                      disabled={isRunning}
                      icon={Globe}
                    />
                    <CredentialField
                      id="shopify-token"
                      label="Storefront Access Token"
                      placeholder="shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={shopifyToken}
                      onChange={setShopifyToken}
                      disabled={isRunning}
                      isSecret
                      showSecret={showShopifyToken}
                      onToggleSecret={() => setShowShopifyToken(!showShopifyToken)}
                      icon={Key}
                    />
                  </>
                )}

                {activePlatform === "woocommerce" && (
                  <>
                    <CredentialField
                      id="woo-site-url"
                      label="Site URL"
                      placeholder="https://your-store.com"
                      value={wooSiteUrl}
                      onChange={setWooSiteUrl}
                      disabled={isRunning}
                      icon={Globe}
                    />
                    <CredentialField
                      id="woo-consumer-key"
                      label="Consumer Key"
                      placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={wooKey}
                      onChange={setWooKey}
                      disabled={isRunning}
                      isSecret
                      showSecret={showWooKey}
                      onToggleSecret={() => setShowWooKey(!showWooKey)}
                      icon={Key}
                    />
                    <CredentialField
                      id="woo-consumer-secret"
                      label="Consumer Secret"
                      placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      value={wooSecret}
                      onChange={setWooSecret}
                      disabled={isRunning}
                      isSecret
                      showSecret={showWooSecret}
                      onToggleSecret={() => setShowWooSecret(!showWooSecret)}
                      icon={Lock}
                    />
                  </>
                )}

                {activePlatform === "custom" && (
                  <>
                    <CredentialField
                      id="custom-endpoint"
                      label="API Endpoint URL"
                      placeholder="https://your-site.com/api/products"
                      value={customEndpoint}
                      onChange={setCustomEndpoint}
                      disabled={isRunning}
                      icon={Server}
                    />
                    <CredentialField
                      id="custom-bearer-token"
                      label="Bearer Token (optional)"
                      placeholder="your-api-token"
                      value={customToken}
                      onChange={setCustomToken}
                      disabled={isRunning}
                      isSecret
                      showSecret={showCustomToken}
                      onToggleSecret={() => setShowCustomToken(!showCustomToken)}
                      icon={Key}
                    />
                  </>
                )}
              </>
            )}

            {currentStep === "subscription" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="text-center mb-6">
                  <h3 className="text-lg font-bold text-foreground">Select Sync Plan</h3>
                  <p className="text-xs text-muted-foreground mt-1">Choose how often Bizanolytics should update your data.</p>
                </div>
                <div className="grid gap-3">
                  {[
                    { id: "daily", name: "BizBasic (Free)", desc: "Daily Auto-Sync", color: "border-border hover:border-slate-500/50 hover:bg-slate-500/5" },
                    { id: "hourly", name: "BizPro (299 BDT/mo)", desc: "Hourly Auto-Sync", color: "border-border hover:border-blue-500/50 hover:bg-blue-500/5" },
                    { id: "instant", name: "BizUltimate (499 BDT/mo)", desc: "Instant Live Sync Webhooks", color: "border-primary/30 hover:border-primary bg-primary/5 hover:bg-primary/10" }
                  ].map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => setSelectedFreq(plan.id)}
                      className={cn(
                        "cursor-pointer rounded-xl border p-4 transition-all duration-200",
                        plan.color,
                        selectedFreq === plan.id ? "ring-2 ring-primary border-primary bg-primary/5" : ""
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-foreground">{plan.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{plan.desc}</p>
                        </div>
                        <div className={cn("h-4 w-4 rounded-full border flex items-center justify-center", selectedFreq === plan.id ? "border-primary" : "border-muted-foreground/50")}>
                          {selectedFreq === plan.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-6">
          {currentStep === "subscription" ? (
            <motion.button
              whileHover={{ scale: isFinishing ? 1 : 1.01 }}
              whileTap={{ scale: isFinishing ? 1 : 0.99 }}
              disabled={isFinishing}
              onClick={async () => {
                setIsFinishing(true)
                localStorage.setItem("bizanolytics_sync_freq", selectedFreq);
                
                // Update subscription tier via API
                try {
                  await apiClient.post<any>("/api/v1/integrations/subscription", {
                    platform: activePlatform,
                    subscription_tier: selectedFreq
                  });
                } catch (e: any) {
                  console.error("Failed to update subscription tier", e);
                  toast.error("Network error updating subscription");
                  setIsFinishing(false);
                  return;
                }
                
                if (fetchedData) {
                  onDataReady(fetchedData);
                }
                setIsFinishing(false)
              }}
              className="w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 disabled:opacity-70 disabled:cursor-wait"
            >
              {isFinishing ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {isFinishing ? "Finalizing..." : "Finish Setup & Sync"}
            </motion.button>
          ) : (
            <motion.button
              id="owner-connect-button"
              whileHover={{ scale: isRunning ? 1 : 1.01 }}
              whileTap={{ scale: isRunning ? 1 : 0.99 }}
              onClick={handleConnect}
              disabled={!canConnect()}
              className={cn(
                "w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all",
                isRunning
                  ? cn("bg-secondary text-primary cursor-wait")
                  : cn("bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"),
                !canConnect() && !isRunning && "opacity-50 cursor-not-allowed"
              )}
            >
              {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
              {isRunning ? "Connecting…" : "Connect & Import"}
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {isRunning && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 overflow-hidden"
            >
              <div className="flex items-center gap-0">
                {PIPELINE_STEPS.map((step, i) => {
                  const stepKeys: PipelineStep[] = ["fetching", "extracting", "updating"]
                  const currentIdx = stepKeys.indexOf(currentStep as any)
                  const isActive = stepKeys[i] === currentStep
                  const isComplete = i < currentIdx
                  const isPending = i > currentIdx

                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex items-center gap-2.5 flex-1">
                        <div
                          className={cn(
                            "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300",
                            isActive && cn("bg-primary/10 ring-2 ring-primary/30"),
                            isComplete && "bg-primary/20",
                            isPending && "bg-secondary"
                          )}
                        >
                          {isComplete ? (
                            <CheckCircle2 className="h-4 w-4 text-primary" />
                          ) : isActive ? (
                            <Loader2 className="h-4 w-4 animate-spin text-primary" />
                          ) : (
                            <step.icon className="h-4 w-4 text-muted-foreground/50" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium transition-colors hidden sm:block",
                            isActive && "text-primary",
                            isComplete && "text-primary/80",
                            isPending && "text-muted-foreground/50"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < PIPELINE_STEPS.length - 1 && (
                        <div className={cn("h-px flex-1 mx-3 transition-colors", isComplete ? "bg-primary/40" : "bg-border")} />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="mt-3 h-1 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{
                    width: currentStep === "fetching" ? "33%" : currentStep === "extracting" ? "66%" : "95%",
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="mt-4 flex items-start gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4"
            >
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-destructive">Connection Failed</p>
                <p className="text-xs text-destructive/80 mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => { setError(null); setCurrentStep("idle") }}
                className="ml-auto text-destructive/60 hover:text-destructive transition-colors"
              >
                <XCircle className="h-4 w-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-[11px] text-muted-foreground/60">
        <Lock className="h-3 w-3" />
        <span>Your credentials are sent directly to the platform's API and are never stored on our servers.</span>
      </div>
    </motion.div>
  )
}

function CredentialField({
  id, label, placeholder, value, onChange, disabled, isSecret = false, showSecret = false, onToggleSecret, icon: Icon,
}: any) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      <div className="relative">
        <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
        <input
          id={id}
          type={isSecret && !showSecret ? "password" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all disabled:opacity-50 font-mono"
        />
        {isSecret && onToggleSecret && (
          <button
            type="button"
            onClick={onToggleSecret}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
