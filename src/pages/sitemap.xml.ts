import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { toolCatalog } from '../data/toolCatalog';

export const prerender = true;

const SITE = 'https://taicalc.com';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character);

export const GET: APIRoute = async () => {
  const posts = await getCollection('blog');
  const today = new Date().toISOString().slice(0, 10);
  const pages = [
    { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { path: '/tax-season', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/housing-toolbox', priority: '0.8', changefreq: 'monthly', lastmod: today },
    ...toolCatalog.map((tool) => ({
      path: tool.href,
      priority: tool.isCore ? '0.9' : '0.8',
      changefreq: 'monthly',
      lastmod: today,
    })),
    ...posts.map((post) => ({
      path: `/blog/${post.id}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.data.date,
    })),
  ];

  const urls = pages.map((page) => `  <url>
    <loc>${escapeXml(`${SITE}${page.path}`)}</loc>
    <lastmod>${escapeXml(page.lastmod)}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
