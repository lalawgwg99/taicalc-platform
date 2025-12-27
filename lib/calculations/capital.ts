/**
 * 資本計算器延伸功能
 */

/**
 * FIRE 財務自由計算
 * Rule of 25: 年開銷 × 25 = FIRE Number
 * 4% Rule: 每年提領 4%
 */
export interface FIREResult {
    fireNumber: number;           // 財務自由目標金額
    monthlyExpense: number;       // 月開銷
    annualExpense: number;        // 年開銷
    safeWithdrawalRate: number;   // 安全提領率 (預設 4%)
    yearsToFIRE: number;          // 距離 FIRE 還需幾年
    monthlyInvestmentNeeded: number; // 每月需投入金額
    currentProgress: number;      // 目前進度 (%)
}

export function calculateFIRE(
    monthlyExpense: number,
    currentSavings: number = 0,
    monthlyInvestment: number = 0,
    expectedReturn: number = 7,
    safeWithdrawalRate: number = 4,
    inflationRate: number = 2.5
): FIREResult {
    // 1. 基礎參數安全檢查與邊界防護
    const _monthlyExpense = monthlyExpense > 0 ? monthlyExpense : 0;
    const _currentSavings = currentSavings > 0 ? currentSavings : 0;
    const _monthlyInvestment = monthlyInvestment > 0 ? monthlyInvestment : 0;
    const _expectedReturn = expectedReturn >= 0 ? expectedReturn : 0;
    const _safeWithdrawalRate = safeWithdrawalRate > 0.1 ? safeWithdrawalRate : 4; // 預設歸為 4

    const annualExpense = _monthlyExpense * 12;
    // 靜態目標：Rule of 25 (直接使用名目金額，避免動態追趕造成的死循環)
    const fireNumber = annualExpense * (100 / _safeWithdrawalRate);

    // 2. 計算進度 (嚴格防呆)
    let currentProgress = 0;
    if (fireNumber > 0) {
        currentProgress = (_currentSavings / fireNumber) * 100;
    }
    // 確保進度是有限數值且在合理範圍
    if (!Number.isFinite(currentProgress)) currentProgress = 0;
    currentProgress = Math.min(100, Math.max(0, currentProgress));

    // 3. 計算距離 FIRE 還需幾年 (穩定算法)
    let yearsToFIRE = 0;
    const monthlyReturnRate = _expectedReturn / 100 / 12;

    if (_currentSavings >= fireNumber) {
        yearsToFIRE = 0;
    } else if (_monthlyInvestment <= 0 && _currentSavings <= 0) {
        yearsToFIRE = Infinity;
    } else {
        // 使用對數公式直接解 NPER，或使用有上限的迴圈
        // 為求最穩定，使用有上限的迴圈 (Max 100 loops)
        let balance = _currentSavings;
        while (balance < fireNumber && yearsToFIRE < 100) {
            // 單利/複利增長
            if (monthlyReturnRate > 0) {
                // FV = PV * (1+r)^12 + PMT * ... (一年)
                // 簡化：按月迭代 12 次
                for (let m = 0; m < 12; m++) {
                    balance = balance * (1 + monthlyReturnRate) + _monthlyInvestment;
                }
            } else {
                balance += _monthlyInvestment * 12;
            }
            yearsToFIRE++;
        }
    }

    // 4. 計算所需月投入 (目標反推 - 20年)
    const targetYears = 20;
    const totalMonths = targetYears * 12;
    let monthlyInvestmentNeeded = 0;

    // 使用名目目標進行反推，確保數值穩定可用
    // 若需考慮通膨，僅調整最終目標金額，不影響迴圈
    const futureFireTarget = fireNumber * Math.pow(1 + inflationRate / 100, targetYears);
    const pvFuture = _currentSavings * Math.pow(1 + monthlyReturnRate, totalMonths);
    const gap = futureFireTarget - pvFuture;

    if (gap > 0) {
        if (monthlyReturnRate > 0) {
            const pmtFactor = (Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate;
            monthlyInvestmentNeeded = gap / pmtFactor;
        } else {
            monthlyInvestmentNeeded = gap / totalMonths;
        }
    }

    // 最終防呆
    if (!Number.isFinite(yearsToFIRE)) yearsToFIRE = Infinity; // 前端會處理 Infinity 顯示
    if (!Number.isFinite(monthlyInvestmentNeeded)) monthlyInvestmentNeeded = 0;

    return {
        fireNumber: Math.round(fireNumber),
        monthlyExpense: _monthlyExpense,
        annualExpense,
        safeWithdrawalRate: _safeWithdrawalRate,
        yearsToFIRE, // 這裡 yearsToFIRE 如果是 Infinity，前端需正確處理
        monthlyInvestmentNeeded: Math.round(monthlyInvestmentNeeded),
        currentProgress,
    };
}

/**
 * 目標反推計算
 * 給定目標金額和年限，計算每月需投入多少
 */
export interface GoalReverseResult {
    targetAmount: number;
    years: number;
    monthlyInvestment: number;
    totalContribution: number;
    totalInterest: number;
    effectiveReturn: number;
}

export function calculateGoalReverse(
    targetAmount: number,
    years: number,
    expectedReturn: number = 7,
    initialCapital: number = 0
): GoalReverseResult {
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = years * 12;

    // FV = PV(1+r)^n + PMT × [(1+r)^n - 1] / r
    // 求 PMT: PMT = (FV - PV(1+r)^n) × r / [(1+r)^n - 1]
    const pvFuture = initialCapital * Math.pow(1 + monthlyRate, totalMonths);
    const gap = targetAmount - pvFuture;

    let monthlyInvestment = 0;
    if (gap > 0 && monthlyRate > 0) {
        const factor = Math.pow(1 + monthlyRate, totalMonths) - 1;
        monthlyInvestment = Math.round((gap * monthlyRate) / factor);
    } else if (gap > 0) {
        monthlyInvestment = Math.round(gap / totalMonths);
    }

    const totalContribution = (monthlyInvestment * totalMonths) + initialCapital;
    const totalInterest = targetAmount - totalContribution;
    const effectiveReturn = totalContribution > 0
        ? ((targetAmount / totalContribution) - 1) * 100
        : 0;

    return {
        targetAmount,
        years,
        monthlyInvestment: Math.max(0, monthlyInvestment),
        totalContribution,
        totalInterest: Math.max(0, totalInterest),
        effectiveReturn,
    };
}

/**
 * 被動收入試算
 * 計算要達成目標被動收入需要多少本金
 */
export interface PassiveIncomeResult {
    targetMonthlyIncome: number;
    targetAnnualIncome: number;
    requiredCapital: number;
    yieldRate: number;
    // 按不同殖利率計算
    scenarios: {
        yieldRate: number;
        requiredCapital: number;
    }[];
}

export function calculatePassiveIncome(
    targetMonthlyIncome: number,
    yieldRate: number = 5
): PassiveIncomeResult {
    const targetAnnualIncome = targetMonthlyIncome * 12;
    const requiredCapital = Math.round(targetAnnualIncome / (yieldRate / 100));

    // 不同殖利率情境
    const scenarios = [3, 4, 5, 6, 7].map(rate => ({
        yieldRate: rate,
        requiredCapital: Math.round(targetAnnualIncome / (rate / 100)),
    }));

    return {
        targetMonthlyIncome,
        targetAnnualIncome,
        requiredCapital,
        yieldRate,
        scenarios,
    };
}

/**
 * 計算達成里程碑的年份
 */
export interface MilestoneResult {
    milestone: number;
    label: string;
    year: number;
    monthsToReach: number;
}

export function calculateMilestones(
    initialCapital: number,
    monthlyContribution: number,
    annualReturnRate: number
): MilestoneResult[] {
    const milestones = [
        { amount: 1000000, label: '第一個 100 萬' },
        { amount: 5000000, label: '500 萬' },
        { amount: 10000000, label: '1000 萬' },
        { amount: 30000000, label: '3000 萬' },
        { amount: 50000000, label: '5000 萬' },
        { amount: 100000000, label: '1 億' },
    ];

    const monthlyRate = annualReturnRate / 100 / 12;
    const results: MilestoneResult[] = [];

    let balance = initialCapital;
    let month = 0;
    let milestoneIndex = 0;

    // 跳過已達成的里程碑
    while (milestoneIndex < milestones.length && balance >= milestones[milestoneIndex].amount) {
        results.push({
            milestone: milestones[milestoneIndex].amount,
            label: milestones[milestoneIndex].label,
            year: 0,
            monthsToReach: 0,
        });
        milestoneIndex++;
    }

    // 計算未來里程碑
    while (milestoneIndex < milestones.length && month < 600) { // 最多 50 年
        balance = balance * (1 + monthlyRate) + monthlyContribution;
        month++;

        if (balance >= milestones[milestoneIndex].amount) {
            results.push({
                milestone: milestones[milestoneIndex].amount,
                label: milestones[milestoneIndex].label,
                year: Math.ceil(month / 12),
                monthsToReach: month,
            });
            milestoneIndex++;
        }
    }

    return results;
}

/**
 * 快速情境預設值
 */
export const QUICK_SCENARIOS = [
    {
        name: '新鮮人',
        emoji: '🎓',
        description: '月薪3萬，月存5千',
        initialCapital: 100000,
        monthlyContribution: 5000,
        years: 40,
        expectedReturn: 7,
    },
    {
        name: '上班族',
        emoji: '💼',
        description: '月薪5萬，月存1萬',
        initialCapital: 500000,
        monthlyContribution: 10000,
        years: 30,
        expectedReturn: 7,
    },
    {
        name: '高資產',
        emoji: '💎',
        description: '年投入50萬',
        initialCapital: 5000000,
        monthlyContribution: 42000,
        years: 20,
        expectedReturn: 6,
    },
    {
        name: 'FIRE 追求者',
        emoji: '🔥',
        description: '高儲蓄率衝刺',
        initialCapital: 1000000,
        monthlyContribution: 30000,
        years: 15,
        expectedReturn: 7,
    },
];
