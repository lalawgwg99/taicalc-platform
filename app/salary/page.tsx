import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/seo-optimizer';
import { SalaryCalculator } from './SalaryCalculator';

// 生成頁面 metadata
export const metadata: Metadata = generatePageMetadata('salary');

export default function SalaryCalculatorPage() {
    return <SalaryCalculator />;
}
