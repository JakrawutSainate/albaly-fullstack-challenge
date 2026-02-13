import { Suspense } from 'react'
import { getSession } from '@/lib/auth'
import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'
import { Package, Edit, Trash2 } from 'lucide-react'
import { EditProductButton } from '@/components/products/EditProductButton'
import { DeleteProductButton } from '@/components/products/DeleteProductButton'


async function ProductsTable() {
    const products = await prisma.product.findMany({
        include: {
            inventorySnapshots: {
                orderBy: { createdAt: 'desc' },
                take: 1
            },
            sales: true
        },
        orderBy: { name: 'asc' }
    })

    const productsWithStats = products.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        category: p.category,
        stock: p.inventorySnapshots[0]?.onHand || 0,
        soldCount: p.sales.reduce((sum, sale) => sum + sale.quantity, 0)
    }))

    return (
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sold</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {productsWithStats.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Package className="w-5 h-5 text-gray-400 mr-3" />
                                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {product.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                ${product.price}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock > 10 ? 'bg-green-100 text-green-800' :
                                    product.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                    {product.stock} units
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {product.soldCount} sold
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <EditProductButton product={product} />
                                <DeleteProductButton productId={product.id} productName={product.name} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default async function ProductsPage() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        <div className="p-8 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-gray-500">Manage your inventory, track sales, and update product details.</p>
                </div>
            </div>

            <Suspense fallback={<div className="text-center py-20">Loading products...</div>}>
                <ProductsTable />
            </Suspense>
        </div>
    )
}
