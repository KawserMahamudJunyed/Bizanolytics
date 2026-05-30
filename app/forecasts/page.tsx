"use client"

import { motion } from "framer-motion"
import { BangladeshMap } from "@/components/bangladesh-map"
import { BangladeshForecastTable } from "@/components/forecast-table"

export default function ForecastsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <div className="card-base p-6">
        <BangladeshMap />
      </div>
      <BangladeshForecastTable />
    </motion.div>
  )
}
