[PLANS]
- 2026-02-10T07:33:04Z [USER] Replace visible-grid stable-fluid behavior with a ripple-shader-first hero that keeps smooth swirls and better frame pacing; validate against `http://localhost:5173/` with Playwright and preserve CTA clickability.
- 2026-02-10T07:24:54Z [USER] Align Home hero warp with https://blog.olivierlarose.com/demos/ripple-shader: smooth swirls, no visible grid artifacts (any quality), faster decay, effect clipped to hero only; warp background + hero copy but never the CTA buttons; verify via Playwright on `http://localhost:5173/`.

[DECISIONS]
- 2026-02-10T08:31:14Z [USER] Hero text colors must remain correct in both dark and light themes after animated theme switching.
- 2026-02-10T08:31:14Z [CODE] In fluid hero canvas capture, prioritize theme tokens for text fill colors (`theme.text.primary`/`theme.text.secondary`) over `getComputedStyle(...).color` to avoid sampling transitional colors during the 0.3s toggle animation.
- 2026-02-10T08:27:47Z [USER] Theme toggle should animate light/dark transitions over 0.3 seconds instead of snapping instantly.
- 2026-02-10T08:27:47Z [CODE] Scope transitions to explicit theme toggles by setting a temporary root data-flag in `toggleTheme`, then applying a 0.3s color/background/border/shadow transition rule only while that flag is present.
- 2026-02-10T08:24:30Z [USER] Light theme must visibly switch the Home hero backdrop away from the dark palette.
- 2026-02-10T08:24:30Z [CODE] Keep hero visuals theme-consistent by updating both the WebGL source-canvas background (`HeroStableFluids`) and the CSS fallback gradient (`Home` Hero styled section) for `theme.mode === 'light'`.
- 2026-02-10T08:12:50Z [USER] Update All Projects tile titles from one-line truncation to a centered two-line clamp treatment.
- 2026-02-10T08:09:59Z [USER] Normalize All Projects tile-title formatting so long entries (including 鈥淪top Asian Hate - ONE Championship鈥? follow the same title treatment as other cards.
- 2026-02-10T08:04:37Z [CODE] Refactor `HeroStableFluids` to a single internal ripple configuration (current balanced tuning) and remove deprecated external `quality` API/preset branching to reduce complexity and maintenance overhead.
- 2026-02-10T07:58:22Z [USER] Superseding 2026-02-10T06:49:42Z quality-control UI decision: remove Home hero fluid quality buttons/state because those runtime options are no longer part of the intended UX.
- 2026-02-10T07:54:21Z [CODE] Keep analytic ripple-point displacement as the hero baseline (quality + perf); do not reintroduce grid/state-buffer simulation unless a specific visual regression requires it.
- 2026-02-09T09:03:10Z [USER] Scope: restyle homepage only; do not change other pages.
- 2026-02-09T09:09:40Z [USER] Remove Featured Spotlight; keep Featured Work + All Projects.
- 2026-02-09T07:27:54Z [USER] Default theme is dark; preserve persisted user preference.
- 2026-02-09T09:14:55Z [TOOL] Hero is full-bleed and exactly 1 viewport tall; remove card/chrome framing.
- 2026-02-09T09:28:07Z [TOOL] On the home route, header wrapper fades to transparent so the hero gradient can extend behind it without a seam.
- 2026-02-09T09:33:21Z [TOOL] Use measured sticky header height (`--site-header-height`) for hero overlap/padding to prevent top/bottom gradient seams across breakpoints.
- 2026-02-09T12:49:53Z [TOOL] Warp affects hero background + hero copy only; CTAs remain normal DOM above (unwarped, clickable); effect clipped to the Hero section.
- 2026-02-10T06:49:42Z [TOOL] Expose 3 runtime quality presets (`performance`, `balanced`, `rich`) via a Home hero control; persist selection in localStorage (`home-fluid-quality`) and pass `quality` into `HeroStableFluids`.
- 2026-02-10T07:34:59Z [CODE] Keep the current WebGL ripple architecture but switch state buffers to prefer renderable half-float (`RGBA16F`) with automatic fallback to `RGBA8`, instead of forcing a full rewrite first.
- 2026-02-10T07:44:21Z [CODE] Superseding prior buffer-precision-only approach: replace grid/state-buffer simulation with an analytic ripple-point displacement shader to remove persistent warp lattice artifacts while keeping the Hero text/background texture-capture pipeline and CTA isolation unchanged.

[PROGRESS]
- 2026-02-10T08:31:14Z [CODE] Updated `frontend/src/components/HeroStableFluids.jsx` text color selection for kicker/subtitle canvas rendering to use stable theme values first, fixing post-transition color mismatch.
- 2026-02-10T08:31:14Z [TOOL] Verification passed in `frontend`: `npm run lint` and `npm run build`.
- 2026-02-10T08:27:47Z [CODE] Updated `frontend/src/context/ThemeContext.jsx` to set `document.documentElement.dataset.themeTransition='true'` before theme state flips, clear it after 300ms, and clean up pending timeouts on unmount.
- 2026-02-10T08:27:47Z [CODE] Updated `frontend/src/App.jsx` global styles with a `:root[data-theme-transition='true']` transition block (0.3s) and aligned body color/background transition duration to 0.3s.
- 2026-02-10T08:27:47Z [TOOL] Verification passed in `frontend`: `npm run lint` and `npm run build`.
- 2026-02-10T08:24:30Z [CODE] Updated `frontend/src/components/HeroStableFluids.jsx` `drawHeroBackground` to branch on `theme.mode` and render a dedicated light gradient + radial accent set while preserving the existing dark palette for dark mode.
- 2026-02-10T08:24:30Z [CODE] Updated `frontend/src/pages/Home.jsx` Hero fallback `background` style to use a light-mode gradient when `theme.mode === 'light'`, matching the fluid canvas look when the shader path is unavailable.
- 2026-02-10T08:24:30Z [TOOL] Verification passed in `frontend`: `npm run lint` and `npm run build`.
- 2026-02-10T08:12:50Z [CODE] Updated frontend/src/pages/Home.jsx TileTitle to centered two-line clamp (text-align:center, display:-webkit-box, -webkit-line-clamp:2, -webkit-box-orient:vertical, white-space:normal, overflow:hidden, text-overflow:ellipsis) including touch breakpoint.
- 2026-02-10T08:12:50Z [TOOL] Verified with npm run lint + npm run build in frontend; Playwright computed style on Stop Asian Hate tile reports textAlign=center and lineClamp=2, and screenshot all-projects-two-line-centered.png was captured.
- 2026-02-10T08:09:59Z [CODE] Updated `frontend/src/pages/Home.jsx` `TileTitle` styling to enforce uniform one-line formatting (`width: 100%`, `line-height: 1.2`, `white-space: nowrap`, `overflow: hidden`, `text-overflow: ellipsis`) across All Projects cards.
- 2026-02-10T08:09:59Z [TOOL] Verified title-format fix with `npm run lint` + `npm run build` in `frontend`, then Playwright on `http://localhost:5173/` with section screenshot (`all-projects-title-formatting.png`) showing Stop Asian Hate title now matching the one-line format.
- 2026-02-10T08:05:39Z [CODE] Further Home cleanup: replaced single-field `HERO_COPY` object with flat `HERO_SUBTITLE` constant to remove unnecessary indirection; revalidated with `npm run lint` and `npm run build` in `frontend`.
- 2026-02-10T08:04:37Z [CODE] Refactored `frontend/src/components/HeroStableFluids.jsx`: removed quality-preset map and `quality` prop, consolidated pointer/last-frame reset literals into helper factories, removed redundant text helper indirection, and normalized ripple limits to `MAX_RIPPLE_POINTS`.
- 2026-02-10T08:04:37Z [CODE] Cleaned `frontend/src/pages/Home.jsx` redundancies by removing unused `HERO_COPY.kicker` and unused `AvailabilityPill` styled component.
- 2026-02-10T08:04:37Z [TOOL] Post-refactor checks passed in `frontend`: `npm run lint`, `npm run build`; Playwright sanity on `http://localhost:5173/` confirms hero canvas active (`heading opacity 0`, `hero background none`) and hero `Contact` CTA still routes `/ -> /contact -> /`.
- 2026-02-10T07:59:14Z [TOOL] Playwright check on `http://localhost:5173/` confirmed the quality UI is gone (`hasFluidGroup=false`, no `Performance/Balanced/Rich` labels) while hero CTA links remain present.
- 2026-02-10T07:58:22Z [CODE] Removed quality-control plumbing from `frontend/src/pages/Home.jsx` (storage key/options/constants, `fluidQuality` state/effect, quality buttons block, and related styled components); `HeroStableFluids` now uses its internal default quality path from Home.
- 2026-02-10T07:58:22Z [TOOL] Post-change verification in `frontend`: `npm run lint` passed and `npm run build` passed.
- 2026-02-10T07:54:21Z [TOOL] Playwright validation on `http://localhost:5173/`: hero canvas is active (`heading opacity 0`, `hero background none`, canvas dimensions match hero), and screenshots were captured before/after scripted drag (`hero-ripple-before-drag.png`, `hero-ripple-after-drag.png`).
- 2026-02-10T07:54:21Z [TOOL] Verified runtime invariants in Playwright: quality controls toggle `performance`/`balanced`/`rich` while canvas stays active, and hero `Contact` CTA still navigates to `/contact` and back.
- 2026-02-10T07:54:21Z [TOOL] Re-ran verification checks in `frontend`: `npm run lint` passed; `npm run build` passed.
- 2026-02-10T07:44:21Z [TOOL] Began rewrite pass of `frontend/src/components/HeroStableFluids.jsx` simulation path (state FBO loop -> ripple-point uniforms) with goal of matching Olivier Larose ripple behavior more closely and reducing per-frame GPU workload.
- 2026-02-10T07:34:59Z [CODE] Updated `frontend/src/components/HeroStableFluids.jsx` ripple shaders to use isotropic 8-neighbor sampling + smoother render gradients, and raised sim-resolution budgets per quality preset to reduce visible lattice artifacts.
- 2026-02-10T07:33:04Z [TOOL] Started focused pass to remove persistent warp-grid artifacts by changing simulation precision/sampling first, then validating motion quality/perf in Playwright before further refactors.
- 2026-02-09T09:36:50Z [TOOL] [MILESTONE] Homepage dark restyle pushed to `origin/main` (commit `e373a3f`), including denser All Projects grid (smaller cards).
- 2026-02-09T11:02:55Z [CODE] Added `frontend/src/components/HeroStableFluids.jsx` and mounted it in `frontend/src/pages/Home.jsx` so the warp is clipped to the hero.
- 2026-02-09T11:09:58Z [CODE] Hero warp loop pauses when offscreen (IntersectionObserver) and respects reduced-motion for accessibility/perf.
- 2026-02-10T06:35:59Z [TOOL] Resolved severe hero-warp lag: Playwright drag benchmark improved from `avgDt~124ms` (~8fps) to `avgDt~16.7ms` (~60fps) by capping DPR, reducing sim/grid density, and lowering per-frame work.
- 2026-02-10T07:24:54Z [CODE] `frontend/src/components/HeroStableFluids.jsx` currently uses a WebGL2 ripple/shader-style simulation (chosen to better match the reference demo quality/perf than the earlier CPU/canvas approach).

[DISCOVERIES]
- 2026-02-10T08:31:14Z [CODE] `HeroStableFluids` canvas text pass was reading `getComputedStyle(...).color` first; during theme-transition mode this can be an in-between animated value, leading to stale/wrong captured text colors until a later redraw.
- 2026-02-10T08:04:37Z [CODE] Pre-refactor `resizeToContainer` only compared element width/height, so DPR-only changes (e.g., zoom/display scale changes) could skip canvas reconfiguration; fixed by including DPR in the resize guard.
- 2026-02-10T07:54:21Z [TOOL] In headless Playwright, sampling the hero WebGL canvas via `drawImage(canvas)` returned zeroed pixel data (`brightness 0`, `changedPixels 0`) even while the canvas was visibly active; rely on DOM/click/screenshot checks unless explicit WebGL readback instrumentation is added.
- 2026-02-09T10:55:33Z [TOOL] `npm install` cannot fetch uncached packages (ENOTCACHED / only-if-cached); avoid new deps or vendor them.
- 2026-02-09T11:08:02Z [TOOL] `vite build` verification can fail in this sandbox (`esbuild` `spawn EPERM` when `stdio` is piped); `npm run lint` works.
- 2026-02-09T02:15:10Z [TOOL] PowerShell `Set-Content` can default to UTF-16; prefer UTF-8 for repo text files.
- 2026-02-09T13:19:00Z [TOOL] No-op warp bug root cause: cleanup nulled sim refs and a later rerun skipped resize/config because dimensions matched; fix is to force re-init when buffers are missing.
- 2026-02-09T13:32:08Z [TOOL] White-haze artifact was driven by strong dye `screen` compositing + continuous low-motion injection; reduce dye/composite and require explicit click/tap impulse.

[OUTCOMES]
- 2026-02-10T08:31:14Z [TOOL] Fluid hero text now resolves to correct light/dark colors after theme transition completes.
- 2026-02-10T08:27:47Z [TOOL] Light/dark theme switches now animate over 0.3s across app UI properties covered by the scoped global transition rule.
- 2026-02-10T08:24:30Z [TOOL] Home hero background now responds to theme mode: light theme uses a light hero backdrop in both fluid (WebGL) and fallback (CSS-only/reduced-motion) rendering paths.
- 2026-02-10T08:12:50Z [TOOL] All Projects titles now render centered with a consistent two-line clamp, including Stop Asian Hate.
- 2026-02-10T08:09:59Z [TOOL] All Projects titles now share consistent typography behavior; long titles truncate with ellipsis instead of wrapping to a different multi-line layout.
- 2026-02-10T08:05:39Z [TOOL] Home hero copy constants are now simplified (`HERO_SUBTITLE`), and the refactor remains green on lint/build.
- 2026-02-10T08:04:37Z [TOOL] Hero ripple implementation is now leaner (single-config path, reduced duplication) with build/lint + Playwright sanity verification passing after refactor.
- 2026-02-10T07:59:14Z [TOOL] Runtime verification confirms Home hero no longer exposes fluid-quality controls in the browser while CTA row behavior remains intact.
- 2026-02-10T07:58:22Z [TOOL] Home hero no longer renders fluid quality controls; ripple hero remains active with default configuration and passes lint/build checks.
- 2026-02-10T07:54:21Z [TOOL] Hero ripple path now uses analytic ripple-point displacement and passed current validation set (Playwright interaction checks + screenshot capture + CTA click-through + `npm run lint` + `npm run build`), with no persistent grid/lattice artifact observed in the hero captures.
- 2026-02-10T06:49:42Z [TOOL] Hero warp supports runtime quality presets with persistence; Playwright validates mode switching + reload restoration; `npm run lint` passes in `frontend` (build verification is environment-dependent).
- 2026-02-10T07:24:54Z [TOOL] Compacted `.agent/CONTINUITY.md` (removed duplicates and non-ASCII garbling; kept milestones, key decisions, and constraints).




