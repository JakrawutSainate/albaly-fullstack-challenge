import { FunnelData } from "@/types/api-response";

export function FunnelChart({ data }: { data: FunnelData }) {
    const steps = [
        { label: 'Visitors', value: data.visitors, color: 'bg-indigo-200' },
        { label: 'Views', value: data.views, color: 'bg-indigo-300' },
        { label: 'Cart', value: data.cart, color: 'bg-indigo-400' },
        { label: 'Purchase', value: data.purchase, color: 'bg-indigo-600' },
    ];

    const maxValue = Math.max(...steps.map(s => s.value));

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm h-full flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold leading-6 text-slate-900">Conversion Funnel</h3>
            </div>
            <div className="p-6 flex flex-col items-center justify-center gap-4 flex-1">
                {steps.map((step) => {
                    const widthPercentage = (step.value / maxValue) * 100;
                    return (
                        <div key={step.label} className="w-full flex items-center gap-4 group">
                            <div className="w-20 text-sm font-medium text-slate-500 text-right">{step.label}</div>
                            <div className="flex-1 relative h-10 flex justify-center">
                                <div
                                    className={`h-full rounded-md transition-all ${step.color} flex items-center justify-center text-xs font-bold text-slate-800 relative`}
                                    style={{ width: `${widthPercentage}%` }}
                                >
                                    <span className="opacity-0 group-hover:opacity-100 transition-opacity absolute text-white drop-shadow-md">
                                        {step.value.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <div className="w-12 text-sm text-slate-400">
                                {Math.round((step.value / maxValue) * 100)}%
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}
