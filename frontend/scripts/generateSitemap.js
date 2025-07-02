import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const sanityClient = createClient({
  projectId: process.env.VITE_SANITY_PROJECT_ID,
  dataset: process.env.VITE_SANITY_DATASET,
  apiVersion: '2024-03-21',
  useCdn: true,
});

const YOUR_DOMAIN = 'https://your-domain.com'; // Replace with your actual domain

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
      *[_type == "post"] {
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
    ];

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes.map(route => `
  <url>
    <loc>${YOUR_DOMAIN}${route.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
${portfolioItems.map(item => `
  <url>
    <loc>${YOUR_DOMAIN}/portfolio/${item.slug.current}</loc>
    <lastmod>${new Date(item._updatedAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
${posts.map(post => `
  <url>
    <loc>${YOUR_DOMAIN}/blog/${post.slug.current}</loc>
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