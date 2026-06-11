"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Search,
  Database,
  Layers,
  Activity,
  Menu,
  X,
  HelpCircle,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeft,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/app/login/actions"
import { createClient } from "@/utils/supabase/client"
import { useLanguage } from "@/contexts/LanguageContext"
import { Language } from "@/lib/i18n"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: TrendingUp, label: "Forecasts", active: false },
  { icon: BarChart3, label: "Analytics", active: false },
  { icon: Database, label: "Data Sources", active: false },
  { icon: Layers, label: "Integrations", active: false },
  { icon: Activity, label: "Real-time", active: false },
]



export function Sidebar({ 
  isCollapsed,
  setIsCollapsed,
  isHovered,
  setIsHovered,
  user
}: { 
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  isHovered: boolean
  setIsHovered: (hovered: boolean) => void
  user: any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "User")
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const isEffectivelyCollapsed = isCollapsed && !isHovered
  const sidebarWidth = isEffectivelyCollapsed ? "w-16" : "w-64"

  useEffect(() => {
    const handleOpenSidebar = () => {
      setIsOpen(true)
      setIsCollapsed(false)
    }
    window.addEventListener('open-sidebar', handleOpenSidebar)
    return () => window.removeEventListener('open-sidebar', handleOpenSidebar)
  }, [setIsCollapsed])

  useEffect(() => {
    if (!user) return;
    const fetchLatestName = async () => {
      const supabase = createClient()
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).single()
      if (data?.full_name) {
        setDisplayName(data.full_name)
      } else {
        const { data: sessionData } = await supabase.auth.getSession()
        if (sessionData?.session?.user?.user_metadata?.full_name) {
          setDisplayName(sessionData.session.user.user_metadata.full_name)
        }
      }
    }
    fetchLatestName()
  }, [user])

  const handleLogout = async () => {
    // 1. Clear client-side local storage session
    const supabase = createClient()
    await supabase.auth.signOut()
    
    // 2. Clear server-side HTTP cookies
    await logout()
    
    // 3. Hard reload to homepage
    window.location.href = '/'
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isEffectivelyCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-[100dvh] flex-col border-r border-border bg-sidebar transition-all duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full",
          "lg:w-auto"
        )}
        style={{ width: isEffectivelyCollapsed ? 64 : 256 }}
      >
        {/* Logo + Collapse Toggle */}
        <motion.div 
          layout
          className={cn(
            "relative flex h-14 w-full items-center mb-2 px-3 mt-2",
            isEffectivelyCollapsed ? "justify-center" : "justify-center lg:justify-between gap-2"
          )}
        >
          {!isEffectivelyCollapsed && (
            <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hidden lg:block w-8 shrink-0" />
          )}

          <Link href="/dashboard">
            <AnimatePresence mode="wait">
              {isEffectivelyCollapsed ? (
                <motion.img 
                  key="icon"
                  src="/logo-icon.svg" 
                  alt="Bizanolytics Icon" 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="h-5 w-auto object-contain cursor-pointer"
                />
              ) : (
                <motion.img 
                  key="full"
                  src="/logo-full.svg" 
                  alt="Bizanolytics Logo" 
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(4px)" }}
                  transition={{ duration: 0.2 }}
                  className="h-9 w-auto max-w-[160px] object-contain cursor-pointer"
                />
              )}
            </AnimatePresence>
          </Link>
          
          {/* Desktop Toggle */}
          {!isEffectivelyCollapsed && (
            <motion.button
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => {
                setIsCollapsed(true);
                setIsHovered(false);
              }}
              className="hidden lg:flex shrink-0 h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <PanelLeftClose className="h-4 w-4" />
            </motion.button>
          )}
          {/* Mobile Close Button */}
          {!isEffectivelyCollapsed && (
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </motion.div>

        {/* Navigation - Main Items */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-2">
          {!isEffectivelyCollapsed && (
            <div className="flex items-center justify-between mb-2 px-2">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                {t('dashboard')} MENU
              </p>
              <button 
                onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
                className="text-[10px] font-medium px-2 py-0.5 rounded-sm bg-secondary/50 text-foreground hover:bg-secondary transition-colors"
              >
                {language === 'en' ? 'বাংলা' : 'EN'}
              </button>
            </div>
          )}
          <ul className="space-y-1">
            {[
              { icon: LayoutDashboard, label: t('dashboard'), href: "/dashboard" },
              { icon: Database, label: t('data_sources'), href: "/data" },
              { icon: TrendingUp, label: t('forecasts'), href: "/forecasts" },
              { icon: BarChart3, label: t('analytics'), href: "/analytics" },
              { icon: Layers, label: t('integrations'), href: "/integrations" },
              { icon: Activity, label: t('data_pipeline'), href: "/pipeline" },
              { icon: Bell, label: t('notifications'), href: "/notifications" },
              { icon: Settings, label: t('settings'), href: "/settings" },
            ].map((item, index) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    title={isEffectivelyCollapsed ? item.label : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      isEffectivelyCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-foreground")} />
                    {!isEffectivelyCollapsed && (
                      <>
                        <span>{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="activeIndicator"
                            className="ml-auto h-1.5 w-1.5 rounded-full bg-foreground"
                          />
                        )}
                      </>
                    )}
                  </Link>
                </motion.li>
              );
            })}
          </ul>

        </nav>



        {/* User Profile / Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="relative border-t border-border p-3"
        >
          {user ? (
            <Link href="/profile" className={cn(
              "flex items-center gap-2.5 rounded-xl p-2 transition-all hover:bg-secondary group cursor-pointer",
              isEffectivelyCollapsed && "justify-center p-0"
            )}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground ring-1 ring-border shrink-0">
                {displayName.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              {!isEffectivelyCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">{displayName}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                </div>
              )}
              {!isEffectivelyCollapsed && (
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                  <button onClick={(e) => { e.preventDefault(); handleLogout(); }} className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-colors" title="Log out">
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              )}
            </Link>
          ) : (
            <Link 
              href="/login"
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary/90 transition-colors text-primary-foreground font-medium",
                isEffectivelyCollapsed ? "h-9 w-9 p-0" : "w-full py-2.5 px-4 text-sm"
              )}
              title={isEffectivelyCollapsed ? "Log In" : undefined}
            >
              <div className={cn(isEffectivelyCollapsed && "flex items-center justify-center")}>
                <LogOut className="h-4 w-4 rotate-180" />
              </div>
              {!isEffectivelyCollapsed && <span>Log in</span>}
            </Link>
          )}
        </motion.div>
      </motion.aside>
    </>
  )
}
