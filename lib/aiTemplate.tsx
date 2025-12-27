'use client';

/**
 * AI 輸出結構化模板
 * 用於統一 AI 分析結果的格式和呈現
 */

import React from 'react';
import { AlertCircle, CheckCircle, TrendingUp, Target, Lightbulb, ArrowRight } from 'lucide-react';

export interface AIAnalysisResult {
    summary: string;
    keyInsights: string[];
    options: AIOption[];
    risks: AIRisk[];
    actions: AIAction[];
    confidence: 'high' | 'medium' | 'low';
}

export interface AIOption {
    title: string;
    description: string;
    pros: string[];
    cons: string[];
    recommendation?: boolean;
}

export interface AIRisk {
    level: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    mitigation?: string;
}

export interface AIAction {
    priority: number;
    title: string;
    description: string;
    timeframe?: string;
}

/**
 * 解析 AI 回應為結構化格式
 */
export function parseAIResponse(rawResponse: string): Partial<AIAnalysisResult> {
    // 嘗試解析 JSON 格式
    try {
        const jsonMatch = rawResponse.match(/```json\n?([\s\S]*?)\n?```/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[1]);
        }
    } catch {
        // 繼續嘗試其他解析方式
    }

    // 基本文字解析
    const sections = rawResponse.split(/\n\n+/);
    const result: Partial<AIAnalysisResult> = {
        summary: sections[0] || rawResponse,
        keyInsights: [],
        options: [],
        risks: [],
        actions: [],
    };

    // 嘗試提取重點
    const bulletPoints = rawResponse.match(/[-•]\s*(.+)/g);
    if (bulletPoints) {
        result.keyInsights = bulletPoints.slice(0, 5).map(p => p.replace(/^[-•]\s*/, ''));
    }

    return result;
}

/**
 * AI 分析結果組件 - 摘要卡片
 */
interface AISummaryCardProps {
    result: Partial<AIAnalysisResult>;
}

export function AISummaryCard({ result }: AISummaryCardProps) {
    return (
        <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-brand-primary/5 to-blue-50 border border-brand-primary/20">
            <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 mb-1">AI 分析摘要</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{result.summary}</p>
                </div>
            </div>

            {result.keyInsights && result.keyInsights.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">關鍵洞察</p>
                    <ul className="space-y-2">
                        {result.keyInsights.map((insight, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                <span>{insight}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

/**
 * AI 選項比較組件
 */
interface AIOptionsProps {
    options: AIOption[];
}

export function AIOptions({ options }: AIOptionsProps) {
    if (!options || options.length === 0) return null;

    return (
        <div className="space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-primary" />
                方案比較
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
                {options.map((option, i) => (
                    <div
                        key={i}
                        className={`p-4 rounded-xl border-2 ${option.recommendation
                                ? 'border-brand-primary bg-brand-primary/5'
                                : 'border-slate-200 bg-white'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h5 className="font-bold text-slate-900">{option.title}</h5>
                            {option.recommendation && (
                                <span className="text-xs font-bold text-brand-primary bg-brand-primary/10 px-2 py-1 rounded-full">推薦</span>
                            )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{option.description}</p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                                <p className="font-bold text-green-600 mb-1">優點</p>
                                <ul className="space-y-1 text-slate-600">
                                    {option.pros.map((pro, j) => (
                                        <li key={j}>✓ {pro}</li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <p className="font-bold text-red-600 mb-1">缺點</p>
                                <ul className="space-y-1 text-slate-600">
                                    {option.cons.map((con, j) => (
                                        <li key={j}>✗ {con}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * AI 風險提示組件
 */
interface AIRisksProps {
    risks: AIRisk[];
}

export function AIRisks({ risks }: AIRisksProps) {
    if (!risks || risks.length === 0) return null;

    const riskColors = {
        high: 'bg-red-50 border-red-200 text-red-700',
        medium: 'bg-orange-50 border-orange-200 text-orange-700',
        low: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    };

    const riskLabels = {
        high: '高風險',
        medium: '中風險',
        low: '低風險',
    };

    return (
        <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-500" />
                風險提示
            </h4>
            {risks.map((risk, i) => (
                <div key={i} className={`p-4 rounded-xl border ${riskColors[risk.level]}`}>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold">{riskLabels[risk.level]}</span>
                        <span className="font-bold">{risk.title}</span>
                    </div>
                    <p className="text-sm opacity-80">{risk.description}</p>
                    {risk.mitigation && (
                        <p className="text-sm mt-2 font-medium">💡 {risk.mitigation}</p>
                    )}
                </div>
            ))}
        </div>
    );
}

/**
 * AI 行動建議組件
 */
interface AIActionsProps {
    actions: AIAction[];
}

export function AIActions({ actions }: AIActionsProps) {
    if (!actions || actions.length === 0) return null;

    return (
        <div className="space-y-3">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                下一步行動
            </h4>
            <div className="space-y-2">
                {actions
                    .sort((a, b) => a.priority - b.priority)
                    .map((action, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                            <div className="w-6 h-6 bg-brand-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {action.priority}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 text-sm">{action.title}</p>
                                <p className="text-xs text-slate-500">{action.description}</p>
                                {action.timeframe && (
                                    <p className="text-xs text-brand-primary mt-1">⏱ {action.timeframe}</p>
                                )}
                            </div>
                            <ArrowRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        </div>
                    ))}
            </div>
        </div>
    );
}

/**
 * 完整 AI 分析結果組件
 */
interface AIAnalysisDisplayProps {
    result: Partial<AIAnalysisResult>;
    loading?: boolean;
}

export function AIAnalysisDisplay({ result, loading }: AIAnalysisDisplayProps) {
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="h-32 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="h-24 bg-slate-100 rounded-2xl animate-pulse" />
                <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AISummaryCard result={result} />
            <AIOptions options={result.options || []} />
            <AIRisks risks={result.risks || []} />
            <AIActions actions={result.actions || []} />
        </div>
    );
}

/**
 * AI 回應模板提示詞
 */
export const AI_RESPONSE_TEMPLATE = `
請以以下 JSON 格式回應，確保結構清晰：

{
  "summary": "一句話總結分析結果",
  "keyInsights": ["洞察1", "洞察2", "洞察3"],
  "options": [
    {
      "title": "選項標題",
      "description": "選項說明",
      "pros": ["優點1", "優點2"],
      "cons": ["缺點1", "缺點2"],
      "recommendation": true/false
    }
  ],
  "risks": [
    {
      "level": "high/medium/low",
      "title": "風險標題",
      "description": "風險說明",
      "mitigation": "建議對策"
    }
  ],
  "actions": [
    {
      "priority": 1,
      "title": "行動標題",
      "description": "行動說明",
      "timeframe": "時間範圍"
    }
  ]
}
`;
