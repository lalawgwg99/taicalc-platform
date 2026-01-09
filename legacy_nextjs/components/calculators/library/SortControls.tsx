'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';

export function SortControls() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get('sort') || 'featured';

    const handleSortChange = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('sort', sort);
        router.push(`/calculators?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
                value={currentSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border-none bg-transparent text-slate-600 focus:outline-none cursor-pointer"
            >
                <option value="featured">推薦排序</option>
                <option value="priority">優先度</option>
            </select>
        </div>
    );
}
