
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dashboardService = {
    async getKPIMetrics() {
        // 1. Total Sales (This Month vs Last Month)
        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)

        const currentMonthSales = await prisma.sale.aggregate({
            _sum: { amount: true },
            where: { createdAt: { gte: startOfMonth } },
        })

        const lastMonthSales = await prisma.sale.aggregate({
            _sum: { amount: true },
            where: {
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
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
        // For demo, we just compare to total customers or a fixed number to show a "trend"
        // Ideally we'd have historical customer data, but for now we'll just return the count and a mock trend
        const activeCustomersGrowth = 5.2 // Mock 5.2% growth

        // 3. Inventory Status
        const lowStockCount = await prisma.inventorySnapshot.count({
            where: { status: { in: ['LOW', 'OUT'] } },
        })

        return {
            totalSales: { value: currentSales, change: salesGrowth },
            activeCustomers: { value: activeCustomers, change: activeCustomersGrowth },
            inventoryAlerts: { value: lowStockCount, status: lowStockCount > 5 ? 'Critical' : 'Stable' }
        }
    },

    async getRecentActivity() {
        return await prisma.activityLog.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
        })
    },

    async getMonthlyPerformance() {
        // Return last 6 months of sales
        // Since Prisma groupBy on dates is tricky without raw query or logic, 
        // we'll fetch sales and aggregate in JS for simplicity or use raw query if needed.
        // Given the scale, fetching last 6 months sales and reducing is fine.

        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const sales = await prisma.sale.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, amount: true },
        })

        const monthlyData: Record<string, number> = {}

        sales.forEach(sale => {
            const month = sale.createdAt.toLocaleString('default', { month: 'short' })
            monthlyData[month] = (monthlyData[month] || 0) + sale.amount
        })

        return Object.entries(monthlyData).map(([month, revenue]) => ({ month, revenue }))
    }
}
