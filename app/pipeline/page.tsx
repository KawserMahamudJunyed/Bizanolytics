"use client"

import { motion } from "framer-motion"
import { DataFlowVisualization } from "@/components/spider-web"
import { cn } from "@/lib/utils"

import { useData } from "@/contexts/DataContext"

export default function PipelinePage() {
  const { rawData, isDataUploaded } = useData()
  
  const recordCount = isDataUploaded ? rawData.length : 0
  const throughput = isDataUploaded ? (recordCount * 0.002).toFixed(1) + " MB/s" : "0 MB/s"
  const successRate = isDataUploaded ? "100%" : "0%"

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
          trend={isDataUploaded ? 12.4 : 0}
        />
        <PipelineStatCard
          title="Pipeline Latency"
          value="124ms"
          description="End-to-end processing time"
          trend={-12.5}
        />
        <PipelineStatCard
          title="Success Rate"
          value={successRate}
          description="Pipeline execution success"
          trend={isDataUploaded ? 0.1 : 0}
        />
      </div>

      {/* Recent Pipeline Runs */}
      <PipelineRunsTable recordCount={recordCount} isUploaded={isDataUploaded} />
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

function PipelineRunsTable({ recordCount, isUploaded }: { recordCount: number, isUploaded: boolean }) {
  const runs = isUploaded ? [
    { id: "RUN-001", status: "success", duration: "1.2s", records: recordCount.toString(), timestamp: "Just now" },
    { id: "RUN-002", status: "success", duration: "0.8s", records: recordCount.toString(), timestamp: "2 mins ago" }
  ] : []

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
                  <td className="py-3 text-sm text-muted-foreground">{run.duration}</td>
                  <td className="py-3 text-sm text-muted-foreground">{run.records}</td>
                  <td className="py-3 text-sm text-muted-foreground">{run.timestamp}</td>
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
