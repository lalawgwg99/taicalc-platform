// components/calculators/CalculatorPageShell.tsx
import React from 'react';
import type { SkillId, SkillUIContract } from '@/lib/skills/uiTypes';
import { getByPath } from '@/lib/objectPath';
import { formatByKind } from '@/lib/format';
import { motion } from 'framer-motion';

// 既有的 SkillForm
import SkillForm from '@/components/skills/SkillForm';

// 定義與 SkillForm 相同的 input 型別
type InputValues = Record<string, unknown>;

type Props = {
    skillId: SkillId;
    ui: SkillUIContract;

    // 由頁面層執行方法 (透過 public API)
    onExecute: (input: InputValues) => Promise<unknown>;
};

export default function CalculatorPageShell({ skillId, ui, onExecute }: Props) {
    const [input, setInput] = React.useState<InputValues>({});
    const [result, setResult] = React.useState<unknown>(null);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<string | null>(null);

    // 接收 SkillForm 的提交
    // 注意：我們需要 SkillForm 支援這些 props，若尚未支援，Antigravity 會去修補 SkillForm
    async function handleSubmit(nextInput: InputValues) {
        setLoading(true);
        setError(null);
        try {
            // 確保 input 狀態同步
            setInput(nextInput);
            const res = await onExecute(nextInput);
            // 若回傳有 success 欄位判斷
            if (res && typeof res === 'object' && 'success' in res && !(res as any).success) {
                throw new Error((res as any).error || '計算失敗');
            }
            // 取出實際 data (若結構是 { success: true, data: ... })
            const actualData = (res && typeof res === 'object' && 'data' in res) ? (res as any).data : res;
            setResult(actualData);
        } catch (e: any) {
            console.error(e);
            setError(e?.message ?? '執行失敗，請稍後再試');
        } finally {
            setLoading(false);
        }
    }

    function applyExample(exampleInput: InputValues) {
        // 設定 input，這需要 SkillForm 能監聽 value prop 變化
        setInput(exampleInput);
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8">
            {/* 頁頭 */}
            <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900">{ui.title}</h1>
                {ui.description ? (
                    <p className="mt-2 text-base text-slate-500 max-w-3xl">{ui.description}</p>
                ) : null}
            </div>

            {/* 範例 Chips */}
            {ui.examples?.length ? (
                <div className="mb-6 flex flex-wrap gap-2">
                    {ui.examples.map((ex) => (
                        <button
                            key={ex.label}
                            type="button"
                            onClick={() => applyExample(ex.input)}
                            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-primary transition-colors"
                        >
                            <span className="mr-1">💡</span>
                            {ex.label}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={() => { setInput({}); setResult(null); }}
                        className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        重設
                    </button>
                </div>
            ) : null}

            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                {/* 左側：輸入表單 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-900">輸入條件</h2>
                    </div>

                    <SkillForm
                        skillId={skillId}
                        // 傳遞控制屬性 (Antigravity 將修改 SkillForm 支援這些)
                        value={input}
                        onChange={setInput}
                        onSubmit={handleSubmit}
                        uiMeta={ui.inputMeta}
                        loading={loading}
                        // 隱藏原本的結果顯示，改由 Shell 接管
                        showResult={false}
                        className="border-0 shadow-none p-0"
                    />

                    {error ? (
                        <div className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-100 flex items-start">
                            <span className="mr-2">⚠️</span>
                            {error}
                        </div>
                    ) : null}
                </div>

                {/* 右側：計算結果 */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm relative overflow-hidden min-h-[400px]">
                    <div className="mb-4">
                        <h2 className="text-lg font-bold text-slate-900">分析結果</h2>
                    </div>

                    {!result ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                            <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                                <span className="text-3xl">🧮</span>
                            </div>
                            <p>填寫左側條件並按下計算</p>
                            <p className="text-sm mt-1">AI 將為您分析數據</p>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6 relative z-10"
                        >
                            {/* Highlights KPI */}
                            {ui.highlights?.length ? (
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {ui.highlights.map((h) => {
                                        const val = getByPath(result, h.valuePath);
                                        return (
                                            <div key={h.key} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
                                                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{h.label}</div>
                                                <div className="text-2xl font-black text-brand-primary flex items-baseline">
                                                    {formatByKind(val, h.format)}
                                                    {h.unit && h.unit !== '無' ? (
                                                        <span className="ml-1 text-sm font-medium text-slate-400">{h.unit}</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : null}

                            {/* Sections Detail */}
                            {ui.sections?.length ? (
                                <div className="space-y-4">
                                    {ui.sections.map((sec) => (
                                        <div key={sec.title} className="rounded-xl bg-white border border-slate-200 p-4">
                                            <div className="mb-3 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">{sec.title}</div>
                                            <div className="space-y-3">
                                                {sec.items.map((it) => {
                                                    const val = getByPath(result, it.valuePath);
                                                    return (
                                                        <div key={it.label} className="flex items-center justify-between">
                                                            <span className="text-sm text-slate-500">{it.label}</span>
                                                            <div className="text-sm font-bold text-slate-900">
                                                                {formatByKind(val, it.format)}
                                                                {it.unit && it.unit !== '無' ? (
                                                                    <span className="ml-1 text-xs text-slate-400">{it.unit}</span>
                                                                ) : null}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : null}

                            {/* Default Raw JSON Dump (if no UI meta defined yet) */}
                            {!ui.highlights?.length && !ui.sections?.length && (
                                <div className="rounded-xl bg-white border border-slate-200 p-4">
                                    <div className="text-sm font-bold text-slate-900 mb-2">詳細數據</div>
                                    <pre className="text-xs bg-slate-50 p-2 rounded overflow-auto max-h-[300px]">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </div>
                            )}

                            {/* Disclaimer */}
                            {ui.disclaimer ? (
                                <div className="rounded-xl bg-blue-50/50 p-4 border border-blue-100">
                                    <div className="flex items-start">
                                        <span className="mr-2 text-blue-500 mt-0.5">ℹ️</span>
                                        <div className="text-xs text-blue-600/80 leading-relaxed">
                                            <span className="font-bold block mb-1 text-blue-700">說明</span>
                                            {ui.disclaimer}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
