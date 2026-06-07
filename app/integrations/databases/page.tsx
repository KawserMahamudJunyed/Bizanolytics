"use client"

import { DatabaseConnect } from "../components/DatabaseConnect"
import { useRouter } from "next/navigation"
import { useData } from "@/contexts/DataContext"
import { mapIntegrationToSMEData } from "../utils/normalize"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const STORAGE_KEY = "bizanolytics_integration_data"

export default function DatabasesPage() {
  const router = useRouter()
  const { setUploadedData, addNotification } = useData()

  const handleDataReady = (newData: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    setUploadedData(mapIntegrationToSMEData(newData), undefined, newData.business.name)
    addNotification("Database Connected", "Successfully synced data from your external Database.")
    router.push("/dashboard")
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link href="/integrations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Integrations Hub
      </Link>
      <DatabaseConnect onDataReady={handleDataReady} />
    </div>
  )
}
