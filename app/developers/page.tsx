'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    ChevronLeft,
    Code2,
    Zap,
    Book,
    Terminal,
    Copy,
    Check,
    ExternalLink,
    ChevronRight,
    Sparkles,
    Shield,
    Layers
} from 'lucide-react';

// API 端點資訊
const API_ENDPOINTS = [
    {
        method: 'GET',
        path: '/api/skills',
        description: '列出所有可用的 Skill',
        example: `curl -X GET https://taicalc.com/api/skills`,
        response: `{
  "skills": [
    { "id": "salary.analyze", "name": "薪資結構分析" },
    { "id": "mortgage.calculate", "name": "房貸試算" }
  ]
}`
    },
    {
        method: 'GET',
        path: '/api/skills/{skillId}',
        description: '取得特定 Skill 的 Schema 定義',
        example: `curl -X GET https://taicalc.com/api/skills/salary.analyze`,
        response: `{
  "id": "salary.analyze",
  "name": "薪資結構分析",
  "inputSchema": { ... },
  "outputSchema": { ... }
}`
    },
    {
        method: 'POST',
        path: '/api/skills/{skillId}',
        description: '執行指定的 Skill',
        example: `curl -X POST https://taicalc.com/api/skills/salary.analyze \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{"monthlySalary": 50000, "bonusMonths": 2}'`,
        response: `{
  "success": true,
  "data": {
    "monthly": { "gross": 50000, "takeHome": 41817 },
    "annual": { "gross": 700000, "net": 585000 }
  }
}`
    },
    {
        method: 'POST',
        path: '/api/skills/chain',
        description: '鏈式執行多個 Skill（支援條件分支）',
        example: `curl -X POST https://taicalc.com/api/skills/chain \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -d '{
    "steps": [
      { "stepId": "salary", "skillId": "salary.analyze", "input": { "monthlySalary": 60000 } },
      { 
        "stepId": "tax", 
        "skillId": "tax.calculate", 
        "input": { "income": "$salary.data.annual.gross" },
        "condition": { "expression": "$salary.data.annual.gross > 500000", "skipIfFalse": true }
      }
    ]
  }'`,
        response: `{
  "success": true,
  "steps": [...],
  "executionPath": ["salary", "tax"],
  "finalOutput": { ... }
}`
    },
    {
        method: 'POST',
        path: '/api/chat',
        description: 'AI 對話（自動調用 Skill）',
        example: `curl -X POST https://taicalc.com/api/chat \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": "我月薪 5 萬，年終 2 個月，實領多少？"}]}'`,
        response: `{
  "role": "assistant",
  "content": "根據計算，您的月實領約為 $41,817..."
}`
    }
];

// 可用 Skill 列表
const SKILLS = [
    { id: 'salary.analyze', name: '薪資結構分析', category: 'salary' },
    { id: 'salary.reverse', name: '逆向推算薪資', category: 'salary' },
    { id: 'salary.structure', name: '年薪結構優化', category: 'salary' },
    { id: 'tax.calculate', name: '綜所稅計算', category: 'tax' },
    { id: 'tax.optimize', name: '節稅策略', category: 'tax' },
    { id: 'mortgage.calculate', name: '房貸試算', category: 'mortgage' },
    { id: 'mortgage.refinance', name: '轉貸評估', category: 'mortgage' },
    { id: 'mortgage.earlyRepayment', name: '提前還款', category: 'mortgage' },
    { id: 'capital.growth', name: '複利成長', category: 'capital' },
    { id: 'capital.fire', name: 'FIRE 獨立', category: 'capital' },
    { id: 'capital.goalReverse', name: '目標逆推', category: 'capital' },
    { id: 'capital.passiveIncome', name: '被動收入', category: 'capital' },
    { id: 'capital.milestones', name: '財富里程碑', category: 'capital' },
];

function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="absolute top-3 right-3 p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-all"
            aria-label="複製代碼"
        >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
        </button>
    );
}

export default function DevelopersPage() {
    const [activeEndpoint, setActiveEndpoint] = useState(0);

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            {/* 導航欄 */}
            <nav className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2 group">
                        <div className="w-9 h-9 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center text-slate-400 group-hover:border-blue-500 group-hover:text-blue-400">
                            <ChevronLeft className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white">回首頁</span>
                    </Link>
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black">T</div>
                        <span className="text-lg font-black">TaiCalc <span className="text-blue-400">開發者</span></span>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {/* Hero */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-4 py-1.5 rounded-full text-sm font-bold text-blue-400 mb-6">
                        <Code2 className="w-4 h-4" />
                        <span>API Documentation</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                        Skill API <span className="text-blue-400">開發者文件</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        透過 RESTful API 呼叫 TaiCalc 的 13 個財務計算 Skill，
                        或使用 AI Chat 讓 Gemini 自動選擇並執行。
                    </p>
                </motion.header>

                {/* 特色卡片 */}
                <section className="grid md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">即時計算</h3>
                        <p className="text-slate-400 text-sm">所有 Skill 都在 Edge Runtime 執行，平均 response 時間 &lt;100ms</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-emerald-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">Schema 驗證</h3>
                        <p className="text-slate-400 text-sm">所有輸入/輸出皆經 Zod Schema 驗證，確保資料正確性</p>
                    </div>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                        <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                        </div>
                        <h3 className="text-lg font-bold mb-2">AI 智能調用</h3>
                        <p className="text-slate-400 text-sm">透過 /api/chat，Gemini 會自動判斷並調用適合的 Skill</p>
                    </div>
                </section>

                {/* API 端點文件 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black mb-8 flex items-center">
                        <Terminal className="w-6 h-6 mr-3 text-blue-400" />
                        API 端點
                    </h2>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* 左側：端點列表 */}
                        <div className="space-y-2">
                            {API_ENDPOINTS.map((endpoint, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveEndpoint(idx)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all ${activeEndpoint === idx
                                        ? 'bg-blue-500/10 border-blue-500/50'
                                        : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                        }`}
                                >
                                    <div className="flex items-center space-x-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                            {endpoint.method}
                                        </span>
                                        <code className="text-sm font-mono text-slate-300">{endpoint.path}</code>
                                    </div>
                                    <p className="text-xs text-slate-500">{endpoint.description}</p>
                                </button>
                            ))}
                        </div>

                        {/* 右側：詳細內容 */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
                                <h3 className="text-lg font-bold mb-2 flex items-center">
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold mr-2 ${API_ENDPOINTS[activeEndpoint].method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {API_ENDPOINTS[activeEndpoint].method}
                                    </span>
                                    <code className="font-mono">{API_ENDPOINTS[activeEndpoint].path}</code>
                                </h3>
                                <p className="text-slate-400 mb-4">{API_ENDPOINTS[activeEndpoint].description}</p>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Request Example</h4>
                                        <div className="relative bg-slate-900 rounded-xl p-4 overflow-x-auto">
                                            <CopyButton text={API_ENDPOINTS[activeEndpoint].example} />
                                            <pre className="text-sm text-emerald-400 font-mono whitespace-pre-wrap">
                                                {API_ENDPOINTS[activeEndpoint].example}
                                            </pre>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Response</h4>
                                        <div className="relative bg-slate-900 rounded-xl p-4 overflow-x-auto">
                                            <CopyButton text={API_ENDPOINTS[activeEndpoint].response} />
                                            <pre className="text-sm text-blue-400 font-mono whitespace-pre-wrap">
                                                {API_ENDPOINTS[activeEndpoint].response}
                                            </pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 可用 Skill 列表 */}
                <section className="mb-16">
                    <h2 className="text-2xl font-black mb-8 flex items-center">
                        <Layers className="w-6 h-6 mr-3 text-purple-400" />
                        可用 Skill（13 個）
                    </h2>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {SKILLS.map((skill) => (
                            <div
                                key={skill.id}
                                className="bg-slate-800 border border-slate-700 rounded-xl p-4 hover:border-slate-600 transition-all"
                            >
                                <code className="text-xs text-blue-400 font-mono block mb-1">{skill.id}</code>
                                <span className="text-sm font-bold text-white">{skill.name}</span>
                                <span className={`ml-2 text-[10px] px-1.5 py-0.5 rounded ${skill.category === 'salary' ? 'bg-blue-500/20 text-blue-400'
                                    : skill.category === 'tax' ? 'bg-amber-500/20 text-amber-400'
                                        : skill.category === 'mortgage' ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-purple-500/20 text-purple-400'
                                    }`}>
                                    {skill.category}
                                </span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Chain DSL 說明 */}
                <section className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 border border-blue-500/20 rounded-3xl p-8 mb-16">
                    <h2 className="text-2xl font-black mb-4">
                        ⚡ Chain Decision DSL
                    </h2>
                    <p className="text-slate-300 mb-6">
                        透過 <code className="bg-slate-800 px-2 py-0.5 rounded">/api/skills/chain</code> 可以串接多個 Skill，
                        並使用條件表達式決定執行流程。
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 mb-2">支援的引用語法</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center space-x-2">
                                    <code className="bg-slate-800 px-2 py-1 rounded text-emerald-400">$previous</code>
                                    <span className="text-slate-400">上一步的輸出</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <code className="bg-slate-800 px-2 py-1 rounded text-emerald-400">$stepId.data.field</code>
                                    <span className="text-slate-400">指定步驟的欄位</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-slate-400 mb-2">條件分支</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-center space-x-2">
                                    <code className="bg-slate-800 px-2 py-1 rounded text-blue-400">condition.expression</code>
                                    <span className="text-slate-400">條件表達式</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <code className="bg-slate-800 px-2 py-1 rounded text-blue-400">condition.skipIfFalse</code>
                                    <span className="text-slate-400">條件為 false 時跳過</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center">
                    <h2 className="text-3xl font-black mb-4">
                        準備好開始了嗎？
                    </h2>
                    <p className="text-slate-400 mb-8">
                        立即體驗 TaiCalc 的財務計算功能
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/salary"
                            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-2xl font-bold transition-all"
                        >
                            <span>試用薪資計算器</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                        <a
                            href="mailto:hello@taicalc.com"
                            className="flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-2xl font-bold transition-all"
                        >
                            <span>聯絡我們取得 API Key</span>
                            <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-800">
                <p className="text-center text-slate-500 text-sm">
                    © 2025 TaiCalc 數策. All rights reserved.
                </p>
            </footer>
        </div>
    );
}
