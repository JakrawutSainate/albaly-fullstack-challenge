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
        <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
            {/* เพิ่ม overflow-x-auto ตรงนี้เพื่อให้ตารางเลื่อนซ้ายขวาได้บนมือถือ */}
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Product</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Category</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Price</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Stock</th>
                            <th className="px-4 md:px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Sold</th>
                            <th className="px-4 md:px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {productsWithStats.map(product => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                            <Package className="w-5 h-5 text-gray-500" />
                                        </div>
                                        <div className="text-sm font-bold text-gray-900">{product.name}</div>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${product.price.toFixed(2)}
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-md border ${product.stock > 10 ? 'bg-green-50 text-green-700 border-green-100' :
                                            product.stock > 0 ? 'bg-yellow-50 text-yellow-700 border-yellow-100' :
                                                'bg-red-50 text-red-700 border-red-100'
                                        }`}>
                                        {product.stock} units
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {product.soldCount} sold
                                </td>
                                <td className="px-4 md:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    {/* จัดปุ่มให้เว้นระยะห่างกันพอดีและไม่โดนบีบ */}
                                    <div className="flex items-center justify-end gap-2">
                                        <EditProductButton product={product} />
                                        <DeleteProductButton productId={product.id} productName={product.name} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default async function ProductsPage() {
    const session = await getSession()
    if (!session || session.role !== 'ADMIN') {
        redirect('/login')
    }

    return (
        // ปรับ Padding รอบนอกให้พอดีบนมือถือ (p-4) และจอใหญ่ (md:p-8)
        <div className="p-4 md:p-8 space-y-4 md:space-y-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-gray-900">Product Management</h1>
                    <p className="text-sm md:text-base text-gray-500 mt-1">Manage your inventory, track sales, and update product details.</p>
                </div>
                {/* ถ้าในอนาคตมีปุ่ม Add Product สามารถใส่ตรงนี้ได้เลย (เหมือนหน้า Overview) */}
            </div>

            <Suspense fallback={
                <div className="text-center py-20 flex flex-col items-center justify-center text-gray-500">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
                    Loading products...
                </div>
            }>
                <ProductsTable />
            </Suspense>
        </div>
    )
}