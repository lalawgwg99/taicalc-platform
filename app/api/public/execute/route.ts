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
    AI_RATE_LIMIT
} from '@/lib/rateLimit';

/**
 * Remote-only Skills：需要後端執行的功能
 */
const REMOTE_SKILLS: SkillId[] = [
    'fortune.analyze',
    'articles.generate',
    'articles.trending',
];

/**
 * Local-only Skills：應在前端直接計算
 */
const LOCAL_SKILLS: SkillId[] = [
    'salary.analyze', 'salary.reverse', 'salary.structure',
    'tax.calculate', 'tax.optimize',
    'capital.growth', 'capital.fire', 'capital.goalReverse', 'capital.passiveIncome', 'capital.milestones',
    'mortgage.calculate', 'mortgage.refinance', 'mortgage.earlyRepayment',
];

// 標準錯誤 Headers
const ERROR_HEADERS = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
};

// 標準化錯誤回應
function errorResponse(
    code: string,
    message: string,
    status: number,
    details?: Record<string, any>,
    extraHeaders?: Record<string, string>
) {
    return NextResponse.json(
        {
            ok: false,
            error: { code, message, ...(details && { details }) }
        },
        { status, headers: { ...ERROR_HEADERS, ...extraHeaders } }
    );
}

// 標準化成功回應
function successResponse(data: any, extraHeaders?: Record<string, string>) {
    return NextResponse.json(
        { ok: true, data },
        { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', ...extraHeaders } }
    );
}

export async function POST(req: Request) {
    // Rate Limiting
    const rateCheck = checkRateLimit(req, AI_RATE_LIMIT);
    const rlHeaders = rateLimitHeaders(rateCheck.remaining, rateCheck.resetAt);

    if (!rateCheck.allowed) {
        const retryAfter = Math.ceil((rateCheck.resetAt - Date.now()) / 1000);
        return errorResponse(
            'RATE_LIMITED',
            '請求過於頻繁，請稍後再試',
            429,
            { retryAfter },
            { ...rlHeaders, 'Retry-After': retryAfter.toString() }
        );
    }

    // 解析請求
    const body = await req.json().catch(() => null);
    if (!body) {
        return errorResponse('VALIDATION_ERROR', 'Invalid JSON request body', 400, undefined, rlHeaders);
    }

    const skillId = body?.skillId as SkillId | undefined;
    const input = body?.input as Record<string, any> | undefined;

    if (!skillId) {
        return errorResponse('VALIDATION_ERROR', 'Missing skillId parameter', 400, undefined, rlHeaders);
    }

    // Local Skill → 403
    if (LOCAL_SKILLS.includes(skillId)) {
        return errorResponse(
            'SKILL_LOCAL_ONLY',
            'This skill must be executed on the client.',
            403,
            {
                skillId,
                allowed: REMOTE_SKILLS,
                hint: 'Use local calculator engine instead of /api/public/execute.'
            },
            rlHeaders
        );
    }

    // Unknown Skill → 404
    if (!REMOTE_SKILLS.includes(skillId)) {
        return errorResponse('SKILL_NOT_FOUND', 'Unknown skillId', 404, { skillId }, rlHeaders);
    }

    // 執行 Remote Skill
    try {
        const result = await executeSkill(skillId, input ?? {}, 'api');
        return successResponse(result, rlHeaders);
    } catch (e: any) {
        console.error(`[PublicExecute] Error executing ${skillId}:`, e?.message);
        return errorResponse('INTERNAL_ERROR', 'Execution failed', 500, undefined, rlHeaders);
    }
}

// 健康檢查
export async function GET() {
    return NextResponse.json({
        ok: true,
        availableSkills: REMOTE_SKILLS,
        note: 'Local skills should be calculated in frontend'
    });
}


