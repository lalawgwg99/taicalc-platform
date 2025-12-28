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
 * 執行 Skill Chain (鏈式執行) v2 - 支援條件分支
 */
export async function executeSkillChain(
    steps: SkillChainStep[]
): Promise<SkillChainResult> {
    const results: SkillExecutionResult[] = [];
    const stepResults: Map<string, SkillExecutionResult> = new Map();
    let previousOutput: unknown = null;
    const startTime = Date.now();
    const executionPath: string[] = [];

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        const stepId = step.stepId || `step${i}`;

        // 條件檢查
        if (step.condition) {
            const conditionMet = evaluateCondition(
                step.condition.expression,
                previousOutput,
                stepResults
            );

            if (!conditionMet) {
                if (step.condition.skipIfFalse) {
                    // 條件不符且設定跳過，繼續下一步
                    console.log(`[Chain] 跳過步驟 ${stepId}：條件不符`);
                    continue;
                }
                // 條件不符但非跳過模式，視為執行失敗
                return {
                    success: false,
                    steps: results,
                    totalExecutionTime: Date.now() - startTime,
                    executionPath,
                };
            }
        }

        // 處理引用（$previous 與 $stepId.field）
        const resolvedInput = resolveAllReferences(
            step.input,
            previousOutput,
            stepResults
        );

        const result = await executeSkill(step.skillId, resolvedInput, 'chain');
        results.push(result);
        stepResults.set(stepId, result);
        executionPath.push(stepId);

        if (!result.success) {
            return {
                success: false,
                steps: results,
                totalExecutionTime: Date.now() - startTime,
                executionPath,
            };
        }

        previousOutput = result.data;
    }

    return {
        success: true,
        steps: results,
        totalExecutionTime: Date.now() - startTime,
        finalOutput: previousOutput,
        executionPath,
    };
}

/**
 * 評估條件表達式
 * 支援: $previous.field > 100, $step1.data.value === 'test', etc.
 */
function evaluateCondition(
    expression: string,
    previousOutput: unknown,
    stepResults: Map<string, SkillExecutionResult>
): boolean {
    try {
        // 建立安全的上下文物件
        const context: Record<string, unknown> = {
            $previous: previousOutput,
        };

        // 加入所有步驟結果
        for (const [stepId, result] of stepResults) {
            context[`$${stepId}`] = result;
        }

        // 解析表達式中的變數引用
        let resolvedExpression = expression;

        // 替換 $stepId.path 格式的引用
        const stepRefPattern = /\$(\w+)((?:\.\w+)+)?/g;
        resolvedExpression = resolvedExpression.replace(stepRefPattern, (match, refId, path) => {
            const fullRef = path ? `$${refId}${path}` : `$${refId}`;
            const value = resolveReference(fullRef, previousOutput, stepResults);

            if (typeof value === 'string') {
                return JSON.stringify(value);
            }
            if (value === undefined || value === null) {
                return 'null';
            }
            if (typeof value === 'object') {
                return JSON.stringify(value);
            }
            return String(value);
        });

        // 安全評估（僅支援比較運算）
        // 支援: >, <, >=, <=, ===, !==, &&, ||
        const safeExpression = resolvedExpression
            .replace(/[^0-9a-zA-Z_\s\.\>\<\=\!\&\|\"\'\[\]\{\}\:\,\-]/g, '');

        // eslint-disable-next-line no-new-func
        const evalFn = new Function(`return ${safeExpression}`);
        return Boolean(evalFn());
    } catch (error) {
        console.error('[Chain] 條件評估失敗:', expression, error);
        return false;
    }
}

/**
 * 解析所有引用（$previous 與 $stepId）
 */
function resolveAllReferences(
    input: Record<string, unknown>,
    previousOutput: unknown,
    stepResults: Map<string, SkillExecutionResult>
): Record<string, unknown> {
    const resolved: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(input)) {
        if (typeof value === 'string' && value.startsWith('$')) {
            resolved[key] = resolveReference(value, previousOutput, stepResults);
        } else if (typeof value === 'object' && value !== null) {
            // 遞迴處理巢狀物件
            resolved[key] = resolveAllReferences(
                value as Record<string, unknown>,
                previousOutput,
                stepResults
            );
        } else {
            resolved[key] = value;
        }
    }

    return resolved;
}

/**
 * 解析單一引用
 */
function resolveReference(
    ref: string,
    previousOutput: unknown,
    stepResults: Map<string, SkillExecutionResult>
): unknown {
    if (ref.startsWith('$previous')) {
        const path = ref.replace('$previous', '').replace(/^\./, '');
        return path ? getNestedValue(previousOutput, path) : previousOutput;
    }

    // 解析 $stepId.path 格式
    const match = ref.match(/^\$(\w+)((?:\.\w+)+)?$/);
    if (match) {
        const [, stepId, pathWithDot] = match;
        const stepResult = stepResults.get(stepId);
        if (!stepResult) {
            console.warn(`[Chain] 找不到步驟結果: ${stepId}`);
            return undefined;
        }

        if (!pathWithDot) {
            return stepResult;
        }

        const path = pathWithDot.replace(/^\./, '');
        return getNestedValue(stepResult, path);
    }

    return ref;
}

/**
 * 解析 $previous 引用（保留向下相容）
 * @deprecated 使用 resolveAllReferences
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

