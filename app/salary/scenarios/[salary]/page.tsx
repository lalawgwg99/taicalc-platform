import { Metadata } from 'next';
import SalaryScenarioClient from './client';

// 常見薪資級距
const SALARY_LEVELS = [
    { salary: 35000, label: '35K', segment: '新鮮人' },
    { salary: 40000, label: '40K', segment: '初階' },
    { salary: 45000, label: '45K', segment: '初階' },
    { salary: 50000, label: '50K', segment: '中階' },
    { salary: 55000, label: '55K', segment: '中階' },
    { salary: 60000, label: '60K', segment: '中階' },
    { salary: 70000, label: '70K', segment: '資深' },
    { salary: 80000, label: '80K', segment: '資深' },
    { salary: 100000, label: '100K', segment: '高階' },
    { salary: 120000, label: '120K', segment: '高階' },
];

interface PageProps {
    params: Promise<{ salary: string }>;
}

export async function generateStaticParams() {
    return SALARY_LEVELS.map(level => ({
        salary: level.salary.toString()
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { salary } = await params;
    const salaryNum = parseInt(salary);

    // 口語化顯示（5萬 vs 50,000）
    const salaryLabel = salaryNum >= 10000
        ? `${salaryNum / 10000} 萬`
        : salaryNum.toLocaleString();
    const salaryDisplay = salaryNum.toLocaleString();

    // 計算實領（預設本人、自提 0%）
    const laborRate = 0.024;
    const healthRate = 0.0155;
    const deductions = Math.round(salaryNum * (laborRate + healthRate));
    const takeHome = salaryNum - deductions;

    return {
        title: `月薪 ${salaryLabel} 實領多少？扣完勞健保實拿 ${takeHome.toLocaleString()}（2025 最新）｜TaiCalc`,
        description: `月薪 ${salaryDisplay} 元實領試算（僅扣勞保/健保/勞退，未含所得稅）：約 ${takeHome.toLocaleString()} 元（預設本人、自提 0%；規則 2025-v1）。立即調整眷屬與自提比例，一鍵分享結果。`,
        keywords: [`月薪${salaryLabel}實領`, '實領薪水試算', '勞健保扣款計算', '2025勞保費率', '薪資計算器'],
        openGraph: {
            title: `月薪 ${salaryLabel} 實領試算（2025）｜TaiCalc`,
            description: `扣完勞健保實拿 ${takeHome.toLocaleString()} 元（預設本人、自提 0%）`,
        },
        alternates: {
            canonical: `https://taicalc.com/salary/scenarios/${salary}`
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { salary } = await params;
    const salaryNum = parseInt(salary);
    return <SalaryScenarioClient salary={salaryNum} />;
}
