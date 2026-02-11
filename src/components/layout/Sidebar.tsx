
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LineChart, LogOut, Package } from 'lucide-react'
import { logout } from '@/app/actions'
import { startTransition } from 'react'

const navigation = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Insights', href: '/insights', icon: LineChart },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <div className="flex flex-col w-64 bg-gray-900 border-r border-gray-800">
            <div className="flex items-center justify-center h-16 border-b border-gray-800">
                <span className="text-xl font-bold text-white tracking-wider">ALBALY</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname.startsWith(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${isActive
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    }`}
                            >
                                <item.icon className="mr-3 h-5 w-5" aria-hidden="true" />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={() => startTransition(() => logout())}
                        className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-400 rounded-lg hover:bg-gray-800 hover:text-white transition-colors duration-150"
                    >
                        <LogOut className="mr-3 h-5 w-5" aria-hidden="true" />
                        Sign Out
                    </button>
                </div>
            </div>
        </div>
    )
}
