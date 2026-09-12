# Experimental field notes — implemented

Latest QC revision 2026-09-10: [project-first recognition, full-frame images, moving contours at every width and continuous background atmosphere](qc-refinement.md) supersedes the relevant original specifications below. “Selected projects” is the current work heading.

Completed locally 2026-09-10 on `codex/portfolio-overhaul-plan`, after the user approved the composition and selected charcoal/ember. This specification supersedes the earlier petrol/acid-yellow palette, immersive-hero dimensions and proposal-only status. The existing React/Vite, styled-components, Sanity, routing and Vercel setup remain in place. No dependencies, CMS content, deployment or git commit changed in this pass.

## Final experience

- Charcoal `#100E0D`, local ember-brown gradient `#352019`, orange `#FF9966`, warm-white `#F5EFE6` and restrained lavender `#C2B6FF` contour highlights. Shared theme tokens carry through navigation, detail routes, buttons, focus, awards and contact. Original artwork is not tinted.
- SIT Open House 2026 opens the gallery; JPMorgan SAEI and Cinder remain the other selections. Desktop thumbnails sit in the lower-right part of the frame. Phone navigation uses previous/next and a count, without the thumbnail strip. Panels remain mounted for smooth switching; native vertical scroll takes priority over dragging.
- Cinder has a Finished / Field notes switch. It crossfades between the original character and blurred-face capture photo, keeps the frame size and selected project stable, and preserves the view after opening/closing the project overlay. The switch only appears on the active project with the curated companion asset. It uses native buttons and pressed states; arrow keys within the switch do not accidentally change projects.
- One full-width SVG field contains 22 unfilled contours below the project content. Two small-displacement layers travel for 24s/32s per direction: 48s/64s complete loops. No pulsing, reflections, canvas, second water plane or pause button. Existing reduced-motion, phone/tablet, data-saving and offscreen/hidden/overlay/transition suspension remain.
- Recognition stays attached to SIT and its Hei/Singapore Institute of Technology collaboration credit. Selected work uses two unequal image columns and a separate Cinder process feature, replacing the repeated three-card row. The archive retains all 13 exact project URLs and discipline filters.
- Field notes features the published Shophouse Generator breakdown and the Dune sand simulation study, each linked to its existing Sanity-backed page. About is one concise paragraph with Resume, Showreel and Field notes links. Contact offers the large ember email action and retained message-form disclosure.

## Source curation

The [read-only published inventory](published-rnd-inventory.json) was retrieved on 2026-09-10. Shophouse Generator is the one published blog post, ID `a1c2b064-f515-486d-9e12-fe9cefdb22dc`; Dune sand is portfolio ID `e66165bf-e44e-489e-b0f3-bda746df25e0`. The latter is explicitly a study, not an invented second blog post. Editorial contribution text is a concise paraphrase of the published descriptions; the Shophouse excerpt remains CMS content. Titles, image references and destination slugs are fetched live. The current legacy Dune URL is preserved through `projectPath`, not renamed.

Cinder uses portrait `image-6cb458474016f4b556f7de38ba5798f4b979bfef-350x350-jpg` and capture `image-be8828d4785d430e30f16b4be57141c6abf1d844-500x500-jpg`. Both retain square composition, with a maximum 350px desktop hero image and a 190px phone image inside the stable stage. SIT/JPM imagery and approved crop references are unchanged. No generated mockup artwork is used in the application. Missing/failed content has a real retry or R&D-index destination, with no fabricated preview cards.

## Geometry and implementation

At 1280×800, the active stage is approximately 882×496px, the contour gap below the stage is 32px and its depth is 88px. The cue ends at 799px. At 390×844, the stage is 350×420px; the controls precede a 26px gap and 78px contour field, with the cue ending at 760px. Both have 12px clear space from the completely faded contour box to the cue. This resolves the Astra review's fade-overlap finding. Smaller desktop frames are height-limited to retain the opening controls; short landscape screens may scroll naturally.

`ProjectGallery.jsx`, `ProjectMedia.jsx` and `ExperienceWater.jsx` own the hero, media states and contour geometry. `WorksSection.jsx` owns the asymmetric projects/process layout. New `FieldNotesSection.jsx` and `lib/fieldNotes.js` select and render the real R&D content. Home fetches project and note data concurrently, and waits for both to resolve before settling initial anchor navigation. `navigation.js` and `siteContent.js` include `#field-notes`. About/contact and shared theme/header/footer styles complete the visual revision.

## Verification and captures

- Container lint and full production build passed; 16 route shells and 17 sitemap entries generated.
- All 14 unit tests and all 21 browser tests passed. Final process-photo sizing and completed fade checks also passed in a focused 3-test rerun.
- Browser coverage includes 1280×800, 390×844, 320×740, 1440×900, 768×1024, 844×390 and 640×400, plus process switching at 1280/390/320 widths. Checks cover direct/hash navigation, exact project URLs, field-note destinations, controls/focus, archive filters, overlay history, image failures, missing content, motion suppression and contour/control/cue clearance.
- Production Chromium uses live published Sanity media with telemetry/contact requests intercepted. No page errors or horizontal overflow were observed. [Measurements](production-metrics.json) record poster bytes, LCP/CLS, stage/cue positions and frame samples. These are local lab observations, not field Web Vitals, INP or physical-device proof.
- Rendered captures: [desktop opening](production-laptop.png), [phone opening](production-phone.png), [desktop full page](production-laptop-full.png), [phone full page](production-phone-full.png), [desktop capture view](production-laptop-cinder-notes.png), [phone capture view](production-phone-cinder-notes.png). Screenshots are browser output from the implementation, unlike the earlier generated concepts.

The existing local preview service is running at `http://localhost:5173`. Physical-device/Safari review and deployment remain future release activities, not claimed by this local verification.
