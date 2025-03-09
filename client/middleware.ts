import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get current path
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath =
    path === '/auth/login' ||
    path === '/auth/register' ||
    path === '/auth/forgot-password' ||
    path === '/auth/reset-password' ||
    path.startsWith('/auth/reset-password/') ||
    path === '/'

  // Get authentication status from cookies - better-auth uses '__session' cookie
  const hasSession = request.cookies.has('better-auth.session_token')

  // Redirect authenticated users away from auth pages
  if (isPublicPath && hasSession) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users to login
  if (!isPublicPath && !hasSession) {
    // Store the original path to redirect back after login
    const redirectUrl = new URL('/auth/login', request.url)
    redirectUrl.searchParams.set('callbackUrl', path)
    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  // Define which paths should be handled by this middleware
  matcher: [
    // Match all paths that require authentication
    '/dashboard/:path*',
    // Match authentication pages
    '/auth/:path*',
  ],
}
