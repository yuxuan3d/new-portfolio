[PLANS]
- 2026-04-19T01:37:41.1789733+08:00 [TOOL] Supersedes the 2026-04-19T01:35:08.8783794+08:00 current-task entry: continuity compaction and ParticleEarth build-warning fix are complete.
- 2026-04-19T01:35:08.8783794+08:00 [USER] Current task: compact continuity and fix the ParticleEarth production build chunk warning. `ParticleEarth/AGENTS.md` is accepted as fine.
- 2026-03-28T00:26:05.6192387+08:00 [CODE] [MILESTONE] Keep this file bounded and milestone-based; append only material changes affecting frontend shell, ParticleEarth embed, verification workflow, or known caveats.

[DECISIONS]
- 2026-03-27T08:10:03Z [CODE] `/` is the canonical one-page route; `/about` redirects to `/#resume`; active standalone routes are `/project/:slug`, `/rnd`, `/rnd/:slug`, and `/contact`.
- 2026-03-27T08:10:03Z [CODE] `ParticleEarth` remains isolated as a built iframe served from `frontend/public/particle-earth`; do not merge its runtime into the main React app.
- 2026-03-27T08:10:03Z [CODE] Canonical earth sync workflow is `powershell -NoProfile -ExecutionPolicy Bypass -File scripts\syncParticleEarth.ps1` from `frontend/`; do not hand-edit `frontend/public/particle-earth`.
- 2026-03-27T15:43:37.1886598Z [CODE] Responsive breakpoints: phone `<=640`, tablet `<=1023`, desktop `>=1024`, wide rails `>=1180`; core layout tokens include `--site-gutter`, `--section-gap`, `--panel-padding`, and `--site-header-height`.
- 2026-03-27T15:20:00Z [USER] Shared accent color is `#90D5FF`; derived buttons, chips, glows, and focus states should follow this token.
- 2026-03-28T00:34:00+08:00 [USER] Keep ParticleEarth hero gradient controls in code but hide Leva in embed mode; shipped defaults are `#0d3b8b` and `64%`.
- 2026-03-28T00:13:06.9870180+08:00 [CODE] The hero iframe should not use whole-frame dimming; readability comes from the page overlay plus in-iframe gradient/background treatment.

[PROGRESS]
- 2026-04-19T01:37:41.1789733+08:00 [CODE] Fixed ParticleEarth's Vite large-chunk warning by adding Rollup `manualChunks` in `ParticleEarth/vite.config.ts` for `three-core`, `three-react`, `controls`, and shared `vendor`, then resynced the multi-chunk iframe bundle into `frontend/public/particle-earth`.
- 2026-04-19T01:35:08.8783794+08:00 [CODE] `.agent/CONTINUITY.md` was compacted from the long event log into this milestone brief; older detailed visual/layout passes were summarized.
- 2026-04-19T01:28:28.9342121+08:00 [CODE] Implemented the visual-only portfolio globe signal system in `ParticleEarth`: code-owned signal data, Singapore home-base pulse, project constellation arcs, drag-triggered R&D transmissions, workflow orbit rings, signal opacity/speed Leva controls, and debug counters; synced the rebuilt iframe into `frontend/public/particle-earth`.
- 2026-04-19T00:59:11.9576251+08:00 [CODE] Added mobile/tablet hero quick links for `Showreel` and `Resume` in `frontend/src/components/home/HomeHero.jsx`; wide desktop rail remains unchanged.
- 2026-04-02T17:06:00+08:00 [TOOL] [MILESTONE] Top-level `main` was fast-forwarded to `79b5958`, bringing in the homepage loading gate and clean `ParticleEarth` submodule pointer update to `06381a1`.
- 2026-04-01T14:43:07.4651167+08:00 [CODE] Homepage waits behind a loading bar until the ParticleEarth iframe reports ready via `onLoad`.
- 2026-04-01T09:06:14.0471832+08:00 [CODE] ParticleEarth defaults to a Singapore-facing rotation using `latLonToFocusRotation(...)`.
- 2026-03-31T23:06:04.7535581+08:00 [CODE] Work cards use route-backed overlay project details and animated filtering with stale-timeout/object-refresh guards.
- 2026-03-28T12:19:00+08:00 [CODE] [MILESTONE] Mobile/tablet layout pass hardened `/`, `/contact`, `/rnd`, `/rnd/:slug`, and `/project/:slug` against header overlap and horizontal overflow.
- 2026-03-28T11:31:45+08:00 [CODE] [MILESTONE] Site background/section system uses subtle dot fields and continuous dark-to-surface transitions; hero dots live inside ParticleEarth behind the globe.

[DISCOVERIES]
- 2026-04-19T01:28:28.9342121+08:00 [TOOL] Docker Desktop was unavailable for the ParticleEarth container-first workflow (`dockerDesktopLinuxEngine` pipe missing), so direct npm scripts were used. Direct WebGL canvas `drawImage(...)` sampling returned zero pixels because the drawing buffer is not preserved; screenshot-crop pixel sampling worked for visual checks.
- 2026-04-19T00:59:11.9576251+08:00 [TOOL] Browser verification may need elevated Playwright/Chromium in this environment because sandboxed browser launch can fail with `spawn EPERM`.
- 2026-03-31T23:28:52.4705870+08:00 [TOOL] Top-level repo and nested `ParticleEarth` repo may require command-scoped Git `safe.directory`; top-level Git writes may need escalation when `.git/index.lock` is denied.
- 2026-03-28T00:13:06.9870180+08:00 [TOOL] Removed Three.js `Clock` warning currently depends on a fragile local patch inside `ParticleEarth/node_modules/@react-three/fiber/dist/*`; reinstalling dependencies may lose it until replaced by a durable patch workflow.
- 2026-03-27T09:30:00Z [TOOL] ParticleEarth embed assets must resolve relative to `/particle-earth/`; absolute root asset paths broke the iframe.
- 2026-03-27T09:30:00Z [TOOL] `useControls` can inject a Leva root even when `<Leva />` is not rendered; embed mode needs explicit CSS suppression if hidden.
- 2026-03-27T08:10:03Z [TOOL] This sandbox has previously failed uncached npm fetches (`ENOTCACHED` / cache-only failures); avoid new dependencies unless already present.

[OUTCOMES]
- 2026-04-19T01:37:41.1789733+08:00 [TOOL] ParticleEarth build warning is resolved: `npm run build` now emits chunks under the configured 1200 kB limit (`three-core` ~724 kB largest) with no Vite/Rollup warnings. Verification passed with ParticleEarth lint/unit/e2e/build, canonical sync, and frontend lint/build.
- 2026-04-19T01:28:28.9342121+08:00 [TOOL] Portfolio globe enhancement verification succeeded: `ParticleEarth` lint, unit tests, build, and e2e smoke passed; canonical sync rebuilt/copied iframe; `frontend` lint/build passed; elevated Playwright sweep across `1440x900`, `1920x1080`, `768x1024`, `390x844`, and `320x568` found no horizontal overflow, correct signal debug counts, mobile caps, and verified drag-triggered transmission state.
- 2026-04-19T00:59:11.9576251+08:00 [TOOL] Mobile/tablet hero quick-link verification succeeded across desktop/tablet/phone; `frontend` lint and Vite production build passed.
- 2026-04-17T12:04:59.0866006+08:00 [CODE] Root `AGENTS.MD` documents repo workflows for frontend, ParticleEarth sync/verification, ParticleEarth Compose, Sanity Studio, and command-scoped Git `safe.directory`; `ParticleEarth/AGENTS.md` has corrected Compose command formatting.
- 2026-04-02T17:06:00+08:00 [TOOL] Latest branch integration baseline verified with `ParticleEarth` ESLint/unit/build, canonical sync, and `frontend` lint/build.
- 2026-03-27T08:10:03Z [TOOL] [MILESTONE] Active product baseline: dark one-page portfolio shell with synced ParticleEarth hero, Sanity-backed Work/R&D content, and retained project/blog/contact routes.
