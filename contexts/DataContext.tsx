"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { apiRequest } from "@/lib/api"

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
  setUploadedData: (data: SMEDataRow[]) => void
  resetData: () => void
  loading: boolean
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [rawData, setRawData] = useState<SMEDataRow[]>([])
  const [isDataUploaded, setIsDataUploaded] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const response = await apiRequest('/dashboard/raw-data');
        if (response && response.data && response.data.length > 0) {
          setRawData(response.data);
          setIsDataUploaded(true);
        }
      } catch (err) {
        console.error('Failed to load raw data from backend:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const setUploadedData = (data: SMEDataRow[]) => {
    setRawData(data)
    setIsDataUploaded(true)
  }

  const resetData = () => {
    setRawData([])
    setIsDataUploaded(false)
  }

  return (
    <DataContext.Provider value={{ isDataUploaded, rawData, setUploadedData, resetData, loading }}>
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

