import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authService } from '@/services/auth.service'
import { login } from '@/lib/auth'

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password } = registerSchema.parse(body)

        const user = await authService.registerUser(email, password)

        // Auto-login after registration
        await login(user.id, user.email, user.role)

        return NextResponse.json({ success: true, user: { id: user.id, email: user.email, role: user.role } })
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.flatten() }, { status: 400 })
        }
        if (error.message === 'User already exists') {
            return NextResponse.json({ error: 'User already exists' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
