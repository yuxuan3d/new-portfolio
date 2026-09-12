# Experimental field notes — visual review

Latest implementation: [2026-09-10 visual QC refinement and captures](qc-refinement.md). This includes project-first recognition, full-frame imagery, a moving gradient and visible contour motion on narrow screens.

**Implemented 2026-09-10 with charcoal/ember after user approval.** See [final specification, verification and browser captures](implementation.md). The earlier review text and generated images below are retained as history; the chosen colours, responsive geometry and actual curated content in the implementation take precedence.

Prepared 2026-09-10. The user selected the recommended direction and requested wireframes and looks before implementation. These are review artifacts; no application source, CMS content or deployed site changed during this pass.

Update 2026-09-10T08:52+08:00: the user approved the composition and requested slow contour motion. Petrol is reopened for replacement; see [four researched colour options](colour-options.md) and the [Astra medium implementation review](astra-medium-review.md). The visuals below remain layout references. Next motion target is 24s/32s per direction, with the fade completed before the scroll cue. Palette selection remains pending.

## Review the four boards

1. [Desktop and mobile wireframes](wireframes.png) — complete one-page hierarchy. [Editable SVG](wireframes.svg).
2. [Desktop opening look](desktop-look-v1.png) — SIT lead, large project imagery, dark gradient, editorial controls and contour floor.
3. [Lower-page look](lower-page-look-v2.png) — asymmetric selected work, Cinder process feature, R&D slots and concise About/contact.
4. [Mobile interaction states](mobile-states-v2.png) — Cinder Finished and Field notes, with simplified previous/next navigation. SIT remains the initial project; Cinder illustrates the proposed interaction.

## Feel and visual system

Dark ink `#080C10` blending subtly into petrol `#102027`, warm white `#EFEDE4`, and acid yellow `#D9F36B` for active controls and key links. Artwork supplies the other colours. Avoid heavy glow, glass panels and competing accent colours. Use the existing condensed heading direction, a legible body face and small editorial index labels. Large headlines identify the project; brief contribution notes explain the work.

The intended journey is **interactive hero → recognition → selected work → field notes → brief About → contact**. The asymmetric work images and a real process example add substance beyond a carousel followed by repeated cards. Existing project detail destinations, resume, showreel and contact routes remain available within the current stack and Sanity setup.

## Composition and interaction decisions for review

- Keep SIT Open House 2026 first, with JPMorgan SAEI and Cinder directly selectable. Desktop retains the dominant active frame and partial neighbouring projects. The phone shows one flat active project, its title, concise role, direct project action and minimum 44px previous/next targets.
- Finished / Field notes changes the active project's media and a short caption without changing project selection or scroll position. Only offer it when actual curated material supports a useful second view. Cinder has the clearest evidenced pairing. SIT's mock control demonstrates placement; its process selection is still pending. Do not label an arbitrary finished alternate frame as process.
- Hold the image region steady while switching; preload the next image, use one restrained transform/opacity transition and keep controls available. These static studies do not establish animation quality; verify it in the browser during implementation.
- Maintain ONE screen-wide decorative contour field below the hero content. Preserve at least the existing 32px desktop / 26px phone air gap; keep controls clear and fade the lines completely before the scroll cue. Unfilled, sparse topographic curves, no reflections or simulated liquid. Slow drift on supported desktop states; static on phone and reduced motion. No pause control or scroll hijacking.
- Recognition always credits SIT Open House 2026, Hei and Singapore Institute of Technology, regardless of the active hero project. Retain verified award names and links. Generated laurel marks in the desktop image are illustrative, not approved official award assets.
- Below recognition, use varied image widths and one concise contribution statement per project. The Cinder feature can expose the same finished/capture pair; avoid redundant controls if both images are already visible together. Choose two real Sanity R&D entries before filling the Field notes section. Placeholder contour previews are not portfolio projects and must not ship as such.
- About remains one short introduction with resume/showreel links. The large contact line finishes the page. The footer contour fragment in the look study is a static graphic motif; implementation should omit it if it reads as a second water plane.

## Source imagery and sizing

Generation referenced the inspected originals: [SIT campus](../media-review/sit-open-house-2026-7.png), [JPMorgan crop](../media-review/jpmorgan-hero-crop.jpg), [Cinder portrait](../reference-cinder.jpg), and [Cinder capture](../media-review/cinder-0.jpg). The capture photograph's face blur is preserved. See the [media inventory](../hero-media-inventory-2026-09-08.json) for source references.

The final website must use original Sanity media, not artwork reconstructed inside these generated mockups. Preserve Cinder's square aspect ratio and existing 350px desktop / 240px phone portrait limits; the 500px capture photograph is not a higher-resolution character portrait. Generated proportions, crops, lettering and colour values are approximate. The wireframe is schematic and vertically compressed in lower sections; it is not a pixel contract. Fit the phone hero to available viewport height using the existing responsive rules rather than reproducing the tall presentation artboards literally. The desktop look's contours sit too close to the frame in places; the explicit gap above takes precedence.

## What to agree on before coding

1. Dark petrol and acid-yellow palette, condensed headline scale and fine editorial labels.
2. Finished / Field notes as the main added discovery interaction.
3. Asymmetric finished-work layout, one Cinder process feature and a small curated R&D section.

Next after visual feedback: revise this direction if needed, curate actual process/R&D content, then implement and verify responsive geometry, accessible controls, motion and original image fidelity. No new dependency or hosting change is proposed.

## Production of this review pack

Visual looks were generated with the built-in `image_gen.imagegen` tool using project references. Exact prompts: [desktop](prompt-desktop.txt), [lower page](prompt-lower-page.txt), [mobile](prompt-mobile.txt), [mobile refinement](prompt-mobile-refinement.txt), [footer correction](prompt-lower-page-refinement.txt). Earlier v1 lower/mobile images are retained as iterations; v2 links above are authoritative. The wireframe is native SVG, rendered to PNG using existing container Chromium and visually checked. No source-code build or lint was needed for this design-only pass.
