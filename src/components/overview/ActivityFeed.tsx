
import { ActivityLog } from '@prisma/client'
import { AlertCircle, CheckCircle, Info } from 'lucide-react'

export function ActivityFeed({ activities }: { activities: ActivityLog[] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="flow-root">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => {
                        const Icon = activity.status === 'success' ? CheckCircle : activity.status === 'warning' ? AlertCircle : Info
                        const color = activity.status === 'success' ? 'text-green-500' : activity.status === 'warning' ? 'text-yellow-500' : 'text-blue-500'

                        return (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                    {activityIdx !== activities.length - 1 ? (
                                        <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white bg-white`}>
                                                <Icon className={`h-5 w-5 ${color}`} aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                            <div>
                                                <p className="text-sm text-gray-500">
                                                    {activity.description}
                                                </p>
                                            </div>
                                            <div className="text-right text-xs whitespace-nowrap text-gray-500">
                                                {new Date(activity.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}
