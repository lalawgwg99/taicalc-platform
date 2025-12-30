import { Metadata } from 'next';
import MortgageScenarioClient from './client';

// 常見房貸金額
const LOAN_AMOUNTS = [
    { amount: 5000000, label: '500萬' },
    { amount: 8000000, label: '800萬' },
    { amount: 10000000, label: '1000萬' },
    { amount: 12000000, label: '1200萬' },
    { amount: 15000000, label: '1500萬' },
    { amount: 20000000, label: '2000萬' },
];

interface PageProps {
    params: Promise<{ amount: string }>;
}

export async function generateStaticParams() {
    return LOAN_AMOUNTS.map(loan => ({
        amount: loan.amount.toString()
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { amount } = await params;
    const loanAmount = parseInt(amount);
    const loanLabel = loanAmount >= 10000000
        ? `${loanAmount / 10000000}千萬`
        : `${loanAmount / 10000}萬`;

    // 預設計算 (30年、2%)
    const years = 30;
    const rate = 2.0;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;
    const monthlyPayment = Math.round(
        loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)
        / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );

    return {
        title: `房貸 ${loanLabel} 月付多少？30年2%利率約 ${monthlyPayment.toLocaleString()} 元｜TaiCalc`,
        description: `房貸 ${loanLabel}、30年期、2% 利率，每月還款約 ${monthlyPayment.toLocaleString()} 元。含新青安比較、寬限期影響試算。`,
        keywords: [`房貸${loanLabel}月付`, `${loanLabel}房貸`, '房貸月付試算', '房貸計算器'],
        openGraph: {
            title: `房貸 ${loanLabel} 月付試算｜TaiCalc`,
            description: `房貸 ${loanLabel} 每月還款約 ${monthlyPayment.toLocaleString()} 元`,
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { amount } = await params;
    const loanAmount = parseInt(amount);
    return <MortgageScenarioClient loanAmount={loanAmount} />;
}
