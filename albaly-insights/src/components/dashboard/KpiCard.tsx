import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
    title: string;
    value: string;
    change: string;
    trend: 'up' | 'down';
    icon: LucideIcon;
    variant?: 'default' | 'warning';
}

export function KpiCard({ title, value, change, trend, icon: Icon, variant = 'default' }: KpiCardProps) {
    const isPositive = trend === 'up';

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                        <span className="text-2xl font-semibold text-slate-900">{value}</span>
                        <span
                            className={cn(
                                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                                variant === 'warning'
                                    ? "bg-yellow-100 text-yellow-800"
                                    : isPositive
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-red-100 text-red-800"
                            )}
                        >
                            {isPositive ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                            {change}
                        </span>
                    </div>
                </div>
                <div className={cn("rounded-lg p-2 ring-1 ring-inset", variant === 'warning' ? "bg-yellow-50 text-yellow-600 ring-yellow-500/10" : "bg-indigo-50 text-indigo-600 ring-indigo-500/10")}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
