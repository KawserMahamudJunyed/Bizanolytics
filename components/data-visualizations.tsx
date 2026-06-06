"use client"

import React, { useMemo } from "react"
import { motion } from "framer-motion"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { formatCurrency, CURRENCY_SYMBOLS, CurrencyCode } from "@/utils/currency"

// Removed static rawDemandData, regionData, and sparklineData

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-lg font-semibold text-foreground">
          {formatCurrency(payload[0].value, payload[0].payload?.userCurrency || "BDT")}
        </p>
      </div>
    )
  }
  return null
}

// Simple sparkline component
function Sparkline({ data, color = "var(--foreground)" }: { data: number[]; color?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const height = 28
  const width = 80
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((value - min) / range) * height
    return `${x},${y}`
  }).join(" ")

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Regional Distribution Pie Chart
export function RegionalDistribution() {
  const { rawData, isDataUploaded, userCurrency } = useData()

  const dynamicRegionData = useMemo(() => {
    if (!isDataUploaded || !rawData || !rawData.length) return [];

    const grouped: Record<string, number> = {}
    rawData.forEach((row: any) => {
      const loc = row.Location || "Unknown"
      grouped[loc] = (grouped[loc] || 0) + (row.Revenue_BDT || 0)
    })

    const colors = [
      "#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899",
      "#14b8a6", "#f97316", "#6366f1", "#84cc16", "#0ea5e9", "#d946ef",
      "#f43f5e", "#06b6d4", "#22c55e", "#a855f7", "#eab308", "#64748b",
      "#71717a", "#dc2626", "#ea580c", "#d97706", "#65a30d", "#16a34a",
      "#059669", "#0891b2", "#0284c7", "#2563eb", "#4f46e5", "#7c3aed",
      "#9333ea", "#c026d3", "#db2777", "#e11d48"
    ]

    return Object.entries(grouped)
      .sort((a, b) => b[1] - a[1]) // highest first
      .map(([name, value], idx) => ({
        name,
        value,
        fill: colors[idx % colors.length],
        userCurrency
      }))
  }, [rawData, isDataUploaded, userCurrency])

  const total = dynamicRegionData.reduce((sum, r) => sum + r.value, 0) || 1 // fallback to 1 to avoid NaN

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Regional Distribution</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Revenue breakdown by geographic region</p>
        </div>
        <div className="flex flex-col items-center gap-8 flex-1 justify-center">
        <div className="h-[180px] w-[180px] flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dynamicRegionData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {dynamicRegionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-full space-y-3 px-4">
          {dynamicRegionData.map((region, index) => (
            <motion.div
              key={region.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full" style={{ backgroundColor: region.fill }} />
                <span className="text-sm font-medium text-foreground truncate max-w-[80px]" title={region.name}>{region.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {formatCurrency(region.value, userCurrency)}
                </span>
                <span className="w-12 text-right text-xs text-muted-foreground">
                  {((region.value / total) * 100).toFixed(0)}%
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      </div>
    </motion.div>
  )
}

// Regional Performance with Sparklines
export function RegionalPerformance() {
  const { rawData } = useData();
  
  const regions = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];
    
    const locMap = new Map();
    // Group by location and date to generate sparkline data
    rawData.forEach(row => {
      const loc = row.Location || "Unknown";
      const date = row.Date || "Unknown";
      
      if (!locMap.has(loc)) {
        locMap.set(loc, { totalValue: 0, dateMap: new Map() });
      }
      
      const locData = locMap.get(loc);
      locData.totalValue += (row.Revenue_BDT || 0);
      locData.dateMap.set(date, (locData.dateMap.get(date) || 0) + (row.Revenue_BDT || 0));
    });
    
    return Array.from(locMap.entries())
      .map(([name, data]) => {
        const sortedDates = Array.from(data.dateMap.entries())
          .sort((a: any, b: any) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        const sparkData = sortedDates.map((d: any) => d[1] as number);
        const change = sparkData.length >= 2 
          ? (((sparkData[sparkData.length - 1] - sparkData[0]) / (sparkData[0] || 1)) * 100) 
          : 0;
          
        return {
          name,
          value: data.totalValue,
          change: parseFloat(change.toFixed(1)),
          data: sparkData.length > 0 ? sparkData : [0, 0]
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 4); // Show top 4 regions
  }, [rawData]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="card-base p-6"
    >
      <div className="mb-4">
        <h3 className="text-base font-semibold text-foreground">Regional Performance</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">8-week revenue trend by region</p>
      </div>
      <div className="space-y-4">
        {regions.map((region, index) => (
          <motion.div
            key={region.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 + index * 0.05, duration: 0.3 }}
            className="flex items-center justify-between rounded-xl bg-secondary p-4"
          >
            <div className="flex items-center gap-4">
              <div className="w-14">
                <p className="text-sm font-semibold text-foreground">{region.name}</p>
              </div>
              <Sparkline data={region.data} color={region.change >= 0 ? "#22c55e" : "#ef4444"} />
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm font-bold tabular-nums text-foreground">
                {formatCurrency(region.value, userCurrency)}
              </span>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium tabular-nums",
                region.change >= 0 ? "text-emerald-500" : "text-red-500"
              )}>
                {region.change >= 0 ? (
                  <ArrowUp className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDown className="h-3.5 w-3.5" />
                )}
                {Math.abs(region.change)}%
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// Raw Data Table
export function RawDataTable() {
  const { rawData, isDataUploaded, userCurrency } = useData();
  const displayData = isDataUploaded && rawData.length > 0 ? rawData : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="card-base overflow-hidden"
    >
      <div className="flex flex-row items-start justify-between p-6 pb-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">Raw Demand Data</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Transaction-level data with {displayData.length} records
          </p>
          <div className="mt-2 flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-1 w-fit">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] font-medium text-emerald-500">
              Green columns are dynamically calculated in real-time based on your uploaded data
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Filter className="h-4 w-4" />
            Filter
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 rounded-lg bg-foreground px-3 py-2 text-sm font-medium text-background"
          >
            <Download className="h-4 w-4" />
            Export
          </motion.button>
        </div>
      </div>
      <div className="px-6 pb-6">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-secondary">
              <tr>
                {[
                  { name: "Date", generated: false },
                  { name: "Region", generated: false },
                  { name: "ID", generated: false },
                  { name: "Product", generated: false },
                  { name: "Category", generated: false },
                  { name: "Channel", generated: false },
                  { name: "Segment", generated: false },
                  { name: "Units", generated: false },
                  { name: "Price", generated: false },
                  { name: "Cost", generated: false },
                  { name: "Revenue", generated: false },
                  { name: "Stock", generated: false },
                  { name: "Profit", generated: true },
                  { name: "Margin", generated: true },
                  { name: "Stock Value", generated: true },
                  { name: "Stock Ratio", generated: true },
                ].map((col) => (
                  <th key={col.name} className="px-4 py-3 text-left">
                    <button className={cn(
                      "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground",
                      col.generated ? "text-emerald-500 hover:text-emerald-400" : "text-muted-foreground"
                    )}>
                      {col.name}
                      <ArrowUpDown className="h-3 w-3" />
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {displayData.slice(0, 100).map((row: any, index: number) => (
                <motion.tr
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.15 + (index % 10) * 0.02, duration: 0.2 }}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  {(() => {
                    const revenue = Number(row.Revenue_BDT || row.revenue || 0);
                    const cost = Number(row.Cost_Price || row.cost || 0);
                    const units = Number(row.Units_Sold || row.units || 0);
                    const stock = Number(row.Current_Stock || 0);
                    
                    // Generated calculations
                    let marginVal = row.margin;
                    if (marginVal === undefined && revenue > 0) {
                      marginVal = parseFloat((((revenue - cost) / revenue) * 100).toFixed(1));
                    }
                    const profit = revenue - cost;
                    const stockValue = stock * cost;
                    const stockRatio = units > 0 ? (stock / units).toFixed(1) : "N/A";

                    return (
                      <>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{row.Date || row.date}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
                            {row.Location || row.region}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">{row.Product_ID || "N/A"}</td>
                        <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{row.Product_Name || row.product}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.Category || "N/A"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.Sales_Channel || "N/A"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{row.Customer_Segment || "N/A"}</td>
                        <td className="px-4 py-3 font-mono tabular-nums text-foreground">{units.toLocaleString()}</td>
                        <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">{formatCurrency(Number(row.Unit_Price || 0), userCurrency)}</td>
                        <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">{formatCurrency(cost, userCurrency)}</td>
                        <td className="px-4 py-3 font-mono tabular-nums text-foreground">{formatCurrency(revenue, userCurrency)}</td>
                        <td className="px-4 py-3 font-mono tabular-nums text-muted-foreground">
                          {stock > 0 ? stock.toLocaleString() : "N/A"}
                        </td>
                        {/* Generated Columns */}
                        <td className="px-4 py-3 font-mono tabular-nums text-emerald-500 font-medium">{formatCurrency(profit, userCurrency)}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "font-mono tabular-nums font-medium",
                            marginVal >= 35 ? "text-emerald-500" : "text-emerald-500/70"
                          )}>
                            {marginVal !== undefined ? `${marginVal}%` : "N/A"}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono tabular-nums text-emerald-500/80 font-medium">{formatCurrency(stockValue, userCurrency)}</td>
                        <td className="px-4 py-3 font-mono tabular-nums text-emerald-500/80 font-medium">{stockRatio}x</td>
                      </>
                    )
                  })()}
                </motion.tr>
              ))}
              {displayData.length === 0 && (
                <tr>
                  <td colSpan={16} className="h-24 text-center text-sm text-muted-foreground">
                    Upload data or Connect an Integration to view raw records.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {Math.min(100, displayData.length)} of {displayData.length} records
          </span>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              Previous
            </button>
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
