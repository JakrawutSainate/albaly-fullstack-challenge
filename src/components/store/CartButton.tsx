'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { showCartModal } from '@/lib/cart-modal'
import { useToast } from '@/components/ui/toast'
import { simulatePurchaseAction } from '@/lib/actions/store.actions'

export function CartButton() {
    const { items, getCartCount, clearCart } = useCart()
    const { addToast } = useToast()
    const count = getCartCount()

    const handleClick = async () => {
        await showCartModal(items, {
            clearCart,
            addToast,
            purchaseAction: async (productId: string, quantity: number) => {
                return await simulatePurchaseAction(productId, quantity)
            }
        })
    }

    return (
        <button
            onClick={handleClick}
            className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors"
            aria-label="Shopping Cart"
        >
            <ShoppingCart className="w-6 h-6" />
            {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {count}
                </span>
            )}
        </button>
    )
}
