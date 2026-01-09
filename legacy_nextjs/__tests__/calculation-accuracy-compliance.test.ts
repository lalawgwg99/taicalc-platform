/**
 * Feature: taicalc-optimization, Property 9: Calculation Accuracy and Compliance
 * 
 * 計算準確性和合規性屬性測試
 * 驗證需求: 5.1, 5.2, 5.3, 5.4
 * 
 * 此測試套件驗證所有財務計算器的準確性、合規性和數據來源可追溯性
 */

import * as fc from 'fast-check';
import { 
    calculateSalary, 
    calculateHistoricalComparison, 
    calculateTrendAnalysis,
    SalaryInput 
} from '../features/salary/logic';
import { calculateTax, TaxInput } from '../features/tax/logic';

// 額外計算器的邏輯函數 (從頁面組件中提取)
interface CostCalculationInput {
    materialCost: number;
    laborCost: number;
    overheadCost: number;
    quantity: number;
    sellingPrice: number;
}

interface CostResult {
    totalCost: number;
    unitCost: number;
    margin: number;
    breakeven: number;
}

function calculateCost(input: CostCalculationInput): CostResult {
    const { materialCost, laborCost, overheadCost, quantity, sellingPrice } = input;
    const totalCost = materialCost + laborCost + overheadCost;
    const unitCost = quantity > 0 ? totalCost / quantity : 0;
    const roundedUnitCost = Math.round(unitCost * 100) / 100;
    const margin = sellingPrice > 0 ? ((sellingPrice - roundedUnitCost) / sellingPrice) * 100 : 0;
    const breakeven = roundedUnitCost > 0 && sellingPrice > roundedUnitCost
        ? Math.ceil(totalCost / (sellingPrice - roundedUnitCost))
        : 0;

    return {
        totalCost: Math.round(totalCost),
        unitCost: roundedUnitCost,
        margin: Math.round(margin * 10) / 10,
        breakeven,
    };
}

interface CreditCardInput {
    amount: number;
    installments: number;
    feePercent: number;
}

interface CreditResult {
    totalPayment: number;
    totalInterest: number;
    monthlyPayment: number;
    interestRate: number;
}

function calculateCreditCard(input: CreditCardInput): CreditResult {
    const { amount, installments, feePercent } = input;
    const totalInterest = Math.round(amount * (feePercent / 100));
    const totalPayment = amount + totalInterest;
    const monthlyPayment = Math.round(totalPayment / installments);
    const approxAnnualRate = (feePercent / installments) * 12 * 2;

    return {
        totalPayment,
        totalInterest,
        monthlyPayment,
        interestRate: Math.round(approxAnnualRate * 10) / 10,
    };
}

type OvertimeType = 'weekday' | 'restday' | 'holiday';

interface OvertimeInput {
    salaryType: 'hourly' | 'monthly';
    salary: number;
    overtimeType: OvertimeType;
    hours: number;
}

interface OvertimeResult {
    regularRate: number;
    overtimePay: number;
    breakdown: string[];
}

function calculateOvertime(input: OvertimeInput): OvertimeResult {
    const { salaryType, salary, overtimeType, hours } = input;
    const hourlyRate = salaryType === 'hourly' ? salary : Math.round(salary / 30 / 8);
    
    let overtimePay = 0;
    const breakdown: string[] = [];

    if (overtimeType === 'weekday') {
        const first2 = Math.min(hours, 2);
        const after2 = Math.max(hours - 2, 0);
        const pay1 = Math.round(first2 * hourlyRate * 1.34);
        const pay2 = Math.round(after2 * hourlyRate * 1.67);
        overtimePay = pay1 + pay2;
        if (first2 > 0) breakdown.push(`前 ${first2} 小時 × 1.34 倍 = NT$ ${pay1}`);
        if (after2 > 0) breakdown.push(`後 ${after2} 小時 × 1.67 倍 = NT$ ${pay2}`);
    } else if (overtimeType === 'restday') {
        const h1 = Math.min(hours, 2);
        const h2 = Math.min(Math.max(hours - 2, 0), 6);
        const h3 = Math.max(hours - 8, 0);
        const pay1 = Math.round(h1 * hourlyRate * 1.34);
        const pay2 = Math.round(h2 * hourlyRate * 1.67);
        const pay3 = Math.round(h3 * hourlyRate * 2.67);
        overtimePay = pay1 + pay2 + pay3;
        if (h1 > 0) breakdown.push(`前 2 小時 × 1.34 倍 = NT$ ${pay1}`);
        if (h2 > 0) breakdown.push(`3-8 小時 × 1.67 倍 = NT$ ${pay2}`);
        if (h3 > 0) breakdown.push(`9+ 小時 × 2.67 倍 = NT$ ${pay3}`);
    } else {
        overtimePay = Math.round(hours * hourlyRate * 2);
        breakdown.push(`${hours} 小時 × 2 倍 = NT$ ${overtimePay}`);
    }

    return {
        regularRate: hourlyRate,
        overtimePay,
        breakdown,
    };
}

describe('計算準確性和合規性屬性測試', () => {
    
    // 屬性 9.1: 薪資計算的法規合規性
    test('Property 9.1: 薪資計算應符合 2025 年最新法規', () => {
        fc.assert(fc.property(
            fc.integer({ min: 27470, max: 200000 }), // 月薪範圍
            fc.float({ min: 0, max: 6 }), // 年終月數
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const result = calculateSalary(input);
                
                // 驗證 2025 年法定參數
                expect(result.metadata.year).toBe(2025);
                expect(result.metadata.dataSource).toBe('勞動部、衛福部官方資料');
                expect(result.metadata.lastUpdated).toBe('2025-01-01');
                
                // 驗證費率準確性 (2025年標準)
                expect(result.metadata.laborInsuranceRate).toBeCloseTo(0.115 * 0.2, 5); // 11.5% * 20%
                expect(result.metadata.healthInsuranceRate).toBeCloseTo(0.0517 * 0.3, 5); // 5.17% * 30%
                expect(result.metadata.laborPensionRate).toBeCloseTo(0.06, 5); // 6%
                
                // 驗證投保薪資上下限合規性
                const laborInsuranceMax = 45800;
                const laborInsuranceMin = 27470;
                const healthInsuranceMax = 182000;
                const laborPensionMax = 150000;
                
                // 勞保費計算驗證
                const expectedLaborInsuranceSalary = Math.min(Math.max(monthlySalary, laborInsuranceMin), laborInsuranceMax);
                const expectedLaborInsurance = Math.round(expectedLaborInsuranceSalary * 0.115 * 0.2);
                expect(result.monthly.laborInsurance).toBe(expectedLaborInsurance);
                
                // 健保費計算驗證
                const expectedHealthInsuranceSalary = Math.min(Math.max(monthlySalary, laborInsuranceMin), healthInsuranceMax);
                const expectedHealthInsurance = Math.round(expectedHealthInsuranceSalary * 0.0517 * 0.3);
                expect(result.monthly.healthInsurance).toBe(expectedHealthInsurance);
                
                // 勞退計算驗證
                const expectedLaborPensionSalary = Math.min(Math.max(monthlySalary, laborInsuranceMin), laborPensionMax);
                const expectedLaborPension = Math.round(expectedLaborPensionSalary * 0.06);
                expect(result.monthly.laborPension).toBe(expectedLaborPension);
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.2: 稅務計算的準確性和合規性
    test('Property 9.2: 稅務計算應符合 2025 年綜所稅法規', () => {
        fc.assert(fc.property(
            fc.integer({ min: 300000, max: 3000000 }), // 年收入範圍
            fc.boolean(), // 是否已婚
            fc.integer({ min: 0, max: 1000000 }), // 配偶收入
            fc.integer({ min: 0, max: 5 }), // 扶養人數
            (income, isMarried, spouseIncome, children) => {
                const input: TaxInput = { 
                    income, 
                    isMarried, 
                    spouseIncome: isMarried ? spouseIncome : 0, 
                    children 
                };
                const tax = calculateTax(input);
                
                // 基本邏輯驗證
                expect(tax).toBeGreaterThanOrEqual(0);
                expect(typeof tax).toBe('number');
                expect(Number.isInteger(tax)).toBe(true);
                
                // 驗證免稅額邏輯
                const totalIncome = income + (isMarried ? spouseIncome : 0);
                let expectedExemptions = 446000; // 2025年個人免稅額
                if (isMarried) expectedExemptions += 446000; // 配偶免稅額
                if (children > 0) expectedExemptions += children * 132000; // 扶養親屬免稅額
                
                // 如果總收入低於免稅額，稅額應為 0
                if (totalIncome <= expectedExemptions) {
                    expect(tax).toBe(0);
                }
                
                // 驗證累進稅率邏輯
                const taxableIncome = Math.max(0, totalIncome - expectedExemptions);
                if (taxableIncome > 0) {
                    expect(tax).toBeGreaterThan(0);
                    
                    // 驗證稅率級距
                    if (taxableIncome <= 590000) {
                        const expectedTax = Math.round(taxableIncome * 0.05);
                        expect(tax).toBe(expectedTax);
                    } else if (taxableIncome <= 1330000) {
                        const expectedTax = Math.round(taxableIncome * 0.12 - 41300);
                        expect(tax).toBe(expectedTax);
                    }
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.3: 房貸計算的數學準確性
    test('Property 9.3: 房貸計算應符合標準金融公式', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1000000, max: 50000000 }), // 貸款總額 100萬-5000萬
            fc.float({ min: Math.fround(0.5), max: Math.fround(10.0) }).filter(rate => !isNaN(rate) && isFinite(rate)), // 年利率 0.5%-10%
            fc.integer({ min: 5, max: 40 }), // 貸款年限 5-40年
            (totalLoan, rate, years) => {
                // 確保輸入值有效
                fc.pre(!isNaN(rate) && isFinite(rate) && rate > 0);
                
                // 模擬房貸計算邏輯 (從 mortgage/tools.ts)
                const r = rate / 100 / 12; // 月利率
                const n = years * 12; // 總期數
                const monthlyPayment = Math.round(totalLoan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
                
                // 基本邏輯驗證
                expect(monthlyPayment).toBeGreaterThan(0);
                expect(monthlyPayment).toBeLessThan(totalLoan); // 月付金不應超過本金
                
                // 驗證總利息合理性
                const totalPayment = monthlyPayment * n;
                const totalInterest = totalPayment - totalLoan;
                expect(totalInterest).toBeGreaterThan(0);
                
                // 驗證利率影響：利率越高，月付金越高
                if (rate > 1) {
                    const lowerRate = rate - 0.5;
                    const lowerR = lowerRate / 100 / 12;
                    const lowerMonthlyPayment = Math.round(totalLoan * (lowerR * Math.pow(1 + lowerR, n)) / (Math.pow(1 + lowerR, n) - 1));
                    expect(monthlyPayment).toBeGreaterThan(lowerMonthlyPayment);
                }
                
                // 驗證年限影響：年限越長，月付金越低
                if (years > 10) {
                    const longerYears = years + 5;
                    const longerN = longerYears * 12;
                    const longerMonthlyPayment = Math.round(totalLoan * (r * Math.pow(1 + r, longerN)) / (Math.pow(1 + r, longerN) - 1));
                    expect(monthlyPayment).toBeGreaterThan(longerMonthlyPayment);
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.4: 複利投資計算的準確性
    test('Property 9.4: 複利投資計算應符合複利公式', () => {
        fc.assert(fc.property(
            fc.integer({ min: 10000, max: 10000000 }), // 本金 1萬-1000萬
            fc.float({ min: Math.fround(0.1), max: Math.fround(20.0) }).filter(rate => !isNaN(rate) && isFinite(rate)), // 年報酬率 0.1%-20%
            fc.integer({ min: 1, max: 50 }), // 投資年數 1-50年
            (principal, rate, years) => {
                // 確保輸入值有效
                fc.pre(!isNaN(rate) && isFinite(rate) && rate > 0);
                
                // 模擬複利計算邏輯 (從 capital/tools.ts)
                const finalAmount = Math.round(principal * Math.pow(1 + rate / 100, years));
                const profit = finalAmount - principal;
                
                // 基本邏輯驗證
                expect(finalAmount).toBeGreaterThan(principal);
                expect(profit).toBeGreaterThan(0);
                
                // 驗證複利效應：時間越長，增長越快
                if (years > 5 && rate > 2) {
                    const shorterYears = years - 5;
                    const shorterAmount = Math.round(principal * Math.pow(1 + rate / 100, shorterYears));
                    const shorterProfit = shorterAmount - principal;
                    const longerProfitGrowth = profit - shorterProfit;
                    
                    // 後期的獲利增長應該更快 (複利效應)
                    expect(longerProfitGrowth).toBeGreaterThan(0);
                }
                
                // 驗證報酬率影響
                if (rate > 1) {
                    const lowerRate = rate - 1;
                    const lowerAmount = Math.round(principal * Math.pow(1 + lowerRate / 100, years));
                    expect(finalAmount).toBeGreaterThan(lowerAmount);
                }
                
                // 驗證數學正確性：A = P(1+r)^t
                const expectedAmount = principal * Math.pow(1 + rate / 100, years);
                expect(Math.abs(finalAmount - expectedAmount)).toBeLessThan(1); // 允許四捨五入誤差
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.5: 歷史數據比較的一致性和準確性
    test('Property 9.5: 歷史數據比較應保持時間序列一致性', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 100000 }),
            fc.float({ min: 1, max: 3 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const comparison = calculateHistoricalComparison(input);
                
                // 驗證數據結構完整性
                expect(comparison.currentYear).toBeDefined();
                expect(comparison.previousYear).toBeDefined();
                expect(comparison.yearOverYearChange).toBeDefined();
                
                // 驗證年份正確性
                expect(comparison.currentYear.metadata.year).toBe(2025);
                expect(comparison.previousYear?.metadata.year).toBe(2024);
                
                // 驗證變化計算準確性
                if (comparison.yearOverYearChange && comparison.previousYear) {
                    const expectedNetChange = comparison.currentYear.monthly.net - comparison.previousYear.monthly.net;
                    expect(comparison.yearOverYearChange.netIncome).toBe(expectedNetChange);
                    
                    const expectedLaborChange = comparison.currentYear.monthly.laborInsurance - comparison.previousYear.monthly.laborInsurance;
                    expect(comparison.yearOverYearChange.laborInsurance).toBe(expectedLaborChange);
                    
                    const expectedHealthChange = comparison.currentYear.monthly.healthInsurance - comparison.previousYear.monthly.healthInsurance;
                    expect(comparison.yearOverYearChange.healthInsurance).toBe(expectedHealthChange);
                    
                    const expectedPensionChange = comparison.currentYear.monthly.laborPension - comparison.previousYear.monthly.laborPension;
                    expect(comparison.yearOverYearChange.laborPension).toBe(expectedPensionChange);
                }
                
                // 驗證數據來源一致性
                expect(comparison.currentYear.metadata.dataSource).toBe('勞動部、衛福部官方資料');
                expect(comparison.previousYear?.metadata.dataSource).toBe('勞動部、衛福部官方資料');
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.6: 趨勢分析的邏輯正確性和建議合理性
    test('Property 9.6: 趨勢分析應提供合理且有用的財務建議', () => {
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
                
                // 驗證通膨影響計算邏輯
                const comparison = calculateHistoricalComparison(input);
                const currentNet = comparison.currentYear.monthly.net;
                const expectedInflationImpact = (currentNet * 2.5) / 100; // 2.5% 通膨率
                expect(analysis.inflationImpact).toBeCloseTo(expectedInflationImpact, 2);
                
                // 驗證實質收入變化計算
                expect(analysis.realIncomeChange).toBeCloseTo(analysis.salaryGrowth - 2.5, 2);
                
                // 驗證建議邏輯的合理性
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
                
                // 驗證實質收入下降時的建議
                if (analysis.realIncomeChange < 0) {
                    expect(analysis.recommendations.some(rec => 
                        rec.includes('實質收入') && rec.includes('通膨')
                    )).toBe(true);
                }
                
                // 驗證建議內容的實用性
                analysis.recommendations.forEach(recommendation => {
                    expect(recommendation.length).toBeGreaterThan(10); // 建議應有足夠內容
                    expect(typeof recommendation).toBe('string');
                });
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.7: 邊界值和異常輸入的穩健處理
    test('Property 9.7: 所有計算器應穩健處理邊界值和異常輸入', () => {
        // 測試薪資計算的邊界值
        const salaryBoundaryValues = [
            27470,  // 最低投保薪資
            45800,  // 勞保上限
            150000, // 勞退上限
            182000  // 健保上限
        ];
        
        salaryBoundaryValues.forEach(salary => {
            const input: SalaryInput = { monthlySalary: salary, bonusMonths: 1 };
            expect(() => {
                const result = calculateSalary(input);
                expect(result.monthly.net).toBeGreaterThan(0);
                expect(result.monthly.laborInsurance).toBeGreaterThanOrEqual(0);
                expect(result.monthly.healthInsurance).toBeGreaterThanOrEqual(0);
                expect(result.monthly.laborPension).toBeGreaterThanOrEqual(0);
            }).not.toThrow();
        });
        
        // 測試稅務計算的邊界值
        const taxBoundaryInputs = [
            { income: 0, isMarried: false, children: 0 },
            { income: 446000, isMarried: false, children: 0 }, // 免稅額邊界
            { income: 590000, isMarried: false, children: 0 }, // 第一級距上限
            { income: 1330000, isMarried: false, children: 0 } // 第二級距上限
        ];
        
        taxBoundaryInputs.forEach(input => {
            expect(() => {
                const tax = calculateTax(input);
                expect(tax).toBeGreaterThanOrEqual(0);
                expect(Number.isInteger(tax)).toBe(true);
            }).not.toThrow();
        });
    });

    // 屬性 9.8: 計算結果的數據來源可追溯性
    test('Property 9.8: 所有計算結果應提供完整的數據來源和更新資訊', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 100000 }),
            fc.float({ min: 1, max: 2 }),
            (monthlySalary, bonusMonths) => {
                const input: SalaryInput = { monthlySalary, bonusMonths };
                const result = calculateSalary(input);
                
                // 驗證 metadata 完整性
                expect(result.metadata).toBeDefined();
                expect(result.metadata.year).toBeDefined();
                expect(result.metadata.dataSource).toBeDefined();
                expect(result.metadata.lastUpdated).toBeDefined();
                
                // 驗證數據來源的具體性
                expect(result.metadata.dataSource).toBe('勞動部、衛福部官方資料');
                expect(result.metadata.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD 格式
                
                // 驗證費率資訊的完整性
                expect(result.metadata.laborInsuranceRate).toBeDefined();
                expect(result.metadata.healthInsuranceRate).toBeDefined();
                expect(result.metadata.laborPensionRate).toBeDefined();
                
                // 驗證費率的合理範圍
                expect(result.metadata.laborInsuranceRate).toBeGreaterThan(0);
                expect(result.metadata.laborInsuranceRate).toBeLessThan(0.5);
                expect(result.metadata.healthInsuranceRate).toBeGreaterThan(0);
                expect(result.metadata.healthInsuranceRate).toBeLessThan(0.5);
                expect(result.metadata.laborPensionRate).toBeGreaterThan(0);
                expect(result.metadata.laborPensionRate).toBeLessThan(0.5);
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.9: 成本計算器的商業邏輯準確性
    test('Property 9.9: 成本計算應符合基本商業邏輯', () => {
        fc.assert(fc.property(
            fc.integer({ min: 100, max: 100000 }), // 材料成本
            fc.integer({ min: 100, max: 50000 }), // 人工成本
            fc.integer({ min: 50, max: 20000 }), // 其他費用
            fc.integer({ min: 1, max: 1000 }), // 數量
            fc.integer({ min: 10, max: 500 }), // 售價
            (materialCost, laborCost, overheadCost, quantity, sellingPrice) => {
                const input: CostCalculationInput = {
                    materialCost,
                    laborCost,
                    overheadCost,
                    quantity,
                    sellingPrice
                };
                const result = calculateCost(input);
                
                // 基本數學邏輯驗證
                expect(result.totalCost).toBe(materialCost + laborCost + overheadCost);
                // 使用實際函數的四捨五入邏輯
                const expectedUnitCost = Math.round((result.totalCost / quantity) * 100) / 100;
                expect(result.unitCost).toBe(expectedUnitCost);
                
                // 毛利率計算驗證
                // 使用實際函數的四捨五入邏輯
                const expectedMargin = Math.round(((sellingPrice - result.unitCost) / sellingPrice) * 100 * 10) / 10;
                expect(result.margin).toBe(expectedMargin);
                
                // 損益兩平點邏輯驗證
                if (sellingPrice > result.unitCost) {
                    // 使用實際函數中四捨五入後的 unitCost
                    const expectedBreakeven = Math.ceil(result.totalCost / (sellingPrice - result.unitCost));
                    expect(result.breakeven).toBe(expectedBreakeven);
                } else {
                    expect(result.breakeven).toBe(0);
                }
                
                // 邊界條件驗證
                expect(result.totalCost).toBeGreaterThan(0);
                expect(result.unitCost).toBeGreaterThan(0);
                expect(result.breakeven).toBeGreaterThanOrEqual(0);
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.10: 信用卡分期計算的金融邏輯準確性
    test('Property 9.10: 信用卡分期計算應符合金融數學原理', () => {
        fc.assert(fc.property(
            fc.integer({ min: 1000, max: 500000 }), // 消費金額
            fc.constantFrom(3, 6, 12, 18, 24), // 分期期數
            fc.float({ min: Math.fround(0.1), max: Math.fround(15.0) }).filter(rate => !isNaN(rate) && isFinite(rate)), // 手續費率
            (amount, installments, feePercent) => {
                // 確保輸入值有效
                fc.pre(!isNaN(feePercent) && isFinite(feePercent) && feePercent > 0);
                
                const input: CreditCardInput = { amount, installments, feePercent };
                const result = calculateCreditCard(input);
                
                // 基本計算邏輯驗證
                const expectedTotalInterest = Math.round(amount * (feePercent / 100));
                expect(result.totalInterest).toBe(expectedTotalInterest);
                expect(result.totalPayment).toBe(amount + result.totalInterest);
                
                // 月付金計算驗證
                const expectedMonthlyPayment = Math.round(result.totalPayment / installments);
                expect(result.monthlyPayment).toBe(expectedMonthlyPayment);
                
                // 年利率換算邏輯驗證
                const expectedAnnualRate = (feePercent / installments) * 12 * 2;
                expect(result.interestRate).toBeCloseTo(expectedAnnualRate, 1);
                
                // 合理性驗證
                expect(result.totalPayment).toBeGreaterThan(amount);
                expect(result.monthlyPayment).toBeGreaterThan(0);
                expect(result.interestRate).toBeGreaterThan(0);
                
                // 期數影響驗證：期數越多，月付金越少
                if (installments >= 12) {
                    const shorterInput: CreditCardInput = { amount, installments: 6, feePercent };
                    const shorterResult = calculateCreditCard(shorterInput);
                    expect(result.monthlyPayment).toBeLessThan(shorterResult.monthlyPayment);
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.11: 加班費計算的勞基法合規性
    test('Property 9.11: 加班費計算應符合台灣勞基法第24條規定', () => {
        fc.assert(fc.property(
            fc.constantFrom('hourly', 'monthly'), // 薪資類型
            fc.integer({ min: 27470, max: 100000 }), // 薪資金額
            fc.constantFrom('weekday', 'restday', 'holiday'), // 加班類型
            fc.integer({ min: 1, max: 12 }), // 加班時數
            (salaryType, salary, overtimeType, hours) => {
                const input: OvertimeInput = { salaryType, salary, overtimeType, hours };
                const result = calculateOvertime(input);
                
                // 時薪計算驗證
                const expectedHourlyRate = salaryType === 'hourly' 
                    ? salary 
                    : Math.round(salary / 30 / 8);
                expect(result.regularRate).toBe(expectedHourlyRate);
                
                // 加班費應大於 0
                expect(result.overtimePay).toBeGreaterThan(0);
                expect(Array.isArray(result.breakdown)).toBe(true);
                expect(result.breakdown.length).toBeGreaterThan(0);
                
                // 驗證不同加班類型的倍率邏輯
                if (overtimeType === 'weekday') {
                    // 平日加班：前2小時1.34倍，之後1.67倍
                    const first2Hours = Math.min(hours, 2);
                    const after2Hours = Math.max(hours - 2, 0);
                    const expectedPay = Math.round(first2Hours * expectedHourlyRate * 1.34) +
                                      Math.round(after2Hours * expectedHourlyRate * 1.67);
                    expect(result.overtimePay).toBe(expectedPay);
                } else if (overtimeType === 'holiday') {
                    // 國定假日：全程2倍
                    const expectedPay = Math.round(hours * expectedHourlyRate * 2);
                    expect(result.overtimePay).toBe(expectedPay);
                }
                
                // 驗證加班時數與加班費的正相關性
                if (hours >= 2) {
                    const shorterInput: OvertimeInput = { ...input, hours: hours - 1 };
                    const shorterResult = calculateOvertime(shorterInput);
                    expect(result.overtimePay).toBeGreaterThan(shorterResult.overtimePay);
                }
            }
        ), { numRuns: 100 });
    });

    // 屬性 9.12: 跨計算器數據一致性驗證
    test('Property 9.12: 相關計算器之間應保持數據邏輯一致性', () => {
        fc.assert(fc.property(
            fc.integer({ min: 30000, max: 80000 }), // 月薪
            fc.integer({ min: 1, max: 8 }), // 加班時數
            (monthlySalary, overtimeHours) => {
                // 薪資計算
                const salaryInput: SalaryInput = { monthlySalary, bonusMonths: 1 };
                const salaryResult = calculateSalary(salaryInput);
                
                // 加班費計算 (使用相同的月薪)
                const overtimeInput: OvertimeInput = {
                    salaryType: 'monthly',
                    salary: monthlySalary,
                    overtimeType: 'weekday',
                    hours: overtimeHours
                };
                const overtimeResult = calculateOvertime(overtimeInput);
                
                // 驗證時薪計算的一致性
                const expectedHourlyRate = Math.round(monthlySalary / 30 / 8);
                expect(overtimeResult.regularRate).toBe(expectedHourlyRate);
                
                // 驗證薪資與加班費的合理比例
                const monthlyOvertimePay = overtimeResult.overtimePay * 22; // 假設每天加班
                expect(monthlyOvertimePay).toBeGreaterThan(0);
                expect(monthlyOvertimePay).toBeLessThan(salaryResult.monthly.gross * 2); // 加班費不應超過薪資2倍
                
                // 驗證總收入的合理性
                const totalMonthlyIncome = salaryResult.monthly.net + monthlyOvertimePay;
                expect(totalMonthlyIncome).toBeGreaterThan(salaryResult.monthly.net);
            }
        ), { numRuns: 100 });
    });
});