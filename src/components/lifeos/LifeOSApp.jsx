import React, { useState, useEffect, useRef } from 'react';
import {
    Terminal, RefreshCw, Lock, Search,
    AlertTriangle, Check, ArrowRight,
    Activity, Database, Cpu, Network, Compass, Layers, Zap,
    BrainCircuit, Info, X, BookOpen, Shield, Code
} from 'lucide-react';

/**
 * ------------------------------------------------------------------
 * LIFEOS AUDIT v7.0 (NVIDIA DeepSeek-R1 Powered)
 * 核心：NVIDIA DeepSeek-R1 - 超強推理引擎 + 社會學逆向工程
 * 風格：Neo-Brutalism (Zen Mode) - 白底黑框綠字
 * ------------------------------------------------------------------
 */

// --- API CONFIGURATION ---
// API Key 現在隱藏於 Cloudflare Functions 中，前端不再需要

const I18N = {
    'zh-TW': {
        ui: {
            title: 'LifeOS: 人生除錯計畫',
            subtitle: 'LIFE DEBUGGER // SYSTEM v8.0',
            version: 'v8.0 AI',
            restart: 'REBOOT_SYSTEM',
            startBtn: 'INITIATE_DEBUG_SEQUENCE',
            awaiting: 'WAITING_FOR_INPUT_VECTOR...',
            privacy: ':: ENCRYPTED_CONNECTION :: LOGS_PURGED ::',
            error_missing: '[ERROR] 參數缺失 MISSING_PARAMS',
            error_api: '[ERROR] CONNECTION_LOST (Switching to Offline Mode)',
            sections: {
                kernel: 'KERNEL_LOGIC (核心邏輯)',
                social: 'ENV_VARIABLES (環境變數)',
                status: 'RUNTIME_STATUS (當前狀態)',
                action: 'HOTFIX_PATCH (行動補丁)',
                console: 'DEBUG_CONSOLE (除錯終端)'
            },
            loading: {
                main: 'SYSTEM_DIAGNOSTIC_IN_PROGRESS...',
                logs: [
                    '> Mounting LifeOS v8.0 Kernel...',
                    '> Scanning for Cognitive Bias Bugs...',
                    '> Compiling Trauma Logs...',
                    '> Generating Hotfix Protocol...'
                ]
            },
            console: {
                placeholder: '輸入指令或詢問 Bug (e.g., /fix 感情內耗)',
                send: 'EXECUTE'
            }
        },
        options: {
            gender: ['男性', '女性', '多元性別'],
            sibling: ['排行老大', '中間排行', '排行老么', '獨生子女'],
            class: ['勞工階級 (Scarcity)', '中產階級 (Stability)', '富裕階級 (Abundance)'],
            energy: [
                { label: '獨處充電 (I)', value: 'Introvert' },
                { label: '社交充電 (E)', value: 'Extrovert' }
            ],
            logic: [
                { label: '邏輯優先 (T)', value: 'Thinker' },
                { label: '感受優先 (F)', value: 'Feeler' },
                { label: '兩者兼具/視情況', value: 'Balanced' }
            ],
            bottleneck: [
                { label: '職涯卡關', value: 'Career Stagnation' },
                { label: '感情內耗', value: 'Relationship Conflict' },
                { label: '金錢焦慮', value: 'Financial Anxiety' },
                { label: '人生迷惘', value: 'Existential Crisis' },
                { label: '多重困境同時發生', value: 'Multiple Issues' },
                { label: '沒有明確瓶頸/一切還好', value: 'No Major Issue' },
                { label: '時間管理/效率問題', value: 'Time Management' },
                { label: '人際關係/社交困擾', value: 'Social Issues' }
            ],
            education: ['高中以下', '大學 (學士)', '碩士', '博士', '自學成才'],
            salary: ['50萬以下/年', '50-100萬/年', '100-200萬/年', '200-500萬/年', '500萬以上/年'],
            yearInJob: ['1年以下', '1-3年', '3-5年', '5-10年', '10年以上'],
            parentalStyle: ['權威型 (高要求/更回應)', '專制型 (高要求/不回應)', '放任型 (低要求/更回應)', '忽視型 (低要求/不回應)', '混合型/不一致', '記不清楚/不確定', '單親家庭', '隔代教養'],
            pastRelationship: ['穩定長久', '頻繁更換', '焦慮依賴', '逃避疏離', '母胎單身'],
            screenTime: ['2小時以下', '2-4小時', '4-6小時', '6-8小時', '8小時以上'],
            grandparentHistory: ['平穩安康', '經歷戰爭', '經歷飢荒/貧窮', '曾經歷迫害/逃難', '普通家庭/平凡生活', '創業或經商背景', '公教人員/穩定職業', '不清楚/沒接觸過'],
            labels: {
                birthDate: '出生日期',
                birthLocation: '出生城市',
                gender: '生理性別',
                sibling: '家中排行',
                class: '家庭階級',
                edu: '學歷/科系',
                currLoc: '現居城市',
                currRole: '當前職業',
                salary: '年收入 (Optional)',
                yearInJob: '現職年資 (Optional)',
                parentalStyle: '父母教養風格 (Optional)',
                pastRelationship: '過去感情模式 (Optional)',
                screenTime: '每日螢幕時間 (Optional)',
                grandparentHistory: '祖父母歷史 (Optional)',
                bottleneck: '當前瓶頸',
                criticalEvent: '重大轉折點 (Optional)'
            }
        }
    },
    'en-US': {
        ui: {
            title: 'LifeOS Audit',
            subtitle: 'LLaMA 3.1 405B Hyper-Core',
            version: 'v7.0 AI',
            restart: 'REBOOT SYSTEM',
            startBtn: 'RUN DEEP SCAN',
            awaiting: 'WAITING FOR INPUT...',
            privacy: ':: API ENCRYPTED :: NO DATA LOGGING ::',
            error_missing: '[ERROR] MISSING PARAMS',
            error_api: '[ERROR] API Connection Failed (Fallback Mode)',
            sections: {
                kernel: 'KERNEL SPECS',
                social: 'SOCIAL VARS',
                status: 'RUNTIME STATUS',
                action: 'ACTION PATCH',
                console: 'SYSTEM CONSOLE'
            },
            loading: {
                main: 'DEEPSEEK-R1 IS REASONING...',
                logs: [
                    '> Initializing DeepSeek Reasoning Engine...',
                    '> Processing Sociological Parameters...',
                    '> Running Multi-Dimensional Analysis...',
                    '> Synthesizing Strategic Insights...'
                ]
            },
            console: {
                placeholder: 'Enter command or ask about bugs (e.g., How to fix relationship anxiety?)',
                send: 'EXECUTE'
            }
        },
        options: {
            gender: ['Male', 'Female', 'Non-binary'],
            sibling: ['Eldest', 'Middle', 'Youngest', 'Only Child'],
            class: ['Working Class (Scarcity)', 'Middle Class (Stability)', 'Wealthy (Abundance)'],
            energy: [
                { label: 'Recharge Alone (I)', value: 'Introvert' },
                { label: 'Recharge Socially (E)', value: 'Extrovert' }
            ],
            logic: [
                { label: 'Logic First (T)', value: 'Thinker' },
                { label: 'Feelings First (F)', value: 'Feeler' },
                { label: 'Both/Context-Based', value: 'Balanced' }
            ],
            bottleneck: [
                { label: 'Career Stuck', value: 'Career Stagnation' },
                { label: 'Relationship Drain', value: 'Relationship Conflict' },
                { label: 'Money Anxiety', value: 'Financial Anxiety' },
                { label: 'Life Confusion', value: 'Existential Crisis' }
            ],
            education: ['High School or below', 'Bachelor Degree', 'Master Degree', 'PhD', 'Self-Taught'],
            salary: ['Under 500k/yr', '500k-1M/yr', '1M-2M/yr', '2M-5M/yr', 'Over 5M/yr'],
            yearInJob: ['Under 1 yr', '1-3 yrs', '3-5 yrs', '5-10 yrs', 'Over 10 yrs'],
            parentalStyle: ['Authoritative', 'Authoritarian', 'Permissive', 'Neglectful'],
            pastRelationship: ['Stable & Long-term', 'Frequent Changes', 'Anxious/Dependent', 'Avoidant/Distant', 'Never in Relationship'],
            screenTime: ['Under 2 hrs', '2-4 hrs', '4-6 hrs', '6-8 hrs', 'Over 8 hrs'],
            grandparentHistory: ['Stable/Peaceful', 'War Experience', 'Famine/Poverty', 'Persecution/Refugee', 'Unknown'],
            labels: {
                birthDate: 'Birth Date',
                birthLocation: 'Birth City',
                gender: 'Gender',
                sibling: 'Birth Order',
                class: 'Family Class',
                edu: 'Education/Major',
                currLoc: 'Current City',
                currRole: 'Current Job',
                salary: 'Annual Salary (Optional)',
                yearInJob: 'Years in Job (Optional)',
                parentalStyle: 'Parental Style (Optional)',
                pastRelationship: 'Past Relationship Pattern (Optional)',
                screenTime: 'Daily Screen Time (Optional)',
                grandparentHistory: 'Grandparent History (Optional)',
                bottleneck: 'Current Bottleneck',
                criticalEvent: 'Critical Life Event (Optional)'
            }
        }
    }
};

// --- MOCK FALLBACK ---
const mockFallback = (data) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
                childhood_audit: { title: "LEGACY SYSTEM (童年設定)", content: "由於無法連線 AI 核心，正在調用備用數據庫... 檢測到您的童年可能受限於資源匱乏協定 (Scarcity Protocol)，導致現在即使有能力，仍難以安心享受成果。" },
                personality_kernel: { title: "CORE KERNEL (真實性格)", content: "備用分析：您可能運行著「責任過載」的驅動程式。習慣照顧他人，卻忽略了自己的系統維護需求。" },
                career_throughput: { title: "PROCESS OPTIMIZATION (職業天賦)", content: "建議將運算資源從「執行」轉移至「架構」。您的價值在於整合而非單點輸出。" },
                wealth_algorithm: { title: "WEALTH MATRIX (金錢觀)", content: "金錢焦慮源於對未來的不可控預測。建議建立自動化投資模組以釋放腦力。" },
                relationship_api: { title: "CONNECTIVITY (感情模式)", content: "請檢查您的「示弱接口 (Vulnerability Port)」。防火牆開得太高,導致親密關係封包無法進入。" },
                energy_protocol: { title: "ENERGY PROTOCOL (能量管理)", content: "警告：背景程式過多。請每日執行一次「飛航模式」進行系統冷卻。" },
                security_vulnerabilities: { title: "HIDDEN BUG (內心隱憂)", content: "雖然表面穩定，但內核深處存在「冒牌者症候群 (Imposter Syndrome)」的 Bug。" },
                the_north_star: { title: "THE NORTH STAR (人生意義)", content: "尋找那個能讓您進入「心流 (Flow State)」的專案，那才是您的主程式。" },
                version_roadmap: { title: "VERSION ROADMAP (未來建議)", content: "1. 停止自我攻擊。\n2. 建立小規模成功循環。\n3. 重構人際邊界。" },
                hotfix_protocol: [
                    { id: 1, type: "COGNITIVE", text: "備用任務：每天對鏡子稱讚自己一次。" },
                    { id: 2, type: "BEHAVIORAL", text: "備用任務：拒絕一個不合理的請求。" },
                    { id: 3, type: "SYSTEM", text: "備用任務：睡前遠離藍光。" }
                ]
            });
        }, 2000);
    });
};

/**
 * ------------------------------------------------------------------
 * GEMINI 2.0 FLASH ANALYSIS ENGINE
 * 透過 Cloudflare Functions 調用 Gemini 2.0 Flash
 * API Key 完全隱藏於後端
 * ------------------------------------------------------------------
 */
const runDeepSeekAnalysis = async (formData) => {
    console.log("🚀 Sending data to Gemini 2.0 Flash Backend...");

    // 設定 60秒超時 (Gemini 長文本生成需要較長時間)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
        console.warn("⚠️ Request Timed Out (60s limit). Switching to Fallback Mode.");
        controller.abort();
    }, 60000);

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData), // 直接傳送 formData，Prompt 由後端處理
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.details || errorData.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        // 嘗試解析回傳的 JSON
        if (typeof data === 'string') {
            const jsonMatch = data.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(data);
        } else if (data.text) {
            // 新版後端結構 (Gemini Function)
            const cleanText = data.text.replace(/```json/g, '').replace(/```/g, '').trim();
            const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
            return jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(cleanText);
        }

        // 如果直接是物件
        return data;

    } catch (error) {
        console.error("Analysis Engine Error:", error);
        clearTimeout(timeoutId);

        // 發生任何錯誤 (包括超時) 都切換到 Mock Data
        const fallback = await mockFallback(formData);

        // 根據錯誤類型顯示不同訊息
        const errorMsg = error.name === 'AbortError'
            ? "[分析超時] AI 思考過久，這是為您準備的基礎分析 (System Fallback)"
            : `[系統連線錯誤] ${error.message} (目前顯示範例資料)`;

        fallback.childhood_audit.content = errorMsg;
        return fallback;
    }
};


/**
 * ------------------------------------------------------------------
 * DeepSeek-R1 CHAT ENGINE (SYSTEM CONSOLE)
 * ------------------------------------------------------------------
 */
const runDeepSeekChat = async (history, userQuery, userContext) => {
    try {
        // Chat 也可以設定一個短一點的 Timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                history,
                userQuery,
                userContext
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Chat Failed');
        }

        const data = await response.json();
        return data.text;

    } catch (error) {
        console.error("Chat Error:", error);
        return `[系統離線] 無法連接至大腦主機 (${error.message})`;
    }
};

// --- UI COMPONENTS ---

const InputField = ({ label, type = "text", value, onChange, options = null, placeholder = "" }) => (
    <div className="flex flex-col gap-2 w-full group">
        <label className="text-xs font-mono font-bold text-emerald-600/70 uppercase tracking-widest group-hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
            {label}
        </label>
        {options ? (
            <div className="relative">
                <select
                    value={value}
                    onChange={onChange}
                    className="w-full bg-black/40 border border-emerald-900/30 rounded-sm px-4 py-3.5 text-base font-medium text-emerald-100 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 shadow-none transition-all duration-200 appearance-none cursor-pointer hover:bg-emerald-900/10 placeholder-emerald-800"
                >
                    <option value="" disabled className="bg-neutral-900 text-neutral-500">--- SELECT_OPTION ---</option>
                    {options.map((opt, i) => {
                        const val = typeof opt === 'object' ? opt.value : opt;
                        const lbl = typeof opt === 'object' ? opt.label : opt;
                        return <option key={val || i} value={val} className="bg-neutral-900 text-emerald-100">{lbl}</option>;
                    })}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-emerald-600 font-bold text-xs">▼</div>
            </div>
        ) : (
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-black/40 border border-emerald-900/30 rounded-sm px-4 py-3.5 text-base font-medium text-emerald-100 placeholder-emerald-900/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 shadow-none transition-all duration-200"
            />
        )}
    </div>
);

const TypewriterText = ({ text, speed = 20, delay = 0 }) => {
    const [displayedText, setDisplayedText] = React.useState('');
    const [currentIndex, setCurrentIndex] = React.useState(0);

    React.useEffect(() => {
        if (!text) return;

        // 初始延遲
        const initialTimer = setTimeout(() => {
            setCurrentIndex(0);
            setDisplayedText('');
        }, delay);

        return () => clearTimeout(initialTimer);
    }, [text, delay]);

    React.useEffect(() => {
        if (!text || currentIndex >= text.length) return;

        const timer = setTimeout(() => {
            setDisplayedText(prev => prev + text[currentIndex]);
            setCurrentIndex(prev => prev + 1);
        }, speed);

        return () => clearTimeout(timer);
    }, [currentIndex, text, speed]);

    return <span>{displayedText}</span>;
};

const ResultCard = ({ title, content, icon: Icon, delay }) => (
    <div
        className="bg-neutral-900/60 backdrop-blur-md rounded-sm border border-emerald-500/20 p-6 h-full flex flex-col hover:border-emerald-500/50 transition-all duration-300 group relative overflow-hidden"
        style={{ animation: `fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`, animationDelay: `${delay}ms`, opacity: 0 }}
    >
        <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
            <Icon size={40} className="text-emerald-500" />
        </div>
        <h3 className="font-mono font-bold text-xs uppercase tracking-widest mb-4 pb-3 border-b border-emerald-500/20 flex items-center gap-2 text-emerald-400">
            {Icon && <Icon size={14} />}
            {title}
        </h3>
        <p className="font-sans text-sm leading-7 text-emerald-100/90 whitespace-pre-line text-justify flex-grow font-light">
            <TypewriterText text={content} speed={10} delay={delay + 300} />
        </p>
    </div>
);

const ScoreCard = ({ scoreData }) => {
    const getGradeColor = (grade) => {
        if (grade === 'Excellent') return 'bg-emerald-400';
        if (grade === 'Good') return 'bg-emerald-500';
        if (grade === 'Fair') return 'bg-amber-400';
        return 'bg-rose-400';
    };

    return (
        <div
            className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-8 shadow-elevated"
            style={{ animation: `fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`, animationDelay: `0ms`, opacity: 0 }}
        >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                    <h2 className="font-mono font-bold text-xl uppercase tracking-tight text-emerald-300">LIFE OS HEALTH SCORE</h2>
                    <p className="text-[10px] font-medium text-emerald-200/60 mt-1 uppercase tracking-wider">人生系統健康評分 (Credit Score Style)</p>
                </div>
                <div className="text-right">
                    <div className="text-5xl font-bold text-white">{scoreData?.total || 750}</div>
                    <span className={`text-xs font-bold ${getGradeColor(scoreData?.grade || 'Good')} text-emerald-950 px-3 py-1 mt-2 inline-block rounded-full`}>
                        {scoreData?.grade || 'GOOD'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <div className="border-l-2 border-emerald-400/50 pl-3">
                    <p className="text-[10px] font-medium text-emerald-200/70 uppercase tracking-wider">EMOTIONAL STABILITY</p>
                    <p className="text-[9px] text-emerald-300/50 mb-1">情緒穩定度</p>
                    <p className="text-2xl font-bold text-white">{scoreData?.emotional_stability || 720}</p>
                </div>
                <div className="border-l-2 border-emerald-400/50 pl-3">
                    <p className="text-[10px] font-medium text-emerald-200/70 uppercase tracking-wider">RELATIONSHIP QUALITY</p>
                    <p className="text-[9px] text-emerald-300/50 mb-1">關係品質</p>
                    <p className="text-2xl font-bold text-white">{scoreData?.relationship_quality || 650}</p>
                </div>
                <div className="border-l-2 border-emerald-400/50 pl-3">
                    <p className="text-[10px] font-medium text-emerald-200/70 uppercase tracking-wider">CAREER ALIGNMENT</p>
                    <p className="text-[9px] text-emerald-300/50 mb-1">職涯契合度</p>
                    <p className="text-2xl font-bold text-white">{scoreData?.career_alignment || 780}</p>
                </div>
                <div className="border-l-2 border-emerald-400/50 pl-3">
                    <p className="text-[10px] font-medium text-emerald-200/70 uppercase tracking-wider">FINANCIAL MINDSET</p>
                    <p className="text-[9px] text-emerald-300/50 mb-1">財務心態</p>
                    <p className="text-2xl font-bold text-white">{scoreData?.financial_mindset || 690}</p>
                </div>
                <div className="border-l-2 border-emerald-400/50 pl-3">
                    <p className="text-[10px] font-medium text-emerald-200/70 uppercase tracking-wider">ENERGY MANAGEMENT</p>
                    <p className="text-[9px] text-emerald-300/50 mb-1">能量管理</p>
                    <p className="text-2xl font-bold text-white">{scoreData?.energy_management || 710}</p>
                </div>
                <div className="border-l-2 border-amber-400/50 pl-3">
                    <p className="text-[10px] font-medium text-emerald-200/70 uppercase tracking-wider">PERCENTILE RANK</p>
                    <p className="text-[9px] text-emerald-300/50 mb-1">百分位排名</p>
                    <p className="text-2xl font-bold text-amber-300">TOP {100 - (scoreData?.percentile || 68)}%</p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-emerald-700/30 rounded-xl border border-emerald-600/30">
                <p className="text-sm font-medium text-emerald-200">
                    🎯 你擊敗了 <span className="text-white text-lg font-bold">{scoreData?.percentile || 68}%</span> 的同齡人
                </p>
            </div>
        </div>
    );
};

const HotfixCard = ({ tasks, title }) => (
    <div
        className="bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-2xl p-6 shadow-elevated"
        style={{ animation: `fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`, animationDelay: `900ms`, opacity: 0 }}
    >
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-white/10">
            <h3 className="font-mono font-bold text-sm uppercase tracking-widest text-emerald-300 flex items-center gap-2">
                <Activity size={16} />
                {title}
            </h3>
            <span className="text-[10px] font-bold bg-emerald-400 text-emerald-950 px-3 py-1 rounded-full">PRIORITY: HIGH</span>
        </div>
        <div className="space-y-4">
            {tasks.map((task, index) => (
                <div key={task.id} className="flex items-start gap-3">
                    <div className="mt-1 w-5 h-5 bg-emerald-500/20 border border-emerald-400/50 rounded flex items-center justify-center shrink-0">
                        <Check size={12} className="text-emerald-400" />
                    </div>
                    <div>
                        <span className="text-[10px] font-medium text-emerald-300/80 uppercase tracking-wider block mb-1">[{task.type}]</span>
                        <p className="font-sans text-sm font-medium text-white/90 leading-relaxed">
                            <TypewriterText text={task.text} speed={12} delay={1200 + index * 400} />
                        </p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const MethodologyModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-zinc-900 border border-zinc-700 w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Cpu className="text-emerald-400" size={24} />
                        </div>
                        <div>
                            <h2 className="text-zinc-100 font-bold text-lg tracking-wide uppercase font-mono">System Architecture</h2>
                            <p className="text-zinc-500 text-xs uppercase tracking-wider">LifeOS 核心運算原理 v7.0</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 font-sans">

                    {/* Section 1: Philosophy */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm uppercase tracking-widest font-bold">
                            <BookOpen size={16} />
                            <h3>Core Philosophy (核心哲學)</h3>
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-sm">
                            LifeOS 不僅僅是一個心理測驗，它是一套<span className="text-zinc-100 font-bold">「社會學逆向工程」</span>系統。
                            我們不相信星座或運勢，我們相信<span className="text-zinc-100 font-bold">「輸入決定輸出」</span>。
                            您的現狀（Output），是您過去所有選擇、環境參數與思維模式（Input）的總和。
                        </p>
                    </div>

                    {/* Section 2: Three Pillars */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                            <h4 className="text-emerald-300 font-bold text-sm mb-2 font-mono uppercase">1. Adlerian Psychology</h4>
                            <p className="text-zinc-400 text-xs leading-5">
                                <span className="text-zinc-500 block mb-1">阿德勒心理學</span>
                                「所有的煩惱都是人際關係的煩惱。」系統會分析您的依附類型與家庭動力，找出深層的性格設定。
                            </p>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                            <h4 className="text-emerald-300 font-bold text-sm mb-2 font-mono uppercase">2. Kondratiev Waves</h4>
                            <p className="text-zinc-400 text-xs leading-5">
                                <span className="text-zinc-500 block mb-1">康波週期經濟學</span>
                                個人奮鬥固然重要，但也要看歷史進程。系統會計算您的出生年份是否踩在經濟週期的紅利點上。
                            </p>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                            <h4 className="text-emerald-300 font-bold text-sm mb-2 font-mono uppercase">3. Game Theory</h4>
                            <p className="text-zinc-400 text-xs leading-5">
                                <span className="text-zinc-500 block mb-1">博弈論與策略</span>
                                生活是資源配置的遊戲。系統會評估您的「時間」、「金錢」與「注意力」是否配置在最高期望值的選項上。
                            </p>
                        </div>
                        <div className="bg-zinc-950/50 p-4 rounded-xl border border-zinc-800/50">
                            <h4 className="text-emerald-300 font-bold text-sm mb-2 font-mono uppercase">4. Object Relations</h4>
                            <p className="text-zinc-400 text-xs leading-5">
                                <span className="text-zinc-500 block mb-1">客體關係理論</span>
                                分析「童年腳本」如何潛意識地影響您現在的職場與感情決策（例如：強迫性重複）。
                            </p>
                        </div>
                    </div>

                    {/* Section 3: How it Works */}
                    <div className="space-y-4 pt-4 border-t border-zinc-800">
                        <div className="flex items-center gap-2 text-emerald-400 font-mono text-sm uppercase tracking-widest font-bold">
                            <Code size={16} />
                            <h3>Processing Logic (運算邏輯)</h3>
                        </div>
                        <ul className="space-y-3 text-sm text-zinc-400">
                            <li className="flex gap-3">
                                <span className="text-emerald-500 font-mono">01.</span>
                                <div>
                                    <span className="text-zinc-200 font-bold">去識別化數據 (Anonymization)</span>
                                    <p className="text-xs mt-1">我們不收集您的姓名或隱私。我們只提取特徵值（如：家中排行、父母教養風格）進行模式匹配。</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-emerald-500 font-mono">02.</span>
                                <div>
                                    <span className="text-zinc-200 font-bold">多維度交叉分析 (Cross-Analysis)</span>
                                    <p className="text-xs mt-1">單一維度（如 MBTI）無法解釋複雜人生。本系統交叉比對「先天性格」x「後天環境」x「時代機遇」。</p>
                                </div>
                            </li>
                        </ul>
                    </div>


                </div>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold py-3 rounded-xl transition-all uppercase tracking-widest text-xs"
                    >
                        Close System Specs
                    </button>
                </div>
            </div>
        </div>
    );
};

const SystemConsole = ({ title, placeholder, onSend, history }) => {
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [history]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSend(input);
        setInput("");
    };

    return (
        <div className="bg-zinc-900 rounded-2xl p-5 mt-8 font-mono shadow-elevated" style={{ animation: `fadeIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`, animationDelay: `1000ms`, opacity: 0 }}>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-zinc-700/50">
                <Terminal size={16} className="text-emerald-400" />
                <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-300">{title}</h3>
            </div>

            <div className="h-48 overflow-y-auto mb-4 space-y-3 p-3 bg-zinc-950 rounded-xl">
                {history.length === 0 && <p className="text-xs text-zinc-500 italic">System Ready. Awaiting commands...</p>}
                {history.map((msg, i) => (
                    <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-3 text-xs font-medium rounded-xl ${msg.role === 'user' ? 'bg-emerald-600 text-white' : 'bg-zinc-800 text-zinc-100'}`}>
                            <span className="opacity-60 text-[10px] block mb-1 uppercase">{msg.role === 'user' ? 'User' : 'System'}</span>
                            {msg.content}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 font-bold">{'>'}</span>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={placeholder}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl py-2.5 pl-7 pr-3 text-sm font-medium text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
                    />
                </div>
                <button type="submit" className="bg-emerald-600 text-white px-5 py-2.5 text-xs font-bold uppercase rounded-xl hover:bg-emerald-500 transition-colors flex items-center gap-1.5">
                    EXECUTE <ArrowRight size={12} />
                </button>
            </form>
        </div>
    );
};

// --- MAIN APP ---

export default function App() {
    const [step, setStep] = useState('input');
    const [language, setLanguage] = useState('zh-TW'); // NEW: Language state
    const [progress, setProgress] = useState(0); // NEW: Progress state
    const [loadingMessage, setLoadingMessage] = useState(''); // NEW: Loading message
    const [formData, setFormData] = useState({
        birthDate: '', birthLocation: '', gender: '', currentLocation: '',
        currentRole: '', siblingOrder: '', education: '', familyBackground: '',
        energySource: '', decisionModel: '', currentBottleneck: '', criticalEvent: '',
        salary: '', yearInJob: '', parentalStyle: '', pastRelationship: '',
        screenTime: '', grandparentHistory: ''
    });
    const [analysis, setAnalysis] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [loadingLogIndex, setLoadingLogIndex] = useState(0);

    const [chatHistory, setChatHistory] = useState([]);
    const [showMethodology, setShowMethodology] = useState(false); // New State

    useEffect(() => {
        let interval;
        if (step === 'loading') {
            interval = setInterval(() => {
                setLoadingLogIndex(prev => (prev + 1) % 4);
            }, 500);
        }
        return () => clearInterval(interval);
    }, [step]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrorMsg('');
    };

    const t = I18N[language].ui;
    const opts = I18N[language].options;

    const startAnalysis = async () => {
        const required = ['birthDate', 'birthLocation', 'gender', 'siblingOrder', 'familyBackground', 'currentBottleneck'];
        if (required.some(f => !formData[f])) {
            setErrorMsg(t.error_missing);
            return;
        }
        setStep('loading');

        // 進度條模擬 - 真實動態更新
        const messages = [
            '正在初始化深度學習模型...',
            '分析童年經歷與性格形成...',
            '計算人生系統健康評分...',
            '整合心理學與社會學數據...',
            '生成個人化成長建議...',
        ];

        let currentProgress = 0;
        setProgress(0);
        setLoadingMessage(messages[0]);

        // 每800ms更新一次進度
        const progressInterval = setInterval(() => {
            currentProgress += Math.random() * 12 + 3; // 每次增加3-15%
            if (currentProgress > 95) currentProgress = 95; // 最多到95%
            setProgress(Math.floor(currentProgress));

            // 根據進度更新訊息
            const messageIndex = Math.min(Math.floor(currentProgress / 20), messages.length - 1);
            setLoadingMessage(messages[messageIndex]);
        }, 800);

        // 執行真實的AI分析
        const result = await runDeepSeekAnalysis(formData);

        // 分析完成，清除計時器並完成進度
        clearInterval(progressInterval);
        setProgress(100);
        setLoadingMessage('分析完成！');

        // 短暫延遲後顯示結果
        setTimeout(() => {
            setAnalysis(result);
            setStep('result');
        }, 500);
    };

    const handleChat = async (msg) => {
        const userMsg = { role: 'user', content: msg };
        setChatHistory(prev => [...prev, userMsg]);

        const loadingMsg = { role: 'ai', content: 'Computing response...' };
        setChatHistory(prev => [...prev, loadingMsg]);

        const responseText = await runDeepSeekChat(chatHistory, msg, { profile: formData, analysis: analysis });

        setChatHistory(prev => {
            const newHist = [...prev];
            newHist.pop();
            return [...newHist, { role: 'ai', content: responseText }];
        });
    };

    return (
        <div className="min-h-screen bg-black text-emerald-50 font-sans p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
            <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-10 pointer-events-none"></div>
            <div className="fixed inset-0 bg-gradient-to-b from-black via-transparent to-emerald-950/20 pointer-events-none"></div>

            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

            {/* HEADER */}
            <header className="w-full max-w-5xl flex justify-between items-end mb-12 border-b border-emerald-900/30 pb-6 relative z-10">
                <div>
                    <h1 className="text-2xl md:text-4xl font-black tracking-tight flex items-center gap-4 text-white">
                        <Terminal className="text-emerald-500" size={36} strokeWidth={2} />
                        <span className="font-mono tracking-tighter">{t.title}</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-3">
                        <p className="text-xs md:text-xs font-mono font-bold uppercase tracking-[0.2em] text-emerald-600/80 pl-1">
                            {t.subtitle} <span className="bg-emerald-900/50 text-emerald-400 px-2 py-0.5 ml-2 rounded text-[10px] border border-emerald-500/20">{t.version}</span>
                        </p>
                        <button
                            onClick={() => setShowMethodology(true)}
                            className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 hover:text-emerald-400 transition-colors px-2 py-1"
                        >
                            <Info size={12} />
                            DOCS
                        </button>
                    </div>
                </div>

                {/* LANGUAGE SWITCHER */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setLanguage('zh-TW')}
                        className={`px-3 py-2 text-xs font-semibold uppercase rounded-lg transition-all ${language === 'zh-TW' ? 'bg-ink text-white' : 'bg-white text-ink border border-gray-200 hover:border-accent'}`}
                    >
                        繁中
                    </button>
                    <button
                        onClick={() => setLanguage('en-US')}
                        className={`px-3 py-2 text-xs font-semibold uppercase rounded-lg transition-all ${language === 'en-US' ? 'bg-ink text-white' : 'bg-white text-ink border border-gray-200 hover:border-accent'}`}
                    >
                        EN
                    </button>
                </div>
            </header>

            <MethodologyModal isOpen={showMethodology} onClose={() => setShowMethodology(false)} />

            {/* MAIN CONTENT */}
            <main className="w-full max-w-4xl">

                {/* INPUT VIEW */}
                {step === 'input' && (
                    <div className="animate-[fadeIn_0.5s_ease-out]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">

                            {/* KERNEL SPECS */}
                            <div className="md:col-span-1 space-y-8">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-6 h-0.5 bg-accent rounded"></span>{t.sections.kernel}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label={opts.labels.birthDate} type="date" value={formData.birthDate} onChange={e => handleInputChange('birthDate', e.target.value)} />
                                    <InputField label={opts.labels.birthLocation} value={formData.birthLocation} onChange={e => handleInputChange('birthLocation', e.target.value)} />
                                    <InputField label={opts.labels.gender} options={opts.gender} value={formData.gender} onChange={e => handleInputChange('gender', e.target.value)} />
                                    <InputField label={opts.labels.sibling} options={opts.sibling} value={formData.siblingOrder} onChange={e => handleInputChange('siblingOrder', e.target.value)} />
                                </div>
                            </div>

                            {/* SOCIAL VARS & ECONOMICS */}
                            <div className="md:col-span-1 space-y-8">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-6 h-0.5 bg-accent rounded"></span>{t.sections.social}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField label={opts.labels.class} options={opts.class} value={formData.familyBackground} onChange={e => handleInputChange('familyBackground', e.target.value)} />
                                    <InputField label={opts.labels.edu} options={opts.education} value={formData.education} onChange={e => handleInputChange('education', e.target.value)} />
                                    <InputField
                                        label={opts.labels.currRole}
                                        value={formData.currentRole}
                                        onChange={e => handleInputChange('currentRole', e.target.value)}
                                        placeholder="E.g. 軟體工程師, 產品經理..."
                                    />
                                    <InputField label={opts.labels.salary} options={opts.salary} value={formData.salary} onChange={e => handleInputChange('salary', e.target.value)} />
                                    <InputField label={opts.labels.yearInJob} options={opts.yearInJob} value={formData.yearInJob} onChange={e => handleInputChange('yearInJob', e.target.value)} />
                                </div>
                            </div>

                            {/* DEEP PSYCHOLOGY & EPIGENETICS */}
                            <div className="md:col-span-2 space-y-8 pt-10 border-t border-gray-200">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-6 h-0.5 bg-accent rounded"></span>DEEP PSYCHOLOGY & EPIGENETICS</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    <InputField label={opts.labels.parentalStyle} options={opts.parentalStyle} value={formData.parentalStyle} onChange={e => handleInputChange('parentalStyle', e.target.value)} />
                                    <InputField label={opts.labels.pastRelationship} options={opts.pastRelationship} value={formData.pastRelationship} onChange={e => handleInputChange('pastRelationship', e.target.value)} />
                                    <InputField label={opts.labels.screenTime} options={opts.screenTime} value={formData.screenTime} onChange={e => handleInputChange('screenTime', e.target.value)} />
                                    <InputField label={opts.labels.grandparentHistory} options={opts.grandparentHistory} value={formData.grandparentHistory} onChange={e => handleInputChange('grandparentHistory', e.target.value)} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                    <InputField label="能量來源 (Energy)" options={opts.energy} value={formData.energySource} onChange={e => handleInputChange('energySource', e.target.value)} />
                                    <InputField label="決策模式 (Logic)" options={opts.logic} value={formData.decisionModel} onChange={e => handleInputChange('decisionModel', e.target.value)} />
                                </div>
                            </div>

                            {/* RUNTIME STATUS */}
                            <div className="md:col-span-2 space-y-8 pt-10 border-t border-gray-200">
                                <h3 className="text-xs font-semibold text-muted uppercase tracking-widest mb-4 flex items-center gap-2"><span className="w-6 h-0.5 bg-accent rounded"></span>{t.sections.status}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputField
                                        label={opts.labels.currLoc}
                                        value={formData.currentLocation}
                                        onChange={e => handleInputChange('currentLocation', e.target.value)}
                                        placeholder="E.g. 台北市, Tech Hub..."
                                    />
                                    <InputField label={opts.labels.bottleneck} options={opts.bottleneck} value={formData.currentBottleneck} onChange={e => handleInputChange('currentBottleneck', e.target.value)} />
                                </div>
                                <div className="mt-4 p-4 bg-green-50 border-2 border-green-200">
                                    <label className="text-[10px] font-bold text-green-800 uppercase tracking-wider block mb-2">
                                        💡 {opts.labels.criticalEvent}
                                    </label>
                                    <textarea
                                        value={formData.criticalEvent}
                                        onChange={e => handleInputChange('criticalEvent', e.target.value)}
                                        placeholder="例如：出國留學、創業失敗、親人離世、重大獲獎... (提供此資訊可大幅提升分析精度)"
                                        className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent shadow-card transition-all duration-200 resize-none"
                                        rows="3"
                                    />
                                    <p className="text-[10px] text-accent mt-2 font-medium">
                                        ⚡ GIGO 原則：輸入的數據顆粒度越細，輸出的模型精確度越高
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            {errorMsg && (
                                <div className="mb-4 text-rose-600 font-medium text-sm flex items-center gap-2 border border-rose-200 p-3 bg-rose-50 rounded-xl">
                                    <AlertTriangle size={16} /> {errorMsg}
                                </div>
                            )}
                            <button
                                onClick={startAnalysis}
                                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-lg py-4 rounded-xl hover:from-emerald-500 hover:to-emerald-600 transition-all uppercase tracking-widest flex justify-center items-center gap-3 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                {t.startBtn} <ArrowRight size={20} />
                            </button>
                            <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">
                                {t.privacy}
                            </p>
                        </div>
                    </div>
                )}

                {/* LOADING VIEW - 優化版 */}
                {step === 'loading' && (
                    <div className="w-full min-h-96 flex flex-col items-center justify-center bg-paper rounded-2xl shadow-card p-12 animate-[fadeIn_0.5s_ease-out]">
                        <BrainCircuit size={64} className="text-accent mb-8 animate-[spin_3s_linear_infinite]" />
                        <h2 className="text-3xl font-bold mb-2 uppercase tracking-tight animate-pulse">分析中</h2>
                        <p className="text-sm font-medium text-muted mb-6">AI 正在深度思考...</p>

                        {/* 動態訊息 */}
                        <div className="text-sm font-medium text-accent mb-6 h-6 text-center">
                            {loadingMessage}
                        </div>

                        {/* 真實進度條 */}
                        <div className="w-full max-w-md">
                            <div className="flex justify-between text-xs font-medium text-muted mb-2">
                                <span>處理進度</span>
                                <span>{progress}%</span>
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
