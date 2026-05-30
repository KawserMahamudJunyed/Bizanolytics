"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { cn } from "@/lib/utils"
import Papa from "papaparse"
import { useData } from "@/contexts/DataContext"
import { useRouter } from "next/navigation"

export function DataUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle")
  const [progress, setProgress] = useState(0)
  const { setUploadedData } = useData()
  const router = useRouter()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = (fileToProcess: File) => {
    setUploadState("uploading")
    let p = 0
    const interval = setInterval(() => {
      p += 50
      setProgress(Math.min(p, 100))
      
      if (p >= 100) {
        clearInterval(interval)
        setUploadState("processing")
        
        Papa.parse(fileToProcess, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true,
          worker: true,
          complete: (results) => {
            setTimeout(() => {
              setUploadState("success")
              setUploadedData(results.data as any)
              router.push("/") // Redirect to dashboard to see results
            }, 200)
          },
          error: () => {
            setUploadState("error")
          }
        })
      }
    }, 50)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith(".csv") || droppedFile.type === "application/vnd.ms-excel") {
        setFile(droppedFile)
        processFile(droppedFile)
      } else {
        setUploadState("error")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
      processFile(e.target.files[0])
    }
  }

  const resetUpload = () => {
    setFile(null)
    setUploadState("idle")
    setProgress(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card-base overflow-hidden p-6 mb-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Connect Data Source</h3>
        <p className="mt-1 text-sm text-muted-foreground">Upload your raw sales data (CSV) to let our AI process and forecast demand.</p>
        <p className="mt-2 text-xs font-medium text-emerald-500/80">
          Required Columns: Date, Product_Name, Category, Location, Sales_Channel, Units_Sold, Revenue_BDT, Cost_Price, Current_Stock
        </p>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50",
          uploadState === "success" && "border-emerald-500/50 bg-emerald-500/5",
          uploadState === "error" && "border-red-500/50 bg-red-500/5"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-secondary p-4">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="mb-1 text-sm font-medium text-foreground">
                Drag and drop your CSV file here
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                or click to browse from your computer
              </p>
              <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                Browse Files
                <input
                  type="file"
                  className="hidden"
                  accept=".csv"
                  onChange={handleChange}
                />
              </label>
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <a href="/sample-sme-sales.csv" download className="text-primary hover:underline">Download Sample Dataset</a>
              </div>
            </motion.div>
          )}

          {(uploadState === "uploading" || uploadState === "processing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full max-w-md flex-col items-center text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <RefreshCw className="h-6 w-6 animate-spin text-primary" />
              </div>
              <p className="mb-2 text-sm font-medium text-foreground">
                {uploadState === "uploading" ? `Uploading ${file?.name}...` : "AI is analyzing patterns..."}
              </p>
              <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{progress}% Complete</p>
            </motion.div>
          )}

          {uploadState === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-emerald-500/10 p-4">
                <CheckCircle className="h-8 w-8 text-emerald-500" />
              </div>
              <p className="mb-1 text-sm font-medium text-foreground">Data Successfully Processed!</p>
              <p className="mb-4 text-xs text-muted-foreground">
                {file?.name} has been ingested and the dashboard has been updated.
              </p>
              <button
                onClick={resetUpload}
                className="text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                Upload another file
              </button>
            </motion.div>
          )}

          {uploadState === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 rounded-full bg-red-500/10 p-4">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="mb-1 text-sm font-medium text-foreground">Upload Failed</p>
              <p className="mb-4 text-xs text-muted-foreground">
                Please ensure you are uploading a valid CSV file.
              </p>
              <button
                onClick={resetUpload}
                className="rounded-md bg-secondary px-4 py-2 text-xs font-medium text-foreground hover:bg-secondary/80"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
