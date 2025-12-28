// lib/skills/uiCatalog.ts
import type { SkillId, SkillUIContract } from './uiTypes';

export const SKILL_UI_CATALOG: Record<SkillId, SkillUIContract> = {
    // --------------------
    // 薪資
    // --------------------
    'salary.analyze': {
        title: '薪資結構分析',
        description: '計算月薪、年薪、實領金額、勞健保費用、所得稅，並提供節稅建議。',
        disclaimer: '此為試算結果，實際以公司薪資結構與你的扣繳資料為準。',
        inputMeta: {
            monthlySalary: { label: '月薪', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric', helpText: '稅前月薪' },
            bonusMonths: { label: '年終（月數）', unit: '月', format: 'number', min: 0, max: 20, step: 0.5, inputMode: 'decimal' },
            dependents: { label: '健保眷屬人數', unit: '人', format: 'integer', min: 0, max: 10, step: 1, inputMode: 'numeric' },
            selfContributionRate: { label: '勞退自提比例', unit: '%', format: 'percent', min: 0, max: 6, step: 1, inputMode: 'numeric' },
            isMarried: { label: '是否已婚', unit: '無', format: 'text' },
        },
        examples: [
            { label: '新鮮人', input: { monthlySalary: 38000, bonusMonths: 1, dependents: 0, selfContributionRate: 0, isMarried: false } },
            { label: '雙薪家庭', input: { monthlySalary: 60000, bonusMonths: 2, dependents: 1, selfContributionRate: 0, isMarried: true } },
            { label: '高薪自提', input: { monthlySalary: 120000, bonusMonths: 3, dependents: 2, selfContributionRate: 6, isMarried: true } },
        ],
        highlights: [
            { key: 'annualGross', label: '年總收入（稅前）', valuePath: 'data.annual.gross', format: 'currencyTWD', unit: '元' },
            { key: 'annualNet', label: '年實領收入', valuePath: 'data.annual.net', format: 'currencyTWD', unit: '元' },
        ],
    },

    'salary.reverse': {
        title: '逆向推算期望薪資',
        description: '給定你想要的「實領」目標，反推需要的月薪或年薪結構。',
        inputMeta: {
            targetNetSalary: { label: '目標實領薪資', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            dependents: { label: '健保眷屬人數', unit: '人', format: 'integer', min: 0, max: 10, step: 1, inputMode: 'numeric' },
            selfContributionRate: { label: '勞退自提比例', unit: '%', format: 'percent', min: 0, max: 6, step: 1, inputMode: 'numeric' },
        },
        examples: [
            { label: '實領 4 萬', input: { targetNetSalary: 40000, dependents: 0, selfContributionRate: 0 } },
            { label: '實領 6 萬', input: { targetNetSalary: 60000, dependents: 0, selfContributionRate: 6 } },
            { label: '實領 10 萬', input: { targetNetSalary: 100000, dependents: 2, selfContributionRate: 0 } },
        ],
        highlights: [
            { key: 'grossSalary', label: '需談稅前月薪', valuePath: 'data.grossSalary', format: 'currencyTWD', unit: '元' },
        ]
    },

    'salary.structure': {
        title: '薪資/保費級距分析',
        description: '輸入月薪，快速查詢勞保、健保的投保金額級距。',
        inputMeta: {
            monthlySalary: { label: '月薪', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
        },
        examples: [
            { label: '最低工資', input: { monthlySalary: 28590 } },
            { label: '月薪 5 萬', input: { monthlySalary: 50000 } },
            { label: '月薪 10 萬', input: { monthlySalary: 100000 } },
        ],
        highlights: [
            { key: 'laborLevel', label: '勞保投保薪資', valuePath: 'data.勞保投保級距', format: 'currencyTWD', unit: '元' },
            { key: 'healthLevel', label: '健保投保薪資', valuePath: 'data.健保投保級距', format: 'currencyTWD', unit: '元' },
        ]
    },

    // --------------------
    // 稅務
    // --------------------
    'tax.calculate': {
        title: '綜所稅試算',
        description: '快速估算你的綜合所得稅、有效稅率與可能的稅負區間。',
        disclaimer: '此為概算，實際以申報年度規定、扣除額與所得細項為準。',
        inputMeta: {
            annualIncome: { label: '全年總收入', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
            exemptionCount: { label: '免稅額人數', unit: '人', format: 'integer', min: 1, max: 10, step: 1, inputMode: 'numeric', helpText: '本人+扶養親屬' },
            householdSize: { label: '申報戶總人數', unit: '人', format: 'integer', min: 1, max: 10, step: 1, inputMode: 'numeric', helpText: '用於計算基本生活費差額' },
            isMarried: { label: '是否已婚', unit: '無', format: 'text' },
            useStandardDeduction: { label: '使用標準扣除額', unit: '無', format: 'text' },
        },
        examples: [
            { label: '單身小資', input: { annualIncome: 500000, exemptionCount: 1, householdSize: 1, isMarried: false, useStandardDeduction: true } },
            { label: '單身中產', input: { annualIncome: 1200000, exemptionCount: 1, householdSize: 1, isMarried: false, useStandardDeduction: true } },
            { label: '雙薪家庭', input: { annualIncome: 1800000, exemptionCount: 3, householdSize: 3, isMarried: true, useStandardDeduction: true } },
        ],
        highlights: [
            { key: 'taxAmount', label: '應納稅額（估）', valuePath: 'data.taxAmount', format: 'currencyTWD', unit: '元' },
            { key: 'effectiveRate', label: '有效稅率', valuePath: 'data.effectiveTaxRate', format: 'percent', unit: '%' },
        ],
    },

    'tax.optimize': {
        title: '節稅策略建議',
        description: '分析節稅空間，提供勞退自提、扣除額選擇等優化建議。',
        inputMeta: {
            annualIncome: { label: '全年總收入', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
            currentSelfContribution: { label: '目前勞退自提', unit: '%', format: 'percent', min: 0, max: 6, step: 1, inputMode: 'numeric' },
            isMarried: { label: '是否已婚', unit: '無', format: 'text' },
        },
        examples: [
            { label: '未自提', input: { annualIncome: 800000, currentSelfContribution: 0, isMarried: false } },
            { label: '高收入未自提', input: { annualIncome: 1500000, currentSelfContribution: 0, isMarried: true } },
        ],
        highlights: [
            { key: 'savings', label: '預估可省稅金', valuePath: 'data.savingsAmount', format: 'currencyTWD', unit: '元' },
        ]
    },

    // --------------------
    // 資本
    // --------------------
    'capital.growth': {
        title: '複利成長模擬',
        description: '模擬複利增長，計算未來資產、被動收入，含通膨調整。',
        inputMeta: {
            initialCapital: { label: '初始本金', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
            monthlyContribution: { label: '每月投入', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            annualReturnRate: { label: '年化報酬率', unit: '%', format: 'percent', min: -50, max: 50, step: 0.5, inputMode: 'decimal' },
            years: { label: '投資年限', unit: '年', format: 'integer', min: 1, max: 60, step: 1, inputMode: 'numeric' },
            inflationRate: { label: '預期通膨率', unit: '%', format: 'percent', min: 0, max: 10, step: 0.1, inputMode: 'decimal' },
        },
        examples: [
            { label: '保守型', input: { initialCapital: 200000, monthlyContribution: 5000, annualReturnRate: 4, years: 20, inflationRate: 2.5 } },
            { label: '穩健型', input: { initialCapital: 500000, monthlyContribution: 15000, annualReturnRate: 6, years: 20, inflationRate: 2.5 } },
            { label: '積極型', input: { initialCapital: 800000, monthlyContribution: 30000, annualReturnRate: 8, years: 15, inflationRate: 2.5 } },
        ],
        highlights: [
            { key: 'totalAssets', label: '期末總資產', valuePath: 'data.summary.totalAssets', format: 'currencyTWD', unit: '元' },
            { key: 'realAssets', label: '實質購買力', valuePath: 'data.summary.realAssets', format: 'currencyTWD', unit: '元' },
        ],
    },

    'capital.fire': {
        title: 'FIRE 財務自由計算',
        description: '計算財務自由目標金額、所需年數、每月投入建議。',
        inputMeta: {
            monthlyExpense: { label: '每月生活開銷', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            currentSavings: { label: '目前存款/投資', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
            monthlyInvestment: { label: '目前每月投資', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            expectedReturn: { label: '預期年化報酬', unit: '%', format: 'percent', min: 0, max: 20, step: 0.5, inputMode: 'decimal' },
            safeWithdrawalRate: { label: '安全提領率', unit: '%', format: 'percent', min: 1, max: 10, step: 0.1, inputMode: 'decimal', helpText: '傳統使用 4%' },
        },
        examples: [
            { label: '精簡生活', input: { monthlyExpense: 30000, currentSavings: 500000, monthlyInvestment: 20000, expectedReturn: 6, safeWithdrawalRate: 4 } },
            { label: '寬裕生活', input: { monthlyExpense: 60000, currentSavings: 1000000, monthlyInvestment: 30000, expectedReturn: 7, safeWithdrawalRate: 4 } },
        ],
        highlights: [
            { key: 'fireNumber', label: 'FIRE 目標金額', valuePath: 'data.fireNumber', format: 'currencyTWD', unit: '元' },
            { key: 'yearsToFIRE', label: '預計達成年數', valuePath: 'data.yearsToFIRE', format: 'number', unit: '年' },
        ]
    },

    'capital.goalReverse': {
        title: '目標逆推',
        description: '設定目標金額與期限，反推每月需要投入多少。',
        inputMeta: {
            targetAmount: { label: '目標金額', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
            years: { label: '期限', unit: '年', format: 'integer', min: 1, max: 60, step: 1, inputMode: 'numeric' },
            expectedReturn: { label: '預期年化報酬', unit: '%', format: 'percent', min: -50, max: 50, step: 0.5, inputMode: 'decimal' },
            initialCapital: { label: '目前本金', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
        },
        examples: [
            { label: '買車 80 萬', input: { targetAmount: 800000, years: 3, expectedReturn: 4, initialCapital: 100000 } },
            { label: '頭期款 200 萬', input: { targetAmount: 2000000, years: 5, expectedReturn: 6, initialCapital: 300000 } },
        ],
        highlights: [
            { key: 'monthly', label: '每月需投入', valuePath: 'data.monthlyInvestment', format: 'currencyTWD', unit: '元' },
        ]
    },

    'capital.passiveIncome': {
        title: '被動收入規劃',
        description: '用目標被動收入與預期殖利率，推估需要的本金。',
        inputMeta: {
            targetMonthlyIncome: { label: '目標月被動收入', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            yieldRate: { label: '預期殖利率', unit: '%', format: 'percent', min: 0, max: 20, step: 0.25, inputMode: 'decimal' },
        },
        examples: [
            { label: '加薪 1 萬', input: { targetMonthlyIncome: 10000, yieldRate: 5 } },
            { label: '退休 5 萬', input: { targetMonthlyIncome: 50000, yieldRate: 4 } },
        ],
        highlights: [
            { key: 'capital', label: '所需本金', valuePath: 'data.requiredCapital', format: 'currencyTWD', unit: '元' },
        ]
    },

    'capital.milestones': {
        title: '財富里程碑',
        description: '依你的資產與投入速度，列出達到常見里程碑的時間預估。',
        inputMeta: {
            initialCapital: { label: '目前資產', unit: '元', format: 'currencyTWD', min: 0, step: 10000, inputMode: 'numeric' },
            monthlyContribution: { label: '每月投入', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            annualReturnRate: { label: '年化報酬率', unit: '%', format: 'percent', min: -50, max: 50, step: 0.5, inputMode: 'decimal' },
        },
        examples: [
            { label: '小資起步', input: { initialCapital: 100000, monthlyContribution: 10000, annualReturnRate: 6 } },
            { label: '積極累積', input: { initialCapital: 1000000, monthlyContribution: 30000, annualReturnRate: 8 } },
        ],
        // milestones 是一個 array，這裡的 highlights 可能需要特製，或只顯示第一個里程碑
        highlights: [],
    },

    // --------------------
    // 房貸
    // --------------------
    'mortgage.calculate': {
        title: '房貸月付金試算',
        description: '用貸款金額、年限與利率，試算月付、總利息與寬限期影響。',
        inputMeta: {
            loanAmount: { label: '貸款金額', unit: '元', format: 'currencyTWD', min: 0, step: 100000, inputMode: 'numeric' },
            annualRate: { label: '年利率', unit: '%', format: 'percent', min: 0, max: 20, step: 0.05, inputMode: 'decimal' },
            years: { label: '貸款年限', unit: '年', format: 'integer', min: 1, max: 40, step: 1, inputMode: 'numeric' },
            gracePeriod: { label: '寬限期', unit: '年', format: 'integer', min: 0, max: 5, step: 1, inputMode: 'numeric' },
        },
        examples: [
            { label: '新青安', input: { loanAmount: 10000000, annualRate: 1.775, years: 40, gracePeriod: 5 } },
            { label: '一般房貸', input: { loanAmount: 12000000, annualRate: 2.1, years: 30, gracePeriod: 0 } },
        ],
        highlights: [
            { key: 'monthlyPayment', label: '月付金（本利和）', valuePath: 'data.monthlyPayment', format: 'currencyTWD', unit: '元' },
            { key: 'totalInterest', label: '總利息支出', valuePath: 'data.totalInterest', format: 'currencyTWD', unit: '元' },
        ],
    },

    'mortgage.refinance': {
        title: '轉貸評估',
        description: '比較新舊利率與相關成本，估算轉貸是否划算。',
        inputMeta: {
            currentBalance: { label: '剩餘本金', unit: '元', format: 'currencyTWD', min: 0, step: 100000, inputMode: 'numeric' },
            remainingYears: { label: '剩餘年限', unit: '年', format: 'integer', min: 1, max: 40, step: 1, inputMode: 'numeric' },
            currentRate: { label: '原年利率', unit: '%', format: 'percent', min: 0, max: 20, step: 0.05, inputMode: 'decimal' },
            newRate: { label: '新年利率', unit: '%', format: 'percent', min: 0, max: 20, step: 0.05, inputMode: 'decimal' },
            refinanceCost: { label: '轉貸成本', unit: '元', format: 'currencyTWD', min: 0, step: 5000, inputMode: 'numeric' },
            newYears: { label: '新貸款年限', unit: '年', format: 'integer', min: 1, max: 40, step: 1, inputMode: 'numeric', helpText: '選填，不填則預設同剩餘年限' },
        },
        examples: [
            { label: '降息轉貸', input: { currentBalance: 8000000, remainingYears: 25, currentRate: 2.5, newRate: 2.1, refinanceCost: 30000 } },
        ],
        highlights: [
            { key: 'netSavings', label: '預估節省總額', valuePath: 'data.netSavings', format: 'currencyTWD', unit: '元' },
            { key: 'isWorthIt', label: '是否划算', valuePath: 'data.isWorthIt', format: 'text' },
        ]
    },

    'mortgage.earlyRepayment': {
        title: '提前還款試算',
        description: '評估一次性或每月提前還款對總利息與年限的影響。',
        inputMeta: {
            loanBalance: { label: '貸款餘額', unit: '元', format: 'currencyTWD', min: 0, step: 100000, inputMode: 'numeric' },
            annualRate: { label: '年利率', unit: '%', format: 'percent', min: 0, max: 20, step: 0.05, inputMode: 'decimal' },
            remainingYears: { label: '剩餘年限', unit: '年', format: 'integer', min: 1, max: 40, step: 1, inputMode: 'numeric' },
            extraPayment: { label: '額外還款金額', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            isMonthly: { label: '每月固定還款', unit: '無', format: 'text', helpText: '是/否' },
        },
        examples: [
            { label: '每月多還 5千', input: { loanBalance: 8000000, annualRate: 2.1, remainingYears: 25, extraPayment: 5000, isMonthly: true } },
            { label: '一次還 50萬', input: { loanBalance: 8000000, annualRate: 2.1, remainingYears: 25, extraPayment: 500000, isMonthly: false } },
        ],
        highlights: [
            { key: 'savedInterest', label: '節省利息', valuePath: 'data.shortenSavedInterest', format: 'currencyTWD', unit: '元' },
        ]
    },

    // --------------------
    // 財運（娛樂）
    // --------------------
    'fortune.analyze': {
        title: '財運命盤分析',
        description: '結合命理系統與財務規劃，分析個人財運特質。',
        disclaimer: '娛樂性內容，請以自身判斷為準。',
        inputMeta: {
            name: { label: '姓名', unit: '無', format: 'text', placeholder: '您的名字' },
            birthDate: { label: '出生日期', unit: '無', format: 'text', placeholder: 'YYYY-MM-DD' },
            birthTime: { label: '出生時間', unit: '無', format: 'text', placeholder: 'HH:mm' },
            gender: {
                label: '性別', unit: '無', format: 'text',
                options: { 'male': '男性', 'female': '女性', 'other': '其他' }
            },
            system: {
                label: '命理系統', unit: '無', format: 'text',
                options: { 'ziwei': '紫微斗數', 'bazi': '八字命理', 'western': '西洋占星' }
            },
            salary: { label: '月薪（選填）', unit: '元', format: 'currencyTWD', min: 0, step: 1000, inputMode: 'numeric' },
            retirementAge: { label: '退休年齡（選填）', unit: '歲', format: 'integer' },
        },
        examples: [
            { label: '紫微體驗', input: { name: '王小明', birthDate: '1990-01-01', birthTime: '12:00', gender: 'male', system: 'ziwei', salary: 50000 } },
        ],
        highlights: [
            { key: 'mainStar', label: '命宮主星/星座', valuePath: 'data.analysis.mainStar', format: 'text' },
            { key: 'wealth', label: '財運概況', valuePath: 'data.forecast.year2025', format: 'text' },
        ]
    },

    // --------------------
    // 文章
    // --------------------
    'articles.generate': {
        title: 'AI 文章生成',
        description: '生成理財文章模板 (內部工具)',
        inputMeta: {
            topic: { label: '主題', unit: '無', format: 'text' },
            category: { label: '分類', unit: '無', format: 'text' },
        },
    },
    'articles.trending': {
        title: '趨勢分析',
        description: '查看熱門理財話題',
        inputMeta: {
            category: { label: '分類', unit: '無', format: 'text' },
        },
    }
};
