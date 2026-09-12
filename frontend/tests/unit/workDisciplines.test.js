import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findUnclassifiedProjects,
  formatWorkLabel,
  getProjectDisciplines,
  normalizeWorkTerm,
} from '../../src/lib/workDisciplines.js';
import { portfolioProjects } from '../fixtures/portfolio.js';

test('normalizes legacy aliases before inferring disciplines', () => {
  assert.equal(normalizeWorkTerm('  AfterEffects  '), 'after effects');
  assert.deepEqual(getProjectDisciplines({ tags: ['AfterEffects', 'Three.js', 'Cinema-4D'] }), [
    '3d-vfx',
    'motion',
    'interactive',
  ]);
});

test('uses a normalized explicit discipline list as the authoritative classification', () => {
  assert.deepEqual(
    getProjectDisciplines({ disciplines: ['3D-VFX', 'MOTION', 'motion', 'unknown'], tags: ['Interactive'] }),
    ['3d-vfx', 'motion'],
  );
});

test('formats compact After Effects variants for public labels', () => {
  assert.equal(formatWorkLabel('AfterEffects'), 'After Effects');
  assert.equal(formatWorkLabel('After Effects'), 'After Effects');
});

test('the reviewed fixture has complete, expected filter coverage', () => {
  assert.equal(portfolioProjects.length, 13);
  assert.equal(portfolioProjects.filter((project) => getProjectDisciplines(project).includes('motion')).length, 10);
  assert.equal(portfolioProjects.filter((project) => getProjectDisciplines(project).includes('interactive')).length, 1);
  assert.equal(portfolioProjects.filter((project) => getProjectDisciplines(project).includes('3d-vfx')).length, 11);
  const saveMyWorld = portfolioProjects.find(({ title }) => title.startsWith('Save My World'));
  assert.equal(getProjectDisciplines(saveMyWorld).includes('3d-vfx'), true);
  assert.equal(portfolioProjects.some(({ disciplines }) => Array.isArray(disciplines)), true);
  assert.equal(portfolioProjects.some(({ legacySlugs }) => legacySlugs?.includes('dune sand')), true);
  assert.deepEqual(findUnclassifiedProjects(portfolioProjects), []);
});
