/**
 * TaiCalc API Middleware
 * 攔截 /api/skills 請求，驗證 API Key 並限流
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 只攔截 /api/skills 開頭的請求
    if (request.nextUrl.pathname.startsWith('/api/skills')) {

        // 1. 檢查 API Key
        const apiKey = request.headers.get('x-api-key');
        const validKey = process.env.TAICALC_API_KEY_SECRET;

        // 判斷是否為瀏覽器直接訪問（Same Origin）
        const referer = request.headers.get('referer') || '';
        const host = request.nextUrl.host;
        const isSameOrigin = referer.includes(host);

        // 如果不是同源請求且沒有有效 API Key
        if (!isSameOrigin && validKey && apiKey !== validKey) {
            // 生產環境才強制驗證
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    {
                        error: 'Unauthorized: Missing or invalid API Key',
                        docs: 'https://taicalc.tw/dev/api-docs',
                    },
                    { status: 401 }
                );
            }
        }

        // 2. 速率限制（簡易版，後續可接 Upstash Redis）
        // const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';
        // TODO: 實作 Redis 限流
        // const { success, remaining } = await checkRateLimit(ip);
        // if (!success) {
        //   return NextResponse.json(
        //     { error: 'Too many requests', retryAfter: 60 },
        //     { status: 429, headers: { 'Retry-After': '60' } }
        //   );
        // }

        // 3. 加入 CORS Headers（供外部 API 使用）
        const response = NextResponse.next();
        response.headers.set('X-TaiCalc-Version', '1.0.0');

        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/skills/:path*',
};
