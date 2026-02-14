import prisma from "@/lib/prisma";
import { KpiData, MonthlyPerformanceData, FunnelData } from "@/types/api-response";

export class AnalyticsService {
    async getKpiData(): Promise<KpiData> {
        // 1. Total Sales
        const totalSalesAgg = await prisma.sale.aggregate({
            _sum: { amount: true }
        });
        const totalSales = totalSalesAgg._sum.amount || 0;

        // Calculate MoM Sales Growth
        const now = new Date();
        const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentMonthSales = await prisma.sale.aggregate({
            where: { createdAt: { gte: startOfCurrentMonth } },
            _sum: { amount: true }
        });
        const lastMonthSales = await prisma.sale.aggregate({
            where: { createdAt: { gte: startOfLastMonth, lte: endOfLastMonth } },
            _sum: { amount: true }
        });

        const currentSalesVal = currentMonthSales._sum.amount || 0;
        const lastSalesVal = lastMonthSales._sum.amount || 0;
        const totalSalesGrowth = lastSalesVal === 0 ? 100 : ((currentSalesVal - lastSalesVal) / lastSalesVal) * 100;

        // 2. Active Customers
        const activeCustomers = await prisma.customer.count({
            where: { isActive: true }
        });

        // Mocking customer growth logic
        const activeCustomersGrowth = 5.0;

        // 3. Inventory Status
        // แก้ไข: เปลี่ยนจาก snapshotDate เป็น createdAt ให้ตรงกับ Prisma Schema
        const latestSnapshot = await prisma.inventorySnapshot.findFirst({
            orderBy: { createdAt: 'desc' }
        });

        let inventoryCount = 0;
        if (latestSnapshot) {
            const latestSnapshotsAgg = await prisma.inventorySnapshot.aggregate({
                where: { createdAt: latestSnapshot.createdAt }, // แก้ไขตรงนี้ด้วย
                _sum: { onHand: true }
            });
            inventoryCount = latestSnapshotsAgg._sum.onHand || 0;
        }

        const inventoryGrowth = -2.0;

        return {
            totalSales,
            totalSalesGrowth,
            activeCustomers,
            activeCustomersGrowth,
            inventoryCount,
            inventoryGrowth
        };
    }

    async getMonthlyPerformance(): Promise<MonthlyPerformanceData[]> {
        const sales = await prisma.$queryRaw`
            SELECT TO_CHAR("createdAt", 'Mon') as month, SUM(amount) as value
            FROM "Sale"
            WHERE "createdAt" >= NOW() - INTERVAL '6 months'
            GROUP BY TO_CHAR("createdAt", 'Mon'), EXTRACT(MONTH FROM "createdAt")
            ORDER BY EXTRACT(MONTH FROM "createdAt") ASC
        `;

        return (sales as any[]).map(s => ({
            month: s.month,
            value: Number(s.value)
        }));
    }

    async getFunnelData(): Promise<FunnelData> {
        const latestFunnel = await prisma.funnelWeekly.findFirst({
            orderBy: { weekStart: 'desc' }
        });

        if (!latestFunnel) {
            return {
                visitors: 5000,
                views: 3500,
                cart: 2000,
                purchase: 1245
            }
        }

        return {
            visitors: latestFunnel.visitors,
            views: latestFunnel.productViews,
            cart: latestFunnel.addToCart,
            purchase: latestFunnel.purchases
        };
    }

    async getRecentActivity() {
        // แก้ไข: เปลี่ยน select ให้ใช้ status และ description แทน action และ details
        const logs = await prisma.activityLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                status: true,
                description: true,
                createdAt: true
            }
        });

        // แก้ไข: map ข้อมูลให้ตรงกับที่ Frontend (ActivityFeed) คาดหวัง
        return logs.map(log => ({
            id: log.id,
            status: log.status,
            description: log.description || '',
            createdAt: log.createdAt // หน้า Frontend ของเราต้องการเป็น Object Date ไม่ใช่ String
        }));
    }
}