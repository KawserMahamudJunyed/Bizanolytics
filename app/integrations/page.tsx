"use client"

import { motion } from "framer-motion"
import { GitBranch } from "lucide-react"

export default function IntegrationsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex h-[60vh] flex-col items-center justify-center space-y-4"
    >
      <div className="card-base flex h-full w-full max-w-2xl flex-col items-center justify-center p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <GitBranch className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Integrations Hub</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Connect Bizanolytics to your favorite tools, CRMs, and data warehouses.
        </p>
        <div className="mt-6 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-xs font-medium text-foreground">
          Coming Soon
        </div>
      </div>
    </motion.div>
  )
}
