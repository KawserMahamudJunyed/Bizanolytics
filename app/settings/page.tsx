"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, User, Building2, Coins, Loader2, CreditCard, Bell, Shield } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import Link from "next/link"

const CURRENCIES = [
  { code: "BDT", symbol: "৳", label: "Bangladeshi Taka (BDT)" },
  { code: "USD", symbol: "$", label: "US Dollar (USD)" },
  { code: "EUR", symbol: "€", label: "Euro (EUR)" },
  { code: "GBP", symbol: "£", label: "British Pound (GBP)" },
  { code: "INR", symbol: "₹", label: "Indian Rupee (INR)" },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const { setUserCurrency } = useData()
  
  const [profile, setProfile] = useState({
    currency: "BDT"
  })

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.user) {
        setIsLoading(false)
        return
      }

      const { data } = await supabase
        .from("profiles")
        .select("currency")
        .eq("id", session.user.id)
        .single()

      if (data) {
        setProfile({
          currency: data.currency || "BDT"
        })
      }
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      toast.error("You must be logged in to save settings.")
      setIsSaving(false)
      return
    }
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        currency: profile.currency,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })

    setIsSaving(false)
    
    if (error) {
      toast.error("Failed to save settings. Make sure you ran the SQL setup!")
      console.error(error)
    } else {
      toast.success("Settings saved successfully!")
      setUserCurrency(profile.currency) // Update global state
    }
  }

  const tabs = [
    { id: "preferences", label: "Preferences", icon: Coins },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
    { id: "security", label: "Security", icon: Shield },
  ]

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12 pt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your account settings and preferences.</p>
        </div>
        <Link href="/profile" className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
          <User className="w-4 h-4" /> Go to Profile
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1 overflow-x-auto pb-2 md:pb-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-secondary text-foreground" 
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-primary" : "text-muted-foreground")} />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0 space-y-6">

          {activeTab === "preferences" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-base p-6 md:p-8 space-y-8"
            >
              <div>
                <h3 className="text-lg font-medium text-foreground">Regional Preferences</h3>
                <p className="text-sm text-muted-foreground">Set your default currency for dashboard and analytics.</p>
              </div>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Display Currency</label>
                  <div className="relative">
                    <Coins className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <select
                      value={profile.currency}
                      onChange={e => setProfile({...profile, currency: e.target.value})}
                      className="w-full appearance-none rounded-xl border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all"
                    >
                      {CURRENCIES.map(c => (
                        <option key={c.code} value={c.code}>{c.label}</option>
                      ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    This currency will be applied globally across Bizanolytics.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {(activeTab === "billing" || activeTab === "security") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-base p-6 md:p-12 text-center"
            >
              <h3 className="text-lg font-medium text-foreground">Coming Soon</h3>
              <p className="text-sm text-muted-foreground mt-2">This section is currently under development.</p>
            </motion.div>
          )}

          {/* Action Footer */}
          {activeTab === "preferences" && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
