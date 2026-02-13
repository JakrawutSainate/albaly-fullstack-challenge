
import { NextRequest, NextResponse } from 'next/server'
import { decrypt, updateSession } from '@/lib/auth'

// 1. Specify protected and public routes
const protectedRoutes = ['/overview', '/insights']
const publicRoutes = ['/login', '/', '/register']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route))
    const isPublicRoute = publicRoutes.includes(path) // ใช้ includes สำหรับหน้าหลัก

    // ตรวจสอบชื่อ cookie ให้ตรงกับที่ตั้งไว้ใน login logic
    const cookie = req.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie) : null

    // 4. Role-based Redirection
    if (session?.userId) {
        const role = session.role

        // Viewer try to access Admin routes -> Redirect to Store
        if (role === 'VIEWER' && (path.startsWith('/overview') || path.startsWith('/insights'))) {
            return NextResponse.redirect(new URL('/store', req.nextUrl))
        }

        // Admin try to access Viewer routes (optional, but requested "separate faces")
        // Note: Usually admins can see everything, but to start them on overview:
        if (role === 'ADMIN' && path === '/') {
            return NextResponse.redirect(new URL('/overview', req.nextUrl))
        }
    }

    // 2. Public Route Logic (Already logged in)
    if (isPublicRoute && session?.userId) {
        // Redirect based on role
        const target = session.role === 'ADMIN' ? '/overview' : '/store'
        return NextResponse.redirect(new URL(target, req.nextUrl))
    }

    // 3. Protected Route Logic (Not logged in)
    if ((isProtectedRoute || path.startsWith('/store')) && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // ต่ออายุ Session อัตโนมัติ (ถ้ามี Session)
    return session?.userId ? await updateSession(req) : NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
