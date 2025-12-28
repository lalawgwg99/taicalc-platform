import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatByKind } from '@/lib/format';
import { getByPath } from '@/lib/objectPath';
import { UIResultSection } from '@/lib/skills/uiTypes';

interface ResultSectionsProps {
    sections: UIResultSection[];
    result: any;
}

export function ResultSections({ sections, result }: ResultSectionsProps) {
    if (!sections || sections.length === 0) return null;

    return (
        <div className="space-y-6">
            {sections.map((sec) => (
                <Card key={sec.title} className="shadow-sm">
                    <CardHeader className="bg-slate-50/50 py-3 border-b">
                        <CardTitle className="text-base font-bold text-slate-800">{sec.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-slate-100">
                            {sec.items.map((it) => {
                                const val = getByPath(result, it.valuePath);
                                return (
                                    <div key={it.label} className="flex items-center justify-between p-4 hover:bg-slate-50/50 transition-colors">
                                        <span className="text-sm text-slate-500 font-medium">{it.label}</span>
                                        <div className="text-sm font-bold text-slate-900 md:text-base">
                                            {formatByKind(val, it.format)}
                                            {it.unit && it.unit !== '無' ? (
                                                <span className="ml-1 text-xs text-slate-400">{it.unit}</span>
                                            ) : null}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
