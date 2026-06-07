"use client"

import { BizPOS } from "../components/BizPOS"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { useData } from "@/contexts/DataContext"

export default function BizPOSPage() {
  const router = useRouter()
  const { setUploadedData, addNotification, recordPipelineRun } = useData()

  const handleComplete = () => {
    addNotification("BizPOS Connected", "Successfully synced live data from BizPOS.")
    recordPipelineRun(1)
    router.push("/dashboard")
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      <Link href="/integrations" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Integrations Hub
      </Link>
      <BizPOS onComplete={handleComplete} />
    </div>
  )
}
