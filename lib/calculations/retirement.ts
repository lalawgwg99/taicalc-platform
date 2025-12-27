import { TAIWAN_PARAMS } from '../constants';

/**
 * 計算複利終值 (Future Value)
 * @param rate - 月利率
 * @param periods - 期數（月）
 * @param payment - 每期投入金額
 * @param presentValue - 現值（預設 0）
 */
function calculateFV(rate: number, periods: number, payment: number, presentValue: number = 0): number {
    if (rate === 0) {
        return presentValue + payment * periods;
    }
    // FV = PV(1+r)^n + PMT × [((1+r)^n - 1) / r]
    const factor = Math.pow(1 + rate, periods);
    return presentValue * factor + payment * ((factor - 1) / rate);
}

/**
 * 勞退累積試算（含自提比較）
 * @param options - 試算選項
 */
export function calculateLaborPension(options: {
    monthlySalary: number;
    currentAge: number;
    retireAge: number;
    selfContributionRate: number; // 0-6%
    expectedReturn?: number; // 預期年報酬率（預設 3%）
}) {
    const {
        monthlySalary,
        currentAge,
        retireAge,
        selfContributionRate,
        expectedReturn = 3,
    } = options;

    // 勞退提繳上限 150,000
    const cappedSalary = Math.min(monthlySalary, TAIWAN_PARAMS.PENSION_TABLE_MAX);

    const years = retireAge - currentAge;
    const months = years * 12;
    const monthlyRate = expectedReturn / 100 / 12;

    // 雇主 6%
    const employerMonthly = Math.round(cappedSalary * 0.06);

    // 自提 0-6%
    const employeeMonthly = Math.round(cappedSalary * (selfContributionRate / 100));

    // 複利累積（雇主）
    const employerAccumulated = calculateFV(monthlyRate, months, employerMonthly);

    // 複利累積（自提）
    const employeeAccumulated = calculateFV(monthlyRate, months, employeeMonthly);

    // 總累積
    const totalAccumulated = employerAccumulated + employeeAccumulated;

    // 年金化（假設退休後領 20 年）
    const monthsAfterRetire = 20 * 12;
    const monthlyPension = totalAccumulated / monthsAfterRetire;

    return {
        years,
        months,
        employerMonthly,
        employeeMonthly,
        employerAccumulated: Math.round(employerAccumulated),
        employeeAccumulated: Math.round(employeeAccumulated),
        totalAccumulated: Math.round(totalAccumulated),
        monthlyPension: Math.round(monthlyPension),
        totalContribution: (employerMonthly + employeeMonthly) * months,
    };
}

/**
 * 勞退自提節稅分析
 * @param monthlySalary - 月薪
 * @param selfContributionRate - 自提比例
 * @param annualIncome - 年收入（用於計算稅率）
 */
export function calculatePensionTaxSavings(
    monthlySalary: number,
    selfContributionRate: number,
    annualIncome: number
): {
    annualContribution: number;
    taxSavings: number;
    effectiveTaxRate: number;
    netCost: number;
} {
    const cappedSalary = Math.min(monthlySalary, TAIWAN_PARAMS.PENSION_TABLE_MAX);
    const monthlyContribution = Math.round(cappedSalary * (selfContributionRate / 100));
    const annualContribution = monthlyContribution * 12;

    // 簡化稅率計算：找到適用稅率級距
    let effectiveTaxRate = 0;
    for (const bracket of TAIWAN_PARAMS.INCOME_TAX_BRACKETS) {
        if (annualIncome <= bracket.limit) {
            effectiveTaxRate = bracket.rate;
            break;
        }
    }

    // 節稅金額 = 自提金額 × 稅率
    const taxSavings = Math.round(annualContribution * effectiveTaxRate);

    // 實際淨成本 = 自提金額 - 節稅金額
    const netCost = annualContribution - taxSavings;

    return {
        annualContribution,
        taxSavings,
        effectiveTaxRate,
        netCost,
    };
}

/**
 * 退休金缺口計算
 * @param options - 試算選項
 */
export function calculatePensionGap(options: {
    monthlySalary: number;
    currentAge: number;
    retireAge: number;
    expectedMonthlyExpense: number; // 期望退休月支出
    laborPensionMonthly?: number; // 預估勞保年金月領（若未提供則估算）
    nationalPensionMonthly?: number; // 預估國民年金月領
    selfContributionRate?: number; // 勞退自提比例
    expectedReturn?: number; // 預期投資報酬率
}) {
    const {
        monthlySalary,
        currentAge,
        retireAge,
        expectedMonthlyExpense,
        laborPensionMonthly = 0,
        nationalPensionMonthly = 0,
        selfContributionRate = 0,
        expectedReturn = 3,
    } = options;

    // 計算勞退累積
    const laborPension = calculateLaborPension({
        monthlySalary,
        currentAge,
        retireAge,
        selfContributionRate,
        expectedReturn,
    });

    // 預估勞保年金（簡化公式：平均月投保薪資 × 年資 × 1.55%）
    const years = retireAge - currentAge;
    const estimatedLaborInsurancePension = laborPensionMonthly ||
        Math.round(Math.min(monthlySalary, 45800) * years * 0.0155);

    // 每月退休收入
    const totalMonthlyIncome =
        laborPension.monthlyPension +
        estimatedLaborInsurancePension +
        nationalPensionMonthly;

    // 缺口
    const monthlyGap = Math.max(0, expectedMonthlyExpense - totalMonthlyIncome);

    // 建議額外準備金額（退休後 20 年）
    const recommendedSavings = monthlyGap * 12 * 20;

    // 若要填補缺口，每月應投資多少
    const monthlyInvestmentNeeded = monthlyGap > 0
        ? Math.round(recommendedSavings / calculateFV(expectedReturn / 100 / 12, years * 12, 1))
        : 0;

    return {
        laborRetirement: laborPension.monthlyPension,
        laborInsurance: estimatedLaborInsurancePension,
        nationalPension: nationalPensionMonthly,
        totalMonthlyIncome,
        expectedMonthlyExpense,
        monthlyGap,
        gapPercentage: expectedMonthlyExpense > 0
            ? Math.round((monthlyGap / expectedMonthlyExpense) * 100)
            : 0,
        recommendedSavings,
        monthlyInvestmentNeeded,
    };
}

/**
 * 國民年金試算（簡化版）
 * @param options - 試算選項
 */
export function calculateNationalPension(options: {
    birthYear: number;
    yearsContributed: number; // 投保年資
}): {
    monthlyPension: number;
    yearlyPension: number;
} {
    const { yearsContributed } = options;

    // 國民年金基本保障：每月 3,772 元（2024）
    // 每增加 1 年年資，增加 97 元（簡化計算）
    const basePension = 3772;
    const additionalPerYear = 97;

    const monthlyPension = basePension + (yearsContributed * additionalPerYear);
    const yearlyPension = monthlyPension * 12;

    return {
        monthlyPension: Math.round(monthlyPension),
        yearlyPension: Math.round(yearlyPension),
    };
}

/**
 * 勞退自提比較（0% vs 3% vs 6%）
 */
export function compareSelfContributionRates(
    monthlySalary: number,
    currentAge: number,
    retireAge: number,
    annualIncome: number,
    expectedReturn: number = 3
): {
    rate: number;
    result: ReturnType<typeof calculateLaborPension>;
    taxSavings: ReturnType<typeof calculatePensionTaxSavings>;
    netBenefit: number;
}[] {
    const rates = [0, 3, 6];

    return rates.map(rate => {
        const result = calculateLaborPension({
            monthlySalary,
            currentAge,
            retireAge,
            selfContributionRate: rate,
            expectedReturn,
        });

        const taxSavings = calculatePensionTaxSavings(monthlySalary, rate, annualIncome);

        // 淨效益 = 累積金額 - 淨成本（已扣除節稅）
        const netBenefit = result.employeeAccumulated - taxSavings.netCost;

        return {
            rate,
            result,
            taxSavings,
            netBenefit,
        };
    });
}
