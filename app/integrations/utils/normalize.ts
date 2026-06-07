// ANTIGRAVITY INTEGRATION — NORMALIZERS
// Mode: A (public) | B (owner)
// All sources normalize to IntegrationData before visualization

import type { IntegrationData, IntegrationProduct, IntegrationCategory } from "./types"

/**
 * Normalize Groq LLM output from a public scrape to internal schema.
 * Data confidence: estimated
 */
export function normalizePublicScrape(groqOutput: any, url: string): IntegrationData {
  const products: IntegrationProduct[] = (groqOutput.products || []).map((p: any, i: number) => ({
    id: `p${i}`,
    name: p.name || "Unknown Product",
    price: typeof p.price === "number" ? p.price : parseFloat(p.price) || 0,
    category: p.cat || p.category || "Uncategorized",
    stock: p.inStock === true ? 1 : p.inStock === false ? 0 : null,
    reviewCount: typeof p.reviews === "number" ? p.reviews : null,
    rating: typeof p.rating === "number" ? p.rating : null,
  }))

  // Build categories from products if not provided by LLM
  const cats: IntegrationCategory[] = groqOutput.cats && groqOutput.cats.length > 0
    ? groqOutput.cats.map((c: any) => ({
        name: c.name || "Uncategorized",
        count: c.count || 0,
        avgPrice: c.avgPrice || 0,
        totalRevenue: null, // Mode A cannot know revenue
      }))
    : buildCategoriesFromProducts(products)

  const demand = groqOutput.demand || { high: [], rising: [], slow: [] }

  return {
    source: "scrape_public",
    scrapedAt: new Date().toISOString(),
    business: {
      name: groqOutput.biz?.name || extractDomainName(url),
      type: groqOutput.biz?.type || "E-Commerce",
      currency: groqOutput.biz?.currency || "USD",
    },
    products,
    categories: cats,
    demandSignals: {
      high: demand.high || [],
      rising: demand.rising || [],
      slow: demand.slow || [],
    },
    meta: {
      totalProducts: products.length,
      dataConfidence: "estimated",
    },
  }
}

/**
 * Normalize Shopify Storefront API response.
 * Data confidence: live
 */
export function normalizeShopify(edges: any[], domain: string): IntegrationData {
  const products: IntegrationProduct[] = edges.map((edge: any) => {
    const node = edge.node
    return {
      id: node.id,
      name: node.title || "Unknown Product",
      price: parseFloat(node.variants?.edges?.[0]?.node?.price ?? "0"),
      category: node.productType || "Uncategorized",
      stock: typeof node.totalInventory === "number" ? node.totalInventory : null,
      reviewCount: null,
      rating: null,
    }
  })

  const categories = buildCategoriesFromProducts(products)
  const demandSignals = inferDemandSignals(products)

  return {
    source: "shopify",
    scrapedAt: new Date().toISOString(),
    business: {
      name: domain.replace(/\.myshopify\.com$/, "").replace(/\./g, " "),
      type: "Shopify Store",
      currency: "USD",
    },
    products,
    categories,
    demandSignals,
    meta: {
      totalProducts: products.length,
      dataConfidence: "live",
    },
  }
}

/**
 * Normalize WooCommerce REST API response.
 * Data confidence: live
 */
export function normalizeWooCommerce(rawProducts: any[], siteUrl: string): IntegrationData {
  const products: IntegrationProduct[] = rawProducts.map((p: any) => ({
    id: String(p.id),
    name: p.name || "Unknown Product",
    price: parseFloat(p.price ?? "0"),
    category: p.categories?.[0]?.name ?? "Uncategorized",
    stock: typeof p.stock_quantity === "number" ? p.stock_quantity : null,
    reviewCount: typeof p.rating_count === "number" ? p.rating_count : null,
    rating: parseFloat(p.average_rating ?? "0") || null,
  }))

  const categories = buildCategoriesFromProducts(products)
  const demandSignals = inferDemandSignals(products)

  return {
    source: "woocommerce",
    scrapedAt: new Date().toISOString(),
    business: {
      name: extractDomainName(siteUrl),
      type: "WooCommerce Store",
      currency: "USD",
    },
    products,
    categories,
    demandSignals,
    meta: {
      totalProducts: products.length,
      dataConfidence: "live",
    },
  }
}

/**
 * Normalize Custom API response.
 * Data confidence: live
 */
export function normalizeCustom(rawProducts: any[], endpointUrl: string): IntegrationData {
  const products: IntegrationProduct[] = rawProducts.map((p: any, i: number) => ({
    id: p.id ? String(p.id) : `c${i}`,
    name: p.name || p.title || "Unknown Product",
    price: parseFloat(p.price ?? "0"),
    category: p.category || p.cat || "Uncategorized",
    stock: typeof p.stock === "number" ? p.stock : null,
    reviewCount: typeof p.reviewCount === "number" ? p.reviewCount : null,
    rating: typeof p.rating === "number" ? p.rating : null,
  }))

  const categories = buildCategoriesFromProducts(products)
  const demandSignals = inferDemandSignals(products)

  return {
    source: "custom_api",
    scrapedAt: new Date().toISOString(),
    business: {
      name: extractDomainName(endpointUrl),
      type: "Custom Store",
      currency: "USD",
    },
    products,
    categories,
    demandSignals,
    meta: {
      totalProducts: products.length,
      dataConfidence: "live",
    },
  }
}

// ─── Helpers ────────────────────────────────────────────────

function buildCategoriesFromProducts(products: IntegrationProduct[]): IntegrationCategory[] {
  const catMap = new Map<string, { count: number; totalPrice: number }>()

  products.forEach((p) => {
    const existing = catMap.get(p.category) || { count: 0, totalPrice: 0 }
    existing.count += 1
    existing.totalPrice += p.price
    catMap.set(p.category, existing)
  })

  return Array.from(catMap.entries()).map(([name, data]) => ({
    name,
    count: data.count,
    avgPrice: data.count > 0 ? Math.round((data.totalPrice / data.count) * 100) / 100 : 0,
    totalRevenue: null,
  }))
}

function inferDemandSignals(products: IntegrationProduct[]) {
  const high: string[] = []
  const rising: string[] = []
  const slow: string[] = []

  products.forEach((p) => {
    const reviews = p.reviewCount ?? 0
    const rating = p.rating ?? 0

    if (rating > 4 && reviews > 50) {
      high.push(p.name)
    } else if (reviews >= 10 && reviews <= 50) {
      rising.push(p.name)
    } else if (reviews < 10 || rating < 3) {
      slow.push(p.name)
    }
  })

  return { high: high.slice(0, 10), rising: rising.slice(0, 10), slow: slow.slice(0, 10) }
}

function extractDomainName(url: string): string {
  try {
    const hostname = new URL(url).hostname
    return hostname.replace(/^www\./, "").split(".")[0] || "Unknown"
  } catch {
    return "Unknown"
  }
}

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

export function mapIntegrationToSMEData(integration: IntegrationData): SMEDataRow[] {
  const locations = ["Savar", "Gazipur", "Narayanganj Sadar", "Jashore", "Satkhira", "Cox's Bazar", "Bogura", "Feni", "Habiganj", "Baghai Chhari"];
  const rows: SMEDataRow[] = [];
  
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  integration.products.forEach((p, idx) => {
    const location = locations[idx % locations.length];
    
    // E-commerce APIs only give us the catalog product, so we estimate historical sales based on reviews if present
    const totalUnitsSold = p.reviewCount ? Math.max(5, p.reviewCount) : 15 + (idx % 4) * 8;
    const currentStock = p.stock !== null ? p.stock : 60 + (idx % 5) * 20;
    
    // Spread sales over several random days in the past 60 days
    const numTransactions = Math.max(3, Math.min(15, Math.floor(totalUnitsSold / 2)));
    
    for (let i = 0; i < numTransactions; i++) {
        // Random day in the last 60 days
        const randomDaysAgo = Math.floor(Math.random() * 60);
        const date = new Date(now - randomDaysAgo * dayMs).toISOString().split('T')[0];
        
        // Randomize the units for this specific transaction
        let unitsForThisTx = Math.max(1, Math.floor(totalUnitsSold / numTransactions));
        // Add slight randomness
        unitsForThisTx += Math.floor(Math.random() * 3) - 1; 
        if (unitsForThisTx < 1) unitsForThisTx = 1;
        
        rows.push({
          Date: date,
          Product_ID: p.id || `SKU-${1000 + idx}`,
          Product_Name: p.name,
          Category: p.category || "General",
          Location: location,
          Sales_Channel: i % 4 === 0 ? "In-Store" : "Online",
          Units_Sold: unitsForThisTx,
          Revenue_BDT: unitsForThisTx * p.price,
          Unit_Price: p.price,
          Cost_Price: Math.round(p.price * 0.7),
          Current_Stock: currentStock,
          Customer_Segment: i % 2 === 0 ? "Retail" : "B2B"
        });
    }
  });
  
  // Sort by date ascending to make time-series charts flow correctly
  return rows.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());
}

