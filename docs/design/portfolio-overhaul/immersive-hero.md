# Immersive project gallery — implemented revision

Historical specification: superseded on 2026-09-10 by the approved [charcoal/ember field-notes implementation](field-notes/implementation.md), including geometry, media states, palette, navigation and contour treatment.

Superseded water treatment2026-09-09T15:22Z: [contour-water revision and three proposed directions](three-design-directions.md). The WebGL/reflection description below is historical; current water is unfilled SVG line art with no reflection source.

2026-09-09. Implements the user's approval of the [Cortiz comparison](cortiz-reference-review.md) on `codex/portfolio-overhaul-plan`. This specification supersedes the v4 headline, frame sizing, caption rows, Cinder pairing and water dimensions in the earlier concepts and row studies. Sanity asset identities, URLs, awards attribution and the one-page route contract remain authoritative.

## Composition

- Compact identity is the single H1. The generic headline is removed. Project titles use Barlow Condensed through the existing Google Fonts connection; body copy remains Poppins and metadata uses Roboto Mono.
- Desktop frame width is the minimum of 78vw, 1100px and a 16:9 frame at 66svh height. At 1280×800 the frame measures 938.67×528, starting at y135.5. Perspective companions flank it. The project title, short role and 44px project link sit within a dark bottom scrim.
- The right edge has separate previous/next controls. Three 120×78 image thumbnails sit below the frame, with an index and clear selected border. Titles and selectors fade while stable panels move over 620ms; the wrapping companion fades before repositioning. Teal, amber and plum environments crossfade over 800ms. No automatic slide advance.
- Phone uses one flat 350×364 frame at 390px width (288×340 at 320px). Integrated title/action stay in the lower image area; arrow/count controls and three equal 70px thumbnail selectors follow below. This intentionally adapts the review's proposed below-media action into the image scrim to keep the same project-led hierarchy. All controls remain at least 44px. Short viewports scroll naturally.
- Recognition begins after the immersive opening, rather than being forced into the first viewport. At 1280×800 the cue ends at847.5 and recognition starts935.5; at390×844 these are712 and888. Lower sections have numbered labels and condensed display titles.

## Source imagery

The approved SIT1920px landscape and JPMorgan1100×619 crop still resolve from current Sanity records. Phone landscape posters request enough pixels for their taller cover crop (SIT1344px on the measured2× phone). Thumbnail derivatives are capped at280px.

Cinder now uses one contained original character portrait, at most350 CSS px desktop and240px phone, over a plum matte. Its350px source limits sharpness on dense screens. The paired behind-the-scenes photograph is removed from the hero composition; project detail content remains unchanged. No AI enlargement, substituted artwork, YouTube download or third-party demo footage was added. Owned motion loops remain an enhancement requiring suitable original files.

## One shared water plane

The entire gallery has one viewport-wide water surface,32px below the desktop frame and26px below the phone frame. Surface depths are190px and180px respectively, fading before the scroll cue. Only image pixels from project panels enter the reflection texture. Titles, navigation, selectors, awards and lower sections cannot be reflection sources.

Broad waves, sparse surface-normal highlights, softened reflections and project-coloured light sit behind all controls. The reflection follows a shallower vertical crop instead of compressing the entire project into a short strip. While cards move, reflections dissolve, then refresh and settle back in. This avoids uploading a large image texture and reading panel geometry on every frame. Reflection texture width is capped at960px; the actual project posters retain their independent higher-resolution sources.

Phone, reduced-motion, data-saving, offscreen, hidden-tab and overlay states retain the existing static/suspension behavior. There is no Pause effects button. The original posters and all project actions work if optional WebGL or analytics are blocked.

## Verification and deliverables

Production build produces16 route shells and17 sitemap entries. Existing unit and browser checks cover original links, archive filters, overlays/focus/history, hash navigation, content blockers, one water plane, static fallbacks, drag intent and settled geometry across seven screen sizes. Captures and final lab measurements are linked in [implementation verification](implementation-verification.md).

The work adapts visual principles using the existing React18/Vite/styled-components/Sanity stack. No code or assets were copied from Cortiz, so no third-party component migration or new runtime dependency was needed. No CMS writes, deployment, commit or push occurred. Physical-device Safari/Android and field performance remain release checks.
