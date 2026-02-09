[PLANS]
- 2026-02-09T07:39:53Z [USER] Change the Yu Xuan heading gradient to a clear left-to-right flow instead of center-weighted styling.
- 2026-02-09T07:35:20Z [USER] Reapply the hero gradient styling to the Yu Xuan segment within the Hi, I''m Yu Xuan heading.
- 2026-02-09T07:27:54Z [USER] Make dark mode the default theme on first load.
- 2026-02-09T07:19:08Z [USER] Darken header and footer surfaces so they read below content-card brightness in dark mode.
- 2026-02-09T07:08:51Z [USER] Make dark mode background even darker because current blue still feels too bright for dark mode.
- 2026-02-09T07:04:35Z [USER] Change dark mode from green-leaning to dark blue for a more professional portfolio look.
- 2026-02-09T06:58:22Z [USER] Improve readability by removing cyan text emphasis, map primary to `View Resume`, secondary to `Contact`, and remove redundant `View Project` text.
- 2026-02-09T06:51:56Z [USER] Replace prior single-role palette mapping with a new two-palette system: first swatch set for light mode, second swatch set for dark mode.
- 2026-02-09T06:41:50Z [USER] Correct the palette by assigning each swatch to its stated role (Background/Text/Accent1/Accent2/Button), since prior mapping still felt wrong.
- 2026-02-09T06:37:25Z [USER] Recolor the website using the provided 5-color palette (#2C2C2C, #E4E4E4, #A8DADC, #FFC1CC, #B39CD0) while preserving intentional frontend-design quality.
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
- 2026-02-09T07:39:53Z [TOOL] Simplified name highlight gradient to a 2-stop horizontal blend (90deg) from accent to accentAlt for explicit left-to-right directionality.
- 2026-02-09T07:35:20Z [TOOL] Apply gradient treatment only to the name substring via a dedicated span so the Hi, I''m prefix stays plain for readability.
- 2026-02-09T07:27:54Z [TOOL] Keep persisted user preference behavior, but change first-run fallback to dark mode when no saved theme exists.
- 2026-02-09T07:19:08Z [TOOL] Added dedicated chrome tokens for page chrome and mapped header/footer wrappers/panels to those tokens so dark-mode shell surfaces can be tuned independently from content cards.
- 2026-02-09T07:08:51Z [TOOL] Refined dark mode to a deeper navy base and reduced dark-mode atmospheric glow intensity instead of changing CTA role colors.
- 2026-02-09T07:04:35Z [TOOL] SUPERSEDED dark-mode green-biased bases (#001815 family) with navy-blue bases while preserving established CTA role mapping and light-mode tokens.
- 2026-02-09T06:58:22Z [TOOL] For readability, avoid accent-colored text in hero/spotlight metadata; reserve Primary/Secondary mainly for CTA fills and subtle surfaces.
- 2026-02-09T06:51:56Z [TOOL] SUPERSEDED: prior exact-hex role mapping is replaced by user-specified mode-specific swatches (light and dark each have distinct Text/Background/Primary/Secondary/Accent colors).
- 2026-02-09T06:51:56Z [TOOL] Keep token semantics stable (`accent`=Primary, `accentAlt`=Secondary, `button.background`=Accent) while swapping each mode’s color values to the new visual reference.
- 2026-02-09T06:37:25Z [TOOL] Use the supplied swatches as core theme tokens for both light and dark modes; keep component styling untouched where it already consumes theme variables.
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
- 2026-02-09T07:39:53Z [CODE] Updated frontend/src/pages/Home.jsx KickerHighlight gradient from angled 3-stop to horizontal 2-stop (linear-gradient(90deg, accent -> accentAlt)).
- 2026-02-09T07:39:53Z [TOOL] Ran npm run lint and npm run build in frontend after gradient direction update (pass).
- 2026-02-09T07:39:53Z [TOOL] Playwright confirmed computed style on main h1 span is linear-gradient(90deg, rgb(59, 197, 194) 0%, rgb(46, 99, 183) 100%) with text clipping active.
pm run lint and 
pm run build in rontend after gradient direction update (pass).
- 2026-02-09T07:35:20Z [CODE] Updated frontend/src/pages/Home.jsx hero heading markup to wrap Yu Xuan in a dedicated span and added KickerHighlight gradient text style using background-clip.
- 2026-02-09T07:35:20Z [TOOL] Ran npm run lint and npm run build in frontend after hero gradient update (pass).
- 2026-02-09T07:35:20Z [TOOL] Playwright check on http://localhost:5173/ confirmed span text Yu Xuan has linear-gradient background, text clip, and transparent text fill while the rest of the heading remains normal.
- 2026-02-09T07:27:54Z [CODE] Updated frontend/src/context/ThemeContext.jsx initializer to default isDarkMode to true when localStorage has no saved theme.
- 2026-02-09T07:27:54Z [TOOL] Ran npm run lint and npm run build in frontend after default-theme update (pass).
- 2026-02-09T07:27:54Z [TOOL] Playwright verification with localStorage theme key removed confirmed fresh load starts in dark mode (theme toggle shows Switch to light theme).
- 2026-02-09T07:19:08Z [CODE] Updated frontend/src/styles/theme.js with chrome/chromeAlt/chromeStrong tokens; dark chromeStrong set to #0A1932 after contrast verification.
- 2026-02-09T07:19:08Z [CODE] Updated frontend/src/components/SiteHeader.jsx backgrounds (HeaderWrapper, HeaderInner) to use chrome tokens.
- 2026-02-09T07:19:08Z [CODE] Updated frontend/src/components/SiteFooter.jsx backgrounds (FooterWrapper, BrandPanel, LinkColumn) to use chrome tokens.
- 2026-02-09T07:19:08Z [TOOL] Ran npm run lint and npm run build in frontend after header/footer darkening pass (pass).
- 2026-02-09T07:19:08Z [TOOL] Playwright dark-mode check at http://localhost:5173/ confirmed header/footer luminance is below project-card luminance (header 0.007476, footer panel 0.009901, cards 0.011657/0.012424).
- 2026-02-09T07:08:51Z [CODE] Updated `frontend/src/styles/theme.js` dark tokens again: base moved to `#060C1A`, background glows lowered (`backgroundAccentA/B`), and dark surfaces/cards/inputs deepened to reduce overall scene brightness.
- 2026-02-09T07:08:51Z [TOOL] Ran `npm run lint` and `npm run build` in `frontend` after darkening pass (pass).
- 2026-02-09T07:08:51Z [TOOL] Playwright validation on `http://localhost:5173/` in dark mode confirmed `--bg-base: #060C1A`, with reduced background glow opacities (`--bg-accent-a: 0.14`, `--bg-accent-b: 0.22`).
- 2026-02-09T07:04:35Z [CODE] Updated frontend/src/styles/theme.js dark theme tokens (background, surfaces, text, border/shadow, card, input, spinner/focus, and accentAlt) to blue-leaning values.
- 2026-02-09T07:04:35Z [TOOL] Ran npm run lint and npm run build in frontend after dark-theme recolor (pass).
- 2026-02-09T07:04:35Z [TOOL] Playwright validation on http://localhost:5173/ confirmed dark mode resolves --bg-base to #0B1730 and heading text to a light blue-gray; light-mode tokens remain #DDE4E4/#001B1A after toggle.
- 2026-02-09T07:00:51Z [TOOL] Revalidated `http://localhost:5173/` in Playwright across both theme states: hero/main text uses text token, `View Resume` uses primary fill, `Contact` uses secondary fill, and `View Project` text is absent; reran `npm run lint` + `npm run build` in `frontend` (pass).
- 2026-02-09T06:58:22Z [TOOL] Playwright verified hero CTA mapping in both modes: `View Resume` uses primary fill (`#3CC5C2/#3BC5C2`), `Contact` uses secondary fill (`#7BAAD6/#22558B`), and `View Project` no longer renders.
- 2026-02-09T06:58:22Z [TOOL] Ran `npm run lint` and `npm run build` in `frontend` after readability pass (pass).
- 2026-02-09T06:58:22Z [CODE] Updated `frontend/src/pages/Home.jsx` to replace accent text with main text in hero/spotlight/filter/tags, map CTA fills to `accent` and `accentAlt`, and remove `SpotlightCta` render/style.
- 2026-02-09T06:58:22Z [CODE] Updated `frontend/src/styles/theme.js` button tokens so global primary CTA fill follows primary color.
- 2026-02-09T06:51:56Z [TOOL] Playwright verified new two-mode mapping: dark mode `#001815` background, `#CFE0E2` text, `#3BC5C2` primary, `#22558B` secondary, `#2E63B7` CTA; light mode `#DDE4E4` background, `#001B1A` text, `#3CC5C2` primary, `#7BAAD6` secondary, `#628FD6` CTA.
- 2026-02-09T06:51:56Z [TOOL] Ran `npm run lint` and `npm run build` in `frontend` after mode-specific palette remap (pass).
- 2026-02-09T06:51:56Z [CODE] Updated `frontend/src/styles/theme.js` with new light/dark swatch assignments and updated `frontend/src/pages/Home.jsx` heading gradient to use theme CTA color as the third stop.
- 2026-02-09T06:42:45Z [TOOL] Playwright confirmed CTA role color: `View Resume` computed background is `rgb(179, 156, 208)` (`#B39CD0`) with dark text for contrast.
- 2026-02-09T06:41:50Z [TOOL] Playwright verification after role-corrective pass: both theme states report `--bg-base: #2C2C2C`, `--text-primary: #E4E4E4`, `--accent: #A8DADC`; hero gradient renders `#A8DADC -> #FFC1CC -> #B39CD0`; lint/build pass.
- 2026-02-09T06:41:50Z [CODE] Reworked `frontend/src/styles/theme.js` token assignments to follow role text exactly and updated `frontend/src/pages/Home.jsx` kicker gradient to include accent-alt pink midpoint.
- 2026-02-09T06:37:25Z [TOOL] Verified palette mapping via Playwright CSS variables (dark: `#2C2C2C/#FFC1CC`; light after toggle: `#E4E4E4/#B39CD0`) and ran `npm run lint` + `npm run build` in `frontend` (pass).
- 2026-02-09T06:37:25Z [CODE] Updated `frontend/src/styles/theme.js` with full token remap to the provided swatches and updated `frontend/src/pages/Home.jsx` hero gradient stops to `#A8DADC` and `#B39CD0`.
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
- 2026-02-09T07:39:53Z [TOOL] The previous 3-stop gradient could read center-weighted in dark mode because first and final stops converged; a 2-stop horizontal gradient removes that effect.
- 2026-02-09T07:35:20Z [TOOL] Splitting the heading into plain text plus styled span gives fine-grained gradient emphasis without reintroducing full-heading readability issues from earlier iterations.
- 2026-02-09T07:27:54Z [TOOL] Theme default behavior is controlled entirely by ThemeContext fallback branch; changing it does not affect saved user preference restore logic.
- 2026-02-09T07:19:08Z [TOOL] Footer panels were initially brighter than cards even after first chrome-token pass; lowering dark chromeStrong to #0A1932 established the intended depth ordering.
- 2026-02-09T07:08:51Z [TOOL] Dark-mode perceived brightness is driven by both base color and radial-glow tokens; reducing `backgroundAccentA/B` materially darkens the scene without sacrificing hue identity.
- 2026-02-09T07:04:35Z [TOOL] In this app, checking CSS variables (--bg-base, --text-primary) via Playwright is the most reliable way to verify theme-token swaps across persisted toggle states.
- 2026-02-09T06:58:22Z [TOOL] Global link-name selectors can hit header links first; validating hero CTAs should be scoped under `main` to avoid false negatives.
- 2026-02-09T06:51:56Z [TOOL] Theme toggle persisted prior mode in localStorage; validation must inspect `aria-label` and capture both states explicitly.
- 2026-02-09T06:41:50Z [TOOL] Solid CTA color (`#B39CD0`) surfaces as `background-color` (not `background-image`), so verification for button role should inspect color property.
- 2026-02-09T06:37:25Z [TOOL] LocalStorage kept dark mode active on first load; explicit theme-toggle verification was required to confirm both palette variants.
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
- 2026-02-09T07:39:53Z [TOOL] Yu Xuan highlight now sweeps cleanly left-to-right across the name with no center-radial impression.
- 2026-02-09T07:35:20Z [TOOL] Hero heading now emphasizes Yu Xuan with gradient styling while keeping the rest of the title clean and legible.
- 2026-02-09T07:27:54Z [TOOL] Default/first-run experience now opens in dark mode while existing users retain their last saved theme selection.
- 2026-02-09T07:19:08Z [TOOL] Header and footer now sit visually behind content cards in dark mode, giving cleaner depth separation while preserving existing CTA/color hierarchy.
- 2026-02-09T07:08:51Z [TOOL] Dark mode now lands on a deeper navy background that better matches expected dark-mode tone while preserving readability and CTA hierarchy.
- 2026-02-09T07:04:35Z [TOOL] Dark mode now presents as navy/blue rather than green while maintaining readability and the previously established CTA color hierarchy.
- 2026-02-09T07:00:51Z [TOOL] Final verification pass confirms the readability-focused color-role mapping is stable in both modes and the redundant spotlight `View Project` label remains removed.
- 2026-02-09T06:58:22Z [TOOL] Readability improved: cyan text emphasis removed from key copy, CTA color hierarchy now matches requested primary/secondary mapping, and redundant spotlight CTA text is removed.
- 2026-02-09T06:51:56Z [TOOL] Palette now follows the new design intent: light mode and dark mode each use their own swatch set while keeping consistent role semantics across the UI.
- 2026-02-09T06:41:50Z [TOOL] Palette roles now align with the reference text instead of approximate placement; the site consistently uses dark charcoal background, light-gray text, cyan/pink accents, and lavender CTA.
- 2026-02-09T06:37:25Z [TOOL] Website palette now follows the reference swatches across both light/dark themes, including background atmospherics, accents, controls, and hero gradient text.
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














