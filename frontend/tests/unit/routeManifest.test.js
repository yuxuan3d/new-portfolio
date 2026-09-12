import assert from 'node:assert/strict';
import test from 'node:test';
import {
  buildRouteManifest,
  compareRouteSets,
  renderSitemap,
  withRouteMetadata,
  assertSafeRoute,
} from '../../scripts/routeManifest.js';

const config = {
  siteUrl: 'https://example.test',
  projectId: 'project-id',
  dataset: 'production',
  today: '2026-07-11',
};

const project = {
  title: 'Cinder <Test>',
  slug: 'cinder',
  description: 'A <strong> project description.',
  mainImage: { asset: { _ref: 'image-cinderhash-1200x630-jpg' } },
  _updatedAt: '2026-07-10T09:00:00.000Z',
};

test('creates one canonical, image-specific manifest for every static route kind', () => {
  const manifest = buildRouteManifest({ ...config, projects: [project], posts: [{ ...project, slug: 'cinder-notes', excerpt: 'Post description.' }] });
  assert.deepEqual(manifest.map(({ route }) => route), ['/', '/contact', '/rnd', '/project/cinder', '/rnd/cinder-notes']);
  assert.match(manifest.find(({ route }) => route === '/project/cinder').image, /cdn\.sanity\.io\/images\/project-id\/production\/cinderhash-1200x630\.jpg/);
  assert.match(renderSitemap(manifest), /https:\/\/example\.test\/project\/cinder/);
});

test('rejects noncanonical output and route-set drift before artifacts are written', () => {
  assert.throws(() => buildRouteManifest({ ...config, projects: [{ ...project, slug: 'Dune Sand' }] }), /Non-canonical/);
  assert.throws(() => compareRouteSets(['/', '/contact'], ['/']), /Route sets differ/);
});

test('escapes route metadata before inserting it into an HTML shell', () => {
  const html = withRouteMetadata('<html><head><title>Old</title></head></html>', {
    title: 'A < B',
    description: 'C & D',
    canonical: 'https://example.test/project/cinder',
    image: 'https://example.test/image.png',
    imageAlt: 'Preview "image"',
  });
  assert.match(html, /A &lt; B/);
  assert.match(html, /C &amp; D/);
});

test('preserves only the two reviewed document-ID and slug pairs', () => {
  const dune = { ...project, _id: 'e66165bf-e44e-489e-b0f3-bda746df25e0', slug: 'dune sand' };
  const nuhs = { ...project, _id: '1401b46f-3ed1-4f58-8700-9a3ae726ef17', slug: 'NUHS' };
  const manifest = buildRouteManifest({ ...config, projects: [dune, nuhs] });
  assert.equal(manifest[3].route, '/project/dune%20sand');
  assert.equal(manifest[4].canonical, 'https://example.test/project/NUHS');
  for (const slug of ['Dune Sand', '../escape', 'dune%20sand', 'dune/sand', 'dune\\sand', 'dune sand ']) {
    assert.throws(() => buildRouteManifest({ ...config, projects: [{ ...dune, slug }] }));
  }
  assert.throws(() => buildRouteManifest({ ...config, projects: [{ ...dune, _id: 'other' }] }));
  assert.throws(() => buildRouteManifest({ ...config, projects: [dune, dune] }), /Duplicate/);
  for (const route of ['/project/%2e%2e', '/project//cinder', '/project/NUHS/', '/project/dune%2520sand']) assert.throws(() => assertSafeRoute(route));
});
