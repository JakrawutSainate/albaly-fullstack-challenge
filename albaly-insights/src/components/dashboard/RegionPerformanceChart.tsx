import { RegionPerformance } from "@/types/api-response";

export function RegionPerformanceChart({ data }: { data: RegionPerformance[] }) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm h-full flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold leading-6 text-slate-900">Regional Performance</h3>
            </div>
            <div className="p-6 flex flex-col justify-center gap-6 flex-1">
                {data.map((item) => (
                    <div key={item.region}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{item.region}</span>
                            <span className="text-sm font-medium text-slate-500">{item.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2.5">
                            <div
                                className="bg-indigo-600 h-2.5 rounded-full transition-all"
                                style={{ width: `${item.percentage}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
