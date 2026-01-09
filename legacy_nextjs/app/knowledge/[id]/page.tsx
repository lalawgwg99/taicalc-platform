/**
 * 財務知識庫文章詳細頁面
 * 顯示文章內容和相關推薦
 */

import React from 'react';
import { KnowledgeArticleClient } from './KnowledgeArticleClient';

export const runtime = 'edge';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function KnowledgeArticlePage({ params }: PageProps) {
  const { id } = await params;
  return <KnowledgeArticleClient articleId={id} />;
}