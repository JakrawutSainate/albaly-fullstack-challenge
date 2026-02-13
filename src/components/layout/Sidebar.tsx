'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, LineChart, LogOut, Package, Menu, X } from 'lucide-react'
import { logout } from '@/app/actions'
import { startTransition, useState, useEffect } from 'react'
import type { SidebarProps } from '@/types/api-response'

const navigation = [
    { name: 'Overview', href: '/overview', icon: LayoutDashboard },
    { name: 'Insights', href: '/insights', icon: LineChart },
    { name: 'Products', href: '/products', icon: Package },
]

export default function Sidebar({ userEmail, userRole }: SidebarProps) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // ปิด Sidebar อัตโนมัติเวลาเปลี่ยนหน้า (สำหรับมือถือ)
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <>
            {/* Mobile Menu Button - แสดงเฉพาะมือถือ ติดอยู่มุมซ้ายบน */}
            <button
                onClick={() => setIsOpen(true)}
                className="md:hidden fixed top-3 left-4 z-40 p-2 rounded-lg bg-white text-gray-900 shadow-md border border-gray-100 hover:bg-gray-50 transition-colors"
            >
                <Menu className="h-5 w-5" />
            </button>

            {/* Overlay สีดำจางๆ เวลาเปิดเมนูบนมือถือ */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out flex flex-col
                md:relative md:translate-x-0 
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex items-center justify-between h-16 border-b border-gray-800 px-6 md:justify-center">
                    <span className="text-xl font-bold text-white tracking-wider">ALBALY</span>
                    {/* ปุ่ม X ปิดเมนูบนมือถือ */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden text-gray-400 hover:text-white p-1"
                    >
                        <X className="h-6 w-6" />
                    </button>
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
        </>
    )
}