"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataGuard } from "@/components/data-guard"
import { DataChatbot } from "@/components/data-chatbot"
import { cn } from "@/lib/utils"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      <main className={cn(
        "relative z-10 flex-1 transition-all duration-300",
        isCollapsed ? "lg:pl-16" : "lg:pl-64"
      )}>
        <Header />

        <div className="p-6 lg:p-8">
          <DataGuard>
            {children}
          </DataGuard>
        </div>
      </main>
      <DataChatbot />
    </div>
  )
}
