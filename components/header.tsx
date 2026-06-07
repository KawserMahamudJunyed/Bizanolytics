"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Edit2, Check, X, Database, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
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

export function Header() {
  const { datasetId, datasetHistory, loadDatasetById, renameDataset, resetData, activeIntegrationName, notifications, unreadNotificationsCount, markNotificationAsRead, markAllNotificationsAsRead } = useData()
  const [isRenaming, setIsRenaming] = useState(false)
  const [editName, setEditName] = useState("")

  const hour = new Date().getHours()
  let greeting = "Good evening"
  if (hour >= 5 && hour < 12) greeting = "Good morning"
  else if (hour >= 12 && hour < 17) greeting = "Good afternoon"

  const activeDataset = datasetHistory.find(d => d.id === datasetId)

  const handleRenameStart = () => {
    if (activeDataset) {
      setEditName(activeDataset.file_name)
      setIsRenaming(true)
    }
  }

  const handleRenameSave = () => {
    if (datasetId && editName.trim()) {
      renameDataset(datasetId, editName.trim())
    }
    setIsRenaming(false)
  }

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-30 flex min-h-[80px] items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md lg:px-8"
    >
      <div className="flex flex-col gap-1 pt-2 lg:pt-0">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          {greeting}!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          Ready to analyze. Here's your forecast overview.
        </motion.p>
      </div>

      {datasetHistory.length > 0 && (
        <div className="flex items-center gap-2">
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
                  <span className="truncate max-w-[150px]">
                    {activeIntegrationName ? `🟢 ${activeIntegrationName}` : activeDataset ? activeDataset.file_name : "Select Dataset"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Live Integrations</DropdownMenuLabel>
                {activeIntegrationName ? (
                  <DropdownMenuItem className="flex justify-between items-center cursor-default text-emerald-500">
                    <span className="truncate flex-1 pr-2">🟢 {activeIntegrationName}</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem className="text-muted-foreground cursor-default">
                    No active integration
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Your Datasets</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {datasetHistory.map((dataset) => (
                  <DropdownMenuItem 
                    key={dataset.id}
                    onClick={() => loadDatasetById(dataset.id)}
                    className="flex justify-between items-center cursor-pointer"
                  >
                    <span className="truncate flex-1 pr-2">{dataset.file_name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{formatTimeAgo(dataset.created_at)}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={resetData} className="cursor-pointer text-primary">
                  <Plus className="w-4 h-4 mr-2" /> Upload New Dataset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {activeDataset && !isRenaming && (
            <Button variant="ghost" size="icon" onClick={handleRenameStart} className="h-9 w-9" title="Rename Dataset">
              <Edit2 className="w-4 h-4 text-muted-foreground" />
            </Button>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 relative">
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border border-background"></span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-2 py-1.5">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {unreadNotificationsCount > 0 && (
                  <button 
                    onClick={markAllNotificationsAsRead}
                    className="text-xs text-primary hover:underline"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="flex flex-col gap-1 p-1 max-h-[300px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 text-center">No notifications yet.</p>
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
                        <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                        {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary mt-1 shrink-0"></span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] font-medium text-muted-foreground/70 mt-2">{formatTimeAgo(notif.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </motion.header>
  )
}
