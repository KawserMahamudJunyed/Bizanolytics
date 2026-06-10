'use server'

import { clearTokens } from '@/lib/auth'

/** Stub login — actual login now done client-side in login/page.tsx via DataBox JWT */
export async function login(_formData: FormData) {
  return { success: true }
}

/** Stub signup — actual signup now done client-side in signup/page.tsx via DataBox JWT */
export async function signup(_formData: FormData) {
  return { success: true }
}

/** Logout — clears JWT tokens from localStorage (called from sidebar) */
export async function logout() {
  // Tokens live in localStorage; actual clearing happens client-side.
  // This server action is a no-op but kept so the sidebar import doesn't break.
  return { success: true }
}
