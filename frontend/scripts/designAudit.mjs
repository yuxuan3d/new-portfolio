import fs from 'node:fs';
import path from 'node:path';

const USER_BASE_URL = process.env.BASE_URL;
const DEFAULT_BASE_URL = 'http://localhost:5173';
const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(
    process.cwd(),
    'playwright-artifacts',
    'design-audit',
    new Date().toISOString().replace(/[:.]/g, '-')
  );

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function waitForBaseUrl(baseUrl, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 2_500);

      const res = await fetch(new URL('/', baseUrl), {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timer);

      if (res.ok) return true;
    } catch {
      // keep retrying
    }

    await new Promise((r) => setTimeout(r, 400));
  }

  return false;
}

async function detectLocalDevServerUrl() {
  const portsToTry = [5173, 5174, 5175, 5176, 5177, 5178, 5179, 5180];

  for (const port of portsToTry) {
    const candidate = `http://localhost:${port}`;
    // eslint-disable-next-line no-await-in-loop
    if (await waitForBaseUrl(candidate, 1_200)) return candidate;
  }

  return null;
}

function safeFileSegment(value) {
  return value.replaceAll('/', '_').replaceAll(':', '_').replaceAll('?', '_').replaceAll('&', '_');
}

async function loadPlaywright() {
  try {
    return await import('playwright');
  } catch (err) {
    console.error(
      [
        'Playwright is not installed.',
        'Install it in `frontend/` with:',
        '  npm i -D playwright',
        '  npx playwright install',
        '',
        'Then run this audit with:',
        '  npm run dev',
        '  BASE_URL=http://localhost:5173 npm run design-audit',
        '',
        'Or audit production directly:',
        '  BASE_URL=https://www.your-domain.com npm run design-audit',
      ].join('\n')
    );
    throw err;
  }
}

async function getLayoutSignals(page) {
  return page.evaluate(() => {
    const root = document.documentElement;
    const body = document.body;
    const h1Count = document.querySelectorAll('h1').length;
    const hasMain = Boolean(document.querySelector('main'));

    // If any element causes overflow, this catches it.
    const overflowX =
      root.scrollWidth > root.clientWidth || body.scrollWidth > body.clientWidth;

    return {
      title: document.title,
      h1Count,
      hasMain,
      overflowX,
      root: {
        clientWidth: root.clientWidth,
        scrollWidth: root.scrollWidth,
      },
      body: {
        clientWidth: body.clientWidth,
        scrollWidth: body.scrollWidth,
      },
    };
  });
}

async function tryWaitForAppReady(page) {
  // The app uses a loading state; we want *something* stable before screenshotting.
  await page.waitForSelector('#root', { state: 'attached' });
  await page.waitForTimeout(250);
}

async function warmUpLazyImages(page) {
  // Full-page screenshots can capture blur placeholders if lazy images haven't intersected yet.
  // This scroll pass warms the cache so the stitched screenshot is more likely to include real images.
  try {
    await page.evaluate(async () => {
      const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      const maxScroll = Math.max(0, document.body.scrollHeight - window.innerHeight);
      const step = Math.max(1, Math.floor(window.innerHeight * 0.9));

      for (let y = 0; y <= maxScroll; y += step) {
        window.scrollTo(0, y);
        // Give IntersectionObserver + image requests a moment to kick in.
        // eslint-disable-next-line no-await-in-loop
        await sleep(140);
      }

      window.scrollTo(0, 0);
    });

    await page.waitForTimeout(250);
  } catch {
    // best-effort only
  }
}

async function tryWaitForHomeReady(page) {
  // Best-effort: wait for loaders to clear and some project state to appear.
  await page
    .waitForSelector('text=Loading Projects', { state: 'detached', timeout: 20_000 })
    .catch(() => {});
  await page
    .waitForSelector('text=Loading Featured Work', { state: 'detached', timeout: 20_000 })
    .catch(() => {});

  await waitForAnySelectorOrTimeout(
    page,
    ['a[href^="/project/"]', 'text=No projects found', 'text=Failed to load data'],
    20_000
  );

  await warmUpLazyImages(page);
}

async function waitForContentOrTimeout(page, selector, timeoutMs = 12_000) {
  try {
    await page.waitForSelector(selector, { timeout: timeoutMs });
  } catch {
    // best-effort
  }
}

async function waitForAnySelectorOrTimeout(page, selectors, timeoutMs = 12_000) {
  const tasks = selectors.map(async (selector) => {
    try {
      await page.waitForSelector(selector, { timeout: timeoutMs });
      return true;
    } catch {
      return false;
    }
  });

  try {
    await Promise.race(tasks);
  } catch {
    // ignore
  }
}

async function clickFirstIfExists(page, selector) {
  const locator = page.locator(selector).first();
  if ((await locator.count()) === 0) return false;
  await locator.click();
  return true;
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844, isMobile: true, hasTouch: true },
];

const ROUTES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'rnd', path: '/rnd' },
];

ensureDir(OUT_DIR);

const BASE_URL = USER_BASE_URL || (await detectLocalDevServerUrl()) || DEFAULT_BASE_URL;
const isReachable = await waitForBaseUrl(BASE_URL, 10_000);
if (!isReachable) {
  console.error(
    [
      `Cannot reach ${BASE_URL}.`,
      '',
      'Start the site first, then re-run:',
      '  1) Terminal A: cd frontend && npm run dev',
      '  2) Terminal B: cd frontend && BASE_URL=http://localhost:5173 npm run design-audit',
      '',
      'If Vite picked a different port (e.g. 5174), set BASE_URL to match it.',
      'Or audit a deployed site instead:',
      '  BASE_URL=https://www.your-domain.com npm run design-audit',
    ].join('\n')
  );
  process.exit(1);
}

const { chromium } = await loadPlaywright();
const browser = await chromium.launch();

const report = {
  baseUrl: BASE_URL,
  outDir: OUT_DIR,
  startedAt: new Date().toISOString(),
  results: [],
};

try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.isMobile,
      hasTouch: viewport.hasTouch,
    });

    const page = await context.newPage();
    page.setDefaultTimeout(30_000);

    for (const route of ROUTES) {
      const url = new URL(route.path, BASE_URL).toString();

      await page.goto(url, { waitUntil: 'domcontentloaded' });
      await tryWaitForAppReady(page);

      if (route.path === '/') {
        await tryWaitForHomeReady(page);
      } else if (route.path === '/rnd') {
        await waitForAnySelectorOrTimeout(page, ['a[href^="/rnd/"]', 'text=No R&D posts yet']);
      }

      const signals = await getLayoutSignals(page);
      const fileBase = `${viewport.name}-${route.name}`;
      const screenshotPath = path.join(OUT_DIR, `${safeFileSegment(fileBase)}.png`);
      await page.screenshot({ path: screenshotPath, fullPage: true });

      report.results.push({
        viewport: viewport.name,
        route: route.path,
        screenshot: path.relative(process.cwd(), screenshotPath),
        signals,
      });

      // Mobile-only: capture the hamburger drawer for the homepage.
      if (viewport.name === 'mobile' && route.path === '/') {
        try {
          const menuButton = page.getByRole('button', { name: /open menu/i }).first();
          if ((await menuButton.count()) > 0) {
            await menuButton.click();
            await page.waitForTimeout(200);
            await waitForContentOrTimeout(page, '[role="dialog"]', 2_000);

            const menuSignals = await getLayoutSignals(page);
            const menuPath = path.join(OUT_DIR, `${safeFileSegment(`${fileBase}-menu`)}.png`);
            await page.screenshot({ path: menuPath, fullPage: true });

            report.results.push({
              viewport: viewport.name,
              route: `${route.path}#menu`,
              screenshot: path.relative(process.cwd(), menuPath),
              signals: menuSignals,
            });

            await page.keyboard.press('Escape').catch(() => {});
            await page.waitForTimeout(150);
          }
        } catch {
          // ignore
        }
      }
    }

    // Dynamic pages (best-effort): click first project + first R&D post.
    try {
      await page.goto(new URL('/', BASE_URL).toString(), { waitUntil: 'domcontentloaded' });
      await tryWaitForAppReady(page);
      if (await clickFirstIfExists(page, 'a[href^="/project/"]')) {
        await page.waitForURL(/\/project\/.+/);
        await tryWaitForAppReady(page);

        const signals = await getLayoutSignals(page);
        const screenshotPath = path.join(OUT_DIR, `${viewport.name}-project.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        report.results.push({
          viewport: viewport.name,
          route: 'first-project',
          screenshot: path.relative(process.cwd(), screenshotPath),
          signals,
        });
      }
    } catch {
      // ignore: depends on Sanity content and local server availability
    }

    try {
      await page.goto(new URL('/rnd', BASE_URL).toString(), { waitUntil: 'domcontentloaded' });
      await tryWaitForAppReady(page);
      if (await clickFirstIfExists(page, 'a[href^="/rnd/"]')) {
        await page.waitForURL(/\/rnd\/.+/);
        await tryWaitForAppReady(page);

        const signals = await getLayoutSignals(page);
        const screenshotPath = path.join(OUT_DIR, `${viewport.name}-rnd-post.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        report.results.push({
          viewport: viewport.name,
          route: 'first-rnd-post',
          screenshot: path.relative(process.cwd(), screenshotPath),
          signals,
        });
      }
    } catch {
      // ignore: depends on Sanity content and local server availability
    }

    // Theme toggle screenshots (best-effort).
    try {
      await page.goto(new URL('/', BASE_URL).toString(), { waitUntil: 'domcontentloaded' });
      await tryWaitForAppReady(page);

      const themeToggle = page.getByRole('button', { name: /theme/i });
      if ((await themeToggle.count()) > 0) {
        await page.screenshot({
          path: path.join(OUT_DIR, `${viewport.name}-theme-before.png`),
          fullPage: true,
        });
        await themeToggle.click();
        await page.waitForTimeout(250);
        await page.screenshot({
          path: path.join(OUT_DIR, `${viewport.name}-theme-after.png`),
          fullPage: true,
        });
      }
    } catch {
      // ignore
    }

    await context.close();
  }
} finally {
  report.finishedAt = new Date().toISOString();
  fs.writeFileSync(path.join(OUT_DIR, 'report.json'), JSON.stringify(report, null, 2));
  await browser.close();
}

const overflowFindings = report.results
  .filter((r) => r.signals?.overflowX)
  .map((r) => `${r.viewport} ${r.route}`);

console.log(`Design audit complete.\nOutput: ${OUT_DIR}`);
if (overflowFindings.length > 0) {
  console.log(`\nHorizontal overflow detected on:\n- ${overflowFindings.join('\n- ')}`);
}
