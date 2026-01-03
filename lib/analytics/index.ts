/**
 * 分析模組導出
 */

export {
  GA4Manager,
  CustomEventTracker,
  getAnalyticsManager,
  analytics
} from './analytics-manager';

export {
  ReportGenerator,
  ReportExporter
} from './report-generator';

export type {
  AnalyticsEvent,
  CalculatorUsageEvent,
  UserBehaviorEvent,
  PerformanceEvent,
  ErrorEvent,
  UsageReport,
  CalculatorReport,
  PerformanceReport
} from './analytics-manager';