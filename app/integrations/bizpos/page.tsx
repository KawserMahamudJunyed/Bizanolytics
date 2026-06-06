"use client"

import { BizPOS } from "../components/BizPOS"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function BizPOSPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/integrations")
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
