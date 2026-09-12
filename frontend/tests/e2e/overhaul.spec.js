import { expect, test } from 'playwright/test';
import { sanityResponseFor } from '../fixtures/portfolio.js';

test.beforeEach(async ({ page }) => {
  await page.route('https://*.i.posthog.com/**', (route) => route.fulfill({ status: 204 }));
  await page.route('https://va.vercel-scripts.com/**', (route) => route.abort());
  await page.route(/https:\/\/[^/]+\.sanity\.io\/v[^/]+\/data\/.*/, (route) => route.fulfill({ contentType: 'application/json', body: JSON.stringify({ result: sanityResponseFor(route.request().url(), route.request().postData() || '') }) }));
});

test('kinetic composition fits phone, tablet, laptop and short landscape viewports', async ({ page }) => {
  test.setTimeout(60000);
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const viewport of [{ width: 1440, height: 900 }, { width: 1280, height: 800 }, { width: 768, height: 1024 }, { width: 390, height: 844 }, { width: 320, height: 740 }, { width: 640, height: 400 }]) {
    await page.setViewportSize(viewport);
    await page.goto('/');
    await expect(page.locator('.kinetic-project-link')).toHaveCount(3);
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('EXPECTED.');
    const geometry = await page.evaluate(() => {
      const title = document.querySelector('h1');
      const range = document.createRange(); range.selectNodeContents(title);
      const rects = [...range.getClientRects()].filter((rect) => rect.width);
      return { overflow: document.documentElement.scrollWidth > innerWidth, titleClipped: rects.some((rect) => rect.left < -1 || rect.right > innerWidth + 1), heroBottom: document.querySelector('.kinetic-hero').getBoundingClientRect().bottom, cueBottom: document.querySelector('.kinetic-hero-foot').getBoundingClientRect().bottom };
    });
    expect(geometry.overflow, JSON.stringify(viewport)).toBe(false);
    expect(geometry.titleClipped, JSON.stringify(viewport)).toBe(false);
    expect(geometry.cueBottom).toBeLessThanOrEqual(geometry.heroBottom + 1);
    await expect(page.locator('[data-water], [data-gallery-stage], iframe')).toHaveCount(0);
    for (const id of ['works', 'field-notes', 'resume', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}`)).toBeVisible();
    }
  }
  expect(errors).toEqual([]);
});

test('hero motion pauses offscreen, in an overlay, and with reduced motion', async ({ page }) => {
  await page.goto('/');
  const hero = page.locator('.kinetic-hero');
  const artwork = page.locator('.kinetic-hero-art > img');
  const video = page.locator('video.kinetic-hero-loop');
  const mark = page.locator('.kinetic-hero-mark');
  await expect(artwork).toBeAttached();
  await expect(hero).toHaveAttribute('data-running', 'true');
  await expect(video).toHaveAttribute('data-ready', 'true');
  await expect.poll(() => video.evaluate((element) => element.currentTime)).toBeGreaterThan(.1);
  expect(await video.evaluate((element) => element.muted && element.loop && element.playsInline)).toBe(true);
  const rotation = await mark.evaluate((element) => getComputedStyle(element).transform);
  await expect.poll(() => mark.evaluate((element) => getComputedStyle(element).transform)).not.toBe(rotation);
  // This decorative target continuously rotates, so its bounding box is never stable.
  await mark.hover({ force: true });
  await expect.poll(() => mark.locator('span').evaluate((element) => getComputedStyle(element).transform)).not.toBe('none');
  const first = await artwork.evaluate((element) => getComputedStyle(element).transform);
  await expect.poll(() => artwork.evaluate((element) => getComputedStyle(element).transform)).not.toBe(first);
  await page.locator('#resume').scrollIntoViewIfNeeded();
  await expect(hero).toHaveAttribute('data-running', 'false');
  await expect(video).toHaveCount(0);
  await expect(mark).toHaveCSS('animation-play-state', 'paused');
  await expect(artwork).toHaveCSS('animation-play-state', 'paused');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(hero).toHaveAttribute('data-running', 'true');
  await page.locator('.kinetic-art-link').click();
  await expect(page.getByRole('button', { name: 'Close project' })).toBeVisible();
  await expect(page.locator('.kinetic-page')).toHaveAttribute('data-motion', 'off');
  await expect(video).toHaveCount(0);
  await page.getByRole('button', { name: 'Close project' }).click();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(hero).toHaveAttribute('data-running', 'false');
  await expect(artwork).toHaveCSS('animation-name', 'none');
  await expect(video).toHaveCount(0);
  await expect(mark).toHaveCSS('animation-name', 'none');
  await expect(page.locator('.kinetic-ribbon-track')).toHaveCSS('animation-name', 'none');
  await page.locator('#resume').scrollIntoViewIfNeeded();
  await expect(page.locator('#resume .kinetic-reveal')).toHaveCSS('opacity', '1');
});

test('hero keeps its poster when video fails and avoids video downloads with reduced motion or data saving', async ({ page }) => {
  const requests = [];
  await page.route('**/media/particle-sea-loop.mp4', (route) => { requests.push(route.request().url()); return route.abort(); });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await expect(page.locator('.kinetic-art-link')).toBeVisible();
  await expect(page.locator('.kinetic-page')).toHaveAttribute('data-motion', 'off');
  expect(requests).toHaveLength(0);
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await expect.poll(() => requests.length).toBeGreaterThan(0);
  await expect(page.locator('video.kinetic-hero-loop')).toHaveCount(0);
  await expect(page.locator('.kinetic-hero-art > img')).toBeVisible();
  await page.locator('.kinetic-art-link').click();
  await expect(page.getByRole('dialog')).toBeVisible();
  requests.length = 0;
  await page.addInitScript(() => { Object.defineProperty(navigator.connection, 'saveData', { get: () => true }); });
  await page.goto('/');
  await expect(page.locator('.kinetic-art-link')).toBeVisible();
  await expect(page.locator('.kinetic-page')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('video.kinetic-hero-loop')).toHaveCount(0);
  expect(requests).toHaveLength(0);
});

test('project overlays trap and restore keyboard focus without leaving the composition', async ({ page }) => {
  await page.goto('/#works');
  const trigger = page.locator('.kinetic-project-link').first();
  await trigger.click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.locator('[data-site-shell]')).toHaveAttribute('inert', '');
  const controls = dialog.locator('a[href], button:not([disabled]), [tabindex="0"]');
  await controls.last().focus();
  await page.keyboard.press('Tab');
  await expect(controls.first()).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await expect(page).toHaveURL(/\/#works$/);
});

test('paging replaces the open project so a single close or browser back returns home', async ({ page }) => {
  await page.goto('/#works');
  const trigger = page.locator('.kinetic-project-link').first();
  for (const exit of ['close', 'back']) {
    await trigger.click();
    const historyLength = await page.evaluate(() => history.length);
    const dialog = page.getByRole('dialog');
    for (const direction of ['Next', 'Next', 'Previous', 'Next']) {
      const next = dialog.getByRole('link', { name: new RegExp(`^${direction} project`) });
      const destination = await next.getAttribute('href');
      await next.click();
      await expect(page).toHaveURL(new RegExp(`${destination}$`));
      await expect(dialog.getByRole('heading').first()).toBeVisible();
      await expect(page.getByRole('dialog')).toHaveCount(1);
      expect(await page.evaluate(() => history.length)).toBe(historyLength);
      await expect.poll(() => dialog.evaluate((element) => element.parentElement.scrollTop)).toBe(0);
    }
    if (exit === 'close') await page.getByRole('button', { name: 'Close project' }).click();
    else await page.goBack();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page).toHaveURL(/\/#works$/);
    await expect(trigger).toBeFocused();
  }
});

test('yxperiments branding returns to the homepage from popups, pages and a scrolled homepage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#works');
  await page.locator('.kinetic-project-link').first().click();
  await page.getByRole('dialog').getByRole('link', { name: 'yxperiments home' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page).toHaveURL(/\/#home$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto('/project/jpmorgan-saei');
  await page.getByRole('heading', { name: 'JPMorgan SAEI' }).waitFor();
  await page.getByRole('link', { name: 'yxperiments', exact: true }).click();
  await expect(page).toHaveURL(/\/#home$/);
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  await page.goto('/');
  await page.locator('#resume').scrollIntoViewIfNeeded();
  await page.getByRole('link', { name: 'yxperiments', exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
});

test('recognition is attributed and capability disclosures work with the keyboard', async ({ page }) => {
  await page.goto('/#awards');
  const recognition = page.locator('#awards');
  await expect(recognition).toContainText('SIT Open House 2026');
  await expect(recognition).toContainText('Website of the Day');
  await expect(recognition).toContainText('FWA of the Day');
  await expect(recognition.locator('.kinetic-awards-list p')).toHaveCount(5);
  await expect(recognition.getByRole('link')).toHaveAttribute('href', '/project/sit-open-house-2026');
  await page.locator('#resume').scrollIntoViewIfNeeded();
  const disclosure = page.locator('.kinetic-capabilities details').first();
  await disclosure.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(disclosure).toHaveAttribute('open', '');
  await expect(disclosure.locator('.kinetic-tools')).toContainText('Houdini');
  await page.keyboard.press('Enter');
  await expect(disclosure).not.toHaveAttribute('open', '');
});

test('blocked telemetry and images retain the page and usable project destinations', async ({ page }) => {
  await page.route(/(?:\/src\/lib\/analytics\.js|@vercel_analytics)/, (route) => route.abort('blockedbyclient'));
  await page.route('https://cdn.sanity.io/**', (route) => route.abort());
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.kinetic-hero-art')).toContainText('Preview unavailable');
  await page.locator('.kinetic-project-link').first().click();
  await expect(page.getByRole('button', { name: 'Close project' })).toBeVisible();
});
