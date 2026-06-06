// ANTIGRAVITY INTEGRATION — DATA TYPES
// Mode: A (public) | B (owner)
// Internal schema all data sources normalize to before visualization

export interface IntegrationProduct {
  id: string
  name: string
  price: number
  category: string
  stock: number | null
  reviewCount: number | null
  rating: number | null
}

export interface IntegrationCategory {
  name: string
  count: number
  avgPrice: number
  totalRevenue: number | null
}

export interface DemandSignals {
  high: string[]
  rising: string[]
  slow: string[]
}

export interface BusinessInfo {
  name: string
  type: string
  currency: string
}

export interface IntegrationMeta {
  totalProducts: number
  dataConfidence: "live" | "estimated"
  isOwner?: boolean
}

export interface IntegrationData {
  source: "scrape_public" | "shopify" | "woocommerce" | "custom_api"
  scrapedAt: string
  business: BusinessInfo
  products: IntegrationProduct[]
  categories: IntegrationCategory[]
  demandSignals: DemandSignals
  meta: IntegrationMeta
}

export type PlatformType = "shopify" | "woocommerce" | "custom" | "square" | "lightspeed" | "clover"

export interface ShopifyCredentials {
  domain: string
  storefrontToken: string
}

export interface WooCommerceCredentials {
  siteUrl: string
  consumerKey: string
  consumerSecret: string
}

export interface CustomApiCredentials {
  endpointUrl: string
  bearerToken?: string
}

export type PipelineStep = "idle" | "fetching" | "extracting" | "updating" | "done" | "error"
