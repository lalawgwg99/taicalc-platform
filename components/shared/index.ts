/**
 * 共享組件 Barrel Export
 * 提供結果分享、保存和管理功能
 */

export { default as ResultActions, useSavedResults } from './ResultActions';
export { default as SavedResultsManager } from './SavedResultsManager';
export { DataVisualization, generateInsights, generateFinancialReport } from './DataVisualization';
export { SalaryVisualization } from './SalaryVisualization';
export { FinancialReportGenerator } from './FinancialReportGenerator';
export { DataCorrelationAnalyzer } from './DataCorrelationAnalyzer';
export { default as AIAdvisorSuggestions } from './AIAdvisorSuggestions';

export type { 
    ChartData, 
    Insight, 
    ChartType, 
    ExportFormat, 
    FinancialReport,
    ChartExportData 
} from './DataVisualization';