"use client"

import { useState } from "react"
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
} from "lucide-react"
import { cn } from "@/lib/utils"

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
  user
}: { 
  isCollapsed: boolean
  setIsCollapsed: (collapsed: boolean) => void
  user: any
}) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const sidebarWidth = isCollapsed ? "w-16" : "w-64"

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </motion.button>

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
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1, width: isCollapsed ? 64 : 256 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-border bg-sidebar transition-all duration-300 lg:translate-x-0",
          isOpen ? "translate-x-0 w-64" : "-translate-x-full",
          "lg:w-auto"
        )}
        style={{ width: isCollapsed ? 64 : 256 }}
      >
        {/* Logo + Collapse Toggle */}
        <div className={cn(
          "relative flex h-14 items-center px-3 mb-2",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary"
              >
                <BarChart3 className="h-4 w-4 text-foreground" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="text-base font-semibold tracking-tight text-foreground overflow-hidden whitespace-nowrap"
              >
                Bizanolytics
              </motion.span>
            </div>
          )}
          
          {/* Desktop Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex shrink-0 h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            {isCollapsed ? (
              <Menu className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </button>
          
          {/* Mobile Close Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsOpen(false)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground lg:hidden"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search - only show when not collapsed */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative px-3 py-2 overflow-hidden"
            >
              <div className="flex items-center gap-2.5 rounded-xl bg-secondary px-3 py-2.5">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Search...</span>
                <kbd className="ml-auto rounded bg-background px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  /
                </kbd>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation - Main Items */}
        <nav className="relative flex-1 overflow-y-auto px-3 py-2">
          {!isCollapsed && (
            <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Main Menu
            </p>
          )}
          <ul className="space-y-1">
            {[
              { icon: LayoutDashboard, label: "Dashboard", href: "/" },
              { icon: Database, label: "Data Sources", href: "/data" },
              { icon: TrendingUp, label: "Forecasts", href: "/forecasts" },
              { icon: BarChart3, label: "Analytics", href: "/analytics" },
              { icon: Layers, label: "Integrations", href: "/integrations" },
              { icon: Activity, label: "Data Pipeline", href: "/pipeline" },
            ].map((item, index) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
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
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4 shrink-0", isActive && "text-foreground")} />
                    {!isCollapsed && (
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
            <div className={cn(
              "flex items-center gap-2.5 rounded-xl p-2 transition-all hover:bg-secondary group cursor-pointer",
              isCollapsed && "justify-center p-0"
            )}>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/10 text-xs font-semibold text-emerald-500 ring-1 ring-emerald-500/20 shrink-0">
                {user.user_metadata?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
              </div>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-foreground">{user.user_metadata?.full_name || "User"}</p>
                  <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
                </div>
              )}
              {/* Optional: Add a hidden logout button that shows on hover */}
              {!isCollapsed && (
                <form action="/login/actions" method="POST" className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4">
                  {/* Need to import logout action properly if doing it this way, or handle via Client Component */}
                </form>
              )}
            </div>
          ) : (
            <Link 
              href="/login"
              className={cn(
                "flex items-center justify-center gap-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-white font-medium",
                isCollapsed ? "h-9 w-9 p-0" : "w-full py-2.5 px-4 text-sm"
              )}
              title={isCollapsed ? "Log In" : undefined}
            >
              <div className={cn(isCollapsed && "flex items-center justify-center")}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>
              </div>
              {!isCollapsed && <span>Log in / Sign up</span>}
            </Link>
          )}
        </motion.div>
      </motion.aside>
    </>
  )
}
