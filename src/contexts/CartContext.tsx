'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Product, CartItem, CartContextType } from '@/types/api-response'

const CartContext = createContext<CartContextType | undefined>(undefined)


export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

    const addToCart = (product: Product) => {
        setItems((prev) => {
            const existingItem = prev.find((item) => item.id === product.id)
            if (existingItem) {
                // Increase quantity
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            }
            // Add new item
            return [...prev, { ...product, quantity: 1 }]
        })
    }

    const removeFromCart = (productId: string) => {
        setItems((prev) => prev.filter((item) => item.id !== productId))
    }

    const clearCart = () => {
        setItems([])
    }

    const getCartCount = () => {
        return items.reduce((total, item) => total + item.quantity, 0)
    }

    const getTotalPrice = () => {
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
    }

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                clearCart,
                getCartCount,
                getTotalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}
