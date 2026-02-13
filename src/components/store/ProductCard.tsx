'use client'

import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/components/ui/toast'
import type { ProductWithStock } from '@/types/api-response'

export function ProductCard({ product }: { product: ProductWithStock }) {
    const { addToCart } = useCart()
    const { addToast } = useToast()

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            category: product.category,
            imageUrl: product.imageUrl,
        })
        addToast(`${product.name} added to cart!`, 'success')
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="h-40 bg-gray-50 rounded-lg mb-6 overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-12 h-12 text-gray-300" />
                    </div>
                )}
            </div>

            <div className="flex-1">
                <div className="text-sm font-medium text-indigo-600 mb-1">{product.category}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-700' :
                        product.stock > 0 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>
                </div>
            </div>

            <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
            >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
            </button>
        </div>
    )
}
