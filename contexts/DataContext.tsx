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

export type DatasetMeta = {
  id: string
  file_name: string
  file_path: string
  created_at: string
}

interface DataContextType {
  isDataUploaded: boolean
  rawData: SMEDataRow[]
  setUploadedData: (data: SMEDataRow[], datasetId?: string) => void
  resetData: () => void
  datasetId?: string
  datasetHistory: DatasetMeta[]
  loadDatasetById: (id: string) => Promise<void>
  renameDataset: (id: string, newName: string) => Promise<void>
  aiInsights?: string
  saveAiInsights: (insights: string) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<SMEDataRow[]>([])
  const [isDataUploaded, setIsDataUploaded] = useState(false)
  const [datasetId, setDatasetId] = useState<string>()
  const [datasetHistory, setDatasetHistory] = useState<DatasetMeta[]>([])
  const [aiInsights, setAiInsights] = useState<string>()

  const loadDatasetData = async (dataset: any, supabase: any) => {
    setDatasetId(dataset.id)
    if (dataset.ai_insights) {
      setAiInsights(dataset.ai_insights)
    } else {
      setAiInsights(undefined)
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('user_datasets')
      .download(dataset.file_path)

    if (downloadError || !fileData) return

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

  useEffect(() => {
    async function fetchHistory() {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const { data: datasets, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error || !datasets || datasets.length === 0) return
      
      setDatasetHistory(datasets)
      
      // Load the latest dataset by default
      if (datasets.length > 0) {
        await loadDatasetData(datasets[0], supabase)
      }
    }
    fetchHistory()
  }, [])

  const loadDatasetById = async (id: string) => {
    const supabase = createClient()
    const dataset = datasetHistory.find(d => d.id === id)
    if (!dataset) return
    await loadDatasetData(dataset, supabase)
  }

  const renameDataset = async (id: string, newName: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('datasets').update({ file_name: newName }).eq('id', id)
    if (!error) {
      setDatasetHistory(prev => prev.map(d => d.id === id ? { ...d, file_name: newName } : d))
    }
  }

  const setUploadedData = (data: SMEDataRow[], id?: string) => {
    setRawData(data)
    setIsDataUploaded(true)
    setDatasetId(id)
    setAiInsights(undefined)
    
    // Refresh history if a new dataset was uploaded
    if (id) {
      const supabase = createClient()
      supabase.from('datasets').select('*').eq('id', id).single().then(({ data: newDataset }) => {
        if (newDataset) {
          setDatasetHistory(prev => [newDataset, ...prev])
        }
      })
    }
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
    <DataContext.Provider value={{ 
      isDataUploaded, rawData, setUploadedData, resetData, 
      datasetId, datasetHistory, loadDatasetById, renameDataset,
      aiInsights, saveAiInsights 
    }}>
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
