// TaiCalc ETF 費用率資料庫（v1）
// 經理費/保管費依公開說明書與投信公告；需定期更新。confirmed=false 表示待確認。

export interface EtfFee {
    symbol: string;
    name: string;
    type: string;
    mgmtFee: string;
    custodyFee: string;
    note?: string;
    confirmed: boolean;
}

export const etfFees: EtfFee[] = [
    {
        symbol: '0050',
        name: '元大台灣卓越 50',
        type: '市值型',
        mgmtFee: '0.15%／0.10%／0.08%／0.05%',
        custodyFee: '0.03%／0.025%',
        note: '依資產規模級距遞減',
        confirmed: true,
    },
    {
        symbol: '006208',
        name: '富邦台灣采吉 50',
        type: '市值型',
        mgmtFee: '0.15%／0.10%／0.08%／0.05%',
        custodyFee: '0.03%／0.025%',
        note: '依資產規模級距遞減',
        confirmed: true,
    },
    {
        symbol: '0056',
        name: '元大高股息',
        type: '高股息',
        mgmtFee: '待確認',
        custodyFee: '待確認',
        note: '待更新',
        confirmed: false,
    },
    {
        symbol: '00878',
        name: '國泰永續高股息',
        type: '高股息',
        mgmtFee: '待確認',
        custodyFee: '待確認',
        note: '待更新',
        confirmed: false,
    },
];

export const etfDataSources = [
    { label: '投信投顧公會基金績效與費用資料', href: 'https://www.sitca.org.tw/' },
    { label: '各 ETF 公開說明書與投信公司公告', href: 'https://www.twse.com.tw/' },
];

export const etfLastUpdated = '2026-09-01';
