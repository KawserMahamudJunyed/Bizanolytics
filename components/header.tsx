"use client"

import { motion } from "framer-motion"
import { Plus, Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="sticky top-0 z-30 flex min-h-[80px] items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-md lg:px-8"
    >
      <div className="flex flex-col gap-1 pt-2 lg:pt-0">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          Hello, John!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-sm text-muted-foreground"
        >
          {"It's good to see you again. Here's your forecast overview."}
        </motion.p>
      </div>

    </motion.header>
  )
}
