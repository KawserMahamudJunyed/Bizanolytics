"use client"

import { motion } from "framer-motion"
import { useState, useEffect, useRef, useMemo } from "react"
import { DataFlowVisualization } from "@/components/spider-web"
import { cn } from "@/lib/utils"

import { useData } from "@/contexts/DataContext"

type PipelineRun = {
  id: string
  status: "success" | "warning" | "error"
  duration: string
  records: number
  timestamp: Date
}

function generateRunId() {
  const hex = Math.random().toString(16).slice(2, 8).toUpperCase()
  return `RUN-${hex}`
}

function formatTimeAgo(date: Date) {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 5) return "Just now"
  if (seconds < 60) return `${seconds}s ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} min${minutes > 1 ? "s" : ""} ago`
  const hours = Math.floor(minutes / 60)
  return `${hours}h ago`
}

export default function PipelinePage() {
  const { rawData, isDataUploaded } = useData()
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([])
  const prevDataLenRef = useRef(0)
  const [, forceUpdate] = useState(0)
  
  const recordCount = isDataUploaded ? rawData.length : 0
  
  // Compute dynamic metrics
  const dataSizeBytes = useMemo(() => {
    if (!isDataUploaded || !rawData.length) return 0
    return JSON.stringify(rawData).length
  }, [rawData, isDataUploaded])
  
  const latencyMs = useMemo(() => {
    if (!isDataUploaded) return 0
    // Simulate latency based on data size (bigger data = more latency)
    return Math.max(45, Math.min(500, Math.round(dataSizeBytes / 80 + Math.random() * 30)))
  }, [dataSizeBytes, isDataUploaded])
  
  const throughput = useMemo(() => {
    if (!isDataUploaded || latencyMs === 0) return "0 MB/s"
    const mbPerSec = (dataSizeBytes / 1024 / 1024) / (latencyMs / 1000)
    return mbPerSec >= 1 ? mbPerSec.toFixed(1) + " MB/s" : (mbPerSec * 1000).toFixed(0) + " KB/s"
  }, [dataSizeBytes, latencyMs, isDataUploaded])
  
  const successRate = isDataUploaded ? "100%" : "0%"
  const latencyTrend = useMemo(() => {
    if (pipelineRuns.length < 2) return 0
    return -1 * parseFloat((Math.random() * 8 + 2).toFixed(1))
  }, [pipelineRuns.length])

  // Add a new pipeline run whenever data changes
  useEffect(() => {
    if (isDataUploaded && rawData.length > 0 && rawData.length !== prevDataLenRef.current) {
      prevDataLenRef.current = rawData.length
      const processingMs = Math.max(45, Math.min(500, Math.round(dataSizeBytes / 80 + Math.random() * 30)))
      const newRun: PipelineRun = {
        id: generateRunId(),
        status: "success",
        duration: processingMs < 1000 ? `${processingMs}ms` : `${(processingMs / 1000).toFixed(1)}s`,
        records: rawData.length,
        timestamp: new Date()
      }
      setPipelineRuns(prev => [newRun, ...prev].slice(0, 10)) // keep last 10
    }
  }, [rawData, isDataUploaded, dataSizeBytes])

  // Update "time ago" labels every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => forceUpdate(n => n + 1), 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      <DataFlowVisualization />
      
      {/* Pipeline Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <PipelineStatCard
          title="Data Throughput"
          value={throughput}
          description="Average processing volume"
          trend={isDataUploaded ? parseFloat((Math.random() * 10 + 5).toFixed(1)) : 0}
        />
        <PipelineStatCard
          title="Pipeline Latency"
          value={isDataUploaded ? `${latencyMs}ms` : "0ms"}
          description="End-to-end processing time"
          trend={latencyTrend}
        />
        <PipelineStatCard
          title="Success Rate"
          value={successRate}
          description="Pipeline execution success"
          trend={isDataUploaded ? 0.1 : 0}
        />
      </div>

      {/* Recent Pipeline Runs */}
      <PipelineRunsTable runs={pipelineRuns} />
    </motion.div>
  )
}

function PipelineStatCard({ 
  title, 
  value, 
  description, 
  trend,
}: { 
  title: string
  value: string
  description: string
  trend: number
}) {
  const isPositive = trend >= 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-base glossy p-6"
    >
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{description}</p>
      
      <div className={cn(
        "mt-3 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
        isPositive 
          ? "bg-emerald-500/10 text-emerald-500" 
          : "bg-red-500/10 text-red-500"
      )}>
        {isPositive ? "+" : ""}{trend}%
      </div>
    </motion.div>
  )
}

function PipelineRunsTable({ runs }: { runs: PipelineRun[] }) {
  const statusStyles = {
    success: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    error: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base overflow-hidden"
    >
      <div className="p-6">
        <h3 className="mb-4 text-base font-semibold text-foreground">Recent Pipeline Runs</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Run ID</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Records</th>
                <th className="pb-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {runs.map((run, i) => (
                <motion.tr 
                  key={run.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group"
                >
                  <td className="py-3 text-sm font-mono text-foreground">{run.id}</td>
                  <td className="py-3">
                    <span className={cn(
                      "inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
                      statusStyles[run.status as keyof typeof statusStyles]
                    )}>
                      {run.status}
                    </span>
                  </td>
                  <td className="py-3 text-sm font-mono text-muted-foreground">{run.duration}</td>
                  <td className="py-3 text-sm font-mono text-muted-foreground">{run.records.toLocaleString()}</td>
                  <td className="py-3 text-sm text-muted-foreground">{formatTimeAgo(run.timestamp)}</td>
                </motion.tr>
              ))}
              {runs.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-sm text-muted-foreground">
                    Upload data to view pipeline runs.
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
