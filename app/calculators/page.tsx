import React, { Suspense } from 'react';
import { uiCatalog } from '@/lib/skills/uiCatalog';
import { FilterSidebar } from '@/components/calculators/library/FilterSidebar';
import { SortControls } from '@/components/calculators/library/SortControls';
import { SkillGrid } from '@/components/calculators/library/SkillGrid';
import { PreviewDrawer } from '@/components/calculators/library/PreviewDrawer';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: '所有工具 | TaiCalc',
    description: 'TaiCalc 提供的所有財務試算工具總覽，包含薪資、稅務、資本、房貸與運勢分析。',
};

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

// Client Component Wrapper for Search Params logic
// Since we are using useSearchParams in child components, we can keep the page Server Compoennt mostly
// but extracting filtering logic to a function is cleaner.

function filterSkills(query: string, category: string, tag: string, sort: string) {
    let filtered = [...uiCatalog];

    // Category Filter
    if (category && category !== 'all') {
        filtered = filtered.filter(s => s.category === category);
    }

    // Query Filter (Name, Title, OneLiner, Tags)
    if (query) {
        const q = query.toLowerCase();
        filtered = filtered.filter(s =>
            s.id.toLowerCase().includes(q) ||
            (s.title || '').toLowerCase().includes(q) ||
            s.oneLiner.toLowerCase().includes(q) ||
            s.tags?.some(t => t.toLowerCase().includes(q))
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

export default async function CalculatorsPage(props: { searchParams?: Promise<{ q?: string; cat?: string; sort?: string }> }) {
    const searchParams = await props.searchParams;
    const query = searchParams?.q || '';
    const category = searchParams?.cat || 'all';
    const sort = searchParams?.sort || 'featured';

    const filteredSkills = filterSkills(query, category, '', sort);

    return (
        <div className="container max-w-7xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">所有工具</h1>
                    <p className="text-slate-500 mt-2">
                        共 {filteredSkills.length} 個工具符合您的需求。
                    </p>
                </div>
                <SortControls />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Sidebar */}
                <aside className="md:col-span-3 lg:col-span-2">
                    <Suspense fallback={<div>Loading filters...</div>}>
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
