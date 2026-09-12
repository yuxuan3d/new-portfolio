export const CANONICAL_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Preserve these two published URLs without weakening validation for other records.
export const PRESERVED_PROJECT_SLUGS = Object.freeze({
  'e66165bf-e44e-489e-b0f3-bda746df25e0': 'dune sand',
  '1401b46f-3ed1-4f58-8700-9a3ae726ef17': 'NUHS',
});
const preservedRoutes = new Set(Object.values(PRESERVED_PROJECT_SLUGS).map((slug) => `/project/${encodeURIComponent(slug)}`));
export const DEFAULT_SITE_URL = 'https://www.yxperiments.com';
export const DEFAULT_IMAGE_ALT = 'Particle Earth hero for the yxperiments portfolio';

const PROJECT_DESCRIPTION = 'Project work by Yu Xuan.';
const POST_DESCRIPTION = 'Experiments, notes, and technical explorations by Yu Xuan.';

function normaliseSiteUrl(siteUrl) {
  if (typeof siteUrl !== 'string' || !siteUrl.trim()) {
    throw new Error('A site URL is required to build static route metadata.');
  }

  return siteUrl.trim().replace(/\/+$/, '');
}

function assertString(value, label, route) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error(`Missing ${label} for ${route}.`);
  }
  return value.trim();
}

export function assertSafeRoute(route) {
  if (route === '/') return route;
  if (preservedRoutes.has(route)) return route;
  if (typeof route !== 'string' || !route.startsWith('/') || route.includes('?') || route.includes('#')) {
    throw new Error(`Unsafe output route: ${route}`);
  }

  const segments = route.split('/').filter(Boolean);
  if (!segments.length || `/${segments.join('/')}` !== route || segments.some((segment) => !CANONICAL_SLUG.test(segment))) {
    throw new Error(`Unsafe output route: ${route}`);
  }

  return `/${segments.join('/')}`;
}

export function canonicalUrl(siteUrl, route) {
  return `${normaliseSiteUrl(siteUrl)}${assertSafeRoute(route)}`;
}

export function normaliseDescription(value, fallback) {
  const source = typeof value === 'string' && value.trim() ? value : fallback;
  return assertString(source, 'description', 'metadata')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 160);
}

export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export const escapeXml = escapeHtml;

function imageUrlFromReference(reference, projectId, dataset) {
  const match = /^image-(.+)-(\d+x\d+)-([a-z0-9]+)$/i.exec(reference || '');
  if (!match) return null;
  const [, id, dimensions, format] = match;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${id}-${dimensions}.${format}?w=1200&h=630&fit=crop&auto=format`;
}

export function imageUrl(image, {
  projectId,
  dataset,
  siteUrl = DEFAULT_SITE_URL,
} = {}) {
  const fallback = `${normaliseSiteUrl(siteUrl)}/og-yxperiments.png`;
  if (!image) return fallback;
  if (typeof image.assetUrl === 'string' && image.assetUrl.trim()) return image.assetUrl;

  const reference = image.asset?._ref || image.assetRef || image._ref;
  const resolved = imageUrlFromReference(reference, projectId, dataset);
  if (resolved) return resolved;

  throw new Error('A populated Sanity image is missing a usable asset reference or URL.');
}

function dateOnly(value, fallback) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toISOString().slice(0, 10);
}

function staticRoute(route, title, description, priority, changefreq, siteUrl, today) {
  return {
    route,
    title,
    description,
    canonical: canonicalUrl(siteUrl, route),
    image: `${normaliseSiteUrl(siteUrl)}/og-yxperiments.png`,
    imageAlt: DEFAULT_IMAGE_ALT,
    type: 'website',
    lastmod: today,
    priority,
    changefreq,
  };
}

function contentRoute(item, kind, options) {
  const { siteUrl, projectId, dataset, today } = options;
  const itemType = kind === 'project' ? 'project' : 'R&D post';
  const title = assertString(item?.title, `${itemType} title`, itemType);
  const slug = assertString(item?.slug, `${itemType} slug`, itemType);
  if (!CANONICAL_SLUG.test(slug) && !(kind === 'project' && PRESERVED_PROJECT_SLUGS[item._id] === item.slug)) {
    throw new Error(`Non-canonical ${itemType} slug: ${slug}`);
  }

  const route = kind === 'project' ? `/project/${encodeURIComponent(slug)}` : `/rnd/${slug}`;
  return {
    route,
    title: kind === 'project'
      ? `${title} — Yu Xuan | yxperiments`
      : `${title} — R&D | yxperiments`,
    description: normaliseDescription(kind === 'project' ? item.description : item.excerpt, kind === 'project' ? PROJECT_DESCRIPTION : POST_DESCRIPTION),
    canonical: canonicalUrl(siteUrl, route),
    image: imageUrl(item.mainImage, { projectId, dataset, siteUrl }),
    imageAlt: `Preview of ${title}`,
    type: 'article',
    lastmod: dateOnly(item._updatedAt, today),
    priority: kind === 'project' ? '0.7' : '0.6',
    changefreq: 'monthly',
  };
}

export function validateManifest(manifest) {
  if (!Array.isArray(manifest) || !manifest.length) {
    throw new Error('Route manifest must contain at least the homepage.');
  }

  const routes = new Set();
  manifest.forEach((entry) => {
    const route = assertSafeRoute(entry?.route);
    if (routes.has(route)) throw new Error(`Duplicate route output: ${route}`);
    routes.add(route);
    assertString(entry.title, 'title', route);
    assertString(entry.description, 'description', route);
    assertString(entry.canonical, 'canonical URL', route);
    assertString(entry.image, 'image URL', route);
    assertString(entry.imageAlt, 'image alt text', route);
  });

  return manifest;
}

export function buildRouteManifest({
  projects = [],
  posts = [],
  siteUrl = DEFAULT_SITE_URL,
  projectId,
  dataset,
  today = new Date().toISOString().slice(0, 10),
} = {}) {
  if (!Array.isArray(projects) || !Array.isArray(posts)) {
    throw new Error('Published project and post content must be arrays.');
  }

  const manifest = [
    staticRoute('/', 'Yu Xuan — 3D Motion Designer | yxperiments', 'Yu Xuan is a 3D motion designer and interactive developer creating cinematic visuals and web experiences.', '1.0', 'weekly', siteUrl, today),
    staticRoute('/contact', 'Contact — Yu Xuan | yxperiments', 'Get in touch with Yu Xuan about motion, VFX, and interactive work.', '0.8', 'monthly', siteUrl, today),
    staticRoute('/rnd', 'R&D — Yu Xuan | yxperiments', POST_DESCRIPTION, '0.7', 'weekly', siteUrl, today),
    ...projects.map((project) => contentRoute(project, 'project', { siteUrl, projectId, dataset, today })),
    ...posts.map((post) => contentRoute(post, 'post', { siteUrl, projectId, dataset, today })),
  ];

  return validateManifest(manifest);
}

export function compareRouteSets(leftRoutes, rightRoutes) {
  const left = new Set(leftRoutes);
  const right = new Set(rightRoutes);
  const missing = [...left].filter((route) => !right.has(route));
  const extra = [...right].filter((route) => !left.has(route));
  if (missing.length || extra.length) {
    throw new Error(`Route sets differ. Missing: ${missing.join(', ') || 'none'}. Extra: ${extra.join(', ') || 'none'}.`);
  }
}

export function renderSitemap(manifest) {
  validateManifest(manifest);
  const urls = manifest.map(({ canonical, lastmod, changefreq, priority }) => `
  <url>
    <loc>${escapeXml(canonical)}</loc>
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(changefreq)}</changefreq>
    <priority>${escapeXml(priority)}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;
}

export function withRouteMetadata(shell, metadata) {
  const tags = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}">`,
    `<link rel="canonical" href="${escapeHtml(metadata.canonical)}">`,
    '<meta property="og:site_name" content="yxperiments">',
    `<meta property="og:type" content="${escapeHtml(metadata.type || 'website')}">`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}">`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}">`,
    `<meta property="og:url" content="${escapeHtml(metadata.canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(metadata.image)}">`,
    `<meta property="og:image:alt" content="${escapeHtml(metadata.imageAlt)}">`,
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(metadata.image)}">`,
    `<meta name="twitter:image:alt" content="${escapeHtml(metadata.imageAlt)}">`,
  ].join('\n    ');
  const sanitisedHead = shell
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta (?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+)"[^>]*>\s*/gi, '')
    .replace(/<link rel="canonical"[^>]*>\s*/gi, '');
  return sanitisedHead.replace('</head>', `    ${tags}\n  </head>`);
}
