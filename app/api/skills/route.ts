/**
 * Skills List API
 * GET /api/skills
 * 
 * 列出所有可用的 Skill
 */

import { NextResponse } from 'next/server';
import { skillRegistry } from '@/lib/skills/registry';

export async function GET() {
    const skills = skillRegistry.list().map(skill => ({
        id: skill.id,
        name: skill.name,
        description: skill.description,
        version: skill.version,
        tags: skill.tags,
        parameterDescriptions: skill.parameterDescriptions,
    }));

    return NextResponse.json({
        count: skills.length,
        skills,
    });
}
