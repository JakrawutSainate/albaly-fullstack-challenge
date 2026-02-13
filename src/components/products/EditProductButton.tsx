'use client'

import { useTransition } from 'react'
import { Edit } from 'lucide-react'
import { showFormDialog } from '@/lib/swal'
import { updateProductAction } from '@/lib/actions/product.actions'
import { useToast } from '@/components/ui/toast'
import type { ProductWithStock } from '@/types/api-response'

export function EditProductButton({ product }: { product: ProductWithStock }) {
    const [isPending, startTransition] = useTransition()
    const { addToast } = useToast()

    const handleEdit = async () => {
        const result = await showFormDialog<{ name: string; price: number; category: string; stock: number }>({
            title: 'Edit Product',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Product Name</label>
                        <input 
                            id="swal-input-name" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value="${product.name}"
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Price</label>
                        <input 
                            id="swal-input-price" 
                            type="number" 
                            step="0.01" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value="${product.price}"
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Category</label>
                        <input 
                            id="swal-input-category" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value="${product.category}"
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Stock</label>
                        <input 
                            id="swal-input-stock" 
                            type="number" 
                            min="0" 
                            step="1" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            value="${product.stock || 0}"
                            required
                        />
                    </div>
                </div>
            `,
            preConfirm: () => {
                const name = (document.getElementById('swal-input-name') as HTMLInputElement).value
                const price = parseFloat((document.getElementById('swal-input-price') as HTMLInputElement).value)
                const category = (document.getElementById('swal-input-category') as HTMLInputElement).value
                const stock = parseInt((document.getElementById('swal-input-stock') as HTMLInputElement).value)

                if (!name || !price || !category || stock < 0) {
                    showFormDialog({ title: 'Error', html: 'Please fill all fields correctly', preConfirm: () => ({}) })
                    return { name: '', price: 0, category: '', stock: 0 }
                }

                return { name, price, category, stock }
            },
            confirmButtonText: 'Save Changes',
        })

        if (result.isConfirmed && result.value) {
            startTransition(async () => {
                const response = await updateProductAction(product.id, result.value)
                if (response.success) {
                    addToast('Product updated successfully', 'success')
                } else {
                    addToast(response.error?.message || 'Failed to update product', 'error')
                }
            })
        }
    }

    return (
        <button
            onClick={handleEdit}
            disabled={isPending}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-900 disabled:opacity-50"
        >
            <Edit className="w-4 h-4 mr-1" />
            {isPending ? 'Saving...' : 'Edit'}
        </button>
    )
}
