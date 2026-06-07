"use client"

import { motion } from "framer-motion"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts"
import { Database, Cog, Brain, HardDrive, Zap } from "lucide-react"
import { useData } from "@/contexts/DataContext"
import { Globe } from "lucide-react"

// Performance Radar Chart - Spider visualization for metrics
export function PerformanceRadarChart() {
  const data = [
    { metric: "Accuracy", current: 94, previous: 88, benchmark: 85 },
    { metric: "Speed", current: 87, previous: 78, benchmark: 80 },
    { metric: "Coverage", current: 92, previous: 85, benchmark: 90 },
    { metric: "Reliability", current: 96, previous: 91, benchmark: 88 },
    { metric: "Efficiency", current: 89, previous: 82, benchmark: 85 },
    { metric: "Precision", current: 91, previous: 86, benchmark: 87 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full overflow-hidden">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Performance Metrics</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Multi-dimensional analysis</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--chart-1)]" />
              <span className="text-muted-foreground">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-[var(--chart-3)]" />
              <span className="text-muted-foreground">Previous</span>
            </div>
          </div>
        </div>

        <div className="min-h-[300px] w-full flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
              <PolarGrid stroke="var(--border)" strokeDasharray="3 3" />
              <PolarAngleAxis 
                dataKey="metric" 
                tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
                stroke="var(--border)"
              />
              <PolarRadiusAxis 
                angle={30} 
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                stroke="var(--border)"
                tickCount={5}
              />
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="var(--muted-foreground)"
                fill="transparent"
                strokeWidth={1}
                strokeDasharray="4 4"
              />
              <Radar
                name="Previous"
                dataKey="previous"
                stroke="var(--chart-3)"
                fill="var(--chart-3)"
                strokeWidth={2}
                fillOpacity={0.3}
              />
              <Radar
                name="Current"
                dataKey="current"
                stroke="var(--chart-1)"
                fill="var(--chart-1)"
                strokeWidth={2}
                fillOpacity={0.15}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}

// Industrial-grade Pipeline with Y-fork architecture
export function DataFlowVisualization() {
  const { rawData, isDataUploaded, activeIntegrationName, datasetId, datasetHistory } = useData()
  
  const activeDatasetName = datasetHistory?.find(d => d.id === datasetId)?.file_name
  
  // Calculate real metrics based on the uploaded data
  const recordCount = isDataUploaded ? rawData.length : 0
  const dataSizeInBytes = isDataUploaded ? JSON.stringify(rawData).length : 0
  const dataSizeDisplay = isDataUploaded 
    ? (dataSizeInBytes > 1024 * 1024 
        ? (dataSizeInBytes / (1024 * 1024)).toFixed(2) + " MB" 
        : (dataSizeInBytes / 1024).toFixed(1) + " KB")
    : "0 KB"
  
  const processingTime = isDataUploaded 
    ? Math.max(45, Math.min(500, Math.round(dataSizeInBytes / 80))).toString() + "ms" 
    : "0ms"
  const successRate = (() => {
    if (!isDataUploaded || !rawData.length) return "0%"
    const validRows = rawData.filter(r => r.Revenue_BDT > 0 && r.Units_Sold > 0).length
    return ((validRows / rawData.length) * 100).toFixed(1) + "%"
  })()

  // Layout: Upload → Parse → State (center hub)
  //   State splits: UP to AI API, DOWN to Dashboard
  //   AI API also feeds DOWN into Dashboard
  const stages = [
    { id: "upload", label: activeIntegrationName ? "Live Sync" : "Upload", description: activeIntegrationName ? activeIntegrationName : (activeDatasetName || "CSV/Excel Data"), icon: activeIntegrationName ? Globe : Database, x: 100, y: 170 },
    { id: "parse", label: "Parse", description: activeIntegrationName ? "Normalize Data" : "Client-side ETL", icon: Cog, x: 250, y: 170 },
    { id: "state", label: "State", description: "React Context", icon: HardDrive, x: 400, y: 170 },
    { id: "ai", label: "AI API", description: "Llama 3 via Groq", icon: Brain, x: 580, y: 75 },
    { id: "dashboard", label: "Dashboard", description: "Live Display", icon: Zap, x: 580, y: 280 },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <div className="card-base p-6 flex flex-col h-full overflow-hidden">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-foreground">Data Pipeline</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Real-time data flow visualization</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-xs font-medium text-emerald-500">Active</span>
          </div>
        </div>

      {/* SVG Pipeline */}
      <div className="block">
        <div className="relative h-[420px] w-full">
          <svg 
            viewBox="0 0 700 400" 
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--foreground)" stopOpacity="0.3" />
                <stop offset="50%" stopColor="var(--foreground)" stopOpacity="0.6" />
                <stop offset="100%" stopColor="var(--foreground)" stopOpacity="0.3" />
              </linearGradient>
            </defs>

            {/* === CONNECTION LINES === */}

            {/* 1. Upload ──► Parse (straight horizontal) */}
            <motion.path
              d="M 138 170 L 212 170"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity="0.4"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            />

            {/* 2. Parse ──► State (straight horizontal) */}
            <motion.path
              d="M 288 170 L 362 170"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity="0.4"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            />

            {/* 3. State ──► AI API (right, then up, then right) */}
            <motion.path
              d="M 438 170 L 480 170 L 480 75 L 542 75"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity="0.5"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />

            {/* 4. State ──► Dashboard (right, then down, then right) */}
            <motion.path
              d="M 438 170 L 480 170 L 480 280 L 542 280"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity="0.5"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            />

            {/* 5. AI API ──► Dashboard (straight vertical down) */}
            <motion.path
              d="M 580 113 L 580 242"
              fill="none"
              stroke="var(--foreground)"
              strokeOpacity="0.4"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            />

            {/* === BRANCH LABELS === */}
            <motion.text
              x="510"
              y="60"
              textAnchor="middle"
              className="text-[9px] fill-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
            >
              AI Insights
            </motion.text>
            <motion.text
              x="510"
              y="298"
              textAnchor="middle"
              className="text-[9px] fill-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.55 }}
            >
              Charts &amp; Data
            </motion.text>

            {/* === JUNCTION DOT at the split point === */}
            <motion.circle
              cx="480"
              cy="170"
              r="3"
              fill="var(--foreground)"
              fillOpacity="0.5"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
            />

            {/* === ANIMATED PARTICLES === */}

            {/* Upload → Parse */}
            <circle r="3" fill="var(--foreground)" fillOpacity="0.8">
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                path="M 138 170 L 212 170"
              />
            </circle>

            {/* Parse → State */}
            <circle r="3" fill="var(--foreground)" fillOpacity="0.8">
              <animateMotion
                dur="1.5s"
                repeatCount="indefinite"
                path="M 288 170 L 362 170"
              />
            </circle>

            {/* State → AI API (up branch) */}
            <circle r="2.5" fill="var(--foreground)" fillOpacity="0.8">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M 438 170 L 480 170 L 480 75 L 542 75"
              />
            </circle>

            {/* State → Dashboard (down branch) */}
            <circle r="2.5" fill="var(--foreground)" fillOpacity="0.8">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M 438 170 L 480 170 L 480 280 L 542 280"
              />
            </circle>

            {/* AI API → Dashboard (green insight particle) */}
            <circle r="3" fill="#10b981">
              <animateMotion
                dur="2s"
                repeatCount="indefinite"
                path="M 580 113 L 580 242"
              />
            </circle>

            {/* === NODE CIRCLES WITH LABELS === */}
            {stages.map((stage, index) => {
              const Icon = stage.icon
              return (
                <g key={stage.id}>
                  {/* Outer ring */}
                  <motion.circle
                    cx={stage.x}
                    cy={stage.y}
                    r="38"
                    fill="none"
                    stroke="var(--border)"
                    strokeWidth="1"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4 }}
                  />
                  {/* Inner filled circle */}
                  <motion.circle
                    cx={stage.x}
                    cy={stage.y}
                    r="32"
                    fill="var(--card)"
                    stroke="var(--border)"
                    strokeWidth="1.5"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 * index, duration: 0.4, type: "spring" }}
                  />

                  {/* Labels: AI API goes above the icon, everything else below */}
                  {stage.id === "ai" ? (
                    <>
                      <text
                        x={stage.x}
                        y={stage.y - 50}
                        textAnchor="middle"
                        className="fill-foreground text-sm font-medium"
                      >
                        {stage.label}
                      </text>
                      <text
                        x={stage.x}
                        y={stage.y - 36}
                        textAnchor="middle"
                        className="fill-muted-foreground text-xs"
                      >
                        {stage.description}
                      </text>
                    </>
                  ) : (
                    <>
                      <text
                        x={stage.x}
                        y={stage.y + 55}
                        textAnchor="middle"
                        className="fill-foreground text-sm font-medium"
                      >
                        {stage.label}
                      </text>
                      <text
                        x={stage.x}
                        y={stage.y + 69}
                        textAnchor="middle"
                        className="fill-muted-foreground text-xs"
                      >
                        {stage.description}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {/* Icons as foreignObject */}
            {stages.map((stage) => {
              const Icon = stage.icon
              return (
                <foreignObject
                  key={`icon-${stage.id}`}
                  x={stage.x - 12}
                  y={stage.y - 12}
                  width="24"
                  height="24"
                >
                  <div className="flex h-6 w-6 items-center justify-center text-muted-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </foreignObject>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Pipeline stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 border-t border-border pt-6 md:grid-cols-4">
        {[
          { label: "Rows Processed", value: recordCount.toLocaleString() },
          { label: "Data Volume", value: dataSizeDisplay },
          { label: "Processing Latency", value: processingTime },
          { label: "Success Rate", value: successRate },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            className="text-center md:text-left"
          >
            <p className="text-lg font-semibold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </motion.div>
  )
}
