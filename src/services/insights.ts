
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
        // We need sales joined with customer region.
        // Prisma groupBy doesn't support joining relations directly.
        // Use findMany and aggregate in JS.
        const sales = await prisma.sale.findMany({
            include: { customer: true },
        })

        const regionStats: Record<string, number> = {}

        sales.forEach(sale => {
            const region = sale.customer.region
            regionStats[region] = (regionStats[region] || 0) + sale.amount
        })

        return Object.entries(regionStats).map(([region, sales]) => ({ region, sales }))
    },

    async getFunnelData() {
        // Get the latest weekly funnel
        return await prisma.funnelWeekly.findFirst({
            orderBy: { weekStart: 'desc' }
        })
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
