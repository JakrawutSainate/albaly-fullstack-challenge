
import { dashboardService } from '@/services/dashboard'
import { KPICard } from '@/components/overview/KPICard'
import { ActivityFeed } from '@/components/overview/ActivityFeed'
import { OverviewCharts } from '@/components/overview/OverviewCharts'
import { DollarSign, Users, Package } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function OverviewPage() {
    const [kpi, recentActivity, monthlyPerformance] = await Promise.all([
        dashboardService.getKPIMetrics(),
        dashboardService.getRecentActivity(),
        dashboardService.getMonthlyPerformance()
    ])

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <KPICard
                    title="Total Sales"
                    value={`$${kpi.totalSales.value.toLocaleString()}`}
                    trend={Number(kpi.totalSales.change.toFixed(1))}
                    icon={DollarSign}
                />
                <KPICard
                    title="Active Customers"
                    value={kpi.activeCustomers.value}
                    trend={Number(kpi.activeCustomers.change.toFixed(1))}
                    icon={Users}
                />
                <KPICard
                    title="Inventory Alerts"
                    value={kpi.inventoryAlerts.value}
                    trendLabel={kpi.inventoryAlerts.status}
                    trend={0} // Neutral logic for now, or customize card to just show status
                    icon={Package}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <OverviewCharts monthlyPerformance={monthlyPerformance} />
                </div>
                <div className="lg:col-span-1">
                    <ActivityFeed activities={recentActivity} />
                </div>
            </div>
        </div>
    )
}
