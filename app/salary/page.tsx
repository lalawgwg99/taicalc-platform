'use client';

import React from 'react';
import CalculatorPageShell from '@/components/calculators/CalculatorPageShell';
import { SKILL_UI_CATALOG } from '@/lib/skills/uiCatalog';
import { publicExecute } from '@/lib/publicExecute';

export default function SalaryCalculatorPage() {
    const customUi = {
        ...SKILL_UI_CATALOG['salary.analyze'],
        // 可以在這裡覆蓋特定設定，例如標題或描述
        title: '薪資戰略中樞',
        description: '不僅是計算，更是佈局。掌握談判籌碼與資產主動權。'
    };

    return (
        <CalculatorPageShell
            skillId="salary.analyze"
            ui={customUi}
            onExecute={(input) => publicExecute('salary.analyze', input)}
        />
    );
}
