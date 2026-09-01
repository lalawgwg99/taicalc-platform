import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { toolCatalog } from '../data/toolCatalog';
import { taxYears } from '../data/taxYears';
import { glossary } from '../data/glossary';
import cities from '../../data/cities.json';

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
  const comparePages = [
    { path: '/compare/xin-qing-an-vs-general-mortgage', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/mortgage-30-vs-40-years', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/electricity-summer-vs-nonsummer', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/labor-pension-lump-vs-monthly', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/etf-0050-vs-0056-vs-006208', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/asset-real-return', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/rent-vs-buy', priority: '0.85', changefreq: 'monthly' },
    { path: '/compare/pension-contribution-0-vs-6', priority: '0.85', changefreq: 'monthly' },
  ];

  const taxYearPages = taxYears.map((taxYear) => ({
    path: `/tax-year/${taxYear.year}`,
    priority: taxYear.isLatest ? '0.9' : '0.6',
    changefreq: 'yearly',
  }));

  const glossaryPages = glossary.map((entry) => ({
    path: `/glossary/${entry.slug}`,
    priority: '0.6',
    changefreq: 'yearly',
  }));

  const costOfLivingPages = [
    { path: '/cost-of-living', priority: '0.8', changefreq: 'monthly' },
    { path: '/cost-of-living/compare', priority: '0.8', changefreq: 'monthly' },
    ...cities.map((city) => ({
      path: `/cost-of-living/${city.slug}`,
      priority: '0.7',
      changefreq: 'monthly',
    })),
  ];

  const pages = [
    { path: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
    { path: '/glossary', priority: '0.7', changefreq: 'monthly', lastmod: today },
    ...comparePages.map((comparePage) => ({
      path: comparePage.path,
      priority: comparePage.priority,
      changefreq: comparePage.changefreq,
      lastmod: today,
    })),
    ...taxYearPages.map((page) => ({
      path: page.path,
      priority: page.priority,
      changefreq: page.changefreq,
      lastmod: today,
    })),
    ...glossaryPages.map((page) => ({
      path: page.path,
      priority: page.priority,
      changefreq: page.changefreq,
      lastmod: today,
    })),
    ...costOfLivingPages.map((page) => ({
      path: page.path,
      priority: page.priority,
      changefreq: page.changefreq,
      lastmod: today,
    })),
    { path: '/llms.txt', priority: '1.0', changefreq: 'daily', lastmod: today },
    { path: '/llms-full.txt', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: '/api/calculators.json', priority: '0.9', changefreq: 'weekly', lastmod: today },
    { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { path: '/tax-season', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/housing-toolbox', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/car-toolbox', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/parenting-toolbox', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/retirement-toolbox', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/career-toolbox', priority: '0.8', changefreq: 'monthly', lastmod: today },
    { path: '/partnerships', priority: '0.5', changefreq: 'monthly', lastmod: today },
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
