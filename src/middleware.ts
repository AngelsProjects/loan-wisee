import { NextRequest, NextResponse } from 'next/server'

import { getToken } from 'next-auth/jwt'

// Define paths that don't require authentication
const publicPaths = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password', '/auth/error']

// Define path patterns for API routes that don't require authentication
const publicApiPaths = ['/api/auth']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is public
  if (publicPaths.some(path => pathname.startsWith(path)) || publicApiPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // For any other routes, verify authentication
  const token = await getToken({ req: request })

  // If not authenticated, redirect to login
  if (!token) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // Continue for authenticated users
  return NextResponse.next()
}

// Configure the paths that this middleware should run on
export const config = {
  matcher: [
    // Match all routes except static files, api health check, and _next
    '/((?!_next/static|_next/image|favicon.ico|assets).*)'
  ]
}
