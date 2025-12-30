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

    // 格式化金額顯示
    const loanLabel = loanAmount >= 10000000
        ? `${(loanAmount / 10000000).toFixed(0).replace(/\.0$/, '')}千萬`
        : `${loanAmount / 10000}萬`;
    const loanDisplay = loanAmount >= 10000000
        ? `${(loanAmount / 10000000).toFixed(0).replace(/\.0$/, '')},000 萬`
        : `${(loanAmount / 10000).toLocaleString()} 萬`;

    // 預設計算 (30年、2% 本息均攤)
    const years = 30;
    const rate = 2.0;
    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;
    const monthlyPayment = Math.round(
        loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)
        / (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );

    return {
        title: `房貸 ${loanDisplay} 月付多少？30 年 2% 本息均攤約 ${monthlyPayment.toLocaleString()}｜TaiCalc`,
        description: `房貸 ${loanDisplay} 月付約 ${monthlyPayment.toLocaleString()}（30 年 2% 本息均攤）。含總利息與攤還表，可比較新青安 1.775% 省多少、寬限期影響，並一鍵分享結果。`,
        keywords: [`房貸${loanDisplay}月付`, '房貸本息均攤', '新青安房貸比較', '房貸月付試算', '房貸計算器'],
        openGraph: {
            title: `房貸 ${loanDisplay} 月付試算（本息均攤）｜TaiCalc`,
            description: `30 年 2% 月付約 ${monthlyPayment.toLocaleString()} 元，可比較新青安與寬限期。`,
        },
        alternates: {
            canonical: `https://taicalc.com/mortgage/scenarios/${amount}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { amount } = await params;
    const loanAmount = parseInt(amount);
    return <MortgageScenarioClient loanAmount={loanAmount} />;
}
