import { Suspense } from 'react'
import { getKPIMetrics, getRecentActivity, getMonthlyPerformance } from '@/services/dashboard.service'
import { OverviewCharts } from '@/components/overview/OverviewCharts'
import { KPICard } from '@/components/overview/KPICard'
import { DollarSign, Users, Package, Activity } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { AddProductButton } from '@/components/products/AddProductButton'
import { KPISkeleton } from '@/components/skeletons/KPISkeleton'

async function OverviewContent({ role }: { role?: string }) {
    const [kpi, activity, monthlyPerformance] = await Promise.all([
        getKPIMetrics(),
        role === 'ADMIN' ? getRecentActivity() : Promise.resolve([]),
        getMonthlyPerformance(),
    ])

    return (
        <div className="space-y-6 md:space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
                    <h3 className="text-lg font-semibold text-black mb-4 md:mb-6">Revenue Growth</h3>
                    {/* กำหนด min-w ให้ Chart เพื่อกันกราฟบีบจนดูไม่รู้เรื่องบนมือถือ */}
                    <div className="min-w-[500px] lg:min-w-full">
                        <OverviewCharts type="revenue" data={monthlyPerformance} />
                    </div>
                </div>

                {role === 'ADMIN' && (
                    <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
                        <h3 className="text-lg font-semibold text-black mb-4 md:mb-6 flex items-center">
                            <Activity className="w-5 h-5 mr-2 text-indigo-500" />
                            Recent Activity
                        </h3>
                        <div className="space-y-5 md:space-y-6">
                            {activity.map((item: { id: string, status: string, description: string, createdAt: Date }) => (
                                <div key={item.id} className="flex items-start space-x-3 pb-5 md:pb-6 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                                    <div className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${item.status === 'success' ? 'bg-green-500' :
                                        item.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                                        }`} />
                                    <div>
                                        <p className="text-sm font-medium text-black leading-tight">{item.description}</p>
                                        <p className="text-xs text-gray-500 mt-1">
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
        <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto">
            {/* เปลี่ยน flex เป็น col ในมือถือ เพื่อไม่ให้ Text กับปุ่ม Add เบียดกัน */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-black">Dashboard Overview</h1>
                    <p className="text-sm md:text-base text-gray-500">Welcome back, {session?.email}</p>
                </div>
                {session?.role === 'ADMIN' && (
                    <div className="w-full sm:w-auto flex justify-end">
                        <AddProductButton />
                    </div>
                )}
            </div>

            <Suspense fallback={<KPISkeleton />}>
                <OverviewContent role={session?.role} />
            </Suspense>
        </div>
    )
}