/**
 * TaiCalc Rate Limiter
 * 用於保護 AI 端點免受濫用
 * 使用記憶體存儲（適用於 Edge Runtime）
 */

interface RateLimitRecord {
    count: number;
    resetAt: number;
}

// 記憶體存儲（每個 Edge Worker 實例獨立）
const rateLimitStore = new Map<string, RateLimitRecord>();

interface RateLimitOptions {
    /** 時間窗口（毫秒） */
    windowMs: number;
    /** 最大請求數 */
    maxRequests: number;
    /** 識別鍵前綴 */
    keyPrefix?: string;
}

const DEFAULT_OPTIONS: RateLimitOptions = {
    windowMs: 60 * 1000, // 1 分鐘
    maxRequests: 10, // 每分鐘 10 次
    keyPrefix: 'rl',
};

/**
 * 從請求中提取識別鍵
 */
function getClientKey(request: Request): string {
    // 優先使用 CF-Connecting-IP（Cloudflare）
    const cfIp = request.headers.get('cf-connecting-ip');
    if (cfIp) return cfIp;

    // 備用：X-Forwarded-For
    const xForwardedFor = request.headers.get('x-forwarded-for');
    if (xForwardedFor) return xForwardedFor.split(',')[0].trim();

    // 最後備用：X-Real-IP
    const xRealIp = request.headers.get('x-real-ip');
    if (xRealIp) return xRealIp;

    return 'unknown';
}

/**
 * 清理過期的記錄
 */
function cleanupExpired(): void {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
        if (record.resetAt < now) {
            rateLimitStore.delete(key);
        }
    }
}

/**
 * 檢查是否超過速率限制
 */
export function checkRateLimit(
    request: Request,
    options: Partial<RateLimitOptions> = {}
): { allowed: boolean; remaining: number; resetAt: number } {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const clientKey = getClientKey(request);
    const key = `${opts.keyPrefix}:${clientKey}`;
    const now = Date.now();

    // 定期清理
    if (Math.random() < 0.1) cleanupExpired();

    const record = rateLimitStore.get(key);

    if (!record || record.resetAt < now) {
        // 新窗口
        const newRecord: RateLimitRecord = {
            count: 1,
            resetAt: now + opts.windowMs,
        };
        rateLimitStore.set(key, newRecord);
        return {
            allowed: true,
            remaining: opts.maxRequests - 1,
            resetAt: newRecord.resetAt,
        };
    }

    // 檢查是否超限
    if (record.count >= opts.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: record.resetAt,
        };
    }

    // 增加計數
    record.count++;
    return {
        allowed: true,
        remaining: opts.maxRequests - record.count,
        resetAt: record.resetAt,
    };
}

/**
 * Rate Limit 回應 Headers
 */
export function rateLimitHeaders(
    remaining: number,
    resetAt: number,
    limit: number = DEFAULT_OPTIONS.maxRequests
): Record<string, string> {
    return {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil(resetAt / 1000).toString(),
    };
}

/**
 * 生成 429 Too Many Requests 回應
 */
export function rateLimitExceededResponse(resetAt: number): Response {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);

    return new Response(
        JSON.stringify({
            error: '請求過於頻繁，請稍後再試',
            retryAfter,
        }),
        {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': retryAfter.toString(),
                ...rateLimitHeaders(0, resetAt),
            },
        }
    );
}

// 預設的 AI 端點限制配置
export const AI_RATE_LIMIT: RateLimitOptions = {
    windowMs: 60 * 1000, // 1 分鐘
    maxRequests: 5, // 每分鐘 5 次 AI 請求
    keyPrefix: 'ai',
};

// 寬鬆的計算器端點限制
export const CALCULATOR_RATE_LIMIT: RateLimitOptions = {
    windowMs: 60 * 1000,
    maxRequests: 60, // 每分鐘 60 次
    keyPrefix: 'calc',
};
