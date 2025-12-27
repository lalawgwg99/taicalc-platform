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
    inflationRate: number = 2.5 // 新增通膨參數
): FIREResult {
    const annualExpense = monthlyExpense * 12;
    let baseFireNumber = annualExpense * (100 / safeWithdrawalRate); // 靜態基礎目標 (今日價值)

    // 1. 計算距離 FIRE 還需幾年 (動態通膨追趕模式)
    let yearsToFIRE = 0;
    const monthlyReturnRate = expectedReturn / 100 / 12;
    // 雖然通膨是年計算，但為了精確模擬，我們攤提到月 (近似值) 或每年調整一次
    // 這裡採用每年調整一次 FIRE Target 的方式比較符合一般理解 (每年生活費調漲)

    let balance = currentSavings;
    let currentFireTarget = baseFireNumber;

    if (monthlyInvestment > 0 || balance > 0) {
        // 安全閥：設定 100 年上限防止無窮迴圈
        while (balance < currentFireTarget && yearsToFIRE < 100) {
            // 經過一年
            for (let m = 0; m < 12; m++) {
                balance = balance * (1 + monthlyReturnRate) + monthlyInvestment;
            }
            yearsToFIRE++;

            // 目標隨通膨增長 (只有尚未達成時才需要墊高目標)
            // 下一年的目標 = 今年的目標 * (1 + 通膨率)
            currentFireTarget = currentFireTarget * (1 + inflationRate / 100);
        }
    } else {
        yearsToFIRE = balance >= baseFireNumber ? 0 : Infinity;
    }

    const currentProgress = (currentSavings / baseFireNumber) * 100; // 進度仍以 "目前本金 vs 目前門檻" 顯示較直觀，或者可改顯示 "目前本金 vs 動態目標"

    // 2. 計算要在 N 年內達成 FIRE 需要每月投入多少 (目標反推)
    // 這是一個「幾何級數支付增長」或「目標終值膨脹」的問題
    // 簡易算法：FV_Target = PV_Target * (1+i)^n
    // 我們要讓 PV_Assets * (1+r)^n + PMT * FV_Factor = Base_Fire * (1+i)^n

    const targetYears = 20;
    const totalMonths = targetYears * 12;

    // N 年後的 FIRE 目標 (名目金額)
    const futureFireTarget = baseFireNumber * Math.pow(1 + inflationRate / 100, targetYears);

    // 現有本金 N 年後的終值
    const pvFuture = currentSavings * Math.pow(1 + monthlyReturnRate, totalMonths);

    // 缺口
    const gap = futureFireTarget - pvFuture;

    // PMT 計算 (年金終值公式反推)
    const pmtFactor = (Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate;

    const monthlyInvestmentNeeded = gap > 0
        ? Math.round(gap / pmtFactor)
        : 0;

    return {
        fireNumber: Math.round(baseFireNumber), // 回傳基礎目標供前端顯示 "目前" 門檻
        monthlyExpense,
        annualExpense,
        safeWithdrawalRate,
        yearsToFIRE: balance >= currentFireTarget ? yearsToFIRE : (yearsToFIRE >= 100 ? Infinity : yearsToFIRE),
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
