[PLANS]
- 2026-04-30T10:49:06.4260477+08:00 [USER] Current task: compact `.agent/CONTINUITY.md` into a bounded milestone brief.
- 2026-04-30T10:47:12.8440028+08:00 [USER] Most recent product task: rebalance the homepage About awards panel so desktop awards do not push the capability row too far down.
- 2026-03-28T00:26:05.6192387+08:00 [CODE] [MILESTONE] Keep this file short and high-signal; append only material changes affecting frontend shell, ParticleEarth embed, verification workflow, or known caveats.

[DECISIONS]
- 2026-03-27T08:10:03Z [CODE] `/` is the canonical one-page route; `/about` redirects to `/#resume`; active standalone routes are `/project/:slug`, `/rnd`, `/rnd/:slug`, and `/contact`.
- 2026-03-27T08:10:03Z [CODE] `ParticleEarth` stays isolated as a built iframe served from `frontend/public/particle-earth`; do not merge its runtime into the main React app and do not hand-edit synced iframe assets.
- 2026-03-27T08:10:03Z [CODE] Canonical earth sync workflow from `frontend/`: `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\syncParticleEarth.ps1`; if already built and only recopying, use `node scripts/syncParticleEarth.mjs`.
- 2026-03-27T15:43:37.1886598Z [CODE] Responsive breakpoints: phone `<=640`, tablet `<=1023`, desktop `>=1024`, wide rails `>=1180`; core layout tokens include `--site-gutter`, `--section-gap`, `--panel-padding`, and `--site-header-height`.
- 2026-03-27T15:20:00Z [USER] Shared accent color is `#90D5FF`; derived buttons, chips, glows, and focus states should follow this token.
- 2026-03-28T00:34:00+08:00 [USER] Keep ParticleEarth hero gradient controls in code but hide Leva in embed mode; shipped defaults are `#0d3b8b` and `64%`.
- 2026-04-23T23:14:07.9201206+08:00 [CODE] Frontend security uses route-specific Vercel CSP: main app denies framing while `/particle-earth/*` allows same/canonical origins so the hero iframe still works.
- 2026-04-23T23:14:07.9201206+08:00 [CODE] Contact form remains browser-side EmailJS with client validation, honeypot, and minimum submit delay; stronger abuse controls require a server/API route with secret-backed rate limiting.
- 2026-04-25T12:51:03.5549446+08:00 [USER] The Work-section process row was rejected and should stay removed unless explicitly re-requested.
- 2026-04-29T15:13:22.8460661+08:00 [USER] Desktop/computer hero asset links mean viewport width `>=1024px`; mobile/tablet quick links stay unchanged.
- 2026-04-30T10:10:30.8678644+08:00 [CODE] Mobile vertical scroll takes priority over ParticleEarth drag: iframe touch handling uses `touch-action: pan-y`, pointer drags activate after a horizontal threshold, and offscreen/hidden hero scenes pause through `particle-earth:visibility`.

[PROGRESS]
- 2026-04-30T10:49:06.4260477+08:00 [CODE] Compacted `.agent/CONTINUITY.md` from the long event log into this milestone brief.
- 2026-04-30T10:47:12.8440028+08:00 [CODE] Homepage About awards now live in `frontend/src/content/siteContent.js` as `AWARD_HIGHLIGHTS` and render in `frontend/src/components/home/ResumeSection.jsx`; desktop uses a compact two-column award grid, tablet/mobile use a single-column stack.
- 2026-04-30T10:10:30.8678644+08:00 [CODE] Implemented mobile scroll performance pass: offscreen ParticleEarth pause/resume, lower mobile WebGL cost, horizontal-threshold touch drag, removed large blur filters, earlier lazy-image preloading, and disabled subtle fixed/masked dot overlays on phones.
- 2026-04-29T18:55:43.1965481+08:00 [CODE] Desktop/tablet/phone hero asset-link placement was tuned so `Resume` and `Showreel` clear the projected globe; desktop side labels are larger and right follow rail only contains follow/social controls.
- 2026-04-25T17:55:19.7471691+08:00 [CODE] Hero iframe CSP hardening is deploy-ready in `frontend/vercel.json`; no deployment was performed because that is a remote write.
- 2026-04-24T17:09:22.1297789+08:00 [CODE] Portfolio polish milestone: R&D naming, metadata/OG image, scroll reveal, less uniform About/Contact panels, selected Work tile, and project next/previous navigation are implemented.
- 2026-04-23T23:14:07.9201206+08:00 [CODE] Security-hardening milestone: strict headers/CSP, iframe sandboxing/privacy, contact-form friction, dependency audit remediation, and no inline HTML boot script.
- 2026-04-19T13:40:23.3968540+08:00 [CODE] Review-fix milestone: provider-whitelisted embeds, no frontend Sanity token, stale Sanity response guard, source maps opt-in, encoded sitemap routes, and ParticleEarth rotation refs.
- 2026-04-19T01:37:41.1789733+08:00 [CODE] ParticleEarth production bundle uses Rollup manual chunks; large Vite chunk warning was resolved and synced into the frontend iframe bundle.
- 2026-04-19T01:28:28.9342121+08:00 [CODE] ParticleEarth globe milestone: Singapore home-base pulse, project constellation arcs, R&D transmissions, workflow orbit rings, text project markers, and iframe parent/child project-open messaging.

[DISCOVERIES]
- 2026-04-30T10:49:06.4260477+08:00 [TOOL] Current top-level `git status --short` before compaction showed only dirty nested `ParticleEarth`; leave it untouched unless the task explicitly involves that submodule.
- 2026-04-30T10:10:30.8678644+08:00 [TOOL] Mobile scroll stall root cause was likely touch interception plus paint pressure: ParticleEarth used immediate touch capture and page surfaces used blur filters over large areas.
- 2026-04-25T17:55:19.7471691+08:00 [TOOL] Vercel project `new-portfolio` has `www.yxperiments.com` attached but not apex `yxperiments.com`; apex currently redirects elsewhere, which can cause origin/framing confusion outside canonical `www`.
- 2026-04-25T17:42:33.3464615+08:00 [TOOL] Vercel `headers` rules are cumulative; avoid catch-all main-app CSP accidentally applying `frame-ancestors 'none'` to `/particle-earth/*`.
- 2026-04-24T17:09:22.1297789+08:00 [TOOL] Local Sanity data may fail from arbitrary localhost/127.0.0.1 ports due CORS; use `http://localhost:5173` when possible or mocked Sanity responses for isolated UI checks.
- 2026-04-24T12:03:31.6452789+08:00 [TOOL] `frontend/scripts/designAudit.mjs` probes `http://localhost:5173` through `:5180`; `frontend/scripts/generateSitemap.js` writes `frontend/public/sitemap.xml` and honors optional `SITE_URL` / `VITE_SANITY_API_VERSION`.
- 2026-04-19T01:28:28.9342121+08:00 [TOOL] Docker Desktop has previously been unavailable in this workspace, so direct npm scripts were used when the ParticleEarth container workflow could not run.
- 2026-04-19T00:59:11.9576251+08:00 [TOOL] Browser/Playwright verification may need elevation because sandboxed Chromium launch can fail with `spawn EPERM`.
- 2026-03-31T23:28:52.4705870+08:00 [TOOL] Top-level repo and nested `ParticleEarth` repo may require command-scoped Git `safe.directory`; top-level Git writes may need escalation when `.git/index.lock` is denied.
- 2026-03-28T00:13:06.9870180+08:00 [TOOL] A fragile local patch may exist in `ParticleEarth/node_modules/@react-three/fiber/dist/*` for a Three.js `Clock` warning; reinstalling dependencies may remove it until replaced by a durable patch workflow.
- 2026-03-27T08:10:03Z [TOOL] This sandbox has previously failed uncached npm fetches (`ENOTCACHED` / cache-only failures); avoid new dependencies unless already present.

[OUTCOMES]
- 2026-04-30T10:49:06.4260477+08:00 [TOOL] Continuity compaction completed as a docs-only update; no build/lint needed.
- 2026-04-30T10:47:12.8440028+08:00 [TOOL] About awards rebalance verified: `frontend` `npm run lint` passed; `frontend` `npm run build` passed; elevated Chromium geometry check measured desktop awards at 230px tall, two columns, five awards rendered, no desktop/mobile horizontal overflow.
- 2026-04-30T10:10:30.8678644+08:00 [TOOL] Mobile scroll performance pass verified: ParticleEarth lint/unit/build/e2e passed; canonical sync completed; frontend lint/build passed; elevated mobile Chromium check confirmed no overflow, reveal filters `none`, iframe `touch-action: pan-y`, and offscreen scene inactive.
- 2026-04-29T18:55:43.1965481+08:00 [TOOL] Hero asset-link positioning verified across desktop, tablet, phone portrait, and phone landscape breakpoints with frontend lint/build plus elevated geometry checks.
- 2026-04-25T17:55:19.7471691+08:00 [TOOL] Hero iframe hardening verified locally with JSON parse, frontend lint/build, and live `www.yxperiments.com` elevated Chromium check showing iframe canvas renders without visible framing errors.
- 2026-04-24T17:09:22.1297789+08:00 [TOOL] Portfolio polish verified with frontend lint/build, Browser/IAB DOM checks, Playwright mocked-data checks for Work/project detail/mobile overflow, and generated OG image.
- 2026-04-23T23:14:07.9201206+08:00 [TOOL] Security-hardening verified: frontend prod/full `npm audit` returned zero vulnerabilities; frontend lint/build passed on Node `v24.13.0`.
- 2026-04-19T13:40:23.3968540+08:00 [TOOL] Review-fix milestone verified with frontend lint/build, direct sitemap generation, ParticleEarth lint/unit/e2e, and canonical sync/build.
- 2026-04-19T01:37:41.1789733+08:00 [TOOL] ParticleEarth chunk-warning fix verified with ParticleEarth lint/unit/e2e/build, canonical sync, and frontend lint/build.
- 2026-03-27T08:10:03Z [TOOL] [MILESTONE] Active product baseline: dark one-page portfolio shell with synced ParticleEarth hero, Sanity-backed Work/R&D content, and retained project/blog/contact routes.
