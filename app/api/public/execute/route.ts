// app/api/public/execute/route.ts
// 重要：此 API 只允許 Remote Skills（需要後端/AI 的功能）
// Local Skills（salary/mortgage/tax/capital）應在前端直接計算

import { NextResponse } from 'next/server';
export const runtime = 'edge';

import { executeSkill } from '@/lib/skills';
import type { SkillId } from '@/lib/skills/uiTypes';
import {
    checkRateLimit,
    rateLimitHeaders,
    rateLimitExceededResponse,
    AI_RATE_LIMIT
} from '@/lib/rateLimit';

/**
 * Remote-only Skills：需要後端執行的功能
 * - 需要 API Key（AI/LLM）
 * - 需要外部服務串接
 * - 有成本控制需求
 */
const REMOTE_SKILLS: SkillId[] = [
    'fortune.analyze',      // AI 財運分析（需要 Gemini API）
    'articles.generate',    // AI 文章生成
    'articles.trending',    // 熱門話題（需外部 API）
];

/**
 * Local-only Skills：應在前端直接計算
 * 這些 skills 不再透過 API 暴露
 */
const LOCAL_SKILLS: SkillId[] = [
    'salary.analyze',
    'salary.reverse',
    'salary.structure',
    'tax.calculate',
    'tax.optimize',
    'capital.growth',
    'capital.fire',
    'capital.goalReverse',
    'capital.passiveIncome',
    'capital.milestones',
    'mortgage.calculate',
    'mortgage.refinance',
    'mortgage.earlyRepayment',
];

export async function POST(req: Request) {
    // Rate Limiting（AI 端點較嚴格）
    const rateCheck = checkRateLimit(req, AI_RATE_LIMIT);
    if (!rateCheck.allowed) {
        return rateLimitExceededResponse(rateCheck.resetAt);
    }

    // 解析請求
    const body = await req.json().catch(() => null);
    if (!body) {
        return NextResponse.json(
            { code: 'INVALID_REQUEST', error: 'Invalid request format' },
            { status: 400, headers: { ...rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt), 'Cache-Control': 'no-store' } }
        );
    }

    const skillId = body?.skillId as SkillId | undefined;
    const input = body?.input as Record<string, any> | undefined;

    // 驗證 skillId
    if (!skillId) {
        return NextResponse.json(
            { code: 'MISSING_SKILL_ID', error: 'Missing skillId parameter' },
            { status: 400, headers: { ...rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt), 'Cache-Control': 'no-store' } }
        );
    }

    // 檢查是否為 Remote Skill
    if (!REMOTE_SKILLS.includes(skillId)) {
        // 如果是 Local Skill，提示應在前端計算
        if (LOCAL_SKILLS.includes(skillId)) {
            return NextResponse.json(
                {
                    code: 'SKILL_NOT_ALLOWED',
                    error: 'This skill is local-only. Please execute on client.',
                    skillId
                },
                { status: 403, headers: { ...rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt), 'Cache-Control': 'no-store' } }
            );
        }

        return NextResponse.json(
            { code: 'SKILL_NOT_FOUND', error: 'Unknown skillId' },
            { status: 404, headers: { ...rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt), 'Cache-Control': 'no-store' } }
        );
    }

    try {
        // 呼叫內部 executor，source 標記為 api
        const result = await executeSkill(skillId, input ?? {}, 'api');
        return NextResponse.json(result, {
            status: 200,
            headers: rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt)
        });
    } catch (e: any) {
        // 錯誤處理：不洩漏堆疊追蹤
        console.error(`[PublicExecute] Error executing ${skillId}:`, e?.message);
        return NextResponse.json(
            { error: '執行失敗，請稍後再試' },
            { status: 500, headers: rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt) }
        );
    }
}

// 健康檢查
export async function GET() {
    return NextResponse.json({
        status: 'ok',
        availableSkills: REMOTE_SKILLS,
        note: 'Local skills (salary/mortgage/tax/capital) should be calculated in frontend'
    });
}

