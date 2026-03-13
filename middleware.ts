import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if accessing protected dashboard routes
  if (pathname.startsWith('/dashboard')) {
    // Check for session cookie (Supabase sets this)
    const cookies = request.cookies
    
    // Look for Supabase session cookies
    const hasSession = 
      cookies.has('sb-zadbhukdfobazxzflnkh-auth-token') || // Supabase auth cookie pattern
      Array.from(cookies.keys()).some(name => 
        name.includes('auth') || name.includes('supabase')
      )

    // If no session cookie found, redirect to login
    if (!hasSession) {
      console.log('[Middleware] No session found, redirecting to login')
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    console.log('[Middleware] Session found, allowing access to dashboard')
  }

  // Allow auth pages to load normally
  return NextResponse.next()
}

// Only run middleware on dashboard routes
export const config = {
  matcher: ['/dashboard/:path*']
}
