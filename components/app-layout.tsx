"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { DataGuard } from "@/components/data-guard"
import { DataChatbot } from "@/components/data-chatbot"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"

import { AlertCircle } from "lucide-react"

export function AppLayout({ children, user: serverUser }: { children: React.ReactNode, user: any }) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const pathname = usePathname()
  const [user, setUser] = useState(serverUser)

  useEffect(() => {
    const supabase = createClient()
    
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (pathname === '/login' || pathname === '/signup') {
    return <div className="min-h-screen bg-background">{children}</div>
  }

  return (
    <div className="relative flex min-h-screen bg-background">
      <Sidebar 
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        user={user}
      />

      <main className={cn(
        "relative z-10 flex flex-col min-w-0 flex-1 transition-all duration-300",
        (isCollapsed && !isHovered) ? "lg:pl-16" : "lg:pl-64"
      )}>
        <Header />

        {!user && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-3 flex items-center gap-3 text-sm text-amber-500">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>
              <strong>You are not logged in.</strong> Your data is stored in memory and will vanish upon reload. <a href="/login" className="underline font-medium hover:text-amber-400">Log in</a> to save your analysis permanently.
            </p>
          </div>
        )}

        <div className="p-6 lg:p-8 min-w-0 w-full flex-1">
          <DataGuard>
            {children}
          </DataGuard>
        </div>
      </main>
      <DataChatbot />
    </div>
  )
}
