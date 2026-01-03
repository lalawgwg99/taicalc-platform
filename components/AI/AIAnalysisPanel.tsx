'use client';

import { useState, useEffect } from 'react';
import { 
    Brain, 
    TrendingUp, 
    AlertTriangle, 
    Target, 
    Clock, 
    DollarSign,
    PieChart,
    Lightbulb,
    ChevronDown,
    ChevronUp,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAnalysisPanelProps {
    financialData?: {
        monthlySalary?: number;
        annualIncome?: number;
        monthlyExpenses?: number;
        savings?: number;
        debt?: number;
        age?: number;
    };
    calculatorContext?: {
        type: string;
        result: any;
    };
    className?: string;
}

interface AnalysisInsight {
    category: 'financial_health' | 'risk_assessment' | 'opportunities' | 'recommendations';
    title: string;
    description: string;
    impact: 'high' | 'medium' | 'low';
    actionable: boolean;
    details?: string[];
}

/**
 * AI 分析面板組件
 * 提供深度財務分析和個人化建議
 */
export default function AIAnalysisPanel({ 
    financialData, 
    calculatorContext, 
    className = '' 
}: AIAnalysisPanelProps) {
    const [insights, setInsights] = useState<AnalysisInsight[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // 執行 AI 分析
    useEffect(() => {
        if (!financialData && !calculatorContext) return;
        
        setIsAnalyzing(true);
        
        // 模擬 AI 分析過程
        setTimeout(() => {
            const analysisResults = performAIAnalysis(financialData, calculatorContext);
            setInsights(analysisResults);
            setIsAnalyzing(false);
        }, 1500);
    }, [financialData, calculatorContext]);

    const performAIAnalysis = (
        data?: AIAnalysisPanelProps['financialData'], 
        context?: AIAnalysisPanelProps['calculatorContext']
    ): AnalysisInsight[] => {
        const results: AnalysisInsight[] = [];

        // 財務健康度分析
        if (data?.monthlySalary) {
            const monthlyIncome = data.monthlySalary;
            const estimatedExpenses = data.monthlyExpenses || monthlyIncome * 0.7;
            const savingsRate = ((monthlyIncome - estimatedExpenses) / monthlyIncome) * 100;

            if (savingsRate < 10) {
                results.push({
                    category: 'financial_health',
                    title: '儲蓄率偏低警示',
                    description: `目前儲蓄率約 ${savingsRate.toFixed(1)}%，低於建議的20%標準`,
                    impact: 'high',
                    actionable: true,
                    details: [
                        '建議檢視支出結構，找出可節省的項目',
                        '考慮增加收入來源或副業',
                        '設定自動轉帳強制儲蓄'
                    ]
                });
            } else if (savingsRate > 30) {
                results.push({
                    category: 'opportunities',
                    title: '高儲蓄率投資機會',
                    description: `儲蓄率達 ${savingsRate.toFixed(1)}%，具備良好投資基礎`,
                    impact: 'medium',
                    actionable: true,
                    details: [
                        '可考慮將部分儲蓄投入長期投資',
                        '建議分散投資降低風險',
                        '評估是否需要增加生活品質支出'
                    ]
                });
            }

            // 緊急預備金分析
            const emergencyFund = data.savings || 0;
            const monthsOfExpenses = emergencyFund / estimatedExpenses;
            
            if (monthsOfExpenses < 3) {
                results.push({
                    category: 'risk_assessment',
                    title: '緊急預備金不足',
                    description: `目前預備金僅能支撐 ${monthsOfExpenses.toFixed(1)} 個月支出`,
                    impact: 'high',
                    actionable: true,
                    details: [
                        '建議優先建立3-6個月的緊急預備金',
                        '選擇高流動性的儲蓄工具',
                        '避免將緊急預備金投入高風險投資'
                    ]
                });
            }
        }

        // 根據計算器類型提供特定建議
        if (context?.type === 'salary' && context.result) {
            const result = context.result;
            
            results.push({
                category: 'recommendations',
                title: '薪資優化建議',
                description: '基於您的薪資結構，發現以下優化機會',
                impact: 'medium',
                actionable: true,
                details: [
                    '考慮勞退自提6%享受稅務優惠',
                    '評估是否適合申請薪資轉換方案',
                    '定期檢視勞健保投保薪資是否合適'
                ]
            });
        }

        // 年齡相關建議
        if (data?.age) {
            if (data.age < 30) {
                results.push({
                    category: 'opportunities',
                    title: '年輕優勢投資策略',
                    description: '年輕時期具備時間優勢，適合積極投資',
                    impact: 'medium',
                    actionable: true,
                    details: [
                        '可承受較高風險換取長期報酬',
                        '建議開始定期定額投資',
                        '善用複利效應累積財富'
                    ]
                });
            } else if (data.age > 50) {
                results.push({
                    category: 'recommendations',
                    title: '退休準備加速計劃',
                    description: '距離退休時間縮短，需要調整理財策略',
                    impact: 'high',
                    actionable: true,
                    details: [
                        '增加退休金準備比例',
                        '降低投資風險，保護既有資產',
                        '考慮購買年金保險'
                    ]
                });
            }
        }

        return results;
    };

    const getCategoryIcon = (category: AnalysisInsight['category']) => {
        switch (category) {
            case 'financial_health':
                return <PieChart className="w-4 h-4" />;
            case 'risk_assessment':
                return <AlertTriangle className="w-4 h-4" />;
            case 'opportunities':
                return <TrendingUp className="w-4 h-4" />;
            case 'recommendations':
                return <Lightbulb className="w-4 h-4" />;
            default:
                return <Brain className="w-4 h-4" />;
        }
    };

    const getCategoryColor = (category: AnalysisInsight['category']) => {
        switch (category) {
            case 'financial_health':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'risk_assessment':
                return 'text-red-600 bg-red-50 border-red-200';
            case 'opportunities':
                return 'text-green-600 bg-green-50 border-green-200';
            case 'recommendations':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    const getCategoryName = (category: AnalysisInsight['category']) => {
        switch (category) {
            case 'financial_health':
                return '財務健康';
            case 'risk_assessment':
                return '風險評估';
            case 'opportunities':
                return '投資機會';
            case 'recommendations':
                return '專業建議';
            default:
                return '分析結果';
        }
    };

    const filteredInsights = activeCategory === 'all' 
        ? insights 
        : insights.filter(insight => insight.category === activeCategory);

    const categories = ['all', ...Array.from(new Set(insights.map(i => i.category)))];

    const handleOpenDetailedChat = (insight?: AnalysisInsight) => {
        const event = new CustomEvent('openAIChat', {
            detail: {
                prefilledMessage: insight 
                    ? `請詳細說明「${insight.title}」的具體執行方案和注意事項。`
                    : '請根據我的財務狀況提供完整的理財規劃建議。'
            }
        });
        window.dispatchEvent(event);
    };

    if (!financialData && !calculatorContext) return null;

    return (
        <div className={`glass-card rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
                        <Brain className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">AI 深度分析</h3>
                        <p className="text-sm text-slate-500">個人化財務洞察與建議</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
            </div>

            {isAnalyzing && (
                <div className="flex items-center justify-center py-8">
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="animate-spin">
                            <Sparkles className="w-5 h-5 text-indigo-500" />
                        </div>
                        <span className="text-sm">AI 正在分析您的財務狀況...</span>
                    </div>
                </div>
            )}

            {!isAnalyzing && insights.length > 0 && (
                <>
                    {/* 分類篩選 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${
                                    activeCategory === category
                                        ? 'bg-indigo-100 text-indigo-700'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {category === 'all' ? '全部' : getCategoryName(category as AnalysisInsight['category'])}
                                {category !== 'all' && (
                                    <span className="ml-1 text-xs opacity-75">
                                        ({insights.filter(i => i.category === category).length})
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* 洞察摘要 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                        {filteredInsights.slice(0, isExpanded ? filteredInsights.length : 2).map((insight, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-4 rounded-xl border ${getCategoryColor(insight.category)}`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        {getCategoryIcon(insight.category)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-slate-800">{insight.title}</h4>
                                            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                insight.impact === 'high' ? 'bg-red-100 text-red-700' :
                                                insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-green-100 text-green-700'
                                            }`}>
                                                {insight.impact === 'high' ? '高' : insight.impact === 'medium' ? '中' : '低'}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-600 mb-2">{insight.description}</p>
                                        
                                        {isExpanded && insight.details && (
                                            <ul className="text-xs text-slate-500 space-y-1 mb-2">
                                                {insight.details.map((detail, idx) => (
                                                    <li key={idx} className="flex items-start">
                                                        <span className="text-indigo-400 mr-2">•</span>
                                                        <span>{detail}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                        
                                        {insight.actionable && (
                                            <button
                                                onClick={() => handleOpenDetailedChat(insight)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                            >
                                                詳細諮詢 →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* 展開/收起按鈕 */}
                    {filteredInsights.length > 2 && (
                        <div className="flex justify-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                {isExpanded ? '收起分析' : `查看更多分析 (${filteredInsights.length - 2} 項)`}
                            </button>
                        </div>
                    )}

                    {/* 完整諮詢按鈕 */}
                    <div className="mt-4 pt-4 border-t border-slate-200">
                        <button
                            onClick={() => handleOpenDetailedChat()}
                            className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:shadow-lg transition-all"
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                <span>獲得完整財務規劃建議</span>
                            </div>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}