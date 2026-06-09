"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Database, Link2, Key, Loader2, ArrowRight, Table, Server } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { toast } from "sonner"
import type { IntegrationData } from "../utils/types"
import { mapIntegrationToSMEData } from "../utils/normalize"

export function DatabaseConnect({ onDataReady }: { onDataReady: (data: IntegrationData) => void }) {
  const [activeTab, setActiveTab] = useState<"sheets" | "sql">("sheets")
  const [sheetsUrl, setSheetsUrl] = useState("")
  const [sqlString, setSqlString] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const { setUploadedData } = useData()

  const handleConnect = async () => {
    if (activeTab === "sheets" && !sheetsUrl.trim()) {
      toast.error("Please provide a valid spreadsheet link")
      return
    }
    if (activeTab === "sql" && !sqlString.trim()) {
      toast.error("Please provide a valid connection string")
      return
    }

    setIsConnecting(true)

    try {
      // Simulate connection and fetching process
      await new Promise(r => setTimeout(r, 1500))

      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      const platformKey = activeTab === "sheets" ? "sheets" : "sql";
      const res = await fetch("/api/integrations/sync", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          platform: platformKey,
          url: activeTab === "sheets" ? sheetsUrl : "sql_database_uri",
          keys: {
            connectionString: activeTab === "sql" ? sqlString : "sheet_token",
          }
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to connect to database");

      toast.success("Database connected successfully!")
      onDataReady(data)
    } catch (error) {
      toast.error("Failed to connect to database")
    } finally {
      setIsConnecting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-base p-6 border-border"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
          <Database className="h-5 w-5 text-emerald-500" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-foreground">Connect Database</h3>
          <p className="text-xs text-muted-foreground">Link a live Google Sheet, Excel file, or SQL database</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-secondary/50">
        <button
          onClick={() => setActiveTab("sheets")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
            activeTab === "sheets" ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Table className="h-4 w-4" /> Sheets / Excel
        </button>
        <button
          onClick={() => setActiveTab("sql")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all duration-200",
            activeTab === "sql" ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Server className="h-4 w-4" /> SQL Database
        </button>
      </div>

      <div className="space-y-4">
        {activeTab === "sheets" ? (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Shareable Link</label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="text"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/... or https://onedrive.live.com/..."
                disabled={isConnecting}
                className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50"
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground/60">
              Ensure the link is set to "Anyone with the link can view". Supports Google Sheets and Excel Online. We will automatically sync the first sheet.
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Connection String (URI)</label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="password"
                value={sqlString}
                onChange={(e) => setSqlString(e.target.value)}
                placeholder="postgres://user:password@host:port/database"
                disabled={isConnecting}
                className="w-full rounded-xl border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all disabled:opacity-50 font-mono"
              />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground/60">
              Supports PostgreSQL, MySQL, and SQL Server.
            </p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <motion.button
          whileHover={{ scale: isConnecting ? 1 : 1.01 }}
          whileTap={{ scale: isConnecting ? 1 : 0.99 }}
          onClick={handleConnect}
          disabled={isConnecting || (activeTab === "sheets" ? !sheetsUrl : !sqlString)}
          className={cn(
            "w-full flex items-center justify-center gap-2.5 rounded-xl px-6 py-3.5 text-sm font-semibold transition-all",
            isConnecting ? "bg-secondary text-emerald-600 cursor-wait" : "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:bg-emerald-600",
            (!sheetsUrl && activeTab === "sheets") || (!sqlString && activeTab === "sql") ? "opacity-50 cursor-not-allowed" : ""
          )}
        >
          {isConnecting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {isConnecting ? "Connecting..." : "Connect & Sync"}
        </motion.button>
      </div>
    </motion.div>
  )
}
