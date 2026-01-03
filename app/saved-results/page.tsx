'use client';

import { SavedResultsManager } from '@/components/shared';

/**
 * 保存結果管理頁面
 * 顯示用戶保存的所有計算結果
 */
export default function SavedResultsPage() {
  return (
    <div className="min-h-screen aurora-bg">
      <SavedResultsManager />
    </div>
  );
}