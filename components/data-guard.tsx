"use client"

import { useData } from "@/contexts/DataContext"
import { DataUpload } from "@/components/data-upload"
import { motion } from "framer-motion"
import { FileSearch } from "lucide-react"

export function DataGuard({ children }: { children: React.ReactNode }) {
  const { isDataUploaded, loading } = useData()

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    )
  }

  if (!isDataUploaded) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[80vh] flex-col items-center justify-center p-6"
      >
        <div className="mb-8 text-center max-w-lg">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileSearch className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Awaiting Data Source</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The Bizanolytics intelligence engine requires raw sales data to generate forecasts, metrics, and AI insights. Please connect a data source to unlock the dashboard.
          </p>
        </div>
        
        <div className="w-full max-w-2xl">
          <DataUpload />
        </div>
      </motion.div>
    )
  }

  return <>{children}</>
}
