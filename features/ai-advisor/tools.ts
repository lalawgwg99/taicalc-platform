/**
 * AI 財務顧問工具集
 * 提供給 AI 模型使用的財務分析和建議工具
 */

import { z } from 'zod';
import { advisorEngine } from './advisor-engine';
import { FinancialData, LifeGoal, FinancialDecision, FinancialSituation } from './types';
import { knowledgeBaseTools } from '@/features/knowledge-base/tools';

export const aiAdvisorTools = {
  // 知識庫工具整合
  ...knowledgeBaseTools,
  
  analyzeFinancialScenario: {
    description: '分析用戶的財務情境並提供個人化建議，包含可行性評估和行動計劃。',
    parameters: z.object({
      financialData: z.object({
        monthlySalary: z.number().optional().describe('月薪（新台幣）'),
        annualIncome: z.number().optional().describe('年收入（新台幣）'),
        monthlyExpenses: z.number().optional().describe('月支出（新台幣）'),
        savings: z.number().optional().describe('現有儲蓄（新台幣）'),
        debt: z.number().optional().describe('負債總額（新台幣）'),
        age: z.number().optional().describe('年齡'),
        dependents: z.number().optional().describe('扶養人數'),
        isMarried: z.boolean().optional().describe('是否已婚'),
        spouseIncome: z.number().optional().describe('配偶收入（新台幣）')
      }).describe('用戶財務資料'),
      lifeGoals: z.array(z.object({
        type: z.enum(['house', 'retirement', 'education', 'travel', 'emergency', 'investment']).describe('目標類型'),
        title: z.string().describe('目標名稱'),
        targetAmount: z.number().describe('目標金額（新台幣）'),
        timeframe: z.number().describe('預計達成時間（年）'),
        priority: z.enum(['high', 'medium', 'low']).describe('優先級')
      })).describe('人生目標清單')
    }),
    execute: async (args: { financialData: FinancialData; lifeGoals: LifeGoal[] }) => {
      const analysis = advisorEngine.analyzeLifeScenario(args.financialData, args.lifeGoals);
      
      return {
        summary: `財務情境分析結果：${analysis.scenario}`,
        details: [
          `可行性評估：${analysis.feasibility === 'high' ? '高' : analysis.feasibility === 'medium' ? '中' : '低'}`,
          `預計時程：${analysis.timeline}`,
          '',
          '主要建議：',
          ...analysis.recommendations.map(rec => `• ${rec}`),
          '',
          '潛在風險：',
          ...analysis.risks.map(risk => `⚠️ ${risk}`),
          '',
          '行動計劃：',
          ...analysis.requiredActions.map(action => 
            `${action.step}. ${action.action} (${action.timeframe}, 優先級: ${action.priority})`
          )
        ]
      };
    }
  },

  predictOptimalTiming: {
    description: '預測財務決策的最佳時機，提供時機分析和替代方案。',
    parameters: z.object({
      decision: z.object({
        type: z.enum(['house_purchase', 'investment', 'career_change', 'retirement', 'education']).describe('決策類型'),
        description: z.string().describe('決策描述'),
        amount: z.number().optional().describe('涉及金額（新台幣）'),
        currentSituation: z.object({
          monthlySalary: z.number().optional().describe('月薪（新台幣）'),
          annualIncome: z.number().optional().describe('年收入（新台幣）'),
          monthlyExpenses: z.number().optional().describe('月支出（新台幣）'),
          savings: z.number().optional().describe('現有儲蓄（新台幣）'),
          debt: z.number().optional().describe('負債總額（新台幣）'),
          age: z.number().optional().describe('年齡'),
          dependents: z.number().optional().describe('扶養人數'),
          isMarried: z.boolean().optional().describe('是否已婚'),
          spouseIncome: z.number().optional().describe('配偶收入（新台幣）')
        }).describe('目前財務狀況')
      }).describe('財務決策資訊')
    }),
    execute: async (args: { decision: FinancialDecision }) => {
      const timing = advisorEngine.predictOptimalTiming(args.decision);
      
      return {
        summary: `決策時機分析：${args.decision.description}`,
        details: [
          `建議時機：${timing.optimalTiming}`,
          '',
          '分析理由：',
          ...timing.reasoning.map(reason => `• ${reason}`),
          '',
          '替代時機選項：',
          ...timing.alternativeTimings.map(alt => [
            `⏰ ${alt.timing}`,
            `  優點：${alt.pros.join('、')}`,
            `  缺點：${alt.cons.join('、')}`
          ]).flat()
        ]
      };
    }
  },

  simulateRiskScenarios: {
    description: '模擬各種財務風險情境，提供風險評估和緩解策略。',
    parameters: z.object({
      currentSituation: z.object({
        monthlySalary: z.number().optional().describe('月薪（新台幣）'),
        annualIncome: z.number().optional().describe('年收入（新台幣）'),
        monthlyExpenses: z.number().optional().describe('月支出（新台幣）'),
        savings: z.number().optional().describe('現有儲蓄（新台幣）'),
        debt: z.number().optional().describe('負債總額（新台幣）'),
        age: z.number().optional().describe('年齡'),
        dependents: z.number().optional().describe('扶養人數'),
        isMarried: z.boolean().optional().describe('是否已婚'),
        spouseIncome: z.number().optional().describe('配偶收入（新台幣）'),
        goals: z.array(z.object({
          type: z.enum(['house', 'retirement', 'education', 'travel', 'emergency', 'investment']),
          title: z.string(),
          targetAmount: z.number(),
          timeframe: z.number(),
          priority: z.enum(['high', 'medium', 'low'])
        })).optional().describe('人生目標'),
        riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional().describe('風險承受度')
      }).describe('目前財務狀況')
    }),
    execute: async (args: { currentSituation: FinancialSituation }) => {
      const risks = advisorEngine.simulateRiskScenarios(args.currentSituation);
      
      return {
        summary: '財務風險情境模擬分析',
        details: [
          '以下是基於您目前財務狀況的風險分析：',
          '',
          ...risks.map(risk => [
            `🎯 ${risk.scenario}`,
            `   發生機率：${risk.probability === 'high' ? '高' : risk.probability === 'medium' ? '中' : '低'}`,
            `   影響程度：${risk.impact === 'severe' ? '嚴重' : risk.impact === 'moderate' ? '中等' : '輕微'}`,
            `   緩解策略：`,
            ...risk.mitigation.map(m => `   • ${m}`),
            ''
          ]).flat()
        ]
      };
    }
  },

  generatePersonalizedAdvice: {
    description: '根據用戶查詢和財務狀況生成個人化建議。',
    parameters: z.object({
      query: z.string().describe('用戶查詢或問題'),
      context: z.object({
        monthlySalary: z.number().optional().describe('月薪（新台幣）'),
        annualIncome: z.number().optional().describe('年收入（新台幣）'),
        monthlyExpenses: z.number().optional().describe('月支出（新台幣）'),
        savings: z.number().optional().describe('現有儲蓄（新台幣）'),
        debt: z.number().optional().describe('負債總額（新台幣）'),
        age: z.number().optional().describe('年齡'),
        dependents: z.number().optional().describe('扶養人數'),
        isMarried: z.boolean().optional().describe('是否已婚'),
        spouseIncome: z.number().optional().describe('配偶收入（新台幣）')
      }).optional().describe('用戶財務背景（如有提供）')
    }),
    execute: async (args: { query: string; context?: FinancialData }) => {
      const response = advisorEngine.generateAdvisorResponse(args.query, args.context);
      
      const details = [
        response.content,
        ''
      ];
      
      if (response.actionItems && response.actionItems.length > 0) {
        details.push('建議行動：');
        details.push(...response.actionItems.map(item => 
          `${item.step}. ${item.action} (${item.timeframe})`
        ));
        details.push('');
      }
      
      if (response.relatedCalculators && response.relatedCalculators.length > 0) {
        details.push('相關計算工具：');
        const calculatorNames: Record<string, string> = {
          salary: '薪資計算器',
          mortgage: '房貸計算器',
          tax: '稅務計算器',
          capital: '投資計算器',
          retirement: '退休規劃計算器'
        };
        details.push(...response.relatedCalculators.map(calc => 
          `• ${calculatorNames[calc] || calc}`
        ));
      }
      
      return {
        summary: response.title,
        details
      };
    }
  },

  generateSmartQA: {
    description: '智能問答系統，提供即時的財務問題解答和建議。',
    parameters: z.object({
      question: z.string().describe('用戶的財務問題'),
      userProfile: z.object({
        monthlySalary: z.number().optional().describe('月薪（新台幣）'),
        age: z.number().optional().describe('年齡'),
        location: z.string().optional().describe('居住地區'),
        familyStatus: z.enum(['single', 'married', 'married_with_children']).optional().describe('家庭狀況'),
        riskTolerance: z.enum(['conservative', 'moderate', 'aggressive']).optional().describe('風險承受度')
      }).optional().describe('用戶基本資料（用於個人化回答）')
    }),
    execute: async (args: { question: string; userProfile?: any }) => {
      const { question, userProfile } = args;
      const lowerQuestion = question.toLowerCase();
      
      // 智能問題分類和回答
      let category = 'general';
      let response = '';
      let actionItems: string[] = [];
      let relatedTopics: string[] = [];
      
      // 薪資相關問題
      if (lowerQuestion.includes('薪') || lowerQuestion.includes('收入') || lowerQuestion.includes('加薪')) {
        category = 'salary';
        response = '關於薪資問題，我建議您：\n\n';
        
        if (lowerQuestion.includes('加薪')) {
          response += '**加薪策略：**\n';
          response += '1. 準備具體的工作成果和貢獻證明\n';
          response += '2. 研究市場薪資水準作為談判依據\n';
          response += '3. 選擇適當的時機（如年度考核、專案完成後）\n';
          response += '4. 提出具體的薪資期望和理由\n\n';
          
          actionItems = [
            '收集過去一年的工作成果',
            '調查同職位市場薪資',
            '準備加薪提案',
            '安排與主管面談'
          ];
        } else {
          response += '**薪資規劃建議：**\n';
          response += '1. 了解薪資結構（本薪、津貼、獎金）\n';
          response += '2. 善用勞退自提節稅\n';
          response += '3. 規劃薪資成長路徑\n';
          response += '4. 考慮總薪酬概念（包含福利）\n\n';
          
          actionItems = [
            '使用薪資計算器了解實領金額',
            '評估勞退自提效益',
            '制定職涯發展計劃'
          ];
        }
        
        relatedTopics = ['稅務規劃', '勞退自提', '職涯發展', '理財規劃'];
      }
      
      // 房貸相關問題
      else if (lowerQuestion.includes('房') || lowerQuestion.includes('買房') || lowerQuestion.includes('房貸')) {
        category = 'mortgage';
        response = '關於購屋和房貸，我的建議是：\n\n';
        response += '**購屋準備檢查清單：**\n';
        response += '1. 緊急預備金充足（6個月生活費）\n';
        response += '2. 房貸月付金不超過月收入30%\n';
        response += '3. 頭期款來源穩定（建議20-30%）\n';
        response += '4. 未來3-5年收入穩定\n\n';
        
        if (userProfile?.monthlySalary) {
          const maxMonthlyPayment = userProfile.monthlySalary * 0.3;
          const estimatedLoanAmount = maxMonthlyPayment * 12 * 20; // 假設20年期
          response += `**以您的收入水準：**\n`;
          response += `• 建議房貸月付金上限：NT$ ${maxMonthlyPayment.toLocaleString()}\n`;
          response += `• 估計可負擔房價：NT$ ${(estimatedLoanAmount * 1.3).toLocaleString()} 左右\n\n`;
        }
        
        actionItems = [
          '使用房貸計算器評估負擔能力',
          '比較各銀行房貸方案',
          '準備購屋資金',
          '了解政府優惠房貸政策'
        ];
        
        relatedTopics = ['房貸試算', '青年安心成家', '理財規劃', '投資理財'];
      }
      
      // 投資理財問題
      else if (lowerQuestion.includes('投資') || lowerQuestion.includes('理財') || lowerQuestion.includes('股票')) {
        category = 'investment';
        response = '關於投資理財，我建議您：\n\n';
        response += '**投資前準備：**\n';
        response += '1. 建立緊急預備金（3-6個月生活費）\n';
        response += '2. 清償高利率債務\n';
        response += '3. 確保基本保險保障\n';
        response += '4. 了解自己的風險承受度\n\n';
        
        response += '**投資策略建議：**\n';
        if (userProfile?.age) {
          if (userProfile.age < 35) {
            response += '• 年輕優勢：可承受較高風險，建議股票比例70-80%\n';
            response += '• 定期定額投資，善用時間複利\n';
            response += '• 可考慮成長型基金或ETF\n\n';
          } else if (userProfile.age > 50) {
            response += '• 保守策略：降低風險，股票比例40-50%\n';
            response += '• 增加債券和穩健型投資\n';
            response += '• 注重資產保護和現金流\n\n';
          }
        } else {
          response += '• 分散投資降低風險\n';
          response += '• 定期檢視投資組合\n';
          response += '• 長期投資勝過短期投機\n\n';
        }
        
        actionItems = [
          '評估風險承受能力',
          '制定投資目標和時程',
          '選擇適合的投資工具',
          '開始定期定額投資'
        ];
        
        relatedTopics = ['複利計算', '退休規劃', '風險管理', '資產配置'];
      }
      
      // 稅務問題
      else if (lowerQuestion.includes('稅') || lowerQuestion.includes('報稅') || lowerQuestion.includes('節稅')) {
        category = 'tax';
        response = '關於稅務規劃，我的建議：\n\n';
        response += '**2025年報稅重點：**\n';
        response += '1. 善用各項扣除額（標準/列舉）\n';
        response += '2. 勞退自提可全額扣除\n';
        response += '3. 保險費扣除額上限24,000元\n';
        response += '4. 房貸利息扣除額上限30萬元\n\n';
        
        response += '**節稅策略：**\n';
        response += '• 勞退自提：每月最多提撥6%\n';
        response += '• 保險規劃：善用保費扣除額\n';
        response += '• 捐贈扣除：公益捐款可扣除\n';
        response += '• 投資抵稅：某些投資工具有稅務優惠\n\n';
        
        actionItems = [
          '使用稅務計算器估算稅額',
          '整理各項扣除額憑證',
          '評估勞退自提效益',
          '規劃年度節稅策略'
        ];
        
        relatedTopics = ['勞退自提', '保險規劃', '投資理財', '薪資計算'];
      }
      
      // 退休規劃問題
      else if (lowerQuestion.includes('退休') || lowerQuestion.includes('養老') || lowerQuestion.includes('老年')) {
        category = 'retirement';
        response = '關於退休規劃，我建議：\n\n';
        response += '**退休準備三支柱：**\n';
        response += '1. 勞保老年給付（政府保障）\n';
        response += '2. 勞退新制（雇主提撥+自提）\n';
        response += '3. 個人退休準備（投資理財）\n\n';
        
        if (userProfile?.age) {
          const yearsToRetirement = 65 - userProfile.age;
          if (yearsToRetirement > 20) {
            response += `**您還有約 ${yearsToRetirement} 年退休時間：**\n`;
            response += '• 時間優勢：可承受較高投資風險\n';
            response += '• 建議積極投資成長型資產\n';
            response += '• 善用複利效應累積退休金\n\n';
          } else if (yearsToRetirement > 0) {
            response += `**距離退休約 ${yearsToRetirement} 年：**\n`;
            response += '• 加速退休準備，增加儲蓄率\n';
            response += '• 降低投資風險，保護既有資產\n';
            response += '• 考慮年金保險等穩健工具\n\n';
          }
        }
        
        actionItems = [
          '使用退休計算器估算需求',
          '評估勞退自提效益',
          '制定退休投資策略',
          '定期檢視退休準備進度'
        ];
        
        relatedTopics = ['勞退自提', '投資理財', '保險規劃', '資產配置'];
      }
      
      // 一般財務問題
      else {
        response = '感謝您的提問！作為您的AI財務顧問，我建議：\n\n';
        response += '**財務規劃基本原則：**\n';
        response += '1. 先理財，再投資\n';
        response += '2. 建立緊急預備金\n';
        response += '3. 分散風險，長期投資\n';
        response += '4. 定期檢視財務目標\n\n';
        
        response += '我可以協助您：\n';
        response += '• 薪資和稅務計算\n';
        response += '• 房貸負擔評估\n';
        response += '• 投資理財規劃\n';
        response += '• 退休準備建議\n\n';
        
        actionItems = [
          '評估目前財務狀況',
          '設定理財目標',
          '選擇適合的計算工具',
          '制定行動計劃'
        ];
        
        relatedTopics = ['薪資計算', '房貸試算', '投資理財', '退休規劃'];
      }
      
      // 根據用戶資料個人化回答
      if (userProfile?.location === '台北' || userProfile?.location === '新北') {
        response += '**雙北地區特別提醒：**\n';
        response += '• 房價較高，購屋需更謹慎評估\n';
        response += '• 生活成本較高，建議提高緊急預備金\n';
        response += '• 薪資水準相對較高，可考慮更積極的理財策略\n\n';
      }
      
      const details = [
        response,
        '**建議行動步驟：**'
      ];
      
      actionItems.forEach((item, index) => {
        details.push(`${index + 1}. ${item}`);
      });
      
      if (relatedTopics.length > 0) {
        details.push('');
        details.push('**相關主題：**');
        details.push(relatedTopics.join(' • '));
      }
      
      return {
        summary: `${category === 'general' ? '財務諮詢' : '專業建議'}：${question}`,
        details
      };
    }
  }
};