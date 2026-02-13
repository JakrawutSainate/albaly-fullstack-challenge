import { Suspense } from 'react'
import { getKPIMetrics, getRecentActivity, getMonthlyPerformance } from '@/services/dashboard.service'
import { OverviewCharts } from '@/components/overview/OverviewCharts'
import { KPICard } from '@/components/overview/KPICard'
import { DollarSign, Users, Package, Activity } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { AddProductButton } from '@/components/products/AddProductButton'
import { KPISkeleton } from '@/components/skeletons/KPISkeleton'

export const dynamic = 'force-dynamic'

async function OverviewContent({ role }: { role?: string }) {
    const [kpi, activity, monthlyPerformance] = await Promise.all([
        getKPIMetrics(),
        role === 'ADMIN' ? getRecentActivity() : Promise.resolve([]),
        getMonthlyPerformance(),
    ])

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <KPICard
                    title="Total Sales"
                    value={kpi.totalSales.value}
                    change={kpi.totalSales.change}
                    icon={DollarSign}
                />
                <KPICard
                    title="Active Customers"
                    value={kpi.activeCustomers.value}
                    change={kpi.activeCustomers.change}
                    icon={Users}
                />
                <KPICard
                    title="Inventory Alerts"
                    value={kpi.inventoryAlerts.value}
                    change={kpi.inventoryAlerts.change}
                    icon={Package}
                    inverseTrend
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Revenue Growth</h3>
                    <OverviewCharts type="revenue" data={monthlyPerformance} />
                </div>

                {role === 'ADMIN' && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                            Recent Activity
                        </h3>
                        <div className="space-y-6">
                            {activity.map((item: { id: string, status: string, description: string, createdAt: Date }) => (
                                <div key={item.id} className="flex items-start space-x-3 pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                    <div className={`w-2 h-2 mt-2 rounded-full ${item.status === 'success' ? 'bg-green-500' :
                                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{item.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {item.createdAt.toISOString().split('T')[0]}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default async function OverviewPage() {
    const session = await getSession()

    return (
        <div className="p-8 space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, {session?.email}</p>
                </div>
                {session?.role === 'ADMIN' && <AddProductButton />}
            </div>

            <Suspense fallback={<KPISkeleton />}>
                <OverviewContent role={session?.role} />
            </Suspense>
        </div>
    )
}
