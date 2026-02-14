import { ActivityLog } from '@prisma/client'

interface ActivityFeedProps {
    activities: ActivityLog[]
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Recent Activity</h3>
            </div>
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                {activities.map((activity) => (
                    <li key={activity.id} className="p-4">
                        <div className="flex space-x-3">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                    {/* เปลี่ยนจาก action เป็น status ตาม Prisma Schema ปัจจุบัน */}
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                        {activity.status}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {new Date(activity.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                {/* เปลี่ยนจาก details/user เป็น description */}
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {activity.description}
                                </p>
                            </div>
                        </div>
                    </li>
                ))}
                {activities.length === 0 && (
                    <li className="p-4 text-center text-gray-500">No recent activity</li>
                )}
            </ul>
        </div>
    )
}