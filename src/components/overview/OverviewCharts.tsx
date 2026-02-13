'use client'

import { RevenueChart } from './RevenueChart'

interface OverviewChartsProps {
    monthlyPerformance: { month: string; revenue: number }[]
}

export function OverviewCharts({ monthlyPerformance }: OverviewChartsProps) {
    return (
        <RevenueChart data={monthlyPerformance} />
    )
}
