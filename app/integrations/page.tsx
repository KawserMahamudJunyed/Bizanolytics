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
  Link2,
  Plus
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import { mapIntegrationToSMEData } from "./utils/normalize"
import type { IntegrationData } from "./utils/types"

const STORAGE_KEY = "bizanolytics_integration_data"
const SYNC_FREQ_KEY = "bizanolytics_sync_freq"

const CATEGORIES = (t: any) => [
  {
    id: "ecommerce",
    title: t('ecommerce'),
    description: t('ecommerce_desc'),
    icon: ShoppingBag,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    hover: "hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10"
  },
  {
    id: "pos",
    title: t('retail_pos'),
    description: t('retail_pos_desc'),
    icon: Store,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    hover: "hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
  },
  {
    id: "databases",
    title: t('databases'),
    description: t('databases_desc'),
    icon: Database,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    hover: "hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10"
  },
  {
    id: "bizpos",
    title: t('bizpos'),
    description: t('bizpos_desc'),
    icon: Calculator,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    hover: "hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/10"
  }
]

export default function IntegrationsPage() {
  const { t } = useLanguage()
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
    
    if (freq === "instant") {
      const toastId = toast.loading("Establishing real-time webhook connection...")
      setTimeout(() => {
        toast.success("BizUltimate Activated: Real-time webhook connection established!", { id: toastId })
      }, 1500)
    } else if (freq === "hourly") {
      toast.success("BizPro Activated: Hourly sync schedule updated.")
    } else {
      toast.success("BizBasic Activated: Daily sync schedule updated.")
    }
  }

  if (!hasHydrated) return null

  // Success State for connected API
  if (data) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pt-8 pb-12 relative z-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('connect_integration')}</h1>
          <p className="text-muted-foreground mt-2">{t('sync_data_realtime')}</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-base p-8 space-y-8">
          <div className="flex items-center justify-between mb-8 border-b border-border/50 pb-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <CheckCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{t('active_connection')}</h2>
                <p className="text-sm text-muted-foreground">
                  {data.integrationType === 'custom' ? 'Custom API' : 'Manual API'} • Last synced {new Date(data.lastSync || Date.now()).toLocaleString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="group flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500 hover:text-white"
            >
              <Trash2 className="h-4 w-4" />
              {t('disconnect')}
            </button>
          </div>

          <div className="border-t border-border pt-8">
            <h3 className="text-lg font-semibold mb-4 text-center">{t('select_sync_freq')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SyncCard 
                title={t('daily_sync')}
                desc={t('daily_sync_desc')}
                tier="BizBasic" 
                icon={Calendar} 
                active={syncFreq === "daily"} 
                onClick={() => handleSetSyncFreq("daily")} 
              />
              <SyncCard 
                title={t('hourly_sync')}
                desc={t('hourly_sync_desc')}
                tier="BizPro" 
                price="299 BDT/mo"
                icon={Clock} 
                active={syncFreq === "hourly"} 
                onClick={() => handleSetSyncFreq("hourly")} 
              />
              <SyncCard 
                title={t('instant_sync')}
                desc={t('instant_sync_desc')}
                tier="BizUltimate" 
                price="499 BDT/mo"
                icon={Zap} 
                active={syncFreq === "instant"} 
                onClick={() => handleSetSyncFreq("instant")} 
                highlight
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-border/50">
            <Link href="/dashboard" className="rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary">
              {t('go_to_dashboard')}
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
        <h1 className="text-3xl font-bold text-foreground">{t('integrations_hub')}</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          {t('integrations_description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CATEGORIES(t).map((cat) => (
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
