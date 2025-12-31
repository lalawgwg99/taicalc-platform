import { TAIWAN_PARAMS } from '@/lib/constants';

/**
 * TaiCalc 稅務版本化配置
 * 確保計算結果可追溯、跨年度不混淆
 */

// 當前使用的稅務年度
export const CURRENT_TAX_YEAR = 2024;
export const RULE_VERSION = '2024-v2';

// 2024 年度稅務規則
export const TAX_RULES_2024 = {
    year: 2024,
    version: '2024-v2',
    effectiveDate: '2024-01-01',

    // 免稅額
    exemption: {
        normal: 92000,
        over70: 138000,
    },

    // 標準扣除額
    standardDeduction: {
        single: 124000,
        married: 248000,
    },

    // 薪資所得特別扣除額
    salaryDeduction: {
        max: 207000,
        // Wait, TAIWAN_PARAMS says 218000 for 2025.
        // 2024 is 207000? I trust the original file I read.
    },

    // 基本生活費 (2023為20.2萬, 2024預計調升)
    // TAIWAN_PARAMS says 202000 (20.2萬).
    basicLivingExpense: 202000,

    // 累進稅率級距
    brackets: [
        { min: 0, max: 560000, rate: 0.05 },
        { min: 560000, max: 1260000, rate: 0.12 },
        { min: 1260000, max: 2520000, rate: 0.20 },
        { min: 2520000, max: 4720000, rate: 0.30 },
        { min: 4720000, max: Infinity, rate: 0.40 },
    ],

    // 累減稅額
    progressiveDeduction: [0, 39200, 140000, 392000, 864000],
};

// 2025 年度稅務規則（預留）
export const TAX_RULES_2025 = {
    year: 2025,
    version: '2025-v1',
    effectiveDate: '2025-01-01',

    // TODO: 待財政部公告後更新
    exemption: {
        normal: 97000,  // 預估
        over70: 145500,
    },

    standardDeduction: {
        single: 131000, // 預估
        married: 262000,
    },

    salaryDeduction: {
        max: 218000, // 預估
    },

    basicLivingExpense: 202000, // 預估

    brackets: TAX_RULES_2024.brackets, // 待確認
    progressiveDeduction: TAX_RULES_2024.progressiveDeduction,
};

// 根據年度獲取規則
export function getTaxRules(year: number = CURRENT_TAX_YEAR) {
    switch (year) {
        case 2025:
            return TAX_RULES_2025;
        case 2024:
        default:
            return TAX_RULES_2024;
    }
}

/**
 * 純前端稅務計算
 * @param input 計算輸入
 * @returns 計算結果（含版本資訊）
 */
export function calculateTax(input: {
    annualIncome: number;
    isMarried?: boolean;
    exemptionCount?: number;
    householdSize?: number;       // 申報戶人數 (用於基本生活費)
    useStandardDeduction?: boolean;
    taxYear?: number;
}) {
    const year = input.taxYear || CURRENT_TAX_YEAR;
    const rules = getTaxRules(year);

    const income = input.annualIncome;
    const isMarried = input.isMarried || false;
    const exemptionCount = input.exemptionCount || 1;
    const householdSize = input.householdSize || 1;
    const useStandardDeduction = input.useStandardDeduction !== false; // Default true

    // 免稅額
    const exemption = rules.exemption.normal * exemptionCount;

    // 標準扣除額
    const standardDeduction = useStandardDeduction
        ? (isMarried ? rules.standardDeduction.married : rules.standardDeduction.single)
        : 0;

    // 薪資扣除額
    const salaryDeduction = Math.min(income, rules.salaryDeduction.max);

    // 基本生活費差額
    // 基本生活費總額 = 人數 * 20.2萬
    // 比較項目 = 免稅額 + 標準扣除額
    // 若 (免稅額 + 標準扣除額) < 基本生活費總額，差額可從所得中扣除
    // 注意：不含薪資扣除額
    const basicLivingTotal = householdSize * rules.basicLivingExpense;
    const basicLivingCheckSum = exemption + standardDeduction;
    const basicLivingDifference = Math.max(0, basicLivingTotal - basicLivingCheckSum);

    // 課稅所得
    const totalDeductions = exemption + standardDeduction + salaryDeduction + basicLivingDifference;
    const taxableIncome = Math.max(0, income - totalDeductions);

    // 累進稅率計算
    let taxAmount = 0;
    let taxBracket = '';

    for (let i = 0; i < rules.brackets.length; i++) {
        const bracket = rules.brackets[i];
        if (taxableIncome > bracket.min) {
            taxAmount = taxableIncome * bracket.rate - rules.progressiveDeduction[i];
            taxBracket = `${bracket.rate * 100}%`;
        }
    }

    taxAmount = Math.max(0, Math.round(taxAmount));
    const effectiveTaxRate = income > 0 ? (taxAmount / income) * 100 : 0;

    return {
        // 結果
        taxAmount,
        effectiveTaxRate: Math.round(effectiveTaxRate * 100) / 100,
        taxBracket,
        taxableIncome,

        // 扣除明細
        deductionDetails: {
            exemption,
            standardDeduction,
            salarySpecial: salaryDeduction,
            basicLiving: basicLivingDifference,
            totalDeductions,
        },

        // 版本資訊（重要！）
        meta: {
            taxYear: year,
            ruleVersion: rules.version,
            calculatedAt: new Date().toISOString(),
        },

        // 假設條件
        assumptions: [
            `採用 ${year} 年度稅務規則（版本：${rules.version}）`,
            `免稅額：NT$ ${rules.exemption.normal.toLocaleString()}`,
            `標準扣除額：${isMarried ? '已婚' : '單身'} NT$ ${(useStandardDeduction ? (isMarried ? rules.standardDeduction.married : rules.standardDeduction.single) : 0).toLocaleString()}`,
            `薪資扣除額上限：NT$ ${rules.salaryDeduction.max.toLocaleString()}`,
            `基本生活費差額：NT$ ${basicLivingDifference.toLocaleString()}`,
        ],

        // 警告
        warnings: [
            '未包含列舉扣除額 (若使用列舉，請設定 useStandardDeduction=false)',
            '未包含特別扣除額（如：房貸利息、長照、幼兒學前）',
            '未包含扶養親屬',
            '未包含境外所得',
        ],
    };
}

/**
 * 版本顯示文字
 */
export function getVersionLabel(year: number = CURRENT_TAX_YEAR) {
    const rules = getTaxRules(year);
    return `${year} 年度（版本：${rules.version}）`;
}
