/**
 * 薪資計算器延伸功能 - 獨有特色
 */

import { TAIWAN_PARAMS } from '@/lib/constants';

/**
 * 加班費計算結果
 */
export interface OvertimeResult {
    hourlyWage: number;          // 時薪
    weekdayRate1: number;        // 平日加班前2小時費率 (1.34倍)
    weekdayRate2: number;        // 平日加班第3小時起費率 (1.67倍)
    restDayRate1: number;        // 休息日前2小時 (1.34倍)
    restDayRate2: number;        // 休息日3-8小時 (1.67倍)
    restDayRate3: number;        // 休息日8小時以上 (2.67倍)
    holidayRate: number;         // 國定假日加倍 (2倍+補休)

    // 計算範例結果
    weekday2hrs: number;         // 平日加班2小時
    weekday4hrs: number;         // 平日加班4小時
    restDay8hrs: number;         // 休息日加班8小時
    holidayWork: number;         // 國定假日工作8小時
}

/**
 * 加班費計算（根據勞基法）
 * @param monthlySalary - 月薪
 * @param workingDays - 每月工作天數 (預設 22)
 * @param hoursPerDay - 每日工時 (預設 8)
 */
export function calculateOvertime(
    monthlySalary: number,
    workingDays: number = 22,
    hoursPerDay: number = 8
): OvertimeResult {
    const hourlyWage = Math.round(monthlySalary / workingDays / hoursPerDay);

    // 勞基法規定費率
    const weekdayRate1 = hourlyWage * (4 / 3); // 前2小時 1.34倍
    const weekdayRate2 = hourlyWage * (5 / 3); // 第3小時起 1.67倍
    const restDayRate1 = hourlyWage * (4 / 3); // 休息日前2小時
    const restDayRate2 = hourlyWage * (5 / 3); // 休息日3-8小時
    const restDayRate3 = hourlyWage * (8 / 3); // 休息日8小時以上 2.67倍
    const holidayRate = hourlyWage * 2;         // 國定假日2倍

    // 計算範例
    const weekday2hrs = Math.round(weekdayRate1 * 2);
    const weekday4hrs = Math.round(weekdayRate1 * 2 + weekdayRate2 * 2);
    const restDay8hrs = Math.round(restDayRate1 * 2 + restDayRate2 * 6);
    const holidayWork = Math.round(holidayRate * 8);

    return {
        hourlyWage,
        weekdayRate1: Math.round(weekdayRate1),
        weekdayRate2: Math.round(weekdayRate2),
        restDayRate1: Math.round(restDayRate1),
        restDayRate2: Math.round(restDayRate2),
        restDayRate3: Math.round(restDayRate3),
        holidayRate: Math.round(holidayRate),
        weekday2hrs,
        weekday4hrs,
        restDay8hrs,
        holidayWork,
    };
}

/**
 * 年終獎金試算結果
 */
export interface BonusTaxResult {
    grossBonus: number;          // 年終總額
    taxRate: number;             // 適用稅率 (5% 單次超過給付總額)
    withholdingTax: number;      // 預扣稅款
    laborInsurance: number;      // 勞保費
    healthInsurance: number;     // 健保費
    netBonus: number;            // 實領年終
    takeHomeRate: number;        // 實領率
}

/**
 * 年終獎金試算（扣除勞健保和所得稅後）
 * @param monthlySalary - 月薪
 * @param bonusMonths - 年終月數
 */
export function calculateBonusTax(
    monthlySalary: number,
    bonusMonths: number
): BonusTaxResult {
    const grossBonus = monthlySalary * bonusMonths;

    // 超過給付總額（當月薪資+獎金）的 5% 預扣稅款
    // 簡化：如果年終超過 2 個月，假設適用 5% 預扣
    const taxRate = grossBonus >= 86001 ? 0.05 : 0;
    const withholdingTax = Math.round(grossBonus * taxRate);

    // 勞保費（假設投保級距）
    const laborRate = 0.115 * 0.2; // 普通事故 11.5%，個人負擔 20%
    const laborInsurance = Math.round(grossBonus * laborRate);

    // 健保費無需從獎金扣（健保只看月薪）
    const healthInsurance = 0;

    const netBonus = grossBonus - withholdingTax - laborInsurance - healthInsurance;
    const takeHomeRate = (netBonus / grossBonus) * 100;

    return {
        grossBonus,
        taxRate: taxRate * 100,
        withholdingTax,
        laborInsurance,
        healthInsurance,
        netBonus,
        takeHomeRate,
    };
}

/**
 * 薪資談判助手結果
 */
export interface SalaryNegotiationResult {
    currentAnnual: number;       // 現有年薪
    targetAnnual: number;        // 目標年薪
    increasePercent: number;     // 加薪幅度
    increaseAmount: number;      // 月薪增加

    // 市場比較
    marketComparison: string;    // 市場競爭力評語
    negotiationTips: string[];   // 談判建議

    // 時間價值
    hourlyValue: number;         // 時薪價值
    dayValue: number;            // 日薪價值
}

/**
 * 薪資談判助手
 * @param currentMonthly - 現有月薪
 * @param targetMonthly - 目標月薪
 * @param bonusMonths - 年終月數
 */
export function analyzeSalaryNegotiation(
    currentMonthly: number,
    targetMonthly: number,
    bonusMonths: number = 2
): SalaryNegotiationResult {
    const currentAnnual = currentMonthly * (12 + bonusMonths);
    const targetAnnual = targetMonthly * (12 + bonusMonths);
    const increasePercent = ((targetMonthly - currentMonthly) / currentMonthly) * 100;
    const increaseAmount = targetMonthly - currentMonthly;

    // 時間價值計算
    const hourlyValue = Math.round(targetMonthly / 22 / 8);
    const dayValue = Math.round(targetMonthly / 22);

    // 市場比較
    let marketComparison = '';
    if (targetMonthly < 35000) {
        marketComparison = '低於市場新鮮人起薪';
    } else if (targetMonthly < 50000) {
        marketComparison = '符合市場一般水準';
    } else if (targetMonthly < 80000) {
        marketComparison = '中高階主管水準';
    } else if (targetMonthly < 120000) {
        marketComparison = '高階主管/技術專家';
    } else {
        marketComparison = '頂尖人才水準';
    }

    // 談判建議
    const negotiationTips: string[] = [];
    if (increasePercent > 30) {
        negotiationTips.push('加薪幅度超過 30%，建議分階段談判或搭配升職');
    } else if (increasePercent > 15) {
        negotiationTips.push('加薪幅度合理，可強調績效貢獻');
    }

    if (targetMonthly >= 50000) {
        negotiationTips.push('可談判彈性工時、遠距工作等福利');
    }

    negotiationTips.push(`每月多賺 ${increaseAmount.toLocaleString()} 元 = 年多賺 ${(increaseAmount * 14).toLocaleString()} 元`);
    negotiationTips.push(`時薪價值：${hourlyValue.toLocaleString()} 元/小時`);

    return {
        currentAnnual,
        targetAnnual,
        increasePercent,
        increaseAmount,
        marketComparison,
        negotiationTips,
        hourlyValue,
        dayValue,
    };
}

/**
 * 勞權檢查結果
 */
export interface LaborRightsCheck {
    // 基本檢查
    isAboveMinimumWage: boolean;
    minimumWage: number;

    // 投保檢查
    expectedLaborGrade: number;
    expectedHealthGrade: number;
    isHighPayLowReport: boolean;

    // 權益提醒
    warnings: string[];
    tips: string[];
}

/**
 * 勞權檢查
 * @param monthlySalary - 月薪
 * @param reportedLaborGrade - 勞保投保級距（可選）
 */
export function checkLaborRights(
    monthlySalary: number,
    reportedLaborGrade?: number
): LaborRightsCheck {
    // 2025 基本工資 (Source of Truth)
    const minimumWage = TAIWAN_PARAMS.MINIMUM_WAGE; // 28590
    const isAboveMinimumWage = monthlySalary >= minimumWage;

    // 計算應投保級距
    // const laborGrades = [27470, 28800, 30300, 31800, 33300, 34800, 36300, 38200, 40100, 42000, 43900, 45800];
    const laborGrades = TAIWAN_PARAMS.LABOR_INSURANCE_TABLE.map(l => l.amount);

    let expectedLaborGrade = laborGrades[laborGrades.length - 1];
    for (const grade of laborGrades) {
        if (monthlySalary <= grade) {
            expectedLaborGrade = grade;
            break;
        }
    }

    // 健保級距與勞保相近
    const expectedHealthGrade = expectedLaborGrade;

    // 高薪低報警告
    const isHighPayLowReport = reportedLaborGrade !== undefined && reportedLaborGrade < expectedLaborGrade;

    // 警告和提示
    const warnings: string[] = [];
    const tips: string[] = [];

    if (!isAboveMinimumWage) {
        warnings.push(`⚠️ 月薪低於基本工資 ${minimumWage.toLocaleString()} 元，可能違法`);
    }

    if (isHighPayLowReport) {
        warnings.push(`⚠️ 疑似高薪低報！實領 ${monthlySalary.toLocaleString()} 但投保 ${reportedLaborGrade?.toLocaleString()}`);
        warnings.push('高薪低報會影響您的：勞保給付、失業給付、勞退金');
    }

    tips.push(`您的月薪應投保勞保級距：${expectedLaborGrade.toLocaleString()} 元`);
    tips.push('可前往勞保局 e 化服務系統查詢個人投保資料');

    if (monthlySalary >= 50000) {
        tips.push('月薪 5 萬以上建議：確認雇主是否足額提撥 6% 勞退');
    }

    return {
        isAboveMinimumWage,
        minimumWage,
        expectedLaborGrade,
        expectedHealthGrade,
        isHighPayLowReport,
        warnings,
        tips,
    };
}

/**
 * 職涯薪資成長預測
 */
export interface CareerGrowthResult {
    year: number;
    salary: number;
    annual: number;
    cumulative: number;
}

/**
 * 職涯薪資成長預測
 * @param startingSalary - 起薪
 * @param annualGrowthRate - 年增長率 (%)
 * @param years - 預測年數
 */
export function predictCareerGrowth(
    startingSalary: number,
    annualGrowthRate: number = 5,
    years: number = 10
): CareerGrowthResult[] {
    const results: CareerGrowthResult[] = [];
    let cumulative = 0;

    for (let y = 0; y <= years; y++) {
        const salary = Math.round(startingSalary * Math.pow(1 + annualGrowthRate / 100, y));
        const annual = salary * 14; // 假設年終2個月
        cumulative += annual;

        results.push({
            year: y,
            salary,
            annual,
            cumulative,
        });
    }

    return results;
}
