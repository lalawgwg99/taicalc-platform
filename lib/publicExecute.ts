import type { SkillId } from '@/lib/skills/uiTypes';

export async function publicExecute(skillId: SkillId, input: Record<string, any>) {
    const res = await fetch('/api/public/execute', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ skillId, input }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error ?? '執行失敗');
    }
    return res.json();
}
