
'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface SimpleFunnelProps {
    data: { name: string, value: number }[]
}

export default function SimpleFunnelChart({ data }: SimpleFunnelProps) {
    return (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">Overall Conversion Funnel</h3>
            <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} stroke="#9CA3AF" />
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                        />
                        <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={40} label={{ position: 'right', fill: '#9CA3AF' }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}
