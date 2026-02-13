'use server'

// Force TS check after prisma generate

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import prisma from '@/lib/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

// Helper to determine inventory status based on stock level
function getInventoryStatus(onHand: number): 'OK' | 'LOW' | 'OUT' {
    if (onHand === 0) return 'OUT'
    if (onHand <= 10) return 'LOW'
    return 'OK'
}

const createProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.coerce.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.coerce.number().int().nonnegative('Stock must be a non-negative integer').optional().default(0),
})

export async function createProductAction(formData: FormData) {
    const session = await getSession()
    if (session?.role !== 'ADMIN') {
        return createErrorResponse('Unauthorized: Admin access required', 'UNAUTHORIZED')
    }

    try {
        const rawData = {
            name: formData.get('name'),
            price: formData.get('price'),
            category: formData.get('category'),
            stock: formData.get('stock'),
        }

        const validatedData = createProductSchema.parse(rawData)

        const product = await prisma.product.create({
            data: {
                name: validatedData.name,
                price: validatedData.price,
                category: validatedData.category,
                inventorySnapshots: {
                    create: {
                        onHand: validatedData.stock,
                        status: getInventoryStatus(validatedData.stock),
                    }
                }
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

const updateProductSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    price: z.number().positive('Price must be positive'),
    category: z.string().min(1, 'Category is required'),
    stock: z.number().int().nonnegative('Stock must be a non-negative integer').optional(),
})

export async function updateProductAction(productId: string, data: { name: string, price: number, category: string, stock?: number }) {
    const session = await getSession()
    if (session?.role !== 'ADMIN') {
        return createErrorResponse('Unauthorized: Admin access required', 'UNAUTHORIZED')
    }

    try {
        const validatedData = updateProductSchema.parse(data)

        const product = await prisma.product.update({
            where: { id: productId },
            data: {
                name: validatedData.name,
                price: validatedData.price,
                category: validatedData.category,
            }
        })

        // Update inventory snapshot if stock is provided
        if (validatedData.stock !== undefined) {
            await prisma.inventorySnapshot.create({
                data: {
                    productId: productId,
                    onHand: validatedData.stock,
                    status: getInventoryStatus(validatedData.stock),
                }
            })
        }

        revalidatePath('/products')
        revalidatePath('/overview')
        revalidatePath('/insights')

        return createSuccessResponse(product)
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return createErrorResponse(error.issues[0].message, 'VALIDATION_ERROR')
        }
        return createErrorResponse('Failed to update product', 'INTERNAL_ERROR')
    }
}

export async function deleteProductAction(productId: string) {
    const session = await getSession()
    if (session?.role !== 'ADMIN') {
        return createErrorResponse('Unauthorized: Admin access required', 'UNAUTHORIZED')
    }

    try {
        // Delete related records first to avoid foreign key constraints
        await prisma.$transaction([
            // Delete sales related to this product
            prisma.sale.deleteMany({
                where: { productId }
            }),
            // Delete inventory snapshots related to this product
            prisma.inventorySnapshot.deleteMany({
                where: { productId }
            }),
            // Finally delete the product
            prisma.product.delete({
                where: { id: productId }
            })
        ])

        revalidatePath('/products')
        revalidatePath('/overview')
        revalidatePath('/insights')
        revalidatePath('/store')

        return createSuccessResponse({ deleted: true })
    } catch (error: any) {
        console.error('Delete product error:', error)
        return createErrorResponse('Failed to delete product', 'INTERNAL_ERROR')
    }
}
