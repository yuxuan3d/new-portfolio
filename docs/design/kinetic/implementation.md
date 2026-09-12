# Dark kinetic landing page

Implemented and verified locally on 2026-09-10. This replaces the field-notes/carousel design; it is the active direction described in the root [Plan.md](../../../Plan.md).

## Composition

One uninterrupted page moves from a typographic Particle Sea opening into immersive selected work, attributed recognition, the project index, experiments, personal introduction, capabilities and contact. The palette is near-black `#090A0B`, soft white `#F2F2EB`, acid yellow `#D6FA55`, and colors from the original artwork. Space Grotesk carries the large editorial typography; Roboto Mono supplies restrained labels.

- **Opening:** a 4.5-second Particle Sea loop from the user's supplied clip, muted and inline, behind the typography. The original Sanity image remains the fallback with its slow 18-second alternating drift. An acid-yellow asterisk rotates beside the headline, with smaller echoes near About/contact and an extra half-turn on hover. Limited scroll depth, showreel link and actual artwork destination remain. [Media source and conversion details](particle-sea-loop.md).
- **Selected work:** SIT Open House 2026 leads, followed by staggered JPMorgan SAEI and Cinder images. The five existing CSSDA/FWA awards are explicitly associated with SIT. Project titles, image records and destinations come from Sanity. Contribution summaries reuse the existing editorial content grounded in the saved Sanity descriptions.
- **Project index:** all 13 published projects remain accessible inline; discipline filters preserve their normalization and reviewed counts. Each row includes a lazy-loaded original Sanity thumbnail beside its title (80×56px on desktop, 56×44px on phones), requesting at most a 160px-wide asset. Thumbnails share the existing project link, reserve their dimensions and retain a compact unavailable-image fallback.
- **Experiments:** the published Shophouse Generator post and Dune sand project retain their exact destinations. Copy around these entries is an editorial paraphrase of the existing portfolio descriptions and the user's new creative brief.
- **About/contact:** existing capability/tool content is presented through native disclosures. Resume, showreel, email and social URLs are unchanged. The validated contact form is revealed on demand.

## Behavior and implementation

The active files are `frontend/src/pages/Home.jsx`, `frontend/src/components/home/KineticLanding.jsx` and `kinetic.css`. Header, shared theme, navigation labels and the existing font stylesheet also changed. No package dependencies were added, and Sanity/production were not modified.

Scrolling stays native. Reveals are progressive enhancements; keyboard focus and reduced motion keep content readable. Hero video is only mounted while onscreen and allowed: hidden documents, project overlays, reduced motion and data saving restore the Sanity still. Failed or blocked autoplay leaves the still visible. Asterisks and the typographic ribbon pause offscreen, for hidden documents, overlays and reduced motion. Project images respond to hover/focus; links and disclosures remain usable on touch screens.

Project overlays retain focus trapping, restoration, inert background and route-backed URLs. Existing standalone project, R&D and contact routes remain accessible. Static metadata and sitemap generation are preserved. The retired carousel/contour components remain inactive and are not included in the new homepage bundle.

The longer page exposed an existing anchor-alignment assumption: an 800ms fallback interrupted native smooth scrolling before its last frame and left an approximately 15px offset. The fallback now allows 1800ms, with normal completion still handled by `scrollend`. Reduced-motion navigation uses immediate positioning. Repeated history/navigation checks pass after the fix.

## Verification

All checks used the existing Playwright 1.58.1 Docker Compose container.

| Check | Result |
| --- | --- |
| ESLint | Passed, no warnings |
| Unit tests | 14 passed |
| Browser regression tests | 19 passed after the video/asterisk update |
| Full production build | Passed; 16 route HTML shells and 17 sitemap routes |
| Responsive geometry | Passed at 1440×900, 1280×800, 768×1024, 390×844, 320×740 and 640×400 |
| Live Sanity production preview | One H1, no page errors, no broken images and no horizontal overflow on laptop/phone |
| Keyboard/interaction coverage | Overlay focus, mobile menu, capabilities, contact validation, project filters and history/hash navigation passed |
| Failure/motion coverage | Missing content, blocked imagery/telemetry, reduced motion and offscreen/overlay suspension passed |

The latest production observation was recorded at `2026-09-10T14:59:40.318Z`. Laptop and phone video played muted, inline and looping at 720×900; the repeat boundary was exercised. Motion frame intervals were approximately 16.7ms median / 16.7–16.8ms p95. Observed local LCP was 296ms / 248ms and CLS 0.0175 / 0. These are unthrottled container lab observations, not physical-device or field Web Vitals/INP claims. [Raw observations](report.json).

`frontend/scripts/verifyKinetic.mjs` serves the built bundle through the existing CMS-authorized localhost origin, blocks telemetry/contact requests, checks artwork loading and saves captures under ignored `frontend/artifacts/kinetic/`. `verifyOverhaul.mjs` remains historical and targets the retired carousel.

## Final captures

### Project detail refinement

Individual project overlays and their standalone routes now use the same continuous near-black editorial surface as the landing page. Removed the shared rounded-panel treatment, padded image frames, pill tags/tools, shadows and the empty video placeholder. A sticky close bar, large Space Grotesk title, slash-separated metadata, broad project image, open overview/technology layout, borderless videos/gallery and simple project navigation replace the old card islands.

Original descriptions, tools, galleries, embed-provider restrictions, destinations and dialog focus behavior are preserved. The opening image reuses the homepage's existing Sanity media selection and responsive image component; landscape SIT/JPMorgan images and square/portrait sources retain their original proportions. Loading/error states also use the flat surface.

Overlay next/previous links replace the active history entry while retaining the original background location. Repeated project browsing therefore exits with one Close, Escape or browser Back rather than stepping through previous popups. Each project change resets the popup to the top and focuses Close without losing the original landing-page focus target. Normal standalone project navigation retains browser history.

The popup's yxperiments identity is now a home link that replaces the popup entry. Main-header and mobile-drawer branding also target `/#home`, returning to the homepage opening even when the user has scrolled down without changing the URL. Lint/full build and five focused regressions passed, including repeated bidirectional paging, history length, one-step closing/Back, focus restoration, home links and metadata.

Verification: lint and full build passed; five focused browser regressions passed for overlays/focus, pager/legacy routes, metadata, missing routes and blocked content. Live Sanity checks at 1440px, 390px and 320px confirmed no page errors, no horizontal overflow, no rounded content surfaces and a reachable sticky close control after scrolling. These checks cover layout and embed rendering structure, not video playback.

- [Project overlay on desktop](project-desktop.png)
- [Project overlay on phone](project-phone.png)
- [Project overview](project-overview.png)

- [Laptop opening](laptop-hero.png)
- [Complete laptop page](laptop-full.png)
- [Phone opening](phone-hero.png)
- [Complete phone page](phone-full.png)

The local development preview remains available at [localhost:5173](http://localhost:5173). No deployment, commit, CMS mutation, frontend dependency or ParticleEarth changes were performed for this redesign. FFmpeg was installed only inside the existing container for the requested media conversion. Cinder's original 350px image is intentionally displayed at larger sizes and retains its source-resolution limitation.
