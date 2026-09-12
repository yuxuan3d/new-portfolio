import assert from 'node:assert/strict';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { writeStaticArtifacts } from '../../scripts/staticArtifacts.js';

const config = {
  siteUrl: 'https://example.test',
  projectId: 'project-id',
  dataset: 'production',
  apiVersion: '2024-03-21',
};

const shell = `<!doctype html><html><head>
  <title>Homepage</title>
  <meta name="description" content="Homepage description">
  <link rel="canonical" href="https://example.test/">
  <meta property="og:title" content="Homepage">
  <meta name="twitter:title" content="Homepage">
</head><body><div id="root"></div></body></html>`;

const content = {
  projects: [{
    title: 'Cinder',
    slug: 'cinder',
    description: 'A project description.',
    _updatedAt: '2026-07-10T09:00:00.000Z',
    mainImage: { asset: { _ref: 'image-cinderhash-1200x630-jpg' } },
  }],
  posts: [{
    title: 'Cinder Notes',
    slug: 'cinder-notes',
    excerpt: 'A post excerpt.',
    _updatedAt: '2026-07-10T09:00:00.000Z',
    mainImage: { assetUrl: 'https://cdn.sanity.io/images/project-id/production/post.jpg' },
  }],
};

async function createDist() {
  const distDir = await mkdtemp(path.join(os.tmpdir(), 'portfolio-static-artifacts-'));
  await writeFile(path.join(distDir, 'index.html'), shell);
  return distDir;
}

test('writes route-specific no-JavaScript metadata and an identical sitemap route set', async () => {
  const distDir = await createDist();
  try {
    const client = { fetch: async () => content };
    const result = await writeStaticArtifacts({ distDir, client, config });
    assert.equal(result.manifest.length, 5);
    assert.equal(result.routeShells, 4);

    const routeFiles = new Map([
      ['/contact', path.join(distDir, 'contact', 'index.html')],
      ['/rnd', path.join(distDir, 'rnd', 'index.html')],
      ['/project/cinder', path.join(distDir, 'project', 'cinder', 'index.html')],
      ['/rnd/cinder-notes', path.join(distDir, 'rnd', 'cinder-notes', 'index.html')],
    ]);
    for (const [route, file] of routeFiles) {
      const html = await readFile(file, 'utf8');
      assert.ok(html.includes(`<link rel="canonical" href="https://example.test${route}">`));
      assert.equal((html.match(/<link rel="canonical"/g) || []).length, 1);
      assert.equal((html.match(/<meta name="description"/g) || []).length, 1);
      assert.equal((html.match(/<meta property="og:image"/g) || []).length, 1);
      assert.equal((html.match(/<meta name="twitter:image"/g) || []).length, 1);
    }

    const projectHtml = await readFile(routeFiles.get('/project/cinder'), 'utf8');
    assert.match(projectHtml, /cinderhash-1200x630\.jpg/);
    const postHtml = await readFile(routeFiles.get('/rnd/cinder-notes'), 'utf8');
    assert.match(postHtml, /A post excerpt\./);

    const sitemap = await readFile(path.join(distDir, 'sitemap.xml'), 'utf8');
    assert.equal((sitemap.match(/<url>/g) || []).length, result.manifest.length);
    result.manifest.forEach(({ canonical }) => assert.ok(sitemap.includes(`<loc>${canonical}</loc>`)));
  } finally {
    await rm(distDir, { recursive: true, force: true });
  }
});

test('content validation fails before any route artifact is written', async () => {
  const distDir = await createDist();
  try {
    const client = {
      fetch: async () => ({
        projects: [{ ...content.projects[0], slug: 'Dune Sand' }],
        posts: [],
      }),
    };
    await assert.rejects(
      writeStaticArtifacts({ distDir, client, config }),
      /Non-canonical project slug/,
    );
    await assert.rejects(access(path.join(distDir, 'contact', 'index.html')));
    await assert.rejects(access(path.join(distDir, 'sitemap.xml')));
  } finally {
    await rm(distDir, { recursive: true, force: true });
  }
});
