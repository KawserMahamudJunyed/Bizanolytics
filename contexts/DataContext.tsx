"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import Papa from "papaparse"
import { createClient } from "@/utils/supabase/client"
import { normalizeCsvData } from "@/lib/normalizeCsv"
import { toast } from "sonner"

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
  integrationHistory: any[]
  activeIntegrationName?: string
  setActiveIntegrationName: (name?: string) => void
  connectedIntegrationName?: string
  loadIntegrationData: () => Promise<void>
  loadIntegrationByPlatform: (platform: string) => Promise<void>
  refreshIntegrationHistory: () => Promise<void>
  renameIntegration: (platform: string, newName: string) => Promise<void>
  loadDatasetById: (id: string) => Promise<void>
  renameDataset: (id: string, newName: string) => Promise<void>
  deleteDataset: (id: string) => Promise<void>
  deleteIntegration: (platform: string) => Promise<void>
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
  const [integrationHistory, setIntegrationHistory] = useState<any[]>([])
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

    if (downloadError || !fileData) return []

    const text = await fileData.text()
    return new Promise<SMEDataRow[]>((resolve) => {
      Papa.parse(text, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const normalized = normalizeCsvData(results.data)
            resolve(normalized as SMEDataRow[])
          } else {
            resolve([])
          }
        }
      })
    })
  }

  const loadBizPOSData = async (currentData: SMEDataRow[], supabase: any, userId: string) => {
    const { data } = await supabase.from('bizpos_sales').select('*').eq('user_id', userId).order('created_at', { ascending: false })
    if (!data || data.length === 0) return currentData
    
    const bizposRows: SMEDataRow[] = data.map((row: any) => ({
      Date: row.date || row.created_at.split('T')[0],
      Product_ID: row.product_id,
      Product_Name: row.product_name,
      Category: row.category,
      Location: row.location || "Main Register",
      Sales_Channel: row.sales_channel || "In-Store",
      Units_Sold: row.units_sold,
      Revenue_BDT: Number(row.revenue_bdt),
      Unit_Price: Number(row.unit_price),
      Cost_Price: Number(row.cost_price),
      Current_Stock: row.current_stock || 0,
      Customer_Segment: row.customer_segment || "Walk-in"
    }))
    
    // Check if any bizpos row is already in currentData (by ID) to avoid duplicates if they were manually baked in
    const existingIds = new Set(currentData.map(d => d.Product_ID))
    const uniqueBizpos = bizposRows.filter(r => !existingIds.has(r.Product_ID))
    
    return [...uniqueBizpos, ...currentData]
  }

  const refreshIntegrationHistory = async () => {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
      const { data: integrations } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', session.user.id)
    
    if (integrations) {
      setIntegrationHistory(integrations)
    }
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

      await refreshIntegrationHistory()

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
          let finalData = mapIntegrationToSMEData(parsed)
          
          let platform = parsed.source || 'woocommerce'
          if (platform === 'custom_api') platform = 'custom'
          const historyMatch = integrationHistory?.find(i => i.platform === platform)
          const dbName = historyMatch?.display_name

          finalData = await loadBizPOSData(finalData, supabase, user.id)
          
          setRawData(finalData)
          setActiveIntegrationName(dbName || parsed?.business?.name)
          setConnectedIntegrationName(dbName || parsed?.business?.name)
          setIsDataUploaded(true)
          
          // Restore AI Insights for Integration
          const storedInsights = localStorage.getItem("bizanolytics_integration_insights")
          if (storedInsights) {
            setAiInsights(storedInsights)
          }
        } catch (e) {
          if (defaultDataset) {
            const data = await loadDatasetData(defaultDataset, supabase)
            const finalData = await loadBizPOSData(data || [], supabase, user.id)
            if (finalData.length > 0) {
              setRawData(finalData)
              setIsDataUploaded(true)
            }
          }
        }
      } else {
        if (defaultDataset) {
          const data = await loadDatasetData(defaultDataset, supabase)
          const finalData = await loadBizPOSData(data || [], supabase, user.id)
          if (finalData.length > 0) {
            setRawData(finalData)
            setIsDataUploaded(true)
          }
        } else {
          // Even with no dataset, load any BizPOS sales they might have
          const finalData = await loadBizPOSData([], supabase, user.id)
          if (finalData.length > 0) {
            setRawData(finalData)
            setIsDataUploaded(true)
          }
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
        let platform = parsed.source || 'woocommerce'
        if (platform === 'custom_api') platform = 'custom'
        
        // Find if we have a display name in DB history
        const historyMatch = integrations?.find(i => i.platform === platform)
        const dbName = historyMatch?.display_name
        
        setActiveIntegrationName(dbName || parsed.business?.name)
        setConnectedIntegrationName(dbName || parsed.business?.name)
        setIsDataUploaded(true)
        localStorage.setItem("bizanolytics_active_view_mode", "integration")
        
        const storedInsights = localStorage.getItem("bizanolytics_integration_insights")
        if (storedInsights) {
          setAiInsights(storedInsights)
        }
      } catch (e) {}
    }
  }

  const loadIntegrationByPlatform = async (platform: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      const toastId = toast.loading("Fetching data from integration...")
      
      const res = await fetch(`/api/integrations/sync?platform=${platform}`, {
        headers: { ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {}) }
      })
      if (res.ok) {
        const freshData = await res.json()
        localStorage.setItem("bizanolytics_integration_data", JSON.stringify(freshData))
        await loadIntegrationData()
        toast.success("Successfully loaded integration data!", { id: toastId })
      } else {
        throw new Error("Failed to load")
      }
    } catch (e) {
      toast.error("Failed to load integration data")
    }
  }

  const renameIntegration = async (platform: string, newName: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { error } = await supabase
        .from('user_integrations')
        .update({ display_name: newName })
        .eq('user_id', session.user.id)
        .eq('platform', platform)

      if (error) throw error

      await refreshIntegrationHistory()
      setActiveIntegrationName(newName)
      
      const stored = localStorage.getItem("bizanolytics_integration_data")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (!parsed.business) parsed.business = {}
        parsed.business.name = newName
        localStorage.setItem("bizanolytics_integration_data", JSON.stringify(parsed))
      }
      
      toast.success("Integration renamed successfully")
    } catch (e) {
      toast.error("Failed to rename integration")
    }
  }

  // --- Auto Sync Logic ---
  useEffect(() => {
    if (!isDataUploaded || !activeIntegrationName) return;
    
    const syncFreq = localStorage.getItem("bizanolytics_sync_freq") || "daily";
    const stored = localStorage.getItem("bizanolytics_integration_data");
    if (!stored) return;
    
    try {
      const parsed = JSON.parse(stored);
      let source = parsed.source || "woocommerce";
      if (source === "custom_api") source = "custom"; // Map to the DB platform name

      const lastScrapedAt = new Date(parsed.scrapedAt || 0).getTime();
      const now = Date.now();
      
      const doSync = async () => {
        try {
          const supabase = createClient()
          const { data: { session } } = await supabase.auth.getSession()
          const res = await fetch(`/api/integrations/sync?platform=${source}`, {
            headers: {
              ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {})
            }
          });
          if (res.ok) {
            const freshData = await res.json();
            localStorage.setItem("bizanolytics_integration_data", JSON.stringify(freshData));
            // Invalidate old insights since data changed
            localStorage.removeItem("bizanolytics_integration_insights");
            loadIntegrationData(); // Reload UI
            console.log("Background sync completed for", source);
          }
        } catch (err) {
          console.error("Background sync failed", err);
        }
      };

      if (syncFreq === "instant") {
        // Fetch now and set interval for every 3 minutes
        doSync();
        const intervalId = setInterval(doSync, 3 * 60 * 1000);
        return () => clearInterval(intervalId);
      } else if (syncFreq === "hourly") {
        if (now - lastScrapedAt > 60 * 60 * 1000) {
          doSync();
        }
        const intervalId = setInterval(() => {
          if (Date.now() - new Date(JSON.parse(localStorage.getItem("bizanolytics_integration_data") || "{}").scrapedAt || 0).getTime() > 60 * 60 * 1000) {
            doSync();
          }
        }, 5 * 60 * 1000); // check every 5 minutes if an hour has passed
        return () => clearInterval(intervalId);
      } else if (syncFreq === "daily") {
        if (now - lastScrapedAt > 24 * 60 * 60 * 1000) {
          doSync();
        }
      }
    } catch (e) {}
  }, [isDataUploaded, activeIntegrationName]);


  const loadDatasetById = async (id: string) => {
    const supabase = createClient()
    const dataset = datasetHistory.find(d => d.id === id)
    if (!dataset) return
    localStorage.setItem("bizanolytics_active_view_mode", "dataset")
    
    const { data: { session } } = await supabase.auth.getSession()
    const data = await loadDatasetData(dataset, supabase)
    
    if (session?.user) {
      const finalData = await loadBizPOSData(data || [], supabase, session.user.id)
      setRawData(finalData)
      setIsDataUploaded(true)
    } else if (data) {
      setRawData(data)
      setIsDataUploaded(true)
    }
  }

  const renameDataset = async (id: string, newName: string) => {
    const supabase = createClient()
    const { error } = await supabase.from('datasets').update({ file_name: newName }).eq('id', id)
    if (!error) {
      setDatasetHistory(prev => prev.map(d => d.id === id ? { ...d, file_name: newName } : d))
    }
  }

  const deleteDataset = async (id: string) => {
    try {
      const supabase = createClient()
      const dataset = datasetHistory.find(d => d.id === id)
      if (!dataset) return
      
      const { error } = await supabase.from('datasets').delete().eq('id', id)
      if (error) throw error

      await supabase.storage.from('user_datasets').remove([dataset.file_path])

      setDatasetHistory(prev => prev.filter(d => d.id !== id))
      if (datasetId === id) {
        resetData()
      }
      toast.success("Dataset removed")
    } catch (e) {
      toast.error("Failed to remove dataset")
    }
  }

  const deleteIntegration = async (platform: string) => {
    try {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return

      const { error } = await supabase
        .from('user_integrations')
        .delete()
        .eq('user_id', session.user.id)
        .eq('platform', platform)

      if (error) throw error

      setIntegrationHistory(prev => prev.filter(i => i.platform !== platform))
      
      const stored = localStorage.getItem("bizanolytics_integration_data")
      if (stored) {
        const parsed = JSON.parse(stored)
        let storedPlatform = parsed.source || 'woocommerce'
        if (storedPlatform === 'custom_api') storedPlatform = 'custom'
        if (storedPlatform === platform) {
          resetData()
        }
      }
      toast.success("Integration removed")
    } catch (e) {
      toast.error("Failed to remove integration")
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
      refreshIntegrationHistory() // Re-fetch integrations so new ones appear in header
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
    if (notifications.length > 0 && notifications[0].title === title && notifications[0].message === message) {
      const timeDiff = Date.now() - new Date(notifications[0].created_at).getTime()
      if (timeDiff < 10000) return; // Deduplicate identical notifications within 10s
    }

    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      const { data, error } = await supabase.from('notifications').insert({
        user_id: session.user.id,
        title,
        message
      }).select().single()
      
      if (data && !error) {
        setNotifications(prev => [data, ...prev])
        toast.info(title, { description: message })
      }
    } else {
      // For anonymous users testing locally
      const mockId = `mock-${Date.now()}`
      setNotifications(prev => [{ id: mockId, title, message, is_read: false, created_at: new Date().toISOString() }, ...prev])
      toast.info(title, { description: message })
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
      integrationHistory, loadIntegrationByPlatform,
      refreshIntegrationHistory, renameIntegration, deleteIntegration,
      deleteDataset, recordPipelineRun
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
