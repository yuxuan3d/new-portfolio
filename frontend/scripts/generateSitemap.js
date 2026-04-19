import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const projectId = process.env.VITE_SANITY_PROJECT_ID || '5gu0ubge';
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2024-03-21';
const siteUrl = process.env.SITE_URL || 'https://www.yxperiments.com';

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function getDateOnly(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? new Date().toISOString().split('T')[0]
    : date.toISOString().split('T')[0];
}

function renderUrl({ url, lastmod, changefreq, priority }) {
  return `
  <url>
    <loc>${escapeXml(`${siteUrl}${url}`)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>
  </url>`;
}

async function generateSitemap() {
  try {
    // Fetch portfolio items
    const portfolioItems = await sanityClient.fetch(`
      *[_type == "portfolioItem"] {
        slug {
          current
        },
        _updatedAt
      }
    `);

    // Fetch blog posts
    const posts = await sanityClient.fetch(`
      *[_type == "blogPost"] {
        slug {
          current
        },
        _updatedAt
      }
    `);

    // Static routes
    const today = new Date().toISOString().split('T')[0];
    const staticRoutes = [
      { url: '/', lastmod: today, priority: '1.0', changefreq: 'weekly' },
      { url: '/contact', lastmod: today, priority: '0.8', changefreq: 'monthly' },
      { url: '/rnd', lastmod: today, priority: '0.7', changefreq: 'weekly' },
    ];
    const projectRoutes = portfolioItems
      .filter((item) => item?.slug?.current)
      .map((item) => ({
        url: `/project/${encodeURIComponent(item.slug.current)}`,
        lastmod: getDateOnly(item._updatedAt),
        changefreq: 'monthly',
        priority: '0.7',
      }));
    const postRoutes = posts
      .filter((post) => post?.slug?.current)
      .map((post) => ({
        url: `/rnd/${encodeURIComponent(post.slug.current)}`,
        lastmod: getDateOnly(post._updatedAt),
        changefreq: 'monthly',
        priority: '0.6',
      }));

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...staticRoutes, ...projectRoutes, ...postRoutes].map(renderUrl).join('')}
</urlset>`;

    // Write sitemap to public directory
    fs.writeFileSync(
      path.join(process.cwd(), 'public', 'sitemap.xml'),
      sitemap.trim()
    );

    console.log('Sitemap generated successfully!');
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

generateSitemap(); 
