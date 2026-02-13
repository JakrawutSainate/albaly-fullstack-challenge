import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ShopNavbar } from '@/components/layout/ShopNavbar'
import { ToastProvider } from '@/components/ui/toast'
import { CartProvider } from '@/contexts/CartContext'

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    if (!session) {
        redirect('/login')
    }

    // Optional: Redirect Admin back to dashboard if they shouldn't be here
    // but usually admins can see the store. 
    // For STRICT separation requested by user:
    if (session.role === 'ADMIN') {
        redirect('/overview')
    }

    return (
        <CartProvider>
            <div className="min-h-screen bg-gray-50">
                <ShopNavbar email={session.email} />
                <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <ToastProvider>
                        {children}
                    </ToastProvider>
                </main>
            </div>
        </CartProvider>
    )
}
