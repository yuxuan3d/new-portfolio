import assert from 'node:assert/strict';
import test from 'node:test';
import { getSafeSectionHash } from '../../src/lib/navigation.js';

test('accepts only known, safely decoded homepage section hashes', () => {
  assert.equal(getSafeSectionHash('#works'), 'works');
  assert.equal(getSafeSectionHash('#resume'), 'resume');
  assert.equal(getSafeSectionHash('#contact'), 'contact');
  assert.equal(getSafeSectionHash('#unknown'), null);
  assert.equal(getSafeSectionHash('#%E0%A4%A'), null);
  assert.equal(getSafeSectionHash('works'), null);
});
