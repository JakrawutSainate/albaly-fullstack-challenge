
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

    // กรณีมี Session แล้วแต่จะเข้าหน้า Login ให้เตะไปหน้า Overview
    if (isPublicRoute && session?.userId) {
        return NextResponse.redirect(new URL('/overview', req.nextUrl))
    }

    // กรณีไม่มี Session แต่พยายามเข้าหน้า Dashboard
    if (isProtectedRoute && !session?.userId) {
        return NextResponse.redirect(new URL('/login', req.nextUrl))
    }

    // ต่ออายุ Session อัตโนมัติ (ถ้ามี Session)
    return session?.userId ? await updateSession(req) : NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
