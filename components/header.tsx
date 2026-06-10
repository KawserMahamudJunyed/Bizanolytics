"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Check, X, Database, Bell, Menu } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { useLanguage } from "@/contexts/LanguageContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function formatTimeAgo(dateStr: string) {
  const date = new Date(dateStr)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function Header({ isCollapsed, user }: { isCollapsed?: boolean, user?: any }) {
  const router = useRouter()
  const { 
    datasetId,
    datasetHistory,
    integrationHistory,
    activeIntegrationName,
    setActiveIntegrationName,
    connectedIntegrationName,
    loadIntegrationData,
    loadIntegrationByPlatform,
    renameIntegration,
    loadDatasetById,
    renameDataset,
    resetData,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead 
  } = useData()
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hour = new Date().getHours()
  let greetingKey: 'good_evening' | 'good_morning' | 'hi' | 'hello' = 'good_evening'
  if (hour >= 5 && hour < 12) greetingKey = "good_morning"
  else if (hour >= 12 && hour < 17) greetingKey = "hi"
  else if (hour >= 21 || hour < 5) greetingKey = "hello"

  const greetingStr = mounted ? t(greetingKey) : ''
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
  const displayGreeting = mounted ? (firstName ? `${greetingStr}, ${firstName}!` : `${greetingStr}!`) : ''

  // System emergency message override
  const emergencyMessage = null; // Set this string to broadcast an emergency message to all users
  const finalGreeting = emergencyMessage ? emergencyMessage : displayGreeting

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-30 w-full flex flex-wrap min-h-[80px] items-center justify-between gap-4 border-b border-border bg-background/80 py-4 backdrop-blur-md px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col gap-1">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className={cn("text-2xl font-semibold tracking-tight", emergencyMessage ? "text-red-500" : "text-foreground")}
        >
          {finalGreeting}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {t('dashboard_subtitle')}
        </motion.p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2 shrink-0">
          {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 shrink-0 relative">
                  <Bell className="w-4 h-4 text-muted-foreground" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border border-background"></span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <DropdownMenuLabel className="p-0">{t('notifications')}</DropdownMenuLabel>
                  {unreadNotificationsCount > 0 && (
                    <button 
                      onClick={markAllNotificationsAsRead}
                      className="text-xs text-primary hover:underline"
                    >
                      {t('mark_all_read')}
                    </button>
                  )}
                </div>
                <DropdownMenuSeparator />
                <div className="flex flex-col gap-1 p-1 max-h-[300px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground p-4 text-center">{t('no_notifications')}</p>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif.id}
                        onClick={() => !notif.is_read && markNotificationAsRead(notif.id)}
                        className={cn(
                          "rounded-lg p-3 transition-colors cursor-pointer border",
                          notif.is_read 
                            ? "bg-transparent border-transparent hover:bg-secondary/50" 
                            : "bg-primary/5 border-primary/20 hover:bg-primary/10"
                        )}
                      >
                        <div className="flex justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {notif.title === "Data Upload Successful" ? t('notif_upload_success_title') : 
                             notif.title === "AI Forecast Generated" ? t('notif_ai_forecast_title') : 
                             notif.title}
                          </p>
                          {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0"></span>}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                          {notif.message === "Your new business forecast and AI insights are ready to view." ? t('notif_ai_forecast_msg') :
                           notif.message.startsWith("Successfully processed and imported") ? t('notif_upload_success_msg') :
                           notif.message}
                        </p>
                        <p className="text-[10px] font-medium text-muted-foreground/70 mt-2">{formatTimeAgo(notif.created_at)}</p>
                      </div>
                    ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile / Desktop Expand Button */}
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => window.dispatchEvent(new Event('open-sidebar'))} 
              className={cn("h-9 w-9 shrink-0 ml-1", !isCollapsed && "lg:hidden")}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
    </motion.header>
  )
}
