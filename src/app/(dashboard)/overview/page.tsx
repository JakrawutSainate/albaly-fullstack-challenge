import { AnalyticsService } from '@/services/analytics.service';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { MonthlyPerformanceChart } from '@/components/dashboard/MonthlyPerformanceChart';
import { BarChart3, Users, Package } from 'lucide-react';

// In a real Server Component value-add, we fetch directly
async function getData() {
    const analyticsService = new AnalyticsService();

    // Parallel fetch for optimal performance
    const [kpi, monthlyPerformance, recentActivity] = await Promise.all([
        analyticsService.getKpiData(),
        analyticsService.getMonthlyPerformance(),
        analyticsService.getRecentActivity()
    ]);

    return { kpi, monthlyPerformance, recentActivity };
}

export default async function OverviewPage() {
    const { kpi, monthlyPerformance, recentActivity } = await getData();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <KpiCard
                    title="Total Sales"
                    value={`$${kpi.totalSales.toLocaleString()}`}
                    change={`+${kpi.totalSalesGrowth}%`}
                    trend="up"
                    icon={BarChart3}
                />
                <KpiCard
                    title="Active Customers"
                    value={kpi.activeCustomers.toLocaleString()}
                    change={`+${kpi.activeCustomersGrowth}%`}
                    trend="up"
                    icon={Users}
                />
                <KpiCard
                    title="Inventory Status"
                    value={kpi.inventoryCount.toLocaleString()}
                    change={`+${kpi.inventoryGrowth}%`}
                    trend="up"
                    variant="warning"
                    icon={Package}
                />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ActivityFeed activities={recentActivity} />
                </div>
                <div>
                    <MonthlyPerformanceChart data={monthlyPerformance} />
                </div>
            </div>
        </div>
    );
}
