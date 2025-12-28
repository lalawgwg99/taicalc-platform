'use client';

import React from 'react';
import CalculatorPageShell from '@/components/calculators/CalculatorPageShell';
import { SKILL_UI_CATALOG } from '@/lib/skills/uiCatalog';
import { publicExecute } from '@/lib/publicExecute';

export default function FortunePage() {
    const customUi = {
        ...SKILL_UI_CATALOG['fortune.analyze'],
        title: '財運命盤分析',
        description: '結合命理智慧與財務規劃，為您揭示財運趨勢與理財建議'
    };

    return (
        <CalculatorPageShell
            skillId="fortune.analyze"
            ui={customUi}
            onExecute={(input) => publicExecute('fortune.analyze', input)}
        />
    );
}
