# Charcoal / ember — visual QC refinement

Implemented 2026-09-10 after the user's latest QC. This supersedes the earlier static phone contours, native-size image presentation, work headline, recognition layout and background treatment in `implementation.md`.

- **Project-first recognition:** one connected feature pairs the SIT Open House 2026 image, linked title and Hei / Singapore Institute of Technology credit with its CSS Design Awards and FWA recognition. Award organizations are small labels; the distinctions are readable titles. The award list is explicitly labelled for SIT, regardless of the selected hero project.
- **Visible contour motion at every width:** removed the 1100px cutoff from decorative motion. The previous treatment only translated a drawing by 18px over 24–32 seconds and was fully paused below that width. The new surface changes its geometry with two traveling swells (approximately 20s / 33s periods), capped at 30 updates per second. It continues through carousel changes, retains a single full-width plane and the existing air gap / fade before the cue. Reduced motion, data saving, hidden documents, offscreen hero and project overlays still stop it. A failed opening image no longer prevents the decorative surface from mounting.
- **Full-frame imagery:** hero images, archive cards, process pairs and R&D previews use cover crops, including Cinder and Dune. Smaller originals may visibly soften when enlarged, as explicitly requested. Source downloads remain capped at original resolution; source assets, privacy blur and exact project URLs are preserved. Cinder retains the Finished / Field notes crossfade and gains the same dark caption scrim as other projects.
- **Direct work heading:** “Selected projects” replaces “Made. Then made better.” Expanded view reads “All projects.” A large ember arrow supplies a graphic accent without adding marketing copy.
- **Continuous atmosphere:** a fine 96px grid and moving ember / lavender radial gradients carry through the page. The gradient has a slow 56-second return loop; it is decorative, ignores pointer input and stops for reduced motion, data saving, hidden documents and project overlays. The pattern remains visible when motion is suppressed.

## Verification

Container lint, full production build and all 14 unit tests passed. The browser suite has 23 cases: 21 passed initially; a cold R&D-route load exceeded the test wait and an added image-size assertion sampled during carousel travel. The image check now waits for a settled carousel at an explicit 1280×800 viewport. All five focused field-notes / QC tests then passed, including the R&D route. Other coverage checks 320px phones through desktop, actual path changes at 390px / 900px, offscreen and reduced-motion suspension, award destination, cover geometry, project switching, overlays, archive and contact behavior.

Production browser captures and motion measurements are in [qc-refinement/](qc-refinement/production-metrics.json). These use live published Sanity content and intercepted telemetry, with no page errors or horizontal overflow at 1280×800 and 390×844. Metrics are local Chromium observations, not physical-device or field performance claims.

The initial rotating/scaling background produced repeated 33.3ms desktop switching p95 samples. A temporary background/contour isolation check identified the background layer as the cost. The final background uses a smaller, paint-contained layer with translation only and no grid mask; final switching p95 is 16.8ms on both profiles, with effects-on p95 16.7ms. Lint and full build passed again after this optimization. `MOTION_DIAGNOSTICS=1` enables the optional isolation samples in the verification script.

- [Desktop opening](qc-refinement/production-laptop.png) / [phone opening](qc-refinement/production-phone.png)
- [Desktop recognition](qc-refinement/production-laptop-awards.png) / [phone recognition](qc-refinement/production-phone-awards.png)
- [Desktop field notes](qc-refinement/production-laptop-field-notes.png) / [phone field notes](qc-refinement/production-phone-field-notes.png)
- [Desktop Cinder capture](qc-refinement/production-laptop-cinder-notes.png) / [phone Cinder capture](qc-refinement/production-phone-cinder-notes.png)
- [Desktop full page](qc-refinement/production-laptop-full.png) / [phone full page](qc-refinement/production-phone-full.png)

No dependencies, CMS content, deployment or commits changed. The existing local preview remains at http://localhost:5173/.
