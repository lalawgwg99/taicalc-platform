/**
 * Skill API 端點
 * POST /api/skills/[skillId]
 * 
 * 執行指定的 Skill
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeSkill } from '@/lib/skills/executor';
import { skillRegistry } from '@/lib/skills/registry';
import { extractSchemaFields, generateDefaultValues } from '@/lib/skills/schema-parser';

export const runtime = 'edge';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ skillId: string }> }
) {
    try {
        const { skillId } = await params;
        const body = await request.json();
        const { input } = body;

        // 驗證 Skill 存在
        const skill = skillRegistry.get(skillId);
        if (!skill) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Skill not found: ${skillId}`,
                    availableSkills: skillRegistry.list().map(s => s.id),
                },
                { status: 404 }
            );
        }

        // 執行 Skill
        const result = await executeSkill(skillId, input);

        return NextResponse.json(result);
    } catch (error) {
        console.error('[Skill API Error]', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Internal server error',
            },
            { status: 500 }
        );
    }
}

// GET: 取得 Skill 資訊（含 Schema 元資料）
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ skillId: string }> }
) {
    const { skillId } = await params;
    const skill = skillRegistry.get(skillId);

    if (!skill) {
        return NextResponse.json(
            { error: `Skill not found: ${skillId}` },
            { status: 404 }
        );
    }

    // 解析 Schema 元資料
    const fields = extractSchemaFields(skill.inputSchema, skill.parameterDescriptions);
    const defaultValues = generateDefaultValues(fields);

    // 返回 Skill 元資訊 + 表單結構
    return NextResponse.json({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        version: skill.version,
        tags: skill.tags,
        parameterDescriptions: skill.parameterDescriptions,
        // 表單生成用
        fields,
        defaultValues,
    });
}

