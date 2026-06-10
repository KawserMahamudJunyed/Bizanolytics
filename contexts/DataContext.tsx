"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react"
import Papa from "papaparse"
import { normalizeCsvData } from "@/lib/normalizeCsv"
import { toast } from "sonner"
import { apiClient } from "@/lib/api"
import { isAuthenticated, getUser, clearTokens } from "@/lib/auth"

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
  fileName: string
  createdAt: string
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
  uploadCsvFile: (file: File, type?: string) => Promise<any>
  deleteDataset: (id: string) => Promise<void>
  activeViewMode: 'dataset' | 'integration'
  setViewMode: (mode: 'dataset' | 'integration') => Promise<void>
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<SMEDataRow[]>([])
  const [isDataUploaded, setIsDataUploaded] = useState(false)
  const [activeViewMode, setActiveViewModeState] = useState<'dataset' | 'integration'>('dataset')
  const [datasetId, setDatasetId] = useState<string>()
  const [datasetHistory, setDatasetHistory] = useState<DatasetMeta[]>([])
  const [integrationHistory, setIntegrationHistory] = useState<any[]>([])
  const [activeIntegrationName, setActiveIntegrationName] = useState<string>()
  const [connectedIntegrationName, setConnectedIntegrationName] = useState<string>()
  const [aiInsights, setAiInsights] = useState<string>()
  const [userCurrency, setUserCurrency] = useState<string>("BDT")
  const [notifications, setNotifications] = useState<Notification[]>([])

  const unreadNotificationsCount = notifications.filter(n => !n.is_read).length

  // ── Integration helpers (data stored in localStorage for compatibility) ──────
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
        const historyMatch = integrationHistory?.find((i: any) => i.platform === platform)
        const dbName = historyMatch?.display_name
        setActiveIntegrationName(dbName || parsed.business?.name)
        setConnectedIntegrationName(dbName || parsed.business?.name)
        setIsDataUploaded(true)
        localStorage.setItem("bizanolytics_active_view_mode", "integration")
        const storedInsights = localStorage.getItem("bizanolytics_integration_insights")
        if (storedInsights) setAiInsights(storedInsights)
      } catch (e) {}
    }
  }

  // Set view mode with side effects
  const setViewMode = async (mode: 'dataset' | 'integration') => {
    setActiveViewModeState(mode)
    localStorage.setItem("bizanolytics_active_view_mode", mode)
    if (mode === "integration") {
      await loadIntegrationData()
    } else {
      try {
        const res = await apiClient.get<{ data: SMEDataRow[]; pagination: any }>(
          '/api/v1/dashboard/raw-data'
        )
        if (res.data && res.data.length > 0) {
          setRawData(res.data)
          setIsDataUploaded(true)
        } else {
          setRawData([])
          setIsDataUploaded(false)
        }
      } catch (err) {
        console.error('Failed to load raw data from DataBox:', err)
      }
    }
  }

  // ── Load raw data from DataBox on mount (if user is authenticated) ──────────
  useEffect(() => {
    if (!isAuthenticated()) return

    async function loadInitialData() {
      const activeMode = (localStorage.getItem("bizanolytics_active_view_mode") as 'dataset' | 'integration') || 'dataset'
      setActiveViewModeState(activeMode)
      if (activeMode === "integration") {
        await loadIntegrationData()
      } else {
        try {
          const res = await apiClient.get<{ data: SMEDataRow[]; pagination: any }>(
            '/api/v1/dashboard/raw-data'
          )
          if (res.data && res.data.length > 0) {
            setRawData(res.data)
            setIsDataUploaded(true)
          }
        } catch (err) {
          console.error('Failed to load raw data from DataBox:', err)
        }
      }

      try {
        const dRes = await apiClient.get<{ datasets: any[] }>('/api/v1/data/datasets')
        if (dRes.datasets) {
          setDatasetHistory(dRes.datasets)
        }
      } catch (err) {
        console.error('Failed to load datasets:', err)
      }

      // Notifications
      try {
        const notifRes = await apiClient.get<{ notifications: any[]; unreadCount: number }>(
          '/api/v1/notifications'
        )
        if (notifRes.notifications) {
          // Map backend shape to local Notification type
          const mapped: Notification[] = notifRes.notifications.map((n: any) => ({
            id: n.id,
            title: n.title ?? n.type ?? 'Notification',
            message: n.message ?? '',
            is_read: n.read ?? false,
            created_at: n.createdAt ?? new Date().toISOString(),
          }))
          setNotifications(mapped)
        }
      } catch (err) {
        console.error('Failed to load notifications:', err)
      }
    }

    loadInitialData()
  }, [])

  // ── Upload CSV to DataBox ────────────────────────────────────────────────────
  const uploadCsvFile = useCallback(async (file: File, type = 'sales') => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const toastId = toast.loading('Uploading data...')
    try {
      const res = await apiClient.upload<{
        rowsInserted: number
        rowsSkipped: number
        message: string
        datasetId?: string
      }>('/api/v1/data/upload', formData)

      toast.success(
        `${res.message} (${res.rowsInserted} rows inserted, ${res.rowsSkipped} skipped)`,
        { id: toastId }
      )

      // Re-fetch raw data after upload
      const fresh = await apiClient.get<{ data: SMEDataRow[] }>('/api/v1/dashboard/raw-data')
      if (fresh.data) {
        setRawData(fresh.data)
        setIsDataUploaded(true)
      }
      
      const freshDataRes = await apiClient.get<{ datasets: any[] }>('/api/v1/data/datasets')
      if (freshDataRes.datasets) {
        setDatasetHistory(freshDataRes.datasets)
      }

      if (res.datasetId) {
        setDatasetId(res.datasetId)
      }
      return res
    } catch (err: any) {
      toast.error(`Upload failed: ${err.message}`, { id: toastId })
      throw err
    }
  }, [])



  const loadIntegrationByPlatform = async (platform: string) => {
    const toastId = toast.loading("Fetching data from integration...")
    try {
      // Integration sync goes through DataBox
      const freshData = await apiClient.get<any>(`/api/v1/integrations/${platform}`)
      localStorage.setItem("bizanolytics_integration_data", JSON.stringify(freshData))
      await loadIntegrationData()
      toast.success("Successfully loaded integration data!", { id: toastId })
    } catch (e) {
      toast.error("Failed to load integration data", { id: toastId })
    }
  }

  const refreshIntegrationHistory = async () => {
    // Integration history is local for now; can be wired to a DataBox endpoint later
  }

  const renameIntegration = async (platform: string, newName: string) => {
    try {
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

  const loadDatasetById = async (id: string) => {
    // Datasets are identified by rawData fetched from DataBox; this is kept for API compatibility
    localStorage.setItem("bizanolytics_active_view_mode", "dataset")
    setDatasetId(id)
  }

  const renameDataset = async (id: string, newName: string) => {
    setDatasetHistory(prev => prev.map(d => d.id === id ? { ...d, fileName: newName } : d))
  }

  const deleteDataset = async (id: string) => {
    const toastId = toast.loading('Deleting dataset...')
    try {
      await apiClient.delete(`/api/v1/data/datasets/${id}`)
      toast.success('Dataset deleted successfully!', { id: toastId })
      
      const dRes = await apiClient.get<{ datasets: any[] }>('/api/v1/data/datasets')
      setDatasetHistory(dRes.datasets || [])
      
      const res = await apiClient.get<{ data: SMEDataRow[] }>('/api/v1/dashboard/raw-data')
      if (res.data && res.data.length > 0) {
        setRawData(res.data)
        setIsDataUploaded(true)
      } else {
        setRawData([])
        setIsDataUploaded(false)
      }
    } catch (err: any) {
      toast.error(`Failed to delete dataset: ${err.message}`, { id: toastId })
    }
  }

  const setUploadedData = (data: SMEDataRow[], id?: string, integrationName?: string) => {
    setRawData(data)
    setIsDataUploaded(true)
    setDatasetId(id)
    setActiveIntegrationName(integrationName)
    if (integrationName) {
      setConnectedIntegrationName(integrationName)
      setActiveViewModeState('integration')
      localStorage.setItem("bizanolytics_active_view_mode", "integration")
    } else {
      setActiveViewModeState('dataset')
      localStorage.setItem("bizanolytics_active_view_mode", "dataset")
    }
    setAiInsights(undefined)
  }

  const resetData = () => {
    setRawData([])
    setIsDataUploaded(false)
    setDatasetId(undefined)
    setAiInsights(undefined)
    setActiveIntegrationName(undefined)
    setActiveViewModeState('dataset')
    localStorage.removeItem("bizanolytics_active_view_mode")
  }


  // ── Notifications ────────────────────────────────────────────────────────────
  const markNotificationAsRead = async (id: string) => {
    try {
      await apiClient.patch(`/api/v1/notifications/${id}/read`)
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    } catch (e) {
      console.error('Failed to mark notification as read', e)
    }
  }

  const markAllNotificationsAsRead = async () => {
    try {
      await apiClient.patch('/api/v1/notifications/all/read')
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    } catch (e) {
      console.error('Failed to mark all notifications as read', e)
    }
  }

  const addNotification = useCallback(async (title: string, message: string) => {
    const mockId = `local-${Date.now()}`
    const newNotif: Notification = {
      id: mockId,
      title,
      message,
      is_read: false,
      created_at: new Date().toISOString(),
    }
    setNotifications(prev => [newNotif, ...prev])
    toast.info(title, { description: message })

    // Persist to DataBox if authenticated
    if (isAuthenticated()) {
      try {
        const saved = await apiClient.post<any>('/api/v1/notifications', { title, message })
        // Replace temp entry with server-assigned id
        setNotifications(prev =>
          prev.map(n => n.id === mockId ? { ...n, id: saved.id } : n)
        )
      } catch (e) {}
    }
  }, [])

  const saveAiInsights = useCallback((insights: string) => {
    setAiInsights(insights)
    if (activeIntegrationName) {
      localStorage.setItem("bizanolytics_integration_insights", insights)
    }
    addNotification("AI Forecast Generated", "Your new business forecast and AI insights are ready to view.")
  }, [activeIntegrationName, addNotification])

  const recordPipelineRun = async (_records: number, _sourceName: string) => {
    // Can wire to POST /api/v1/dashboard/pipeline/trigger if needed
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
      refreshIntegrationHistory, renameIntegration,
      recordPipelineRun,
      uploadCsvFile,
      deleteDataset,
      activeViewMode,
      setViewMode
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
