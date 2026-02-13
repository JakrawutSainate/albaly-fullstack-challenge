'use client'

import Link from 'next/link'
import { User } from 'lucide-react'
import { startTransition } from 'react'
import { logout } from '@/app/actions'
import { CartButton } from '@/components/store/CartButton'

export function ShopNavbar({ email }: { email: string }) {
    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/store" className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                                ALBALY STORE
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <User className="w-5 h-5" />
                            <span className="text-sm font-medium">{email}</span>
                        </div>
                        <button
                            onClick={() => startTransition(() => logout())}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Sign Out
                        </button>
                        <CartButton />
                    </div>
                </div>
            </div>
        </nav>
    )
}
