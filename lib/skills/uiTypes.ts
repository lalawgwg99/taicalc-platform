/**
 * UI Meta Types definition
 * 定義 Skill UI 呈現所需的元數據類型
 */

export type SkillCategory = 'salary' | 'tax' | 'capital' | 'mortgage' | 'fortune' | 'articles';

export type SkillKind = 'financial' | 'utility' | 'entertainment';

export type SkillId =
    | 'salary.analyze' | 'salary.reverse' | 'salary.structure'
    | 'tax.calculate' | 'tax.optimize'
    | 'capital.growth' | 'capital.fire' | 'capital.goalReverse' | 'capital.passiveIncome' | 'capital.milestones'
    | 'mortgage.calculate' | 'mortgage.refinance' | 'mortgage.earlyRepayment'
    | 'fortune.analyze'
    | 'articles.generate' | 'articles.trending';

export type SkillOutputMode = 'kpi+chart' | 'kpi+table' | 'text';

export type ChartType =
    | 'line_assets'
    | 'line_fire'
    | 'pie_salary_breakdown'
    | 'amortization'
    | 'bar_compare'
    | 'stack_tax_breakdown'
    | 'none';

export type SkillUIConfig = {
    id: string;

    // 導覽/分類
    category: SkillCategory;
    kind: SkillKind;

    // 列表呈現
    title?: string; // 若要覆蓋預設名稱
    oneLiner: string; // 卡片用一句話（<= 22 字建議）
    tags?: string[]; // ["熱門","新手友善","AI"]
    estMinutes?: number; // 1,2,3...

    // 排序
    isFeatured?: boolean;
    priority?: number; // 越小越前面，例如 10,20,30

    // 工具頁呈現
    outputMode?: SkillOutputMode; // 預設 "kpi+chart"
    primaryChart?: {
        type: ChartType;
        title: string;
        description?: string;
    };

    // 預覽抽屜（/calculators 的 Preview）
    preview?: {
        inputHighlights: string[]; // 顯示「會問什麼」
        outputHighlights: string[]; // 顯示「你會得到什麼」
    };

    // 一鍵範例（用於 wow）
    exampleValues?: Record<string, unknown>;
};

// 保留既有的 Field Meta 定義，供 Form 使用
export type UIFormat = 'currencyTWD' | 'percent' | 'number' | 'integer' | 'text';
export type UISemanticUnit = '元' | '萬元' | '月' | '年' | '次' | '%' | '人' | '天' | '歲' | '無';

export type UIFieldMeta = {
    label: string;
    helpText?: string;
    placeholder?: string;
    unit?: UISemanticUnit;
    format?: UIFormat;
    min?: number;
    max?: number;
    step?: number;
    inputMode?: 'decimal' | 'numeric' | 'text';
    options?: Record<string, string>;
};

// Legacy Type for backward compatibility
export type SkillUIContract = {
    title: string;
    description?: string;
    examples?: Array<{ label: string; input: Record<string, unknown> }>;
    inputMeta?: Record<string, UIFieldMeta>;
    highlights?: any[];
    sections?: any[];
    disclaimer?: string;
};

export interface UIResultHighlight {
    key: string;
    label: string;
    valuePath: string;
    format?: UIFormat;
    unit?: UISemanticUnit | string;
}

export interface UIResultSectionItem {
    label: string;
    valuePath: string;
    format?: UIFormat;
    unit?: UISemanticUnit | string;
}

export interface UIResultSection {
    title: string;
    items: UIResultSectionItem[];
}
