export interface SalaryInput {
    monthlySalary: number;
    bonusMonths?: number;
    year?: number; // 用於歷史比較
}

export interface SalaryResult {
    monthly: {
        gross: number;
        laborInsurance: number;
        healthInsurance: number;
        laborPension: number; // 勞退
        net: number;
    };
    yearly: {
        gross: number;
        totalLaborInsurance: number;
        totalHealthInsurance: number;
        totalLaborPension: number;
        net: number;
    };
    metadata: {
        year: number;
        laborInsuranceRate: number;
        healthInsuranceRate: number;
        laborPensionRate: number;
        dataSource: string;
        lastUpdated: string;
    };
}

export interface HistoricalComparison {
    currentYear: SalaryResult;
    previousYear?: SalaryResult;
    yearOverYearChange?: {
        netIncome: number;
        laborInsurance: number;
        healthInsurance: number;
        laborPension: number;
    };
}

export interface TrendAnalysis {
    salaryGrowth: number; // 年增長率
    inflationImpact: number; // 通膨影響
    realIncomeChange: number; // 實質收入變化
    recommendations: string[];
}

// 2025 年最新費率資料
const SALARY_RATES = {
    2025: {
        laborInsurance: {
            rate: 0.115, // 11.5%
            employeeShare: 0.2, // 員工負擔 20%
            maxSalary: 45800, // 投保薪資上限
            minSalary: 27470 // 投保薪資下限
        },
        healthInsurance: {
            rate: 0.0517, // 5.17%
            employeeShare: 0.3, // 員工負擔 30%
            maxSalary: 182000, // 投保薪資上限
            minSalary: 27470 // 投保薪資下限
        },
        laborPension: {
            rate: 0.06, // 6%
            employeeShare: 1.0, // 員工可選擇自提
            maxSalary: 150000, // 月提繳工資上限
            minSalary: 27470 // 月提繳工資下限
        }
    },
    2024: {
        laborInsurance: {
            rate: 0.115,
            employeeShare: 0.2,
            maxSalary: 45800,
            minSalary: 26400
        },
        healthInsurance: {
            rate: 0.0517,
            employeeShare: 0.3,
            maxSalary: 182000,
            minSalary: 26400
        },
        laborPension: {
            rate: 0.06,
            employeeShare: 1.0,
            maxSalary: 150000,
            minSalary: 26400
        }
    }
};

function getInsuranceSalary(monthlySalary: number, minSalary: number, maxSalary: number): number {
    return Math.min(Math.max(monthlySalary, minSalary), maxSalary);
}

export function calculateSalary(input: SalaryInput): SalaryResult {
    const { monthlySalary, bonusMonths = 1, year = 2025 } = input;
    const rates = SALARY_RATES[year as keyof typeof SALARY_RATES] || SALARY_RATES[2025];

    // 計算各項保險的投保薪資
    const laborInsuranceSalary = getInsuranceSalary(
        monthlySalary, 
        rates.laborInsurance.minSalary, 
        rates.laborInsurance.maxSalary
    );
    
    const healthInsuranceSalary = getInsuranceSalary(
        monthlySalary, 
        rates.healthInsurance.minSalary, 
        rates.healthInsurance.maxSalary
    );
    
    const laborPensionSalary = getInsuranceSalary(
        monthlySalary, 
        rates.laborPension.minSalary, 
        rates.laborPension.maxSalary
    );

    // 計算各項扣除額
    const laborInsurance = Math.round(
        laborInsuranceSalary * rates.laborInsurance.rate * rates.laborInsurance.employeeShare
    );
    
    const healthInsurance = Math.round(
        healthInsuranceSalary * rates.healthInsurance.rate * rates.healthInsurance.employeeShare
    );
    
    const laborPension = Math.round(
        laborPensionSalary * rates.laborPension.rate
    );

    const netMonthly = Math.max(0, monthlySalary - laborInsurance - healthInsurance - laborPension);

    const yearlyGross = monthlySalary * (12 + (bonusMonths || 0));
    const yearlyNet = netMonthly * 12 + (monthlySalary * (bonusMonths || 0));

    return {
        monthly: {
            gross: monthlySalary,
            laborInsurance,
            healthInsurance,
            laborPension,
            net: netMonthly
        },
        yearly: {
            gross: yearlyGross,
            totalLaborInsurance: laborInsurance * 12,
            totalHealthInsurance: healthInsurance * 12,
            totalLaborPension: laborPension * 12,
            net: yearlyNet
        },
        metadata: {
            year: year || 2025,
            laborInsuranceRate: rates.laborInsurance.rate * rates.laborInsurance.employeeShare,
            healthInsuranceRate: rates.healthInsurance.rate * rates.healthInsurance.employeeShare,
            laborPensionRate: rates.laborPension.rate,
            dataSource: '勞動部、衛福部官方資料',
            lastUpdated: '2025-01-01'
        }
    };
}

export function calculateHistoricalComparison(input: SalaryInput): HistoricalComparison {
    const currentYear = calculateSalary({ ...input, year: 2025 });
    const previousYear = calculateSalary({ ...input, year: 2024 });

    const yearOverYearChange = {
        netIncome: currentYear.monthly.net - previousYear.monthly.net,
        laborInsurance: currentYear.monthly.laborInsurance - previousYear.monthly.laborInsurance,
        healthInsurance: currentYear.monthly.healthInsurance - previousYear.monthly.healthInsurance,
        laborPension: currentYear.monthly.laborPension - previousYear.monthly.laborPension
    };

    return {
        currentYear,
        previousYear,
        yearOverYearChange
    };
}

export function calculateTrendAnalysis(input: SalaryInput): TrendAnalysis {
    const comparison = calculateHistoricalComparison(input);
    const currentNet = comparison.currentYear.monthly.net;
    const previousNet = comparison.previousYear?.monthly.net || currentNet;
    
    // 計算薪資成長率
    const salaryGrowth = previousNet > 0 ? ((currentNet - previousNet) / previousNet) * 100 : 0;
    
    // 2024-2025 台灣通膨率估計 (約 2.5%)
    const inflationRate = 2.5;
    const inflationImpact = (currentNet * inflationRate) / 100;
    
    // 實質收入變化
    const realIncomeChange = salaryGrowth - inflationRate;

    const recommendations: string[] = [];
    
    if (realIncomeChange < 0) {
        recommendations.push('您的實質收入受到通膨影響而下降，建議考慮薪資調整或額外收入來源');
    }
    
    if (comparison.yearOverYearChange?.laborInsurance && comparison.yearOverYearChange.laborInsurance > 0) {
        recommendations.push('勞保費用有所增加，這是因為基本工資調整所致');
    }
    
    if (input.monthlySalary >= 45800) {
        recommendations.push('您的薪資已達勞保投保上限，超出部分不會增加勞保費用');
    }
    
    if (input.monthlySalary >= 150000) {
        recommendations.push('建議考慮自提勞退，可享有稅務優惠並增加退休保障');
    }

    return {
        salaryGrowth,
        inflationImpact,
        realIncomeChange,
        recommendations
    };
}
