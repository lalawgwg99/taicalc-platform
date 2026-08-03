import type { APIRoute } from 'astro';
import { toolCatalog } from '../../data/toolCatalog';
import { platformGovernance } from '../../data/regulatoryMetadata';

export const prerender = true;

const SITE = 'https://taicalc.com';

export const GET: APIRoute = async () => {
  const data = {
    platform: 'TaiCalc',
    website: SITE,
    description: 'Taiwan Personal Finance and Tax Calculators Platform (台灣財務與稅務線上計算機平台)',
    governance: platformGovernance,
    llmInterface: `${SITE}/llms.txt`,
    llmFullKnowledge: `${SITE}/llms-full.txt`,
    calculators: toolCatalog.map((tool) => ({
      id: tool.href.replace('/tools/', '').replace(/\/$/, ''),
      name: tool.label,
      description: tool.desc,
      category: tool.category,
      isCore: Boolean(tool.isCore),
      scenario: tool.scenario || null,
      tags: tool.tags || [],
      url: `${SITE}${tool.href}`,
      apiDocs: `${SITE}/llms-full.txt`,
    })),
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
