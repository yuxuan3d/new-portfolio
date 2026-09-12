import assert from 'node:assert/strict';
import test from 'node:test';
import { HERO_PROJECTS, heroPresentation, selectHeroProjects, projectPath, wrapSlide } from '../../src/lib/heroProjects.js';
import { portfolioProjects } from '../fixtures/portfolio.js';

test('editorial selection preserves live records, fills missing selections, and deduplicates', () => {
  const selected = selectHeroProjects(portfolioProjects);
  assert.deepEqual(selected.map((p) => p._id), HERO_PROJECTS.map((p) => p.id));
  const missing = portfolioProjects.filter((p) => p._id !== HERO_PROJECTS[0].id);
  assert.equal(selectHeroProjects([...missing, missing[0]]).length, 3);
  assert.equal(new Set(selectHeroProjects([...missing, missing[0]]).map((p) => p._id)).size, 3);
  assert.deepEqual(selectHeroProjects([]), []);
  assert.deepEqual(selectHeroProjects([{ _id: 'bad', title: 'No route' }]), []);
});
test('media selection uses references regardless of gallery order and falls back without a new source', () => {
  const [sit, jpm, cinder] = selectHeroProjects(portfolioProjects);
  const image = { asset: { _ref: HERO_PROJECTS[0].image } };
  assert.equal(heroPresentation({ ...sit, additionalImages: [{ asset: { _ref: 'other' } }, image] }).image, image);
  assert.equal(heroPresentation({ ...sit, additionalImages: [] }).contained, true);
  assert.equal(heroPresentation({ ...sit, additionalImages: [] }).image, sit.mainImage);
  assert.deepEqual(heroPresentation(jpm).rect, [800, 60, 1100, 619]);
  assert.equal(heroPresentation(cinder).paired, true);
  assert.equal(heroPresentation({ ...cinder, additionalImages: [] }).companion, undefined);
});
test('wraps intentional selection and preserves legacy destination encoding', () => {
  assert.equal(wrapSlide(-1, 3), 2);
  assert.equal(wrapSlide(13, 3), 1);
  assert.equal(wrapSlide(1, 0), 0);
  assert.equal(projectPath({ slug: 'dune sand' }), '/project/dune%20sand');
  assert.equal(projectPath({ slug: 'NUHS' }), '/project/NUHS');
});
