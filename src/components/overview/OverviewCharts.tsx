'use client'

import { RevenueChart } from './RevenueChart'

interface OverviewChartsProps {
    monthlyPerformance?: { month: string; revenue: number }[]
    data?: any[]
    type?: 'revenue' | 'other'
}

export function OverviewCharts({ monthlyPerformance, data, type }: OverviewChartsProps) {
    const performanceData = data || monthlyPerformance || []

    if (type === 'revenue' || !type) {
        return <RevenueChart data={performanceData} />
    }

    return null
}
