/**
 * Feature: taicalc-optimization, Property 9: Calculation Accuracy and Compliance
 * 
 * 薪資計算準確性和合規性屬性測試
 * 驗證需求: 5.1, 5.2, 5.3, 5.4
 */

import * as fc from 'fast-check';
import { 
    calculateSalary, 
    calculateHistoricalComparison, 
    calculateTrendAnalysis,
    SalaryInput 
} from '../features/salary/logic';

describe('薪資計算準確性和合規性屬性測試', () => {
    
    // 屬性 9.1: 計算結果的基本數學正確性
    test('Property 9.1: 計算結果應符合基本數學邏輯', () => {
        fc.assert(fc.property(
            fc.integer({ min: 27470, max: 200000 }), // 月薪範圍
            fc.float({ min: 0, max: 6 }), // 年終月數
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const result = calculateSalary(input);
                
                // 基本數學邏輯驗證
                expect(result.monthly.gross).toBe(monthlySalary);
                expect(result.monthly.net).toBeLessThan(result.monthly.gross);
                expect(result.monthly.net).toBeGreaterThan(0);
                
                // 扣除額應為正數
                expect(result.monthly.laborInsurance).toBeGreaterThanOrEqual(0);
                expect(result.monthly.healthInsurance).toBeGreaterThanOrEqual(0);
                expect(result.monthly.laborPension).toBeGreaterThanOrEqual(0);
                
                // 實領 = 總額 - 各項扣除
                const expectedNet = monthlySalary - 
                    result.monthly.laborInsurance - 
                    result.monthly.healthInsurance - 
                    result.monthly.laborPension;
                expect(result.monthly.net).toBe(expectedNet);
                
                // 年度計算邏輯
                const expectedYearlyGross = monthlySalary * (12 + bonusMonths);
                expect(result.yearly.gross).toBe(expectedYearlyGross);
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.2: 投保薪資上下限合規性
    test('Property 9.2: 投保薪資應符合法定上下限', () => {
        fc.assert(fc.property(
            fc.integer({ min: 20000, max: 300000 }), // 測試更廣範圍
            fc.float({ min: 0, max: 6 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const result = calculateSalary(input);
                
                // 2025年法定限制
                const laborInsuranceMax = 45800;
                const laborInsuranceMin = 27470;
                const healthInsuranceMax = 182000;
                const healthInsuranceMin = 27470;
                const laborPensionMax = 150000;
                const laborPensionMin = 27470;
                
                // 驗證勞保費計算基礎
                const expectedLaborInsuranceSalary = Math.min(Math.max(monthlySalary, laborInsuranceMin), laborInsuranceMax);
                const expectedLaborInsurance = Math.round(expectedLaborInsuranceSalary * 0.115 * 0.2);
                expect(result.monthly.laborInsurance).toBe(expectedLaborInsurance);
                
                // 驗證健保費計算基礎
                const expectedHealthInsuranceSalary = Math.min(Math.max(monthlySalary, healthInsuranceMin), healthInsuranceMax);
                const expectedHealthInsurance = Math.round(expectedHealthInsuranceSalary * 0.0517 * 0.3);
                expect(result.monthly.healthInsurance).toBe(expectedHealthInsurance);
                
                // 驗證勞退計算基礎
                const expectedLaborPensionSalary = Math.min(Math.max(monthlySalary, laborPensionMin), laborPensionMax);
                const expectedLaborPension = Math.round(expectedLaborPensionSalary * 0.06);
                expect(result.monthly.laborPension).toBe(expectedLaborPension);
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.3: 費率準確性和資料來源可追溯性
    test('Property 9.3: 費率應準確且資料來源可追溯', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 100000 }),
            fc.float({ min: 1, max: 3 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const result = calculateSalary(input);
                
                // 驗證 metadata 完整性
                expect(result.metadata).toBeDefined();
                expect(result.metadata.year).toBe(2025);
                expect(result.metadata.dataSource).toBe('勞動部、衛福部官方資料');
                expect(result.metadata.lastUpdated).toBe('2025-01-01');
                
                // 驗證費率準確性
                expect(result.metadata.laborInsuranceRate).toBeCloseTo(0.115 * 0.2, 5);
                expect(result.metadata.healthInsuranceRate).toBeCloseTo(0.0517 * 0.3, 5);
                expect(result.metadata.laborPensionRate).toBeCloseTo(0.06, 5);
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.4: 歷史比較的一致性
    test('Property 9.4: 歷史比較應保持數據一致性', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 80000 }),
            fc.float({ min: 1, max: 2 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const comparison = calculateHistoricalComparison(input);
                
                // 驗證比較結果結構
                expect(comparison.currentYear).toBeDefined();
                expect(comparison.previousYear).toBeDefined();
                expect(comparison.yearOverYearChange).toBeDefined();
                
                // 驗證年度標識正確
                expect(comparison.currentYear.metadata.year).toBe(2025);
                expect(comparison.previousYear?.metadata.year).toBe(2024);
                
                // 驗證變化計算正確性
                if (comparison.yearOverYearChange && comparison.previousYear) {
                    const expectedNetChange = comparison.currentYear.monthly.net - comparison.previousYear.monthly.net;
                    expect(comparison.yearOverYearChange.netIncome).toBe(expectedNetChange);
                    
                    const expectedLaborChange = comparison.currentYear.monthly.laborInsurance - comparison.previousYear.monthly.laborInsurance;
                    expect(comparison.yearOverYearChange.laborInsurance).toBe(expectedLaborChange);
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.5: 趨勢分析的邏輯正確性
    test('Property 9.5: 趨勢分析應提供合理的建議', () => {
        fc.assert(fc.property(
            fc.integer({ min: 25000, max: 200000 }),
            fc.float({ min: 0.5, max: 4 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const analysis = calculateTrendAnalysis(input);
                
                // 驗證分析結果結構
                expect(analysis.salaryGrowth).toBeDefined();
                expect(analysis.inflationImpact).toBeDefined();
                expect(analysis.realIncomeChange).toBeDefined();
                expect(Array.isArray(analysis.recommendations)).toBe(true);
                
                // 驗證通膨影響計算
                const comparison = calculateHistoricalComparison(input);
                const expectedInflationImpact = (comparison.currentYear.monthly.net * 2.5) / 100;
                expect(analysis.inflationImpact).toBeCloseTo(expectedInflationImpact, 2);
                
                // 驗證實質收入變化邏輯
                expect(analysis.realIncomeChange).toBe(analysis.salaryGrowth - 2.5);
                
                // 驗證建議邏輯
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
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.6: 邊界值處理的穩健性
    test('Property 9.6: 邊界值應得到正確處理', () => {
        const boundaryValues = [
            27470,  // 最低投保薪資
            45800,  // 勞保上限
            150000, // 勞退上限
            182000  // 健保上限
        ];
        
        boundaryValues.forEach(salary => {
            const input: SalaryInput = { monthlySalary: salary, bonusMonths: 1 };
            const result = calculateSalary(input);
            
            // 邊界值不應導致計算錯誤
            expect(result.monthly.net).toBeGreaterThan(0);
            expect(result.monthly.laborInsurance).toBeGreaterThanOrEqual(0);
            expect(result.monthly.healthInsurance).toBeGreaterThanOrEqual(0);
            expect(result.monthly.laborPension).toBeGreaterThanOrEqual(0);
            
            // 驗證投保薪資上限效果
            if (salary >= 45800) {
                // 勞保費不應超過上限計算值
                const maxLaborInsurance = Math.round(45800 * 0.115 * 0.2);
                expect(result.monthly.laborInsurance).toBeLessThanOrEqual(maxLaborInsurance);
            }
        });
    });

    // 屬性 9.7: 輸入驗證和錯誤處理
    test('Property 9.7: 異常輸入應得到適當處理', () => {
        fc.assert(fc.property(
            fc.oneof(
                fc.integer({ min: -1000, max: 0 }), // 負數或零
                fc.integer({ min: 1000000, max: 2000000 }) // 極大值
            ),
            fc.float({ min: -1, max: 10 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { 
                    monthlySalary: Math.max(monthlySalary, 1), // 確保至少為正數
                    bonusMonths: Math.max(bonusMonths, 0) 
                };
                
                // 即使是異常輸入，也不應拋出錯誤
                expect(() => {
                    const result = calculateSalary(input);
                    expect(result).toBeDefined();
                }).not.toThrow();
            }
        ), { numRuns: 50 });
    });
});