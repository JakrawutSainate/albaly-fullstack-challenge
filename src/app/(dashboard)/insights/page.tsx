
import { getTopProducts, getRegionalPerformance, getFunnelData, getDropOffData } from '@/services/insights.service'
import { InsightsCharts } from '@/components/insights/InsightsCharts'


export default async function InsightsPage() {
    const [topProducts, regionalPerformance, funnel, dropOff] = await Promise.all([
        getTopProducts(),
        getRegionalPerformance(),
        getFunnelData(),
        getDropOffData()
    ])

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Performance Insights</h2>

            <InsightsCharts
                topProducts={topProducts}
                regionalPerformance={regionalPerformance}
                funnel={funnel}
                dropOff={dropOff}
            />
        </div>
    )
}
