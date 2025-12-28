/**
 * TaiCalc Skill System - 主入口
 * 統一註冊所有 Skill
 */

// 核心模組
export * from './types';
export * from './registry';
export * from './executor';

// Skill 實作
import { skillRegistry } from './registry';
import { salarySkills } from './implementations/salary.skill';
import { taxSkills } from './implementations/tax.skill';
import { capitalSkills } from './implementations/capital.skill';
import { mortgageSkills } from './implementations/mortgage.skill';

// 註冊所有 Skill
function registerAllSkills() {
    const allSkills = [
        ...salarySkills,
        ...taxSkills,
        ...capitalSkills,
        ...mortgageSkills,
    ] as const;

    allSkills.forEach(skill => {
        // 使用類型斷言繞過嚴格的泛型檢查
        skillRegistry.register(skill as any);
    });

    console.log(`[TaiCalc Skills] 已註冊 ${allSkills.length} 個 Skill`);
}

// 自動初始化
registerAllSkills();

// 導出 registry 供外部使用
export { skillRegistry };
export { salarySkills } from './implementations/salary.skill';
export { taxSkills } from './implementations/tax.skill';
export { capitalSkills } from './implementations/capital.skill';
export { mortgageSkills } from './implementations/mortgage.skill';
