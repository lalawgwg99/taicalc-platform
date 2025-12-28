'use client';

import React from 'react';
import CalculatorPageShell from '@/components/calculators/CalculatorPageShell';
import { SKILL_UI_CATALOG } from '@/lib/skills/uiCatalog';
import { publicExecute } from '@/lib/publicExecute';

export default function MortgageCalculatorPage() {
    const customUi = {
        ...SKILL_UI_CATALOG['mortgage.calculate'],
        title: '房貸決策戰情室',
        description: '精算新青安與寬限期影響，為您的置產佈局提供清晰視野。'
    };

    return (
        <CalculatorPageShell
            skillId="mortgage.calculate"
            ui={customUi}
            onExecute={(input) => publicExecute('mortgage.calculate', input)}
        />
    );
}
