# Cortiz reference review

Reviewed2026-09-09. The user subsequently approved implementation. The [implemented immersive revision](immersive-hero.md) now governs the composition; findings below record the comparison baseline. Original motion footage remains unavailable. The implementation adapts visual principles without copying third-party code or artwork.

## Findings from the rendered reference

[Stylized Components](https://stylized.cortiz.dev/) gives the featured project most of the opening viewport. Its identity is small and peripheral; a large condensed title belongs to the project frame. Recessed companions, curved/perspective frames, luminous borders, image thumbnails and atmospheric colour create a unified scene. The Water and Rain states visibly have different environmental colours. The site also links a specific 3D gallery breakdown.

The anime water occupies the featured demo itself. The surrounding stage contains subtle orbital/ground graphics. A reflective ocean under the entire gallery is our requested adaptation, not a literal feature to reproduce from that screenshot.

Our desktop stage is deliberately capped at672px for a1280px viewport, and132px water depth leaves little room for perspective. The large generic headline, separate caption row, action row and pill selectors divide the opening into conventional page furniture. On the inspected narrow local view, Cinder's two small square images leave most of its landscape frame empty. Existing performance tests demonstrate responsiveness, not visual fidelity to the inspiration.

## Recommended changes, in priority order

1. Recompose the entire opening. Remove the large generic slogan from above the stage. Keep a small identity/navigation overlay. Start with an active card roughly72–80% of desktop viewport width, constrained by usable height and source-image resolution. Give the hero approximately one viewport; let recognition begin after the experience instead of forcing it into the opening fold. Preserve natural scroll on phones and short screens.
2. Build one spatial scene. Float all panels above one full-width water horizon, with stronger perspective, restrained curvature, recessed companions and a fine luminous rim. Give the water enough visible foreground depth to read as a plane; keep copy and controls away from its reflection band. Use broad low waves, sparse crest glints, softened reflections and horizon haze, not uniformly sharp stripes.
3. Make project identity dominant. Place a large condensed project title near the lower-left of the active frame with a restrained dark scrim. Keep role text short and smaller. Use a condensed display face with a neutral readable body face; avoid applying the same rounded type to every element.
4. Replace text pills with three real thumbnail selectors. Use an unmistakable active treatment, directional controls at the right edge and one primary project action near the lower-left. On phones, keep the action and thumbnails below the media with44px targets.
5. Add project-specific atmosphere. Propose midnight teal for SIT, charcoal with warm amber for JPMorgan, and slate/plum for Cinder. Blend background, border glow and reflected light through the same transition. Preserve the dark overall palette and unchanged Sanity project URLs.
6. Prefer actual moving work. Use short owned source clips when available, with still fallbacks. SIT can show a campus fly-through, JPMorgan a finished motion shot, Cinder the character performance. Do not infer downloadable source footage from a YouTube project link. Cinder particularly needs stronger landscape presentation; two tiny stills should move to detail content unless no better source exists.
7. Coordinate transitions. Establish one scene transition for card position, camera/perspective, environment colour, project title and selector state. Use smooth settling and uninterrupted direction; retain accessible direct selection and native vertical scroll. Avoid adding motion indiscriminately to lower sections.
8. Carry the hierarchy below the fold. Use small numbered section labels, stronger display titles, generous spacing and thin separators for recognition and work. Keep recognition compact, use different project shots from the hero, and preserve the concise About/contact.

## What is actually reusable

The [public repository](https://github.com/cortiz2894/stylized-components) includes the WaterFloor system, procedural surface patterns, ripple handling and related lighting/depth effects. Its [LICENSE](https://github.com/cortiz2894/stylized-components/blob/main/LICENSE) permits modification and redistribution under MIT with copyright/permission notices retained. The README also requests creator credit. Adapt the useful surface logic and credit it; keep our Sanity content and branding.

The fetched [public homepage entry](https://github.com/cortiz2894/stylized-components/blob/main/src/app/page.tsx) renders a different grid than the live carousel inspected in the browser. Therefore the exact live carousel has not been established as a drop-in component from this repository. Its [gallery breakdown](https://www.youtube.com/watch?v=HH6_BeO8NCA) is a useful next source; its implementation and licensing need verification before copying that specific code.

The public package manifest uses React19/Next16/R3F9, whereas our frontend uses React18/Vite. Reusing design principles or porting isolated shader logic does not require migrating the app. Full components would need dependency/version adaptation. Keep the separate ParticleEarth runtime isolated.

The reference's repository contains demo video assets and explicitly documents their use as previews. We should supply our own footage rather than reuse its demo artwork. Stock footage cannot substitute for the user's projects.

## Proposed next deliverable

A revised hero composition with SIT as lead, enlarged floating project, small identity, integrated project title, thumbnail navigation and the single shared water plane. Review that composition before another detailed water-polish pass. Preserve the current implementation as a comparison baseline. No deployment, dependency installation or source copying occurred in this review.
