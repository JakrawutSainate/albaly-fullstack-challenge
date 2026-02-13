'use server'

// Force TS check after prisma generate

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'

const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.coerce.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
})

export async function createProductAction(formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name'),
            price: formData.get('price'),
            category: formData.get('category'),
        }

        const validatedData = createProductSchema.parse(rawData)

        const product = await prisma.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                category: validatedData.category,
            },
        })

        revalidatePath('/overview')
        revalidatePath('/insights')

        return createSuccessResponse(product)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return createErrorResponse(error.issues[0].message, 'VALIDATION_ERROR')
        }
        return createErrorResponse('Failed to create product', 'INTERNAL_ERROR')
    }
}
