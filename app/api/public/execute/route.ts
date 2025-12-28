// app/api/public/execute/route.ts
import { NextResponse } from 'next/server';
export const runtime = 'edge';

import { executeSkill } from '@/lib/skills';
import type { SkillId } from '@/lib/skills/uiTypes';

// 白名單：允許前端公開呼叫的 Skill
const ALLOWLIST: SkillId[] = [
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
    'fortune.analyze',
    'articles.generate', // 暫時開放
    'articles.trending',
];

export async function POST(req: Request) {
    const body = await req.json().catch(() => null);
    const skillId = body?.skillId as SkillId | undefined;
    const input = body?.input as Record<string, any> | undefined;

    if (!skillId || !ALLOWLIST.includes(skillId)) {
        return NextResponse.json({ error: 'Invalid or unauthorized skillId' }, { status: 400 });
    }

    try {
        // 呼叫內部 executor，source 標記為 api
        const result = await executeSkill(skillId, input ?? {}, 'api');
        return NextResponse.json(result, { status: 200 });
    } catch (e: any) {
        console.error(`[PublicExecute] Error executing ${skillId}:`, e);
        return NextResponse.json(
            { error: e?.message ?? 'Execution failed' },
            { status: 500 }
        );
    }
}
