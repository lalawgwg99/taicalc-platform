/**
 * Skill 執行日誌系統
 * 記錄所有 Skill 的執行狀態、輸入輸出、效能數據
 */

export type LogLevel = 'info' | 'warn' | 'error';

export interface SkillExecutionLog {
    skillId: string;
    input: unknown;
    output?: unknown;
    durationMs: number;
    success: boolean;
    error?: string;
    timestamp: Date;
    source?: 'api' | 'chat' | 'chain'; // 來源
}

// 內存日誌暫存（後續可替換為資料庫）
const logs: SkillExecutionLog[] = [];
const MAX_LOGS = 1000;

export const SkillLogger = {
    /**
     * 記錄 Skill 執行
     */
    logExecution: async (log: SkillExecutionLog) => {
        // 加入日誌陣列
        logs.push(log);

        // 限制日誌數量
        if (logs.length > MAX_LOGS) {
            logs.shift();
        }

        // Console 輸出（開發用）
        const status = log.success ? '✅' : '❌';
        console.log(
            `[SkillLog] ${status} ${log.skillId} | ${log.durationMs}ms | ${log.timestamp.toISOString()}`
        );

        if (!log.success && log.error) {
            console.error(`[SkillError] ${log.skillId}: ${log.error}`);
        }

        // TODO: 替換為實際資料庫寫入
        // await db.insert(logsTable).values(log);
    },

    /**
     * 取得最近的日誌
     */
    getRecent: (count: number = 50): SkillExecutionLog[] => {
        return logs.slice(-count).reverse();
    },

    /**
     * 取得統計資料
     */
    getStats: () => {
        const total = logs.length;
        const success = logs.filter(l => l.success).length;
        const failed = total - success;
        const avgDuration = total > 0
            ? logs.reduce((sum, l) => sum + l.durationMs, 0) / total
            : 0;

        // 按 Skill 分組統計
        const bySkill = logs.reduce((acc, log) => {
            if (!acc[log.skillId]) {
                acc[log.skillId] = { count: 0, success: 0, totalMs: 0 };
            }
            acc[log.skillId].count++;
            if (log.success) acc[log.skillId].success++;
            acc[log.skillId].totalMs += log.durationMs;
            return acc;
        }, {} as Record<string, { count: number; success: number; totalMs: number }>);

        return {
            total,
            success,
            failed,
            successRate: total > 0 ? (success / total) * 100 : 0,
            avgDurationMs: Math.round(avgDuration),
            bySkill,
        };
    },
};

export default SkillLogger;
