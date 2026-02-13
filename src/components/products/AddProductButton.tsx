'use client'

import { useTransition } from 'react'
import { Plus } from 'lucide-react'
import { showFormDialog } from '@/lib/swal'
import { createProductAction } from '@/lib/actions/product.actions'
import { useToast } from '@/components/ui/toast'

export function AddProductButton() {
    const [isPending, startTransition] = useTransition()
    const { addToast } = useToast()

    const handleCreate = async () => {
        const result = await showFormDialog<{ name: string; price: number; category: string; stock: number }>({
            title: 'Create New Product',
            html: `
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Product Name</label>
                        <input 
                            id="swal-input-name" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            placeholder="Enter product name"
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
                            placeholder="0.00"
                            required
                        />
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Category</label>
                        <select 
                            id="swal-input-category" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="Furniture">Furniture</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Accessories">Accessories</option>
                            <option value="Lighting">Lighting</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1 text-left">Stock</label>
                        <input 
                            id="swal-input-stock" 
                            type="number" 
                            min="0" 
                            step="1" 
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                            placeholder="0"
                            value="0"
                            required
                        />
                    </div>
                </div>
            `,
            preConfirm: () => {
                const name = (document.getElementById('swal-input-name') as HTMLInputElement).value
                const price = parseFloat((document.getElementById('swal-input-price') as HTMLInputElement).value)
                const category = (document.getElementById('swal-input-category') as HTMLSelectElement).value
                const stock = parseInt((document.getElementById('swal-input-stock') as HTMLInputElement).value)

                if (!name || !price || !category || stock < 0) {
                    showFormDialog({ title: 'Error', html: 'Please fill all fields correctly', preConfirm: () => ({}) })
                    return { name: '', price: 0, category: '', stock: 0 }
                }

                return { name, price, category, stock }
            },
            confirmButtonText: 'Create',
        })

        if (result.isConfirmed && result.value && result.value.name) {
            startTransition(async () => {
                const formData = new FormData()
                formData.append('name', result.value.name)
                formData.append('price', result.value.price.toString())
                formData.append('category', result.value.category)
                formData.append('stock', result.value.stock.toString())

                const response = await createProductAction(formData)
                if (response.success) {
                    addToast('Product created successfully!', 'success')
                } else {
                    addToast(response.error?.message || 'Failed to create product', 'error')
                }
            })
        }
    }

    return (
        <button
            onClick={handleCreate}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 flex items-center"
        >
            <Plus className="w-4 h-4 mr-2" />
            {isPending ? 'Creating...' : 'Add Product'}
        </button>
    )
}
