
import { insightsService } from '@/services/insights'
import { InsightsCharts } from '@/components/insights/InsightsCharts'

export const dynamic = 'force-dynamic'

export default async function InsightsPage() {
    const [topProducts, regionalPerformance, funnel, dropOff] = await Promise.all([
        insightsService.getTopProducts(),
        insightsService.getRegionalPerformance(),
        insightsService.getFunnelData(),
        insightsService.getDropOffData()
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
