import Link from 'next/link';
import { Calculator, TrendingUp, Home, Sparkles, PiggyBank, Star } from 'lucide-react';
import type { SkillMeta } from '@/lib/skills/uiCatalog';

interface Props {
    skills: SkillMeta[];
}

const categoryIcons: Record<string, React.ReactNode> = {
    salary: <Calculator className="w-5 h-5" />,
    tax: <PiggyBank className="w-5 h-5" />,
    investment: <TrendingUp className="w-5 h-5" />,
    mortgage: <Home className="w-5 h-5" />,
    lifestyle: <Star className="w-5 h-5" />,
    fortune: <Sparkles className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
    salary: 'from-blue-500 to-indigo-500',
    tax: 'from-emerald-500 to-teal-500',
    investment: 'from-purple-500 to-pink-500',
    mortgage: 'from-orange-500 to-red-500',
    lifestyle: 'from-amber-500 to-orange-500',
    fortune: 'from-indigo-500 to-purple-500',
};

export function SkillGrid({ skills }: Props) {
    if (skills.length === 0) {
        return (
            <div className="text-center py-16">
                <p className="text-slate-500">沒有找到符合條件的工具</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
                <Link
                    key={skill.id}
                    href={skill.href}
                    className="group glass-card rounded-2xl p-5 hover:shadow-lg transition-all"
                >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${categoryColors[skill.category] || 'from-slate-500 to-slate-600'
                                }`}
                        >
                            {categoryIcons[skill.category] || <Calculator className="w-5 h-5" />}
                        </div>
                        {skill.isFeatured && (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] font-medium rounded-full">
                                推薦
                            </span>
                        )}
                    </div>

                    {/* Content */}
                    <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors mb-1">
                        {skill.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{skill.oneLiner}</p>

                    {/* Tags */}
                    {skill.tags && skill.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {skill.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] rounded-full"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </Link>
            ))}
        </div>
    );
}
