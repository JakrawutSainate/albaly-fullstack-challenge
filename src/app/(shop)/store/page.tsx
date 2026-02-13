import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { ProductCard } from '@/components/store/ProductCard'
import { ShoppingBag } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function StoreContent({ session }: { session: any }) {
    const products = await prisma.product.findMany({
        include: {
            inventorySnapshots: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        },
        orderBy: { name: 'asc' }
    })

    const formattedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.inventorySnapshots[0]?.onHand || 0,
        imageUrl: p.imageUrl,
    }))

    if (formattedProducts.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No products available</h3>
                <p className="text-gray-500">Check back later for new arrivals.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formattedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    )
}

export default async function StorePage() {
    const session = await getSession()

    return (
        <div className="space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
                    Welcome to Albaly Store
                </h1>
                <p className="max-w-2xl mx-auto text-xl text-gray-500">
                    Discover premium office essentials designed for productivity and style.
                </p>
            </div>

            <Suspense fallback={<div className="text-center py-20">Loading amazing products...</div>}>
                <StoreContent session={session} />
            </Suspense>
        </div>
    )
}
