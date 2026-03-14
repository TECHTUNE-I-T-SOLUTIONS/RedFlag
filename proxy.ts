import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't need auth
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password',
    '/auth/callback',
    '/features',
    '/how-it-works',
    '/pricing',
    '/about',
    '/contact',
    '/blog',
    '/privacy',
    '/terms',
  ]

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for NextAuth session cookie
  // NextAuth stores session in: next-auth.session-token (dev) or __Secure-next-auth.session-token (prod)
  const cookies = request.cookies
  const hasSession = 
    cookies.has('next-auth.session-token') || 
    cookies.has('__Secure-next-auth.session-token')

  // If trying to access protected routes without session, redirect to login
  if (pathname.startsWith('/dashboard')) {
    if (!hasSession) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
