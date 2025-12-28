"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Search } from "lucide-react";
import { NAV_CATEGORIES } from "@/lib/navConfig";

// Fallback Input if not existing in component library
function DefaultInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className="relative">
            <input
                {...props}
                className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className}`}
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
    )
}

interface FilterProps {
    className?: string;
}

export function FilterSidebar({ className }: FilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Local state for immediate feedback
    const [query, setQuery] = useState(searchParams.get("q") || "");
    const selectedCat = searchParams.get("cat") || "all";

    useEffect(() => {
        setQuery(searchParams.get("q") || "");
    }, [searchParams]);

    const handleSearch = (term: string) => {
        setQuery(term);
        updateParams({ q: term });
    };

    const handleCategory = (catId: string) => {
        const newCat = selectedCat === catId ? "all" : catId;
        updateParams({ cat: newCat });
    };

    const updateParams = (changes: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString());
        Object.entries(changes).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        // Debounce logic could be added here, but navigation is fast enough usually
        router.replace(`/calculators?${params.toString()}`, { scroll: false });
    };

    return (
        <div className={`space-y-6 ${className}`}>
            {/* Search */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">搜尋工具</h3>
                <DefaultInput
                    placeholder="輸入關鍵字 (e.g. 房貸, 稅)"
                    value={query}
                    onChange={(e) => handleSearch(e.target.value)}
                />
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex justify-between items-center">
                    分類
                    {selectedCat !== 'all' && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs text-muted-foreground hover:text-primary"
                            onClick={() => updateParams({ cat: 'all' })}
                        >
                            重置
                        </Button>
                    )}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {NAV_CATEGORIES.map(cat => (
                        <Badge
                            key={cat.id}
                            variant={selectedCat === cat.id ? "default" : "outline"}
                            className="cursor-pointer hover:bg-secondary/80 px-3 py-1.5"
                            onClick={() => handleCategory(cat.id)}
                        >
                            {cat.label}
                        </Badge>
                    ))}
                </div>
            </div>

            {/* Tags (Hardcoded for now, can be derived from catalog later) */}
            <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">熱門標籤</h3>
                <div className="flex flex-wrap gap-2">
                    {['熱門', '新手友善', 'AI', '省稅', '買房'].map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-600 font-normal"
                            onClick={() => handleSearch(tag)} // Simple tag search implementation
                        >
                            #{tag}
                        </Badge>
                    ))}
                </div>
            </div>
        </div>
    );
}
