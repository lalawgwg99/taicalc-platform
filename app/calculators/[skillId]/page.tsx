'use client';
export const runtime = 'edge';

import React from 'react';
import { useParams, notFound } from 'next/navigation';
import CalculatorPageShell from '@/components/calculators/CalculatorPageShell';
import { getSkillUI } from '@/lib/skills/uiCatalog';
import type { SkillId } from '@/lib/skills/uiTypes';
import { publicExecute } from '@/lib/publicExecute';
import { adaptResult } from '@/lib/adapters';
import '@/lib/adapters/implementations'; // Register adapters

export default function CalculatorSkillPage() {
    const params = useParams();
    const skillId = params.skillId as SkillId;

    const uiConfig = getSkillUI(skillId);

    if (!uiConfig) {
        notFound();
        return null;
    }

    // Construct legacy UI object if needed, or update Shell to make it optional
    // Shell expects 'ui' for title/description fallback
    const legacyUI = {
        title: uiConfig.title || uiConfig.id,
        description: uiConfig.oneLiner, // Use one-liner as description
    };

    return (
        <CalculatorPageShell
            skillId={skillId}
            ui={legacyUI as any}
            uiConfig={uiConfig}
            onExecute={async (input) => {
                const res = await publicExecute(skillId, input);
                if ((res as any).success === false) return res;
                // Extracts data part if standard response
                const data = (res as any).data || res;
                return adaptResult(skillId, input, data);
            }}
        />
    );
}
