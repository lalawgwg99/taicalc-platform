/**
 * 轉貸試算計算邏輯
 */

/**
 * 計算月付金（本息攤還）
 */
export function calculateMonthlyPayment(
    loanAmount: number,
    annualRate: number,
    years: number
): number {
    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    if (monthlyRate === 0) {
        return Math.round(loanAmount / totalMonths);
    }

    const x = Math.pow(1 + monthlyRate, totalMonths);
    return Math.round((loanAmount * monthlyRate * x) / (x - 1));
}

/**
 * 轉貸試算結果
 */
export interface RefinanceResult {
    // 現有貸款
    currentMonthly: number;
    currentTotalPayment: number;
    currentTotalInterest: number;

    // 新貸款
    newMonthly: number;
    newTotalPayment: number;
    newTotalInterest: number;

    // 節省金額
    monthlySavings: number;
    totalSavings: number;

    // 轉貸成本
    refinanceCost: number;
    netSavings: number;

    // 回本期（月）
    breakEvenMonths: number;

    // 是否划算
    isWorthIt: boolean;
}

/**
 * 轉貸試算
 * @param currentBalance - 現有貸款餘額
 * @param currentRate - 現有利率 (%)
 * @param remainingYears - 剩餘年限
 * @param newRate - 新利率 (%)
 * @param newYears - 新貸款年限（可選，預設等於剩餘年限）
 * @param refinanceCost - 轉貸成本（手續費 + 違約金）
 */
export function calculateRefinance(
    currentBalance: number,
    currentRate: number,
    remainingYears: number,
    newRate: number,
    newYears: number = remainingYears,
    refinanceCost: number = 30000
): RefinanceResult {
    // 現有貸款計算
    const currentMonthly = calculateMonthlyPayment(currentBalance, currentRate, remainingYears);
    const currentTotalPayment = currentMonthly * remainingYears * 12;
    const currentTotalInterest = currentTotalPayment - currentBalance;

    // 新貸款計算
    const newMonthly = calculateMonthlyPayment(currentBalance, newRate, newYears);
    const newTotalPayment = newMonthly * newYears * 12;
    const newTotalInterest = newTotalPayment - currentBalance;

    // 節省金額
    const monthlySavings = currentMonthly - newMonthly;
    const totalSavings = currentTotalInterest - newTotalInterest;
    const netSavings = totalSavings - refinanceCost;

    // 回本期計算
    const breakEvenMonths = monthlySavings > 0
        ? Math.ceil(refinanceCost / monthlySavings)
        : Infinity;

    // 是否划算判斷
    const isWorthIt = netSavings > 0 && breakEvenMonths < remainingYears * 12;

    return {
        currentMonthly,
        currentTotalPayment,
        currentTotalInterest,
        newMonthly,
        newTotalPayment,
        newTotalInterest,
        monthlySavings,
        totalSavings,
        refinanceCost,
        netSavings,
        breakEvenMonths,
        isWorthIt,
    };
}

/**
 * 提前還款試算結果
 */
export interface EarlyRepaymentResult {
    // 原始還款計劃
    originalMonthly: number;
    originalTotalMonths: number;
    originalTotalInterest: number;

    // 縮短期限模式
    shortenMonths: number;
    shortenTotalInterest: number;
    shortenSavedInterest: number;
    shortenSavedYears: number;

    // 降低月付模式
    reducedMonthly: number;
    reducedTotalInterest: number;
    reducedMonthlySavings: number;
    reducedSavedInterest: number;
}

/**
 * 提前還款試算
 * @param loanBalance - 貸款餘額
 * @param annualRate - 年利率 (%)
 * @param remainingYears - 剩餘年限
 * @param extraPayment - 額外還款金額
 * @param isMonthly - 是否為每月額外還款（否則為單筆）
 */
export function calculateEarlyRepayment(
    loanBalance: number,
    annualRate: number,
    remainingYears: number,
    extraPayment: number,
    isMonthly: boolean = false
): EarlyRepaymentResult {
    const monthlyRate = annualRate / 100 / 12;
    const originalMonths = remainingYears * 12;

    // 原始還款計劃
    const originalMonthly = calculateMonthlyPayment(loanBalance, annualRate, remainingYears);
    const originalTotalPayment = originalMonthly * originalMonths;
    const originalTotalInterest = originalTotalPayment - loanBalance;

    // 新餘額（單筆還款後）
    const newBalance = isMonthly ? loanBalance : loanBalance - extraPayment;

    // 縮短期限模式：維持原月付金，計算新期限
    let shortenMonths = originalMonths;
    if (!isMonthly) {
        // 單筆還款 - 計算新期限
        if (monthlyRate > 0) {
            shortenMonths = Math.ceil(
                -Math.log(1 - (newBalance * monthlyRate) / originalMonthly) / Math.log(1 + monthlyRate)
            );
        } else {
            shortenMonths = Math.ceil(newBalance / originalMonthly);
        }
    } else {
        // 每月額外還款 - 計算新期限
        const newMonthlyPayment = originalMonthly + extraPayment;
        if (monthlyRate > 0) {
            shortenMonths = Math.ceil(
                -Math.log(1 - (loanBalance * monthlyRate) / newMonthlyPayment) / Math.log(1 + monthlyRate)
            );
        } else {
            shortenMonths = Math.ceil(loanBalance / newMonthlyPayment);
        }
    }

    shortenMonths = Math.max(1, shortenMonths);
    const shortenTotalPayment = isMonthly
        ? (originalMonthly + extraPayment) * shortenMonths
        : originalMonthly * shortenMonths;
    const shortenTotalInterest = shortenTotalPayment - (isMonthly ? loanBalance : newBalance);
    const shortenSavedInterest = originalTotalInterest - shortenTotalInterest;
    const shortenSavedYears = (originalMonths - shortenMonths) / 12;

    // 降低月付模式：維持原期限，重新計算月付金
    const reducedMonthly = calculateMonthlyPayment(newBalance, annualRate, remainingYears);
    const reducedTotalPayment = reducedMonthly * originalMonths;
    const reducedTotalInterest = reducedTotalPayment - newBalance;
    const reducedMonthlySavings = originalMonthly - reducedMonthly;
    const reducedSavedInterest = originalTotalInterest - reducedTotalInterest;

    return {
        originalMonthly,
        originalTotalMonths: originalMonths,
        originalTotalInterest,
        shortenMonths,
        shortenTotalInterest,
        shortenSavedInterest,
        shortenSavedYears,
        reducedMonthly,
        reducedTotalInterest,
        reducedMonthlySavings,
        reducedSavedInterest,
    };
}
