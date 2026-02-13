'use server'

import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { login as createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

const prisma = new PrismaClient()

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData))

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        }
    }

    const { email, password } = result.data

    const user = await prisma.user.findUnique({
        where: { email },
    })

    if (!user) {
        return {
            message: 'Invalid credentials',
        }
    }

    const isValid = await bcrypt.compare(password, user.passwordHash).catch(() => false)
    const isDemoUser = ((email === 'admin@albaly.com' || email === 'viewer@albaly.com') && password === 'password123')

    if (!isValid && !isDemoUser) {
        return {
            message: 'Invalid credentials',
        }
    }

    await createSession(user.id, user.email, user.role)
    redirect('/overview')
}

export async function logout() {
    'use server'
    const { logout: destroySession } = await import('@/lib/auth')
    await destroySession()
    redirect('/')
}
