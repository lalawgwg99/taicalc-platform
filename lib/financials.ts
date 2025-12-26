/**
 * 資本決策核心運算庫 (Capital Decision Engine)
 * 負責處理複利增長、通膨折現與現金流模擬
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
}

export interface FinancialFreedomMetrics {
    totalAssets: number;
    realAssets: number;
    monthlyPassiveIncome: number; // 基於 4% 法則的名目被動收入
    realMonthlyPassiveIncome: number; // 基於 4% 法則的實質被動收入
    yearsToFreedom: number | null; // 達到財務自由 (被動收入 > 目標月支出的年份)，null 表示未達標
}

/**
 * 計算複利增長與通膨影響
 * 使用標準年金終值公式 (Future Value of Annuity) 的變體進行逐年迭代，以支援更靈活的圖表數據
 */
export function calculateCapitalGrowth(params: SimulationParams): YearData[] {
    const { initialCapital, monthlyContribution, annualReturnRate, inflationRate, years } = params;

    const r = annualReturnRate / 100;
    const i = inflationRate / 100;
    const monthlyRate = r / 12;

    let currentAssets = initialCapital;
    let totalPrincipal = initialCapital;
    const data: YearData[] = [];

    // 第 0 年 (初始狀態)
    data.push({
        year: 0,
        principal: initialCapital,
        interest: 0,
        totalAssets: initialCapital,
        realAssets: initialCapital
    });

    for (let year = 1; year <= years; year++) {
        // 按月複利計算
        for (let month = 1; month <= 12; month++) {
            currentAssets = currentAssets * (1 + monthlyRate) + monthlyContribution;
            totalPrincipal += monthlyContribution;
        }

        // 計算折現因子 (Discount Factor)
        // PV = FV / (1 + i)^n
        const discountFactor = Math.pow(1 + i, year);
        const realAssets = Math.round(currentAssets / discountFactor);

        data.push({
            year,
            principal: Math.round(totalPrincipal),
            interest: Math.round(currentAssets - totalPrincipal),
            totalAssets: Math.round(currentAssets),
            realAssets
        });
    }

    return data;
}

/**
 * 財務自由指標分析
 * @param finalData 模擬結果的最後一年數據
 * @param withdrawRate 提領率 (預設 4%)
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
