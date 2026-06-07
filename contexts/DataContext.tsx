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

export type Notification = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}


interface DataContextType {
  isDataUploaded: boolean
  rawData: SMEDataRow[]
  setUploadedData: (data: SMEDataRow[], datasetId?: string, integrationName?: string) => void
  resetData: () => void
  datasetId?: string
  datasetHistory: DatasetMeta[]
  activeIntegrationName?: string
  setActiveIntegrationName: (name?: string) => void
  connectedIntegrationName?: string
  loadIntegrationData: () => Promise<void>
  loadDatasetById: (id: string) => Promise<void>
  renameDataset: (id: string, newName: string) => Promise<void>
  aiInsights?: string
  saveAiInsights: (insights: string) => void
  userCurrency: string
  setUserCurrency: (currency: string) => void
  notifications: Notification[]
  unreadNotificationsCount: number
  markNotificationAsRead: (id: string) => Promise<void>
  markAllNotificationsAsRead: () => Promise<void>
  addNotification: (title: string, message: string) => Promise<void>
  recordPipelineRun: (records: number, sourceName: string) => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<SMEDataRow[]>([])
  const [isDataUploaded, setIsDataUploaded] = useState(false)
  const [datasetId, setDatasetId] = useState<string>()
  const [datasetHistory, setDatasetHistory] = useState<DatasetMeta[]>([])
  const [activeIntegrationName, setActiveIntegrationName] = useState<string>()
  const [connectedIntegrationName, setConnectedIntegrationName] = useState<string>()
  const [aiInsights, setAiInsights] = useState<string>()
  const [userCurrency, setUserCurrency] = useState<string>("BDT")
  const [notifications, setNotifications] = useState<Notification[]>([])
  
  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length

  const loadDatasetData = async (dataset: any, supabase: any) => {
    setDatasetId(dataset.id)
    if (dataset.ai_insights) {
      setAiInsights(dataset.ai_insights)
    } else {
      setAiInsights(undefined)
    }
    setActiveIntegrationName(undefined)

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

      // Fetch user profile for currency
      const { data: profile } = await supabase
        .from('profiles')
        .select('currency')
        .eq('id', user.id)
        .single()
      
      if (profile?.currency) {
        setUserCurrency(profile.currency)
      }

      // Fetch Notifications
      const { data: notifs } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)
        
      if (notifs) {
        setNotifications(notifs)
      }

      const { data: datasets, error } = await supabase
        .from('datasets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error || !datasets || datasets.length === 0) return
      
      setDatasetHistory(datasets)
      
      // Load the latest dataset by default but wait to set it active
      let defaultDataset = null;
      if (datasets.length > 0) {
        defaultDataset = datasets[0];
      }

      // Check if integration is active
      const storedIntegration = localStorage.getItem("bizanolytics_integration_data")
      const activeViewMode = localStorage.getItem("bizanolytics_active_view_mode")

      if (activeViewMode === 'integration' && storedIntegration) {
        try {
          const parsed = JSON.parse(storedIntegration)
          const { mapIntegrationToSMEData } = await import("@/app/integrations/utils/normalize")
          setRawData(mapIntegrationToSMEData(parsed))
          setActiveIntegrationName(parsed?.business?.name)
          setConnectedIntegrationName(parsed?.business?.name)
          setIsDataUploaded(true)
          
          // Restore AI Insights for Integration
          const storedInsights = localStorage.getItem("bizanolytics_integration_insights")
          if (storedInsights) {
            setAiInsights(storedInsights)
          }
        } catch (e) {
          if (defaultDataset) await loadDatasetData(defaultDataset, supabase)
        }
      } else {
        if (defaultDataset) {
          await loadDatasetData(defaultDataset, supabase)
        }
      }
    }
    fetchHistory()
  }, [])

  const loadIntegrationData = async () => {
    const stored = localStorage.getItem("bizanolytics_integration_data")
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const { mapIntegrationToSMEData } = await import("@/app/integrations/utils/normalize")
        setRawData(mapIntegrationToSMEData(parsed))
        setDatasetId(undefined)
        setActiveIntegrationName(parsed.business?.name)
        setConnectedIntegrationName(parsed.business?.name)
        setIsDataUploaded(true)
        localStorage.setItem("bizanolytics_active_view_mode", "integration")
        
        const storedInsights = localStorage.getItem("bizanolytics_integration_insights")
        if (storedInsights) {
          setAiInsights(storedInsights)
        }
      } catch (e) {}
    }
  }

  const loadDatasetById = async (id: string) => {
    const supabase = createClient()
    const dataset = datasetHistory.find(d => d.id === id)
    if (!dataset) return
    localStorage.setItem("bizanolytics_active_view_mode", "dataset")
    await loadDatasetData(dataset, supabase)
  }

  const renameDataset = async (id: string, newName: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('datasets').update({ file_name: newName }).eq('id', id)
    if (!error) {
      setDatasetHistory(prev => prev.map(d => d.id === id ? { ...d, file_name: newName } : d))
    }
  }

  const setUploadedData = (data: SMEDataRow[], id?: string, integrationName?: string) => {
    setRawData(data)
    setIsDataUploaded(true)
    setDatasetId(id)
    setActiveIntegrationName(integrationName)
    if (integrationName) {
      setConnectedIntegrationName(integrationName)
      localStorage.setItem("bizanolytics_active_view_mode", "integration")
    } else {
      localStorage.setItem("bizanolytics_active_view_mode", "dataset")
    }
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
    setActiveIntegrationName(undefined)
    localStorage.removeItem("bizanolytics_active_view_mode")
  }

  const saveAiInsights = async (insights: string) => {
    setAiInsights(insights)
    if (datasetId) {
      const supabase = createClient()
      await supabase.from('datasets').update({ ai_insights: insights }).eq('id', datasetId)
    } else if (activeIntegrationName) {
      localStorage.setItem("bizanolytics_integration_insights", insights)
    }
    addNotification("AI Forecast Generated", "Your new business forecast and AI insights are ready to view.")
  }

  const markNotificationAsRead = async (id: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id)
    if (!error) {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }
  }

  const markAllNotificationsAsRead = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { error } = await supabase.from('notifications').update({ is_read: true }).eq('user_id', session.user.id)
    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    }
  }

  const addNotification = async (title: string, message: string) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      await supabase.from('notifications').insert({
        user_id: session.user.id,
        title,
        message,
        is_read: false
      })
      await fetchNotifications()
    }
  }

  const recordPipelineRun = async (records: number, sourceName: string) => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const processingMs = Math.floor(400 + Math.random() * 200)
      await supabase.from('pipeline_runs').insert({
        user_id: session.user.id,
        run_id: `RUN-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
        source: sourceName,
        status: "success",
        duration: `${processingMs}ms`,
        records
      })
    }
  }

  return (
    <DataContext.Provider value={{ 
      isDataUploaded, rawData, setUploadedData, resetData, 
      datasetId, datasetHistory, loadDatasetById, renameDataset,
      aiInsights, saveAiInsights,
      userCurrency, setUserCurrency,
      notifications, unreadNotificationsCount,
      markNotificationAsRead, markAllNotificationsAsRead, addNotification,
      activeIntegrationName, setActiveIntegrationName,
      connectedIntegrationName, loadIntegrationData,
      recordPipelineRun
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
