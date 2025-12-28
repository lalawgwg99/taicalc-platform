/**
 * TaiCalc AI Orchestrator
 * 讓 AI 自動選擇並執行合適的 Skill
 */

import { skillRegistry } from './registry';
import { executeSkill } from './executor';
import { SkillDefinition, SkillExecutionResult } from './types';

interface OrchestratorRequest {
    /** 用戶的自然語言請求 */
    userQuery: string;
    /** 額外的上下文資訊 */
    context?: Record<string, unknown>;
}

interface OrchestratorResult {
    /** 是否成功識別並執行 */
    success: boolean;
    /** 識別到的意圖 */
    intent?: string;
    /** 選擇的 Skill */
    selectedSkill?: string;
    /** 提取的參數 */
    extractedParams?: Record<string, unknown>;
    /** 執行結果 */
    executionResult?: SkillExecutionResult;
    /** 格式化的回覆 */
    formattedResponse?: string;
    /** 錯誤訊息 */
    error?: string;
}

// 意圖關鍵字映射
const INTENT_MAPPINGS: Record<string, { skillId: string; keywords: string[] }[]> = {
    salary: [
        { skillId: 'salary.analyze', keywords: ['薪資', '月薪', '年薪', '實領', '勞健保', 'salary'] },
        { skillId: 'salary.reverse', keywords: ['反推', '逆向', '多少月薪'] },
        { skillId: 'salary.structure', keywords: ['級距', '投保'] },
    ],
    tax: [
        { skillId: 'tax.calculate', keywords: ['所得稅', '報稅', '稅額', '繳稅'] },
        { skillId: 'tax.optimize', keywords: ['節稅', '省稅', '税務優化'] },
    ],
    capital: [
        { skillId: 'capital.growth', keywords: ['複利', '投資', '資產成長'] },
        { skillId: 'capital.fire', keywords: ['FIRE', '財務自由', '退休'] },
        { skillId: 'capital.goalReverse', keywords: ['目標', '存多少', '每月投入'] },
        { skillId: 'capital.passiveIncome', keywords: ['被動收入', '股息', '殖利率'] },
        { skillId: 'capital.milestones', keywords: ['里程碑', '百萬', '千萬'] },
    ],
    mortgage: [
        { skillId: 'mortgage.calculate', keywords: ['房貸', '月付', '房屋貸款'] },
        { skillId: 'mortgage.refinance', keywords: ['轉貸', '換銀行'] },
        { skillId: 'mortgage.earlyRepayment', keywords: ['提前還款', '額外還款'] },
    ],
};

/**
 * 基於關鍵字的意圖識別
 */
function detectIntent(query: string): { skillId: string; confidence: number } | null {
    const lowerQuery = query.toLowerCase();

    let bestMatch: { skillId: string; confidence: number } | null = null;

    for (const [category, mappings] of Object.entries(INTENT_MAPPINGS)) {
        for (const mapping of mappings) {
            const matchedKeywords = mapping.keywords.filter(kw =>
                lowerQuery.includes(kw.toLowerCase())
            );

            if (matchedKeywords.length > 0) {
                const confidence = matchedKeywords.length / mapping.keywords.length;
                if (!bestMatch || confidence > bestMatch.confidence) {
                    bestMatch = { skillId: mapping.skillId, confidence };
                }
            }
        }
    }

    return bestMatch;
}

/**
 * 從查詢中提取數值參數
 */
function extractNumericParams(query: string): Record<string, number> {
    const params: Record<string, number> = {};

    // 提取金額 (例如: "50000元", "5萬", "100萬")
    const amountMatches = query.match(/(\d+(?:\.\d+)?)\s*(萬|千萬|億|元)?/g);
    if (amountMatches) {
        amountMatches.forEach((match, index) => {
            const numMatch = match.match(/(\d+(?:\.\d+)?)\s*(萬|千萬|億|元)?/);
            if (numMatch) {
                let value = parseFloat(numMatch[1]);
                const unit = numMatch[2];

                if (unit === '萬') value *= 10000;
                else if (unit === '千萬') value *= 10000000;
                else if (unit === '億') value *= 100000000;

                // 根據上下文猜測參數名
                if (query.includes('月薪') || query.includes('薪資')) {
                    params.monthlySalary = value;
                } else if (query.includes('年薪') || query.includes('年收')) {
                    params.annualIncome = value;
                } else if (query.includes('貸款') || query.includes('房貸')) {
                    params.loanAmount = value;
                } else {
                    params[`amount${index}`] = value;
                }
            }
        });
    }

    // 提取年限 (例如: "30年")
    const yearMatch = query.match(/(\d+)\s*年/);
    if (yearMatch) {
        params.years = parseInt(yearMatch[1]);
    }

    // 提取利率 (例如: "2.15%")
    const rateMatch = query.match(/(\d+(?:\.\d+)?)\s*%/);
    if (rateMatch) {
        params.rate = parseFloat(rateMatch[1]);
    }

    return params;
}

/**
 * 執行 Orchestrator
 */
export async function orchestrate(request: OrchestratorRequest): Promise<OrchestratorResult> {
    const { userQuery, context = {} } = request;

    // 1. 意圖識別
    const intent = detectIntent(userQuery);
    if (!intent) {
        return {
            success: false,
            error: '無法識別您的需求，請嘗試更具體的描述',
        };
    }

    // 2. 參數提取
    const extractedParams = {
        ...extractNumericParams(userQuery),
        ...context,
    };

    // 3. 取得 Skill
    const skill = skillRegistry.get(intent.skillId);
    if (!skill) {
        return {
            success: false,
            error: `找不到對應的功能: ${intent.skillId}`,
        };
    }

    // 4. 執行 Skill
    try {
        const result = await executeSkill(intent.skillId, extractedParams);

        return {
            success: result.success,
            intent: intent.skillId,
            selectedSkill: skill.name,
            extractedParams,
            executionResult: result,
            formattedResponse: result.success
                ? `已為您執行「${skill.name}」`
                : result.error,
        };
    } catch (error) {
        return {
            success: false,
            intent: intent.skillId,
            error: error instanceof Error ? error.message : '執行失敗',
        };
    }
}

/**
 * 取得 Orchestrator 可用的 Skill 摘要
 * 供 LLM 做 Function Calling 使用
 */
export function getSkillsForLLM(): string {
    const skills = skillRegistry.list();

    return skills.map(skill => {
        const params = skill.parameterDescriptions
            ? Object.entries(skill.parameterDescriptions)
                .map(([key, desc]) => `    - ${key}: ${desc}`)
                .join('\n')
            : '    (無參數)';

        return `## ${skill.name} (${skill.id})
${skill.description}
標籤: ${skill.tags.join(', ')}
參數:
${params}`;
    }).join('\n\n');
}

export default orchestrate;
