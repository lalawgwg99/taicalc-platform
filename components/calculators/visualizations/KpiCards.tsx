import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/Card";
import { formatByKind } from '@/lib/format';
import { getByPath } from '@/lib/objectPath';
import { UIResultHighlight } from '@/lib/skills/uiTypes';

interface KpiCardsProps {
    highlights: UIResultHighlight[]; // Or derive from SkillUIConfig
    result: any;
}

export function KpiCards({ highlights, result }: KpiCardsProps) {
    if (!highlights || highlights.length === 0) return null;

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
            {highlights.map((h, index) => {
                const val = getByPath(result, h.valuePath);
                return (
                    <motion.div
                        key={h.key}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Card className="border-l-4 border-l-brand-primary/50 shadow-sm hover:shadow-md transition-shadow">
                            <CardContent className="p-4">
                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                                    {h.label}
                                </div>
                                <div className="text-2xl font-black text-slate-900 flex items-baseline truncate" title={String(val)}>
                                    {/* This formatting logic might need to be more robust or passed down */}
                                    {formatByKind(val, h.format)}
                                    {h.unit && h.unit !== '無' && (
                                        <span className="ml-1 text-sm font-medium text-slate-400">{h.unit}</span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                );
            })}
        </div>
    );
}
