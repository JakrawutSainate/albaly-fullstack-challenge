'use server'

import { z } from 'zod'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { encrypt } from '@/lib/auth' // Assuming encrypt is exported from auth.ts
import { hash } from 'bcryptjs'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

const registerSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
})

export async function registerUserAction(formData: FormData) {
    try {
        const rawData = {
            email: formData.get('email'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword'),
        }

        const validatedData = registerSchema.parse(rawData)

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: validatedData.email },
        })

        if (existingUser) {
            return createErrorResponse('User already exists', 'CONFLICT')
        }

        // Hash password
        const passwordHash = await hash(validatedData.password, 10)

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validatedData.email,
                passwordHash,
                role: 'VIEWER', // Default role
            },
        })

        // Create session
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
        const session = await encrypt({ user: { id: user.id, email: user.email, role: user.role }, expires })

        const cookieStore = await cookies()
        cookieStore.set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        })

        return createSuccessResponse({ id: user.id, email: user.email, role: user.role })

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            // Return the first error message
            return createErrorResponse(error.issues[0].message, 'VALIDATION_ERROR')
        }
        console.error('Registration error:', error)
        return createErrorResponse('Registration failed', 'INTERNAL_ERROR')
    }
}
