
'use client'

import { Bar, BarChart, CartesianGrid, Cell, Funnel, FunnelChart, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function TopProductsChart({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top Products</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Tooltip formatter={(value: number | undefined) => `$${(value || 0).toLocaleString()}`} />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export function RegionalChart({ data }: { data: any[] }) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sales by Region</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="sales"
                            nameKey="region"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value: number | undefined) => `$${(value || 0).toLocaleString()}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export function ConversionFunnelChart({ data }: { data: any }) {
    // Transform funnel object to array for Recharts if needed, or if service returns object
    // Service returns { visitors, productViews, addToCart, purchases }
    // Recharts Funnel needs array

    const funnelData = [
        { name: 'Visitors', value: data?.visitors || 0, fill: '#8884d8' },
        { name: 'Product Views', value: data?.productViews || 0, fill: '#83a6ed' },
        { name: 'Add to Cart', value: data?.addToCart || 0, fill: '#8dd1e1' },
        { name: 'Purchases', value: data?.purchases || 0, fill: '#82ca9d' },
    ]

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Conversion Funnel</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <FunnelChart>
                        <Tooltip />
                        <Funnel
                            dataKey="value"
                            data={funnelData}
                            isAnimationActive
                        >
                        </Funnel>
                    </FunnelChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export function DropOffTable({ data }: { data: any[] }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Drop-off Rates</h3>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop-off</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {data.map((item, idx) => (
                        <tr key={idx}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.step}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">{item.dropOffRate}%</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
