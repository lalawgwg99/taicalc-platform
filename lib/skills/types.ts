/**
 * TaiCalc Skill 系統 - 類型定義 v2
 * 升級版：含假設、信心度、風險提示、能力標籤
 */

import { z, ZodSchema } from 'zod';

// ============================================
// Skill 分類與標籤
// ============================================

/** Skill 類別（用於區分 Financial vs Entertainment） */
export type SkillCategory = 'financial' | 'entertainment' | 'utility';

/** Skill 能力標籤（用於 AI 選擇與推薦） */
export type SkillTag =
    | 'salary' | 'tax' | 'mortgage' | 'capital' | 'fire' | 'retirement'
    | 'long-term' | 'short-term' | 'low-risk' | 'high-risk'
    | 'beginner' | 'advanced' | 'fortune';

// ============================================
// 核心 Skill 介面 v2
// ============================================

export interface SkillDefinition<TInput = unknown, TOutput = unknown> {
    /** 
     * 唯一識別碼，三段式格式: "domain.category.action" 
     * 例如: "salary.structure.analyze", "mortgage.loan.calculate"
     */
    id: string;

    /** 顯示名稱 (繁體中文) */
    name: string;

    /** 功能描述 */
    description: string;

    /** 語義版本號 */
    version: string;

    /** Skill 類別 */
    category: SkillCategory;

    /** 能力標籤（用於 AI 選擇與推薦） */
    tags: SkillTag[];

    /** 輸入驗證 Schema */
    inputSchema: ZodSchema<TInput>;

    /** 輸出驗證 Schema */
    outputSchema: ZodSchema<TOutput>;

    /** 執行函數 */
    execute: (input: TInput) => Promise<TOutput>;

    /** AI 可讀的參數說明 (用於 Orchestrator) */
    parameterDescriptions?: Record<string, string>;

    /** 
     * 預設假設（計算時使用的假設值）
     * 例如: { inflation: 2, salaryGrowth: 3 }
     */
    defaultAssumptions?: Record<string, number | string>;
}

// ============================================
// 執行結果 v2（含假設、信心度、風險）
// ============================================

export interface SkillResultMeta {
    /** Skill ID */
    skillId: string;
    /** Skill 版本 */
    version: string;
    /** 執行時間 (毫秒) */
    durationMs: number;
    /** 執行時間戳 */
    executedAt: string;
    /** 來源 */
    source: 'api' | 'chat' | 'chain';
}

export interface SkillResultV2<TOutput = unknown> {
    /** 是否成功 */
    success: boolean;

    /** 輸出資料 */
    data?: TOutput;

    /** 
     * 計算使用的假設
     * 例如: { inflation: 2, salaryGrowth: 3 }
     */
    assumptions: Record<string, number | string>;

    /** 
     * 結果信心度 (0-1)
     * 0.9+ = 高信心（純數學計算）
     * 0.7-0.9 = 中信心（含預測）
     * <0.7 = 低信心（多重假設）
     */
    confidence: number;

    /** 風險提示 */
    risks: string[];

    /** 下一步建議 */
    nextSuggestions: {
        skillId: string;
        reason: string;
    }[];

    /** 元數據 */
    meta: SkillResultMeta;

    /** 錯誤訊息（僅失敗時） */
    error?: string;
}

// 向下相容：舊版結果類型
export interface SkillExecutionResult<TOutput = unknown> {
    success: boolean;
    skillId: string;
    data?: TOutput;
    error?: string;
    executionTime: number;
    timestamp: string;
}

// ============================================
// Skill Chain (鏈式執行) v2
// ============================================

export interface SkillChainStep {
    /** 步驟 ID（用於引用） */
    stepId?: string;

    /** Skill ID */
    skillId: string;

    /** 輸入參數 (支援 $previous、$stepId.field 引用) */
    input: Record<string, unknown>;

    /** 條件執行（可選） */
    condition?: {
        /** 條件表達式，例如: "$step1.data.annual.net > 1000000" */
        expression: string;
        /** 條件為 false 時跳過此步驟 */
        skipIfFalse?: boolean;
    };
}

export interface SkillChainResult {
    success: boolean;
    steps: SkillExecutionResult[];
    totalExecutionTime: number;
    finalOutput?: unknown;
    /** 執行路徑（記錄實際執行的 stepId） */
    executionPath?: string[];
}

// ============================================
// Skill Registry 介面
// ============================================

export interface ISkillRegistry {
    register<TInput, TOutput>(skill: SkillDefinition<TInput, TOutput>): void;
    get(id: string): SkillDefinition | undefined;
    list(): SkillDefinition[];
    search(query: string | string[]): SkillDefinition[];
    getByCategory(category: SkillCategory): SkillDefinition[];
    getByTags(tags: SkillTag[]): SkillDefinition[];
}

// ============================================
// 常用 Zod Schema（可複用）
// ============================================

export const CommonSchemas = {
    /** 正整數 */
    positiveInt: z.number().int().positive(),

    /** 非負整數 */
    nonNegativeInt: z.number().int().nonnegative(),

    /** 百分比 (0-100) */
    percentage: z.number().min(0).max(100),

    /** 月薪 */
    monthlySalary: z.number().min(0).max(10000000),

    /** 年收入 */
    annualIncome: z.number().min(0).max(100000000),

    /** 布林值 */
    boolean: z.boolean(),

    /** 信心度 (0-1) */
    confidence: z.number().min(0).max(1),
};

// ============================================
// 輔助函數
// ============================================

/** 建立標準化的 Skill 結果 */
export function createSkillResult<T>(
    data: T,
    meta: Omit<SkillResultMeta, 'executedAt'>,
    options?: {
        assumptions?: Record<string, number | string>;
        confidence?: number;
        risks?: string[];
        nextSuggestions?: { skillId: string; reason: string }[];
    }
): SkillResultV2<T> {
    return {
        success: true,
        data,
        assumptions: options?.assumptions ?? {},
        confidence: options?.confidence ?? 0.9,
        risks: options?.risks ?? [],
        nextSuggestions: options?.nextSuggestions ?? [],
        meta: {
            ...meta,
            executedAt: new Date().toISOString(),
        },
    };
}

