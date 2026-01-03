/**
 * 財務知識庫文章詳細頁面
 * 顯示文章內容和相關推薦
 */

import React from 'react';
import { KnowledgeArticleClient } from './KnowledgeArticleClient';

export const runtime = 'edge';

interface PageProps {
  params: {
    id: string;
  };
}

export default function KnowledgeArticlePage({ params }: PageProps) {
  return <KnowledgeArticleClient articleId={params.id} />;
}