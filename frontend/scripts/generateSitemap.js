import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { renderSitemap } from './routeManifest.js';
import { buildPublishedManifest } from './staticArtifacts.js';

const manifest = await buildPublishedManifest();
const output = path.resolve(process.cwd(), 'public', 'sitemap.xml');
await writeFile(output, renderSitemap(manifest));
console.log(`Generated public sitemap with ${manifest.length} routes.`);
