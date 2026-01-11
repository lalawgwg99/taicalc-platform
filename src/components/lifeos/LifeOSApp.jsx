import React, { useState, useEffect, useRef } from 'react';
import {
    RefreshCw, Send, ArrowRight, Activity, Brain, Heart, DollarSign,
    Share2, Download, AlertTriangle, CheckCircle, Lock, Award,
    Terminal, Zap, Target, Search, Clock, Shield, Database,
    Cpu, Network, Compass, Layers
} from 'lucide-react';

/* --- UI COMPONENTS --- */

const InputField = ({ label, value, onChange, placeholder, type = "text", options = [] }) => (
    <div className="space-y-2">
        <label className="text-sm font-medium text-muted uppercase tracking-wider">{label}</label>
        {options.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
                {options.map((opt) => (
                    <button
                        key={opt}
                        onClick={() => onChange(opt)}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${value === opt
                            ? 'bg-ink text-paper border-ink shadow-md'
                            : 'bg-white text-ink border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        {opt}
                    </button>
                ))}
            </div>
        ) : (
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-ink focus:border-transparent outline-none transition-all font-mono text-sm shadow-sm"
            />
        )}
    </div>
);

const TypewriterText = ({ text, delay = 0, onComplete }) => {
    const [displayedText, setDisplayedText] = useState('');
    const [isTyping, setIsTyping] = useState(false); // Track typing state

    useEffect(() => {
        if (!text) return;

        // Reset state when text changes
        setDisplayedText('');
        setIsTyping(false);

        const timeout = setTimeout(() => {
            setIsTyping(true);
            let index = 0;
            const timer = setInterval(() => {
                if (index < text.length) { // Use < instead of <= to prevent undefined char
                    setDisplayedText((prev) => prev + text.charAt(index));
                    index++;
                } else {
                    clearInterval(timer);
                    setIsTyping(false);
                    if (onComplete) onComplete();
                }
            }, 10); // Faster typing speed
            return () => clearInterval(timer);
        }, delay);

        return () => clearTimeout(timeout);
    }, [text, delay, onComplete]);

    return (
        <span className="leading-relaxed">
            {displayedText}
            {isTyping && <span className="animate-pulse">_</span>}
        </span>
    );
};

// --- NEW COMPONENTS FOR ENHANCED UI ---

const ResultCard = ({ title, content, icon: Icon, delay }) => (
    <div
        className="bg-white p-6 rounded-2xl border border-gray-100 shadow-card hover:shadow-card-hover transition-all duration-500 ease-out transform translate-y-4 opacity-0 animate-[fadeIn_0.5s_ease-out_forwards]"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
            <div className="p-2 bg-cream rounded-lg text-ink">
                {Icon && <Icon size={20} strokeWidth={1.5} />}
            </div>
            <h3 className="font-bold text-lg text-ink tracking-tight">{title}</h3>
        </div>
        <div className="text-gray-600 text-sm leading-7 text-justify font-sans">
            <TypewriterText text={content} delay={delay + 200} />
        </div>
    </div>
);

const ScoreCard = ({ scoreData }) => {
    // 根據總分決定等級與顏色
    const getGradeColor = (grade) => {
        if (grade === 'S') return 'text-amber-500 bg-amber-50 border-amber-200';
        if (grade === 'A') return 'text-emerald-500 bg-emerald-50 border-emerald-200';
        if (grade === 'B') return 'text-blue-500 bg-blue-50 border-blue-200';
        return 'text-gray-500 bg-gray-50 border-gray-200';
    };

    const gradeStyle = getGradeColor(scoreData.grade);

    return (
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-elevated mb-8 animate-[fadeIn_0.8s_ease-out]">
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                {/* Left: Total Score */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-muted text-sm font-medium tracking-widest uppercase mb-2">LifeOS Integrity</div>
                    <div className="flex items-baseline justify-center">
                        <span className="text-7xl font-black text-ink tracking-tighter">{scoreData.total}</span>
                        <span className="text-xl text-gray-400 font-medium">/1000</span>
                    </div>
                    <div className={`mt-4 px-6 py-2 rounded-full border text-xl font-bold ${gradeStyle}`}>
                        Grade {scoreData.grade}
                    </div>
                </div>

                {/* Right: Radar/List View of Metrics */}
                <div className="w-full grid grid-cols-2 gap-4">
                    {Object.entries(scoreData).map(([key, value]) => {
                        if (['total', 'percentile', 'grade'].includes(key)) return null;
                        // Format key text (e.g., emotional_stability -> Emotional Stability)
                        const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                        return (
                            <div key={key} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <div className="text-xs text-gray-400 uppercase font-bold">{label}</div>
                                <div className="flex items-end justify-between">
                                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden mr-3">
                                        <div
                                            className="h-full bg-ink rounded-full transition-all duration-1000 ease-out"
                                            style={{ width: `${value / 10}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm font-bold text-ink">{value}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                    Your LifeOS outperforms <span className="font-bold text-ink">{scoreData.percentile}%</span> of users.
                </p>
            </div>
        </div>
    );
};

const HotfixCard = ({ tasks, title, delay }) => (
    <div
        className="bg-ink text-cream p-8 rounded-2xl shadow-elevated animate-[fadeIn_0.5s_ease-out_forwards]"
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className="flex items-center gap-3 mb-6">
            <Terminal size={24} className="text-accent" />
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
        <div className="space-y-4">
            {tasks.map((task, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="mt-1 min-w-[24px] h-6 flex items-center justify-center bg-accent text-white text-xs font-bold rounded-full">
                        {idx + 1}
                    </div>
                    <div>
                        <div className="text-xs text-gray-400 mb-1 uppercase tracking-wider">{task.type}</div>
                        <p className="text-sm leading-relaxed text-gray-200 font-mono">{task.text}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const SystemConsole = ({ title, onSend, history, placeholder }) => {
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            onSend(input);
            setInput('');
        }
    };

    return (
        <div className="mt-8 bg-gray-900 rounded-2xl overflow-hidden shadow-elevated border border-gray-800 font-mono">
            <div className="bg-gray-800 px-4 py-3 flex items-center justify-between border-b border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-3 text-xs text-gray-400 font-medium">~/lifeos/core_system</span>
                </div>
                <div className="text-xs text-gray-500">{title}</div>
            </div>

            <div
                ref={scrollRef}
                className="h-[300px] overflow-y-auto p-6 space-y-4 scroll-smooth"
            >
                {/* Initial System Message */}
                <div className="flex gap-3">
                    <div className="text-accent shrink-0">➜</div>
                    <div className="text-gray-300 text-sm">System initialized. Waiting for user input...</div>
                </div>

                {history.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 animate-fadeIn ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="text-accent shrink-0">➜</div>}
                        <div className={`max-w-[85%] text-sm rounded-lg p-3 ${msg.role === 'user'
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-4 bg-gray-800 border-t border-gray-700 flex gap-3">
                <div className="text-accent py-2">➜</div>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={placeholder}
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none py-2"
                />
                <button
                    type="submit"
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    disabled={!input.trim()}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};


export default function App() {
    // --- STATE MANAGEMENT ---
    const [step, setStep] = useState('input');
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        // Basic
        birthDate: '',
        birthLocation: '', // New

        // Personality Layer
        energySource: '',     // I vs E (Introvert/Extrovert)
        decisionModel: '',    // T vs F (Thinking/Feeling)

        // Core Issues
        currentBottleneck: '',

        // Family & Context (New)
        familyBackground: '',
        parentalStyle: '',    // New
        siblingOrder: '',     // New
        grandparentHistory: '', // New (Socrates style deep dig)

        // Career & Status
        salary: '',
        currentRole: '',
        yearInJob: '',

        // Hidden Variables
        pastRelationship: '', // New
        screenTime: '',       // New
    });

    // Analysis Result
    const [analysis, setAnalysis] = useState(null);

    // Chat
    const [chatHistory, setChatHistory] = useState([]);

    // Language State
    const [language, setLanguage] = useState(() => {
        return localStorage.getItem('lifeos-language') || 'zh-TW';
    });

    // I18N Translations
    const translations = {
        'zh-TW': {
            title: "LifeOS Audit",
            subtitle: "系統診斷與優化",
            slogan1: "Debug Your",
            slogan2: "Existence.",
            description: "為人類作業系統設計的全方位診斷工具。識別洩漏、優化核心、修補安全弱點。",
            startBtn: "執行系統稽核",
            analyzing: "正在解析生命架構...",
            sections: {
                input: "系統輸入",
                result: "診斷報告",
                action: "修復方案",
                console: "系統終端"
            },
            console: {
                placeholder: "查詢系統核心..."
            },
            restart: "重啟系統",
            form: {
                kernel: "核心規格",
                birthDate: "創建日期（出生）",
                birthLocation: "生成位置",
                energySource: "能量來源",
                logicProcessor: "邏輯處理器",
                rootDirectory: "根目錄（家庭）",
                initialEnv: "初始環境",
                adminStyle: "管理者風格（父母）",
                sequenceId: "序列 ID（排行）",
                legacyCode: "遺留代碼（祖父母）",
                runtime: "運行時統計",
                currentRole: "當前角色",
                resourceInflow: "資源流入",
                uptime: "正常運行時間",
                criticalErrors: "關鍵錯誤",
                currentBottleneck: "當前瓶頸",
                connectionLogs: "連接日誌（關係）",
                screenTime: "平均螢幕時間",
                placeholders: {
                    location: "例如：台北，台灣",
                    family: "簡述家庭氛圍...",
                    parentStyle: "嚴格、缺席、直升機？",
                    sibling: "例如：長子、中間、么子、獨生",
                    grandparent: "重大事件？戰爭、破產、遷移？",
                    role: "職位名稱",
                    income: "年收入",
                    years: "年資",
                    bottleneck: "現在是什麼阻止了你？",
                    relationship: "重複模式？",
                    hours: "小時/天"
                },
                options: {
                    intro: "內向 (I)",
                    extro: "外向 (E)",
                    thinking: "思考型 (T)",
                    feeling: "感覺型 (F)"
                }
            },
            loading: {
                title: "執行診斷中...",
                subtitle: "存取神經核心... 編譯生命數據...",
                steps: {
                    kernel: "載入核心模組... 成功",
                    memory: "掃描記憶庫... 成功",
                    emotional: "偵測情感洩漏...",
                    found: "找到",
                    optimizing: "優化決策演算法...",
                    compiling: "編譯最終報告..."
                },
                waiting: "💡 系統運作正常，請耐心等待..."
            },
            errors: {
                missingData: "錯誤：缺少核心資料參數",
                apiFailure: "系統故障：API 握手失敗。請重試。",
                systemError: "系統錯誤：與核心連接中斷。"
            },
            footer: ":: API 已加密 :: 不記錄資料 ::",
            score: {
                integrity: "LifeOS 完整度",
                grade: "等級",
                outperforms: "您的 LifeOS 優於"
            },
            consoleInit: "系統初始化完成。等待使用者輸入..."
        },
        'en': {
            title: "LifeOS Audit",
            subtitle: "System Diagnostics & Optimization",
            slogan1: "Debug Your",
            slogan2: "Existence.",
            description: "A comprehensive diagnostic tool for the human operating system. Identify leaks, optimize kernels, and patch security vulnerabilities.",
            startBtn: "Run System Audit",
            analyzing: "Decompiling Life Architecture...",
            sections: {
                input: "System Inputs",
                result: "Diagnostic Report",
                action: "Hotfix Protocol",
                console: "System Terminal"
            },
            console: {
                placeholder: "Query system kernel..."
            },
            restart: "Reboot System",
            form: {
                kernel: "Kernel Specifications",
                birthDate: "Creation Date (Birth)",
                birthLocation: "Spawn Location",
                energySource: "Energy Source",
                logicProcessor: "Logic Processor",
                rootDirectory: "Root Directory (Family)",
                initialEnv: "Initial Environment",
                adminStyle: "Admin Style (Parents)",
                sequenceId: "Sequence ID (Sibling Order)",
                legacyCode: "Legacy Code (Grandparents)",
                runtime: "Runtime Stats",
                currentRole: "Current Role",
                resourceInflow: "Resource Inflow",
                uptime: "Uptime",
                criticalErrors: "Critical Errors",
                currentBottleneck: "Current Bottleneck",
                connectionLogs: "Connection Logs (Relationships)",
                screenTime: "Screen Time Avg",
                placeholders: {
                    location: "e.g. Taipei, Taiwan",
                    family: "Briefly describe family atmosphere...",
                    parentStyle: "Strict, Absent, Helicopter?",
                    sibling: "e.g. Eldest, Middle, Youngest, Only",
                    grandparent: "Any major events? War, bankruptcy, migration?",
                    role: "Job Title",
                    income: "Annual Income",
                    years: "Years in role",
                    bottleneck: "What is stopping you right now?",
                    relationship: "Recurring patterns?",
                    hours: "Hours/Day"
                },
                options: {
                    intro: "Into (I)",
                    extro: "Extro (E)",
                    thinking: "Thinking (T)",
                    feeling: "Feeling (F)"
                }
            },
            loading: {
                title: "Running Diagnostics...",
                subtitle: "Accessing Neural Core... Compiling Life Data...",
                steps: {
                    kernel: "Loading kernel modules... OK",
                    memory: "Scanning memory banks... OK",
                    emotional: "Detecting emotional leaks...",
                    found: "FOUND",
                    optimizing: "Optimizing decision algorithms...",
                    compiling: "Compiling final report..."
                },
                waiting: "💡 System running normally, please wait..."
            },
            errors: {
                missingData: "CRITICAL ERROR: MISSING CORE DATA PARAMETERS",
                apiFailure: "SYSTEM FAILURE: API HANDSHAKE FAILED. TRY AGAIN.",
                systemError: "System Error: Connection to Kernel Lost."
            },
            footer: ":: API ENCRYPTED :: NO DATA LOGGING ::",
            score: {
                integrity: "LifeOS Integrity",
                grade: "Grade",
                outperforms: "Your LifeOS outperforms"
            },
            consoleInit: "System initialized. Waiting for user input..."
        }
    };

    const t = translations[language];

    // Toggle Language
    const toggleLanguage = () => {
        const newLang = language === 'zh-TW' ? 'en' : 'zh-TW';
        setLanguage(newLang);
        localStorage.setItem('lifeos-language', newLang);
    };


    // --- API HANDLERS ---

    // 呼叫 Cloudflare Functions 調用 Gemini 2.0
    const runDeepSeekAnalysis = async (data) => {
        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(errText || 'Analysis failed');
            }

            const result = await response.json();
            // Gemini 2.0 returns raw text, but we instructed JSON.
            // Check if 'text' property is a JSON string or need parsing
            let parsedData;
            try {
                // Try parsing the text field if it exists
                if (result.text) {
                    // Remove markdown code blocks if present
                    const cleanJson = result.text.replace(/```json/g, '').replace(/```/g, '');
                    parsedData = JSON.parse(cleanJson);
                } else {
                    parsedData = result; // Fallback
                }
            } catch (e) {
                console.error("JSON Parse Error", e);
                // Fallback structure if AI fails to return valid JSON
                parsedData = {
                    life_os_score: { total: 0, grade: 'F' },
                    childhood_audit: { title: 'Analysis Error', content: 'AI returned invalid data format.' }
                };
            }
            return parsedData;

        } catch (error) {
            console.error("API Error", error);
            throw error;
        }
    };

    const runDeepSeekChat = async (history, message, context) => {
        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    history,
                    userQuery: message,
                    userContext: context
                })
            });

            if (!response.ok) throw new Error('Chat failed');

            const result = await response.json();
            return result.text;
        } catch (error) {
            console.error(error);
            return "System Error: Connection to Kernel Lost.";
        }
    };

    // --- LOGIC ---

    const handleAnalyze = async () => {
        if (!formData.birthDate || !formData.currentBottleneck) {
            setErrorMsg(t.errors.missingData);
            return;
        }

        setStep('analyzing');
        setLoading(true);
        setErrorMsg('');

        // Progress Simulation
        let p = 0;
        const interval = setInterval(() => {
            p += Math.floor(Math.random() * 5) + 1;
            if (p > 90) clearInterval(interval);
            setProgress(p > 90 ? 90 : p);
        }, 100);

        try {
            const result = await runDeepSeekAnalysis(formData);

            clearInterval(interval);
            setProgress(100);

            setTimeout(() => {
                setAnalysis(result);
                setStep('result');
                setLoading(false);
            }, 800);

        } catch (err) {
            clearInterval(interval);
            setLoading(false);
            setStep('input');
            setErrorMsg(t.errors.apiFailure);
        }
    };

    const handleChat = async (msg) => {
        const newUserMsg = { role: 'user', content: msg };
        setChatHistory(prev => [...prev, newUserMsg]);

        const aiResponse = await runDeepSeekChat(chatHistory, msg, analysis);

        setChatHistory(prev => [...prev, { role: 'model', content: aiResponse }]);
    };


    return (
        <div className="min-h-screen bg-cream font-sans text-ink selection:bg-accent selection:text-white pb-20">
            {/* BACKGROUND ELEMENTS */}
            <div className="fixed inset-0 pointer-events-none opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-opacity-20 z-0"></div>

            {/* HEADER */}
            <header className="fixed top-0 w-full z-50 bg-cream/80 backdrop-blur-md border-b border-gray-200">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-ink text-white flex items-center justify-center">
                            <Activity size={18} />
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">LifeOS<span className="text-accent">_Audit</span></h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLanguage}
                            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2"
                            title="Switch Language"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                            </svg>
                            {language === 'zh-TW' ? 'EN' : '繁中'}
                        </button>
                        <div className="text-xs font-mono text-muted flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            SYSTEM ONLINE v2.4
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-28 max-w-4xl mx-auto px-6 relative z-10">

                {/* INPUT VIEW */}
                {step === 'input' && (
                    <div className="animate-[slideUp_0.6s_ease-out] space-y-12">
                        <div className="text-center space-y-4 mb-12">
                            <h2 className="text-5xl md:text-6xl font-black track tracking-tighter leading-tight">
                                {t.slogan1} <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-ink to-gray-500">{t.slogan2}</span>
                            </h2>
                            <p className="text-lg text-gray-500 max-w-xl mx-auto font-medium">
                                {t.description}
                            </p>
                        </div>

                        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-elevated border border-gray-100">
                            {/* SECTION 1: KERNEL */}
                            <div className="mb-10">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                                    <Cpu size={16} /> {t.form.kernel}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label="Creation Date (Birth)"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(v) => setFormData({ ...formData, birthDate: v })}
                                    />
                                    <InputField
                                        label="Spawn Location"
                                        placeholder="e.g. Taipei, Taiwan"
                                        value={formData.birthLocation}
                                        onChange={(v) => setFormData({ ...formData, birthLocation: v })}
                                    />
                                    <InputField
                                        label="Energy Source"
                                        value={formData.energySource}
                                        onChange={(v) => setFormData({ ...formData, energySource: v })}
                                        options={['Into (I)', 'Extro (E)']}
                                    />
                                    <InputField
                                        label="Logic Processor"
                                        value={formData.decisionModel}
                                        onChange={(v) => setFormData({ ...formData, decisionModel: v })}
                                        options={['Thinking (T)', 'Feeling (F)']}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100 my-8" />

                            {/* SECTION 2: ROOT DIRECTORY */}
                            <div className="mb-10">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                                    <Database size={16} /> Root Directory (Family)
                                </h3>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Initial Environment"
                                            placeholder="Briefly describe family atmosphere..."
                                            value={formData.familyBackground}
                                            onChange={(v) => setFormData({ ...formData, familyBackground: v })}
                                        />
                                        <InputField
                                            label="Admin Style (Parents)"
                                            placeholder="Strict, Absent, Helicopter?"
                                            value={formData.parentalStyle}
                                            onChange={(v) => setFormData({ ...formData, parentalStyle: v })}
                                        />
                                    </div>
                                    <InputField
                                        label="Sequence ID (Sibling Order)"
                                        placeholder="e.g. Eldest, Middle, Youngest, Only"
                                        value={formData.siblingOrder}
                                        onChange={(v) => setFormData({ ...formData, siblingOrder: v })}
                                    />
                                    <InputField
                                        label="Legacy Code (Grandparents)"
                                        placeholder="Any major events? War, bankruptcy, migration?"
                                        value={formData.grandparentHistory}
                                        onChange={(v) => setFormData({ ...formData, grandparentHistory: v })}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100 my-8" />

                            {/* SECTION 3: RUNTIME METRICS */}
                            <div className="mb-10">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                                    <Activity size={16} /> Runtime Stats
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <InputField
                                        label="Current Role"
                                        placeholder="Job Title"
                                        value={formData.currentRole}
                                        onChange={(v) => setFormData({ ...formData, currentRole: v })}
                                    />
                                    <InputField
                                        label="Resource Inflow"
                                        placeholder="Annual Income"
                                        value={formData.salary}
                                        onChange={(v) => setFormData({ ...formData, salary: v })}
                                    />
                                    <InputField
                                        label="Uptime"
                                        placeholder="Years in role"
                                        value={formData.yearInJob}
                                        onChange={(v) => setFormData({ ...formData, yearInJob: v })}
                                    />
                                </div>
                            </div>

                            <hr className="border-gray-100 my-8" />

                            {/* SECTION 4: ERROR LOGS */}
                            <div className="mb-10">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                                    <AlertTriangle size={16} /> Critical Errors
                                </h3>
                                <div className="space-y-6">
                                    <InputField
                                        label="Current Bottleneck"
                                        placeholder="What is stopping you right now?"
                                        value={formData.currentBottleneck}
                                        onChange={(v) => setFormData({ ...formData, currentBottleneck: v })}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <InputField
                                            label="Connection Logs (Relationships)"
                                            placeholder="Recurring patterns?"
                                            value={formData.pastRelationship}
                                            onChange={(v) => setFormData({ ...formData, pastRelationship: v })}
                                        />
                                        <InputField
                                            label="Screen Time Avg"
                                            placeholder="Hours/Day"
                                            value={formData.screenTime}
                                            onChange={(v) => setFormData({ ...formData, screenTime: v })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* SUBMIT */}
                            <div className="mt-12">
                                {errorMsg && (
                                    <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl text-center text-sm font-bold border border-red-100 flex items-center justify-center gap-2">
                                        <AlertTriangle size={16} /> {errorMsg}
                                    </div>
                                )}
                                <button
                                    onClick={handleAnalyze}
                                    className="w-full py-5 bg-ink text-white rounded-xl font-bold text-lg hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group"
                                >
                                    {t.startBtn} <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-xs text-gray-400 font-mono">
                            :: API ENCRYPTED :: NO DATA LOGGING ::
                        </div>
                    </div>
                )}

                {/* LOADING VIEW */}
                {step === 'analyzing' && (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-[fadeIn_0.5s_ease-out]">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-accent animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center font-mono font-bold text-ink">
                                {progress}%
                            </div>
                        </div>
                        <h2 className="mt-8 text-2xl font-bold text-ink tracking-tight animate-pulse">Running Diagnostics...</h2>
                        <div className="mt-2 text-gray-500 font-mono text-sm">
                            Accessing Neural Core... Compiling Life Data...
                        </div>

                        {/* Fake Terminal Output */}
                        <div className="mt-8 w-full max-w-md bg-black text-green-500 p-4 rounded-xl font-mono text-xs opacity-80 h-32 overflow-hidden shadow-2xl border border-gray-800">
                            <div className="space-y-1">
                                {progress > 10 && <div>&gt; Loading kernel modules... OK</div>}
                                {progress > 30 && <div>&gt; Scanning memory banks... OK</div>}
                                {progress > 50 && <div>&gt; Detecting emotional leaks... <span className="text-red-500">FOUND</span></div>}
                                {progress > 70 && <div>&gt; Optimizing decision algorithms...</div>}
                                {progress > 90 && <div>&gt; Compiling final report...</div>}
                                <div className="animate-pulse">_</div>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <p className="text-[10px] text-muted mt-3 text-center">
                                💡 系統運作正常，請耐心等待...
                            </p>
                        </div>
                    </div>
                )}

                {/* RESULT VIEW */}
                {step === 'result' && analysis && (
                    <div className="animate-[fadeIn_0.8s_ease-out] pb-20 space-y-8">

                        {/* SCORE CARD - NEW! */}
                        {analysis.life_os_score && <ScoreCard scoreData={analysis.life_os_score} />}

                        {/* ROW 1: CORE SPECS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <ResultCard delay={0} icon={Database} title={analysis.childhood_audit?.title} content={analysis.childhood_audit?.content} />
                            <ResultCard delay={100} icon={Cpu} title={analysis.personality_kernel?.title} content={analysis.personality_kernel?.content} />
                            <ResultCard delay={200} icon={Compass} title={analysis.career_throughput?.title} content={analysis.career_throughput?.content} />
                        </div>

                        {/* ROW 2: 5 NEW STRATEGY MODULES */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {analysis.sunk_cost_scanner && <ResultCard delay={250} icon={AlertTriangle} title={analysis.sunk_cost_scanner.title} content={analysis.sunk_cost_scanner.content} />}
                            {analysis.relationship_debugger && <ResultCard delay={300} icon={Network} title={analysis.relationship_debugger.title} content={analysis.relationship_debugger.content} />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {analysis.dopamine_leak && <ResultCard delay={350} icon={Zap} title={analysis.dopamine_leak.title} content={analysis.dopamine_leak.content} />}
                            {analysis.generational_trauma && <ResultCard delay={400} icon={Layers} title={analysis.generational_trauma.title} content={analysis.generational_trauma.content} />}
                            {analysis.wealth_algorithm && <ResultCard delay={450} icon={Database} title={analysis.wealth_algorithm.title} content={analysis.wealth_algorithm.content} />}
                        </div>

                        {/* ROW 3: DEEP INSIGHTS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {analysis.energy_protocol && <ResultCard delay={500} icon={Activity} title={analysis.energy_protocol.title} content={analysis.energy_protocol.content} />}
                            {analysis.security_vulnerabilities && <ResultCard delay={550} icon={Lock} title={analysis.security_vulnerabilities.title} content={analysis.security_vulnerabilities.content} />}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {analysis.the_north_star && <ResultCard delay={600} icon={Search} title={analysis.the_north_star.title} content={analysis.the_north_star.content} />}
                            {analysis.version_roadmap && <ResultCard delay={650} icon={Compass} title={analysis.version_roadmap.title} content={analysis.version_roadmap.content} />}
                        </div>

                        {/* HOTFIX MODULE */}
                        <div className="mt-8">
                            <HotfixCard delay={700} tasks={analysis.hotfix_protocol || []} title={t.sections.action} />
                        </div>

                        {/* SYSTEM CONSOLE */}
                        <SystemConsole
                            title={t.sections.console}
                            placeholder={t.console.placeholder}
                            onSend={handleChat}
                            history={chatHistory}
                        />

                        <button
                            onClick={() => { setStep('input'); setAnalysis(null); setErrorMsg(''); setChatHistory([]); }}
                            className="mt-12 mx-auto flex items-center gap-2 text-xs font-medium text-muted hover:text-accent uppercase tracking-widest border-b border-transparent hover:border-accent pb-1 transition-all"
                        >
                            <RefreshCw size={12} /> {t.restart}
                        </button>
                    </div>
                )}

            </main>
        </div>
    );
}
