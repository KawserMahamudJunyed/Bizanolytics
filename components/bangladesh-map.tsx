"use client"

import dynamic from "next/dynamic"

const BangladeshMapInner = dynamic(() => import("./bangladesh-map-inner"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <div className="h-4 w-4 rounded-full bg-secondary animate-pulse" />
          Loading Map...
        </h3>
        <div className="mt-1 h-3 w-48 rounded bg-secondary animate-pulse" />
      </div>
      <div className="flex h-[500px] w-full items-center justify-center rounded-xl border border-border bg-secondary/30">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent" />
      </div>
    </div>
  ),
})

export function BangladeshMap() {
  return <BangladeshMapInner />
}
