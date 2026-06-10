'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Loader2, ArrowRight, Eye, EyeOff, Globe } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useLanguage } from '@/contexts/LanguageContext'
import { setTokens, saveUser } from '@/lib/auth'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

function LoginContent() {
  const { t, language, setLanguage } = useLanguage()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const searchParams = useSearchParams()
  const isSignupSuccess = searchParams.get('signup') === 'success'
  const isSessionExpired = searchParams.get('session') === 'expired'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string
    const pass = formData.get('password') as string

    try {
      const res = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error ?? 'Invalid credentials. Please try again.')
        setLoading(false)
        return
      }

      setTokens(data.accessToken, data.refreshToken)
      saveUser(data.user)

      setTimeout(() => {
        window.location.href = '/dashboard'
      }, 300)
    } catch (err) {
      setError('An unexpected error occurred. Is the backend running?')
      setLoading(false)
    }
  }

  return (
    <>
      <div className="absolute top-4 right-4">
        <button
          type="button"
          onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
          className="flex items-center gap-1.5 rounded-full bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Globe className="h-3.5 w-3.5" />
          {language === 'en' ? 'বাংলা' : 'EN'}
        </button>
      </div>

      <div className="mb-8 text-center pt-4">
        <h1 className="text-2xl font-bold text-foreground">
          {t('welcome_back')}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t('login_desc')}
        </p>
      </div>

      {isSessionExpired && (
        <div className="mb-6 rounded-lg bg-amber-500/10 p-4 text-sm text-amber-500 border border-amber-500/20">
          Your session has expired. Please log in again.
        </div>
      )}

      {isSignupSuccess && (
        <div className="mb-6 rounded-lg bg-emerald-500/10 p-4 text-sm text-emerald-500 border border-emerald-500/20">
          Account created successfully! Please log in.
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('email')}</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded-lg border border-border bg-secondary/50 px-4 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">{t('password')}</label>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary/50 pl-4 pr-10 py-2.5 text-sm text-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {t('log_in')}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t('no_account')}{' '}
        <Link href="/signup" className="text-foreground hover:underline font-medium">
          {t('sign_up')}
        </Link>
      </div>

      <div className="mt-8 pt-6 border-t border-border/50 text-center">
        <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {t('guest_mode')}
        </Link>
      </div>
    </>
  )
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/5 blur-[128px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-secondary/20 blur-[128px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md card-base p-8 relative z-10"
      >
        <Suspense fallback={<div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>}>
          <LoginContent />
        </Suspense>
      </motion.div>
    </div>
  )
}
