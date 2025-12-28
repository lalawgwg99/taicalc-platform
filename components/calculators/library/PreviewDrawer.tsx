"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { uiCatalog } from "@/lib/skills/uiCatalog";
import { Sheet } from "@/components/ui/Sheet";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { ArrowRight, Play, CheckCircle2, HelpCircle } from "lucide-react";

export function PreviewDrawer() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const previewId = searchParams.get("preview");

    // Find skill
    const skill = uiCatalog.find(s => s.id === previewId);

    const handleClose = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("preview");
        router.replace(`/calculators?${params.toString()}`, { scroll: false });
    };

    if (!skill) return null;

    return (
        <Sheet
            isOpen={!!skill}
            onClose={handleClose}
            title={skill.title || skill.id.split('.')[1]}
            description={skill.category.toUpperCase()}
        >
            <div className="space-y-6 mt-4">
                {/* One Liner */}
                <div className="p-4 bg-secondary/50 rounded-lg">
                    <p className="text-base font-medium">{skill.oneLiner}</p>
                </div>

                {/* Highlights */}
                {skill.preview && (
                    <div className="space-y-6">
                        {/* What you give */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold flex items-center text-muted-foreground">
                                <HelpCircle className="w-4 h-4 mr-1.5" />
                                你需要提供
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {skill.preview.inputHighlights.map(item => (
                                    <Badge key={item} variant="outline" className="bg-white">
                                        {item}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* What you get */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold flex items-center text-primary">
                                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                                你會得到
                            </h4>
                            <ul className="space-y-2">
                                {skill.preview.outputHighlights.map(item => (
                                    <li key={item} className="text-sm flex items-start">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Chart Preview (Image placeholder for now or description) */}
                {skill.outputMode === 'kpi+chart' && skill.primaryChart && (
                    <div className="border rounded-lg p-4 bg-slate-50 flex flex-col items-center text-center space-y-2">
                        <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center">
                            {/* Icon based on chart types could go here */}
                            <span className="text-2xl">📊</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{skill.primaryChart.title}</p>
                            <p className="text-xs text-slate-500">視覺化圖表解說</p>
                        </div>
                    </div>
                )}

                {/* Example Run */}
                <div className="pt-6 mt-6 border-t space-y-3">
                    <Link href={`/calculators/${skill.id}`} className="block w-full">
                        <Button className="w-full h-11 text-base">
                            開始試算
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>

                    {skill.exampleValues && (
                        <Link href={`/calculators/${skill.id}?runExample=true`} className="block w-full">
                            <Button variant="outline" className="w-full border-dashed text-muted-foreground hover:text-primary hover:border-primary/50">
                                <Play className="w-3 h-3 mr-2" />
                                使用範例一鍵試跑
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </Sheet>
    );
}
