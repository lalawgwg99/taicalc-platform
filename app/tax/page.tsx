import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/seo-optimizer';
import { TaxCalculator } from './TaxCalculator';

// 生成頁面 metadata
export const metadata: Metadata = generatePageMetadata('tax');

export default function TaxCalculatorPage() {
    return <TaxCalculator />;
}
