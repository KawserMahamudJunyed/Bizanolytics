"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  Store,
  Database,
  Calculator,
  ChevronLeft,
  Sparkles,
  CheckCircle,
  RotateCcw,
  Trash2,
  ExternalLink,
  Clock,
  Zap,
  Calendar,
  CreditCard,
  Link2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { mapIntegrationToSMEData } from "./utils/normalize"
import type { IntegrationData } from "./utils/types"

const STORAGE_KEY = "bizanolytics_integration_data"
const SYNC_FREQ_KEY = "bizanolytics_sync_freq"

const CATEGORIES = [
  {
    id: "ecommerce",
    title: "E-Commerce",
    description: "Connect Shopify, WooCommerce, or Custom API",
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hover: "hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
  },
  {
    id: "pos",
    title: "Retail POS",
    description: "Sync with Square, Lightspeed, or Clover",
    icon: Store,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    hover: "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
  },
  {
    id: "databases",
    title: "Databases & Spreadsheets",
    description: "Connect Sheets, Excel, or API Endpoints",
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hover: "hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
  },
  {
    id: "bizpos",
    title: "BizPOS (Manual Entry)",
    description: "Native manual point-of-sale logging",
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
  }
]

export default function IntegrationsPage() {
  const [data, setData] = useState<IntegrationData | null>(null)
  const [syncFreq, setSyncFreq] = useState<"daily" | "hourly" | "instant">("daily")
  const [hasHydrated, setHasHydrated] = useState(false)
  const { setUploadedData, resetData } = useData()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed) setData(parsed)
      }
      const freq = localStorage.getItem(SYNC_FREQ_KEY)
      if (freq) setSyncFreq(freq as any)
    } catch {}
    setHasHydrated(true)
  }, [])

  const handleClear = useCallback(() => {
    setData(null)
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SYNC_FREQ_KEY)
    resetData()
  }, [resetData])

  const handleSetSyncFreq = (freq: "daily" | "hourly" | "instant") => {
    setSyncFreq(freq)
    localStorage.setItem(SYNC_FREQ_KEY, freq)
  }

  if (!hasHydrated) return null

  // Success State for connected API
  if (data) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pt-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Integration Active</h1>
            <p className="mt-1 text-sm text-muted-foreground">Your store is connected and syncing data to Bizanolytics.</p>
          </div>
          <button onClick={handleClear} className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-500/20 transition-colors">
            <Trash2 className="h-4 w-4" /> Disconnect
          </button>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-8 space-y-8">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 mb-2">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold">Store Connected: {data.business.name}</h2>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1.5 text-sm font-medium text-emerald-500">
              <Sparkles className="h-4 w-4" /> {data.products.length} Products Synced Successfully
            </div>
          </div>

          <div className="border-t border-border pt-8">
            <h3 className="text-lg font-semibold mb-4 text-center">Select Sync Frequency (Subscription)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SyncCard 
                title="Daily Sync" 
                desc="Updates once every 24 hours" 
                tier="Free Tier" 
                icon={Calendar} 
                active={syncFreq === "daily"} 
                onClick={() => handleSetSyncFreq("daily")} 
              />
              <SyncCard 
                title="Hourly Sync" 
                desc="Updates every hour" 
                tier="Growth Tier" 
                icon={Clock} 
                active={syncFreq === "hourly"} 
                onClick={() => handleSetSyncFreq("hourly")} 
              />
              <SyncCard 
                title="Instant Live Sync" 
                desc="Real-time webhooks" 
                tier="Pro Tier" 
                icon={Zap} 
                active={syncFreq === "instant"} 
                onClick={() => handleSetSyncFreq("instant")} 
                highlight
              />
            </div>
          </div>

          <div className="flex gap-4 justify-center pt-6">
            <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  // Selection Hub
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-10 text-center space-y-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Link2 className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-bold text-foreground">Integrations Hub</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Connect your favorite platforms, sync your databases, or log manual sales using BizPOS. Choose a category to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES.map((cat) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href={`/integrations/${cat.id}`}
              className={cn(
                "block h-full card-base p-6 text-left transition-all duration-300 border",
                cat.bg,
                cat.border,
                cat.hover
              )}
            >
              <div className="flex items-start gap-4">
                <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-background shadow-sm", cat.color)}>
                  <cat.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{cat.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                    {cat.description}
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

function SyncCard({ title, desc, tier, icon: Icon, active, onClick, highlight }: any) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative rounded-xl border p-5 cursor-pointer transition-all duration-200",
        active ? (highlight ? "border-primary bg-primary/10 ring-1 ring-primary" : "border-primary/50 bg-secondary ring-1 ring-border") : "border-border bg-card hover:border-primary/30",
        "flex flex-col items-center text-center"
      )}
    >
      {active && (
        <div className="absolute top-2 right-2">
          <CheckCircle className={cn("h-4 w-4", highlight ? "text-primary" : "text-foreground")} />
        </div>
      )}
      <Icon className={cn("h-8 w-8 mb-3", active ? (highlight ? "text-primary" : "text-foreground") : "text-muted-foreground")} />
      <h4 className="font-semibold text-foreground text-sm">{title}</h4>
      <p className="text-xs text-muted-foreground mt-1 mb-3">{desc}</p>
      <span className={cn(
        "px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md",
        active ? (highlight ? "bg-primary text-primary-foreground" : "bg-primary/20 text-foreground") : "bg-secondary text-muted-foreground"
      )}>
        {tier}
      </span>
    </div>
  )
}

function LinkIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}
