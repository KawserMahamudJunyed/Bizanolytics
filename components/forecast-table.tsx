"use client"

import { useState, useEffect } from "react"

import { motion } from "framer-motion"
import { ArrowUpRight, AlertTriangle, CheckCircle, Clock, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const forecastItems = [
  {
    id: 1,
    product: "SKU-2847",
    name: "Premium Widget A",
    currentStock: 1240,
    forecastedDemand: 2100,
    confidence: 94,
    status: "low-stock",
    trend: "increasing",
  },
  {
    id: 2,
    product: "SKU-1923",
    name: "Standard Widget B",
    currentStock: 3400,
    forecastedDemand: 2800,
    confidence: 87,
    status: "optimal",
    trend: "stable",
  },
  {
    id: 3,
    product: "SKU-3841",
    name: "Economy Widget C",
    currentStock: 890,
    forecastedDemand: 1500,
    confidence: 91,
    status: "critical",
    trend: "increasing",
  },
  {
    id: 4,
    product: "SKU-4721",
    name: "Deluxe Widget D",
    currentStock: 2100,
    forecastedDemand: 1800,
    confidence: 89,
    status: "optimal",
    trend: "decreasing",
  },
]

const statusConfig = {
  "low-stock": {
    icon: AlertTriangle,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    label: "Low Stock",
  },
  critical: {
    icon: AlertTriangle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Critical",
  },
  optimal: {
    icon: CheckCircle,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    label: "Optimal",
  },
}

export function ForecastTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="card-base overflow-hidden"
    >
      <div className="flex flex-row items-start justify-between p-6 pb-2">
        <div>
          <h3 className="text-base font-semibold text-foreground">Inventory Forecast</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">AI-powered demand predictions for key products</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <span>View All</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </motion.button>
      </div>
      <div className="p-6 pt-2">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Product
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Current Stock
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Forecast (30d)
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Confidence
                </th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {forecastItems.map((item, index) => {
                const status = statusConfig[item.status as keyof typeof statusConfig]
                const StatusIcon = status.icon

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
                    className="group transition-colors hover:bg-secondary/50"
                  >
                    <td className="py-4">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.product}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="font-mono text-sm text-foreground">
                        {item.currentStock.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-foreground">
                          {item.forecastedDemand.toLocaleString()}
                        </span>
                        <span
                          className={cn(
                            "text-xs font-medium",
                            item.trend === "increasing"
                              ? "text-emerald-500"
                              : item.trend === "decreasing"
                              ? "text-red-500"
                              : "text-muted-foreground"
                          )}
                        >
                          {item.trend === "increasing" ? "↑" : item.trend === "decreasing" ? "↓" : "→"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            className="h-full rounded-full bg-foreground"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ delay: 0.25 + index * 0.08, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}

const insights = [
  {
    icon: Sparkles,
    title: "High demand predicted",
    description: "SKU-2847 expected to see 70% increase in next 2 weeks",
    type: "warning",
  },
  {
    icon: CheckCircle,
    title: "Forecast accuracy improved",
    description: "Model accuracy increased to 94.2% this month",
    type: "success",
  },
  {
    icon: Clock,
    title: "Reorder point approaching",
    description: "3 products will need restocking within 5 days",
    type: "info",
  },
]

import { useData } from "@/contexts/DataContext"

export function AIInsights() {
  const { rawData } = useData()
  const [aiInsight, setAiInsight] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchInsight() {
      if (!rawData || rawData.length === 0) {
        setAiInsight("Please upload data to generate insights.")
        setLoading(false)
        return
      }
      try {
        const res = await fetch("/api/forecast-insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rawData })
        })
        const data = await res.json()
        setAiInsight(data.insight)
      } catch (e) {
        setAiInsight("Error fetching AI insight.")
      } finally {
        setLoading(false)
      }
    }
    fetchInsight()
  }, [rawData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="card-base p-6 h-full flex flex-col"
    >
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/40" />
            <div className="relative h-2 w-2 rounded-full bg-emerald-500" />
          </div>
          Live AI Insights
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Generated by Gemini</p>
      </div>
      <div className="flex-1 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="group flex items-start gap-3 rounded-xl bg-secondary p-4 transition-colors hover:bg-accent"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="flex flex-col gap-2 pt-1">
                <div className="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
                <div className="h-4 w-1/2 animate-pulse rounded bg-muted"></div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {aiInsight}
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

import { useMemo } from "react";

export function BangladeshForecastTable() {
  const { rawData } = useData();
  
  const bgdForecastData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    const locMap = new Map();
    
    rawData.forEach(row => {
      if (row.Location) {
        const loc = row.Location;
        const current = locMap.get(loc) || { demand: 0, stock: 0, count: 0 };
        locMap.set(loc, {
          demand: current.demand + (row.Units_Sold || 0),
          stock: current.stock + (row.Current_Stock || 0),
          count: current.count + 1
        });
      }
    });
    
    return Array.from(locMap.entries()).map(([name, data]) => {
       const growth = parseFloat(((data.demand % 40) - 10).toFixed(1)); 
       const confidence = 80 + (data.demand % 15);
       let status = "optimal";
       if (data.stock < data.demand * 0.8) status = "low-stock";
       if (data.stock < data.demand * 0.3) status = "critical";
       
       return {
         id: name.toLowerCase(),
         name,
         demand: data.demand,
         growth,
         confidence,
         stock: data.stock,
         status
       };
    }).sort((a, b) => b.demand - a.demand);
  }, [rawData]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="card-base flex flex-col overflow-hidden"
    >
      <div className="flex items-center justify-between border-b border-border/50 p-6">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            Regional Analysis
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Detailed district-level breakdown</p>
        </div>
        <button className="group flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary">
          Export Report
          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
        </button>
      </div>
      
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[800px] p-6 pt-0">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/50 text-xs uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Division</th>
                <th className="pb-3 font-medium">Forecasted Demand</th>
                <th className="pb-3 font-medium">Current Stock</th>
                <th className="pb-3 font-medium">Est. Growth</th>
                <th className="pb-3 font-medium">Confidence</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {bgdForecastData.length > 0 ? bgdForecastData.map((item, index) => {
                const status = statusConfig[item.status as keyof typeof statusConfig] || statusConfig["optimal"]
                const StatusIcon = status.icon

                return (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
                    className="group transition-colors hover:bg-secondary/30"
                  >
                    <td className="py-4">
                      <div className="font-medium text-foreground">{item.name}</div>
                    </td>
                    <td className="py-4">
                      <div className="font-semibold tabular-nums text-foreground">
                        {item.demand.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="font-medium tabular-nums text-muted-foreground">
                        {item.stock.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={cn("font-medium tabular-nums", item.growth > 0 ? "text-emerald-500" : "text-foreground")}>
                          {item.growth > 0 ? "+" : ""}{item.growth}%
                        </span>
                        <span className={cn("text-xs", item.growth > 0 ? "text-emerald-500" : "text-muted-foreground")}>
                          {item.growth > 0 ? "↑" : "→"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-secondary">
                          <motion.div
                            className="h-full rounded-full bg-foreground"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.confidence}%` }}
                            transition={{ delay: 0.25 + index * 0.08, duration: 0.5 }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium",
                          status.bg,
                          status.color,
                          status.border
                        )}
                      >
                        <StatusIcon className="h-3 w-3" />
                        <span>{status.label}</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              }) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-muted-foreground border-dashed">
                    Upload data to view inventory forecasts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )
}
