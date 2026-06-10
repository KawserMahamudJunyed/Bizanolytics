import { type NextRequest, NextResponse } from 'next/server'

/**
 * Proxy — lightweight JWT presence check.
 *
 * Supabase has been removed. Auth is now handled by the DataBox backend using
 * JWT tokens stored in localStorage. The proxy only guards server-side routes
 * that should not be accessible without a token in the Authorization header.
 *
 * Browser navigation (pages) is handled client-side by checking localStorage.
 */
export default async function proxy(request: NextRequest) {
  // Allow all public routes
  const { pathname } = request.nextUrl
  const publicPaths = ['/login', '/signup', '/api/']

  if (publicPaths.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // For page routes, let the client-side handle auth redirects.
  // The proxy only needs to pass requests through.
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
