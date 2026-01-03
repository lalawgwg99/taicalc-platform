/**
 * AI 財務顧問核心引擎
 * 提供情境分析、建議生成和決策支援功能
 */

import {
  FinancialData,
  LifeGoal,
  ScenarioAnalysis,
  TimingRecommendation,
  FinancialDecision,
  FinancialSituation,
  RiskAnalysis,
  ActionStep,
  AdvisorResponse
} from './types';

export class FinancialAdvisorEngine {
  /**
   * 分析生活情境並提供建議
   */
  analyzeLifeScenario(financialData: FinancialData, lifeGoals: LifeGoal[]): ScenarioAnalysis {
    const monthlyIncome = financialData.monthlySalary || (financialData.annualIncome || 0) / 12;
    const monthlyExpenses = financialData.monthlyExpenses || monthlyIncome * 0.7; // 預設支出比例
    const monthlySavings = monthlyIncome - monthlyExpenses;
    
    // 計算目標可行性
    const totalGoalAmount = lifeGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const availableSavings = monthlySavings * 12; // 年度可儲蓄金額
    
    let feasibility: 'high' | 'medium' | 'low' = 'low';
    if (availableSavings > 0 && totalGoalAmount / availableSavings <= 5) {
      feasibility = 'high';
    } else if (availableSavings > 0 && totalGoalAmount / availableSavings <= 10) {
      feasibility = 'medium';
    }
    
    const recommendations: string[] = [];
    const risks: string[] = [];
    const requiredActions: ActionStep[] = [];
    
    // 生成建議
    if (monthlySavings <= 0) {
      recommendations.push('首要任務是建立正現金流，檢視並削減不必要支出');
      requiredActions.push({
        step: 1,
        action: '製作詳細的收支表，找出可節省的開支項目',
        timeframe: '1個月內',
        priority: 'high'
      });
    }
    
    if (!financialData.savings || financialData.savings < monthlyExpenses * 3) {
      recommendations.push('建立緊急預備金，至少準備3-6個月的生活費');
      risks.push('缺乏緊急預備金，面臨突發狀況時財務風險較高');
      requiredActions.push({
        step: 2,
        action: '優先建立緊急預備金',
        timeframe: '6個月內',
        priority: 'high',
        estimatedCost: monthlyExpenses * 3
      });
    }
    
    // 分析各項目標
    lifeGoals.forEach((goal, index) => {
      const yearsNeeded = goal.targetAmount / availableSavings;
      if (yearsNeeded > goal.timeframe) {
        recommendations.push(`${goal.title}目標需要調整：考慮延長時程或降低目標金額`);
        risks.push(`${goal.title}在預定時間內達成的機率較低`);
      }
      
      requiredActions.push({
        step: index + 3,
        action: `為${goal.title}制定具體儲蓄計劃`,
        timeframe: `${goal.timeframe}年內`,
        priority: goal.priority,
        estimatedCost: goal.targetAmount
      });
    });
    
    return {
      scenario: `基於月收入 ${monthlyIncome.toLocaleString()} 元的財務規劃分析`,
      feasibility,
      recommendations,
      risks,
      timeline: `預計需要 ${Math.ceil(totalGoalAmount / Math.max(availableSavings, 1))} 年完成所有目標`,
      requiredActions
    };
  }
  
  /**
   * 預測最佳決策時機
   */
  predictOptimalTiming(decision: FinancialDecision): TimingRecommendation {
    const { type, amount = 0, currentSituation } = decision;
    const monthlyIncome = currentSituation.monthlySalary || (currentSituation.annualIncome || 0) / 12;
    const hasEmergencyFund = (currentSituation.savings || 0) >= (currentSituation.monthlyExpenses || monthlyIncome * 0.7) * 3;
    
    let optimalTiming = '建議暫緩';
    const reasoning: string[] = [];
    const alternativeTimings: TimingRecommendation['alternativeTimings'] = [];
    
    switch (type) {
      case 'house_purchase':
        if (hasEmergencyFund && monthlyIncome * 0.3 >= amount * 0.02 / 12) {
          optimalTiming = '現在是適合的時機';
          reasoning.push('已具備緊急預備金');
          reasoning.push('月收入足以負擔房貸月付金');
        } else {
          reasoning.push('建議先建立緊急預備金');
          reasoning.push('確保房貸月付金不超過月收入的30%');
        }
        
        alternativeTimings.push({
          timing: '6個月後',
          pros: ['有時間建立更充足的頭期款', '可觀察房市趨勢'],
          cons: ['房價可能上漲', '利率可能調整']
        });
        break;
        
      case 'investment':
        if (hasEmergencyFund) {
          optimalTiming = '現在可以開始投資';
          reasoning.push('已有緊急預備金作為後盾');
          reasoning.push('越早開始投資，複利效果越顯著');
        } else {
          reasoning.push('建議先完成緊急預備金再進行投資');
        }
        break;
        
      case 'career_change':
        if (hasEmergencyFund && (currentSituation.savings || 0) >= monthlyIncome * 6) {
          optimalTiming = '財務條件允許轉職';
          reasoning.push('有足夠的財務緩衝期');
        } else {
          reasoning.push('建議先累積6個月以上的生活費再考慮轉職');
        }
        break;
        
      default:
        reasoning.push('需要更多資訊來評估最佳時機');
    }
    
    return {
      decision: decision.description,
      optimalTiming,
      reasoning,
      alternativeTimings
    };
  }
  
  /**
   * 模擬風險情境
   */
  simulateRiskScenarios(currentSituation: FinancialSituation): RiskAnalysis[] {
    const scenarios: RiskAnalysis[] = [];
    const monthlyIncome = currentSituation.monthlySalary || (currentSituation.annualIncome || 0) / 12;
    const monthlyExpenses = currentSituation.monthlyExpenses || monthlyIncome * 0.7;
    const emergencyFund = currentSituation.savings || 0;
    
    // 失業風險
    scenarios.push({
      scenario: '失業或收入中斷',
      probability: 'medium',
      impact: emergencyFund < monthlyExpenses * 6 ? 'severe' : 'moderate',
      mitigation: [
        '建立6個月以上的緊急預備金',
        '培養多元收入來源',
        '定期更新履歷和技能',
        '考慮購買失能險'
      ]
    });
    
    // 醫療支出風險
    scenarios.push({
      scenario: '重大醫療支出',
      probability: currentSituation.age && currentSituation.age > 40 ? 'medium' : 'low',
      impact: 'severe',
      mitigation: [
        '購買足額醫療保險',
        '定期健康檢查',
        '建立醫療專用基金',
        '了解健保給付範圍'
      ]
    });
    
    // 通膨風險
    scenarios.push({
      scenario: '通貨膨脹侵蝕購買力',
      probability: 'high',
      impact: 'moderate',
      mitigation: [
        '投資抗通膨資產（如股票、房地產）',
        '定期調整薪資',
        '避免過度持有現金',
        '選擇浮動利率投資工具'
      ]
    });
    
    // 投資損失風險
    if (currentSituation.riskTolerance === 'aggressive') {
      scenarios.push({
        scenario: '投資組合大幅虧損',
        probability: 'medium',
        impact: 'moderate',
        mitigation: [
          '分散投資降低風險',
          '定期檢視投資組合',
          '設定停損點',
          '不要投入超過可承受的金額'
        ]
      });
    }
    
    return scenarios;
  }
  
  /**
   * 生成行動計劃
   */
  generateActionPlan(analysis: ScenarioAnalysis): ActionStep[] {
    return analysis.requiredActions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  /**
   * 生成智能回應
   */
  generateAdvisorResponse(query: string, context?: FinancialData): AdvisorResponse {
    const lowerQuery = query.toLowerCase();
    
    // 房貸相關查詢
    if (lowerQuery.includes('房') || lowerQuery.includes('買房') || lowerQuery.includes('房貸')) {
      return {
        type: 'recommendation',
        title: '購屋建議分析',
        content: '購屋是人生重大決策，建議先評估以下條件：\n\n1. 緊急預備金是否充足（至少6個月生活費）\n2. 房貸月付金是否低於月收入30%\n3. 頭期款來源是否穩定\n4. 未來3-5年收入是否穩定',
        actionItems: [
          {
            step: 1,
            action: '使用房貸計算器評估負擔能力',
            timeframe: '立即',
            priority: 'high'
          },
          {
            step: 2,
            action: '比較不同銀行的房貸方案',
            timeframe: '1週內',
            priority: 'medium'
          }
        ],
        relatedCalculators: ['mortgage', 'salary']
      };
    }
    
    // 投資相關查詢
    if (lowerQuery.includes('投資') || lowerQuery.includes('理財') || lowerQuery.includes('股票')) {
      return {
        type: 'recommendation',
        title: '投資理財建議',
        content: '投資前請確保已建立穩固的財務基礎：\n\n1. 緊急預備金（3-6個月生活費）\n2. 高利率債務已清償\n3. 基本保險保障已到位\n4. 投資金額在可承受風險範圍內',
        actionItems: [
          {
            step: 1,
            action: '評估風險承受能力',
            timeframe: '立即',
            priority: 'high'
          },
          {
            step: 2,
            action: '制定投資目標和時程',
            timeframe: '1週內',
            priority: 'high'
          }
        ],
        relatedCalculators: ['capital', 'retirement']
      };
    }
    
    // 薪資相關查詢
    if (lowerQuery.includes('薪') || lowerQuery.includes('收入') || lowerQuery.includes('勞保') || lowerQuery.includes('健保')) {
      return {
        type: 'analysis',
        title: '薪資結構分析',
        content: '了解薪資結構有助於財務規劃：\n\n1. 實領金額計算\n2. 勞健保費用分析\n3. 勞退提撥規劃\n4. 稅務影響評估',
        relatedCalculators: ['salary', 'tax']
      };
    }
    
    // 預設回應
    return {
      type: 'info',
      title: '財務諮詢服務',
      content: '我可以協助您進行各種財務分析和規劃，包括：\n\n• 薪資結構計算\n• 房貸負擔評估\n• 投資理財建議\n• 稅務規劃\n• 退休準備\n\n請告訴我您的具體需求，我會提供專業的建議。',
      relatedCalculators: ['salary', 'mortgage', 'tax', 'capital', 'retirement']
    };
  }
}

// 單例模式
export const advisorEngine = new FinancialAdvisorEngine();