import { TAIWAN_PARAMS } from './constants';

/**
 * 計算月薪的勞健保費用
 * @param monthlySalary - 月薪（元）
 * @returns 個人負擔的勞健保總額
 * 
 * @example
 * calculateInsurance(40000) // 返回約 2068 元
 */
export function calculateInsurance(monthlySalary: number): number {
    const { LABOR_RATE, HEALTH_RATE } = TAIWAN_PARAMS.INSURANCE;
    const laborInsurance = monthlySalary * LABOR_RATE * 0.2; // 個人負擔 20%
    const healthInsurance = monthlySalary * HEALTH_RATE * 0.3; // 個人負擔 30%
    return Math.round(laborInsurance + healthInsurance);
}

/**
 * 計算勞退提撥金額（雇主最低提撥）
 * @param monthlySalary - 月薪（元）
 * @returns 雇主提撥金額
 * 
 * @example
 * calculatePension(40000) // 返回 2400 元
 */
export function calculatePension(monthlySalary: number): number {
    return Math.round(monthlySalary * TAIWAN_PARAMS.INSURANCE.PENSION_MIN_RATE);
}

/**
 * 計算年度所得稅
 * @param annualIncome - 年收入（元）
 * @param options - 配置選項
 * @returns 應繳稅額
 * 
 * @example
 * calculateIncomeTax(600000) // 單身標準：返回約 0 元（免稅額扣除後）
 * calculateIncomeTax(1200000, { exemptionCount: 2 }) // 返回稅額
 */
export function calculateIncomeTax(
    annualIncome: number,
    options: {
        exemptionCount?: number; // 免稅額人數（預設 1）
        useStandardDeduction?: boolean; // 使用標準扣除額（預設 true）
    } = {}
): number {
    const { exemptionCount = 1, useStandardDeduction = true } = options;
    const { EXEMPTION, STANDARD, SALARY_SPECIAL } = TAIWAN_PARAMS.DEDUCTIONS;

    // 計算可扣除總額
    let totalDeductions = exemptionCount * EXEMPTION + SALARY_SPECIAL;
    if (useStandardDeduction) {
        totalDeductions += STANDARD;
    }

    // 計算應稅所得
    const taxableIncome = Math.max(0, annualIncome - totalDeductions);

    // 根據級距計算稅額
    for (const bracket of TAIWAN_PARAMS.INCOME_TAX_BRACKETS) {
        if (taxableIncome <= bracket.limit) {
            return Math.round(taxableIncome * bracket.rate - bracket.deduction);
        }
    }

    return 0;
}

/**
 * 計算實領月薪（扣除勞健保後）
 * @param monthlySalary - 月薪（元）
 * @returns 實際到手金額
 * 
 * @example
 * calculateTakeHomePay(40000) // 返回約 37932 元
 */
export function calculateTakeHomePay(monthlySalary: number): number {
    const insurance = calculateInsurance(monthlySalary);
    return monthlySalary - insurance;
}

/**
 * 完整薪資分析（含年終獎金）
 * @param monthlySalary - 月薪（元）
 * @param bonusMonths - 年終獎金月數（預設 0）
 * @returns 詳細的薪資結構分析
 */
export function analyzeSalary(monthlySalary: number, bonusMonths: number = 0) {
    const annualSalary = monthlySalary * (12 + bonusMonths);
    const insurance = calculateInsurance(monthlySalary);
    const pension = calculatePension(monthlySalary);
    const takeHome = calculateTakeHomePay(monthlySalary);
    const annualTax = calculateIncomeTax(annualSalary);
    const annualInsurance = insurance * 12;
    const annualNet = annualSalary - annualInsurance - annualTax;

    // 計算勞保與健保分項
    const { LABOR_RATE, HEALTH_RATE } = TAIWAN_PARAMS.INSURANCE;
    const laborInsurance = Math.round(monthlySalary * LABOR_RATE * 0.2);
    const healthInsurance = Math.round(monthlySalary * HEALTH_RATE * 0.3);

    return {
        monthly: {
            gross: monthlySalary,
            insurance,
            labor: laborInsurance,
            health: healthInsurance,
            pension,
            takeHome,
        },
        annual: {
            gross: annualSalary,
            insurance: annualInsurance,
            pension: pension * 12,
            tax: annualTax,
            net: annualNet,
        },
        chartData: [
            { name: '實領薪資', value: annualNet, color: '#3b82f6' },
            { name: '所得稅', value: annualTax, color: '#ef4444' },
            { name: '勞健保費', value: annualInsurance, color: '#f59e0b' },
        ],
        effectiveTaxRate: annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0,
    };
}
