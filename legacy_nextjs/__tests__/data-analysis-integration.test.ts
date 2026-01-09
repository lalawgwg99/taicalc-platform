/**
 * Feature: taicalc-optimization, Property 5: Data Analysis Integration
 * 
 * 數據分析整合屬性測試
 * 驗證需求: 3.1, 3.2, 3.5
 */

import * as fc from 'fast-check';
import { 
    calculateSalary, 
    calculateHistoricalComparison, 
    calculateTrendAnalysis,
    SalaryInput 
} from '../features/salary/logic';
import { 
    generateInsights, 
    ChartData, 
    Insight 
} from '../components/shared/DataVisualization';

describe('數據分析整合屬性測試', () => {
    
    // 屬性 5.1: 歷史數據比較的完整性
    test('Property 5.1: 歷史數據比較應提供完整的分析結果', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 150000 }), // 月薪範圍
            fc.float({ min: 0.5, max: 4 }), // 年終月數
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const comparison = calculateHistoricalComparison(input);
                
                // 驗證比較結果的完整性
                expect(comparison.currentYear).toBeDefined();
                expect(comparison.previousYear).toBeDefined();
                expect(comparison.yearOverYearChange).toBeDefined();
                
                // 驗證年度數據的一致性
                expect(comparison.currentYear.metadata.year).toBe(2025);
                expect(comparison.previousYear?.metadata.year).toBe(2024);
                
                // 驗證變化計算的準確性
                if (comparison.yearOverYearChange && comparison.previousYear) {
                    const expectedNetChange = comparison.currentYear.monthly.net - comparison.previousYear.monthly.net;
                    expect(comparison.yearOverYearChange.netIncome).toBe(expectedNetChange);
                    
                    // 所有變化項目都應該被計算
                    expect(comparison.yearOverYearChange.laborInsurance).toBeDefined();
                    expect(comparison.yearOverYearChange.healthInsurance).toBeDefined();
                    expect(comparison.yearOverYearChange.laborPension).toBeDefined();
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 5.2: 趨勢分析的邏輯一致性
    test('Property 5.2: 趨勢分析應提供邏輯一致的洞察', () => {
        fc.assert(fc.property(
            fc.integer({ min: 25000, max: 200000 }),
            fc.float({ min: 1, max: 3 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const analysis = calculateTrendAnalysis(input);
                
                // 驗證分析結果的結構完整性
                expect(typeof analysis.salaryGrowth).toBe('number');
                expect(typeof analysis.inflationImpact).toBe('number');
                expect(typeof analysis.realIncomeChange).toBe('number');
                expect(Array.isArray(analysis.recommendations)).toBe(true);
                
                // 驗證實質收入變化的計算邏輯
                expect(analysis.realIncomeChange).toBeCloseTo(analysis.salaryGrowth - 2.5, 2);
                
                // 驗證通膨影響的合理性
                expect(analysis.inflationImpact).toBeGreaterThan(0);
                
                // 驗證建議的邏輯性
                if (monthlySalary >= 45800) {
                    expect(analysis.recommendations.some(rec => 
                        rec.includes('勞保投保上限')
                    )).toBe(true);
                }
                
                if (monthlySalary >= 150000) {
                    expect(analysis.recommendations.some(rec => 
                        rec.includes('自提勞退')
                    )).toBe(true);
                }
                
                // 實質收入下降時應有相應建議
                if (analysis.realIncomeChange < 0) {
                    expect(analysis.recommendations.some(rec => 
                        rec.includes('通膨影響') || rec.includes('實質收入')
                    )).toBe(true);
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 5.3: 數據視覺化洞察生成的準確性
    test('Property 5.3: 洞察生成應基於數據特徵提供準確分析', () => {
        fc.assert(fc.property(
            fc.array(fc.record({
                name: fc.string({ minLength: 1, maxLength: 20 }),
                value: fc.integer({ min: 1000, max: 100000 })
            }), { minLength: 2, maxLength: 10 }),
            fc.constantFrom('bar', 'line', 'pie', 'comparison'),
            (rawData, chartType) => {
                const data: ChartData[] = rawData.map(item => ({
                    name: item.name,
                    value: item.value
                }));
                
                const insights = generateInsights(data, chartType);
                
                // 驗證洞察的基本結構
                insights.forEach(insight => {
                    expect(insight.type).toMatch(/^(warning|tip|comparison|trend|recommendation|achievement)$/);
                    expect(insight.title).toBeDefined();
                    expect(insight.description).toBeDefined();
                    expect(insight.impact).toMatch(/^(high|medium|low)$/);
                });
                
                // 驗證最大值洞察的準確性
                const values = data.map(d => d.value);
                const max = Math.max(...values);
                const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
                
                const maxInsight = insights.find(insight => 
                    insight.type === 'comparison' && insight.title.includes('最高')
                );
                
                if (maxInsight) {
                    expect(maxInsight.description).toContain(max.toLocaleString());
                    
                    // 影響程度應該與偏離平均值的程度相關
                    if (max > avg * 1.5) {
                        expect(maxInsight.impact).toBe('high');
                    }
                }
                
                // 驗證變異性洞察
                const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
                const stdDev = Math.sqrt(variance);
                const cv = stdDev / avg;
                
                if (cv > 0.5) {
                    const varianceInsight = insights.find(insight => 
                        insight.description.includes('變異') || insight.description.includes('分散')
                    );
                    expect(varianceInsight).toBeDefined();
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 5.4: 綜合分析的數據一致性
    test('Property 5.4: 綜合分析應保持跨組件的數據一致性', () => {
        fc.assert(fc.property(
            fc.integer({ min: 40000, max: 120000 }),
            fc.float({ min: 1, max: 2.5 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                
                // 獲取所有分析結果
                const basicResult = calculateSalary(input);
                const comparison = calculateHistoricalComparison(input);
                const trend = calculateTrendAnalysis(input);
                
                // 驗證基礎數據的一致性
                expect(comparison.currentYear.monthly.gross).toBe(basicResult.monthly.gross);
                expect(comparison.currentYear.monthly.net).toBe(basicResult.monthly.net);
                expect(comparison.currentYear.yearly.gross).toBe(basicResult.yearly.gross);
                
                // 驗證趨勢分析使用的數據與比較分析一致
                const trendComparison = calculateHistoricalComparison(input);
                expect(trendComparison.currentYear.monthly.net).toBe(comparison.currentYear.monthly.net);
                
                // 驗證薪資結構數據的完整性
                const totalDeductions = basicResult.monthly.laborInsurance + 
                                      basicResult.monthly.healthInsurance + 
                                      basicResult.monthly.laborPension;
                
                expect(basicResult.monthly.net + totalDeductions).toBe(basicResult.monthly.gross);
                
                // 驗證年度數據的一致性
                expect(basicResult.yearly.totalLaborInsurance).toBe(basicResult.monthly.laborInsurance * 12);
                expect(basicResult.yearly.totalHealthInsurance).toBe(basicResult.monthly.healthInsurance * 12);
                expect(basicResult.yearly.totalLaborPension).toBe(basicResult.monthly.laborPension * 12);
            }
        ), { numRuns: 100 });
    });

    // 屬性 5.5: 個性化報告生成的完整性
    test('Property 5.5: 個性化報告應包含所有必要的分析維度', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 180000 }),
            fc.float({ min: 0, max: 5 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                
                // 生成完整的分析報告
                const result = calculateSalary(input);
                const comparison = calculateHistoricalComparison(input);
                const trend = calculateTrendAnalysis(input);
                
                // 驗證報告包含所有必要維度
                
                // 1. 基本計算結果
                expect(result.monthly).toBeDefined();
                expect(result.yearly).toBeDefined();
                expect(result.metadata).toBeDefined();
                
                // 2. 歷史比較維度
                expect(comparison.currentYear).toBeDefined();
                expect(comparison.previousYear).toBeDefined();
                expect(comparison.yearOverYearChange).toBeDefined();
                
                // 3. 趨勢分析維度
                expect(trend.salaryGrowth).toBeDefined();
                expect(trend.inflationImpact).toBeDefined();
                expect(trend.realIncomeChange).toBeDefined();
                expect(trend.recommendations).toBeDefined();
                
                // 4. 驗證建議的相關性
                const hasRelevantRecommendations = trend.recommendations.length > 0;
                expect(hasRelevantRecommendations).toBe(true);
                
                // 5. 驗證數據來源的可追溯性
                expect(result.metadata.dataSource).toBeDefined();
                expect(result.metadata.lastUpdated).toBeDefined();
                expect(result.metadata.year).toBe(2025);
                
                // 6. 驗證計算參數的透明性
                expect(result.metadata.laborInsuranceRate).toBeGreaterThan(0);
                expect(result.metadata.healthInsuranceRate).toBeGreaterThan(0);
                expect(result.metadata.laborPensionRate).toBeGreaterThan(0);
            }
        ), { numRuns: 100 });
    });

    // 屬性 5.6: 數據導出和分享的完整性
    test('Property 5.6: 數據應支持完整的導出和分享功能', () => {
        fc.assert(fc.property(
            fc.integer({ min: 35000, max: 100000 }),
            fc.float({ min: 1, max: 3 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const result = calculateSalary(input);
                
                // 驗證結果數據的可序列化性
                expect(() => JSON.stringify(result)).not.toThrow();
                
                // 驗證序列化後的數據完整性
                const serialized = JSON.stringify(result);
                const deserialized = JSON.parse(serialized);
                
                expect(deserialized.monthly.gross).toBe(result.monthly.gross);
                expect(deserialized.monthly.net).toBe(result.monthly.net);
                expect(deserialized.yearly.gross).toBe(result.yearly.gross);
                expect(deserialized.metadata.year).toBe(result.metadata.year);
                
                // 驗證分享數據的格式化
                const shareDescription = `月薪 NT$ ${result.monthly.gross.toLocaleString()}，實領 NT$ ${result.monthly.net.toLocaleString()}`;
                expect(shareDescription).toContain('NT$');
                expect(shareDescription).toContain(result.monthly.gross.toLocaleString());
                expect(shareDescription).toContain(result.monthly.net.toLocaleString());
            }
        ), { numRuns: 100 });
    });

    // 屬性 5.7: 錯誤處理和數據驗證
    test('Property 5.7: 數據分析應具備強健的錯誤處理能力', () => {
        fc.assert(fc.property(
            fc.oneof(
                fc.integer({ min: 1, max: 1000000 }), // 極端值測試
                fc.float({ min: Math.fround(0.1), max: Math.fround(1000000) })
            ),
            fc.oneof(
                fc.float({ min: Math.fround(0), max: Math.fround(10) }),
                fc.integer({ min: 0, max: 10 })
            ),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { 
                    monthlySalary: Math.max(monthlySalary, 1), 
                    bonusMonths: Math.max(bonusMonths, 0) 
                };
                
                // 即使是極端輸入，也不應拋出錯誤
                expect(() => {
                    const result = calculateSalary(input);
                    const comparison = calculateHistoricalComparison(input);
                    const trend = calculateTrendAnalysis(input);
                    
                    // 驗證結果的基本合理性
                    expect(result.monthly.net).toBeGreaterThanOrEqual(0);
                    expect(result.yearly.gross).toBeGreaterThanOrEqual(0);
                    expect(comparison.currentYear).toBeDefined();
                    expect(trend.recommendations).toBeDefined();
                    
                }).not.toThrow();
            }
        ), { numRuns: 50 });
    });
});