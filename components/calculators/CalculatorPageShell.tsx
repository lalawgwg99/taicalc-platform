// components/calculators/CalculatorPageShell.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

import ProUpgradePrompt from '@/components/ProUpgradePrompt';
import { useProTrigger } from '@/hooks/useProTrigger';

import type { SkillId, SkillUIContract, SkillUIConfig } from '@/lib/skills/uiTypes';
import { uiCatalog } from '@/lib/skills/uiCatalog';

// Visualizations
import { KpiCards } from '@/components/calculators/visualizations/KpiCards';
import { ResultChart } from '@/components/calculators/visualizations/ResultChart';
import { ResultSections } from '@/components/calculators/visualizations/ResultSections';

// Components
import SkillForm from '@/components/skills/SkillForm';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

type InputValues = Record<string, unknown>;

type Props = {
    skillId: SkillId;
    ui: SkillUIContract; // Fallback for old pages
    uiConfig?: SkillUIConfig; // New catalog config
    onExecute: (input: InputValues) => Promise<unknown>;
};

export default function CalculatorPageShell({ skillId, ui, uiConfig, onExecute }: Props) {
    // Merge Catalog UI if not passed directly (though page should pass it)
    const catalogUI = uiConfig || uiCatalog.find(c => c.id === skillId);

    // State
    const [input, setInput] = React.useState<InputValues>(
        // Initialize with example if query param present? (Future enhancement)
        catalogUI?.exampleValues ? {} : {}
    );
    const [result, setResult] = React.useState<unknown>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // Pro Upgrade Trigger (T1: result_completed)
    const { isVisible: showProPrompt, dismiss: dismissProPrompt } = useProTrigger({
        triggerType: 'result_completed',
        condition: !!result && !loading,  // Trigger when result exists and not loading
        config: {
            delayMs: 3000,  // Wait 3 seconds after result appears
            showOnce: true,
            storageKey: `pro_trigger_${skillId}_result`
        }
    });

    // Handlers
    async function handleSubmit(nextInput: InputValues) {
        setLoading(true);
        setError(null);
        try {
            setInput(nextInput);
            const res = await onExecute(nextInput);

            // Allow 500ms min loading for "Processing" feel if too fast
            // await new Promise(r => setTimeout(r, 500)); 

            if (res && typeof res === 'object' && 'success' in res && !(res as any).success) {
                throw new Error((res as any).error || '計算失敗');
            }
            const actualData = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;
            setResult(actualData);

            // Auto scroll to result on mobile
            if (window.innerWidth < 1024) {
                document.getElementById('result-panel')?.scrollIntoView({ behavior: 'smooth' });
            }

        } catch (e: any) {
            console.error(e);
            setError(e?.message ?? '執行失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    }

    function applyExample() {
        if (catalogUI?.exampleValues) {
            setInput(catalogUI.exampleValues);
            // Optional: Auto-submit?
            handleSubmit(catalogUI.exampleValues);
        }
    }

    function handleReset() {
        setInput({});
        setResult(null);
    }

    const isChartMode = catalogUI?.outputMode === 'kpi+chart';

    // We map old SkillUIContract highlights to new format if needed, 
    // but ideally we rely on the passed `ui` prop for the meta (Form needs it)
    // Results rely on `ui` prop for `highlights` and `sections` UNLESS we have an Adapter.
    // For now, adhere to `ui` prop for result config to keep backward compat.

    return (
        <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10">
            {/* Header */}
            <header className="mb-8 max-w-3xl">
                <div className="flex items-center gap-2 mb-3">
                    {catalogUI?.category && (
                        <Badge variant="secondary" className="uppercase tracking-wide">
                            {catalogUI.category}
                        </Badge>
                    )}
                    <span className="text-sm text-slate-500">#{skillId}</span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                    {catalogUI?.title || ui.title}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                    {catalogUI?.oneLiner || ui.description}
                </p>
            </header>

            <div className="grid lg:grid-cols-12 gap-8 items-start">

                {/* Left Column: Input (Sticky) */}
                <div className="lg:col-span-4 lg:sticky lg:top-24">
                    <div className="bg-white rounded-2xl border shadow-sm p-6 relative overflow-hidden">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold flex items-center">
                                <span className="bg-brand-primary/10 text-brand-primary w-8 h-8 rounded-full flex items-center justify-center mr-2 text-sm">1</span>
                                輸入條件
                            </h2>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-400 hover:text-red-500 h-8 px-2">
                                    重置
                                </Button>
                            </div>
                        </div>

                        <SkillForm
                            skillId={skillId}
                            value={input}
                            onChange={setInput}
                            onSubmit={handleSubmit}
                            uiMeta={ui.inputMeta}
                            loading={loading}
                            showResult={false} // Managed by Shell
                            className="shadow-none p-0 border-0"
                        />

                        {/* Example CTA */}
                        {catalogUI?.exampleValues && !result && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <button
                                    onClick={applyExample}
                                    className="w-full text-sm text-slate-500 hover:text-brand-primary flex items-center justify-center py-2 transition-colors"
                                >
                                    <Sparkles className="w-4 h-4 mr-1.5" />
                                    不知道填什麼？帶入範例資料
                                </button>
                            </div>
                        )}

                        {/* Error Message */}
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start text-sm text-red-600"
                                >
                                    <AlertCircle className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
                                    {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Right Column: Result */}
                <div id="result-panel" className="lg:col-span-8 space-y-6">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* KPI Cards */}
                            {ui.highlights && (
                                <KpiCards highlights={ui.highlights} result={result} />
                            )}

                            {/* Primary Chart (Wow Factor) */}
                            {isChartMode && catalogUI?.primaryChart && (result as any).chartData && (
                                <ResultChart
                                    config={catalogUI.primaryChart}
                                    data={result}
                                />
                            )}

                            {/* Detailed Sections */}
                            {ui.sections && (
                                <ResultSections sections={ui.sections} result={result} />
                            )}

                            {/* Raw JSON Fallback if nothing configured */}
                            {!ui.highlights && !ui.sections && !catalogUI?.primaryChart && (
                                <div className="bg-white p-6 rounded-xl border">
                                    <h3 className="font-bold mb-4">分析結果</h3>
                                    <pre className="bg-slate-50 p-4 rounded text-xs overflow-auto">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* Disclaimer */}
                            {ui.disclaimer && (
                                <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl text-sm text-blue-800/80">
                                    <span className="font-bold mr-1">⚠️ 說明：</span>
                                    {ui.disclaimer}
                                </div>
                            )}

                        </motion.div>
                    ) : (
                        // Empty State / Skeleton
                        <div className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6">
                                {loading ? (
                                    <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
                                ) : (
                                    <Sparkles className="w-8 h-8 text-slate-300" />
                                )}
                            </div>

                            {loading ? (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">正在分析您的數據...</h3>
                                    <p className="text-slate-500">AI 正在計算並生成圖表，請稍候</p>
                                </>
                            ) : (
                                <>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">準備好開始了嗎？</h3>
                                    <p className="text-slate-500 max-w-sm mx-auto mb-8">
                                        在左側輸入您的數據，我們將為您生成
                                        {catalogUI?.primaryChart ? '視覺化圖表與' : ''}
                                        專業分析報告。
                                    </p>

                                    {/* Preview Hints */}
                                    {catalogUI?.preview?.outputHighlights && (
                                        <div className="max-w-md mx-auto text-left">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 text-center">您將獲得</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {catalogUI.preview.outputHighlights.map(h => (
                                                    <div key={h} className="flex items-center text-sm text-slate-600 bg-white px-3 py-2 rounded border border-slate-100 shadow-sm">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-brand-primary mr-2" />
                                                        {h}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Pro Upgrade Prompt */}
            <ProUpgradePrompt
                triggerType="result_completed"
                isVisible={showProPrompt}
                onDismiss={dismissProPrompt}
            />
        </div>
    );
}
