/**
 * 資本決策與財務自由計算核心
 */

export interface SimulationParams {
    initialCapital: number;    // 初始本金
    monthlyContribution: number; // 每月投入
    annualReturnRate: number;    // 年化報酬率 (%)
    inflationRate: number;       // 通膨率 (%)
    years: number;               // 投資年期
}

export interface YearData {
    year: number;
    principal: number;          // 累計投入本金
    interest: number;           // 累計利息/收益
    totalAssets: number;        // 名目總資產 (Nominal)
    realAssets: number;         // 實質總資產 (Real, 經通膨調整)
    optimisticAssets: number;   // 樂觀情境 (+2%)
    pessimisticAssets: number;  // 悲觀情境 (-2%)
}

export interface FinancialFreedomMetrics {
    totalAssets: number;
    realAssets: number;
    monthlyPassiveIncome: number; // 基於 4% 法則的名目被動收入
    realMonthlyPassiveIncome: number; // 基於 4% 法則的實質被動收入
    yearsToFreedom: number | null; // 達到財務自由 (被動收入 > 目標月支出的年份)，null 表示未達標
}

/**
 * 計算複利增長與通膨影響 (含敏感度分析)
 */
export function calculateCapitalGrowth(params: SimulationParams): YearData[] {
    const { initialCapital, monthlyContribution, annualReturnRate, inflationRate, years } = params;

    const r = annualReturnRate / 100;
    const r_opt = (annualReturnRate + 2) / 100; // 樂觀 +2%
    const r_pest = (annualReturnRate - 2) / 100; // 悲觀 -2%
    const i = inflationRate / 100;

    const monthlyRate = r / 12;
    const monthlyRateOpt = r_opt / 12;
    const monthlyRatePest = r_pest / 12;

    let currentAssets = initialCapital;
    let currentAssetsOpt = initialCapital;
    let currentAssetsPest = initialCapital;
    let totalPrincipal = initialCapital;

    const data: YearData[] = [];

    // 第 0 年 (初始狀態)
    data.push({
        year: 0,
        principal: initialCapital,
        interest: 0,
        totalAssets: initialCapital,
        realAssets: initialCapital,
        optimisticAssets: initialCapital,
        pessimisticAssets: initialCapital
    });

    for (let year = 1; year <= years; year++) {
        // 按月複利計算
        for (let month = 1; month <= 12; month++) {
            currentAssets = currentAssets * (1 + monthlyRate) + monthlyContribution;
            currentAssetsOpt = currentAssetsOpt * (1 + monthlyRateOpt) + monthlyContribution;
            currentAssetsPest = currentAssetsPest * (1 + monthlyRatePest) + monthlyContribution;
            totalPrincipal += monthlyContribution;
        }

        // 計算折現因子 (Discount Factor)
        const discountFactor = Math.pow(1 + i, year);
        const realAssets = Math.round(currentAssets / discountFactor);

        data.push({
            year,
            principal: Math.round(totalPrincipal),
            interest: Math.round(currentAssets - totalPrincipal),
            totalAssets: Math.round(currentAssets),
            realAssets,
            optimisticAssets: Math.round(currentAssetsOpt),
            pessimisticAssets: Math.round(currentAssetsPest)
        });
    }

    return data;
}

/**
 * 財務自由指標分析
 */
export function analyzeFinancialFreedom(
    finalData: YearData,
    withdrawRate: number = 4
): Omit<FinancialFreedomMetrics, 'yearsToFreedom'> {
    const rate = withdrawRate / 100;

    return {
        totalAssets: finalData.totalAssets,
        realAssets: finalData.realAssets,
        monthlyPassiveIncome: Math.round((finalData.totalAssets * rate) / 12),
        realMonthlyPassiveIncome: Math.round((finalData.realAssets * rate) / 12)
    };
}

// ==========================================
// Extension: Calculators
// ==========================================

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
    const _monthlyExpense = monthlyExpense > 0 ? monthlyExpense : 0;
    const _currentSavings = currentSavings > 0 ? currentSavings : 0;
    const _monthlyInvestment = monthlyInvestment > 0 ? monthlyInvestment : 0;
    const _expectedReturn = expectedReturn >= 0 ? expectedReturn : 0;
    const _safeWithdrawalRate = safeWithdrawalRate > 0.1 ? safeWithdrawalRate : 4;

    const annualExpense = _monthlyExpense * 12;
    const fireNumber = annualExpense * (100 / _safeWithdrawalRate);

    let currentProgress = 0;
    if (fireNumber > 0) {
        currentProgress = (_currentSavings / fireNumber) * 100;
    }
    if (!Number.isFinite(currentProgress)) currentProgress = 0;
    currentProgress = Math.min(100, Math.max(0, currentProgress));

    let yearsToFIRE = 0;
    const monthlyReturnRate = _expectedReturn / 100 / 12;

    if (_currentSavings >= fireNumber) {
        yearsToFIRE = 0;
    } else if (_monthlyInvestment <= 0 && _currentSavings <= 0) {
        yearsToFIRE = Infinity;
    } else {
        let balance = _currentSavings;
        while (balance < fireNumber && yearsToFIRE < 100) {
            if (monthlyReturnRate > 0) {
                for (let m = 0; m < 12; m++) {
                    balance = balance * (1 + monthlyReturnRate) + _monthlyInvestment;
                }
            } else {
                balance += _monthlyInvestment * 12;
            }
            yearsToFIRE++;
        }
    }

    const targetYears = 20;
    const totalMonths = targetYears * 12;
    let monthlyInvestmentNeeded = 0;

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

    if (!Number.isFinite(yearsToFIRE)) yearsToFIRE = Infinity;
    if (!Number.isFinite(monthlyInvestmentNeeded)) monthlyInvestmentNeeded = 0;

    return {
        fireNumber: Math.round(fireNumber),
        monthlyExpense: _monthlyExpense,
        annualExpense,
        safeWithdrawalRate: _safeWithdrawalRate,
        yearsToFIRE,
        monthlyInvestmentNeeded: Math.round(monthlyInvestmentNeeded),
        currentProgress,
    };
}

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

export interface PassiveIncomeResult {
    targetMonthlyIncome: number;
    targetAnnualIncome: number;
    requiredCapital: number;
    yieldRate: number;
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

    while (milestoneIndex < milestones.length && balance >= milestones[milestoneIndex].amount) {
        results.push({
            milestone: milestones[milestoneIndex].amount,
            label: milestones[milestoneIndex].label,
            year: 0,
            monthsToReach: 0,
        });
        milestoneIndex++;
    }

    while (milestoneIndex < milestones.length && month < 600) {
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
