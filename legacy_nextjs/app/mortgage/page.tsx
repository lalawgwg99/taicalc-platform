import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/seo-optimizer';
import { MortgageCalculator } from './MortgageCalculator';

// 生成頁面 metadata
export const metadata: Metadata = generatePageMetadata('mortgage');

export default function MortgageCalculatorPage() {
    return <MortgageCalculator />;
}
