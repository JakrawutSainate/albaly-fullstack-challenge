export function ProductComparison({ products }: { products: any[] }) {
    const maxValue = Math.max(...products.map((p: any) => p.sales));

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm h-full flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4">
                <h3 className="text-base font-semibold leading-6 text-slate-900">Top Products</h3>
            </div>
            <div className="p-6 flex flex-col justify-center gap-6 flex-1">
                {products.map((product: any) => (
                    <div key={product.name}>
                        <div className="flex justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">{product.name}</span>
                            <span className="text-sm font-medium text-slate-500">{product.sales} Sales</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-4">
                            <div
                                className={`${product.color || 'bg-blue-500'} h-4 rounded-full transition-all`}
                                style={{ width: `${(product.sales / maxValue) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
