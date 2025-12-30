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
    const salaryK = salaryNum >= 1000 ? `${salaryNum / 1000}K` : salaryNum;

    // 計算實領（預估）
    const laborRate = 0.024;
    const healthRate = 0.0155;
    const deductions = Math.round(salaryNum * (laborRate + healthRate));
    const takeHome = salaryNum - deductions;

    return {
        title: `月薪 ${salaryNum.toLocaleString()} 實領多少？扣勞健保後約 ${takeHome.toLocaleString()} 元｜TaiCalc`,
        description: `月薪 ${salaryNum.toLocaleString()} 元，扣除勞保、健保後實領約 ${takeHome.toLocaleString()} 元。台灣 2024/2025 勞健保費率計算，含勞退自提 6% 試算。`,
        keywords: [`月薪${salaryK}實領`, `薪水${salaryNum}實領`, '月薪實領計算', '薪資試算', '勞健保扣款'],
        openGraph: {
            title: `月薪 ${salaryNum.toLocaleString()} 實領試算｜TaiCalc`,
            description: `月薪 ${salaryNum.toLocaleString()} 元扣勞健保後實領約 ${takeHome.toLocaleString()} 元。`,
        }
    };
}

export default async function Page({ params }: PageProps) {
    const { salary } = await params;
    const salaryNum = parseInt(salary);
    return <SalaryScenarioClient salary={salaryNum} />;
}
