'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteProductAction } from '@/lib/actions/product.actions'
import { useToast } from '@/components/ui/toast'
import { showConfirmDialog } from '@/lib/swal'

export function DeleteProductButton({ productId, productName }: { productId: string, productName: string }) {
    const [isPending, startTransition] = useTransition()
    const { addToast } = useToast()

    const handleDelete = async () => {
        const result = await showConfirmDialog({
            title: 'Delete Product?',
            html: `Are you sure you want to delete <strong>${productName}</strong>?<br/>This action cannot be undone.`,
            icon: 'warning',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        })

        if (result.isConfirmed) {
            startTransition(async () => {
                const response = await deleteProductAction(productId)
                if (response.success) {
                    addToast(`${productName} deleted successfully`, 'success')
                } else {
                    addToast(response.error?.message || 'Failed to delete product', 'error')
                }
            })
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="inline-flex items-center text-red-600 hover:text-red-900 disabled:opacity-50"
        >
            <Trash2 className="w-4 h-4 mr-1" />
            {isPending ? 'Deleting...' : 'Delete'}
        </button>
    )
}
