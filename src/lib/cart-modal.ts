'use client'

import { useTransition } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { swalConfig } from '@/lib/swal'
import { triggerConfetti } from '@/lib/confetti'
import type { CartItem, CartModalHelpers } from '@/types/api-response'

const MySwal = withReactContent(Swal)


export const showCartModal = async (items: CartItem[], helpers: CartModalHelpers) => {
    if (items.length === 0) {
        return MySwal.fire({
            ...swalConfig,
            title: '<span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">Your Cart is Empty</span>',
            html: '<p class="text-gray-600 text-lg">🛍️ Start adding some amazing products!</p>',
            confirmButtonText: '🚀 Start Shopping',
            customClass: {
                ...swalConfig.customClass,
                popup: 'rounded-2xl shadow-2xl',
                confirmButton: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105',
            }
        })
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    const itemsHtml = items
        .map(
            (item) => `
        <div class="group bg-white rounded-xl p-3 mb-2 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
            <div class="flex items-center gap-3">
                <div class="relative overflow-hidden rounded-lg shadow-md flex-shrink-0">
                    <img 
                        src="${item.imageUrl || 'https://via.placeholder.com/100'}" 
                        alt="${item.name}"
                        class="w-20 h-20 object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div class="absolute -top-1 -right-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg ring-2 ring-white">
                        ${item.quantity}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 text-base mb-1 truncate">${item.name}</h3>
                    <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100">
                        ${item.category}
                    </span>
                    <div class="flex items-center gap-2 text-sm text-gray-600 mt-1.5">
                        <span class="font-medium">Qty: ${item.quantity}</span>
                        <span class="text-gray-400">×</span>
                        <span class="font-medium">$${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="text-right flex-shrink-0">
                    <div class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        $${(item.price * item.quantity).toFixed(2)}
                    </div>
                </div>
            </div>
        </div>
    `
        )
        .join('')

    const result = await MySwal.fire({
        html: `
            <div class="text-center pb-4">
                <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl mb-4 shadow-2xl transform hover:scale-105 transition-transform">
                    <span class="text-5xl">🛒</span>
                </div>
                <h2 class="text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-2">
                    Shopping Cart
                </h2>
                <p class="text-sm text-gray-500 font-medium">${totalItems} item${totalItems > 1 ? 's' : ''} in your cart</p>
            </div>
            
            <div class="max-h-[28rem] overflow-y-auto px-1 py-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
                ${itemsHtml}
            </div>
            
            <div class="mt-4 pt-4 border-t-2 border-gray-200">
                <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-inner border border-indigo-100">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-sm text-gray-700 font-medium">Subtotal:</span>
                        <span class="text-sm text-gray-900 font-bold">$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center mb-3 pb-3 border-b border-indigo-200">
                        <span class="text-sm text-gray-700 font-medium">Shipping:</span>
                        <span class="text-sm text-green-600 font-bold flex items-center gap-1">
                            <span class="text-lg">✓</span> FREE
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-xl font-extrabold text-gray-900">Total:</span>
                        <span class="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                            $${totalPrice.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        `,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: '✨ Buy Now',
        denyButtonText: '🗑️ Clear Cart',
        cancelButtonText: '← Continue Shopping',
        width: '700px',
        padding: '2rem',
        customClass: {
            popup: 'rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50',
            htmlContainer: '!m-0',
            confirmButton: 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3.5 px-8 rounded-xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl',
            denyButton: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3.5 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg ml-2',
            cancelButton: 'bg-white hover:bg-gray-50 text-gray-700 font-bold py-3.5 px-6 rounded-xl transition-all ml-2 border-2 border-gray-200 hover:border-gray-300',
            actions: '!mt-6'
        },
        buttonsStyling: false,
    })

    if (result.isConfirmed) {
        // Buy Now - process all items
        let allSuccess = true
        for (const item of items) {
            const response = await helpers.purchaseAction(item.id, item.quantity)
            if (!response.success) {
                allSuccess = false
                helpers.addToast(response.error?.message || 'Purchase failed', 'error')
                break
            }
        }

        if (allSuccess) {
            helpers.clearCart()
            triggerConfetti()
            helpers.addToast('All items purchased successfully! 🎉', 'success')
        }
    } else if (result.isDenied) {
        // Clear Cart
        helpers.clearCart()
        helpers.addToast('Cart cleared', 'success')
    }
}
