/**
 * UI Meta Types definition
 * 定義 Skill UI 呈現所需的元數據類型
 */

export type SkillId =
    | 'salary.analyze'
    | 'salary.reverse'
    | 'salary.structure'
    | 'tax.calculate'
    | 'tax.optimize'
    | 'capital.growth'
    | 'capital.fire'
    | 'capital.goalReverse'
    | 'capital.passiveIncome'
    | 'capital.milestones'
    | 'mortgage.calculate'
    | 'mortgage.refinance'
    | 'mortgage.earlyRepayment'
    | 'fortune.analyze'
    | 'articles.generate'
    | 'articles.trending';

export type UIFormat = 'currencyTWD' | 'percent' | 'number' | 'integer' | 'text';

export type UISemanticUnit =
    | '元'
    | '萬元'
    | '月'
    | '年'
    | '次'
    | '%'
    | '人'
    | '天'
    | '歲'
    | '無';

export type UIFieldMeta = {
    label: string;              // 欄位顯示名稱（繁中）
    helpText?: string;          // 欄位說明（台灣用語）
    placeholder?: string;       // placeholder
    unit?: UISemanticUnit;      // 元 / % / 年...
    format?: UIFormat;          // 顯示格式（不等於驗證）
    min?: number;
    max?: number;
    step?: number;
    inputMode?: 'decimal' | 'numeric' | 'text';
    // 針對 Select/Enum 的選項標籤映射
    options?: Record<string, string>;
};

export type UIExample<TInput extends Record<string, any> = Record<string, any>> = {
    label: string; // 例如：一般上班族 / 首購族
    input: TInput;
};

export type UIResultHighlight = {
    key: string;     // 唯一 key（例如 monthlyPayment）
    label: string;   // 顯示名稱
    valuePath: string; // 從 skill output 取值路徑，例如 "data.payment.monthly"
    format?: UIFormat;
    unit?: UISemanticUnit;
};

export type UIResultSection = {
    title: string;
    items: Array<{
        label: string;
        valuePath: string;
        format?: UIFormat;
        unit?: UISemanticUnit;
    }>;
};

export type SkillUIContract = {
    title: string;
    description?: string;
    disclaimer?: string;

    // key 為 input 欄位名
    inputMeta?: Record<string, UIFieldMeta>;

    // 3~5 組一鍵帶入
    examples?: Array<UIExample>;

    // 結果呈現（通用 renderer 用）
    highlights?: UIResultHighlight[];
    sections?: UIResultSection[];
};
