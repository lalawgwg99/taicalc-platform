'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RepaymentTimelineChartProps {
    data: {
        year: number;
        balance: number;
        paidPrincipal: number;
        paidInterest: number;
    }[];
}

export default function RepaymentTimelineChart({ data }: RepaymentTimelineChartProps) {
    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        label={{ value: '年', position: 'insideBottomRight', offset: -5 }}
                    />
                    <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}萬`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                        labelFormatter={(label) => `第 ${label} 年`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="balance"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        name="剩餘本金"
                        fillOpacity={0.2}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
