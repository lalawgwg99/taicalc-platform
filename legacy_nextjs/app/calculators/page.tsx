import { Suspense } from 'react';
import { Metadata } from 'next';
import { uiCatalog } from '@/lib/skills/uiCatalog';
import { FilterSidebar } from '@/components/calculators/library/FilterSidebar';
import { SortControls } from '@/components/calculators/library/SortControls';
import { SkillGrid } from '@/components/calculators/library/SkillGrid';
import { PreviewDrawer } from '@/components/calculators/library/PreviewDrawer';

export const metadata: Metadata = {
    title: '所有工具 | TaiCalc',
    description: 'TaiCalc 提供的所有財務試算工具總覽，包含薪資、稅務、資本、房貸與運勢分析。',
};

export const runtime = 'edge';

// Server-side filter function
function filterSkills(query: string, category: string, sort: string) {
    let filtered = [...uiCatalog];

    // Category filter
    if (category && category !== 'all') {
        filtered = filtered.filter((s) => s.category === category);
    }

    // Search filter
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(
            (s) =>
                s.id.toLowerCase().includes(q) ||
                (s.title || '').toLowerCase().includes(q) ||
                s.oneLiner.toLowerCase().includes(q) ||
                s.tags?.some((t) => t.toLowerCase().includes(q))
        );
    }

    // Sort
    if (sort === 'priority') {
        filtered.sort((a, b) => (a.priority || 99) - (b.priority || 99));
    } else {
        // Default: Featured first, then priority
        filtered.sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1;
            if (!a.isFeatured && b.isFeatured) return 1;
            return (a.priority || 99) - (b.priority || 99);
        });
    }

    return filtered;
}

// Loading fallback for suspense
function FilterLoading() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-10 bg-slate-100 rounded-lg" />
            <div className="h-24 bg-slate-100 rounded-lg" />
            <div className="h-16 bg-slate-100 rounded-lg" />
        </div>
    );
}

function SortLoading() {
    return <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />;
}

interface PageProps {
    searchParams: Promise<{ q?: string; cat?: string; sort?: string }>;
}

export default async function CalculatorsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const query = params.q || '';
    const category = params.cat || 'all';
    const sort = params.sort || 'featured';

    const filteredSkills = filterSkills(query, category, sort);

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                        所有工具
                    </h1>
                    <p className="text-slate-500 mt-2">
                        共 {filteredSkills.length} 個工具符合您的需求。
                    </p>
                </div>
                <Suspense fallback={<SortLoading />}>
                    <SortControls />
                </Suspense>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-3 lg:col-span-2">
                    <Suspense fallback={<FilterLoading />}>
                        <FilterSidebar className="sticky top-24" />
                    </Suspense>
                </aside>

                {/* Main Content */}
                <main className="md:col-span-9 lg:col-span-10 min-h-[500px]">
                    <SkillGrid skills={filteredSkills} />
                </main>
            </div>

            <Suspense fallback={null}>
                <PreviewDrawer />
            </Suspense>
        </div>
    );
}
