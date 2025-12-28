'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { UIFieldMeta } from '@/lib/skills/uiTypes';

interface FieldMeta {
    name: string;
    type: 'number' | 'boolean' | 'string' | 'select';
    label: string;
    required: boolean;
    default?: unknown;
    min?: number;
    max?: number;
    step?: number;
    unit?: string;
    options?: string[]; // Enum 選項
}

interface SkillMeta {
    id: string;
    name: string;
    description: string;
    fields: FieldMeta[];
    defaultValues: Record<string, unknown>;
}

interface SkillFormProps {
    skillId: string;
    onResult?: (data: unknown) => void;
    className?: string;
    showResult?: boolean;

    // Controlled props
    value?: Record<string, unknown>;
    onChange?: (values: Record<string, unknown>) => void;
    onSubmit?: (values: Record<string, unknown>) => void | Promise<void>;
    uiMeta?: Record<string, UIFieldMeta>;
    loading?: boolean;
}

export default function SkillForm({
    skillId,
    onResult,
    className = '',
    showResult = true,
    value: controlledValues,
    onChange: setControlledValues,
    onSubmit: controlledSubmit,
    uiMeta,
    loading: externalLoading = false,
}: SkillFormProps) {
    const [meta, setMeta] = useState<SkillMeta | null>(null);
    const [internalValues, setInternalValues] = useState<Record<string, unknown>>({});
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [loadingMeta, setLoadingMeta] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 決定使用外部或內部狀態
    const values = controlledValues || internalValues;
    const isLoading = externalLoading || executing;

    // 載入 Skill 元資料
    useEffect(() => {
        async function loadMeta() {
            setLoadingMeta(true);
            setError(null);
            try {
                const res = await fetch(`/api/skills/${skillId}`);
                if (!res.ok) throw new Error('無法載入 Skill');
                const data = await res.json();
                setMeta(data);

                // 初始化值
                const defaults = data.defaultValues || {};
                if (!controlledValues) {
                    setInternalValues(defaults);
                } else if (Object.keys(controlledValues).length === 0) {
                    // 若外部傳入空物件，幫忙填入預設值
                    setControlledValues?.(defaults);
                }
            } catch (e) {
                setError(e instanceof Error ? e.message : '載入失敗');
            } finally {
                setLoadingMeta(false);
            }
        }
        loadMeta();
    }, [skillId]);

    // 執行 Skill (當沒有外部 onSubmit 時使用)
    const executeSkill = async () => {
        if (!meta) return;

        // 若有外部 onSubmit，優先使用
        if (controlledSubmit) {
            await controlledSubmit(values);
            return;
        }

        setExecuting(true);
        setError(null);
        try {
            const res = await fetch(`/api/skills/${skillId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ input: values }),
            });
            const data = await res.json();
            if (data.success) {
                setResult(data.data);
                onResult?.(data.data);
            } else {
                setError(data.error || '執行失敗');
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : '執行失敗');
        } finally {
            setExecuting(false);
        }
    };

    // 更新欄位值
    const updateValue = (name: string, newVal: unknown) => {
        const nextValues = { ...values, [name]: newVal };
        if (setControlledValues) {
            setControlledValues(nextValues);
        } else {
            setInternalValues(nextValues);
            setResult(null); // 清除內部結果
        }
    };

    if (loadingMeta) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin text-brand-primary" />
                <span className="ml-2 text-slate-500">載入中...</span>
            </div>
        );
    }

    if (error && !meta) {
        return (
            <div className="flex items-center p-4 bg-red-50 rounded-xl text-red-600">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        );
    }

    if (!meta) return null;

    return (
        <div className={`rounded-2xl bg-white ${className}`}>
            {/* Header (僅在非 CalculatorPageShell 模式顯示，避免重複) */}
            {!uiMeta && (
                <div className="mb-6">
                    <h3 className="text-lg font-black text-slate-900">{meta.name}</h3>
                    <p className="text-sm text-slate-500 mt-1">{meta.description}</p>
                </div>
            )}

            {/* Form Fields */}
            <div className="space-y-5 mb-6">
                {meta.fields.map(field => {
                    // 優先使用 uiMeta 的設定
                    const uiField = uiMeta?.[field.name];
                    const label = uiField?.label || field.label;
                    const unit = uiField?.unit || field.unit;
                    const placeholder = uiField?.placeholder;
                    const helpText = uiField?.helpText;

                    return (
                        <div key={field.name}>
                            <div className="flex justify-between items-baseline mb-2">
                                <label className="block text-sm font-bold text-slate-700">
                                    {label}
                                </label>
                                {unit && unit !== '無' && <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{unit}</span>}
                            </div>

                            {helpText && <div className="text-xs text-slate-500 mb-2">{helpText}</div>}

                            {field.type === 'number' && (
                                <input
                                    type="number"
                                    min={uiField?.min ?? field.min}
                                    max={uiField?.max ?? field.max}
                                    step={uiField?.step ?? field.step}
                                    value={values[field.name] as number || ''}
                                    placeholder={placeholder}
                                    onChange={e => updateValue(field.name, e.target.value === '' ? '' : Number(e.target.value))}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                />
                            )}

                            {field.type === 'boolean' && (
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => updateValue(field.name, true)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${values[field.name] === true
                                            ? 'bg-brand-primary border-brand-primary text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                            }`}
                                    >
                                        是
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => updateValue(field.name, false)}
                                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all border ${values[field.name] === false
                                            ? 'bg-slate-600 border-slate-600 text-white shadow-md'
                                            : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                            }`}
                                    >
                                        否
                                    </button>
                                </div>
                            )}

                            {field.type === 'string' && !field.options && !uiField?.options && (
                                <input
                                    type="text"
                                    value={values[field.name] as string || ''}
                                    placeholder={placeholder}
                                    onChange={e => updateValue(field.name, e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                />
                            )}

                            {(field.type === 'select' || field.options || uiField?.options) && (
                                <div className="relative">
                                    <select
                                        value={values[field.name] as string || ''}
                                        onChange={e => updateValue(field.name, e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900 appearance-none cursor-pointer"
                                    >
                                        <option value="" disabled>請選擇</option>
                                        {(uiField?.options ? Object.entries(uiField.options) : (field.options || []).map(opt => [opt, opt])).map(([val, label]) => (
                                            <option key={val} value={val}>{label}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Execute Button */}
            <button
                onClick={executeSkill}
                disabled={isLoading}
                className="w-full flex items-center justify-center space-x-2 bg-brand-primary hover:bg-brand-secondary text-white py-4 rounded-xl font-bold shadow-lg shadow-brand-primary/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Sparkles className="w-5 h-5" />
                )}
                <span>{isLoading ? '計算中...' : '開始計算'}</span>
            </button>

            {/* Error */}
            {error && !uiMeta && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {/* Result (僅在非 CalculatorPageShell 模式顯示 = showResult 為真) */}
            {showResult && result && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl"
                >
                    <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <span className="font-bold text-green-800">計算完成</span>
                    </div>
                    <div className="text-sm text-slate-700">
                        <ResultDisplay data={result} />
                    </div>
                </motion.div>
            )}
        </div>
    );
}

// 結果顯示組件 (保持不變)
function ResultDisplay({ data }: { data: unknown }) {
    if (typeof data !== 'object' || data === null) {
        return <span>{String(data)}</span>;
    }

    const entries = Object.entries(data as Record<string, unknown>).filter(
        ([key]) => !['chartData'].includes(key)
    );

    return (
        <div className="space-y-2">
            {entries.map(([key, value]) => (
                <div key={key} className="flex justify-between items-center py-1 border-b border-green-100 last:border-0">
                    <span className="text-slate-600">{formatKey(key)}</span>
                    <span className="font-bold text-slate-900">{formatValue(key, value)}</span>
                </div>
            ))}
        </div>
    );
}

function formatKey(key: string): string {
    const keyMap: Record<string, string> = {
        monthly: '月度',
        annual: '年度',
        gross: '稅前',
        takeHome: '實領',
        insurance: '勞健保',
        tax: '所得稅',
        net: '年淨收入',
        effectiveTaxRate: '有效稅率',
    };
    return keyMap[key] || key;
}

function formatValue(key: string, value: unknown): string {
    if (typeof value === 'number') {
        if (key.toLowerCase().includes('rate')) {
            return `${value.toFixed(2)}%`;
        }
        return `$${formatCurrency(Math.round(value))}`;
    }
    if (typeof value === 'object' && value !== null) {
        return '(展開)';
    }
    return String(value);
}
