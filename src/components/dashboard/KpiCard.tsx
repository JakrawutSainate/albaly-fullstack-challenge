
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'

interface KPICardProps {
    title: string
    value: string | number
    trend?: {
        value: number
        direction: 'up' | 'down' | 'neutral'
    }
    icon?: React.ElementType
}

export default function KPICard({ title, value, trend, icon: Icon }: KPICardProps) {
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg p-5">
            <div className="flex items-center">
                {Icon && (
                    <div className="flex-shrink-0">
                        <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
                    </div>
                )}
                <div className={`w-0 flex-1 ${Icon ? 'ml-5' : ''}`}>
                    <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                        <dd>
                            <div className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</div>
                        </dd>
                    </dl>
                </div>
            </div>
            {trend && (
                <div className={`mt-4 flex items-center text-sm ${trend.direction === 'up' ? 'text-green-600' :
                        trend.direction === 'down' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                    {trend.direction === 'up' ? <ArrowUpRight className="h-4 w-4 mr-1" /> :
                        trend.direction === 'down' ? <ArrowDownRight className="h-4 w-4 mr-1" /> :
                            <Minus className="h-4 w-4 mr-1" />
                    }
                    <span className="font-medium">{Math.abs(trend.value)}%</span>
                    <span className="ml-2 text-gray-400">vs last month</span>
                </div>
            )}
        </div>
    )
}
