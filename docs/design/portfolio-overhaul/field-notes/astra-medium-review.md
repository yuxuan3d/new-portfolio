# Astra medium review — Experimental field notes

Reviewed 2026-09-10T08:48:47+08:00. Scope: current local gallery/contours, responsive safeguards and the approved general direction. Review only; no application source, Plan.md, continuity, CMS or deployment changes. Findings below paraphrase the inspected source and design notes.

## Verdict

The implemented gallery works in the targeted browser checks. The new Finished / Field notes experience is still a proposal and cannot yet be called functionally verified. Keep the approved layout direction, resolve the contour fade boundary, and make the next implementation pass use original images and curated process content.

## Fresh verification

- Existing `tests/e2e/overhaul.spec.js`: **9 passed in 38.6s**, using a temporary container with the existing dependency volume. Sanity responses and analytics were intercepted by the suite. No dependency installation or remote write.
- The suite covers switching, keyboard/rapid selection, drag versus vertical intent, pointer cancellation, overlay close/Back/focus restoration, reduced motion, image failure, empty content and all 13 exact archive destinations.
- Geometry checks passed at 1280×800, 390×844, 320×740, 1440×900, 768×1024, 844×390 and 640×400: no horizontal overflow, caption/action containment and gallery controls at least 44×44px. This is Chromium evidence, not physical touch-device verification.
- Container `npm run lint`: passed. Full `npm run build`: passed, generating **16 route-specific HTML shells and a sitemap with 17 routes**. No application changes were required.
- Inspected the generated desktop, lower-page and phone studies, plus the fresh laptop browser screenshot. Static studies establish appearance only. This review did not measure field performance, real-device scrolling, Safari, 200% zoom or palette contrast.

## Concrete gap to fix during implementation

**The desktop contour field does not finish before the scroll cue.** `ExperienceWater.jsx:41–44` places its box 32px below the stage, with 190px height and zero mask opacity only at its bottom: stage +222px. `ProjectGallery.jsx:210–268` places the desktop controls at +32px, gives them 78px height, then puts the cue after a 30px margin: cue starts +140px. The fade therefore remains active through the cue region. The fresh laptop image also shows lines competing with the thumbnail strip.

The review README explicitly requires the lines to fade completely before the cue. Anchor the decorative fade endpoint to the actual cue position (allowing space above it), and keep the controls on a clear surface. Preserve the 32px desktop /26px phone frame gap. This is a visual boundary issue, not a blocked-click issue: the decorative layer already has `pointer-events: none` and `aria-hidden`.

The existing browser test checks a gap, moving pixels, reduced motion and absence of reflected text; it does **not** assert the fade endpoint or a clear control region. Add that focused acceptance check when implementing the new composition. Its older “gallery-only reflections” test name is historical; the actual source is SVG lines.

## Slow motion recommendation

Current source uses 13s and 17s **one-way** durations with `alternate`, so complete back-and-forth loops are 26s and 34s. Layers move from −9px to +9px horizontally and −2px to +3px vertically with ease-in-out. This is already restrained, but the user's emphasis on very slow contours supports **22s and 30s one-way durations**, keeping the existing displacement: full loops 44s and 60s. This is an art-direction recommendation, not a measured performance requirement.

Keep the automatic suspension already implemented: motion runs only after the poster is ready, at widths ≥1100px, while visible, with no reduced-motion/data-saving request or open overlay, and pauses during project transitions. Phone/tablet contours are currently static, matching the existing review notes. If the latest request means movement on phones too, that is a deliberate change to this documented behavior and needs device verification; reduced motion must remain static.

## Proposal-specific implementation needs

- `ProjectMedia.jsx` currently renders the Cinder portrait; there is no Finished / Field notes state or capture-media switch. Preserve selected project, focus and frame size when adding that switch. Offer it only for projects with real curated process material; SIT process content remains unselected.
- The two R&D preview slots remain placeholders. Select real entries and destinations before shipping. Omit redundant Cinder toggle controls when finished and capture images are already visible together.
- Use original Sanity artwork with the documented Cinder 350px desktop /240px phone portrait caps. Generated mobile artboards are substantially taller than phone viewports and must not become literal sizing specifications.
- Keep SIT/Hei/Singapore Institute of Technology recognition fixed across slides; the existing browser suite verifies the SIT attribution. Generated laurels are not approved award assets.
- The dense, nearly parallel implemented line field differs from the broader, looping topographic curves in the approved look. Preserve the sparse contour character as well as its slow timing; speed alone will not produce the new look.
- The user has rejected dark petrol. Replace that base without tinting project artwork, and keep one restrained accent for active controls and links. Tiny editorial labels need contrast checks against the lightest actual gradient and image regions. Parent palette exploration is separate from this functional review.

No deployment or new feature implementation is claimed by these passing baseline checks.
