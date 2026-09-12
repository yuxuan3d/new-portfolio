# Dark kinetic portfolio — implemented direction

Updated: 2026-09-10. This brief supersedes the carousel, water/contours and charcoal/ember field-notes designs. Their previous plan is preserved in [the historical plan](docs/plans/portfolio-field-notes-superseded-2026-09-10.md).

## Goal

A single continuous landing page for Yu Xuan / yxperiments: dark, confident, cinematic and kinetic, using the existing Sanity portfolio and R&D content. The user requested implementation, not another design proposal.

## Implemented composition

1. **Opening:** monumental “Beyond the expected” typography over a 4.5-second Particle Sea loop converted from the user's supplied clip. A compact muted MP4 runs on the page; an infinite GIF export is also available. The original Sanity image remains the static fallback. An acid-yellow asterisk rotates beside the headline and echoes near About/contact, with a quick extra turn on hover. Identity, disciplines, showreel, artwork destination and scroll cue remain clear.
2. **Work:** large SIT Open House 2026 image and project attribution, with its CSSDA/FWA awards immediately below; asymmetric JPMorgan SAEI and Cinder reveals. Each project opens the existing accessible route-backed overlay.
3. **Discovery:** an inline project index keeps all published work available with the existing discipline filters. An offscreen-aware moving typographic ribbon carries the transition into experiments.
4. **Experiments:** the actual Shophouse Generator post and Dune sand study, with original images and destinations.
5. **Personality and craft:** concise first-person introduction, resume/showreel links and keyboard-operable capability disclosures.
6. **Contact:** quieter final invitation, direct email, existing validated message form, social links and return-to-top navigation.

## Implementation and constraints

- `frontend/src/pages/Home.jsx` retains the public Sanity queries and per-location content readiness.
- `frontend/src/components/home/KineticLanding.jsx` and `kinetic.css` own the continuous composition, project index and motion.
- Shared header/theme/navigation follow the new palette; Space Grotesk is added to the existing Google Fonts stylesheet. No package dependencies were added.
- Existing project slugs and links are encoded unchanged. Existing metadata, route shells, standalone detail/R&D/contact URLs, email flow, resume and showreel destinations remain available.
- No generated substitute artwork, invented projects, new CMS fields, CMS mutations or production deployment.
- Native vertical scrolling remains in control. Automatic effects stop for reduced motion, hidden documents and overlays; hero and ribbon motion also stop offscreen. The hero respects data-saving preference.
- The legacy carousel/contour components remain inactive and excluded from the homepage bundle; their historical audit is no longer the active verification command.

## Verification

Run the existing frontend Compose workflow for lint, unit tests, browser tests and full build. After building, run `docker compose exec app node scripts/verifyKinetic.mjs` from `frontend/` for live-content production captures and local performance samples. Output is ignored under `frontend/artifacts/kinetic/`.

The browser suite covers six viewport geometries, anchor/history alignment, overlays and focus restoration, archive/filter counts, capability disclosure keyboard behavior, contact validation, content failures, blocked telemetry and reduced/offscreen motion. Full validation results and visual captures are recorded in [the implementation report](docs/design/kinetic/implementation.md).

The new longer page exposed the old 800ms anchor fallback interrupting native smooth scrolling before it completed. The fallback now waits 1800ms while normal scroll completion remains event-driven, and reduced-motion navigation positions immediately.

Deployment is a separate user-requested action. The existing local preview remains on http://localhost:5173.
