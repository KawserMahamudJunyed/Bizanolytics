"use client"

import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Bar,
  Area,
  Legend,
  Cell,
} from "recharts"
import { TrendingUp, Package, AlertTriangle } from "lucide-react"

const historicalData = [
  { date: "Week 1", value: 4200, trend: 4100 },
  { date: "Week 2", value: 4500, trend: 4300 },
  { date: "Week 3", value: 4100, trend: 4500 },
  { date: "Week 4", value: 4800, trend: 4700 },
  { date: "Week 5", value: 5200, trend: 4900 },
  { date: "Week 6", value: 4900, trend: 5100 },
  { date: "Week 7", value: 5500, trend: 5300 },
  { date: "Week 8", value: 5800, trend: 5500 },
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
              {entry.value?.toLocaleString()}
            </span>
          </div>
        ))}
      </motion.div>
    )
  }
  return null
}

export function TrendAnalysis() {
  const averageValue = historicalData.reduce((acc, item) => acc + item.value, 0) / historicalData.length

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between">
        <div className="flex flex-row items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Trend Analysis</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">8-week performance with moving average</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12.4%</span>
          </div>
        </div>
        <div className="min-h-[220px] w-full flex-1 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={historicalData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
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
              <ReferenceLine
                y={averageValue}
                stroke="var(--muted-foreground)"
                strokeDasharray="3 3"
                label={{
                  value: "Avg",
                  position: "right",
                  fill: "var(--muted-foreground)",
                  fontSize: 11,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                name="Actual"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)", strokeWidth: 0, r: 3 }}
                activeDot={{ r: 5, stroke: "var(--chart-1)", strokeWidth: 2, fill: "var(--background)" }}
              />
              <Line
                type="monotone"
                dataKey="trend"
                name="Trend"
                stroke="var(--chart-4)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

const accuracyMetrics = [
  { label: "MAPE", value: "5.8%", description: "Mean Absolute Percentage Error" },
  { label: "RMSE", value: "342", description: "Root Mean Square Error" },
  { label: "Bias", value: "-2.1%", description: "Forecast Bias" },
]

export function ForecastAccuracy() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-foreground">Forecast Accuracy</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Model performance metrics</p>
        </div>
        <div className="space-y-3">
          {accuracyMetrics.map((metric, index) => (
            <motion.div
              key={metric.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.05 + index * 0.08, duration: 0.3 }}
            className="flex items-center justify-between rounded-xl bg-secondary p-3 transition-colors hover:bg-accent"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{metric.label}</p>
              <p className="text-xs text-muted-foreground">{metric.description}</p>
            </div>
            <span className="text-lg font-semibold tabular-nums text-foreground">
              {metric.value}
            </span>
          </motion.div>
        ))}
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.3, duration: 0.3 }}
        className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground"
      >
        <div className="h-2 w-2 rounded-full bg-emerald-500" />
        <span>All metrics within acceptable range</span>
      </motion.div>
      </div>
    </motion.div>
  )
}

import { useData } from "@/contexts/DataContext"

const ParetoTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-3 shadow-lg"
      >
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        <div className="flex items-center gap-2 text-sm mb-1">
          <div className="h-2 w-2 rounded-full bg-purple-500" />
          <span className="text-muted-foreground">Profit:</span>
          <span className="font-medium text-foreground">${payload[0]?.value?.toLocaleString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-muted-foreground">Cumulative:</span>
          <span className="font-medium text-emerald-500">{payload[1]?.value}%</span>
        </div>
      </motion.div>
    )
  }
  return null
}

export function ParetoChart() {
  const { rawData } = useData()
  
  // Calculate category profits dynamically
  const categoryMap = new Map<string, number>()
  rawData.forEach(row => {
    if (row.Category) {
      const current = categoryMap.get(row.Category) || 0
      // Assuming 20% margin for profit calculation for the demo
      categoryMap.set(row.Category, current + (row.Revenue_BDT * 0.2))
    }
  })

  const sortedCategories = Array.from(categoryMap.entries())
    .map(([category, profit]) => ({ category, profit }))
    .sort((a, b) => b.profit - a.profit)

  const totalProfit = sortedCategories.reduce((acc, curr) => acc + curr.profit, 0);
  let currentSum = 0;
  const processedParetoData = sortedCategories.map(item => {
    currentSum += item.profit;
    return {
      ...item,
      cumulativePercent: totalProfit > 0 ? parseFloat(((currentSum / totalProfit) * 100).toFixed(1)) : 0
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between">
        <div className="flex flex-row items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Profit Pareto Analysis</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">80/20 Rule based on product profitability</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-medium text-purple-500">
            <Package className="h-3.5 w-3.5" />
            <span>Top 3 = 84%</span>
          </div>
        </div>
        <div className="min-h-[260px] w-full flex-1 mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={processedParetoData}
              margin={{ top: 20, right: 20, left: -10, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="category" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} angle={-45} textAnchor="end" height={60} />
              <YAxis yAxisId="left" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
              <YAxis yAxisId="right" orientation="right" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}%`} />
              <Tooltip content={<ParetoTooltip />} />
              <ReferenceLine yAxisId="right" y={80} stroke="var(--chart-4)" strokeDasharray="4 4" label={{ value: '80% Threshold', position: 'insideTopLeft', fill: 'var(--chart-4)', fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="profit" name="Profit" radius={[4, 4, 0, 0]}>
                {processedParetoData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index < 3 ? 'var(--primary)' : 'var(--secondary-foreground)'} fillOpacity={index < 3 ? 1 : 0.4} />
                ))}
              </Bar>
              <Line yAxisId="right" type="monotone" dataKey="cumulativePercent" name="Cumulative %" stroke="#a855f7" strokeWidth={2} dot={{ r: 4, fill: "#a855f7", strokeWidth: 0 }} activeDot={{ r: 6, fill: "#a855f7" }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
import { useMemo } from "react";

const ForecastTooltip = ({ active, payload, label, capacity }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isFuture = data.actual === null;
    const needsRestock = data.upper > capacity;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-border bg-card p-3 shadow-lg"
      >
        <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
        
        {isFuture ? (
          <>
            <div className="flex justify-between gap-4 text-sm mb-1">
              <span className="text-muted-foreground flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-chart-4" />Forecast (yhat):</span>
              <span className="font-medium text-foreground">{data.yhat.toLocaleString()}</span>
            </div>
            <div className="flex justify-between gap-4 text-sm mb-2">
              <span className="text-muted-foreground flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-chart-4 opacity-30" />Uncertainty Interval:</span>
              <span className="font-medium text-muted-foreground">[{data.lower.toLocaleString()}, {data.upper.toLocaleString()}]</span>
            </div>
            {needsRestock && (
              <div className="mt-2 rounded bg-amber-500/10 px-2 py-1 flex items-center gap-1.5 text-xs text-amber-500 font-medium">
                <AlertTriangle className="h-3 w-3" /> Restock Recommended
              </div>
            )}
          </>
        ) : (
          <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" />Actual Demand:</span>
            <span className="font-medium text-foreground">{data.actual.toLocaleString()}</span>
          </div>
        )}
      </motion.div>
    )
  }
  return null
}

export function DemandForecastChart() {
  const { rawData, isDataUploaded } = useData();

  const { processedForecastData, inventoryCapacity, restockMonth } = useMemo(() => {
    if (!isDataUploaded || rawData.length === 0) {
      return { processedForecastData: [], inventoryCapacity: 0, restockMonth: null };
    }

    // 1. Aggregate by month
    const monthlyData = new Map<string, { demand: number, stock: number }>();
    rawData.forEach(row => {
      if (row.Date) {
        const month = String(row.Date).substring(0, 7); // YYYY-MM
        const current = monthlyData.get(month) || { demand: 0, stock: 0 };
        monthlyData.set(month, {
          demand: current.demand + (row.Units_Sold || 0),
          stock: current.stock + (row.Current_Stock || 0)
        });
      }
    });

    const sortedMonths = Array.from(monthlyData.keys()).sort();
    const recentMonths = sortedMonths.slice(-4);
    
    const baseData = recentMonths.map((m, i) => {
      const labels = ["M-3", "M-2", "M-1", "Current"];
      const labelIndex = 4 - recentMonths.length + i;
      const data = monthlyData.get(m)!;
      return {
        month: labels[labelIndex],
        actual: data.demand,
        yhat: data.demand,
        lower: Math.round(data.demand * 0.95),
        upper: Math.round(data.demand * 1.05),
        rawStock: data.stock
      };
    });

    if (baseData.length === 0) return { processedForecastData: [], inventoryCapacity: 0, restockMonth: null };

    // 2. Generate future forecasts (M+1 to M+4)
    const forecasts = [];
    const history = baseData.map(d => d.actual);
    
    let growthFactor = 1.05; 
    if (history.length >= 2) {
      growthFactor = history[history.length - 1] / (history[0] || 1);
      growthFactor = Math.pow(growthFactor, 1 / history.length); 
      growthFactor = Math.max(0.8, Math.min(1.2, growthFactor));
    }

    let lastVal = history[history.length - 1];
    for (let i = 1; i <= 4; i++) {
      lastVal = lastVal * growthFactor;
      forecasts.push({
        month: `M+${i}`,
        actual: null,
        yhat: Math.round(lastVal),
        lower: Math.round(lastVal * 0.85), 
        upper: Math.round(lastVal * 1.15),
      });
    }

    const combined = [...baseData, ...forecasts].map(item => ({
      ...item,
      uncertaintyRange: [item.lower, item.upper]
    }));

    const latestStock = baseData[baseData.length - 1]?.rawStock || 2000;
    const capacity = Math.round(latestStock * 1.2); // Simulated capacity constraint

    const restockItem = forecasts.find(f => f.upper > capacity);
    const rMonth = restockItem ? restockItem.month : null;

    return { processedForecastData: combined, inventoryCapacity: capacity, restockMonth: rMonth };
  }, [rawData, isDataUploaded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full justify-between relative overflow-hidden">
        {restockMonth && (
          <div className="absolute top-6 right-6">
            <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-500">
              <AlertTriangle className="h-3.5 w-3.5" />
              <span>Restock by {restockMonth}</span>
            </div>
          </div>
        )}

        <div className="flex flex-row items-start justify-between pb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Demand Forecast</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Projected demand vs. inventory capacity</p>
          </div>
        </div>
        
        <div className="min-h-[260px] w-full flex-1 mt-4">
          {processedForecastData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={processedForecastData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip content={<ForecastTooltip capacity={inventoryCapacity} />} />
                
                <ReferenceLine y={inventoryCapacity} stroke="var(--amber-500)" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Capacity', position: 'insideTopLeft', fill: 'var(--amber-500)', fontSize: 11 }} />
                
                <Area type="monotone" dataKey="uncertaintyRange" stroke="none" fill="var(--chart-4)" fillOpacity={0.15} activeDot={false} />
                <Line type="monotone" dataKey="actual" name="Actual Demand" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: "var(--primary)", strokeWidth: 0 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="yhat" name="Forecast" stroke="var(--chart-4)" strokeWidth={3} strokeDasharray="5 5" dot={false} activeDot={{ r: 6, fill: "var(--chart-4)" }} />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground border-dashed rounded-lg border">
              Upload data to see forecast
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
