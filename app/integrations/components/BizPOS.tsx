"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Save, Calendar, Tag, Calculator, Loader2, Minus, History, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/DataContext"
import { toast } from "sonner"
import type { SMEDataRow } from "@/contexts/DataContext"
import { formatCurrency, CURRENCY_SYMBOLS, CurrencyCode } from "@/utils/currency"

const QUICK_PRODUCTS = [
  { name: "Vintage T-Shirt", price: 25, category: "Apparel" },
  { name: "Coffee Mug", price: 12, category: "Accessories" },
  { name: "Tote Bag", price: 18, category: "Accessories" },
  { name: "Sticker Pack", price: 5, category: "Stationery" },
]

export function BizPOS({ onComplete }: { onComplete: () => void }) {
  const [isSaving, setIsSaving] = useState(false)
  const { rawData, setUploadedData, userCurrency } = useData()
  
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [product, setProduct] = useState("")
  const [category, setCategory] = useState("")
  const [unitsSold, setUnitsSold] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number | "">("")
  const [stockLeft, setStockLeft] = useState<number | "">("")

  // Session history
  const [recentLogs, setRecentLogs] = useState<SMEDataRow[]>([])

  const totalRevenue = useMemo(() => {
    if (typeof unitPrice === "number" && typeof unitsSold === "number") {
      return (unitPrice * unitsSold).toFixed(2)
    }
    return "0.00"
  }, [unitsSold, unitPrice])

  const handleQuickAdd = (item: typeof QUICK_PRODUCTS[0]) => {
    setProduct(item.name)
    setCategory(item.category)
    setUnitPrice(item.price)
    setUnitsSold(1)
  }

  const handleSave = async () => {
    if (!product.trim() || unitsSold <= 0 || unitPrice === "") {
      toast.error("Please provide a product name, valid quantity, and unit price.")
      return
    }

    setIsSaving(true)
    
    // Simulate API save delay
    await new Promise(r => setTimeout(r, 600))

    const newRecord: SMEDataRow = {
      Product_ID: `POS-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      Date: date,
      Category: category || "Uncategorized",
      Units_Sold: unitsSold,
      Revenue_BDT: unitsSold * (unitPrice as number), // Total revenue
      Unit_Price: unitPrice as number,
      Current_Stock: stockLeft === "" ? 0 : stockLeft,
      Product_Name: product,
      Location: "Main Register",
      Sales_Channel: "In-Store",
      Cost_Price: (unitPrice as number) * 0.5, // Mock cost
      Customer_Segment: "Walk-in"
    }

    const newData = [newRecord, ...rawData]
    setUploadedData(newData, `pos-entry-${Date.now()}`)
    
    setRecentLogs(prev => [newRecord, ...prev])
    setIsSaving(false)
    toast.success(`Logged: ${unitsSold}x ${product}`)
    
    // Clear form for rapid entry
    setProduct("")
    setCategory("")
    setUnitsSold(1)
    setUnitPrice("")
    setStockLeft("")
  }

  return (
    <div className="card-base max-w-2xl mx-auto border-border bg-card overflow-hidden">
      {/* Header / Terminal Display */}
      <div className="bg-secondary/50 p-6 border-b border-border relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Calculator className="w-32 h-32 text-primary" />
        </div>
        
        <div className="flex justify-between items-start relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">BizPOS Terminal Active</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground">Smart Register</h3>
          </div>
          
          <button 
            onClick={onComplete}
            className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 flex flex-col items-end">
          <span className="text-xs font-medium text-muted-foreground mb-1">Current Sale Total</span>
          <span className="text-4xl md:text-5xl font-mono font-bold text-primary tracking-tight">
            {formatCurrency(Number(totalRevenue), userCurrency)}
          </span>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Actions */}
        <div className="mb-6">
          <label className="block text-xs font-medium text-muted-foreground mb-2">Quick Select</label>
          <div className="flex flex-wrap gap-2">
            {QUICK_PRODUCTS.map(item => (
              <button
                key={item.name}
                onClick={() => handleQuickAdd(item)}
                className="px-3 py-1.5 rounded-full text-xs font-medium border border-border bg-secondary/50 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3" />
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Product Name</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                <input
                  type="text"
                  placeholder="e.g. Custom Widget"
                  value={product}
                  onChange={e => setProduct(e.target.value)}
                  className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Quantity</label>
              <div className="flex items-center w-full rounded-xl border border-border bg-secondary/50 overflow-hidden focus-within:ring-2 focus-within:ring-primary/30">
                <button 
                  onClick={() => setUnitsSold(Math.max(1, unitsSold - 1))}
                  className="px-3 py-2.5 hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={unitsSold}
                  onChange={e => setUnitsSold(parseInt(e.target.value) || 1)}
                  className="w-full bg-transparent py-2.5 text-center text-sm font-medium outline-none"
                />
                <button 
                  onClick={() => setUnitsSold(unitsSold + 1)}
                  className="px-3 py-2.5 hover:bg-secondary text-muted-foreground transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Unit Price ({CURRENCY_SYMBOLS[userCurrency as CurrencyCode] || "৳"})</label>
              <input
                type="number"
                placeholder="0.00"
                value={unitPrice}
                onChange={e => setUnitPrice(parseFloat(e.target.value) || "")}
                className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none font-mono"
              />
            </div>
            
            <div className="col-span-3 sm:col-span-1">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">Stock Left</label>
              <input
                type="number"
                placeholder="Optional"
                value={stockLeft}
                onChange={e => setStockLeft(parseInt(e.target.value) || "")}
                className="w-full rounded-xl border border-border bg-secondary/50 py-2.5 px-3 text-sm focus:ring-2 focus:ring-primary/30 outline-none"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ scale: isSaving ? 1 : 1.01 }}
            whileTap={{ scale: isSaving ? 1 : 0.99 }}
            onClick={handleSave}
            disabled={isSaving}
            className={cn(
              "w-full flex items-center justify-center gap-2 rounded-xl py-3.5 mt-2 text-sm font-semibold transition-all",
              isSaving 
                ? "bg-secondary text-primary cursor-wait" 
                : "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:bg-primary/90"
            )}
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {isSaving ? "Saving..." : "Checkout & Log Sale"}
          </motion.button>
        </div>

        {/* Recent Logs (Session History) */}
        {recentLogs.length > 0 && (
          <div className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 mb-4 text-muted-foreground">
              <History className="w-4 h-4" />
              <h4 className="text-xs font-medium uppercase tracking-wider">Session Log</h4>
            </div>
            
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
              <AnimatePresence>
                {recentLogs.map((log, i) => (
                  <motion.div
                    key={log.Product_ID + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">{log.Units_Sold}x {log.Product_Name}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(log.Date).toLocaleTimeString()} - {log.Category}</p>
                    </div>
                    <div className="text-right font-mono font-medium text-foreground">
                      {formatCurrency(log.Revenue_BDT, userCurrency)}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
