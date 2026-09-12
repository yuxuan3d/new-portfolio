# Portfolio overhaul — implementation verification

Latest QC pass 2026-09-10: [visual refinement verification](field-notes/qc-refinement.md) supersedes the prior recognition, media-fit and motion behavior. The contour surface now animates at phone/tablet widths too.

Latest 2026-09-10: the approved charcoal/ember field-notes revision is implemented and verified. [Current implementation, responsive geometry and browser captures](field-notes/implementation.md) supersede this report's earlier palette, contour count, timing and hero geometry. Lint/build, 14 unit and 21 browser tests pass, with final process-image fixes rechecked separately.

Completed locally: 2026-09-09. Branch: `codex/portfolio-overhaul-plan`.
The approved Plan.md/v4 direction is implemented in the existing React18/Vite/styled-components frontend. No Sanity mutations, deployment, dependency upgrade or ParticleEarth rebuild was performed.

## What changed

### Latest QC: contour water

User rejected simulated water and requested a contour interpretation. Replaced the WebGL renderer with26 unfilled SVG lines in one full-width surface. Two slowly drifting layers retain motion suspension/static states and scene colour; there are no image/award reflections or texture requests. Build, lint and all9 gallery browser checks pass. Saved [laptop](contour-water-laptop.png) and [phone](contour-water-phone.png) screenshots were visually reviewed. Broader [three design directions](three-design-directions.md) are research proposals, not additional implemented redesigns. Earlier reflection requirements/measurements below are historical.

### Latest approved revision: immersive project-led opening

The [immersive specification](immersive-hero.md) supersedes the smaller v4 layout and earlier water dimensions below. Original Sanity image references and project destinations are preserved.

- Enlarged desktop stage to938.67×528 at1280×800, removed the generic headline, integrated condensed project titles/roles/actions, added real thumbnail selectors and right-edge arrows. Phone uses350×364 with an integrated title/action, separate arrow row and equal thumbnails. Cinder uses one larger contained portrait; original clips remain unavailable.
- Teal/amber/plum atmosphere follows selection. A single32px/26px-offset water plane has190px/180px depth, subdued image-only reflections and crest lighting. Reflections dissolve during panel travel and refresh on settling; no per-frame geometry/texture upload. Numbered labels and display headings continue through the lower sections.
- Performance finding: the large frame's animated border colour repeatedly produced33.3ms p95 switching intervals in the local lab. Keeping its rim steady and compositing the atmosphere fade reduced the final sample to16.8ms laptop/16.7ms phone. This is an observation from container Chromium, not a device/field guarantee.
- Lint,14 unit checks and the18-test browser suite pass. Final build produces16 route shells and17 sitemap routes. Geometry checks now verify contained titles/actions,44px controls, no overflow and recognition below the cue across seven sizes, rather than enforcing the superseded first-fold budget. Responsive/image-failure cases were repeated after the final source-sizing adjustment.
- [Laptop capture](immersive-hero-laptop.png), [phone capture](immersive-hero-phone.png), [Cinder phone](immersive-hero-cinder-phone.png), [JPMorgan phone](immersive-hero-jpmorgan-phone.png), [production metrics](production-metrics-immersive-2026-09-09.json). Last measured LCP268/216ms, CLS0.0021/0, poster41,566/61,377 bytes, no runtime errors or horizontal overflow. Captures/metrics precede only an equivalent measured-phone adaptive-size expression and the missing-preferred-image containment fix; final build and affected browser checks cover those changes.
- No source copying, new runtime package, CMS mutation or deployment. Safari/physical Android, field performance and owned motion loops remain the same release/media follow-ups.

### Latest QC: one cinematic water plane and smoother switching

This supersedes the separate SVG reflection strips and Pause effects control described in the earlier baseline below.

- One viewport-wide water canvas sits beneath all project panels, with a shared horizon and28px desktop/22px phone air gap. It shades broad waves, surface-normal crest highlights, softened image-only reflections and a dark spatial fade. Desktop depth132px; phone128px. No awards or interface text is reflected.
- Native WebGL adds no dependency. The reflection texture contains only displayed project image pixels. Its optional CORS loads cannot break the original posters. Missing/lost WebGL leaves the shared gradient usable.
- Stable mounted panels use620ms eased transitions. The wrapping companion fades before moving to the opposite side; phone panels crossfade. Wave progression freezes during switching while reflection positions follow the panels. Removed Pause effects; reduced motion, data saving, phone, offscreen, tab and overlay suspension remain.
- Final lint/build and14 unit tests pass. The17-test browser suite passed, followed by the added WebGL-unavailable fallback test (18 checks total). Coverage includes one full-width plane, image/water gap, visible motion, settled reduced-motion pixels, persistent panels, rapid switching and retained blocker regression.
- [Current laptop](shared-water-laptop.png), [current phone](shared-water-phone.png), [current production metrics](production-metrics-shared-water-2026-09-09.json). Final local p95 frame intervals were16.8ms with waves and during project switching on both profiles; no page errors or horizontal overflow. Lab LCP244/216ms and CLS0.0055/0. An earlier cold-source run recorded laptop LCP4.8s; these variable local/CDN samples are not field performance guarantees. Real-device/Safari checks remain outstanding.
- The browser suite now uses the existing Sanity-authorized localhost:5173 origin. No remote CORS settings, CMS data or deployment changed.

### Same-day QC follow-up: visible ripples and Chrome blockers

- Chrome's reported `ERR_BLOCKED_BY_CLIENT` affected a statically required analytics module. Tracking now loads through a caught optional import; Vercel analytics is also optional. Original tracking URLs remain blockable, and blocked tracking does not prevent rendering or project navigation.
- Water now uses animated SVG distortion and curved surface highlights with 6–8 second cycles. Desktop opacity is 48%; phone opacity is 34% with static distortion. Pausing, reduced motion, visibility and overlay suspension also stop the SVG timeline.
- Lint, full production build, 14 unit tests and 16 browser tests pass. New regressions block analytics imports and verify that water pixels change over time and its timeline stops/resumes correctly.
- Updated [laptop](ripples-laptop.png), [phone](ripples-phone.png) and [production measurements](production-metrics-ripples-2026-09-09.json): no page errors or horizontal overflow; laptop p95 frame interval 16.7ms on/paused. These remain unthrottled container lab observations, not device or field performance claims. The earlier measurements and captures below are preserved as the initial implementation baseline.

### Initial implementation

- Opening gallery uses SIT → JPMorgan SAEI → Cinder, resolved by stable Sanity document and asset references. The selected poster loads before neighboring media and water enhancements. Source dimensions cap requests; the JPMorgan preview uses the reviewed rectangle and Cinder uses contained175px/200px portrait/capture images (140px on phones).
- Pointer drag, previous/next, named selectors, keyboard arrows, visible project action, pause effects, static phone/reduced-motion/data-saving states and offscreen/tab/overlay suspension are implemented. The gallery does not auto-advance or intercept vertical wheel scrolling.
- Water mirrors project images only, with a120px desktop/80px phone fade. It adds no layout height. Captions, controls, navigation and recognition are never reflected. The dark gradient continues across sections.
- Recognition is permanently attributed to SIT, followed by three selected projects, an expandable/filterable archive, concise About and inline contact disclosure. The work-grid JPMorgan preview also uses the reviewed clean crop. Resume, showreel, social links, contact validation and project routes remain intact.
- Project overlays now trap keyboard focus, make the background inert, and return focus to the trigger on close. Gallery selection, archive state and scroll survive overlay visits.
- Frontend container workflow supplies Node and Chromium without host installs. Polling enables reliable Vite updates on the Windows mount.
- Static metadata generation allows only the reviewed `e66165bf-e44e-489e-b0f3-bda746df25e0 / dune sand` and `1401b46f-3ed1-4f58-8700-9a3ae726ef17 / NUHS` legacy pairs. Other malformed slugs, unsafe routes and duplicate outputs still fail. The encoded URL and decoded output directory agree.

## Verification
- `npm run lint`: passed.
- `npm run test:unit`:14 passed, including source selection/fallback, ordering/deduplication, route preservation and rejection cases.
- `npm run test:e2e`:14 passed. Covers gallery inputs and cancellation, state/focus restoration, filters and exact destinations, contact invalid-submit handling, hash alignment, mobile menu and metadata. The final expanded geometry case also passed separately.
- Viewports:320×740,390×844,768×1024,1280×800,1440×900,844×390 short landscape, and640×400 (CSS layout equivalent to a1280×800 browser at200% zoom). Short views use natural scrolling; no horizontal page overflow or targets below44×44px.
- `npm run build`: passed against live, read-only Sanity content;16 detail/static route shells and17 sitemap entries. Both preserved legacy shell paths/canonical URLs were inspected.
- `npm run design-audit`: 24 live-content route/viewport captures, with telemetry/contact endpoints intercepted and zero horizontal overflow. The [final report](design-audit-2026-09-09.json) and full-page capture are saved alongside this file. The desktop R&D post capture recorded no H1 during loading; it is not evidence of the loaded heading state. Other viewport captures and the separate R&D navigation/metadata regression cover the loaded route.
- `node scripts/verifyOverhaul.mjs`: built-bundle laptop/phone measurements with real Sanity images. No page errors in either measured profile.

## Measured opening layout
From [production metrics](production-metrics-2026-09-09.json), collected2026-09-09T03:43:33.303Z:

| Measurement | Laptop1280×800 | Phone390×844,2× density |
| --- | --- | --- |
| Active media |672×378 |350×196.875 |
| Scroll cue bottom |747px |693.875px |
| Recognition starts |779px |733.875px |
| Selected poster |22,226 bytes,AVIF |22,226 bytes,AVIF |
| Observed lab LCP |304ms |208ms |
| Observed layout shift |0.0052 |0 |
| Effects-on p95 frame interval |16.7ms |16.8ms (static phone treatment) |
| Paused p95 frame interval |16.8ms |16.8ms |

Measurements use container Chromium, the production bundle, an unthrottled local machine/network and Sanity/CDN responses. They are **not field Core Web Vitals, real-device performance, GPU render-time measurements or an INP result**. Production assets were routed through the existing Sanity-authorized localhost:5173 origin in the test browser; the dev server stayed available. No CORS settings were changed.

The isolated minified gallery plus local helpers is approximately6,712 gzip bytes, excluding shared packages. This is an estimate, not an actual before/after production chunk delta. The full current application entry chunk is23.87kB gzip.

## QC captures
- [Actual laptop opening](implemented-laptop.png)
- [Actual phone opening](implemented-phone.png)
- [Actual full homepage](implemented-homepage.png)
- [Original design resolution](hero-resolution.md)

Generated concepts are preserved as design history. Production renders the original Sanity assets, not generated substitutions or rasterized interface text.

## Remaining release checks
- Deployment was not requested. Verify preserved legacy paths, headers/CSP and metadata on a Vercel preview before publishing.
- Physical Safari/iOS and lower-power Android checks, throttled mobile testing and field INP/Core Web Vitals remain release follow-ups. Phone water is already static.
- Original video loops remain optional; no YouTube downloads or automatic video embeds were added.
- Existing unrelated dirty source and submodule state remains preserved. No commit or push was requested.
