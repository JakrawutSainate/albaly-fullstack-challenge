import { ActivityLogDTO } from "@/types/api-response";
import { ShoppingCart, UserPlus, FileText, Activity } from "lucide-react";

export function ActivityFeed({ activities }: { activities: ActivityLogDTO[] }) {
    const getIcon = (action: string) => {
        switch (action) {
            case 'PURCHASE': return ShoppingCart;
            case 'NEW_CUSTOMER': return UserPlus;
            case 'VIEW_REPORT': return FileText;
            default: return Activity;
        }
    };

    const getRelativeTime = (isoString: string) => {
        const date = new Date(isoString);
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        return `${Math.floor(diffInHours / 24)} days ago`;
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold leading-6 text-slate-900">Recent Activity</h3>
            </div>
            <div className="flow-root p-6">
                <ul role="list" className="-mb-8">
                    {activities.map((activity, activityIdx) => {
                        const Icon = getIcon(activity.action);
                        return (
                            <li key={activity.id}>
                                <div className="relative pb-8">
                                    {activityIdx !== activities.length - 1 ? (
                                        <span className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-slate-200" aria-hidden="true" />
                                    ) : null}
                                    <div className="relative flex space-x-3">
                                        <div>
                                            <span className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center ring-8 ring-white">
                                                <Icon className="h-5 w-5 text-slate-500" aria-hidden="true" />
                                            </span>
                                        </div>
                                        <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                            <div>
                                                <p className="text-sm text-slate-500">
                                                    {activity.details || formatAction(activity.action)}
                                                </p>
                                            </div>
                                            <div className="whitespace-nowrap text-right text-sm text-slate-500">
                                                <time dateTime={activity.timestamp}>{getRelativeTime(activity.timestamp)}</time>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

function formatAction(action: string) {
    return action.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' ');
}
