import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { toolCatalog } from '../data/toolCatalog';
import { taxYears } from '../data/taxYears';
import cities from '../data/cities.json';

export const prerender = true;

const SITE = 'https://taicalc.com';

// 各工具頁的實際更新日（以頁面顯示的 lastUpdated 為準，2026-11-08 同步（手機排版總檢查））。
// 頁面改版時同步更新此表；未列出的工具頁（如 /nestegg 非 ToolLayout 頁）省略 lastmod。
const toolLastUpdated: Record<string, string> = {
  '/tools/delivery-income-calculator': '2026-11-08',
  '/tools/electricity-calculator': '2026-11-08',
  '/tools/labor-insurance-pension-calculator': '2026-11-08',
  '/tools/life-simulator': '2026-11-08',
  '/tools/mortgage-calculator': '2026-11-12',
  '/tools/salary-calculator': '2026-11-13',
  '/tools/split-calculator': '2026-11-08',
  '/tools/unemployment-benefit-calculator': '2026-11-08',
  '/tools/debt-consolidation-calculator': '2026-11-08',
  '/tools/estate-gift-tax-calculator': '2026-11-09',
  '/tools/real-estate-gains-tax-calculator': '2026-11-08',
  '/tools/fund-fee-calculator': '2026-11-08',
  '/tools/house-tax-calculator': '2026-11-08',
  '/tools/overseas-card-calculator': '2026-11-08',
  '/tools/refinance-calculator': '2026-11-08',
  '/tools/rent-deduction-calculator': '2026-11-08',
  '/tools/long-term-investing-calculator': '2026-11-08',
  '/tools/car-cost-calculator': '2026-11-08',
  '/tools/home-ownership-cost-calculator': '2026-11-08',
  '/tools/parental-benefit-calculator': '2026-11-08',
  '/tools/real-return-calculator': '2026-11-08',
  '/tools/severance-calculator': '2026-11-13',
  '/tools/etf-dividend-calculator': '2026-11-08',
  '/tools/fire-calculator': '2026-11-08',
  '/tools/income-tax-calculator': '2026-11-08',
  '/tools/insurance-assessment': '2026-11-08',
  '/tools/insurance-calculator': '2026-11-08',
  '/tools/labor-pension-calculator': '2026-11-08',
  '/tools/overtime-calculator': '2026-11-08',
  '/tools/rent-cost-calculator': '2026-11-08',
  '/tools/rental-yield-calculator': '2026-11-08',
  '/tools/stock-calculator': '2026-11-08',
  '/tools/subscription-tracker': '2026-11-08',
  '/tools/year-end-bonus-calculator': '2026-11-11',
  '/tools/ipo-lottery-calculator': '2026-11-12',
};

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

  ];

  const taxYearPages = taxYears.map((taxYear) => ({
    path: `/tax-year/${taxYear.year}`,
    priority: taxYear.isLatest ? '0.9' : '0.6',
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
    { path: '/glossary', priority: '0.7', changefreq: 'monthly' },
    ...comparePages.map((comparePage) => ({
      path: comparePage.path,
      priority: comparePage.priority,
      changefreq: comparePage.changefreq,
    })),
    ...taxYearPages.map((page) => ({
      path: page.path,
      priority: page.priority,
      changefreq: page.changefreq,
    })),
    ...costOfLivingPages.map((page) => ({
      path: page.path,
      priority: page.priority,
      changefreq: page.changefreq,
    })),
    { path: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
    { path: '/tax-season', priority: '0.8', changefreq: 'monthly' },
    { path: '/housing-toolbox', priority: '0.8', changefreq: 'monthly' },
    { path: '/car-toolbox', priority: '0.8', changefreq: 'monthly' },
    { path: '/parenting-toolbox', priority: '0.8', changefreq: 'monthly' },
    { path: '/retirement-toolbox', priority: '0.8', changefreq: 'monthly' },
    { path: '/career-toolbox', priority: '0.8', changefreq: 'monthly' },
    { path: '/partnerships', priority: '0.5', changefreq: 'monthly' },
    { path: '/about', priority: '0.5', changefreq: 'monthly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' },
    { path: '/disclaimer', priority: '0.3', changefreq: 'yearly' },
    { path: '/data-sources', priority: '0.6', changefreq: 'monthly' },
    { path: '/mortgage-rates', priority: '0.8', changefreq: 'monthly' },
    { path: '/etf-fees', priority: '0.8', changefreq: 'monthly' },
    ...toolCatalog.map((tool) => ({
      path: tool.href,
      priority: tool.isCore ? '0.9' : '0.8',
      changefreq: 'monthly',
      lastmod: toolLastUpdated[tool.href],
    })),
    ...posts.filter((post) => !post.data.noindex).map((post) => ({
      path: `/blog/${post.id}`,
      priority: '0.7',
      changefreq: 'monthly',
      lastmod: post.data.date,
    })),
  ];

  const urls = pages.map((page) => `  <url>
    <loc>${escapeXml(`${SITE}${page.path}`)}</loc>${page.lastmod ? `
    <lastmod>${escapeXml(page.lastmod)}</lastmod>` : ''}
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
