'use client';

import React from 'react';
import CalculatorPageShell from '@/components/calculators/CalculatorPageShell';
import { SKILL_UI_CATALOG } from '@/lib/skills/uiCatalog';
import { publicExecute } from '@/lib/publicExecute';

export default function TaxCalculatorPage() {
    const customUi = {
        ...SKILL_UI_CATALOG['tax.calculate'],
        title: '所得稅精算戰情室',
        description: '不僅是計算，更是節稅佈局。掌握免稅額與扣除額的交互影響。'
    };

    return (
        <CalculatorPageShell
            skillId="tax.calculate"
            ui={customUi}
            onExecute={(input) => publicExecute('tax.calculate', input)}
        />
    );
}
