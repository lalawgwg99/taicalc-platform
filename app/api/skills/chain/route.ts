/**
 * Skill Chain API
 * POST /api/skills/chain
 * 
 * 鏈式執行多個 Skill
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeSkillChain } from '@/lib/skills';
import { SkillChainStep } from '@/lib/skills/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { skills } = body as { skills: SkillChainStep[] };

        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid request: skills array is required',
                    example: {
                        skills: [
                            { skillId: 'salary.analyze', input: { monthlySalary: 50000 } },
                            { skillId: 'tax.calculate', input: { annualIncome: '$previous.annual.gross' } }
                        ]
                    }
                },
                { status: 400 }
            );
        }

        // 執行 Skill Chain
        const result = await executeSkillChain(skills);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[Skill Chain API Error]', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}
