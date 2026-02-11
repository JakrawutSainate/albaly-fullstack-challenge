'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        {
            name: 'Overview',
            href: '/overview',
            icon: LayoutDashboard,
        },
        {
            name: 'Insights',
            href: '/insights',
            icon: LineChart,
        },
    ];

    return (
        <div className="flex h-screen w-64 flex-col bg-slate-900 text-white fixed left-0 top-0">
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <h1 className="text-xl font-bold tracking-tight">Albaly Insights</h1>
            </div>

            <div className="flex-1 flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                            pathname === item.href
                                ? 'bg-indigo-600/20 text-indigo-400'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                        )}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.name}
                    </Link>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800">
                <button
                    onClick={() => {
                        // In real app, call logout action
                        window.location.href = '/login'
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-red-400"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
}
