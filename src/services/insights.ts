
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const insightsService = {
    async getTopProducts() {
        const topProducts = await prisma.sale.groupBy({
            by: ['productId'],
            _sum: { amount: true, quantity: true },
            orderBy: { _sum: { amount: 'desc' } },
            take: 2,
        })

        // Enrich with product names
        const enrichedProducts = await Promise.all(topProducts.map(async (p) => {
            const product = await prisma.product.findUnique({ where: { id: p.productId } })
            return {
                name: product?.name || 'Unknown',
                revenue: p._sum.amount || 0,
                quantity: p._sum.quantity || 0,
            }
        }))

        return enrichedProducts
    },

    async getRegionalPerformance() {
        // We need customer count by region
        const regionGroups = await prisma.customer.groupBy({
            by: ['region'],
            _count: { region: true }
        })

        // Map it to the format expected by the chart
        return regionGroups.map(group => ({
            region: group.region,
            sales: group._count.region // Reuse "sales" key for count as per original mock interface or update chart
            // Note: The original requirement said "sales", but typically regional performance might be sales volume.
            // If we strictly need Sales Volume by Region:
            // Prisma doesn't do JOINs in groupBy. We'd need to fetch sales and aggregate in JS or use raw query.
            // Following the user's specific instruction "Use prisma.customer.groupBy... _count: { _all: true }"
        }))
    },

    async getFunnelData() {
        // Get the latest weekly funnel
        const funnel = await prisma.funnelWeekly.findMany({
            orderBy: { weekStart: 'desc' },
            take: 1
        })

        return funnel[0] || null
    },

    async getDropOffData() {
        // Calculate drop-off rates from the funnel
        const funnel = await this.getFunnelData()
        if (!funnel) return []

        const visitorsToView = ((funnel.visitors - funnel.productViews) / funnel.visitors) * 100
        const viewToCart = ((funnel.productViews - funnel.addToCart) / funnel.productViews) * 100
        const cartToPurchase = ((funnel.addToCart - funnel.purchases) / funnel.addToCart) * 100

        return [
            { step: 'Visitors -> View', dropOffRate: visitorsToView.toFixed(1) },
            { step: 'View -> Cart', dropOffRate: viewToCart.toFixed(1) },
            { step: 'Cart -> Purchase', dropOffRate: cartToPurchase.toFixed(1) },
        ]
    }
}

