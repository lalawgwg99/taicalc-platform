// app/calculators/[skillId]/page.tsx
'use client';
export const runtime = 'edge';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import CalculatorPageShell from '@/components/calculators/CalculatorPageShell';
import { SKILL_UI_CATALOG } from '@/lib/skills/uiCatalog';
import type { SkillId } from '@/lib/skills/uiTypes';
import { publicExecute } from '@/lib/publicExecute';

export default function CalculatorSkillPage() {
    const params = useParams();
    const skillId = params.skillId as SkillId;

    // 驗證 skillId 是否存在於 catalog
    const ui = SKILL_UI_CATALOG[skillId];

    // 如果找不到對應的 UI 設定，顯示 404
    if (!ui) {
        notFound();
        return null;
    }

    return (
        <CalculatorPageShell
            skillId={skillId}
            ui={ui}
            onExecute={(input) => publicExecute(skillId, input)}
        />
    );
}
