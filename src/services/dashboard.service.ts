import prisma from '@/lib/prisma'

export async function getKPIMetrics() {
    const now = new Date()
    const firstDayWhy = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

    // 1. Total Sales
    const currentMonthSales = await prisma.sale.aggregate({
        _sum: { amount: true },
        where: { createdAt: { gte: firstDayWhy } },
    })

    const lastMonthSales = await prisma.sale.aggregate({
        _sum: { amount: true },
        where: {
            createdAt: {
                gte: firstDayLastMonth,
                lte: lastDayLastMonth,
            },
        },
    })

    const currentSales = currentMonthSales._sum.amount || 0
    const lastSales = lastMonthSales._sum.amount || 0
    const salesGrowth = lastSales === 0 ? 100 : ((currentSales - lastSales) / lastSales) * 100

    // 2. Active Customers
    const activeCustomers = await prisma.customer.count({
        where: { isActive: true },
    })

    const totalCustomers = await prisma.customer.count()
    const customerTrend = totalCustomers === 0 ? 0 : ((activeCustomers / totalCustomers) * 100)

    // 3. Inventory Status
    const lowStockCount = await prisma.inventorySnapshot.count({
        where: { status: 'LOW' }
    })
    const outOfStockCount = await prisma.inventorySnapshot.count({
        where: { status: 'OUT' }
    })
    const totalAlerts = lowStockCount + outOfStockCount

    return {
        totalSales: {
            value: currentSales,
            change: Number(salesGrowth.toFixed(1)),
            trendLabel: 'vs last month'
        },
        activeCustomers: {
            value: activeCustomers,
            change: Number(customerTrend.toFixed(1)),
            trendLabel: '% of total base'
        },
        inventoryAlerts: {
            value: totalAlerts,
            change: 0, // No trend for alerts yet
            status: totalAlerts > 5 ? 'Critical' : 'Stable'
        }
    }
}

export async function getRecentActivity() {
    return await prisma.activityLog.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
    })
}

export async function getMonthlyPerformance() {
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    const sales = await prisma.sale.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true, amount: true },
        orderBy: { createdAt: 'asc' }
    })

    const monthlyData: Record<string, number> = {}

    // Initialize last 6 months
    for (let i = 0; i < 6; i++) {
        const d = new Date()
        d.setMonth(d.getMonth() - i)
        const monthName = d.toLocaleString('default', { month: 'short' })
        monthlyData[monthName] = 0
    }

    sales.forEach(sale => {
        const month = sale.createdAt.toLocaleString('default', { month: 'short' })
        if (monthlyData[month] !== undefined) {
            monthlyData[month] += sale.amount
        } else {
            monthlyData[month] = (monthlyData[month] || 0) + sale.amount
        }
    })

    return Object.entries(monthlyData)
        .map(([month, revenue]) => ({ month, revenue }))
        .reverse()
}
