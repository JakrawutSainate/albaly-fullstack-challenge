
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getTopProducts() {
    const topSales = await prisma.sale.groupBy({
        by: ['productId'],
        _sum: {
            amount: true,
            quantity: true,
        },
        orderBy: {
            _sum: {
                amount: 'desc',
            },
        },
        take: 5,
    })

    // Fetch product details
    const products = await Promise.all(
        topSales.map(async (sale) => {
            const product = await prisma.product.findUnique({
                where: { id: sale.productId },
            })
            return {
                name: product?.name || 'Unknown',
                amount: sale._sum.amount || 0,
                quantity: sale._sum.quantity || 0,
            }
        })
    )

    return products
}

export async function getRegionalPerformance() {
    // Aggregate sales by customer region
    // Since Relation aggregation for groupBy is not fully supported in simple API, 
    // we might use raw query or fetch and map.
    // Using queryRaw for efficiency.

    const result = await prisma.$queryRaw`
    SELECT c.region, SUM(s.amount) as amount
    FROM "Sale" s
    JOIN "Customer" c ON s."customerId" = c.id
    GROUP BY c.region
  ` as { region: string, amount: number }[]

    // Serialize BigInt if any (Prisma sums might be Decimal/Float but raw query might differ)
    // safe cast
    return result.map(r => ({
        region: r.region,
        amount: Number(r.amount)
    }))
}

export async function getFunnelData() {
    // Get the latest weekly funnel
    return await prisma.funnelWeekly.findMany({
        orderBy: {
            weekStart: 'asc',
        },
        take: 4
    })
}

export async function getCustomerDropoff() {
    // Derived from funnel data - simplistic view
    const funnels = await getFunnelData()
    if (funnels.length === 0) return []

    // Average of last 4 weeks
    const avg = {
        visitors: 0,
        views: 0,
        cart: 0,
        purchase: 0
    }

    funnels.forEach(f => {
        avg.visitors += f.visitors
        avg.views += f.views
        avg.cart += f.cart
        avg.purchase += f.purchase
    })

    const count = funnels.length
    return [
        { name: 'Visitors', value: Math.round(avg.visitors / count) },
        { name: 'Views', value: Math.round(avg.views / count) },
        { name: 'Cart', value: Math.round(avg.cart / count) },
        { name: 'Purchase', value: Math.round(avg.purchase / count) },
    ]
}
