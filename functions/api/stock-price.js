// Cloudflare Pages Function - TWSE 股票即時報價代理
// 路徑: /api/stock-price?code=2330

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function jsonResponse(data, status = 200, extraHeaders = {}) {
    return new Response(JSON.stringify(data), {
        status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', ...extraHeaders },
    });
}

async function fetchTWSE(exchange, code) {
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=${exchange}_${code}.tw&json=1&delay=0`;
    const res = await fetch(url, {
        headers: { 'Referer': 'https://mis.twse.com.tw/' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const item = data?.msgArray?.[0];
    if (!item || item.c !== code) return null;
    return item;
}

export async function onRequestGet(context) {
    const { request } = context;

    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const code = url.searchParams.get('code')?.trim();

    // 驗證：4-6 位數字（台灣股票代碼）
    if (!code || !/^\d{4,6}$/.test(code)) {
        return jsonResponse({ error: '請輸入有效的股票代碼（4-6位數字）' }, 400);
    }

    try {
        // 先試上市（TSE），再試上櫃（OTC）
        let item = await fetchTWSE('tse', code);
        if (!item) {
            item = await fetchTWSE('otc', code);
        }

        if (!item) {
            return jsonResponse({ error: `查無股票代碼 ${code}，請確認是否為上市/上櫃股票` }, 404);
        }

        const name = item.n || '';
        const yesterdayStr = item.y || '0';
        const priceStr = item.z;
        const openStr = item.o;

        const yesterday = parseFloat(yesterdayStr) || 0;
        const isMarketOpen = priceStr && priceStr !== '-' && priceStr !== '0';
        const price = isMarketOpen ? parseFloat(priceStr) : yesterday;
        const open = parseFloat(openStr) || yesterday;

        const change = parseFloat((price - yesterday).toFixed(2));
        const changePercent = yesterday > 0
            ? parseFloat(((change / yesterday) * 100).toFixed(2))
            : 0;

        return jsonResponse(
            { code, name, price, yesterday, open, change, changePercent, isMarketOpen },
            200,
            { 'Cache-Control': 'max-age=60' }
        );

    } catch (err) {
        return jsonResponse({ error: '無法連接台灣證交所，請稍後再試' }, 502);
    }
}
