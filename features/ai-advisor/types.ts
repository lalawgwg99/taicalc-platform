/**
 * AI 財務顧問相關類型定義
 */

export interface FinancialData {
  monthlySalary?: number;
  annualIncome?: number;
  monthlyExpenses?: number;
  savings?: number;
  debt?: number;
  age?: number;
  dependents?: number;
  isMarried?: boolean;
  spouseIncome?: number;
}

export interface LifeGoal {
  type: 'house' | 'retirement' | 'education' | 'travel' | 'emergency' | 'investment';
  title: string;
  targetAmount: number;
  timeframe: number; // 年數
  priority: 'high' | 'medium' | 'low';
}

export interface ScenarioAnalysis {
  scenario: string;
  feasibility: 'high' | 'medium' | 'low';
  recommendations: string[];
  risks: string[];
  timeline: string;
  requiredActions: ActionStep[];
}

export interface ActionStep {
  step: number;
  action: string;
  timeframe: string;
  priority: 'high' | 'medium' | 'low';
  estimatedCost?: number;
}

export interface TimingRecommendation {
  decision: string;
  optimalTiming: string;
  reasoning: string[];
  alternativeTimings: {
    timing: string;
    pros: string[];
    cons: string[];
  }[];
}

export interface FinancialDecision {
  type: 'house_purchase' | 'investment' | 'career_change' | 'retirement' | 'education';
  description: string;
  amount?: number;
  currentSituation: FinancialData;
}

export interface FinancialSituation extends FinancialData {
  goals: LifeGoal[];
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
}

export interface RiskAnalysis {
  scenario: string;
  probability: 'high' | 'medium' | 'low';
  impact: 'severe' | 'moderate' | 'minor';
  mitigation: string[];
}

export interface AdvisorResponse {
  type: 'analysis' | 'recommendation' | 'warning' | 'info';
  title: string;
  content: string;
  actionItems?: ActionStep[];
  relatedCalculators?: string[];
}