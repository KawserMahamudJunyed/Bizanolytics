"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Save, User, Building2, Loader2, ArrowLeft, Settings } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"
import Link from "next/link"

export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  
  const [profile, setProfile] = useState({
    full_name: "",
    company_name: "",
  })
  const [syncFreq, setSyncFreq] = useState("daily")

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
        .select("full_name, company_name")
        .eq("id", session.user.id)
        .single()

      if (data) {
        setProfile({
          full_name: data.full_name || session.user.user_metadata?.full_name || "",
          company_name: data.company_name || "",
        })
      } else {
        setProfile(p => ({
          ...p,
          full_name: session.user.user_metadata?.full_name || ""
        }))
      }
      
      const freq = localStorage.getItem("bizanolytics_sync_freq") || "daily"
      setSyncFreq(freq)
      
      setIsLoading(false)
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      toast.error("You must be logged in to save profile.")
      setIsSaving(false)
      return
    }

    // Update auth metadata so the sidebar automatically gets the new name
    const { error: authError } = await supabase.auth.updateUser({
      data: { full_name: profile.full_name, company_name: profile.company_name }
    })

    // Also try updating the public profiles table (if it exists)
    const { error: dbError } = await supabase
      .from("profiles")
      .upsert({
        id: session.user.id,
        full_name: profile.full_name,
        company_name: profile.company_name
      }, { onConflict: 'id' })

    setIsSaving(false)
    
    if (authError || dbError) {
      if (dbError) console.error("Supabase Profiles Error:", dbError);
      if (authError) console.error("Supabase Auth Error:", authError);
      
      if (!authError && dbError) {
        toast.warning(`Profile saved, but database sync failed (Likely missing RLS policy): ${dbError.message}`)
        // Auth succeeded, so we still want to reload the UI to reflect the new Auth name!
        setTimeout(() => window.location.reload(), 2500)
      } else {
        toast.error(`Error saving profile: ${authError?.message}`)
      }
    } else {
      toast.success("Profile saved successfully!")
      // Hard refresh to ensure the sidebar component re-fetches the auth session
      setTimeout(() => window.location.reload(), 1000)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pt-8 pb-12">
      <Link href="/settings" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4">
        <Settings className="w-4 h-4" /> Go to Account Settings
      </Link>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Profile</h1>
        <p className="text-muted-foreground mt-2">Manage your personal and company details.</p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-6 md:p-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary shrink-0">
              {profile.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <h3 className="text-lg font-medium text-foreground">{profile.full_name || "Profile Avatar"}</h3>
              <p className="text-sm text-muted-foreground">{profile.company_name || "Configure your details below"}</p>
            </div>
          </div>
          
          <div className="sm:ml-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-xs font-medium text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Plan: {syncFreq === "instant" ? "BizUltimate" : syncFreq === "hourly" ? "BizPro" : "BizBasic"}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={profile.full_name}
                onChange={e => setProfile({...profile, full_name: e.target.value})}
                className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={profile.company_name}
                onChange={e => setProfile({...profile, company_name: e.target.value})}
                className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground focus:ring-2 focus:ring-primary/30 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border mt-8">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </motion.div>
    </div>
  )
}
