import { AnalyticsService } from '@/services/analytics.service';
import { ProductService } from '@/services/product.service';
import { FunnelChart } from '@/components/dashboard/FunnelChart';
import { RegionPerformanceChart } from '@/components/dashboard/RegionPerformanceChart';
import { ProductComparison } from '@/components/dashboard/ProductComparison';

async function getData() {
    const analyticsService = new AnalyticsService();
    const productService = new ProductService();

    const funnelData = await analyticsService.getFunnelData();
    const topProducts = await productService.getTopSellingProducts();
    const regionPerformance = await productService.getRegionPerformance();

    // Mock churn data as simple list
    const churnData = [
        { week: 'Week 1', rate: 2.5 },
        { week: 'Week 2', rate: 1.8 },
        { week: 'Week 3', rate: 3.2 },
        { week: 'Week 4', rate: 2.1 },
    ];

    return { funnelData, topProducts, regionPerformance, churnData };
}

export default async function InsightsPage() {
    const { funnelData, topProducts, regionPerformance, churnData } = await getData();

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Row */}
            <div className="h-80">
                <ProductComparison products={topProducts} />
            </div>

            <div className="rounded-xl border border-slate-200 bg-white shadow-sm h-80 flex flex-col">
                <div className="border-b border-slate-200 px-6 py-4">
                    <h3 className="text-base font-semibold leading-6 text-slate-900">Customer Drop-Off (Churn)</h3>
                </div>
                <div className="p-6 space-y-4 overflow-auto">
                    {churnData.map((item) => (
                        <div key={item.week} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0">
                            <span className="text-sm font-medium text-slate-600">{item.week}</span>
                            <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                                {item.rate}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Row */}
            <div className="h-96">
                <RegionPerformanceChart data={regionPerformance} />
            </div>
            <div className="h-96">
                <FunnelChart data={funnelData} />
            </div>
        </div>
    );
}
