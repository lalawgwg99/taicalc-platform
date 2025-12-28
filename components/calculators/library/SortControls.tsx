"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";

export function SortControls() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentSort = searchParams.get("sort") || "featured";

    const handleSort = (sort: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", sort);
        router.replace(`/calculators?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center space-x-2 text-sm">
            <span className="text-muted-foreground">排序：</span>
            <div className="flex bg-secondary p-1 rounded-md">
                <button
                    onClick={() => handleSort("featured")}
                    className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${currentSort === "featured"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    推薦
                </button>
                <button
                    onClick={() => handleSort("priority")}
                    className={`px-3 py-1 rounded-sm text-xs font-medium transition-colors ${currentSort === "priority"
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                >
                    熱門
                </button>
            </div>
        </div>
    );
}
