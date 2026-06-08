"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Language, dictionaries, getTranslation } from "@/lib/i18n"

type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof typeof dictionaries['en']) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const savedLang = localStorage.getItem('bizanolytics_language') as Language
    if (savedLang === 'bn' || savedLang === 'en') {
      setLanguageState(savedLang)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('bizanolytics_language', lang)
  }

  const t = (key: keyof typeof dictionaries['en']) => {
    // Avoid hydration mismatch by rendering default on server, 
    // but honestly for a dashboard it's fine. 
    // To be perfectly safe against Next.js hydration errors:
    if (!isMounted) return dictionaries['en'][key] || key;
    return getTranslation(language, key)
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
