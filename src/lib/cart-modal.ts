'use client'

import { useTransition } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { swalConfig } from '@/lib/swal'
import { triggerConfetti } from '@/lib/confetti'
import type { CartItem, CartModalHelpers } from '@/types/api-response'

const MySwal = withReactContent(Swal)

export const showCartModal = async (items: CartItem[], helpers: CartModalHelpers) => {
    // กรณีตะกร้าว่าง ปรับให้ Responsive เช่นกัน
    if (items.length === 0) {
        return MySwal.fire({
            ...swalConfig,
            title: '<span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800;">Your Cart is Empty</span>',
            html: '<p class="text-gray-600 text-base xl:text-lg">🛍️ Start adding some amazing products!</p>',
            confirmButtonText: '🚀 Start Shopping',
            width: 'min(90%, 400px)',
            customClass: {
                ...swalConfig.customClass,
                popup: 'rounded-2xl xl:rounded-3xl shadow-2xl p-4 xl:p-8',
                confirmButton: 'w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105',
            }
        })
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

    const itemsHtml = items
        .map(
            (item) => `
        <div class="group bg-white rounded-xl p-2.5 xl:p-3 mb-2 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-200">
            <div class="flex items-center gap-2 xl:gap-3">
                <div class="relative overflow-hidden rounded-lg shadow-md flex-shrink-0">
                    <img 
                        src="${item.imageUrl || 'https://via.placeholder.com/100'}" 
                        alt="${item.name}"
                        class="w-16 h-16 xl:w-20 xl:h-20 object-cover transform group-hover:scale-110 transition-transform duration-300"
                    />
                    <div class="absolute -top-1 -right-1 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[10px] xl:text-xs font-bold rounded-full w-5 h-5 xl:w-6 xl:h-6 flex items-center justify-center shadow-lg ring-2 ring-white">
                        ${item.quantity}
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 text-sm xl:text-base mb-0.5 xl:mb-1 truncate">${item.name}</h3>
                    <span class="inline-flex items-center px-2 xl:px-2.5 py-0.5 xl:py-1 rounded-full text-[10px] xl:text-xs font-semibold bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-100">
                        ${item.category}
                    </span>
                    <div class="flex items-center gap-1.5 xl:gap-2 text-xs xl:text-sm text-gray-600 mt-1 xl:mt-1.5">
                        <span class="font-medium">Qty: ${item.quantity}</span>
                        <span class="text-gray-400">×</span>
                        <span class="font-medium">$${item.price.toFixed(2)}</span>
                    </div>
                </div>
                <div class="text-right flex-shrink-0 pl-2">
                    <div class="text-lg xl:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
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
            <div class="text-center pb-3 xl:pb-4">
                <div class="inline-flex items-center justify-center w-16 h-16 xl:w-20 xl:h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl xl:rounded-2xl mb-3 xl:mb-4 shadow-xl xl:shadow-2xl transform hover:scale-105 transition-transform">
                    <span class="text-4xl xl:text-5xl">🛒</span>
                </div>
                <h2 class="text-2xl xl:text-3xl font-extrabold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-1 xl:mb-2">
                    Shopping Cart
                </h2>
                <p class="text-xs xl:text-sm text-gray-500 font-medium">${totalItems} item${totalItems > 1 ? 's' : ''} in your cart</p>
            </div>
            
            <div class="max-h-[20rem] xl:max-h-[28rem] overflow-y-auto px-1 py-2 scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-gray-100">
                ${itemsHtml}
            </div>
            
            <div class="mt-3 xl:mt-4 pt-3 xl:pt-4 border-t-2 border-gray-200">
                <div class="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl xl:rounded-2xl p-4 xl:p-5 shadow-inner border border-indigo-100">
                    <div class="flex justify-between items-center mb-2">
                        <span class="text-xs xl:text-sm text-gray-700 font-medium">Subtotal:</span>
                        <span class="text-xs xl:text-sm text-gray-900 font-bold">$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between items-center mb-2 xl:mb-3 pb-2 xl:pb-3 border-b border-indigo-200">
                        <span class="text-xs xl:text-sm text-gray-700 font-medium">Shipping:</span>
                        <span class="text-xs xl:text-sm text-green-600 font-bold flex items-center gap-1">
                            <span class="text-base xl:text-lg">✓</span> FREE
                        </span>
                    </div>
                    <div class="flex justify-between items-center">
                        <span class="text-lg xl:text-xl font-extrabold text-gray-900">Total:</span>
                        <span class="text-2xl xl:text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
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
        width: 'min(95%, 700px)', // ปรับให้ยืดหยุ่นบนมือถือ
        padding: window.innerWidth < 1280 ? '1.5rem' : '2rem', // Responsive Padding
        customClass: {
            popup: 'rounded-2xl xl:rounded-3xl shadow-2xl border-0 bg-gradient-to-br from-white to-gray-50',
            htmlContainer: '!m-0',
            // จัดเรียงปุ่ม: มือถือเรียงแนวตั้งจอใหญ่เรียงแนวนอน
            actions: 'flex flex-col xl:flex-row w-full gap-2 xl:gap-3 !mt-4 xl:!mt-6',
            confirmButton: 'w-full xl:w-auto order-1 xl:order-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 text-white font-bold py-3 xl:py-3.5 px-6 xl:px-8 rounded-xl transition-all transform hover:scale-105 shadow-lg xl:shadow-xl !m-0',
            denyButton: 'w-full xl:w-auto order-2 xl:order-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 xl:py-3.5 px-6 rounded-xl transition-all transform hover:scale-105 shadow-md xl:shadow-lg !m-0',
            cancelButton: 'w-full xl:w-auto order-3 xl:order-1 bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 xl:py-3.5 px-6 rounded-xl transition-all border-2 border-gray-200 hover:border-gray-300 !m-0'
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