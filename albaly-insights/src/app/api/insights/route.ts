import { NextRequest } from 'next/server';
import { AnalyticsService } from '@/services/analytics.service';
import { ProductService } from '@/services/product.service';
import { ApiResponse } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const analyticsService = new AnalyticsService();
        const productService = new ProductService();

        const [funnelData, topProducts, regionPerformance] = await Promise.all([
            analyticsService.getFunnelData(),
            productService.getTopSellingProducts(),
            productService.getRegionPerformance()
        ]);

        return ApiResponse.success({
            funnelData,
            topProducts,
            regionPerformance
        });
    } catch (error) {
        console.error('Insights API Error:', error);
        return ApiResponse.internalError('Failed to fetch insights data');
    }
}
