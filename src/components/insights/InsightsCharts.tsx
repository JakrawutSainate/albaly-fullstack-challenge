'use client'

import { TopProductsChart, RegionalChart, ConversionFunnelChart, DropOffTable } from './Charts'

interface InsightsChartsProps {
    topProducts: any[]
    regionalPerformance: any[]
    funnel: any
    dropOff: any[]
}

export function InsightsCharts({ topProducts, regionalPerformance, funnel, dropOff }: InsightsChartsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProductsChart data={topProducts} />
                <RegionalChart data={regionalPerformance} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ConversionFunnelChart data={funnel} />
                <DropOffTable data={dropOff} />
            </div>
        </div>
    )
}
