import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { AppLayout } from '@/components/app-layout'
import { DataProvider } from '@/contexts/DataContext'
import { Toaster } from 'sonner'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono'
})

export const metadata: Metadata = {
  title: 'Bizanolytics - Intelligent Dashboard & Demand Forecasting',
  description: 'Create powerful dashboards and accurate demand forecasts with Bizanolytics',
  generator: 'v0.app',
}

import { createClient } from '@/utils/supabase/server'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <html lang="en" className="dark bg-background" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <DataProvider>
          <AppLayout user={user}>
            {children}
          </AppLayout>
        </DataProvider>
        <Toaster theme="dark" position="bottom-right" />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
