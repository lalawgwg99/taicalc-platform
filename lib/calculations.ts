import { TAIWAN_PARAMS } from './constants';
import { INSURANCE_TABLES } from './insurance_tables';

/**
 * 查表計算：根據投保薪資級距計算個人負擔費用
 * @param salary - 月投保薪資
 * @param type - 保險類型 ('LABOR' | 'HEALTH')
 */
function lookupInsurance(salary: number, type: 'LABOR' | 'HEALTH'): number {
    const table = INSURANCE_TABLES[type];
    // 找到第一個大於等於薪資的級距，若超過最高級距則取最高級距
    const bracket = table.find(item => item.salary >= salary) || table[table.length - 1];
    return bracket.worker;
}

/**
 * 計算勞退提撥 (6%)
 * 勞退分級表通常與勞保相同，但上限不同，此處為簡化版 (依勞基法規定不低於月提繳工資的6%)
 */
export function calculatePension(monthlySalary: number): number {
    const table = INSURANCE_TABLES.LABOR;
    const bracket = table.find(item => item.salary >= monthlySalary) || table[table.length - 1];
    return Math.round(bracket.salary * 0.06);
}

export function calculateIncomeTax(
    annualIncome: number,
    options: {
        exemptionCount?: number;
        useStandardDeduction?: boolean;
    } = {}
): number {
    const { exemptionCount = 1, useStandardDeduction = true } = options;
    const { EXEMPTION, STANDARD, SALARY_SPECIAL } = TAIWAN_PARAMS.DEDUCTIONS;

    let totalDeductions = exemptionCount * EXEMPTION + SALARY_SPECIAL;
    if (useStandardDeduction) {
        totalDeductions += STANDARD;
    }

    const taxableIncome = Math.max(0, annualIncome - totalDeductions);

    for (const bracket of TAIWAN_PARAMS.INCOME_TAX_BRACKETS) {
        if (taxableIncome <= bracket.limit) {
            return Math.round(taxableIncome * bracket.rate - bracket.deduction);
        }
    }
    return 0;
}

/**
 * 完整薪資分析（含年終獎金、查表法）
 * @param monthlySalary - 月薪（元）
 * @param bonusMonths - 年終獎金月數（預設 0）
 */
export function analyzeSalary(monthlySalary: number, bonusMonths: number = 0) {
    const annualSalary = monthlySalary * (12 + bonusMonths);

    // 改用查表法
    const laborInsurance = lookupInsurance(monthlySalary, 'LABOR');
    const healthInsurance = lookupInsurance(monthlySalary, 'HEALTH');
    const insurance = laborInsurance + healthInsurance;

    const pension = calculatePension(monthlySalary);
    const takeHome = monthlySalary - insurance;
    const annualTax = calculateIncomeTax(annualSalary);
    const annualInsurance = insurance * 12;
    const annualNet = annualSalary - annualInsurance - annualTax;

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
            { name: '實領薪資', value: annualNet, color: '#3b82f6' }, // primary
            { name: '所得稅', value: annualTax, color: '#ef4444' },    // error
            { name: '勞健保費', value: annualInsurance, color: '#f59e0b' }, // warning
        ],
        effectiveTaxRate: annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0,
    };
}
