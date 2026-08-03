import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { toolCatalog } from '../data/toolCatalog';
import { platformGovernance } from '../data/regulatoryMetadata';

export const prerender = true;

const SITE = 'https://taicalc.com';

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const today = new Date().toISOString().slice(0, 10);

  const data = {
    site: SITE,
    updatedAt: today,
    version: platformGovernance.version,
    llmsTxt: `${SITE}/llms.txt`,
    llmsFullTxt: `${SITE}/llms-full.txt`,
    apiCalculators: `${SITE}/api/calculators.json`,
    pages: [
      { url: `${SITE}/`, type: 'landing', priority: 1.0, changefreq: 'weekly' },
      { url: `${SITE}/tax-season`, type: 'guide', priority: 0.9, changefreq: 'monthly' },
      { url: `${SITE}/housing-toolbox`, type: 'toolbox', priority: 0.9, changefreq: 'monthly' },
      { url: `${SITE}/blog`, type: 'blog_index', priority: 0.8, changefreq: 'weekly' },
      { url: `${SITE}/partnerships`, type: 'page', priority: 0.5, changefreq: 'monthly' },
      ...toolCatalog.map((t) => ({
        url: `${SITE}${t.href}`,
        type: 'calculator',
        name: t.label,
        category: t.category,
        isCore: Boolean(t.isCore),
        priority: t.isCore ? 0.9 : 0.8,
        changefreq: 'monthly',
      })),
      ...posts.map((p) => ({
        url: `${SITE}/blog/${p.id}`,
        type: 'article',
        title: p.data.title,
        date: p.data.date,
        priority: 0.7,
        changefreq: 'monthly',
      })),
    ],
  };

  return new Response(JSON.stringify(data, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
