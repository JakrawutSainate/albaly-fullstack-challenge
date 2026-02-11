'use client';

import { usePathname } from 'next/navigation';
import { Bell, User } from 'lucide-react';

export function TopNav() {
    const pathname = usePathname();

    // Simple breadcrumb logic
    const pathSegments = pathname.split('/').filter(Boolean);
    const breadcrumb = pathSegments.length > 0
        ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
        : 'Dashboard';

    return (
        <header className="fixed left-64 top-0 right-0 z-10 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
            <div className="flex items-center text-sm font-medium text-slate-500">
                <span>Albaly Insights</span>
                <span className="mx-2">/</span>
                <span className="text-slate-900">{breadcrumb}</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative rounded-full p-2 text-slate-500 hover:bg-slate-100 transition-colors">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                </button>

                <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center border border-slate-300">
                    <User className="h-5 w-5 text-slate-500" />
                </div>
            </div>
        </header>
    );
}
