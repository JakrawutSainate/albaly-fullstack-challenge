import prisma from '@/lib/prisma'

export async function getTopProducts() {
    const topProducts = await prisma.sale.groupBy({
        by: ['productId'],
        _sum: { amount: true, quantity: true },
        orderBy: { _sum: { amount: 'desc' } },
        take: 2,
    })

    const enrichedProducts = await Promise.all(topProducts.map(async (p) => {
        const product = await prisma.product.findUnique({ where: { id: p.productId } })
        return {
            name: product?.name || 'Unknown',
            revenue: p._sum.amount || 0,
            quantity: p._sum.quantity || 0,
        }
    }))

    return enrichedProducts
}

export async function getRegionalPerformance() {
    const regionGroups = await prisma.customer.groupBy({
        by: ['region'],
        _count: { region: true }
    })

    return regionGroups.map(group => ({
        region: group.region,
        sales: group._count.region
    }))
}

export async function getFunnelData() {
    const funnel = await prisma.funnelWeekly.findMany({
        orderBy: { weekStart: 'desc' },
        take: 1
    })

    return funnel[0] || null
}

export async function getDropOffData() {
    const funnel = await getFunnelData()
    if (!funnel) return []

    const visitorsToView = funnel.visitors ? ((funnel.visitors - funnel.productViews) / funnel.visitors) * 100 : 0
    const viewToCart = funnel.productViews ? ((funnel.productViews - funnel.addToCart) / funnel.productViews) * 100 : 0
    const cartToPurchase = funnel.addToCart ? ((funnel.addToCart - funnel.purchases) / funnel.addToCart) * 100 : 0

    return [
        { step: 'Visitors -> View', dropOffRate: visitorsToView.toFixed(1) },
        { step: 'View -> Cart', dropOffRate: viewToCart.toFixed(1) },
        { step: 'Cart -> Purchase', dropOffRate: cartToPurchase.toFixed(1) },
    ]
}
