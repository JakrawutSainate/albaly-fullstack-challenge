import prisma from "@/lib/prisma";
import { KpiData, MonthlyPerformanceData, FunnelData } from "@/types/api-response";

export class AnalyticsService {
    async getKpiData(): Promise<KpiData> {
        const totalSales = await prisma.sale.aggregate({
            _sum: { amount: true }
        });

        // In a real world, we would compare with previous month
        const activeCustomers = await prisma.customer.count();

        // Using Product count as proxy for inventory items types, 
        // or we could sum InventorySnapshot if we had current snapshot
        const inventoryCount = await prisma.product.count();

        return {
            totalSales: totalSales._sum.amount || 0,
            totalSalesGrowth: 12, // Mocked growth
            activeCustomers,
            activeCustomersGrowth: 6, // Mocked growth
            inventoryCount, // This might need to be Sum of quantities in real inventory system
            inventoryGrowth: 3 // Mocked growth
        };
    }

    async getMonthlyPerformance(): Promise<MonthlyPerformanceData[]> {
        // Mock data for chart visualization
        // In production, this would use a raw query or groupBy on Sale model
        return [
            { month: "Jan", value: 4000 },
            { month: "Feb", value: 3000 },
            { month: "Mar", value: 2000 },
            { month: "Apr", value: 2780 },
            { month: "May", value: 1890 },
            { month: "Jun", value: 2390 },
            { month: "Jul", value: 3490 },
        ];
    }

    async getFunnelData(): Promise<FunnelData> {
        const latestFunnel = await prisma.funnelWeekly.findFirst({
            orderBy: { weekStart: 'desc' }
        });

        if (!latestFunnel) {
            // Default fallback or 'seed' data if DB is empty
            return {
                visitors: 5000,
                views: 3500,
                cart: 2000,
                purchase: 1245
            }
        }

        return {
            visitors: latestFunnel.visitors,
            views: latestFunnel.views,
            cart: latestFunnel.cart,
            purchase: latestFunnel.purchase
        };
    }

    async getRecentActivity() {
        const logs = await prisma.activityLog.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                action: true,
                details: true,
                createdAt: true
            }
        });

        return logs.map((log: any) => ({
            id: log.id,
            action: log.action,
            details: log.details || undefined, // Map explicitly or use object spread, just being safe
            timestamp: log.createdAt.toISOString()
        }));
    }
}
