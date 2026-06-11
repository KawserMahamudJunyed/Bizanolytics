"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, BarChart3, Database, Shield, Zap, Package, Sparkles, ShoppingBag, Store, Calculator, Clock, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md border-b border-border/50 bg-background/50">
        <div className="flex items-center">
        <Link href="/">
          <img src="/logo-full.svg" alt="Bizanolytics Logo" className="h-8 md:h-[52px] w-auto max-w-[200px] md:max-w-none cursor-pointer" />
        </Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log in
          </Link>
          <Link href="/signup" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative max-w-5xl mx-auto pt-20 pb-32 text-center">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-border text-sm font-medium text-muted-foreground mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span>AI-Powered Analytics</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
              Transform Raw Data Into <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                Actionable Foresight.
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Bizanolytics automatically cleans your data, predicts future demand, and generates stunning interactive dashboards—all in seconds.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard" 
                className="group flex items-center justify-center w-full sm:w-auto gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-all hover:scale-105"
              >
                Start Exploring Free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link 
                href="#features" 
                className="flex items-center justify-center w-full sm:w-auto gap-2 bg-secondary text-foreground px-8 py-4 rounded-full font-medium hover:bg-secondary/80 transition-all"
              >
                See Features
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Dashboard Preview Mockup */}
        <section className="max-w-6xl mx-auto mb-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="rounded-2xl border border-border bg-card p-2 shadow-2xl relative z-10"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20 pointer-events-none rounded-2xl" />
            <div className="rounded-xl overflow-hidden border border-border/50 bg-secondary/30 aspect-[16/9] flex items-center justify-center relative">
              {/* Abstract Dashboard UI */}
              <div className="absolute inset-4 grid grid-cols-3 gap-4 opacity-50">
                <div className="col-span-2 row-span-2 rounded-lg bg-background border border-border flex p-4 flex-col gap-4">
                  <div className="h-4 w-1/4 bg-secondary rounded" />
                  <div className="flex-1 rounded border border-border border-dashed flex items-end gap-2 p-2">
                    {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/40 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
                <div className="rounded-lg bg-background border border-border p-4 flex flex-col gap-2">
                  <div className="h-4 w-1/2 bg-secondary rounded" />
                  <div className="h-8 w-3/4 bg-primary/20 rounded mt-auto" />
                </div>
                <div className="rounded-lg bg-background border border-border p-4 flex flex-col gap-2">
                  <div className="h-4 w-1/2 bg-secondary rounded" />
                  <div className="h-8 w-3/4 bg-emerald-500/20 rounded mt-auto" />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features Section */}
        <section id="features" className="max-w-5xl mx-auto py-24 border-t border-border/50">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to scale</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We handle the complex data engineering and machine learning so you can focus on making decisions.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Database}
              title="Automated Imputation"
              description="Missing data? No problem. Our engine automatically imputes missing values and removes anomalies instantly."
            />
            <FeatureCard 
              icon={BarChart3}
              title="Demand Forecasting"
              description="Harness cutting-edge machine learning to predict future sales trends with incredible accuracy."
            />
            <FeatureCard 
              icon={Shield}
              title="Data Guard Privacy"
              description="Your data never leaves your browser unless you want it to. Enterprise-grade security out of the box."
            />
          </div>
        </section>

        {/* Integrations & Sync Subscription Section */}
        <section className="border-t border-border/50 bg-secondary/10 py-24">
          <div className="max-w-5xl mx-auto px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-4">
                <Zap className="h-3.5 w-3.5" /> 1-Click Integrations
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Connect anything. Sync instantly.</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Whether you run an online empire or a single physical shop, Bizanolytics connects to your systems to power AI forecasting.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
              <div className="card-base p-6 text-center hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  <ShoppingBag className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-bold mb-1">E-Commerce</h3>
                <p className="text-xs text-muted-foreground">Shopify & WooCommerce</p>
              </div>
              <div className="card-base p-6 text-center hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Store className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-bold mb-1">Retail POS</h3>
                <p className="text-xs text-muted-foreground">Square & Lightspeed</p>
              </div>
              <div className="card-base p-6 text-center hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Database className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-bold mb-1">Databases</h3>
                <p className="text-xs text-muted-foreground">Sheets / Excel Links</p>
              </div>
              <div className="card-base p-6 text-center hover:border-primary/50 transition-colors">
                <div className="h-12 w-12 mx-auto rounded-full bg-secondary flex items-center justify-center mb-4">
                  <Calculator className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="font-bold mb-1">BizPOS (Manual)</h3>
                <p className="text-xs text-muted-foreground">Built-in manual register</p>
              </div>
            </div>

            <div className="card-base p-6 md:p-12 border-primary/20 bg-gradient-to-b from-background to-primary/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
                <Zap className="h-48 w-48 text-primary" />
              </div>
              <div className="relative z-10 max-w-2xl">
                <h3 className="text-2xl font-bold mb-4">Choose Your Sync Speed</h3>
                <p className="text-muted-foreground mb-8">
                  Control how fresh your AI forecasts are with our flexible subscription tiers.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border">
                    <div className="bg-secondary p-2 rounded-lg"><Calendar className="h-5 w-5 text-muted-foreground" /></div>
                    <div className="flex-1"><h4 className="font-semibold">Daily Sync</h4><p className="text-xs text-muted-foreground">Free Tier</p></div>
                  </div>
                  <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-border">
                    <div className="bg-secondary p-2 rounded-lg"><Clock className="h-5 w-5 text-foreground" /></div>
                    <div className="flex-1"><h4 className="font-semibold">Hourly Sync</h4><p className="text-xs text-muted-foreground">Growth Tier</p></div>
                  </div>
                  <div className="flex items-center gap-4 bg-background p-4 rounded-xl border border-primary/30 ring-1 ring-border shadow-lg shadow-primary/5">
                    <div className="bg-primary/10 p-2 rounded-lg"><Zap className="h-5 w-5 text-primary" /></div>
                    <div className="flex-1"><h4 className="font-semibold text-primary">Instant Live Sync</h4><p className="text-xs text-primary/80">Pro Tier</p></div>
                    <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-1 rounded">POPULAR</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto py-24 text-center">
          <div className="rounded-3xl bg-primary/10 border border-primary/20 p-8 md:p-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to see the future?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join the next generation of data-driven businesses optimizing their operations with Bizanolytics.
            </p>
            <Link 
              href="/signup" 
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-full font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25"
            >
              <Zap className="h-5 w-5" />
              Create your free account
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30 py-12 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center">
          <Link href="/">
            <img src="/logo-full.svg" alt="Bizanolytics" className="h-8 md:h-[56px] w-auto max-w-[200px] md:max-w-none opacity-70 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer" />
          </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Bizanolytics. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-card border border-border transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  )
}
