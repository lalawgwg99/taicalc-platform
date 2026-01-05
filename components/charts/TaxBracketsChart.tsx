'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';

interface TaxBracketsChartProps {
    brackets: {
        rate: number;
        threshold: number;
        amount: number;
        isActive: boolean;
    }[];
}

export default function TaxBracketsChart({ brackets }: TaxBracketsChartProps) {
    const data = brackets.map((b, i) => ({
        name: `${(b.rate * 100)}%`,
        rateLabel: `${(b.rate * 100)}% 稅率`,
        amount: b.amount,
        fullRange: i < brackets.length - 1
            ? (b.threshold - (i === 0 ? 0 : brackets[i - 1].threshold))
            : (b.amount * 1.5 || 1000000), // 最後一級如果沒用到，給個預設高度
        isActive: b.isActive
    })).filter(d => d.name !== '40%'); // 簡化顯示，避免無限大的最後一級導致圖表比例失衡，除非真的有用到

    // 如果有點擊最後一級，加回來
    if (brackets[brackets.length - 1].isActive) {
        const last = brackets[brackets.length - 1];
        data.push({
            name: '40%',
            rateLabel: '40% 稅率',
            amount: last.amount,
            fullRange: last.amount || 500000,
            isActive: true
        });
    }

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#64748b' }} />
                    <YAxis
                        tickFormatter={(value) => `${(value / 10000).toFixed(0)}萬`}
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                        labelFormatter={(label) => `${label} 級距`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px'
                        }}
                    />
                    <Bar dataKey="amount" name="應稅金額" radius={[4, 4, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={entry.isActive ? (entry.amount > 0 ? '#3b82f6' : '#94a3b8') : '#e2e8f0'}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
