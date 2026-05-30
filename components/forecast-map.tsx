"use client"

import { useState, useMemo, memo, useCallback } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, TrendingUp, TrendingDown, ZoomIn, ZoomOut, RotateCcw, Globe, X } from "lucide-react"
import { cn } from "@/lib/utils"

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json"

// Forecast data by country (ISO 3166-1 numeric codes)
const forecastData: Record<string, CountryForecast> = {
  // Asia Pacific
  "050": { name: "Bangladesh", demand: 18500, growth: 25.4, confidence: 89, region: "Asia Pacific", stock: 12000 },
  "840": { name: "United States", demand: 48500, growth: 12.4, confidence: 94, region: "North America", stock: 52000 },
  "124": { name: "Canada", demand: 12800, growth: 8.2, confidence: 91, region: "North America", stock: 14200 },
  "484": { name: "Mexico", demand: 9200, growth: 15.6, confidence: 87, region: "North America", stock: 8100 },
  // Europe
  "826": { name: "United Kingdom", demand: 22100, growth: 6.8, confidence: 92, region: "Europe", stock: 24500 },
  "276": { name: "Germany", demand: 28400, growth: 9.1, confidence: 95, region: "Europe", stock: 31000 },
  "250": { name: "France", demand: 18900, growth: 5.4, confidence: 90, region: "Europe", stock: 20100 },
  "380": { name: "Italy", demand: 14200, growth: -2.1, confidence: 88, region: "Europe", stock: 16800 },
  "724": { name: "Spain", demand: 11800, growth: 7.3, confidence: 86, region: "Europe", stock: 13200 },
  "528": { name: "Netherlands", demand: 8900, growth: 11.2, confidence: 93, region: "Europe", stock: 9500 },
  "756": { name: "Switzerland", demand: 7200, growth: 4.8, confidence: 94, region: "Europe", stock: 7800 },
  "616": { name: "Poland", demand: 6800, growth: 18.4, confidence: 85, region: "Europe", stock: 5200 },
  "752": { name: "Sweden", demand: 5400, growth: 3.2, confidence: 91, region: "Europe", stock: 5900 },
  // Asia Pacific
  "156": { name: "China", demand: 62000, growth: 18.7, confidence: 89, region: "Asia Pacific", stock: 55000 },
  "392": { name: "Japan", demand: 31200, growth: 3.4, confidence: 93, region: "Asia Pacific", stock: 33500 },
  "410": { name: "South Korea", demand: 16800, growth: 14.2, confidence: 91, region: "Asia Pacific", stock: 15200 },
  "356": { name: "India", demand: 38500, growth: 24.6, confidence: 86, region: "Asia Pacific", stock: 28000 },
  "036": { name: "Australia", demand: 11400, growth: 7.8, confidence: 92, region: "Asia Pacific", stock: 12800 },
  "702": { name: "Singapore", demand: 5600, growth: 9.4, confidence: 94, region: "Asia Pacific", stock: 6200 },
  "360": { name: "Indonesia", demand: 8900, growth: 21.3, confidence: 83, region: "Asia Pacific", stock: 6400 },
  // South America
  "076": { name: "Brazil", demand: 22800, growth: 16.8, confidence: 85, region: "South America", stock: 18500 },
  "032": { name: "Argentina", demand: 6200, growth: -4.3, confidence: 78, region: "South America", stock: 7800 },
  "152": { name: "Chile", demand: 4800, growth: 8.9, confidence: 84, region: "South America", stock: 5100 },
  "170": { name: "Colombia", demand: 5400, growth: 12.1, confidence: 82, region: "South America", stock: 4200 },
  // Middle East & Africa
  "784": { name: "UAE", demand: 9800, growth: 22.4, confidence: 88, region: "Middle East & Africa", stock: 7600 },
  "682": { name: "Saudi Arabia", demand: 8400, growth: 19.6, confidence: 86, region: "Middle East & Africa", stock: 6800 },
  "710": { name: "South Africa", demand: 7200, growth: 11.8, confidence: 81, region: "Middle East & Africa", stock: 6200 },
  "566": { name: "Nigeria", demand: 5800, growth: 28.4, confidence: 76, region: "Middle East & Africa", stock: 3200 },
  "818": { name: "Egypt", demand: 4600, growth: 15.2, confidence: 79, region: "Middle East & Africa", stock: 3800 },
}

interface CountryForecast {
  name: string
  demand: number
  growth: number
  confidence: number
  region: string
  stock: number
}



const regions = ["All Regions", "North America", "Europe", "Asia Pacific", "South America", "Middle East & Africa"]

// Color scale for heatmap based on demand intensity
function getDemandColor(demand: number, isHighlighted: boolean): string {
  if (!isHighlighted) return "var(--secondary)"
  
  if (demand >= 40000) return "#7c3aed"      // violet-600
  if (demand >= 25000) return "#8b5cf6"      // violet-500
  if (demand >= 15000) return "#a78bfa"      // violet-400
  if (demand >= 8000) return "#c4b5fd"       // violet-300
  if (demand >= 4000) return "#ddd6fe"       // violet-200
  return "#ede9fe"                           // violet-100
}

function getDemandColorDark(demand: number, isHighlighted: boolean): string {
  if (!isHighlighted) return "var(--secondary)"
  
  if (demand >= 40000) return "#7c3aed"
  if (demand >= 25000) return "#6d28d9"
  if (demand >= 15000) return "#5b21b6"
  if (demand >= 8000) return "#4c1d95"
  if (demand >= 4000) return "#3b0764"
  return "#2e1065"
}

const legendItems = [
  { label: "60k+", color: "#7c3aed" },
  { label: "25k+", color: "#8b5cf6" },
  { label: "15k+", color: "#a78bfa" },
  { label: "8k+", color: "#c4b5fd" },
  { label: "4k+", color: "#ddd6fe" },
  { label: "<4k", color: "#ede9fe" },
]

const MemoizedGeography = memo(function MemoizedGeo({
  geo,
  forecastInfo,
  isHighlighted,
  isSelected,
  onClick,
}: {
  geo: any
  forecastInfo: CountryForecast | undefined
  isHighlighted: boolean
  isSelected: boolean
  onClick: (geo: any) => void
}) {
  const fillColor = forecastInfo
    ? getDemandColor(forecastInfo.demand, isHighlighted)
    : "var(--secondary)"

  return (
    <Geography
      geography={geo}
      onClick={() => onClick(geo)}
      className="focus:outline-none"
      style={{
        default: {
          fill: fillColor,
          stroke: isSelected ? "#3b82f6" : "var(--border)",
          strokeWidth: isSelected ? 1.5 : 0.5,
        },
        hover: {
          fill: forecastInfo ? "#6d28d9" : "var(--accent)",
          stroke: isSelected ? "#3b82f6" : "var(--foreground)",
          strokeWidth: isSelected ? 1.5 : 1,
          cursor: forecastInfo ? "pointer" : "default",
        },
        pressed: {
          fill: forecastInfo ? "#5b21b6" : "var(--accent)",
        },
      }}
    />
  )
})

export function ForecastMap() {
  const [selectedCountry, setSelectedCountry] = useState<CountryForecast | null>(null)
  const [selectedRegion, setSelectedRegion] = useState("All Regions")
  const [position, setPosition] = useState({ coordinates: [0, 20] as [number, number], zoom: 1 })

  const filteredCountries = useMemo(() => {
    if (selectedRegion === "All Regions") return forecastData
    return Object.fromEntries(
      Object.entries(forecastData).filter(([_, v]) => v.region === selectedRegion)
    )
  }, [selectedRegion])

  const regionStats = useMemo(() => {
    const entries = Object.values(filteredCountries)
    const totalDemand = entries.reduce((sum, c) => sum + c.demand, 0)
    const totalStock = entries.reduce((sum, c) => sum + c.stock, 0)
    const avgConfidence = Math.round(entries.reduce((sum, c) => sum + c.confidence, 0) / entries.length)
    const avgGrowth = +(entries.reduce((sum, c) => sum + c.growth, 0) / entries.length).toFixed(1)
    return { totalDemand, totalStock, avgConfidence, avgGrowth, count: entries.length }
  }, [filteredCountries])



  const handleZoomIn = () => {
    if (position.zoom >= 4) return
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 1.5 }))
  }

  const handleZoomOut = () => {
    if (position.zoom <= 1) return
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 1.5 }))
  }

  const handleReset = () => {
    setPosition({ coordinates: [0, 20], zoom: 1 })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="card-base overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col gap-4 p-6 pb-0 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Globe className="h-4 w-4 text-foreground" />
            Demand Forecast Maps
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Interactive heatmap of AI-predicted demand across {regionStats.count} markets
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          {/* Region Filter */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-card/50 p-1">
            {regions.map((region) => (
              <motion.button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={cn(
                  "relative flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                  selectedRegion === region
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {selectedRegion === region && (
                  <motion.div
                    layoutId="regionTabBackground"
                    className="absolute inset-0 rounded-lg bg-secondary"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                  />
                )}
                <span className="relative z-10">{region}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="mx-6 mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Total Demand", value: `${(regionStats.totalDemand / 1000).toFixed(0)}k`, sub: "units" },
          { label: "Total Stock", value: `${(regionStats.totalStock / 1000).toFixed(0)}k`, sub: "units" },
          { label: "Avg Confidence", value: `${regionStats.avgConfidence}%`, sub: "accuracy" },
          {
            label: "Avg Growth",
            value: `${regionStats.avgGrowth > 0 ? "+" : ""}${regionStats.avgGrowth}%`,
            sub: "vs last period",
            positive: regionStats.avgGrowth >= 0,
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.05, duration: 0.3 }}
            className="rounded-xl bg-secondary/60 px-3 py-2.5"
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{stat.label}</p>
            <p className={cn(
              "mt-0.5 text-lg font-semibold tabular-nums",
              stat.positive !== undefined
                ? stat.positive
                  ? "text-emerald-500"
                  : "text-red-500"
                : "text-foreground"
            )}>
              {stat.value}
            </p>
            <p className="text-[10px] text-muted-foreground">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Map Area */}
      <div className="relative mx-6 mt-4 mb-2 overflow-hidden rounded-xl border border-border bg-secondary/30">
          {/* Zoom Controls */}
          <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomIn}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/90 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleZoomOut}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/90 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReset}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card/90 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </motion.button>
          </div>

          {/* Selected Country Details */}
          <AnimatePresence>
            {selectedCountry && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.2 }}
                className="pointer-events-auto absolute bottom-4 left-4 right-4 z-50 sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:w-64 rounded-xl border border-border bg-card/95 p-4 shadow-2xl backdrop-blur-md"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{selectedCountry.name}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedCountry(null)}
                    className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Demand</span>
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                      {selectedCountry.demand.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Stock</span>
                    <span className="text-xs font-semibold tabular-nums text-foreground">
                      {selectedCountry.stock.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Growth</span>
                    <span
                      className={cn(
                        "flex items-center gap-1 text-xs font-semibold tabular-nums",
                        selectedCountry.growth >= 0 ? "text-emerald-500" : "text-red-500"
                      )}
                    >
                      {selectedCountry.growth >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {selectedCountry.growth > 0 ? "+" : ""}
                      {selectedCountry.growth}%
                    </span>
                  </div>
                </div>

                {/* Stock vs Demand indicator */}
                <div className="mt-3 rounded-lg bg-secondary/80 px-2 py-1.5">
                  <div className="flex items-center gap-1.5">
                    {selectedCountry.stock >= selectedCountry.demand ? (
                      <>
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-medium text-emerald-500">Stock sufficient</span>
                      </>
                    ) : (
                      <>
                        <div className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[10px] font-medium text-amber-500">
                          Shortage: {(selectedCountry.demand - selectedCountry.stock).toLocaleString()} units
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Map SVG */}
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 130,
              center: [0, 20],
            }}
            style={{ width: "100%", height: "auto" }}
            width={800}
            height={450}
          >
            <ZoomableGroup
              zoom={position.zoom}
              center={position.coordinates}
              onMoveEnd={(pos) => setPosition(pos as any)}
            >
              <Geographies geography={GEO_URL}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const countryId = geo.id
                    const forecastInfo = filteredCountries[countryId]
                    const isHighlighted =
                      selectedRegion === "All Regions"
                        ? !!forecastData[countryId]
                        : !!forecastInfo

                    return (
                      <MemoizedGeography
                        key={geo.rsmKey}
                        geo={geo}
                        forecastInfo={forecastInfo}
                        isHighlighted={isHighlighted}
                        isSelected={selectedCountry?.name === forecastInfo?.name && forecastInfo !== undefined}
                        onClick={(clickedGeo) => {
                            const data = forecastData[clickedGeo.id]
                            if (data) {
                                setSelectedCountry(data)
                            } else {
                                setSelectedCountry(null)
                            }
                        }}
                      />
                    )
                  })
                }
              </Geographies>
            </ZoomableGroup>
          </ComposableMap>
        </div>

      {/* Bottom: Top Markets */}
      <div className="px-6 pb-6 pt-2">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Top Markets by Forecasted Demand
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {Object.values(filteredCountries)
            .sort((a, b) => b.demand - a.demand)
            .slice(0, 6)
            .map((country, i) => (
              <motion.div
                key={country.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.04, duration: 0.25 }}
                className={cn(
                  "group flex items-center justify-between rounded-xl bg-secondary/50 px-3 py-2.5 transition-colors hover:bg-secondary",
                  country.name === "Bangladesh" && "cursor-pointer hover:bg-primary/10 hover:ring-1 hover:ring-primary/20"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: getDemandColor(country.demand, true) }}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{country.name}</p>
                    <p className="text-[10px] text-muted-foreground">{country.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {(country.demand / 1000).toFixed(1)}k
                  </p>
                  <p
                    className={cn(
                      "flex items-center justify-end gap-0.5 text-[10px] font-medium tabular-nums",
                      country.growth >= 0 ? "text-emerald-500" : "text-red-500"
                    )}
                  >
                    {country.growth >= 0 ? (
                      <TrendingUp className="h-2.5 w-2.5" />
                    ) : (
                      <TrendingDown className="h-2.5 w-2.5" />
                    )}
                    {country.growth > 0 ? "+" : ""}
                    {country.growth}%
                  </p>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  )
}
