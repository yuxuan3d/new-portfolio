[PLANS]
- 2026-02-09T03:28:23Z [USER] Replace the hero heading’s cutesy type feel with a more professional font treatment while preserving visual impact.
- 2026-02-09T03:25:04Z [USER] Remove the secondary hero line and make "Hi, I'm Yu Xuan" the dominant large headline.
- 2026-02-09T03:17:56Z [USER] Increase hero kicker prominence and reduce the hero headline size; use gradient-text styling for the colored greeting.
- 2026-02-09T03:08:34Z [USER] Improve the header brand lockup so the tagline no longer awkwardly sticks out under the site name.
- 2026-02-09T03:00:48Z [USER] Apply a classier font to the site name and remove uppercase styling for the name.
- 2026-02-09T02:43:58Z [USER] Remove the All Projects metadata line that reads 'Showing 8 of 8'.
- 2026-02-09T02:41:14Z [USER] Restore prior footer layout but keep rounded button/chip text vertically centered.
- 2026-02-09T02:38:45Z [USER] Center the footer brand-card arrangement and resume button alignment.
- 2026-02-09T02:36:38Z [USER] Remove the hero decorative circle entirely after repositioning did not match desired look.
- 2026-02-09T02:34:00Z [USER] Move the hero decorative background circle from bottom-left to bottom-right.
- 2026-02-09T02:32:47Z [USER] Remove hero metrics row (Projects/Featured/Top Tags) from homepage because it is not useful for portfolio storytelling.
- 2026-02-09T02:29:14Z [USER] Use frontend-design skill to review and further improve the website UI/UX.
- 2026-02-09T02:29:14Z [TOOL] Apply a cohesive shared-style refinement pass (global typography/atmosphere, header/footer hierarchy, about-page information flow), then verify with lint/build and Playwright.

[DECISIONS]
- 2026-02-09T03:28:23Z [TOOL] Override the hero `h1` font family to `Red Hat Display` (sans) instead of Fraunces serif; retain gradient text with cooler blue-cyan stops.
- 2026-02-09T03:25:04Z [TOOL] Promote the hero kicker to the primary heading and remove the separate hero title node to simplify focus hierarchy.
- 2026-02-09T03:17:56Z [TOOL] Apply gradient-text via background-clip for the hero kicker; keep a solid accent-color fallback for non-supporting browsers.
- 2026-02-09T03:08:34Z [TOOL] Move the header tagline to sit inline with the logo pill (desktop only) and remove forced uppercase styling for a more intentional brand lockup.
- 2026-02-09T03:00:48Z [USER] Brand name should use serif styling and natural lowercase presentation in both header and footer.
- 2026-02-09T02:43:58Z [USER] Keep the All Projects section subtitle and filter controls, but remove the count summary text row.
- 2026-02-09T02:41:14Z [USER] Revert footer brand card from centered layout to previous alignment while preserving improved vertical text centering in rounded controls.
- 2026-02-09T02:38:45Z [USER] Footer brand panel should use centered content alignment for text, chips, and CTA.
- 2026-02-09T02:36:38Z [USER] Eliminate the hero background circle instead of repositioning it.
- 2026-02-09T02:34:00Z [USER] Keep the hero ornament but reposition it to the bottom-right for better visual balance.
- 2026-02-09T02:32:47Z [USER] Keep Home hero focused on positioning + CTA only; remove numeric summary cards.
- 2026-02-09T01:32:33Z [TOOL] SUPERSEDED: Prior local test URL http://localhost:4173/ is replaced by user-confirmed http://localhost:5173/.
- 2026-02-09T02:10:04Z [USER] Use Playwright against http://localhost:5173/ as authoritative local runtime.
- 2026-02-09T02:16:51Z [TOOL] Previous redesign iteration completed and verified.
- 2026-02-09T02:29:14Z [TOOL] frontend-design skill is available at C:/Users/USER/.codex/skills/frontend-design/SKILL.md and was used for this pass.
- 2026-02-09T02:29:14Z [TOOL] Keep data-fetch/query logic unchanged; focus this pass on visual hierarchy, typography, navigation clarity, and content scannability.

[PROGRESS]
- 2026-02-09T03:28:23Z [TOOL] Playwright confirmed hero `h1` now computes as `Red Hat Display`, weight 800, with updated blue-cyan gradient; `npm run lint` and `npm run build` both pass.
- 2026-02-09T03:28:23Z [CODE] Updated `frontend/src/pages/Home.jsx` `Kicker`: added explicit sans-serif family and tuned letter-spacing/line-height + gradient stops for a more professional tone.
- 2026-02-09T03:25:52Z [TOOL] Ran `npm run lint` and `npm run build` in `frontend` after single-line hero heading change (pass).
- 2026-02-09T03:25:52Z [TOOL] Playwright check confirms `h1` text is `Hi, I'm Yu Xuan` (~82px at 1280px viewport) and legacy headline text no longer renders.
- 2026-02-09T03:25:04Z [CODE] Updated `frontend/src/pages/Home.jsx`: removed `HERO_COPY.title` and `<HeroTitle>` render; converted `Kicker` to large `h1` with tighter display spacing.
- 2026-02-09T03:19:34Z [TOOL] Playwright verified hero typography swap: kicker renders larger with gradient background-clip text; H1 renders smaller than previous clamp.
- 2026-02-09T03:20:45Z [TOOL] Playwright verified dark theme: hero kicker gradient starts from dark-mode accent color after toggling theme.
- 2026-02-09T03:20:01Z [TOOL] Ran `npm run lint` and `npm run build` in `frontend` after hero typography update (pass).
- 2026-02-09T03:17:56Z [CODE] Updated `frontend/src/pages/Home.jsx` hero typography: increased kicker size and removed uppercase/overline spacing; reduced H1 clamp range; added gradient-text technique to kicker.
- 2026-02-09T03:11:39Z [TOOL] Ran `npm run lint` and `npm run build` in `frontend` after header brand lockup update (pass).
- 2026-02-09T03:10:46Z [TOOL] Verified in Playwright (1200px viewport) that the header tagline now sits inline to the right of the logo pill (no stacked layout).
- 2026-02-09T03:08:34Z [CODE] Updated `frontend/src/components/SiteHeader.jsx` BrandCluster/BrandTag styles: switched to inline flex lockup with separator dot, sentence-case tagline, and softened spacing/opacity.
- 2026-02-09T03:02:16Z [TOOL] Used Playwright on `http://localhost:5173/`; snapshot confirms header link text and footer brand text both render as `yxperiments`.
- 2026-02-09T03:01:33Z [TOOL] Re-verified `frontend/src/components/SiteHeader.jsx` and `frontend/src/components/SiteFooter.jsx` contain serif `Fraunces` brand styling with `text-transform: none`; no further code edits required for current request.
- 2026-02-09T03:00:48Z [TOOL] Ran npm run build in frontend after brand typography update (pass).
- 2026-02-09T03:00:48Z [TOOL] Ran npm run lint in frontend after brand typography update (pass).
- 2026-02-09T03:00:48Z [CODE] Updated frontend/src/components/SiteFooter.jsx BrandName style to Fraunces with text-transform none and refined sizing/letter spacing.
- 2026-02-09T03:00:48Z [CODE] Updated frontend/src/components/SiteHeader.jsx Logo style to Fraunces with text-transform none and refined sizing/letter spacing.
- 2026-02-09T02:43:58Z [TOOL] Rechecked homepage in Playwright; 'Showing 8 of 8' is no longer present.
- 2026-02-09T02:43:58Z [TOOL] Ran npm run build in frontend after removing All Projects count summary (pass).
- 2026-02-09T02:43:58Z [TOOL] Ran npm run lint in frontend after removing All Projects count summary (pass).
- 2026-02-09T02:43:58Z [CODE] Removed SectionMeta render block and deleted unused SectionMeta styled component from frontend/src/pages/Home.jsx.
- 2026-02-09T02:41:14Z [TOOL] Reloaded homepage in Playwright on http://localhost:5173/ after footer changes.
- 2026-02-09T02:41:14Z [TOOL] Ran npm run build in frontend after footer layout revert + button text centering (pass).
- 2026-02-09T02:41:14Z [TOOL] Ran npm run lint in frontend after footer layout revert + button text centering (pass).
- 2026-02-09T02:41:14Z [CODE] Updated frontend/src/components/SiteFooter.jsx: removed centered panel alignment; added align-items/justify-content/line-height adjustments to MetaChip and ResumeLink for vertical text centering.
- 2026-02-09T02:38:45Z [TOOL] Reloaded homepage in Playwright on http://localhost:5173/ after footer alignment update.
- 2026-02-09T02:38:45Z [TOOL] Ran npm run build in frontend after footer alignment update (pass).
- 2026-02-09T02:38:45Z [TOOL] Ran npm run lint in frontend after footer alignment update (pass).
- 2026-02-09T02:38:45Z [CODE] Updated frontend/src/components/SiteFooter.jsx: set BrandPanel justify-items/text-align to center, centered BrandText, and centered MetaRow chips.
- 2026-02-09T02:36:38Z [TOOL] Ran npm run build in frontend after removing hero ornament (pass).
- 2026-02-09T02:36:38Z [TOOL] Ran npm run lint in frontend after removing hero ornament (pass).
- 2026-02-09T02:36:38Z [CODE] Removed Hero decorative &::before pseudo-element from frontend/src/pages/Home.jsx.
- 2026-02-09T02:34:00Z [TOOL] Reopened homepage with Playwright on http://localhost:5173/ to confirm runtime stability after the style change.
- 2026-02-09T02:34:00Z [TOOL] Ran npm run build in frontend after hero ornament reposition (pass).
- 2026-02-09T02:34:00Z [TOOL] Ran npm run lint in frontend after hero ornament reposition (pass).
- 2026-02-09T02:34:00Z [CODE] Updated `frontend/src/pages/Home.jsx` hero `&::before` inset from `auto auto -120px -130px` to `auto -130px -120px auto` to move the decorative circle to bottom-right.
- 2026-02-09T02:32:47Z [CODE] Removed Home hero metrics JSX and related styled components/constant from frontend/src/pages/Home.jsx.
- 2026-02-09T02:32:47Z [TOOL] Ran npm run lint in frontend after metrics removal (pass).
- 2026-02-09T02:32:47Z [TOOL] Ran npm run build in frontend after metrics removal (pass).
- 2026-02-09T02:32:47Z [TOOL] Rechecked homepage in Playwright; hero now transitions from availability pill directly to CTA buttons with no numeric metrics row.
- 2026-02-09T02:16:51Z [MILESTONE] Completed first UI refresh pass (Home/Contact/R&D loading + hierarchy) with lint/build and Playwright checks.
- 2026-02-09T02:29:14Z [TOOL] Re-audited /, /about, /contact, /rnd with Playwright and identified opportunities for stronger shared visual identity.
- 2026-02-09T02:29:14Z [CODE] Updated frontend/src/App.jsx with new global typography stack, atmospheric background layering, consistent focus styling, and page-enter motion.
- 2026-02-09T02:29:14Z [CODE] Updated frontend/index.html to load Fraunces + Red Hat Display fonts via <link> instead of CSS @import.
- 2026-02-09T02:29:14Z [CODE] Updated frontend/src/components/SiteHeader.jsx with brand cluster/tagline, refined desktop nav affordances, and tighter control spacing.
- 2026-02-09T02:29:14Z [CODE] Updated frontend/src/components/SiteFooter.jsx with meta chips and enhanced visual depth/structure.
- 2026-02-09T02:29:14Z [CODE] Updated frontend/src/components/About.jsx with a 3-step workflow strip to improve narrative flow before detailed skill cards.
- 2026-02-09T02:29:14Z [TOOL] Revalidated desktop and mobile routes with Playwright, including mobile menu behavior.
- 2026-02-09T02:29:14Z [TOOL] Ran npm run lint in frontend (pass).
- 2026-02-09T02:29:14Z [TOOL] Ran npm run build in frontend (pass).

[DISCOVERIES]
- 2026-02-09T03:28:23Z [TOOL] The cutesy feel came from inherited Fraunces serif on `h1`; a local hero override to `Red Hat Display` changes tone without affecting other headings.
- 2026-02-09T03:25:52Z [TOOL] Converting the kicker to `h1` preserves semantic primary heading while simplifying layout by removing the extra hero title block.
- 2026-02-09T03:10:46Z [TOOL] Playwright bounding boxes confirm the tagline aligns on the same row as the logo pill, eliminating the prior “subtitle sticking out below” effect.
- 2026-02-09T03:02:16Z [TOOL] Live runtime at `http://localhost:5173/` matches source-level typography adjustments for the brand name in both header and footer.
- 2026-02-09T03:01:33Z [TOOL] Additional uppercase text remains intentional on non-name elements (e.g., taglines); brand name itself is already lowercase by string and CSS transform rules.
- 2026-02-09T03:00:48Z [TOOL] Header and footer previously appeared all-caps due to CSS text-transform, not string casing; changing style preserved existing brand text content.
- 2026-02-09T02:43:58Z [TOOL] Count summary removal is isolated to Home section heading and does not affect project filter behavior.
- 2026-02-09T02:41:14Z [TOOL] Vertical text alignment issue was caused by inherited body line-height; explicit inline-flex centering + line-height on chips/button fixes it without affecting overall footer layout.
- 2026-02-09T02:38:45Z [TOOL] Centering the footer layout required only local BrandPanel/MetaRow alignment changes; no grid column changes were needed.
- 2026-02-09T02:36:38Z [TOOL] The requested result is achieved by deleting only Hero::before; no additional spacing or layout adjustments were required.
- 2026-02-09T02:34:00Z [TOOL] Repositioning only the pseudo-element inset achieved the requested visual move without needing layout or spacing changes.
- 2026-02-09T02:32:47Z [TOOL] Hero remains visually balanced after removing metrics because availability pill and CTA row preserve spacing hierarchy.
- 2026-02-09T02:10:04Z [TOOL] Initial homepage and R&D snapshots showed loading placeholders before content arrived, indicating delayed/intermittent content availability.
- 2026-02-09T02:15:10Z [TOOL] PowerShell Set-Content defaults can introduce UTF-16; UTF-8 encoding must be enforced for patch compatibility.
- 2026-02-09T02:29:14Z [TOOL] styled-components warns against @import in createGlobalStyle; moving font loading to index.html removes the warning source.
- 2026-02-09T02:29:14Z [TOOL] A transient HMR runtime error appeared after mid-edit refresh; full browser restart/reload cleared stale module state.

[OUTCOMES]
- 2026-02-09T03:28:23Z [TOOL] Hero heading now reads more professional while keeping the large single-line focus and gradient identity.
- 2026-02-09T03:25:52Z [TOOL] Homepage hero now uses one dominant line (`Hi, I'm Yu Xuan`) with the secondary line removed, matching the requested cleaner visual focus.
- 2026-02-09T03:10:46Z [TOOL] Header brand lockup improved: tagline no longer sits below and “sticks out” from the site name on desktop.
- 2026-02-09T03:02:16Z [TOOL] Browser-level check passed: classier lowercase brand name presentation is visible on the running site.
- 2026-02-09T03:01:33Z [TOOL] Post-change verification complete: classier lowercase website name remains correctly applied in both header and footer.
- 2026-02-09T03:00:48Z [TOOL] Requested typography update completed: website name now uses a classier serif face and no forced caps.
- 2026-02-09T02:43:58Z [TOOL] Requested text removal completed: All Projects no longer displays the 'Showing 8 of 8' line.
- 2026-02-09T02:41:14Z [TOOL] Footer returned to prior layout and rounded button/chip text now aligns vertically as requested.
- 2026-02-09T02:38:45Z [TOOL] Requested footer UI fix completed: brand-card button and related elements are now centered.
- 2026-02-09T02:36:38Z [TOOL] Requested visual simplification completed: hero decorative circle removed.
- 2026-02-09T02:34:00Z [TOOL] Requested change completed: hero background circle now anchors to the bottom-right.
- 2026-02-09T02:32:47Z [TOOL] Requested simplification applied: Projects/Featured/Top Tags cards no longer render on the homepage hero.
- 2026-02-09T02:29:14Z [TOOL] Completed second UI/UX refinement pass using frontend-design skill principles with verified improvements to shared visual cohesion, navigation readability, and About-page content flow.







