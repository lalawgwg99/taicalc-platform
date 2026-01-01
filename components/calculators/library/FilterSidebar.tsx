'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { categories } from '@/lib/skills/uiCatalog';

interface Props {
    className?: string;
}

export function FilterSidebar({ className = '' }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentQuery = searchParams.get('q') || '';
    const currentCategory = searchParams.get('cat') || 'all';

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== 'all') {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`/calculators?${params.toString()}`);
    };

    return (
        <aside className={`space-y-6 ${className}`}>
            {/* Search */}
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">搜尋</label>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={currentQuery}
                        onChange={(e) => updateParams('q', e.target.value)}
                        placeholder="搜尋工具..."
                        className="w-full pl-9 pr-4 py-2.5 glass-input rounded-xl text-sm"
                    />
                </div>
            </div>

            {/* Categories */}
            <div>
                <label className="block text-xs font-medium text-slate-500 mb-2">分類</label>
                <div className="space-y-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => updateParams('cat', cat.id)}
                            className={`w-full px-3 py-2 rounded-lg text-left text-sm transition-colors ${currentCategory === cat.id
                                    ? 'bg-indigo-50 text-indigo-600 font-medium'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>
        </aside>
    );
}
