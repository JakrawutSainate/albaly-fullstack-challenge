
import { NextRequest, NextResponse } from 'next/server'
import { decrypt, updateSession } from '@/lib/auth'

// 1. Specify protected and public routes
const protectedRoutes = ['/overview', '/insights']
const publicRoutes = ['/login', '/']

export default async function middleware(req: NextRequest) {
    // 2. Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.some(route => path === route) // Exact match for login/root probably better, but startsWith is safer for sub-paths

    // 3. Decrypt the session from the cookie
    const cookie = req.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie) : null

    // 4. Redirect to /overview if user is authenticated and trying to access public route (login)
    if (isPublicRoute && session?.userId && path !== '/overview') {
        return NextResponse.redirect(new URL('/overview', req.nextUrl))
    }

    // 5. Redirect to /login if user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // Update session expiry if authenticated
    if (session?.userId) {
        return await updateSession(req)
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
