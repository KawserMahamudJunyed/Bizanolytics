"use client"

import { motion } from "framer-motion"
import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricCardProps {
  title: string
  value: string
  change: number
  changeLabel: string
  icon: React.ReactNode
  delay?: number
}

export function MetricCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  delay = 0,
}: MetricCardProps) {
  const isPositive = change >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <div className="card-base relative overflow-hidden p-5">
        {/* Header with icon and title */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
            {icon}
          </div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
        </div>
        
        {/* Value */}
        <motion.p
          className="mt-4 text-2xl font-semibold tracking-tight text-foreground"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.15, duration: 0.3 }}
        >
          {value}
        </motion.p>
        
        {/* Change indicator */}
        <motion.div
          className="mt-2 flex items-center gap-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: delay + 0.25, duration: 0.3 }}
        >
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              isPositive ? "text-emerald-500" : "text-red-500"
            )}
          >
            {isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{isPositive ? "+" : ""}{change}%</span>
          </div>
          <span className="text-xs text-muted-foreground">{changeLabel}</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

interface MetricsGridProps {
  metrics: Omit<MetricCardProps, "delay">[]
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard 
          key={metric.title} 
          {...metric} 
          delay={0.1 + index * 0.08}
        />
      ))}
    </div>
  )
}
