"use client";

import { ResponsiveContainer, BarChart, Bar, LineChart, Line, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, AreaChart, Area } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { ChartType } from '@/lib/skills/uiTypes';

interface ChartConfig {
    type: ChartType;
    title: string;
    description?: string;
}

interface ResultChartProps {
    config: ChartConfig;
    data: any; // Raw result data containing chartData
}

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#f97316', '#a855f7', '#ec4899'];

export function ResultChart({ config, data }: ResultChartProps) {
    if (!data?.chartData || !Array.isArray(data.chartData)) {
        return null; // No chart data
    }

    const chartData = data.chartData;
    const { title, type } = config;

    const renderChart = () => {
        switch (type) {
            case 'bar_compare':
            case 'stack_tax_breakdown':
                return (
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip
                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{ fill: '#F1F5F9' }}
                        />
                        <Legend />
                        <Bar dataKey="value" name="金額" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                        {/* More dynamic keys support needed later */}
                    </BarChart>
                );
            case 'line_assets':
            case 'line_fire':
            case 'amortization':
                return (
                    <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Legend />
                        <Area type="monotone" dataKey="value" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorValue)" strokeWidth={2} />
                    </AreaChart>
                );
            case 'pie_salary_breakdown':
                return (
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {chartData.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                );
            default:
                return <div className="p-8 text-center text-slate-500">此圖表類型尚未實作 ({type})</div>;
        }
    };

    return (
        <Card className="mb-6 shadow-sm overflow-hidden border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center">
                    <span className="w-1 h-6 bg-brand-primary rounded mr-2" />
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
