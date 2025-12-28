'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

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
}

export default function SkillForm({
    skillId,
    onResult,
    className = '',
    showResult = true
}: SkillFormProps) {
    const [meta, setMeta] = useState<SkillMeta | null>(null);
    const [values, setValues] = useState<Record<string, unknown>>({});
    const [result, setResult] = useState<Record<string, unknown> | null>(null);
    const [loading, setLoading] = useState(true);
    const [executing, setExecuting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 載入 Skill 元資料
    useEffect(() => {
        async function loadMeta() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch(`/api/skills/${skillId}`);
                if (!res.ok) throw new Error('無法載入 Skill');
                const data = await res.json();
                setMeta(data);
                setValues(data.defaultValues || {});
            } catch (e) {
                setError(e instanceof Error ? e.message : '載入失敗');
            } finally {
                setLoading(false);
            }
        }
        loadMeta();
    }, [skillId]);

    // 執行 Skill
    const executeSkill = async () => {
        if (!meta) return;
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
    const updateValue = (name: string, value: unknown) => {
        setValues(prev => ({ ...prev, [name]: value }));
        setResult(null); // 清除結果
    };

    if (loading) {
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
        <div className={`glass-card rounded-2xl p-6 bg-white border border-slate-200 shadow-md ${className}`}>
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900">{meta.name}</h3>
                <p className="text-sm text-slate-500 mt-1">{meta.description}</p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4 mb-6">
                {meta.fields.map(field => (
                    <div key={field.name}>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
                            {field.label}
                            {field.unit && <span className="text-slate-400 ml-1">({field.unit})</span>}
                        </label>

                        {field.type === 'number' && (
                            <input
                                type="number"
                                min={field.min}
                                max={field.max}
                                step={field.step}
                                value={values[field.name] as number || 0}
                                onChange={e => updateValue(field.name, Number(e.target.value))}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900"
                            />
                        )}

                        {field.type === 'boolean' && (
                            <button
                                type="button"
                                onClick={() => updateValue(field.name, !values[field.name])}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${values[field.name]
                                    ? 'bg-brand-primary text-white'
                                    : 'bg-slate-100 text-slate-600'
                                    }`}
                            >
                                {values[field.name] ? '是' : '否'}
                            </button>
                        )}

                        {field.type === 'string' && (
                            <input
                                type="text"
                                value={values[field.name] as string || ''}
                                onChange={e => updateValue(field.name, e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all font-bold text-slate-900"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Execute Button */}
            <button
                onClick={executeSkill}
                disabled={executing}
                className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
                {executing ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                    <Sparkles className="w-5 h-5" />
                )}
                <span>{executing ? '計算中...' : '開始計算'}</span>
            </button>

            {/* Error */}
            {error && (
                <div className="mt-4 p-3 bg-red-50 rounded-lg flex items-center text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    {error}
                </div>
            )}

            {/* Result */}
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

// 結果顯示組件
function ResultDisplay({ data }: { data: unknown }) {
    if (typeof data !== 'object' || data === null) {
        return <span>{String(data)}</span>;
    }

    const entries = Object.entries(data as Record<string, unknown>).filter(
        ([key]) => !['chartData'].includes(key) // 過濾不需顯示的欄位
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
