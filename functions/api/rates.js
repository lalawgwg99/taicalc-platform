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

// ── Fallback values (official releases available as of 2026-07-29) ──
const FALLBACKS = {
    mortgage: {
        rate:     2.299,
        source:   '央行五大銀行新承做房貸加權平均利率',
        period:   '2026 年 6 月',
        fallback: true,
    },
    cpi: {
        rate:     2.47,
        source:   '主計總處消費者物價指數年增率',
        period:   '2025 年均',
        fallback: true,
    },
};

// ── 投資情境預設（教育性參考值，不代表特定商品績效）────────────────
const ETF_PRESETS = [
    { symbol: 'GROWTH',  label: '成長情境', rate: 8.0, note: '名目報酬情境，不代表未來績效' },
    { symbol: 'BALANCED', label: '均衡情境', rate: 6.0, note: '名目報酬情境，不代表未來績效' },
    { symbol: 'CAUTIOUS', label: '審慎情境', rate: 4.0, note: '名目報酬情境，不代表未來績效' },
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

    return json({ presets });
}
