import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { AppLayout } from '@/components/app-layout'
import { DataProvider } from '@/contexts/DataContext'

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark bg-background" style={{ colorScheme: 'dark' }}>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <DataProvider>
          <AppLayout>
            {children}
          </AppLayout>
        </DataProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
