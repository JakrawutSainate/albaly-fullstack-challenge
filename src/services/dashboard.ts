
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const dashboardService = {
    async getKPIMetrics() {
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
        // Compare with total customers for a simple "engagement rate" or just use a placeholder trend if no historical data
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
                change: Number(customerTrend.toFixed(1)), // Using active % as a proxy for trend for now
                trendLabel: '% of total base'
            },
            inventoryAlerts: {
                value: totalAlerts,
                status: totalAlerts > 5 ? 'Critical' : 'Stable'
            }
        }
    },

    async getRecentActivity() {
        return await prisma.activityLog.findMany({
            take: 3,
            orderBy: { createdAt: 'desc' },
        })
    },

    async getMonthlyPerformance() {
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

        const sales = await prisma.sale.findMany({
            where: { createdAt: { gte: sixMonthsAgo } },
            select: { createdAt: true, amount: true },
            orderBy: { createdAt: 'asc' }
        })

        const monthlyData: Record<string, number> = {}

        // Initialize last 6 months to ensure 0s if no sales
        for (let i = 0; i < 6; i++) {
            const d = new Date()
            d.setMonth(d.getMonth() - i)
            const monthName = d.toLocaleString('default', { month: 'short' })
            monthlyData[monthName] = 0
        }

        sales.forEach(sale => {
            const month = sale.createdAt.toLocaleString('default', { month: 'short' })
            // Only add if it's within our window (handled by query, but good for safety)
            if (monthlyData[month] !== undefined) {
                monthlyData[month] += sale.amount
            } else {
                // Fallback if month order differs
                monthlyData[month] = (monthlyData[month] || 0) + sale.amount
            }
        })

        // Sort by month logic or return as is (Recharts handles categories usually)
        // For simplicity, let's just return the entries we built
        return Object.entries(monthlyData)
            .map(([month, revenue]) => ({ month, revenue }))
            .reverse() // Basic reverse to order roughly chronologically if created strictly backwards
    }
}

