/**
 * TaiCalc Skill Registry - 技能註冊中心
 * 管理所有 Skill 的註冊、查詢、搜尋
 */

import { SkillDefinition, ISkillRegistry } from './types';

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
            // 比對標籤
            const hasMatchingTag = skill.tags.some(tag =>
                lowerTags.some(q => tag.toLowerCase().includes(q))
            );

            // 比對名稱或描述
            const matchesName = lowerTags.some(q =>
                skill.name.toLowerCase().includes(q) ||
                skill.description.toLowerCase().includes(q)
            );

            return hasMatchingTag || matchesName;
        });
    }

    /**
     * 取得所有 Skill 的摘要（供 AI 使用）
     */
    getSummary(): { id: string; name: string; description: string; tags: string[] }[] {
        return this.list().map(({ id, name, description, tags }) => ({
            id, name, description, tags
        }));
    }
}

// Singleton instance
export const skillRegistry = new SkillRegistry();
export default skillRegistry;
