import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const out = 'artifacts/kinetic';
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { stdio: 'ignore' });
const browser = await chromium.launch();
const report = { measuredAt: new Date().toISOString(), environment: 'Local production bundle in container Chromium, live read-only Sanity content. Unthrottled lab observations, not field Web Vitals or INP.', profiles: [] };
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try { ready = (await fetch('http://127.0.0.1:4173')).ok; } catch { /* preview starting */ }
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) throw Error('Production preview did not start');
  for (const profile of [{ name: 'laptop', width: 1440, height: 900 }, { name: 'phone', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: profile, deviceScaleFactor: 1, isMobile: profile.name === 'phone', hasTouch: profile.name === 'phone' });
    await context.route('https://*.i.posthog.com/**', (route) => route.fulfill({ status: 204 }));
    await context.route('https://va.vercel-scripts.com/**', (route) => route.abort());
    await context.route('https://api.emailjs.com/**', (route) => route.abort());
    // Preserve the CMS-authorized origin while exercising the actual production bundle.
    await context.route('http://localhost:5173/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.startsWith('/_vercel/')) return route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
      url.hostname = '127.0.0.1'; url.port = '4173';
      const response = await route.fetch({ url: url.toString() });
      await route.fulfill({ response });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.addInitScript(() => {
      window.__metrics = { lcp: 0, cls: 0 };
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) window.__metrics.lcp = entry.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver((list) => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.__metrics.cls += entry.value; }).observe({ type: 'layout-shift', buffered: true });
    });
    await page.goto('http://localhost:5173');
    await page.waitForFunction(() => document.querySelector('.kinetic-hero-art img')?.naturalWidth > 0);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForFunction(() => document.querySelector('video.kinetic-hero-loop')?.currentTime > .1);
    const video = await page.locator('video.kinetic-hero-loop').evaluate((element) => ({ width: element.videoWidth, height: element.videoHeight, duration: element.duration, muted: element.muted, loop: element.loop, playing: !element.paused }));
    await page.locator('video.kinetic-hero-loop').evaluate((element) => { element.currentTime = element.duration - .1; });
    await page.waitForFunction(() => document.querySelector('video.kinetic-hero-loop')?.currentTime < 1);
    const sample = () => page.evaluate(() => new Promise((resolve) => {
      const times = []; let last;
      const frame = (time) => { if (last !== undefined) times.push(time - last); last = time;
        if (times.length < 90) requestAnimationFrame(frame); else { times.sort((a,b) => a-b); resolve({ medianMs: times[45], p95Ms: times[85] }); }
      }; requestAnimationFrame(frame);
    }));
    const effectsOn = await sample();
    const initial = await page.evaluate(() => ({ ...window.__metrics, h1s: document.querySelectorAll('h1').length, overflow: document.documentElement.scrollWidth > innerWidth, hero: document.querySelector('.kinetic-hero').getBoundingClientRect().toJSON(), image: document.querySelector('.kinetic-hero-art img').currentSrc }));
    await page.screenshot({ path: `${out}/${profile.name}-hero.png` });
    for (const id of ['works', 'field-notes', 'resume', 'contact']) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      await page.waitForFunction((id) => [...document.querySelectorAll(`#${id} img`)].every((img) => img.complete), id);
      await page.screenshot({ path: `${out}/${profile.name}-${id}.png` });
    }
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const effectsReduced = await sample();
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.screenshot({ path: `${out}/${profile.name}-full.png`, fullPage: true });
    const brokenImages = await page.locator('.kinetic-page img').evaluateAll((images) => images.filter((img) => !img.complete || !img.naturalWidth).map((img) => img.currentSrc));
    report.profiles.push({ ...profile, ...initial, video, effectsOn, effectsReduced, errors, brokenImages });
    await context.close();
  }
  await writeFile(`${out}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.profiles.some((profile) => profile.errors.length || profile.brokenImages.length || profile.overflow || profile.h1s !== 1)) process.exitCode = 1;
} finally { await browser.close(); server.kill('SIGTERM'); }
