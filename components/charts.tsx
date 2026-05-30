"use client"

import { motion } from "framer-motion"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { ArrowUpRight } from "lucide-react"

const demandData = [
  { month: "Jan", actual: 4200, forecast: 4000 },
  { month: "Feb", actual: 4800, forecast: 4600 },
  { month: "Mar", actual: 5200, forecast: 5100 },
  { month: "Apr", actual: 4900, forecast: 5000 },
  { month: "May", actual: 5600, forecast: 5400 },
  { month: "Jun", actual: 6100, forecast: 5900 },
  { month: "Jul", actual: null, forecast: 6200 },
  { month: "Aug", actual: null, forecast: 6500 },
  { month: "Sep", actual: null, forecast: 6800 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-3 shadow-lg"
      >
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium text-foreground">
              {entry.value?.toLocaleString() ?? "—"}
            </span>
          </div>
        ))}
      </motion.div>
    )
  }
  return null
}

export function DemandForecastChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="group h-full"
    >
      <div className="card-base glossy p-6 flex flex-col h-full">
        <div className="flex items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">
              Demand Forecast
            </h3>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Actual vs. predicted demand over time
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary/80"
          >
            <span>View Details</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </motion.button>
        </div>
        
        <div className="min-h-[280px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={demandData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--muted-foreground)" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="var(--muted-foreground)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual"
                stroke="var(--foreground)"
                strokeWidth={2}
                fill="url(#actualGradient)"
                dot={{ fill: "var(--foreground)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "var(--foreground)", strokeWidth: 2, fill: "var(--background)" }}
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="forecast"
                name="Forecast"
                stroke="var(--muted-foreground)"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#forecastGradient)"
                dot={{ fill: "var(--muted-foreground)", strokeWidth: 0, r: 2 }}
                activeDot={{ r: 4, stroke: "var(--muted-foreground)", strokeWidth: 2, fill: "var(--background)" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-foreground" />
            <span className="text-sm text-muted-foreground">Actual Demand</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-muted-foreground" />
            <span className="text-sm text-muted-foreground">Forecasted</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const channelData = [
  { channel: "Direct", value: 4200 },
  { channel: "Retail", value: 3800 },
  { channel: "Online", value: 5600 },
  { channel: "Wholesale", value: 2900 },
  { channel: "Partners", value: 2100 },
]

export function ChannelPerformanceChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="group h-full"
    >
      <div className="card-base glossy p-6 flex flex-col h-full">
        <div className="pb-4">
          <h3 className="text-base font-semibold text-foreground">
            Channel Performance
          </h3>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Sales distribution by channel
          </p>
        </div>
        
        <div className="min-h-[280px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={channelData}
              layout="vertical"
              margin={{ top: 0, right: 20, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                horizontal={false}
              />
              <XAxis
                type="number"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              />
              <YAxis
                type="category"
                dataKey="channel"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                width={70}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                name="Sales"
                fill="var(--foreground)"
                radius={[0, 6, 6, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
