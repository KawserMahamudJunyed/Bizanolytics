"use client"

import { motion } from "framer-motion"
import { useData } from "@/contexts/DataContext"
import { Bell, CheckCircle2, Circle, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

function formatTimeAgoFull(dateStr: string) {
  const date = new Date(dateStr)
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "Just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
  return date.toLocaleDateString()
}

export default function NotificationsPage() {
  const { notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } = useData()
  const { t } = useLanguage()

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-4 pb-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="h-6 w-6 text-foreground" />
            {t('notifications')}
            {unreadNotificationsCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500">
                {unreadNotificationsCount} {t('new')}
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('notifications_desc')}</p>
        </div>
        {unreadNotificationsCount > 0 && (
          <button 
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-2 rounded-xl bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
          >
            <CheckCircle2 className="h-4 w-4" />
            {t('mark_all_read')}
          </button>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="card-base overflow-hidden"
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground">{t('all_caught_up')}</h3>
            <p className="text-muted-foreground mt-1">{t('no_new_notifications')}</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {notifications.map((notif, i) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => !notif.is_read && markNotificationAsRead(notif.id)}
                className={cn(
                  "p-6 flex gap-4 transition-colors cursor-pointer",
                  notif.is_read ? "hover:bg-secondary/50" : "bg-primary/5 hover:bg-primary/10"
                )}
              >
                <div className="pt-1 shrink-0">
                  {notif.is_read ? (
                    <Circle className="h-4 w-4 text-muted-foreground/40" />
                  ) : (
                    <div className="relative">
                      <Circle className="h-4 w-4 text-emerald-500 fill-emerald-500" />
                      <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500 opacity-20"></span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn("text-sm font-medium", notif.is_read ? "text-foreground" : "text-emerald-500")}>
                      {notif.title === "Data Upload Successful" ? t('notif_upload_success_title') : 
                       notif.title === "AI Forecast Generated" ? t('notif_ai_forecast_title') : 
                       notif.title}
                    </p>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0 whitespace-nowrap">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgoFull(notif.created_at)}
                    </span>
                  </div>
                  <p className={cn("text-sm leading-relaxed", notif.is_read ? "text-muted-foreground" : "text-foreground/90")}>
                    {notif.message === "Your new business forecast and AI insights are ready to view." ? t('notif_ai_forecast_msg') :
                     notif.message.startsWith("Successfully processed and imported") ? t('notif_upload_success_msg') :
                     notif.message}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
