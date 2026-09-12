import { createClient } from '@sanity/client';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildRouteManifest,
  compareRouteSets,
  DEFAULT_SITE_URL,
  renderSitemap,
  withRouteMetadata,
} from './routeManifest.js';

export const artifactConfig = {
  projectId: process.env.VITE_SANITY_PROJECT_ID || '5gu0ubge',
  dataset: process.env.VITE_SANITY_DATASET || 'production',
  apiVersion: process.env.VITE_SANITY_API_VERSION || '2024-03-21',
  siteUrl: process.env.SITE_URL || DEFAULT_SITE_URL,
};

export function createArtifactClient(config = artifactConfig) {
  return createClient({
    projectId: config.projectId,
    dataset: config.dataset,
    apiVersion: config.apiVersion,
    useCdn: false,
    perspective: 'published',
  });
}

export async function fetchPublishedContent(client = createArtifactClient()) {
  return client.fetch(`{
    "projects": *[_type == "portfolioItem" && defined(slug.current)] | order(orderRank) {
      _id,
      title,
      "slug": slug.current,
      description,
      _updatedAt,
      mainImage { asset { _ref }, "assetUrl": asset->url }
    },
    "posts": *[_type == "blogPost" && defined(slug.current)] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      excerpt,
      _updatedAt,
      mainImage { asset { _ref }, "assetUrl": asset->url }
    }
  }`);
}

export async function buildPublishedManifest({ client, config = artifactConfig } = {}) {
  const content = await fetchPublishedContent(client || createArtifactClient(config));
  return buildRouteManifest({
    projects: content?.projects || [],
    posts: content?.posts || [],
    siteUrl: config.siteUrl,
    projectId: config.projectId,
    dataset: config.dataset,
  });
}

export async function writeStaticArtifacts({
  distDir = path.resolve(process.cwd(), 'dist'),
  client,
  config = artifactConfig,
} = {}) {
  const [shell, manifest] = await Promise.all([
    readFile(path.join(distDir, 'index.html'), 'utf8'),
    buildPublishedManifest({ client, config }),
  ]);
  const pages = manifest
    .filter(({ route }) => route !== '/')
    .map((metadata) => ({
      ...metadata,
      outputDir: path.join(distDir, ...metadata.route.split('/').filter(Boolean).map(decodeURIComponent)),
      html: withRouteMetadata(shell, metadata),
    }));
  const sitemap = renderSitemap(manifest);

  compareRouteSets(
    manifest.map(({ route }) => route),
    ['/', ...pages.map(({ route }) => route)],
  );

  await Promise.all(pages.map(async ({ outputDir, html }) => {
    await mkdir(outputDir, { recursive: true });
    await writeFile(path.join(outputDir, 'index.html'), html);
  }));
  await writeFile(path.join(distDir, 'sitemap.xml'), sitemap);

  return { manifest, routeShells: pages.length };
}
