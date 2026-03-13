import { type NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Public routes that don't need auth
  const publicRoutes = [
    '/',
    '/auth/login',
    '/auth/signup',
    '/auth/reset-password',
    '/features',
    '/how-it-works',
    '/pricing',
    '/about',
    '/contact',
  ]

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Check for Supabase auth token in cookies
  // Supabase stores auth data in cookies with pattern: sb-<project-ref>-auth-token
  const cookies = request.cookies
  
  // Look for any cookie that contains 'auth-token'
  const hasAuthToken = Array.from(cookies).some(([name]) => 
    name.includes('auth-token') || name.includes('auth')
  )

  // If trying to access protected routes without auth, redirect to login
  if (pathname.startsWith('/dashboard')) {
    if (!hasAuthToken) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
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
