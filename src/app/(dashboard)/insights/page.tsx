
import { getTopProducts, getRegionalPerformance, getFunnelData, getCustomerDropoff } from '@/services/insights'
import TopProductsChart from '@/components/charts/TopProductsChart'
import RegionalPerformanceChart from '@/components/charts/RegionalPerformanceChart'
import FunnelChart from '@/components/charts/FunnelChart'
import SimpleFunnelChart from '@/components/charts/SimpleFunnelChart'

export const dynamic = 'force-dynamic'

export default async function InsightsPage() {
    const topProducts = await getTopProducts()
    const regionalPerformance = await getRegionalPerformance()
    const funnelData = await getFunnelData()
    const dropoffData = await getCustomerDropoff()

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Insights</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProductsChart data={topProducts} />
                <RegionalPerformanceChart data={regionalPerformance} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FunnelChart data={funnelData} />
                <SimpleFunnelChart data={dropoffData} />
            </div>
        </div>
    )
}
