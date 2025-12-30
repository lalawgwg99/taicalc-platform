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
    const salaryDisplay = salaryNum.toLocaleString();

    // 計算實領（預估：勞保 2.4% + 健保 1.55%）
    const laborRate = 0.024;
    const healthRate = 0.0155;
    const deductions = Math.round(salaryNum * (laborRate + healthRate));
    const takeHome = salaryNum - deductions;

    return {
        title: `月薪 ${salaryDisplay} 實領多少？扣勞健保/勞退後約 ${takeHome.toLocaleString()}（2025 試算）｜TaiCalc`,
        description: `月薪 ${salaryDisplay} 元實領試算：扣除勞保、健保與勞退後約 ${takeHome.toLocaleString()} 元（規則 2025-v1）。可切換投保級距、眷屬與勞退自提 0-6%，並可一鍵分享結果。`,
        keywords: [`月薪${salaryDisplay}實領`, '實領薪水試算', '勞健保扣款計算', '2025勞保費率', '薪資計算器'],
        openGraph: {
            title: `月薪 ${salaryDisplay} 實領試算（2025）｜TaiCalc`,
            description: `扣勞健保/勞退後約 ${takeHome.toLocaleString()} 元，可調整投保級距與勞退自提。`,
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { salary } = await params;
    const salaryNum = parseInt(salary);
    return <SalaryScenarioClient salary={salaryNum} />;
}
