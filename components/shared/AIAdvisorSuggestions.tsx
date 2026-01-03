'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIAdvisorSuggestionsProps {
    calculatorType: 'salary' | 'mortgage' | 'tax' | 'capital' | 'retirement';
    resultData: any;
    className?: string;
}

interface Suggestion {
    type: 'insight' | 'warning' | 'opportunity' | 'recommendation';
    title: string;
    content: string;
    action?: string;
    priority: 'high' | 'medium' | 'low';
}

/**
 * AI 顧問建議組件
 * 根據計算結果提供智能建議和洞察
 */
export default function AIAdvisorSuggestions({ 
    calculatorType, 
    resultData, 
    className = '' 
}: AIAdvisorSuggestionsProps) {
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // 根據計算器類型和結果生成建議
    useEffect(() => {
        if (!resultData) return;
        
        const generateSuggestions = () => {
            const newSuggestions: Suggestion[] = [];
            
            switch (calculatorType) {
                case 'salary':
                    generateSalarySuggestions(resultData, newSuggestions);
                    break;
                case 'mortgage':
                    generateMortgageSuggestions(resultData, newSuggestions);
                    break;
                case 'tax':
                    generateTaxSuggestions(resultData, newSuggestions);
                    break;
                case 'capital':
                    generateCapitalSuggestions(resultData, newSuggestions);
                    break;
                case 'retirement':
                    generateRetirementSuggestions(resultData, newSuggestions);
                    break;
            }
            
            setSuggestions(newSuggestions);
        };

        generateSuggestions();
    }, [calculatorType, resultData]);

    const generateSalarySuggestions = (data: any, suggestions: Suggestion[]) => {
        const monthlyNet = data.monthly?.net || 0;
        const monthlyGross = data.monthly?.gross || 0;
        const savingsRate = ((monthlyGross - monthlyNet) / monthlyGross) * 100;

        // 儲蓄率分析
        if (savingsRate > 25) {
            suggestions.push({
                type: 'warning',
                title: '扣除項目偏高',
                content: `您的薪資扣除比例達 ${savingsRate.toFixed(1)}%，高於一般水準。建議檢視是否有優化空間。`,
                action: '了解勞退自提優惠',
                priority: 'medium'
            });
        }

        // 收入水準建議
        if (monthlyNet < 30000) {
            suggestions.push({
                type: 'opportunity',
                title: '收入提升機會',
                content: '目前收入水準建議積極尋求加薪或轉職機會，同時可考慮發展副業增加收入來源。',
                action: '探索加薪策略',
                priority: 'high'
            });
        } else if (monthlyNet > 80000) {
            suggestions.push({
                type: 'insight',
                title: '高收入理財規劃',
                content: '您的收入水準良好，建議開始規劃長期投資和稅務優化策略。',
                action: '制定投資計劃',
                priority: 'medium'
            });
        }

        // 勞退建議
        suggestions.push({
            type: 'recommendation',
            title: '勞退自提建議',
            content: '考慮自提勞退6%，不僅可節稅，還能為退休做準備。以您的薪資水準，每月可節稅約數百元。',
            action: '計算自提效益',
            priority: 'medium'
        });
    };

    const generateMortgageSuggestions = (data: any, suggestions: Suggestion[]) => {
        const monthlyPayment = data.monthlyPayment || 0;
        const totalInterest = data.totalInterest || 0;
        const loanAmount = data.loanAmount || 0;

        // 房貸負擔比分析
        if (data.incomeRatio && data.incomeRatio > 30) {
            suggestions.push({
                type: 'warning',
                title: '房貸負擔過重',
                content: `房貸月付金佔收入比例達 ${data.incomeRatio.toFixed(1)}%，超過建議的30%上限，可能影響生活品質。`,
                action: '調整貸款條件',
                priority: 'high'
            });
        }

        // 利息成本建議
        if (totalInterest > loanAmount * 0.5) {
            suggestions.push({
                type: 'insight',
                title: '利息成本偏高',
                content: `總利息支出達貸款金額的 ${((totalInterest / loanAmount) * 100).toFixed(1)}%，建議考慮提前還款或轉貸。`,
                action: '評估轉貸效益',
                priority: 'medium'
            });
        }

        // 理財建議
        suggestions.push({
            type: 'recommendation',
            title: '房貸族理財策略',
            content: '建議保留3-6個月緊急預備金後，多餘資金可考慮投資報酬率高於房貸利率的標的。',
            action: '制定投資策略',
            priority: 'medium'
        });
    };

    const generateTaxSuggestions = (data: any, suggestions: Suggestion[]) => {
        // 稅務優化建議的邏輯
        suggestions.push({
            type: 'recommendation',
            title: '節稅策略建議',
            content: '根據您的稅務狀況，建議善用各項扣除額和投資抵稅優惠。',
            action: '了解節稅方法',
            priority: 'medium'
        });
    };

    const generateCapitalSuggestions = (data: any, suggestions: Suggestion[]) => {
        // 投資建議的邏輯
        suggestions.push({
            type: 'insight',
            title: '複利效應分析',
            content: '長期投資的複利效應顯著，建議保持定期定額投資習慣。',
            action: '優化投資組合',
            priority: 'medium'
        });
    };

    const generateRetirementSuggestions = (data: any, suggestions: Suggestion[]) => {
        // 退休規劃建議的邏輯
        suggestions.push({
            type: 'recommendation',
            title: '退休準備建議',
            content: '根據您的退休目標，建議及早開始準備並定期檢視計劃。',
            action: '制定退休計劃',
            priority: 'high'
        });
    };

    const handleOpenAIChat = (suggestion?: Suggestion) => {
        // 觸發 AI 聊天介面並預填相關問題
        const event = new CustomEvent('openAIChat', {
            detail: {
                prefilledMessage: suggestion ? 
                    `關於「${suggestion.title}」，請提供更詳細的建議和分析。` :
                    `請針對我的${getCalculatorName(calculatorType)}結果提供專業建議。`
            }
        });
        window.dispatchEvent(event);
    };

    const getCalculatorName = (type: string) => {
        const names = {
            salary: '薪資計算',
            mortgage: '房貸計算',
            tax: '稅務計算',
            capital: '投資計算',
            retirement: '退休規劃'
        };
        return names[type as keyof typeof names] || '計算';
    };

    const getIconForType = (type: Suggestion['type']) => {
        switch (type) {
            case 'insight':
                return <TrendingUp className="w-4 h-4" />;
            case 'warning':
                return <AlertTriangle className="w-4 h-4" />;
            case 'opportunity':
                return <Sparkles className="w-4 h-4" />;
            case 'recommendation':
                return <Lightbulb className="w-4 h-4" />;
            default:
                return <Lightbulb className="w-4 h-4" />;
        }
    };

    const getColorForType = (type: Suggestion['type']) => {
        switch (type) {
            case 'insight':
                return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'warning':
                return 'text-amber-600 bg-amber-50 border-amber-200';
            case 'opportunity':
                return 'text-purple-600 bg-purple-50 border-purple-200';
            case 'recommendation':
                return 'text-green-600 bg-green-50 border-green-200';
            default:
                return 'text-slate-600 bg-slate-50 border-slate-200';
        }
    };

    if (suggestions.length === 0) return null;

    const highPrioritySuggestions = suggestions.filter(s => s.priority === 'high');
    const otherSuggestions = suggestions.filter(s => s.priority !== 'high');

    return (
        <div className={`glass-card rounded-2xl p-6 ${className}`}>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg">
                        <Sparkles className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-800">AI 智能建議</h3>
                        <p className="text-sm text-slate-500">基於您的計算結果提供個人化建議</p>
                    </div>
                </div>
                <button
                    onClick={() => handleOpenAIChat()}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:shadow-lg transition-all"
                >
                    詳細諮詢
                </button>
            </div>

            <div className="space-y-3">
                {/* 高優先級建議 */}
                {highPrioritySuggestions.map((suggestion, index) => (
                    <motion.div
                        key={`high-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-xl border ${getColorForType(suggestion.type)}`}
                    >
                        <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                                {getIconForType(suggestion.type)}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-medium text-slate-800 mb-1">{suggestion.title}</h4>
                                <p className="text-sm text-slate-600 mb-2">{suggestion.content}</p>
                                {suggestion.action && (
                                    <button
                                        onClick={() => handleOpenAIChat(suggestion)}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                    >
                                        {suggestion.action}
                                        <ChevronRight className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* 其他建議 (可展開) */}
                {otherSuggestions.length > 0 && (
                    <>
                        {!isExpanded && otherSuggestions.length > 0 && (
                            <button
                                onClick={() => setIsExpanded(true)}
                                className="w-full py-2 px-4 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                顯示更多建議 ({otherSuggestions.length} 項)
                            </button>
                        )}

                        <AnimatePresence>
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-3"
                                >
                                    {otherSuggestions.map((suggestion, index) => (
                                        <motion.div
                                            key={`other-${index}`}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={`p-4 rounded-xl border ${getColorForType(suggestion.type)}`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="flex-shrink-0 mt-0.5">
                                                    {getIconForType(suggestion.type)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-slate-800 mb-1">{suggestion.title}</h4>
                                                    <p className="text-sm text-slate-600 mb-2">{suggestion.content}</p>
                                                    {suggestion.action && (
                                                        <button
                                                            onClick={() => handleOpenAIChat(suggestion)}
                                                            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                                                        >
                                                            {suggestion.action}
                                                            <ChevronRight className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    
                                    <button
                                        onClick={() => setIsExpanded(false)}
                                        className="w-full py-2 px-4 text-sm text-slate-600 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        收起建議
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </>
                )}
            </div>
        </div>
    );
}