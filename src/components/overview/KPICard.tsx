
import { ArrowDown, ArrowUp, Minus } from 'lucide-react'

interface KPIProps {
    title: string
    value: string | number
    trend?: number
    change?: number // Alias for trend
    trendLabel?: string
    icon?: React.ElementType
    inverseTrend?: boolean
}

export function KPICard({ title, value, trend, change, trendLabel, icon: Icon, inverseTrend }: KPIProps) {
    const changeValue = change !== undefined ? change : trend
    const isPositive = changeValue && changeValue > 0
    const isNeutral = changeValue === 0

    return (
        <div className="bg-white overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
                <div className="flex-shrink-0">
                    {Icon && <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />}
                </div>
                <div className="ml-5 w-0 flex-1">
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-lg font-medium text-gray-900">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            <div className="mt-4">
                {changeValue !== undefined && (
                    <div className="flex items-center text-sm">
                        {isNeutral ? (
                            <Minus className="flex-shrink-0 h-4 w-4 text-gray-400" aria-hidden="true" />
                        ) : isPositive ? (
                            <ArrowUp className="flex-shrink-0 h-4 w-4 text-green-500" aria-hidden="true" />
                        ) : (
                            <ArrowDown className="flex-shrink-0 h-4 w-4 text-red-500" aria-hidden="true" />
                        )}
                        <span className={`ml-1 font-medium ${isNeutral ? 'text-gray-500' : isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(changeValue)}%
                        </span>
                        <span className="ml-2 text-gray-500">{trendLabel || 'vs last month'}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
