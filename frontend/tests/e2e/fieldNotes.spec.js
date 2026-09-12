import { expect, test } from 'playwright/test';
import { sanityResponseFor } from '../fixtures/portfolio.js';

test.beforeEach(async ({ page }) => {
  await page.route('https://*.i.posthog.com/**', (route) => route.fulfill({ status: 204 }));
  await page.route('https://va.vercel-scripts.com/**', (route) => route.abort());
  await page.route(/https:\/\/[^/]+\.sanity\.io\/v[^/]+\/data\/.*/, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ result: sanityResponseFor(route.request().url(), route.request().postData() || '') }) }));
});

test('experiments use published destinations and retain the existing section hash', async ({ page }) => {
  await page.goto('/#field-notes');
  await expect(page.locator('#field-notes')).toContainText('Shophouse Generator');
  await expect(page.locator('#field-notes a').filter({ hasText: 'Shophouse Generator' })).toHaveAttribute('href', '/rnd/shophouse-generator');
  await expect(page.locator('#field-notes a').filter({ hasText: 'Dune sand' })).toHaveAttribute('href', '/project/dune-sand');
  await expect.poll(() => page.locator('#field-notes').evaluate((section) => Math.abs(section.getBoundingClientRect().top - document.querySelector('header').getBoundingClientRect().height - 20))).toBeLessThan(4);
  await page.locator('#field-notes a').filter({ hasText: 'Shophouse Generator' }).click();
  await expect(page).toHaveURL(/\/rnd\/shophouse-generator$/);
  await expect(page.getByRole('heading', { name: 'Shophouse Generator' })).toBeVisible();
});

test('missing curated content has no fabricated previews and leaves contact available', async ({ page }) => {
  await page.route(/https:\/\/[^/]+\.sanity\.io\/v[^/]+\/data\/.*/, (route) => route.fulfill({ contentType: 'application/json', body: '{"result":[]}' }));
  await page.goto('/');
  await expect(page.locator('#works')).toContainText('New work will appear here when published.');
  await expect(page.locator('#field-notes img, .kinetic-hero-art')).toHaveCount(0);
  await expect(page.locator('#field-notes').getByRole('link', { name: 'R&D index' })).toHaveAttribute('href', '/rnd');
  await expect(page.locator('.kinetic-email')).toHaveAttribute('href', 'mailto:yuxuan3dart@gmail.com');
});
