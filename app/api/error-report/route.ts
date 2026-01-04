import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface ErrorReport {
  errorId?: string;
  message: string;
  stack?: string;
  componentStack?: string;
  userAgent?: string;
  url: string;
  timestamp: string;
  userId?: string | null;
  sessionId?: string;
}

/**
 * 錯誤報告 API
 * 接收客戶端錯誤報告並記錄
 */
export async function POST(request: NextRequest) {
  try {
    const errorReport: ErrorReport = await request.json();

    // 驗證必要欄位
    if (!errorReport.message || !errorReport.url || !errorReport.timestamp) {
      return NextResponse.json(
        { error: '缺少必要的錯誤報告欄位' },
        { status: 400 }
      );
    }

    // 生成錯誤報告 ID（如果沒有提供）
    const reportId = errorReport.errorId || `RPT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // 增強錯誤報告數據
    const enhancedReport = {
      ...errorReport,
      reportId,
      serverTimestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      headers: {
        userAgent: request.headers.get('user-agent'),
        referer: request.headers.get('referer'),
        acceptLanguage: request.headers.get('accept-language'),
      }
    };

    // 記錄錯誤到控制台（在生產環境中，這裡應該發送到錯誤監控服務）
    console.error('🚨 Client Error Report:', {
      reportId,
      message: errorReport.message,
      url: errorReport.url,
      timestamp: errorReport.timestamp,
      userAgent: errorReport.userAgent,
      userId: errorReport.userId,
      sessionId: errorReport.sessionId
    });

    // 在生產環境中，可以將錯誤發送到外部服務
    if (process.env.NODE_ENV === 'production') {
      await sendToErrorMonitoringService(enhancedReport);
    }

    // 返回成功響應
    return NextResponse.json({
      success: true,
      reportId,
      message: '錯誤報告已成功提交'
    });

  } catch (error) {
    console.error('Error processing error report:', error);
    
    return NextResponse.json(
      { 
        error: '處理錯誤報告時發生問題',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * 發送錯誤到外部監控服務
 * 在實際應用中，可以整合 Sentry、LogRocket、Bugsnag 等服務
 */
async function sendToErrorMonitoringService(errorReport: any) {
  try {
    // 範例：發送到 Sentry
    // if (process.env.SENTRY_DSN) {
    //   await fetch('https://sentry.io/api/...', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${process.env.SENTRY_TOKEN}`
    //     },
    //     body: JSON.stringify(errorReport)
    //   });
    // }

    // 範例：發送到自定義日誌服務
    // if (process.env.LOG_SERVICE_URL) {
    //   await fetch(process.env.LOG_SERVICE_URL, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       'Authorization': `Bearer ${process.env.LOG_SERVICE_TOKEN}`
    //     },
    //     body: JSON.stringify(errorReport)
    //   });
    // }

    console.log('Error report sent to monitoring service:', errorReport.reportId);
  } catch (error) {
    console.error('Failed to send error to monitoring service:', error);
  }
}

/**
 * GET 方法：獲取錯誤報告統計（僅供管理員使用）
 */
export async function GET(request: NextRequest) {
  // 在實際應用中，這裡應該檢查管理員權限
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get('action');

  if (action === 'stats') {
    // 返回錯誤統計信息
    return NextResponse.json({
      message: '錯誤報告統計功能尚未實作',
      suggestion: '請整合適當的錯誤監控服務來獲取詳細統計'
    });
  }

  return NextResponse.json({
    message: 'TaiCalc 錯誤報告 API',
    version: '1.0.0',
    endpoints: {
      'POST /api/error-report': '提交錯誤報告',
      'GET /api/error-report?action=stats': '獲取錯誤統計（需要管理員權限）'
    }
  });
}