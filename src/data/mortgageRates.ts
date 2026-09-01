// TaiCalc 房貸利率市調資料庫（v1）
// 資料來源：中央銀行新聞稿、財政部新青安 3.0 規定。需定期更新。

export interface MortgageRatePoint {
    month: string;
    rate: number;
    note?: string;
}

// 五大銀行（台銀、合庫銀、一銀、華銀、土銀）新承做放款加權平均利率
export const centralBankFiveBankRates: MortgageRatePoint[] = [
    { month: '2026-06', rate: 2.155, note: '115年6月，較 5 月下降 0.053 個百分點' },
    { month: '2026-05', rate: 2.208, note: '115年5月' },
];

// 新青安 3.0 利率階梯（2026-08-01 起）
export const newYouthRates = [
    { period: '第 1～3 年', rate: 1.775, note: '前 3 年享 2 碼補貼' },
    { period: '第 4 年', rate: 1.9, note: '補貼逐年減少半碼' },
    { period: '第 5 年', rate: 2.025, note: '補貼逐年減少半碼' },
    { period: '第 6 年', rate: 2.15, note: '補貼逐年減少半碼' },
    { period: '第 7 年起', rate: 2.275, note: '回復原貸款利率' },
];

export const newYouthTerms = {
    maxAmountWan: 1000,
    maxYears: 40,
    maxGrace: 5,
    maxLtv: 0.8,
    period: '2026-08-01 至 2029-07-31',
    incomeCap: 2000000,
    ageCap: 50,
};

export const mortgageDataSources = [
    { label: '中央銀行新聞稿：115年6月五大銀行新承做放款平均利率', href: 'https://www.cbc.gov.tw/tw/cp-302-192614-192cb-1.html' },
    { label: '財政部新青安 3.0 規定（青安 3.0 房貸試算）', href: 'https://www.0966553929.com/about/new-qingan-3-calculator' },
];

export const mortgageLastUpdated = '2026-09-01';
