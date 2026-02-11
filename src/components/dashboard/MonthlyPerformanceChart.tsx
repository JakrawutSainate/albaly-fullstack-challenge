import { MonthlyPerformanceData } from "@/types/api-response";

export function MonthlyPerformanceChart({ data }: { data: MonthlyPerformanceData[] }) {
    const maxValue = Math.max(...data.map(d => d.value));

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm h-full flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold leading-6 text-slate-900">Monthly Performance</h3>
            </div>
            <div className="p-6 flex-1 flex items-end justify-between gap-2">
                {data.map((item) => {
                    const heightPercentage = (item.value / maxValue) * 100;
                    return (
                        <div key={item.month} className="flex flex-col items-center gap-2 flex-1 group">
                            <div className="relative w-full bg-slate-100 rounded-t-md h-48 flex items-end overflow-hidden">
                                <div
                                    className="w-full bg-indigo-500 hover:bg-indigo-600 transition-all rounded-t-md relative group-hover:opacity-90"
                                    style={{ height: `${heightPercentage}%` }}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        ${item.value.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-slate-500">{item.month}</span>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
