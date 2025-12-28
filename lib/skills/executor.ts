/**
 * TaiCalc Skill Executor - 執行引擎
 * 負責驗證輸入、執行 Skill、記錄日誌
 */

import { SkillDefinition, SkillExecutionResult, SkillChainStep, SkillChainResult } from './types';
import { skillRegistry } from './registry';
import { SkillLogger } from '@/lib/db/logger';

/**
 * 執行單一 Skill
 */
export async function executeSkill<TInput, TOutput>(
    skillId: string,
    input: TInput,
    source: 'api' | 'chat' | 'chain' = 'api'
): Promise<SkillExecutionResult<TOutput>> {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();

    // 取得 Skill
    const skill = skillRegistry.get(skillId) as SkillDefinition<TInput, TOutput> | undefined;
    if (!skill) {
        const result = {
            success: false as const,
            skillId,
            error: `找不到 Skill: ${skillId}`,
            executionTime: Date.now() - startTime,
            timestamp,
        };
        // 記錄失敗日誌
        await SkillLogger.logExecution({
            skillId,
            input,
            durationMs: result.executionTime,
            success: false,
            error: result.error,
            timestamp: new Date(),
            source,
        });
        return result;
    }

    try {
        // 驗證輸入
        const validationResult = skill.inputSchema.safeParse(input);
        if (!validationResult.success) {
            const result = {
                success: false as const,
                skillId,
                error: `輸入驗證失敗: ${validationResult.error.message}`,
                executionTime: Date.now() - startTime,
                timestamp,
            };
            await SkillLogger.logExecution({
                skillId,
                input,
                durationMs: result.executionTime,
                success: false,
                error: result.error,
                timestamp: new Date(),
                source,
            });
            return result;
        }

        // 執行 Skill
        const output = await skill.execute(validationResult.data);

        // 驗證輸出
        const outputValidation = skill.outputSchema.safeParse(output);
        if (!outputValidation.success) {
            console.warn(`[Executor] Skill ${skillId} 輸出驗證失敗:`, outputValidation.error);
        }

        const result = {
            success: true as const,
            skillId,
            data: output,
            executionTime: Date.now() - startTime,
            timestamp,
        };

        // 記錄成功日誌
        await SkillLogger.logExecution({
            skillId,
            input,
            output,
            durationMs: result.executionTime,
            success: true,
            timestamp: new Date(),
            source,
        });

        return result;
    } catch (error) {
        const result = {
            success: false as const,
            skillId,
            error: error instanceof Error ? error.message : '執行發生未知錯誤',
            executionTime: Date.now() - startTime,
            timestamp,
        };
        await SkillLogger.logExecution({
            skillId,
            input,
            durationMs: result.executionTime,
            success: false,
            error: result.error,
            timestamp: new Date(),
            source,
        });
        return result;
    }
}

/**
 * 執行 Skill Chain (鏈式執行)
 */
export async function executeSkillChain(
    steps: SkillChainStep[]
): Promise<SkillChainResult> {
    const results: SkillExecutionResult[] = [];
    let previousOutput: unknown = null;
    const startTime = Date.now();

    for (const step of steps) {
        // 處理 $previous 引用
        const resolvedInput = resolveReferences(step.input, previousOutput);

        const result = await executeSkill(step.skillId, resolvedInput);
        results.push(result);

        if (!result.success) {
            return {
                success: false,
                steps: results,
                totalExecutionTime: Date.now() - startTime,
            };
        }

        previousOutput = result.data;
    }

    return {
        success: true,
        steps: results,
        totalExecutionTime: Date.now() - startTime,
        finalOutput: previousOutput,
    };
}

/**
 * 解析 $previous 引用
 * 例如: "$previous.annual.gross" => previousOutput.annual.gross
 */
function resolveReferences(
    input: Record<string, unknown>,
    previousOutput: unknown
): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
        if (typeof value === 'string' && value.startsWith('$previous')) {
            const path = value.replace('$previous', '').replace(/^\./, '');
            resolved[key] = path ? getNestedValue(previousOutput, path) : previousOutput;
        } else {
            resolved[key] = value;
        }
    }

    return resolved;
}

/**
 * 取得嵌套物件的值
 */
function getNestedValue(obj: unknown, path: string): unknown {
    return path.split('.').reduce((acc: unknown, key) => {
        if (acc && typeof acc === 'object' && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, obj);
}
