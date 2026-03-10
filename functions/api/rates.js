/**
 * Cloudflare Pages Function – Live Financial Rate Proxy
 * Route: /api/rates?type=mortgage|cpi|etf
 *
 * Data sources (with graceful fallbacks):
 *   mortgage → 央行五大銀行新承做房貸加權平均利率 (CBC Open Data)
 *   cpi      → 主計總處消費者物價指數年增率 (DGBAS)
 *   etf      → TWSE Open API + 靜態歷史報酬預設值
 */

const CORS_HEADERS = {
    'Access-Control-Allow-Origin':  '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type':                 'application/json',
    'Cache-Control':                'public, max-age=3600', // 1-hour client cache
};

// ── Fallback values (updated 2026 Q1) ────────────────────────────────
const FALLBACKS = {
    mortgage: {
        rate:     2.18,
        source:   '央行五大銀行新承做房貸加權平均利率',
        period:   '2025 Q4',
        fallback: true,
    },
    cpi: {
        rate:     2.47,
        source:   '主計總處消費者物價指數年增率',
        period:   '2025 年均',
        fallback: true,
    },
};

// ── ETF 歷史報酬預設（教育性參考值）────────────────────────────────
const ETF_PRESETS = [
    { symbol: '0050', label: '元大台灣50',   rate: 10.2, note: '2009–2024 含息年化報酬' },
    { symbol: '0056', label: '元大高股息',   rate:  8.4, note: '2008–2024 含息年化報酬' },
    { symbol: 'MIX',  label: '台股大盤均值', rate:  9.0, note: '台灣加權指數長期均值' },
    { symbol: 'SAFE', label: '保守混合配置', rate:  5.0, note: '60/40 股債配置均值（扣通膨）' },
];

// ── Router ───────────────────────────────────────────────────────────
export async function onRequest(context) {
    const { request } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const type = new URL(request.url).searchParams.get('type') ?? 'mortgage';

    try {
        if (type === 'mortgage') return await getMortgageRate();
        if (type === 'cpi')      return await getCPIRate();
        if (type === 'etf')      return await getETFData();
        return json({ error: 'Unknown type. Use: mortgage | cpi | etf' }, 400);
    } catch (err) {
        // Return fallback data so UI still functions
        return json(FALLBACKS[type] ?? { error: err.message });
    }
}

// ── Helpers ──────────────────────────────────────────────────────────
function json(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers: CORS_HEADERS });
}

async function safeFetch(url, timeout = 4000) {
    const resp = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    return resp.json();
}

// ── 央行五大銀行新承做房貸加權平均利率 ──────────────────────────────
async function getMortgageRate() {
    try {
        const data = await safeFetch(
            'https://opendata.cbc.gov.tw/api/v1/OpenData/Interest/MortgageBankRate'
        );
        if (Array.isArray(data) && data.length > 0) {
            const latest = data[data.length - 1];
            const rate   = parseFloat(latest?.rate ?? latest?.value);
            if (!isNaN(rate)) {
                return json({
                    rate:     +rate.toFixed(3),
                    source:   '央行五大銀行新承做房貸加權平均利率',
                    period:   latest?.period ?? '最新公布',
                    fallback: false,
                });
            }
        }
    } catch (_) { /* fall through to fallback */ }
    return json(FALLBACKS.mortgage);
}

// ── 主計總處消費者物價指數年增率 ─────────────────────────────────────
async function getCPIRate() {
    try {
        const data = await safeFetch(
            'https://api.stat.gov.tw/DGBAS/e1/a020/cpi/json'
        );
        if (Array.isArray(data) && data.length > 0) {
            const latest = data[data.length - 1];
            const rate   = parseFloat(latest?.yoy ?? latest?.value);
            if (!isNaN(rate)) {
                return json({
                    rate:     +rate.toFixed(2),
                    source:   '主計總處消費者物價指數年增率',
                    period:   latest?.period ?? '最新公布',
                    fallback: false,
                });
            }
        }
    } catch (_) { /* fall through */ }
    return json(FALLBACKS.cpi);
}

// ── TWSE ETF 數據 + 靜態歷史報酬預設 ─────────────────────────────────
async function getETFData() {
    const presets = [...ETF_PRESETS];

    // 嘗試從 TWSE 取得 0050 最新收盤價（豐富展示用）
    try {
        const rows = await safeFetch(
            'https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG?stockNo=0050',
            3000
        );
        if (Array.isArray(rows) && rows.length > 0) {
            const latest = rows[rows.length - 1];
            presets[0].latestPrice = latest?.ClosingPrice ?? null;
            presets[0].tradeDate   = latest?.Date ?? null;
        }
    } catch (_) { /* TWSE optional — static presets still returned */ }

    return json({ presets });
}
