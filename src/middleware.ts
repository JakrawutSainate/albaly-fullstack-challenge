
import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

const protectedRoutes = ['/overview', '/insights']
const publicRoutes = ['/']

export default async function middleware(req: NextRequest) {
    // Check if the current route is protected or public
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/overview') || path.startsWith('/insights')
    const isPublicRoute = publicRoutes.includes(path)

    // Decrypt the session from the cookie
    const cookie = req.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie).catch(() => null) : null

    // Redirect to /overview if user is authenticated and trying to access public route (login)
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/overview', req.nextUrl))
    }

    // Redirect to / if user is not authenticated and trying to access protected route
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
