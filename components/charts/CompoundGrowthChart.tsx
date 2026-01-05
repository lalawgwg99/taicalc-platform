'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GrowthData {
    year: number;
    principal: number;
    interest: number;
    total: number;
}

interface CompoundGrowthChartProps {
    data: GrowthData[];
}

export default function CompoundGrowthChart({ data }: CompoundGrowthChartProps) {
    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                        dataKey="year"
                        label={{ value: '年份', position: 'insideBottom', offset: -5 }}
                        tick={{ fill: '#64748b' }}
                    />
                    <YAxis
                        label={{ value: '金額 (NT$)', angle: -90, position: 'insideLeft' }}
                        tick={{ fill: '#64748b' }}
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}萬`}
                    />
                    <Tooltip
                        formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        formatter={(value) => {
                            const labels: Record<string, string> = {
                                total: '總資產',
                                principal: '累積本金',
                                interest: '累積利息'
                            };
                            return labels[value] || value;
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="total"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="principal"
                        stroke="#64748b"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ fill: '#64748b', r: 3 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="interest"
                        stroke="#10b981"
                        strokeWidth={2}
                        dot={{ fill: '#10b981', r: 3 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
