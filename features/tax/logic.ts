export interface TaxInput {
    income: number;          // 本人薪資所得
    spouseIncome?: number;   // 配偶薪資所得
    isMarried?: boolean;     // 婚姻狀態

    // 扶養親屬
    dependents?: number;           // 一般扶養親屬 (未滿70歲)
    elderlyDependents?: number;    // 年滿70歲扶養親屬

    // 特別扣除額相關
    preschoolChildren?: number; // 5歲以下幼兒
    disabledDependents?: number; // 身心障礙人數

    // 扣除額模式
    deductionMode: 'standard' | 'itemized';
    itemizedAmount?: number; // 列舉扣除額總額
}

export interface TaxResult {
    totalIncome: number;     // 所得總額
    taxableIncome: number;   // 綜合所得淨額 (應稅所得)
    taxAmount: number;       // 應納稅額 (尚未扣除扣繳稅額)
    effectiveRate: number;   // 有效稅率
    marginalRate: number;    // 邊際稅率

    // 詳細計算過程
    details: {
        exemptions: number;      // 免稅額總計
        standardDeduction: number; // 標準扣除額
        specialDeduction: number;  // 特別扣除額總計
        basicLivingDiff: number;   // 基本生活費差額 (簡化版暫不實作複雜比較，先以扣除額為主)
        salaryDeduction: number;   // 薪資特別扣除額
    };

    // 稅率級距資訊 (用於圖表)
    brackets: {
        rate: number;
        threshold: number;
        amount: number; // 該級距應繳金額
        isActive: boolean; // 是否落在該級距
    }[];
}

// 2024年度所得稅 (2025申報) 參數
const CONSTANTS = {
    EXEMPTION: 97000,          // 免稅額
    EXEMPTION_ELDERLY: 145500, // 免稅額 (70歲以上)
    STANDARD_DEDUCTION_SINGLE: 131000, // 標準扣除額 (單身)
    STANDARD_DEDUCTION_MARRIED: 262000, // 標準扣除額 (已婚)
    SALARY_DEDUCTION_MAX: 218000,      // 薪資特別扣除額上限
    DISABILITY_DEDUCTION: 218000,      // 身心障礙特別扣除額
    PRESCHOOL_DEDUCTION: 120000,       // 幼兒學前特別扣除額
    BASIC_LIVING_EXPENSE: 202000,      // 基本生活費 (2023標準，需更新2024) -> 暫定 20.2萬
};

const TAX_BRACKETS = [
    { threshold: 590000, rate: 0.05, progressiveDiff: 0 },
    { threshold: 1330000, rate: 0.12, progressiveDiff: 41300 },
    { threshold: 2660000, rate: 0.20, progressiveDiff: 147700 },
    { threshold: 4980000, rate: 0.30, progressiveDiff: 413700 },
    { threshold: Infinity, rate: 0.40, progressiveDiff: 911700 },
];

export function calculateTax(input: TaxInput): TaxResult {
    // 1. 計算所得總額
    const totalIncome = input.income + (input.spouseIncome || 0);

    // 2. 計算免稅額
    // 本人 + 配偶
    let exemptionCount = 1 + (input.isMarried ? 1 : 0);
    let exemptions = (exemptionCount * CONSTANTS.EXEMPTION);

    // 扶養親屬
    if (input.dependents) exemptions += input.dependents * CONSTANTS.EXEMPTION;
    if (input.elderlyDependents) exemptions += input.elderlyDependents * CONSTANTS.EXEMPTION_ELDERLY;

    // 3. 計算扣除額
    let deduction = 0;
    let standardDeduction = input.isMarried ? CONSTANTS.STANDARD_DEDUCTION_MARRIED : CONSTANTS.STANDARD_DEDUCTION_SINGLE;

    if (input.deductionMode === 'itemized' && input.itemizedAmount && input.itemizedAmount > standardDeduction) {
        deduction = input.itemizedAmount;
    } else {
        deduction = standardDeduction;
    }

    // 4. 計算特別扣除額
    // 薪資特別扣除額 (本人 + 配偶，各別計算，上限21.8萬)
    const selfSalaryDeduction = Math.min(input.income, CONSTANTS.SALARY_DEDUCTION_MAX);
    const spouseSalaryDeduction = input.spouseIncome ? Math.min(input.spouseIncome, CONSTANTS.SALARY_DEDUCTION_MAX) : 0;
    const salaryDeduction = selfSalaryDeduction + spouseSalaryDeduction;

    // 其他特別扣除額
    let otherSpecialDeduction = 0;
    if (input.disabledDependents) otherSpecialDeduction += input.disabledDependents * CONSTANTS.DISABILITY_DEDUCTION;
    if (input.preschoolChildren) otherSpecialDeduction += input.preschoolChildren * CONSTANTS.PRESCHOOL_DEDUCTION;

    const specialDeduction = salaryDeduction + otherSpecialDeduction;

    // 5. 計算應稅所得 (綜合所得淨額)
    // 簡單版基本生活費比較 (暫略，直接用扣除額計算)
    const basicLivingDiff = 0; // TODO: Implement Basic Living Expense Difference

    const taxableIncome = Math.max(0, totalIncome - exemptions - deduction - specialDeduction);

    // 6. 計算稅額 (累進稅率)
    let taxAmount = 0;
    let marginalRate = 0;

    // 尋找適用級距
    for (const bracket of TAX_BRACKETS) {
        if (taxableIncome <= bracket.threshold) {
            taxAmount = Math.round(taxableIncome * bracket.rate - bracket.progressiveDiff);
            marginalRate = bracket.rate;
            break;
        }
    }
    // Handle Infinity case manually if loop finishes (though loop logic handles <= Infinity)
    if (taxableIncome > 4980000) {
        taxAmount = Math.round(taxableIncome * 0.40 - 911700);
        marginalRate = 0.40;
    }

    const effectiveRate = totalIncome > 0 ? (taxAmount / totalIncome) * 100 : 0;

    // 7. 生成級距視覺化資料
    const bracketsData = TAX_BRACKETS.map((bracket, index) => {
        const prevThreshold = index === 0 ? 0 : TAX_BRACKETS[index - 1].threshold;
        // 該級距內的金額
        let amountInBracket = 0;
        let isActive = false;

        if (taxableIncome > prevThreshold) {
            isActive = true;
            if (bracket.threshold === Infinity) {
                amountInBracket = taxableIncome - prevThreshold;
            } else {
                amountInBracket = Math.min(taxableIncome, bracket.threshold) - prevThreshold;
            }
        }

        return {
            rate: bracket.rate,
            threshold: bracket.threshold,
            amount: amountInBracket,
            isActive
        };
    });

    return {
        totalIncome,
        taxableIncome,
        taxAmount: Math.max(0, taxAmount),
        effectiveRate,
        marginalRate,
        details: {
            exemptions,
            standardDeduction: deduction, // 顯示實際採用的扣除額
            specialDeduction,
            basicLivingDiff,
            salaryDeduction
        },
        brackets: bracketsData
    };
}
