import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { build } from 'esbuild';
import { gzipSync } from 'node:zlib';

const out = 'artifacts/overhaul';
await mkdir(out, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', '4173'], { stdio: 'ignore' });
const browser = await chromium.launch();
const report = { measuredAt: new Date().toISOString(), environment: 'Container Chromium, production bundle, unthrottled local CPU/network; lab observations, not field Core Web Vitals or INP.', profiles: [] };
try {
  for (let i=0; i<100; i++) {
    try { if ((await fetch('http://127.0.0.1:4173')).ok) break; } catch { /* server starting */ }
    await new Promise((resolve)=>setTimeout(resolve,100));
  }
  for (const profile of [{name:'laptop',width:1280,height:800,deviceScaleFactor:1},{name:'phone',width:390,height:844,deviceScaleFactor:2}]) {
    const context = await browser.newContext({viewport:{width:profile.width,height:profile.height},deviceScaleFactor:profile.deviceScaleFactor,isMobile:profile.name==='phone',hasTouch:profile.name==='phone'});
    await context.route('https://*.i.posthog.com/**',(route)=>route.fulfill({status:204}));
    await context.route('https://va.vercel-scripts.com/**',(route)=>route.abort());
    await context.route('https://api.emailjs.com/**',(route)=>route.abort());
    // Keep Sanity's existing allowed localhost origin while serving the production bundle.
    await context.route('http://localhost:5173/**', async (route) => {
      const url = new URL(route.request().url());
      if (url.pathname.startsWith('/_vercel/')) {
        await route.fulfill({ status: 200, contentType: 'application/javascript', body: '' });
        return;
      }
      url.hostname = '127.0.0.1'; url.port = '4173';
      const response = await route.fetch({ url: url.toString() });
      await route.fulfill({ response });
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror',(error)=>errors.push(error.message));
    await page.addInitScript(()=>{
      window.__heroMetrics={lcp:0,cls:0};
      new PerformanceObserver((list)=>{for(const e of list.getEntries()) window.__heroMetrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver((list)=>{for(const e of list.getEntries()) if(!e.hadRecentInput) window.__heroMetrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
    });
    await page.goto('http://localhost:5173');
    await page.locator('[data-gallery-stage] [role="group"] img').first().waitFor();
    await page.waitForFunction(()=>[...document.querySelectorAll('[data-gallery-stage] [role="group"] img')].every(i=>i.complete&&i.naturalWidth));
    await page.evaluate(()=>document.fonts.ready);
    await page.locator('[data-water]').first().waitFor({state:'attached'});
    const sample = () => page.evaluate(()=>new Promise((resolve)=>{
      const times=[];let previous;
      const frame=(time)=>{if(previous!==undefined)times.push(time-previous);previous=time;
        if(times.length<90)requestAnimationFrame(frame);else{times.sort((a,b)=>a-b);resolve({medianMs:times[45],p95Ms:times[85]});}};
      requestAnimationFrame(frame);
    }));
    const effectsOn = await sample();
    const metrics = await page.evaluate(()=>({
      ...window.__heroMetrics,
      cueBottom:document.querySelector('[data-scroll-cue]').getBoundingClientRect().bottom,
      awardsTop:document.getElementById('awards').getBoundingClientRect().top,
      stage:document.querySelector('[data-gallery-stage] [role="group"]').getBoundingClientRect().toJSON(),
      poster:document.querySelector('[data-gallery-stage] [role="group"] img').currentSrc,
      running:document.querySelector('[data-water]').dataset.running,
      overflow:document.documentElement.scrollWidth>innerWidth,
      contourCueGap:document.querySelector('[data-scroll-cue]').getBoundingClientRect().top-document.querySelector('[data-water]').getBoundingClientRect().bottom,
      contourMotion: 'Traveling SVG swell, 30fps cap; approximately 20s and 33s wave periods',
    }));
    await page.emulateMedia({reducedMotion:'reduce'});
    const effectsReducedMotion = await sample();
    const response = await fetch(metrics.poster,{headers:{Accept:'image/avif,image/webp,image/*,*/*;q=0.8'}});
    const bytes = (await response.arrayBuffer()).byteLength;
    if(!response.ok) throw Error('Poster could not be measured');
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.getByRole('button',{name:'Next project',exact:true}).click();
    const projectSwitch = await sample();
    if (process.env.MOTION_DIAGNOSTICS && profile.name === 'laptop') {
      const diagnostics = {};
      for (const [name, css] of Object.entries({ noBackground: '[data-ambient-background] { display: none !important; }', noContours: '[data-water] { display: none !important; }', isolatedContours: '[data-water] { contain: strict; }' })) {
        const style = await page.addStyleTag({ content: css });
        await page.getByRole('button',{name:'Next project',exact:true}).click();
        diagnostics[name] = await sample();
        await style.evaluate((element) => element.remove());
      }
      console.log('Motion diagnostics', JSON.stringify(diagnostics));
    }
    if (profile.name === 'phone') {
      await page.getByRole('button',{name:'Next project',exact:true}).click();
      await page.getByRole('button',{name:'Next project',exact:true}).click();
    } else await page.getByRole('button',{name:'Show SIT Open House 2026'}).click();
    await page.waitForFunction(()=>document.querySelector('[data-gallery-stage]').dataset.transitioning==='false');
    await page.mouse.move(5,5);
    await page.screenshot({path:`${out}/production-${profile.name}.png`});
    await page.getByRole('button',{name:'Next project',exact:true}).click();
    await page.getByRole('button',{name:'Next project',exact:true}).click();
    await page.getByRole('button',{name:'Field notes',exact:true}).click();
    await page.waitForFunction(()=>document.querySelector('[data-gallery-stage]').dataset.transitioning==='false');
    await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-gallery-panel][role="group"] [data-media-view="notes"]')).opacity==='1');
    await page.screenshot({path:`${out}/production-${profile.name}-cinder-notes.png`});
    await page.getByRole('button',{name:'Next project',exact:true}).click();
    for (const section of ['awards','works','field-notes','resume','contact']) {
      await page.locator('#'+section).scrollIntoViewIfNeeded();
      await page.waitForFunction((id)=>[...document.querySelectorAll('#'+id+' img')].every((img)=>img.complete),section);
      if (section === 'awards' || section === 'field-notes') await page.screenshot({path:`${out}/production-${profile.name}-${section}.png`});
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForFunction(()=>document.querySelector('[data-gallery-stage]').dataset.transitioning==='false');
    await page.mouse.move(5,5);
    await page.evaluate(()=>new Promise((resolve)=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.screenshot({path:`${out}/production-${profile.name}-full.png`,fullPage:true});
    report.profiles.push({...profile,...metrics,posterBytes:bytes,posterContentType:response.headers.get('content-type'),effectsOn,effectsReducedMotion,projectSwitch,errors});
    await context.close();
  }
  const isolated = await build({entryPoints:['src/components/home/ProjectGallery.jsx'],bundle:true,packages:'external',write:false,minify:true,format:'esm',define:{'import.meta.env.DEV':'false'}});
  report.isolatedHeroGzipEstimateBytes=gzipSync(isolated.outputFiles[0].contents).byteLength;
  report.bundleNote='Isolated minified gallery plus local helpers, excluding shared packages; estimate, not a before/after production chunk delta.';
  report.originNote='Local production preview served through localhost:5173 in the test browser to retain the existing Sanity CORS allowlist. Telemetry endpoints are intercepted.';
  await writeFile(`${out}/production-metrics.json`,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(report,null,2));
} finally {
  await browser.close();
  server.kill('SIGTERM');
}
