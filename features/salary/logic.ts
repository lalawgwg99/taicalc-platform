import { TAIWAN_PARAMS } from '@/lib/constants';
import { calculateTax } from '../tax/logic';

/**
 * 精準查表：根據實際薪資向上取整到最接近的投保級距
 * @param salary - 實際月薪
 * @param table - 分級表 (勞保或健保)
 * @returns 投保金額
 */
function getInsuredAmount(salary: number, table: readonly { level: number, amount: number }[]): number {
    // 找到第一個 >= salary 的級距
    const bracket = table.find(item => item.amount >= salary);
    if (bracket) {
        return bracket.amount;
    }
    // 若超過最高級距，返回最高級距
    return table[table.length - 1].amount;
}

/**
 * 計算勞保個人負擔費用
 * @param monthlySalary - 月薪
 * @returns 勞保個人負擔金額 (元/月)
 */
export function calculateLaborInsurance(monthlySalary: number): number {
    const insuredAmount = getInsuredAmount(monthlySalary, TAIWAN_PARAMS.LABOR_INSURANCE_TABLE);
    const { LABOR_INSURANCE, LABOR_SHARE } = TAIWAN_PARAMS.RATES;
    return Math.round(insuredAmount * LABOR_INSURANCE * LABOR_SHARE);
}

/**
 * 計算健保個人負擔費用
 * @param monthlySalary - 月薪
 * @param dependents - 眷屬人數 (最多計 3 口)
 * @returns 健保個人負擔金額 (元/月)
 */
export function calculateHealthInsurance(monthlySalary: number, dependents: number = 0): number {
    const insuredAmount = getInsuredAmount(monthlySalary, TAIWAN_PARAMS.HEALTH_INSURANCE_TABLE);
    const { HEALTH_INSURANCE, HEALTH_SHARE } = TAIWAN_PARAMS.RATES;

    // 眷屬最多計 3 口
    const effectiveDependents = Math.min(dependents, 3);
    const totalUnits = 1 + effectiveDependents; // 本人 + 眷屬

    return Math.round(insuredAmount * HEALTH_INSURANCE * HEALTH_SHARE * totalUnits);
}

/**
 * 計算勞退提撥 (雇主 6% + 勞工自提)
 * @param monthlySalary - 月薪
 * @param selfContributionRate - 勞工自提比例 (0-6%)
 * @returns { employer, employee, total } 勞退提撥金額
 */
export function calculatePension(monthlySalary: number, selfContributionRate: number = 0): {
    employer: number;
    employee: number;
    total: number;
} {
    // 勞退提繳工資上限 150,000
    const cappedSalary = Math.min(monthlySalary, TAIWAN_PARAMS.PENSION_TABLE_MAX);
    const insuredAmount = getInsuredAmount(cappedSalary, TAIWAN_PARAMS.HEALTH_INSURANCE_TABLE.filter(item => item.amount <= TAIWAN_PARAMS.PENSION_TABLE_MAX));

    const employer = Math.round(insuredAmount * 0.06);
    const employee = Math.round(insuredAmount * (selfContributionRate / 100));

    return {
        employer,
        employee,
        total: employer + employee,
    };
}



/**
 * 完整薪資分析 (含自提節稅建議)
 * @param monthlySalary - 月薪
 * @param bonusMonths - 年終月數
 * @param options - 進階選項
 */
export function analyzeSalary(
    monthlySalary: number,
    bonusMonths: number = 0,
    options: {
        dependents?: number;
        selfContributionRate?: number;
        isMarried?: boolean;
    } = {}
) {
    const { dependents = 0, selfContributionRate = 0, isMarried = false } = options;

    const annualSalary = monthlySalary * (12 + bonusMonths);

    // 查表計算保費
    const laborInsurance = calculateLaborInsurance(monthlySalary);
    const healthInsurance = calculateHealthInsurance(monthlySalary, dependents);
    const insurance = laborInsurance + healthInsurance;

    const pension = calculatePension(monthlySalary, selfContributionRate);
    const takeHome = monthlySalary - insurance - pension.employee;

    // 稅務計算
    const annualTax = calculateTax({
        annualIncome: annualSalary,
        exemptionCount: 1,
        householdSize: 1,
        isMarried,
    }).taxAmount;

    const annualInsurance = insurance * 12;
    const annualPensionEmployee = pension.employee * 12;
    const annualNet = annualSalary - annualInsurance - annualPensionEmployee - annualTax;

    // 自提節稅分析
    let selfContributionSavings = 0;
    if (selfContributionRate === 0) {
        // 試算若自提 6% 能省多少稅
        const pensionWith6Percent = calculatePension(monthlySalary, 6);
        const annualPensionWith6Percent = pensionWith6Percent.employee * 12;
        const taxableIncomeReduced = annualSalary - annualPensionWith6Percent;
        const taxWith6Percent = calculateTax({
            annualIncome: taxableIncomeReduced,
            exemptionCount: 1,
            householdSize: 1,
            isMarried,
        }).taxAmount;
        selfContributionSavings = annualTax - taxWith6Percent - annualPensionWith6Percent; // Wait, saving is Tax diff - Cost? No, simply Tax diff usually.
        // Correction: Saving is usually just the Tax reduction. The cost is the money put away. 
        // User logic in original code: selfContributionSavings = annualTax - taxWith6Percent - annualPensionWith6Percent;
        // This looks like Net Income diff? 
        // Original: annualNet = annualSalary - annualInsurance - annualPensionEmployee - annualTax;
        // With 6%: annualNet6 = annualSalary - annualInsurance - annualPensionWith6Percent - taxWith6Percent;
        // tailored for "Savings"? If it means "Tax Savings", it should be annualTax - taxWith6Percent.
        // If it means "Net Money Difference", it matches the calculation (usually negative because you put money in pension).
        // Let's stick to original logic for now to ensure consistency, or simple tax saving.
        // The original code says "每年可省稅 ... 元", so it should be just tax difference.
        // Original line 177: selfContributionSavings = annualTax - taxWith6Percent - annualPensionWith6Percent;
        // This variable is used in recommendation: "建議自提 6%，每年可省稅 ${Math.round(selfContributionSavings)} 元"
        // If it subtracts pension cost, it might be negative.
        // Let's look closer at original line 177.
        // annualTax - taxWith6Percent is the tax saved.
        // - annualPensionWith6Percent is the cost.
        // This results in "Net Cashflow Impact".
        // But the message says "省稅", which implies only the tax part.
        // However, I will copy the logic exactly for now to avoid logic bugs change, but I suspect the original logic might be calculating net benefit (which is usually negative in cashflow but positive in asset).
        // Actually, let's fix it to be conceptually correct for "Tax Savings" if the message says "省稅".
        // If the message is "省稅", it should be `annualTax - taxWith6Percent`.
        // I will use `annualTax - taxWith6Percent` which makes more sense for "Tax Savings".
        selfContributionSavings = Math.max(0, annualTax - taxWith6Percent);
    }

    return {
        monthly: {
            gross: monthlySalary,
            insurance,
            labor: laborInsurance,
            health: healthInsurance,
            pension: pension.employee,
            pensionEmployer: pension.employer,
            takeHome,
        },
        annual: {
            gross: annualSalary,
            insurance: annualInsurance,
            pension: annualPensionEmployee,
            tax: annualTax,
            net: annualNet,
        },
        chartData: [
            { name: '實領薪資', value: annualNet, color: '#3b82f6' },
            { name: '所得稅', value: annualTax, color: '#ef4444' },
            { name: '勞健保費', value: annualInsurance, color: '#f59e0b' },
            { name: '勞退自提', value: annualPensionEmployee, color: '#8b5cf6' },
        ],
        effectiveTaxRate: annualSalary > 0 ? (annualTax / annualSalary) * 100 : 0,
        insights: {
            selfContributionSavings,
            recommendation: selfContributionSavings > 0 ? `建議自提 6%，每年可省稅 ${Math.round(selfContributionSavings)} 元` : null,
        },
    };
}

/**
 * 逆向推算：已知實領薪資，反推稅前月薪
 * 採用二分搜尋法 (Binary Search)
 */
export function calculateGrossFromNet(targetNet: number, options: {
    dependents?: number;
    selfContributionRate?: number;
} = {}): number {
    const { dependents = 0, selfContributionRate = 0 } = options;

    let low = targetNet;
    let high = Math.max(targetNet * 1.5, 300000);
    let ans = high;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const result = analyzeSalary(mid, 0, { dependents, selfContributionRate });

        if (result.monthly.takeHome === targetNet) {
            return mid;
        } else if (result.monthly.takeHome < targetNet) {
            low = mid + 1;
        } else {
            ans = mid;
            high = mid - 1;
        }
    }
    return ans;
}

/**
 * 薪資結構分析 (AI 規則引擎)
 * 提供決策輔助建議
 */
export function analyzeSalaryStructure(monthlySalary: number): {
    級距: string;
    勞保投保級距: number;
    健保投保級距: number;
    建議: string[];
} {
    const laborInsured = getInsuredAmount(monthlySalary, TAIWAN_PARAMS.LABOR_INSURANCE_TABLE);
    const healthInsured = getInsuredAmount(monthlySalary, TAIWAN_PARAMS.HEALTH_INSURANCE_TABLE);

    const suggestions: string[] = [];

    // 判斷級距
    let tier = '一般薪資';
    if (monthlySalary <= TAIWAN_PARAMS.MINIMUM_WAGE) {
        tier = '基本工資';
        suggestions.push('您的薪資為基本工資水準，建議檢視職涯發展機會');
    } else if (monthlySalary >= 100000) {
        tier = '高薪族群';
        suggestions.push('建議考慮勞退自提 6%，可有效節稅並增加退休金');
    }

    // 跨級距檢查
    const laborTable = TAIWAN_PARAMS.LABOR_INSURANCE_TABLE;
    const healthTable = TAIWAN_PARAMS.HEALTH_INSURANCE_TABLE;

    const currentLaborIndex = laborTable.findIndex(item => item.amount === laborInsured);
    // const currentHealthIndex = healthTable.findIndex(item => item.amount === healthInsured); // Unused

    if (currentLaborIndex < laborTable.length - 1) {
        const nextLaborBracket = laborTable[currentLaborIndex + 1].amount;
        const diff = nextLaborBracket - monthlySalary;
        if (diff > 0 && diff <= 1000) {
            suggestions.push(`您距離下一個勞保級距僅 ${diff} 元，考慮與雇主協商調薪`);
        }
    }

    return {
        級距: tier,
        勞保投保級距: laborInsured,
        健保投保級距: healthInsured,
        建議: suggestions,
    };
}
