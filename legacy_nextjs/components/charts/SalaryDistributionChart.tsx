'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SalaryDistributionChartProps {
    netSalary: number;
    laborInsurance: number;
    healthInsurance: number;
    laborPension: number;
}

const COLORS = ['#10b981', '#ef4444', '#f97316', '#8b5cf6'];

export default function SalaryDistributionChart({
    netSalary,
    laborInsurance,
    healthInsurance,
    laborPension
}: SalaryDistributionChartProps) {
    const data = [
        { name: '實領薪資', value: netSalary },
        { name: '勞保', value: laborInsurance },
        { name: '健保', value: healthInsurance },
        { name: '勞退', value: laborPension },
    ];

    return (
        <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#999', strokeWidth: 1 }}
                    >
                        {data.map((_, index) => (
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
