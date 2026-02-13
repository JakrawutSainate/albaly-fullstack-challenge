
import { NextResponse } from 'next/server'
import { insightsService } from '@/services/insights'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const topProducts = await insightsService.getTopProducts()
        const regionalPerformance = await insightsService.getRegionalPerformance()
        const funnel = await insightsService.getFunnelData()
        // We added getDropOffData to the service in the previous step, so we can use it.
        // However, I need to check if I actually added it to the interface export in the service file.
        // Looking at step 79, yes I did: async getDropOffData() { ... }

        // But wait, getDropOffData calls getFunnelData internally.
        // I can just expose what is needed.
        // The requirement says: Top Products, Regional Performance, Conversion Funnel, Churn/Drop-off.

        // For drop-off, I'll calculate it here or in service. I did it in service.
        // BUT, I didn't export it in the `insightsService` object? 
        // Let me check step 79 content again.
        // Yes:
        // export const insightsService = {
        //   ...
        //   async getDropOffData() { ... }
        // }
        // So it is available.

        const dropOff = await insightsService.getDropOffData()

        return NextResponse.json({
            topProducts,
            regionalPerformance,
            funnel,
            dropOff
        })
    } catch (error) {
        console.error('Insights API Error:', error)
        return NextResponse.json({ error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to fetch insights data' } }, { status: 500 })
    }
}
