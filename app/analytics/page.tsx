"use client"

import { motion } from "framer-motion"
import { AIInsights } from "@/components/forecast-table"
import { TrendAnalysis, ForecastAccuracy, ParetoChart, ProphetForecastChart } from "@/components/analytics"

export default function AnalyticsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <TrendAnalysis />
        </div>
        <div className="flex flex-col h-full gap-6">
          <div className="shrink-0">
            <AIInsights />
          </div>
          <div className="flex-1 min-h-0 *:h-full">
            <ForecastAccuracy />
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ParetoChart />
        <ProphetForecastChart />
      </div>
    </motion.div>
  )
}
