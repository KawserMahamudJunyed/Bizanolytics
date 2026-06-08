"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Check, X, Database, Bell, Menu } from "lucide-react"
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
  const { datasetId, datasetHistory, loadDatasetById, renameDataset, resetData, activeIntegrationName, setActiveIntegrationName, connectedIntegrationName, loadIntegrationData, notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } = useData()
  const { t } = useLanguage()
  const [isRenaming, setIsRenaming] = useState(false)
  const [editName, setEditName] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const hour = new Date().getHours()
  let greetingKey: 'good_evening' | 'good_morning' | 'good_afternoon' | 'good_night' = 'good_evening'
  if (hour >= 5 && hour < 12) greetingKey = "good_morning"
  else if (hour >= 12 && hour < 17) greetingKey = "good_afternoon"
  else if (hour >= 21 || hour < 5) greetingKey = "good_night"

  const greetingStr = mounted ? t(greetingKey) : ''
  const firstName = user?.user_metadata?.full_name?.split(' ')[0]
  const displayGreeting = mounted ? (firstName ? `${greetingStr}, ${firstName}!` : `${greetingStr}!`) : ''

  // System emergency message override
  const emergencyMessage = null; // Set this string to broadcast an emergency message to all users
  const finalGreeting = emergencyMessage ? emergencyMessage : displayGreeting

  const activeDataset = datasetHistory.find(d => d.id === datasetId)

  const handleRenameStart = () => {
    if (activeIntegrationName) {
      setEditName(activeIntegrationName)
      setIsRenaming(true)
    } else if (activeDataset) {
      setEditName(activeDataset.file_name)
      setIsRenaming(true)
    }
  }

  const handleRenameSave = () => {
    if (!editName.trim()) {
      setIsRenaming(false)
      return
    }
    
    if (activeIntegrationName) {
      setActiveIntegrationName(editName.trim())
      const stored = localStorage.getItem("bizanolytics_integration_data")
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (!parsed.business) parsed.business = {}
          parsed.business.name = editName.trim()
          localStorage.setItem("bizanolytics_integration_data", JSON.stringify(parsed))
        } catch(e) {}
      }
    } else if (datasetId) {
      renameDataset(datasetId, editName.trim())
    }
    setIsRenaming(false)
  }

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

      {datasetHistory.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {isRenaming ? (
            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-md border border-border">
              <input 
                type="text" 
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleRenameSave()}
                className="bg-transparent px-2 py-1 text-sm outline-none text-foreground w-48"
                autoFocus
              />
              <button onClick={handleRenameSave} className="p-1 hover:text-emerald-500 transition-colors">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsRenaming(false)} className="p-1 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2 border-dashed">
                  <Database className="w-4 h-4 text-muted-foreground" />
                  <span className="truncate max-w-[150px] flex items-center">
                    {activeIntegrationName ? (
                      <>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mr-2" />
                        {activeIntegrationName}
                      </>
                    ) : activeDataset ? activeDataset.file_name : t('select_dataset')}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>{t('live_integrations')}</DropdownMenuLabel>
                {activeIntegrationName ? (
                  <DropdownMenuItem className="flex justify-between items-center cursor-default text-emerald-500">
                    <span className="truncate flex-1 pr-2 flex items-center">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mr-2" />
                      {activeIntegrationName}
                    </span>
                  </DropdownMenuItem>
                ) : connectedIntegrationName ? (
                  <DropdownMenuItem onClick={loadIntegrationData} className="flex justify-between items-center cursor-pointer text-foreground hover:bg-secondary">
                    <span className="truncate flex-1 pr-2 flex items-center">
                      {connectedIntegrationName}
                    </span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    {t('no_active_integration')}
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => router.push('/integrations')} className="cursor-pointer text-muted-foreground focus:text-emerald-500 focus:bg-emerald-500/10 hover:text-emerald-500 hover:bg-emerald-500/10">
                  <Plus className="w-4 h-4 mr-2" /> {t('connect_new_integration')}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>{t('your_datasets')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {datasetHistory.map((dataset) => {
                  const isDatasetActive = !activeIntegrationName && dataset.id === datasetId;
                  return (
                    <DropdownMenuItem 
                      key={dataset.id}
                      onClick={() => loadDatasetById(dataset.id)}
                      className={cn(
                        "flex justify-between items-center cursor-pointer",
                        isDatasetActive ? "text-emerald-500" : "text-foreground hover:bg-secondary"
                      )}
                    >
                      <span className="truncate flex-1 pr-2 flex items-center">
                        <span className={cn("w-2 h-2 rounded-full shrink-0 mr-2", isDatasetActive ? "bg-emerald-500" : "bg-transparent")} />
                        {dataset.file_name}
                      </span>
                      <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(dataset.created_at)}</span>
                    </DropdownMenuItem>
                  )
                })}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetData} className="cursor-pointer text-muted-foreground focus:text-emerald-500 focus:bg-emerald-500/10 hover:text-emerald-500 hover:bg-emerald-500/10">
                  <Plus className="w-4 h-4 mr-2" /> {t('upload_new_dataset')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {(activeDataset || activeIntegrationName) && !isRenaming && (
              <Button variant="ghost" size="icon" onClick={handleRenameStart} className="h-9 w-9 shrink-0" title="Rename">
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </Button>
            )}

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
      )}
    </motion.header>
  )
}
