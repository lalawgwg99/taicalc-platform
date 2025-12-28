// lib/skills/getSkillUI.ts
import type { SkillId } from './uiTypes';
import { SKILL_UI_CATALOG } from './uiCatalog';

export function getSkillUI(skillId: SkillId) {
    return SKILL_UI_CATALOG[skillId];
}
