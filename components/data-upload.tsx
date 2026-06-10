"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, FileText, CheckCircle, AlertCircle, RefreshCw, Brain } from "lucide-react"
import { cn } from "@/lib/utils"
import Papa from "papaparse"
import * as XLSX from "xlsx"
import { useData } from "@/contexts/DataContext"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { normalizeCsvData } from "@/lib/normalizeCsv"
import { useLanguage } from "@/contexts/LanguageContext"
import { apiClient } from "@/lib/api"

export function DataUpload() {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "processing" | "imputing" | "success" | "error" | "insufficient">("idle")
  const [progress, setProgress] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const { setUploadedData, uploadCsvFile } = useData()
  const { t } = useLanguage()
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

  const handleParsedData = async (parsedData: any[], currentFile: File) => {
    if (parsedData.length === 0) {
      setErrorMessage("The uploaded file is empty or has no valid data.")
      setUploadState("error")
      return
    }
    
    // Normalize column names using synonyms
    const normalizedData = normalizeCsvData(parsedData);
    
    // Check Critical Columns on the normalized data
    const firstRow = normalizedData[0]
    
    const missingColumns = [];
    if (!firstRow.hasOwnProperty('Date')) missingColumns.push("Date");
    if (!firstRow.hasOwnProperty('Product_Name')) missingColumns.push("Product or Item Name");
    if (!firstRow.hasOwnProperty('Units_Sold')) missingColumns.push("Quantity or Units Sold");
    if (!firstRow.hasOwnProperty('Revenue_BDT')) missingColumns.push("Total Sales/Revenue");
    
    if (missingColumns.length > 0) {
      setErrorMessage(`Missing critical data columns. Your file is missing: ${missingColumns.join(", ")}.`);
      setUploadState("insufficient")
      return
    }
    
    // Check Inferrable Columns (e.g., Category)
    const hasCategory = firstRow.hasOwnProperty('Category')
    if (!hasCategory) {
      setUploadState("imputing")
      const uniqueProducts = Array.from(new Set(normalizedData.map(row => row.Product_Name))).filter(Boolean)
      
      try {
        const data = await apiClient.post<any>("/api/v1/ai/impute", { targetColumn: "Category", products: uniqueProducts })
        
        if (data.mapping) {
          const mapDict: Record<string, string> = {}
          data.mapping.forEach((item: any) => { mapDict[item.productName] = item.category })
          
          normalizedData.forEach(row => {
            row.Category = mapDict[row.Product_Name] || "General"
          })
        }
      } catch (e) {
        console.error("Imputation failed", e)
        setErrorMessage("AI imputation failed or took too long. Please ensure your dataset is complete.")
        setUploadState("insufficient")
        return
      }
    }

    // Upload to DataBox and persist in Neon via /api/v1/data/upload
    try {
      await uploadCsvFile(currentFile, 'sales')
    } catch (err: any) {
      console.warn('DataBox upload failed, continuing with local display:', err.message)
    }

    setUploadState("success")
    setProgress(100)

    setTimeout(() => {
      setUploadedData(normalizedData as any, undefined)
      router.push("/dashboard")
    }, 1000)
  }

  const processFile = (fileToProcess: File) => {
    setUploadState("uploading")
    let p = 0
    const interval = setInterval(async () => {
      p += 50
      setProgress(Math.min(p, 100))
      
      if (p >= 100) {
        clearInterval(interval)
        setUploadState("processing")
        
        const isExcel = fileToProcess.name.endsWith(".xlsx") || fileToProcess.name.endsWith(".xls")

        if (isExcel) {
          try {
            const buffer = await fileToProcess.arrayBuffer()
            const workbook = XLSX.read(buffer, { type: 'array' })
            const firstSheetName = workbook.SheetNames[0]
            const worksheet = workbook.Sheets[firstSheetName]
            const jsonData = XLSX.utils.sheet_to_json(worksheet)
            await handleParsedData(jsonData, fileToProcess)
          } catch (error) {
            setErrorMessage("Error parsing the Excel file.")
            setUploadState("error")
          }
        } else {
          Papa.parse(fileToProcess, {
            header: true,
            dynamicTyping: true,
            skipEmptyLines: true,
            worker: true,
            complete: async (results) => {
              const parsedData = results.data as any[]
              if (parsedData.length === 0) {
                setErrorMessage("The uploaded file is empty.")
                setUploadState("error")
                return
              }
              await handleParsedData(parsedData, fileToProcess)
            },
            error: (err) => {
              setErrorMessage("Error parsing the CSV or Excel file.")
              setUploadState("error")
            }
          })
        }
      }
    }, 50)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      const isValidType = droppedFile.type === "text/csv" || 
                          droppedFile.name.endsWith(".csv") || 
                          droppedFile.type === "application/vnd.ms-excel" || 
                          droppedFile.name.endsWith(".xlsx") || 
                          droppedFile.name.endsWith(".xls")
      
      if (isValidType) {
        setFile(droppedFile)
        processFile(droppedFile)
      } else {
        setErrorMessage("Unsupported file format. Please upload CSV or Excel (.xlsx) files.")
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
        <h3 className="text-lg font-semibold text-foreground">{t('connect_data_source')}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{t('upload_instructions')}</p>
        <p className="mt-2 text-xs font-medium text-emerald-500/80">
          {t('required_columns')}
        </p>
      </div>

      <div
        className={cn(
          "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 sm:p-8 transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-border hover:bg-secondary/50",
          uploadState === "success" && "border-emerald-500/50 bg-emerald-500/5",
          (uploadState === "error" || uploadState === "insufficient") && "border-red-500/50 bg-red-500/5"
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
                {t('drag_drop')}
              </p>
              <p className="mb-4 text-xs text-muted-foreground">
                {t('click_upload')}
              </p>
              <label className="cursor-pointer rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                {t('browse_files')}
                <input
                  type="file"
                  className="hidden"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleChange}
                />
              </label>
              <div className="mt-4 flex gap-4 text-xs text-muted-foreground">
                <a href="/sample-sme-sales.csv" download className="text-primary hover:underline">{t('download_sample')}</a>
              </div>
            </motion.div>
          )}

          {(uploadState === "uploading" || uploadState === "processing" || uploadState === "imputing") && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex w-full max-w-md flex-col items-center text-center"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                {uploadState === "imputing" ? (
                  <Brain className="h-6 w-6 animate-pulse text-primary" />
                ) : (
                  <RefreshCw className="h-6 w-6 animate-spin text-primary" />
                )}
              </div>
              <p className="mb-2 text-sm font-medium text-foreground">
                {uploadState === "uploading" && `Uploading ${file?.name}...`}
                {uploadState === "processing" && "Analyzing file structure..."}
                {uploadState === "imputing" && "AI is inferring missing data (Categories)..."}
              </p>
              
              {uploadState !== "imputing" && (
                <>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{progress}% Complete</p>
                </>
              )}
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

          {(uploadState === "error" || uploadState === "insufficient") && (
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
              <p className="mb-1 text-sm font-medium text-foreground">
                {uploadState === "insufficient" ? "Insufficient Data" : "Upload Failed"}
              </p>
              <p className="mb-4 text-xs text-red-400">
                {errorMessage || "Please ensure you are uploading a valid CSV or Excel file."}
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
