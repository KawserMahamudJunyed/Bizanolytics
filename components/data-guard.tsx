"use client"

import { useData } from "@/contexts/DataContext"
import { DataUpload } from "@/components/data-upload"
import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"

import { usePathname } from "next/navigation"

export function DataGuard({ children }: { children: React.ReactNode }) {
  const { isDataUploaded } = useData()
  const pathname = usePathname()

  if (pathname.startsWith('/integrations') || pathname.startsWith('/profile') || pathname.startsWith('/settings')) {
    return <>{children}</>
  }

  if (!isDataUploaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[80vh] flex-col items-center justify-center p-6"
      >
        <div className="mb-8 text-center max-w-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileSearch className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Awaiting Data Source</h2>
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
            The Bizanolytics intelligence engine requires raw sales data to generate forecasts, metrics, and AI insights. 
            <strong> Upload a CSV file OR Connect an Integration</strong> (Shopify, POS, etc.) to instantly view your insights.
          </p>
        </div>
        
        <div className="w-full max-w-2xl space-y-6">
          <DataUpload />
          
          <div className="flex items-center gap-4 py-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">OR</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <div className="text-center">
            <a 
              href="/integrations" 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors shadow-sm border border-border"
            >
              Go to Integrations Hub
            </a>
          </div>
        </div>
      </motion.div>
    )
  }

  return <>{children}</>
}
