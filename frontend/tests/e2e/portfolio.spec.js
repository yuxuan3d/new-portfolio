import { expect, test } from 'playwright/test';
import { blogPosts, portfolioProjects, sanityResponseFor } from '../fixtures/portfolio.js';

const SANITY_ROUTE = /https:\/\/.*\.sanity\.io\/.*/;
const MANAGED_METADATA_SELECTORS = [
  'link[rel="canonical"]',
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[property="og:title"]',
  'meta[property="og:description"]',
  'meta[property="og:url"]',
  'meta[property="og:image"]',
  'meta[property="og:image:alt"]',
  'meta[name="twitter:title"]',
  'meta[name="twitter:description"]',
  'meta[name="twitter:image"]',
  'meta[name="twitter:image:alt"]',
];

async function blockTelemetry(page) {
  await page.route('https://*.i.posthog.com/**', (route) => route.fulfill({ status: 204 }));
  await page.route('https://va.vercel-scripts.com/**', (route) => route.abort());
}

async function installSanityFixture(page, {
  projects = portfolioProjects,
  posts = blogPosts,
  delay = 0,
  fail = false,
} = {}) {
  await page.unroute(SANITY_ROUTE);
  await page.route(SANITY_ROUTE, async (route) => {
    const request = route.request();
    const result = sanityResponseFor(request.url(), request.postData() || '', { projects, posts });
    const delayMs = typeof delay === 'function' ? delay(result) : delay;
    if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (fail) {
      await route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'fixture failure' }) });
      return;
    }
    await route.fulfill({ contentType: 'application/json', body: JSON.stringify({ result }) });
  });
}

async function expectHashOffset(page, id) {
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect.poll(async () => page.evaluate((targetId) => {
    const header = document.querySelector('header');
    const target = document.getElementById(targetId);
    const intended = target.getBoundingClientRect().top + window.scrollY - header.getBoundingClientRect().height - 20;
    const reachable = Math.min(Math.max(0, intended), document.documentElement.scrollHeight - window.innerHeight);
    return Math.abs(window.scrollY - reachable);
  }, id), { timeout: 2500 }).toBeLessThanOrEqual(4);
}

async function expectMetadataUnique(page) {
  for (const selector of MANAGED_METADATA_SELECTORS) {
    expect(await page.locator(selector).count(), `${selector} should not be duplicated`).toBeLessThanOrEqual(1);
  }
}

test.beforeEach(async ({ page }) => {
  await blockTelemetry(page);
  await installSanityFixture(page);
});

test('initial hashes settle beneath the fixed header at standard viewports', async ({ page }) => {
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1280, height: 800 },
    { width: 1440, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    for (const id of ['awards', 'works', 'resume', 'contact']) {
      await page.goto(`/#${id}`);
      await expectHashOffset(page, id);
    }
  }
});

test('slow, empty, and failed project responses retain deterministic hash alignment', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const scenario of [
    { delay: 450 },
    { projects: [] },
    { fail: true },
  ]) {
    await installSanityFixture(page, scenario);
    for (const id of ['works', 'resume', 'contact']) {
      await page.goto(`/#${id}`);
      await expectHashOffset(page, id);
    }
  }
});

test('/about, same-page navigation, history, and malformed hashes stay safe and aligned', async ({ page }) => {
  const pageErrors = [];
  page.on('pageerror', (error) => pageErrors.push(error));
  await page.goto('/about');
  await expect(page).toHaveURL(/\/#resume$/);
  await expectHashOffset(page, 'resume');

  await page.getByRole('link', { name: 'Work', exact: true }).first().click();
  await expectHashOffset(page, 'works');
  await page.goBack();
  await expectHashOffset(page, 'resume');
  await page.goForward();
  await expectHashOffset(page, 'works');

  await page.goto('/#%E0%A4%A');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await page.goto('/#unknown');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test('all filters match reviewed counts and retain one selected, tabbable result set', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.kinetic-project-link')).toHaveCount(3);
  await expect(page.locator('.kinetic-project-link').filter({ hasText: 'Cinder' })).toHaveAttribute('href', '/project/cinder');
  await page.getByRole('button', { name: /Explore all projects/ }).click();
  const expectedCounts = new Map([
    ['All', 13],
    ['3D & VFX', 11],
    ['Motion Design', 10],
    ['Interactive', 1],
    ['Editing & Post', 2],
  ]);

  for (const [label, count] of expectedCounts) {
    await page.getByRole('button', { name: label }).click();
    await expect(page.locator('#work-project-grid a')).toHaveCount(count);
    await expect(page.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('#works [aria-pressed="true"]')).toHaveCount(1);
    const tabbableCount = await page.locator('#work-project-grid a').evaluateAll((links) => (
      links.filter((link) => link.tabIndex >= 0 && link.getAttribute('aria-hidden') !== 'true').length
    ));
    expect(tabbableCount).toBe(count);
  }
  await expect(page.locator('body')).not.toContainText('AfterEffects');
});

test('project pager navigation, current-request loading metadata, and legacy replacement work', async ({ page }) => {
  await installSanityFixture(page, {
    delay: (result) => (result?.slug === 'sit-open-house-2026' ? 650 : 0),
  });
  await page.goto('/project/jpmorgan-saei');
  await expect(page.getByRole('heading', { name: 'JPMorgan SAEI' })).toBeVisible();
  await page.getByRole('link', { name: 'Next project SIT Open House 2026' }).click();
  await expect(page).toHaveURL(/\/project\/sit-open-house-2026$/);
  await expect(page.getByText('Loading Project')).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'SIT Open House 2026' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.yxperiments.com/project/sit-open-house-2026');

  await page.goto('/project/jpmorgan%20saei');
  await expect(page).toHaveURL(/\/project\/jpmorgan-saei$/);
  await expect(page.getByRole('heading', { name: 'JPMorgan SAEI' })).toBeVisible();
});

test('overlay and R&D navigation restore unique metadata', async ({ page }) => {
  await page.goto('/#works');
  const homeTitle = await page.title();
  await page.locator('.kinetic-project-link').filter({ hasText: 'JPMorgan SAEI' }).click();
  await expect(page.getByRole('heading', { name: 'JPMorgan SAEI' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.yxperiments.com/project/jpmorgan-saei');
  await expectMetadataUnique(page);
  await page.getByRole('button', { name: 'Close project' }).click();
  await expect(page).toHaveURL(/\/#works$/);
  await expect(page).toHaveTitle(homeTitle);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.yxperiments.com/');
  await expectMetadataUnique(page);

  await page.goto('/rnd');
  await page.getByRole('link', { name: /Cinder Notes/ }).click();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'A compact R&D note about procedural rendering.');
  await page.goBack();
  await expect(page).toHaveURL(/\/rnd$/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.yxperiments.com/rnd');
  await expectMetadataUnique(page);
});

test('empty and invalid contact submissions remain client-side and focus the first invalid field', async ({ page }) => {
  let emailRequests = 0;
  await page.route('https://api.emailjs.com/**', async (route) => {
    emailRequests += 1;
    await route.fulfill({ status: 200, body: 'OK' });
  });
  await page.goto('/#contact');
  await page.locator('#contact summary').click();
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.getByRole('alert')).toContainText('Please correct the highlighted fields.');
  await expect(page.locator('#name')).toBeFocused();

  await page.locator('#name').fill('Test User');
  await page.locator('#email').fill('invalid-email');
  await page.locator('#subject').fill('Test subject');
  await page.locator('#message').fill('Test message');
  await page.getByRole('button', { name: 'Send Message' }).click();
  await expect(page.locator('#email')).toBeFocused();
  await expect(page.locator('#email')).toHaveAttribute('aria-invalid', 'true');
  expect(emailRequests).toBe(0);
});

test('mobile drawer traps focus and restores it for Escape, close, and backdrop dismissal', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/#contact');
  const trigger = page.getByRole('button', { name: 'Open menu' });

  await trigger.click();
  await expect(page.locator('#root')).toHaveAttribute('inert', '');
  await expect(page.getByRole('link', { name: 'Let’s talk' }).last()).toHaveAttribute('aria-current', 'page');
  const drawer = page.getByRole('dialog', { name: 'Primary navigation' });
  const firstFocusable = drawer.locator('a[href], button:not([disabled])').first();
  const lastFocusable = drawer.locator('a[href], button:not([disabled])').last();
  await firstFocusable.focus();
  await page.keyboard.press('Shift+Tab');
  await expect(lastFocusable).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(firstFocusable).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.getByRole('button', { name: 'Close menu' }).click();
  await expect(trigger).toBeFocused();

  await trigger.click();
  await page.locator('[role="presentation"]').click({ position: { x: 4, y: 4 } });
  await expect(trigger).toBeFocused();
});

test('unmatched and missing detail routes are canonical-free and noindex', async ({ page }) => {
  await page.goto('/missing-route');
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
  await expectMetadataUnique(page);

  for (const path of ['/project/not-a-project', '/rnd/not-a-post']) {
    await page.goto(path);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, nofollow');
    await expectMetadataUnique(page);
  }
});
