import { z } from 'zod';

// Mock "Live" Data for Grounding
const LIVE_FINANCIAL_DATA: Record<string, string> = {
    'mortgage_rates': '2025年第一季平均房貸利率：首購族 2.185% 起，非首購 2.4% - 2.8%。新青安專案維持基準利率補貼。',
    'tax_updates': '2025年報稅重點：免稅額調高至單身 44.6 萬 (含標準扣除額與薪資特別扣除額)。基本生活費調升至 20.2 萬。',
    'labor_insurance': '2025年勞保費率維持 12% (含就業保險 1%)。基本工資調漲至 28,590 元，時薪 190 元。',
    'housing_market': '2025年房市預測：受囤房稅 2.0 影響，多屋族持有成本增加。市場呈現量縮價穩格局。',
    'inflation': '2024年全年 CPI 年增率預估 2.1%，通膨壓力稍有緩解。',
};

export const searchTool = {
    searchFinancialData: {
        description: '搜尋最新的台灣金融、稅務、房產相關數據 (Grounding Tool)。當用戶詢問「最新」、「2025」、「現在」相關資訊時，必須使用此工具查詢，不可憑空捏造。',
        parameters: z.object({
            query: z.string().describe('搜尋關鍵字，例如：房貸利率、免稅額、基本工資'),
        }),
        execute: async ({ query }: { query: string }) => {
            console.log(`[SearchTool] Searching for: ${query}`);

            // Simple keyword matching for simulation
            const results = Object.entries(LIVE_FINANCIAL_DATA)
                .filter(([key, value]) =>
                    key.includes(query) ||
                    value.includes(query) ||
                    (query.includes('利率') && key === 'mortgage_rates') ||
                    (query.includes('稅') && key === 'tax_updates') ||
                    (query.includes('薪') && key === 'labor_insurance')
                )
                .map(([_, value]) => value);

            if (results.length > 0) {
                return {
                    source: 'TaiCalc Financial Knowledge Base (Updated 2025-01-01)',
                    results: results,
                };
            }

            return {
                source: 'TaiCalc Financial Knowledge Base',
                results: [],
                message: '暫無相關的最新即時數據，請依據一般理財原則回答。',
            };
        },
    },
};
