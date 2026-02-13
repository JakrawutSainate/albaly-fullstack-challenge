
import { NextResponse } from 'next/server'
import { dashboardService } from '@/services/dashboard'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const kpi = await dashboardService.getKPIMetrics()
        const activity = await dashboardService.getRecentActivity()
        const monthlyPerformance = await dashboardService.getMonthlyPerformance()

        return NextResponse.json({
            kpi,
            activity,
            monthlyPerformance
        })
    } catch (error) {
        console.error('Overview API Error:', error)
        return NextResponse.json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch overview data' } }, { status: 500 })
    }
}
