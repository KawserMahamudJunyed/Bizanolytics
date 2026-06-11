"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, FileText, ChevronRight, Activity, Users, Shield, Zap, Database, Server, BrainCircuit, Globe, Key, Settings, Share2 } from "lucide-react"

// Team Member Type
type TeamMember = {
  name: string
  role: string
  email: string
  image: string
}

const TEAM: TeamMember[] = [
  {
    name: "Founder",
    role: "CEO & Product Architect",
    email: "founder@bizanolytics.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=3b82f6"
  },
  {
    name: "Co-Founder",
    role: "CTO & AI Engineer",
    email: "cto@bizanolytics.com",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=10b981"
  }
]

export default function DocsPage() {
  const searchParams = useSearchParams()
  const isAdmin = searchParams?.get("admin") === "true"
  
  const [activeTab, setActiveTab] = useState("pitch")

  // The restriction has been lifted per user request
  // Everyone can now view the documentation freely.

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r border-border bg-card/50 backdrop-blur-md shrink-0 flex flex-col">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2 font-bold text-xl mb-1">
            <img src="/logo-icon.svg" className="w-6 h-6" alt="Logo" />
            Bizanolytics Docs
          </div>
          <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE SYSTEM
          </p>
        </div>
        
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          <button 
            onClick={() => setActiveTab('pitch')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'pitch' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Pitch Deck
            </div>
          </button>
          <button 
            onClick={() => setActiveTab('tech')}
            className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'tech' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
          >
            <div className="flex items-center gap-2">
              <Server className="w-4 h-4" />
              Technical Docs
            </div>
          </button>
          
          <div className="pt-6 pb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4">Admin Controls</p>
          </div>
          {isAdmin ? (
            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-xs text-emerald-600 dark:text-emerald-400">
              Admin override active. Content is visible regardless of schedule.
            </div>
          ) : (
            <div className="px-4 text-xs text-muted-foreground">
              Public access window active.
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 md:p-12 lg:px-24">
        {activeTab === 'pitch' && <PitchDeckSection />}
        {activeTab === 'tech' && <TechnicalDocsSection />}
      </main>
    </div>
  )
}

function PitchDeckSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">Bizanolytics Pitch Deck</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          An autonomous AI "Chief Operating Officer" empowering SMEs in emerging markets to eliminate stockouts and maximize margins.
        </p>
      </div>

      <Section title="1. The Problem">
        <p className="text-muted-foreground text-lg">
          SMEs in Bangladesh and emerging markets lose billions annually due to stockouts and dead inventory. They rely on manual "Khatas" (paper ledgers) or disconnected spreadsheets. Existing BI tools are too expensive, require data engineering skills, and use "black box" AI that owners don't trust.
        </p>
      </Section>

      <Section title="2. The Solution">
        <p className="text-muted-foreground text-lg mb-4">
          Bizanolytics provides an instant, zero-setup AI dashboard. We automatically normalize messy data and utilize deterministic edge-computing to ensure mathematical perfection, paired with an Explainable AI layer (Llama 3) that gives plain-English recommendations.
        </p>
        <ul className="space-y-2 text-muted-foreground">
          <li className="flex items-center gap-2"><CheckIcon /> 1-Click Shopify/WooCommerce Sync</li>
          <li className="flex items-center gap-2"><CheckIcon /> Automated Anomaly Imputation</li>
          <li className="flex items-center gap-2"><CheckIcon /> Plain-English Forecasting & Insights</li>
        </ul>
      </Section>

      <Section title="3. Why Now?">
        <p className="text-muted-foreground text-lg">
          LLM inference costs have plummeted (Groq), allowing us to offer enterprise-grade AI analytics at a price point emerging market SMEs can afford. Simultaneously, the digitisation of POS systems in Bangladesh is reaching a tipping point, creating a massive influx of structured data ready to be analyzed.
        </p>
      </Section>

      <Section title="4. Market Opportunity">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Addressable Market" value="$15B+" subtitle="Global emerging market SME software" />
          <StatCard title="Serviceable Market" value="$2B+" subtitle="South Asia Retail SMEs" />
          <StatCard title="Obtainable Market" value="$100M" subtitle="Bangladesh digital-first SMEs" />
        </div>
      </Section>

      <Section title="5. Unique Advantage">
        <p className="text-muted-foreground text-lg">
          <strong>Explainable AI Architecture:</strong> We explicitly bridge the trust gap by placing deterministic math (Recharts) side-by-side with LLM text. The AI doesn't do the math—it interprets it.
        </p>
        <p className="text-muted-foreground text-lg mt-4">
          <strong>Aggregation-to-Prompt:</strong> By bypassing RAG and vector DBs in favor of edge-ETL, we eliminate semantic hallucinations on financial data.
        </p>
      </Section>

      <Section title="6. The Team">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {TEAM.map(member => (
            <div key={member.name} className="bg-card border border-border rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-primary/20 bg-secondary" />
              <h3 className="font-bold text-lg">{member.name}</h3>
              <p className="text-sm font-medium text-primary mb-2">{member.role}</p>
              <p className="text-xs text-muted-foreground">{member.email}</p>
            </div>
          ))}
        </div>
      </Section>
    </motion.div>
  )
}

function TechnicalDocsSection() {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-16 max-w-4xl">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Technical Documentation</h1>
        <p className="text-xl text-muted-foreground leading-relaxed">
          System architecture, data flow, security models, and live integration endpoints.
        </p>
      </div>

      <Section title="System Architecture">
        <div className="bg-secondary/30 border border-border p-8 rounded-xl font-mono text-sm overflow-x-auto text-muted-foreground">
          <pre>{`[ Client Browser (Next.js Edge) ]
  ├─ 1. UI Components (React, Tailwind, Recharts)
  ├─ 2. Data Context (Zustand/React Context, In-memory ETL)
  └─ 3. Local Storage (Encrypted Session Data)
          ↓
[ Serverless API Layer ]
  ├─ /api/integrations/sync (Shopify/WooCommerce Fetchers)
  └─ /api/forecast-insight  (Prompt Compiler & JSON Schema Guard)
          ↓
[ External Infrastructure ]
  ├─ Meta Llama 3 (via Groq API) -> Ultra-fast Inference
  └─ Supabase PostgreSQL -> (RLS, Auth, Encrypted API Keys)`}</pre>
        </div>
      </Section>

      <Section title="Data Layer & ETL">
        <div className="grid gap-4">
          <FeatureRow icon={Database} title="Deterministic Edge ETL" desc="Raw CSV/JSON data never touches a vector database. Aggregation, moving averages, and anomaly imputation happen entirely in-memory on the client via Next.js and PapaParse." />
          <FeatureRow icon={Shield} title="Privacy by Design" desc="Raw sales logs are stripped of PII locally. Only mathematically aggregated summaries (e.g., 'Total Category Sales') are transmitted to the LLM API." />
        </div>
      </Section>

      <Section title="AI Layer">
        <div className="grid gap-4">
          <FeatureRow icon={BrainCircuit} title="Model" desc="Meta Llama 3 (8B/70B) routed through Groq for <500ms TTFT." />
          <FeatureRow icon={Settings} title="Prompt Engineering" desc="Role Prompting (COO Persona) + Chain-of-Thought reasoning. Output is strictly validated via JSON mode." />
          <FeatureRow icon={Activity} title="RAG Bypass" desc="Intentional omission of vector databases to prevent mathematical hallucinations. We use 'Aggregation-to-Prompt' injection." />
        </div>
      </Section>

      <Section title="Security & Scalability">
        <div className="grid gap-4">
          <FeatureRow icon={Key} title="Authentication" desc="Supabase Auth with strict Row-Level Security (RLS) ensuring absolute multi-tenant isolation." />
          <FeatureRow icon={Lock} title="Encryption" desc="External eCommerce API keys (Shopify/WooCommerce) are symmetrically encrypted before storage in Postgres." />
          <FeatureRow icon={Globe} title="Edge Delivery" desc="Vercel Edge network for zero-latency static delivery, coupled with Cloudflare DNS." />
        </div>
      </Section>

      <Section title="Roadmap">
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-emerald-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <Check className="w-5 h-5 text-white" />
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-4 rounded-xl shadow">
              <h4 className="font-bold">Phase 1: Foundation (Live)</h4>
              <p className="text-sm text-muted-foreground">Serverless Edge-AI, deterministic analytics, API integrations.</p>
            </div>
          </div>
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-secondary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="text-muted-foreground font-bold text-sm">2</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-4 rounded-xl shadow">
              <h4 className="font-bold">Phase 2: Agentic Orchestration</h4>
              <p className="text-sm text-muted-foreground">Autonomous n8n "Buyer Agents" to auto-reorder stock via supplier APIs.</p>
            </div>
          </div>
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-secondary shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
              <span className="text-muted-foreground font-bold text-sm">3</span>
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-card border border-border p-4 rounded-xl shadow">
              <h4 className="font-bold">Phase 3: Vision Khatas</h4>
              <p className="text-sm text-muted-foreground">Mobile OCR pipeline to digitize handwritten paper ledgers directly into arrays.</p>
            </div>
          </div>
        </div>
      </Section>

    </motion.div>
  )
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 border-b border-border pb-2">{title}</h2>
      {children}
    </section>
  )
}

function StatCard({ title, value, subtitle }: { title: string, value: string, subtitle: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl flex flex-col items-center text-center">
      <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
      <p className="text-4xl font-extrabold text-primary mb-2">{value}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
    </div>
  )
}

function FeatureRow({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 p-4 rounded-xl bg-card border border-border">
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h4 className="font-bold text-foreground mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
      </div>
    </div>
  )
}

function CheckIcon() {
  return <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0"><Check className="w-3 h-3" /></div>
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
