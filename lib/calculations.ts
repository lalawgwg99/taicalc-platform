import { TAIWAN_PARAMS } from './constants';

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
 * 計算所得稅
 * @param annualIncome - 年收入
 * @param options - 稅務選項
 */
export function calculateIncomeTax(
    annualIncome: number,
    options: {
        exemptionCount?: number;      // 免稅額人數
        householdSize?: number;       // 申報戶人數 (用於基本生活費)
        isMarried?: boolean;          // 是否已婚
        useStandardDeduction?: boolean;
    } = {}
): number {
    const {
        exemptionCount = 1,
        householdSize = 1,
        isMarried = false,
        useStandardDeduction = true,
    } = options;

    const { EXEMPTION, STANDARD_SINGLE, STANDARD_MARRIED, SALARY_SPECIAL, BASIC_LIVING_EXPENSE } = TAIWAN_PARAMS.DEDUCTIONS;

    // 1. 免稅額
    const exemptionAmount = exemptionCount * EXEMPTION;

    // 2. 標準扣除額 (單身或已婚)
    let standardDeductionAmount = 0;
    if (useStandardDeduction) {
        standardDeductionAmount = isMarried ? STANDARD_MARRIED : STANDARD_SINGLE;
    }

    // 3. 薪資特別扣除額 (上限為薪資收入)
    const salaryDeduction = Math.min(annualIncome, SALARY_SPECIAL);

    // 4. 基本生活費差額
    const basicLivingCheckSum = exemptionAmount + standardDeductionAmount;
    const basicLivingTotal = householdSize * BASIC_LIVING_EXPENSE;
    const basicLivingDifference = Math.max(0, basicLivingTotal - basicLivingCheckSum);

    // 5. 總扣除額
    const totalDeductions = exemptionAmount + standardDeductionAmount + salaryDeduction + basicLivingDifference;

    // 6. 課稅所得
    const taxableIncome = Math.max(0, annualIncome - totalDeductions);

    // 7. 累進稅率計算
    for (const bracket of TAIWAN_PARAMS.INCOME_TAX_BRACKETS) {
        if (taxableIncome <= bracket.limit) {
            return Math.round(taxableIncome * bracket.rate - bracket.deduction);
        }
    }
    return 0;
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
    const annualTax = calculateIncomeTax(annualSalary, {
        exemptionCount: 1,
        householdSize: 1,
        isMarried,
    });

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
        const taxWith6Percent = calculateIncomeTax(taxableIncomeReduced, {
            exemptionCount: 1,
            householdSize: 1,
            isMarried,
        });
        selfContributionSavings = annualTax - taxWith6Percent - annualPensionWith6Percent;
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
    const currentHealthIndex = healthTable.findIndex(item => item.amount === healthInsured);

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
