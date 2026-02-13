'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { createSuccessResponse, createErrorResponse } from '@/lib/api-response'
import { getSession } from '@/lib/auth'

export async function simulatePurchaseAction(productId: string, quantity: number = 1) {
    try {
        const session = await getSession()
        const userId = session?.user?.id

        // 1. Get Product with latest inventory
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: {
                inventorySnapshots: {
                    orderBy: { createdAt: 'desc' },
                    take: 1
                }
            }
        })

        if (!product) {
            return createErrorResponse('Product not found', 'NOT_FOUND')
        }

        const latestInventory = product.inventorySnapshots[0]
        const currentStock = latestInventory?.onHand || 0

        // 2. Check Inventory
        if (currentStock < quantity) {
            return createErrorResponse('Insufficient stock', 'OUT_OF_STOCK')
        }

        // 3. Create Sale (Transaction)
        // We need a customer. For simulation, we'll pick a random customer
        const customer = await prisma.customer.findFirst({
            where: { isActive: true }
        })

        if (!customer) {
            return createErrorResponse('No active customers found for simulation', 'ERROR')
        }

        const sale = await prisma.sale.create({
            data: {
                productId,
                customerId: customer.id,
                amount: product.price * quantity,
                quantity: quantity,
            }
        })

        // 4. Update Inventory (Update the latest snapshot to reflect current state)
        // Note: In a real app, we might create a new transaction record, 
        // but here we update the "current" snapshot to keep the dashboard "Low Stock" logic working.
        if (latestInventory) {
            const newStock = currentStock - quantity
            await prisma.inventorySnapshot.update({
                where: { id: latestInventory.id },
                data: {
                    onHand: newStock,
                    status: newStock < 10 ? (newStock === 0 ? 'OUT' : 'LOW') : 'OK'
                }
            })
        }

        // 5. Log Activity
        await prisma.activityLog.create({
            data: {
                status: 'success',
                description: `New order: ${product.name} (Qty: ${quantity})`
            }
        })

        // 6. Revalidate Dashboard
        revalidatePath('/overview')
        revalidatePath('/insights')
        revalidatePath('/store')

        return createSuccessResponse(sale)

    } catch (error: any) {
        console.error('Purchase simulation error:', error)
        return createErrorResponse('Failed to process purchase', 'INTERNAL_ERROR')
    }
}
