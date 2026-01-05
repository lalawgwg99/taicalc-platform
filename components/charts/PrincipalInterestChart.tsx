'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PrincipalInterestChartProps {
    principal: number;
    interest: number;
}

const COLORS = ['#64748b', '#10b981'];

export default function PrincipalInterestChart({ principal, interest }: PrincipalInterestChartProps) {
    const data = [
        { name: '本金投入', value: principal },
        { name: '複利收益', value: interest }
    ];

    const total = principal + interest;

    return (
        <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => {
                            const percent = ((value / total) * 100).toFixed(1);
                            return `${name} ${percent}%`;
                        }}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: number) => `NT$ ${value.toLocaleString()}`}
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '8px'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
