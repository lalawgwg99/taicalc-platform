/**
 * TaiCalc Skill 系統 - 類型定義
 * 將計算函數封裝為標準化、可預測、可組合的 Skill
 */

import { z, ZodSchema } from 'zod';

// ============================================
// 核心 Skill 介面
// ============================================

export interface SkillDefinition<TInput = unknown, TOutput = unknown> {
    /** 唯一識別碼，格式: "domain.action" (e.g., "salary.analyze") */
    id: string;

    /** 顯示名稱 (繁體中文) */
    name: string;

    /** 功能描述 */
    description: string;

    /** 語義版本號 */
    version: string;

    /** 輸入驗證 Schema */
    inputSchema: ZodSchema<TInput>;

    /** 輸出驗證 Schema */
    outputSchema: ZodSchema<TOutput>;

    /** 執行函數 */
    execute: (input: TInput) => Promise<TOutput>;

    /** 分類標籤 */
    tags: string[];

    /** AI 可讀的參數說明 (用於 Orchestrator) */
    parameterDescriptions?: Record<string, string>;
}

// ============================================
// 執行結果
// ============================================

export interface SkillExecutionResult<TOutput = unknown> {
    /** 是否成功 */
    success: boolean;

    /** 執行的 Skill ID */
    skillId: string;

    /** 輸出資料 */
    data?: TOutput;

    /** 錯誤訊息 */
    error?: string;

    /** 執行時間 (毫秒) */
    executionTime: number;

    /** 執行時間戳 */
    timestamp: string;
}

// ============================================
// Skill Chain (鏈式執行)
// ============================================

export interface SkillChainStep {
    /** Skill ID */
    skillId: string;

    /** 輸入參數 (支援 $previous 引用上一步結果) */
    input: Record<string, unknown>;
}

export interface SkillChainResult {
    success: boolean;
    steps: SkillExecutionResult[];
    totalExecutionTime: number;
    finalOutput?: unknown;
}

// ============================================
// Skill Registry 介面
// ============================================

export interface ISkillRegistry {
    register<TInput, TOutput>(skill: SkillDefinition<TInput, TOutput>): void;
    get(id: string): SkillDefinition | undefined;
    list(): SkillDefinition[];
    search(query: string | string[]): SkillDefinition[];
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
};
