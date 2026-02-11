
import { PrismaClient, InventoryStatus } from '@prisma/client'

const prisma = new PrismaClient()

export async function getKPIs() {
    const totalSalesData = await prisma.sale.aggregate({
        _sum: {
            amount: true,
        },
    })
    const totalSales = totalSalesData._sum.amount || 0

    const activeCustomers = await prisma.customer.count({
        where: {
            isActive: true,
        },
    })

    // Count items with LOW or OUT status
    const inventoryAlerts = await prisma.inventorySnapshot.count({
        where: {
            status: {
                in: [InventoryStatus.LOW, InventoryStatus.OUT],
            },
            snapshotDate: {
                gte: new Date(new Date().setHours(0, 0, 0, 0)), // Today's snapshot
            },
        },
    })

    return {
        totalSales,
        activeCustomers,
        inventoryAlerts,
    }
}

export async function getRecentActivity() {
    return await prisma.activityLog.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc',
        },
    })
}

export async function getMonthlyPerformance() {
    // Grouping by month in Prisma is tricky without raw SQL, doing basic aggregation here
    // Fetching all sales might be heavy in prod, but fine for this scale
    const sales = await prisma.sale.findMany({
        select: {
            createdAt: true,
            amount: true,
        },
        orderBy: {
            createdAt: 'asc',
        },
    })

    const monthlyData: Record<string, number> = {}

    sales.forEach((sale) => {
        const month = sale.createdAt.toLocaleString('default', { month: 'short' })
        if (!monthlyData[month]) {
            monthlyData[month] = 0
        }
        monthlyData[month] += sale.amount
    })

    return Object.entries(monthlyData).map(([name, value]) => ({ name, value }))
}
