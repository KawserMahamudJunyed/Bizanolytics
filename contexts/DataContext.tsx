"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import Papa from "papaparse"
import { createClient } from "@/utils/supabase/client"

export type SMEDataRow = {
  Date: string
  Product_ID: string
  Product_Name: string
  Category: string
  Location: string
  Sales_Channel: string
  Units_Sold: number
  Revenue_BDT: number
  Unit_Price: number
  Cost_Price: number
  Current_Stock: number
  Customer_Segment: string
}

interface DataContextType {
  isDataUploaded: boolean
  rawData: SMEDataRow[]
  setUploadedData: (data: SMEDataRow[], datasetId?: string) => void
  resetData: () => void
  datasetId?: string
  aiInsights?: string
  saveAiInsights: (insights: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<SMEDataRow[]>([])
  const [isDataUploaded, setIsDataUploaded] = useState(false)
  const [datasetId, setDatasetId] = useState<string>()
  const [aiInsights, setAiInsights] = useState<string>()

  useEffect(() => {
    async function loadSavedData() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch latest dataset metadata
      const { data: datasets, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error || !datasets || datasets.length === 0) return

      const latestDataset = datasets[0]
      setDatasetId(latestDataset.id)
      if (latestDataset.ai_insights) {
        setAiInsights(latestDataset.ai_insights)
      }

      // Download file from storage
      const { data: fileData, error: downloadError } = await supabase.storage
        .from('user_datasets')
        .download(latestDataset.file_path)

      if (downloadError || !fileData) return

      // Parse CSV text
      const text = await fileData.text()
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            setRawData(results.data as SMEDataRow[])
            setIsDataUploaded(true)
          }
        }
      })
    }

    loadSavedData()
  }, [])

  const setUploadedData = (data: SMEDataRow[], id?: string) => {
    setRawData(data)
    setIsDataUploaded(true)
    setDatasetId(id)
    setAiInsights(undefined)
  }

  const resetData = () => {
    setRawData([])
    setIsDataUploaded(false)
    setDatasetId(undefined)
    setAiInsights(undefined)
  }

  const saveAiInsights = async (insights: string) => {
    setAiInsights(insights)
    if (datasetId) {
      const supabase = createClient()
      await supabase.from('datasets').update({ ai_insights: insights }).eq('id', datasetId)
    }
  }

  return (
    <DataContext.Provider value={{ isDataUploaded, rawData, setUploadedData, resetData, datasetId, aiInsights, saveAiInsights }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}
