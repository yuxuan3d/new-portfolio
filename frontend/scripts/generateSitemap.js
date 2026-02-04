import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const projectId = process.env.VITE_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || 'production';
const apiVersion = process.env.VITE_SANITY_API_VERSION || '2024-03-21';
const siteUrl = process.env.SITE_URL || 'https://www.yxperiments.com';

if (!projectId) {
  console.error('Missing required env var: VITE_SANITY_PROJECT_ID');
  process.exit(1);
}

const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

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
    const staticRoutes = [
      { url: '/', priority: '1.0', changefreq: 'weekly' },
      { url: '/about', priority: '0.8', changefreq: 'monthly' },
      { url: '/contact', priority: '0.8', changefreq: 'monthly' },
      { url: '/rnd', priority: '0.7', changefreq: 'weekly' },
    ];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `
  <url>
    <loc>${siteUrl}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
${portfolioItems.map(item => `
  <url>
    <loc>${siteUrl}/project/${item.slug.current}</loc>
    <lastmod>${new Date(item._updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
${posts.map(post => `
  <url>
    <loc>${siteUrl}/rnd/${post.slug.current}</loc>
    <lastmod>${new Date(post._updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
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
