import { hash } from 'bcryptjs'
import prisma from '@/lib/prisma'
import { User } from '@prisma/client'

export const authService = {
    async registerUser(email: string, password: string): Promise<User> {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            throw new Error('User already exists')
        }

        // Hash password
        const passwordHash = await hash(password, 10)

        // Create user with default role 'VIEWER'
        const user = await prisma.user.create({
            data: {
                email,
                passwordHash,
                role: 'VIEWER',
            },
        })

        return user

    }
}

