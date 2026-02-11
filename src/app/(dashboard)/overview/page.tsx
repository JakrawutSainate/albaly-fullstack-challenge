
import { getKPIs, getRecentActivity, getMonthlyPerformance } from '@/services/dashboard'
import KPICard from '@/components/dashboard/KpiCard'
import ActivityFeed from '@/components/dashboard/ActivityFeed'
import MonthlyPerformanceChart from '@/components/charts/MonthlyPerformanceChart'
import { DollarSign, Users, Package } from 'lucide-react'

export const dynamic = 'force-dynamic' // Ensure real-time data

export default async function OverviewPage() {
    const kpis = await getKPIs()
    const recentActivity = await getRecentActivity()
    const monthlyPerformance = await getMonthlyPerformance()

    // Simulate trend data (in a real app, compare with previous period)
    const trends = {
        sales: { value: 12, direction: 'up' as const },
        customers: { value: 5, direction: 'up' as const },
        inventory: { value: 2, direction: 'down' as const } // e.g. fewer alerts is good, or more stock is good? Let's assume neutral or just display
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Overview</h2>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <KPICard
                    title="Total Sales"
                    value={`$${kpis.totalSales.toLocaleString()}`}
                    icon={DollarSign}
                    trend={trends.sales}
                />
                <KPICard
                    title="Active Customers"
                    value={kpis.activeCustomers}
                    icon={Users}
                    trend={trends.customers}
                />
                <KPICard
                    title="Inventory Alerts"
                    value={kpis.inventoryAlerts}
                    icon={Package}
                    trend={{ value: 0, direction: 'neutral' }} // Placeholder
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Performance Chart */}
                <MonthlyPerformanceChart data={monthlyPerformance} />

                {/* Recent Activity Feed */}
                <ActivityFeed activities={recentActivity} />
            </div>
        </div>
    )
}
