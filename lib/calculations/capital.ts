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
    safeWithdrawalRate: number = 4
): FIREResult {
    const annualExpense = monthlyExpense * 12;
    const fireNumber = annualExpense * (100 / safeWithdrawalRate); // Rule of 25 when rate = 4%

    const currentProgress = (currentSavings / fireNumber) * 100;

    // 計算距離 FIRE 還需幾年
    let yearsToFIRE = 0;
    if (monthlyInvestment > 0) {
        const monthlyRate = expectedReturn / 100 / 12;
        let balance = currentSavings;
        while (balance < fireNumber && yearsToFIRE < 100) {
            for (let m = 0; m < 12; m++) {
                balance = balance * (1 + monthlyRate) + monthlyInvestment;
            }
            yearsToFIRE++;
        }
    } else {
        yearsToFIRE = currentSavings >= fireNumber ? 0 : Infinity;
    }

    // 計算要在 N 年內達成 FIRE 需要每月投入多少
    const targetYears = 20; // 假設目標 20 年
    const monthlyRate = expectedReturn / 100 / 12;
    const totalMonths = targetYears * 12;
    const gap = fireNumber - currentSavings * Math.pow(1 + monthlyRate, totalMonths);
    const monthlyInvestmentNeeded = gap > 0
        ? Math.round(gap * monthlyRate / (Math.pow(1 + monthlyRate, totalMonths) - 1))
        : 0;

    return {
        fireNumber: Math.round(fireNumber),
        monthlyExpense,
        annualExpense,
        safeWithdrawalRate,
        yearsToFIRE,
        monthlyInvestmentNeeded: Math.max(0, monthlyInvestmentNeeded),
        currentProgress: Math.min(100, currentProgress),
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
