"use client"

import { OwnerConnect } from "../components/OwnerConnect"
import { useRouter } from "next/navigation"
import { useData } from "@/contexts/DataContext"
import { mapIntegrationToSMEData } from "../utils/normalize"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

const STORAGE_KEY = "bizanolytics_integration_data"

export default function POSPage() {
  const router = useRouter()
  const { setUploadedData } = useData()

  const handleDataReady = (newData: any) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    setUploadedData(mapIntegrationToSMEData(newData))
    router.push("/integrations")
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link href="/integrations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Integrations Hub
      </Link>
      <OwnerConnect mode="pos" onDataReady={handleDataReady} />
    </div>
  )
}
