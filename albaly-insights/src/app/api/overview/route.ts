import { NextRequest } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';
import { ApiResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const analyticsService = new AnalyticsService();

        // Parallel fetch for performance
        const [kpi, monthlyPerformance] = await Promise.all([
            analyticsService.getKpiData(),
            analyticsService.getMonthlyPerformance()
        ]);

        // Mock recent activity as per service limitation
        const recentActivity = [
            { id: '1', action: 'NEW_CUSTOMER', details: 'New customer signed up', timestamp: new Date().toISOString() },
            { id: '2', action: 'PURCHASE', details: 'Order #1234 completed', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        ];

        return ApiResponse.success({
            kpi,
            monthlyPerformance,
            recentActivity
        });
    } catch (error) {
        console.error('Overview API Error:', error);
        return ApiResponse.internalError('Failed to fetch overview data');
    }
}
