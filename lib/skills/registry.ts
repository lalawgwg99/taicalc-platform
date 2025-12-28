/**
 * TaiCalc Skill Registry v2 - 技能註冊中心
 * 管理所有 Skill 的註冊、查詢、搜尋、分類
 */

import { SkillDefinition, ISkillRegistry, SkillCategory, SkillTag } from './types';

class SkillRegistry implements ISkillRegistry {
    private skills: Map<string, SkillDefinition> = new Map();

    /**
     * 註冊 Skill
     */
    register<TInput, TOutput>(skill: SkillDefinition<TInput, TOutput>): void {
        if (this.skills.has(skill.id)) {
            console.warn(`[SkillRegistry] Skill "${skill.id}" 已存在，將被覆蓋`);
        }
        this.skills.set(skill.id, skill as SkillDefinition);
        console.log(`[SkillRegistry] 已註冊 Skill: ${skill.id} (${skill.name})`);
    }

    /**
     * 取得 Skill
     */
    get(id: string): SkillDefinition | undefined {
        return this.skills.get(id);
    }

    /**
     * 列出所有 Skill
     */
    list(): SkillDefinition[] {
        return Array.from(this.skills.values());
    }

    /**
     * 搜尋 Skill (依標籤或關鍵字)
     */
    search(query: string | string[]): SkillDefinition[] {
        const tags = Array.isArray(query) ? query : [query];
        const lowerTags = tags.map(t => t.toLowerCase());

        return this.list().filter(skill => {
            const hasMatchingTag = skill.tags.some(tag =>
                lowerTags.some(q => String(tag).toLowerCase().includes(q))
            );
            const matchesName = lowerTags.some(q =>
                skill.name.toLowerCase().includes(q) ||
                skill.description.toLowerCase().includes(q)
            );
            return hasMatchingTag || matchesName;
        });
    }

    /**
     * 依類別取得 Skill
     */
    getByCategory(category: SkillCategory): SkillDefinition[] {
        return this.list().filter(skill => skill.category === category);
    }

    /**
     * 依標籤取得 Skill（符合任一標籤即可）
     */
    getByTags(tags: SkillTag[]): SkillDefinition[] {
        return this.list().filter(skill =>
            skill.tags.some(tag => tags.includes(tag as SkillTag))
        );
    }

    /**
     * 取得所有 Skill 的摘要（供 AI 使用）
     */
    getSummary(): { id: string; name: string; description: string; category: string; tags: string[] }[] {
        return this.list().map(({ id, name, description, category, tags }) => ({
            id, name, description, category: category || 'financial', tags: tags as string[]
        }));
    }

    /**
     * 取得所有 Skill 的 Map（供 AI Tool Calling 使用）
     */
    getAll(): Map<string, SkillDefinition> {
        return this.skills;
    }

    /**
     * 取得 Financial Skill（排除 Entertainment）
     */
    getFinancialSkills(): SkillDefinition[] {
        return this.list().filter(skill =>
            skill.category === 'financial' || !skill.category
        );
    }

    /**
     * 取得 Entertainment Skill
     */
    getEntertainmentSkills(): SkillDefinition[] {
        return this.list().filter(skill => skill.category === 'entertainment');
    }
}

// Singleton instance
export const skillRegistry = new SkillRegistry();
export default skillRegistry;

