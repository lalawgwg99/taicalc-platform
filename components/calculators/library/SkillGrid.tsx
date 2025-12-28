import { SkillUIConfig } from "@/lib/skills/uiTypes";
import { SkillCard } from "./SkillCard";
import { Inbox } from "lucide-react";

interface SkillGridProps {
    skills: SkillUIConfig[];
}

export function SkillGrid({ skills }: SkillGridProps) {
    if (skills.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-slate-50/50">
                <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                    <Inbox className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">沒有找到符合的工具</h3>
                <p className="text-slate-500 mt-1 max-w-xs">
                    嘗試更換關鍵字，或使用「all」分類查看所有工具。
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {skills.map(skill => (
                <SkillCard key={skill.id} skill={skill} />
            ))}
        </div>
    );
}
