import { SkillUIConfig } from './uiTypes';

export const uiCatalog: SkillUIConfig[] = [
    // --- 薪資 Salary ---
    {
        id: 'salary.analyze',
        category: 'salary',
        kind: 'financial',
        oneLiner: '看懂你的年薪結構與稅後落點',
        tags: ['熱門', '必備'],
        estMinutes: 1,
        isFeatured: true,
        priority: 10,
        outputMode: 'kpi+chart',
        primaryChart: { type: 'pie_salary_breakdown', title: '年薪結構分佈' },
        preview: {
            inputHighlights: ['月薪', '年終月數', '是否有配偶'],
            outputHighlights: ['實領年薪', '勞健保扣除', '估計所得稅']
        },
        exampleValues: { monthlySalary: 50000, bonusMonths: 2, isMarried: false }
    },
    {
        id: 'salary.reverse',
        category: 'salary',
        kind: 'financial',
        oneLiner: '用目標生活費倒推「該談多少」',
        tags: ['求職', '談薪'],
        estMinutes: 2,
        priority: 20,
        outputMode: 'kpi+chart',
        preview: {
            inputHighlights: ['目標每月存款', '每月生活費', '預計年終'],
            outputHighlights: ['建議月薪', '必要年薪', '稅後淨額']
        },
        exampleValues: { targetSavings: 15000, monthlyExpense: 25000, bonusMonths: 1 }
    },
    {
        id: 'salary.structure',
        category: 'salary',
        kind: 'financial',
        oneLiner: '同樣年薪，怎麼配更划算',
        tags: ['進階'],
        estMinutes: 2,
        priority: 30,
        outputMode: 'kpi+chart',
        preview: {
            inputHighlights: ['目標年薪', '現有結構', '期望結構'],
            outputHighlights: ['實領差異', '稅額差異']
        }
    },

    // --- 稅務 Tax ---
    {
        id: 'tax.calculate',
        category: 'tax',
        kind: 'financial',
        oneLiner: '快速估算稅額與退/補稅',
        tags: ['熱門', '報稅季', '新手友善'],
        estMinutes: 2,
        isFeatured: true,
        priority: 5, // Top priority
        outputMode: 'kpi+chart',
        primaryChart: { type: 'stack_tax_breakdown', title: '稅額計算分解' },
        preview: {
            inputHighlights: ['年收入', '配偶/扶養', '扣除額'],
            outputHighlights: ['應納稅額', '有效稅率', '邊際稅率']
        },
        exampleValues: { income: 800000, isMarried: false, dependents: 0 }
    },
    {
        id: 'tax.optimize',
        category: 'tax',
        kind: 'financial',
        oneLiner: '依條件給你可行節稅組合',
        tags: ['省稅', '策略'],
        estMinutes: 3,
        priority: 25,
        outputMode: 'kpi+table',
        preview: {
            inputHighlights: ['各類收入', '扶養親屬', '列舉扣除項目'],
            outputHighlights: ['最佳報稅方式', '預估節稅額']
        }
    },

    // --- 資本 Capital ---
    {
        id: 'capital.growth',
        category: 'capital',
        kind: 'financial',
        oneLiner: '投入 × 報酬 × 時間的資產成長曲線',
        tags: ['熱門', '投資', '複利'],
        estMinutes: 1,
        isFeatured: true,
        priority: 15,
        outputMode: 'kpi+chart',
        primaryChart: { type: 'line_assets', title: '資產累積預測' },
        preview: {
            inputHighlights: ['初始本金', '每月投入', '預期報酬率', '投資年限'],
            outputHighlights: ['期末總資產', '總投入本金', '複利效應佔比']
        },
        exampleValues: { initialCapital: 100000, monthlyContribution: 10000, returnRate: 6, years: 20 }
    },
    {
        id: 'capital.fire',
        category: 'capital',
        kind: 'financial',
        oneLiner: '離財務自由還差多少、多久達成',
        tags: ['FIRE', '退休'],
        estMinutes: 2,
        isFeatured: true,
        priority: 18,
        outputMode: 'kpi+chart',
        primaryChart: { type: 'line_fire', title: '財務自由進度' },
        preview: {
            inputHighlights: ['目前資產', '年度開銷', '預期報酬率'],
            outputHighlights: ['FIRE 數字', '達成時間', '進度條']
        },
        exampleValues: { currentAssets: 2000000, yearlyExpense: 600000, returnRate: 5 }
    },
    {
        id: 'capital.goalReverse',
        category: 'capital',
        kind: 'financial',
        oneLiner: '想在 X 年到 Y，月投要多少',
        tags: ['目標', '規劃'],
        estMinutes: 1,
        priority: 35,
        outputMode: 'kpi+chart',
        preview: {
            inputHighlights: ['目標金額', '達成年限', '預期報酬'],
            outputHighlights: ['每月需投入', '總投入成本']
        }
    },
    {
        id: 'capital.passiveIncome',
        category: 'capital',
        kind: 'financial',
        oneLiner: '要多少本金才能 cover 生活費',
        tags: ['被動收入', '現金流'],
        estMinutes: 1,
        priority: 36,
        outputMode: 'kpi+chart',
        preview: {
            inputHighlights: ['目標月被動收入', '工具殖利率'],
            outputHighlights: ['所需本金', '達成難度']
        }
    },
    {
        id: 'capital.milestones',
        category: 'capital',
        kind: 'financial',
        oneLiner: '財富里程碑路線圖（第 1/2/3 階段）',
        tags: ['長期規劃'],
        estMinutes: 2,
        priority: 40,
        outputMode: 'kpi+table',
        preview: {
            inputHighlights: ['現有資產', '儲蓄率', '收入成長'],
            outputHighlights: ['第一桶金時間', '半退休時間', '富裕時間']
        }
    },

    // --- 房貸 Mortgage ---
    {
        id: 'mortgage.calculate',
        category: 'mortgage',
        kind: 'financial',
        oneLiner: '月付金、總利息、負擔比一次算清',
        tags: ['熱門', '買房'],
        estMinutes: 1,
        isFeatured: true,
        priority: 12,
        outputMode: 'kpi+chart',
        primaryChart: { type: 'amortization', title: '本息攤還分析' },
        preview: {
            inputHighlights: ['貸款總額', '利率', '年限', '寬限期'],
            outputHighlights: ['每月還款', '利息總額', '還款總額']
        },
        exampleValues: { loanAmount: 10000000, rate: 2.1, years: 30, gracePeriod: 0 }
    },
    {
        id: 'mortgage.refinance',
        category: 'mortgage',
        kind: 'financial',
        oneLiner: '轉貸划不划算、多久回本',
        tags: ['省息', '精算'],
        estMinutes: 2,
        priority: 22,
        outputMode: 'kpi+chart',
        primaryChart: { type: 'bar_compare', title: '轉貸前後效益' },
        preview: {
            inputHighlights: ['原貸款餘額', '原利率', '新利率', '轉貸成本'],
            outputHighlights: ['總省息金額', '損益平衡點', '每月少繳']
        }
    },
    {
        id: 'mortgage.earlyRepayment',
        category: 'mortgage',
        kind: 'financial',
        oneLiner: '提前還款能省多少利息',
        tags: ['還款'],
        estMinutes: 1,
        priority: 28,
        outputMode: 'kpi+table',
        preview: {
            inputHighlights: ['剩餘本金', '預計提前還款額', '還款策略'],
            outputHighlights: ['省下利息', '縮短年限']
        }
    },

    // --- 財運 Fortune ---
    {
        id: 'fortune.analyze',
        category: 'fortune',
        kind: 'entertainment',
        oneLiner: '娛樂向財運分析與提醒（非投資建議）',
        tags: ['輕鬆', '運勢'],
        estMinutes: 1,
        priority: 50,
        outputMode: 'text',
        preview: {
            inputHighlights: ['出生年份', '生肖/星座 (選填)'],
            outputHighlights: ['年度財運評分', '注意事項', '開運建議']
        },
        exampleValues: { birthYear: 1990 }
    },

    // --- 文章 Articles ---
    {
        id: 'articles.generate',
        category: 'articles',
        kind: 'utility',
        oneLiner: '快速生成文章草稿與段落結構',
        tags: ['AI', '創作者'],
        estMinutes: 1,
        priority: 60,
        outputMode: 'text',
        preview: {
            inputHighlights: ['主題關鍵字', '目標讀者', '語氣'],
            outputHighlights: ['文章大綱', '試寫段落']
        }
    },
    {
        id: 'articles.trending',
        category: 'articles',
        kind: 'utility',
        oneLiner: '抓趨勢話題與切角建議',
        tags: ['AI', '行銷'],
        estMinutes: 1,
        priority: 61,
        outputMode: 'text',
        preview: {
            inputHighlights: ['領域 (如：軟體工程)', '時間範圍'],
            outputHighlights: ['熱門關鍵字', '上升趨勢', '內容切角建議']
        }
    }
];

export const getSkillUI = (id: string) => uiCatalog.find(item => item.id === id);
export const getFeaturedSkills = () => uiCatalog.filter(item => item.isFeatured).sort((a, b) => (a.priority || 99) - (b.priority || 99));
export const getSkillsByCategory = (cat: string) => uiCatalog.filter(item => item.category === cat).sort((a, b) => (a.priority || 99) - (b.priority || 99));

// Legacy compatibility
export const SKILL_UI_CATALOG: Record<string, SkillUIConfig> = uiCatalog.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
}, {} as Record<string, SkillUIConfig>);
