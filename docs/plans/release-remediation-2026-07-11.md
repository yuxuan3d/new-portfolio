# Portfolio Release Remediation Plan

Status: Ready for implementation; local work first, remote writes approval-gated

Updated: 2026-07-11

Scope: Implement every remaining issue confirmed by the 2026-07-11 review across `frontend/`, `sanity/`, and release verification while preserving the completed portfolio and ParticleEarth improvements.

## Goal

Produce a commit-ready and release-ready implementation that:

- restores reproducible Sanity repository tracking,
- fixes delayed-reveal hash alignment,
- completes discipline inference and audience-facing labels,
- gives unmatched routes safe metadata,
- generates correct route-specific images and a sitemap from one validated manifest,
- makes the Sanity migration complete, concurrency-safe, and genuinely idempotent,
- adds deterministic frontend regression tests,
- preserves the progressive ParticleEarth integration,
- and keeps every content or deployment write behind explicit user approval.

## Confirmed starting state

Preserve these working behaviors:

- Work appears before Resume/About and navigation follows the same order.
- The homepage has one semantic H1.
- Secondary routes are lazy-loaded.
- Invalid contact submissions use custom validation, focus the first invalid field, and do not load EmailJS.
- The mobile drawer traps focus, restores focus on dismissal, and cleans up `inert`, `aria-hidden`, and body overflow.
- Malformed hashes such as `/#%E0%A4%A` do not crash the app.
- Project and R&D not-found routes remove canonical metadata and apply `noindex` after their fetch resolves.
- Project overlay metadata restores after the overlay closes.
- ParticleEarth uses a poster-first iframe, readiness messaging, offscreen pausing, mobile scroll-safe interaction, and deferred standalone controls.
- Frontend lint and the Vite client build pass.
- The full frontend build intentionally fails while published `NUHS` and `dune sand` slugs remain noncanonical.
- ParticleEarth lint, 20 unit tests, production build, and 3 e2e tests pass in the current workspace.

## Remaining findings to close

1. `sanity` is a parent Git link at `138a2dc`, but `sanity/.git` is missing.
2. `/#resume` and `/#contact` settle about 27-28px above the intended offset because the stability loop finishes before their delayed ScrollReveal transforms begin.
3. The migration script can report an entry as already applied even when its disciplines are missing or different.
4. A completely unmatched route keeps the homepage title/canonical and remains indexable.
5. Static route queries use `asset->{_ref}`; Sanity returns a null `_ref`, so project and post route shells fall back to the generic OG image.
6. Route HTML and sitemap output are produced independently and are never compared.
7. Discipline inference only lowercases exact strings, and `AfterEffects` can still appear in project details or Arsenal output.
8. `BlogPost` uses `post.excerpt` for metadata without querying `excerpt`.
9. The frontend has no automated regression suite for the reviewed hash, metadata, filter, form, and drawer behavior.

## Guardrails

- Preserve the existing visual design, `#90D5FF` accent, Work-first hierarchy, route structure, and ParticleEarth iframe isolation.
- Do not reintroduce the rejected Work process row.
- Do not hand-edit `frontend/public/particle-earth`; rebuild and sync from `ParticleEarth/` if ParticleEarth source changes.
- Use existing dependencies. Prefer Node's built-in test runner for pure helpers and the existing Playwright dependency for browser tests.
- Use `http://localhost:5173` for local Sanity-backed browser verification because other localhost forms may fail Sanity CORS.
- Keep `npm run build:client` available before content migration.
- Keep the full `npm run build` failing on noncanonical published slugs until the approved migration is complete.
- Treat Sanity mutations, schema deployment, redirect deployment, and production deployment as remote writes.
- Never run a Sanity apply, schema deploy, redirect deploy, or production deploy without explicit user authorization.
- Do not choose the final `NUHS` replacement without user approval.
- Preserve unrelated working-tree changes.

## Approval checkpoints

Implementation must stop for user input at these points:

1. If the original Sanity remote/history cannot be discovered, obtain approval before converting `sanity` from a Git link to a normal parent-tracked directory.
2. Obtain approval for the final `NUHS` canonical slug and the complete 13-project migration map.
3. Present and review the final tokenless migration dry run before requesting authorization to run `--apply`.
4. Obtain separate authorization before Sanity schema deployment, redirect deployment, or production deployment.

## Step-by-step implementation

### Step 1 - Capture the pre-change baseline

Files changed: none.

1. Record root, `sanity`, and `ParticleEarth` repository state without modifying it.
2. Confirm the parent entries for `sanity` and `ParticleEarth` with `git ls-files -s`.
3. Run root and ParticleEarth `git diff --check`.
4. Run the current read-only Sanity inventory and save only a redacted/high-level result in `.agent/CONTINUITY.md`.
5. Confirm the reviewed baseline remains 13 projects, zero proposed slug collisions, zero unclassified projects, 10 Motion projects, and one Interactive project.
6. Do not stage, commit, migrate, or deploy during this step.

Acceptance:

- Existing user changes are clearly distinguished from new work.
- The known full-build failure is attributable only to noncanonical published slugs.
- No remote state changes.

### Step 2 - Restore Sanity repository tracking

Affected state/files:

- parent Git entry for `sanity`
- `sanity/.git` or approved parent tracking
- `sanity/schemaTypes/portfolioItem.js`
- `sanity/scripts/inventoryPortfolioSlugs.mjs`
- `sanity/scripts/migratePortfolioSlugs.mjs`
- `sanity/package.json`

1. Inspect parent history, `.gitmodules`, existing remotes, workspace files, and documentation for the intended Sanity repository URL and commit history.
2. If the original repository is known, restore nested repository metadata without overwriting the current working files:
   - clone/fetch into a temporary workspace,
   - verify the expected history contains commit `138a2dc`,
   - reconnect the current `sanity` directory to that repository,
   - then reapply/preserve the current schema and script changes.
3. If the original repository cannot be recovered, stop and request approval before replacing the parent Git link with a normal tracked directory.
4. Verify `git -C sanity rev-parse --show-toplevel` resolves to the nested `sanity` directory, not the parent.
5. Verify `git -C sanity status --short` reports the schema, inventory, migration, and package changes.
6. Keep Sanity commits separate from the parent pointer update: commit nested changes first when authorized to commit, then update the parent reference.

Acceptance:

- `sanity/.git` is valid, or an explicitly approved conversion makes every Sanity file parent-tracked.
- A clean clone can reproduce the same Sanity implementation.
- No schema or script work is lost.
- Repository recovery itself performs no Sanity API write.

### Step 3 - Add deterministic frontend test infrastructure

Create or update:

- `frontend/package.json`
- `frontend/playwright.config.js`
- `frontend/tests/unit/`
- `frontend/tests/e2e/`
- optional shared fixtures under `frontend/tests/fixtures/`

1. Add `test:unit` using `node --test` for pure JavaScript helpers.
2. Add `test:e2e` using the existing Playwright package; do not add another browser framework.
3. Configure Playwright to start Vite on `http://localhost:5173` and reuse an existing server when appropriate.
4. Make browser tests deterministic by intercepting Sanity requests and returning query-appropriate fixtures rather than relying on live network timing.
5. Create a reviewed 13-project fixture containing the required tags, Arsenal values, explicit/implicit disciplines, featured order, and canonical/legacy slug examples.
6. Add helper utilities that assert:
   - exactly one canonical link when expected,
   - no canonical link for noindex fallbacks,
   - no duplicate title/description/OG/Twitter tags,
   - hash offset relative to the measured fixed header,
   - rendered/tabbable project counts.
7. Keep browser screenshots/traces in ignored output paths and retain them only for failed tests.

Acceptance:

- `npm run test:unit` and `npm run test:e2e` are repeatable without live Sanity data.
- Tests fail against at least one of the currently confirmed defects before its fix and pass after the corresponding implementation step.
- No new frontend dependency is added.

### Step 4 - Centralize discipline inference and display labels

Create or update:

- `frontend/src/lib/workDisciplines.js`
- `frontend/src/components/home/WorksSection.jsx`
- `frontend/src/components/ProjectDetail.jsx`
- `frontend/src/components/RnDBlog.jsx` and `frontend/src/components/BlogPost.jsx` if their tags use the same display formatter
- `frontend/src/pages/Home.jsx`
- `frontend/tests/unit/workDisciplines.test.js`
- `frontend/tests/e2e/workFilters.spec.js`

1. Move the allowed discipline IDs, alias table, inference function, and audience-label formatter into a pure module.
2. Normalize legacy tag/tool values by:
   - coercing valid strings only,
   - Unicode-normalizing,
   - trimming,
   - lowercasing,
   - treating punctuation, periods, hyphens, underscores, and repeated whitespace consistently,
   - and mapping known compact aliases such as `AfterEffects`, `Three.js`, and `threejs` to stable normalized keys.
3. Recognize at minimum:
   - `3D`, Houdini, Maya, Blender, 3ds Max, Cinema 4D, Substance Painter -> `3d-vfx`
   - AfterEffects, After Effects, Premiere/Premiere Pro, motion terms -> `motion`
   - Interactive, React, Three.js/threejs, WebGL, JavaScript -> `interactive`
   - Editing, Premiere/Premiere Pro, DaVinci Resolve, post-production terms -> `editing`
4. When a project has explicit Sanity disciplines, treat the normalized, allowed, de-duplicated explicit list as authoritative.
5. When explicit disciplines are absent, infer from both `tags` and `arsenal`.
6. Export a reusable formatter that maps `AfterEffects` and equivalent compact variants to `After Effects`.
7. Apply the formatter everywhere project tags or Arsenal names are shown, including Work cards and Project Detail.
8. In development/test mode, report any project that has no explicit or inferred discipline with its `_id` and title; do not expose this warning to production users.
9. Keep the Sanity inventory alias behavior aligned with the frontend helper and cover both implementations with the same reviewed examples.

Acceptance against the 13-project fixture/inventory:

- All shows 13 projects in the original featured/archive order.
- Interactive shows SIT Open House 2026.
- Motion Design shows the reviewed 10 projects.
- Save My World appears in 3D & VFX.
- Every project has at least one discipline.
- `AfterEffects` is absent from all audience-facing rendered text.
- Exactly one filter has `aria-pressed="true"`.
- The live result count matches rendered, non-hidden, tabbable project links after each transition.

### Step 5 - Make hash navigation reveal-aware and deterministic

Update:

- `frontend/src/App.jsx`
- `frontend/src/pages/Home.jsx`
- `frontend/src/components/ScrollReveal.jsx`
- `frontend/src/lib/navigation.js`
- `frontend/tests/e2e/hashNavigation.spec.js`

1. Keep the existing safe hash decoder and allowed homepage section IDs.
2. Read the current safe section hash in `Home` and mark the matching `ScrollReveal` wrapper as immediate.
3. Extend `ScrollReveal` with an explicit immediate/skip-animation mode that:
   - renders the target visible in the same React commit,
   - removes its entry transform,
   - disables the reveal transition for that targeted navigation,
   - and leaves normal viewport-driven reveals unchanged for non-hash browsing.
4. Refactor `ScrollManager` so it never repeatedly restarts a smooth scroll on every animation frame.
5. For initial load and POP/REPLACE navigation:
   - wait for the homepage project request to resolve to data, empty, or error,
   - wait until the targeted reveal wrapper is immediate/visible,
   - perform an `auto` alignment,
   - monitor the target's document position through a bounded stability window,
   - and use `auto` for any corrective alignment.
6. For user-initiated in-page PUSH navigation:
   - issue one smooth scroll,
   - wait for `scrollend` where supported with a timeout fallback,
   - then perform at most one non-animated correction if layout changed.
7. Monitor an ancestor/layout container or sample document position; do not rely only on a target `ResizeObserver` because transforms and upstream layout changes may not resize the target.
8. Cancel all animation frames, timers, observers, and event listeners on hash change or unmount.
9. Preserve invalid/unknown hash behavior: no throw, no forced scroll, and no false active section.

Browser acceptance:

- Fresh `/#works`, `/#resume`, and `/#contact` land within 4px of `header height + 20px` after settling.
- The same checks pass at 390x844, 768x1024, 1280x800, and 1440x900.
- Success, slow, empty, and failed Sanity responses all settle correctly.
- `/about` -> `/#resume`, same-page clicks, and browser back/forward align correctly.
- No correction occurs after the declared stability window.
- `/#%E0%A4%A` and unknown hashes remain nonfatal with no React page error.

### Step 6 - Complete client metadata and unmatched-route behavior

Create or update:

- `frontend/src/components/NotFound.jsx`
- `frontend/src/App.jsx`
- `frontend/src/components/BlogPost.jsx`
- `frontend/src/hooks/useDocumentMetadata.js`
- `frontend/tests/e2e/metadata.spec.js`

1. Add `excerpt` to the BlogPost query so client post descriptions match static route descriptions.
2. Add a wildcard `*` route after all valid routes.
3. Render a useful Not Found page with:
   - a non-misleading title and description,
   - `canonical: null`,
   - `noIndex: true`,
   - a link back to the homepage or Works,
   - and an H1 describing the missing page.
4. Keep project/post loading states canonical-free; apply `noindex` only after a missing/error state is known.
5. Ensure the metadata hook owns and restores every field it changes, including image alt text if added for route-specific images.
6. Ensure repeated navigation never creates duplicate canonical, description, Open Graph, Twitter, or robots elements.
7. Verify overlay metadata still restores the homepage immediately after close.

Acceptance:

- `/unknown-route` has a Not Found title, no canonical, and `noindex, nofollow` after client render.
- Unknown project and post routes never claim homepage or another detail canonical.
- Blog post client metadata uses the actual excerpt when present.
- Home -> project overlay -> close, project -> project, R&D -> post, Contact -> Home, and back/forward all restore correct metadata.
- Each managed selector appears at most once.

### Step 7 - Build one validated route and metadata manifest

Create or update:

- `frontend/scripts/routeManifest.js`
- `frontend/scripts/generateRouteHtml.js`
- `frontend/scripts/generateSitemap.js`
- optional `frontend/scripts/generateStaticArtifacts.js`
- `frontend/package.json`
- `frontend/tests/unit/routeManifest.test.js`
- `frontend/tests/e2e/staticMetadata.spec.js`

1. Create a pure manifest module responsible for:
   - canonical slug validation,
   - safe output route validation,
   - route uniqueness,
   - description normalization and 160-character bounding,
   - canonical URL construction,
   - required metadata validation,
   - HTML/XML escaping helpers,
   - and canonical route-set comparison.
2. Fetch published content once per production artifact generation with `useCdn: false`.
3. Query image data correctly using `mainImage.asset._ref`, an undereferenced `asset` reference, or `asset->url`; do not use `asset->{_ref}`.
4. Validate the image projection with a fixture and one read-only Sanity check so a populated image never silently becomes null.
5. Build the complete manifest in memory before writing:
   - `/`
   - `/contact`
   - `/rnd`
   - every canonical `/project/:slug`
   - every canonical `/rnd/:slug`
6. Validate raw required fields before interpolating titles so `undefined` cannot become a non-empty metadata string.
7. Generate route-specific HTML for every manifest route except `/`, whose Vite `index.html` is already the homepage shell.
8. Generate `dist/sitemap.xml` from the exact same manifest instance used for route HTML.
9. Compare the HTML route set and sitemap route set before final success; fail on missing, extra, or duplicate routes.
10. Make `generateSitemap.js` propagate failures with a nonzero exit code instead of logging and returning success.
11. Keep the manual `generate-sitemap` command for source/public refresh, but make the production build use the single-fetch static-artifact path.
12. Update package scripts while preserving:
   - `build:client` for pre-migration client verification,
   - `build` for Vite plus validated static artifacts,
   - clear standalone commands for route/sitemap diagnostics.
13. Preserve Vercel filesystem precedence and the SPA rewrite for unmatched client routes.

Acceptance:

- A content validation failure occurs before any route artifact write.
- `dist/contact/index.html` and `dist/rnd/index.html` have their own metadata.
- Every detail shell has its own title, description, canonical, OG image, and Twitter image.
- Cinder's read-only Sanity image projection produces its project image rather than the generic site image.
- The sitemap and generated HTML route sets are identical, with `/` intentionally represented only by `dist/index.html`.
- All inserted HTML and XML values are escaped.
- No-JavaScript reads of generated routes return route-specific metadata.

### Step 8 - Harden inventory and migration state handling

Update inside the recovered Sanity repository:

- `sanity/scripts/inventoryPortfolioSlugs.mjs`
- `sanity/scripts/migratePortfolioSlugs.mjs`
- `sanity/package.json`
- focused Node tests/fixtures under `sanity/scripts/__tests__/` or equivalent

1. Extract pure validation/state-classification helpers so they can be tested without a Sanity token or mutation client.
2. Require each approved map entry to contain:
   - document ID,
   - reviewed revision,
   - non-empty current slug,
   - canonical proposed slug,
   - and a non-empty, unique array of allowed disciplines.
3. Reject duplicate document IDs and duplicate proposed slugs.
4. Require the approved map to cover the full reviewed portfolio inventory when the migration is responsible for assigning disciplines to all projects.
5. Check proposed slugs against published documents outside the map and against relevant draft identities/slugs so a pending draft cannot create a later collision.
6. Classify each entry in this order:
   - `noop`: current slug, disciplines, and required legacy slug state already equal the desired state;
   - `change`: current slug and revision match the reviewed source state and a desired field differs;
   - `conflict`: missing document, stale revision, unexpected slug, partial/unreviewed state, invalid disciplines, or external collision.
7. Do not classify an entry as a no-op merely because the proposed slug and legacy slug match; disciplines must also match exactly after stable de-duplication.
8. Build `nextLegacySlugs` without empty or duplicate values and preserve reviewed existing legacy slugs.
9. Produce the full required redirect list from the approved map, including entries that are already applied, so rerunning the dry run still reports deployment requirements.
10. Abort on any conflict before creating a transaction.
11. Keep apply mode opt-in and token-gated; dry-run and tests must never require `SANITY_API_TOKEN`.
12. Use `ifRevisionId` for every patch and commit all changes in one transaction.
13. Print separate deterministic summaries for changes, no-ops, conflicts, and redirects.
14. Add unambiguous package commands for inventory, dry run, and apply; the apply command must still require both `--map` and `--apply`.

Acceptance:

- Empty disciplines, invalid discipline IDs, duplicate map entries, incomplete maps, stale revisions, partial states, and external collisions fail before transaction creation.
- A slug-already-applied/document-disciplines-missing fixture is a conflict or reviewed change, never a no-op.
- Running without `--apply` performs zero mutations and needs no token.
- A fully applied fixture produces zero changes, no duplicate legacy slugs, and the complete redirect list.
- Revision-aware apply tests use a fake client/transaction; no test touches production Sanity.

### Step 9 - Run all local gates before content approval

1. Run frontend unit tests, e2e tests, lint, client build, and design audit.
2. Run Sanity pure tests, inventory, and Studio build from the restored repository.
3. Run ParticleEarth lint, unit tests, build, and e2e tests even if its source did not change.
4. If ParticleEarth source changed, rebuild and sync only through the canonical sync script; otherwise verify the current synced asset set remains unchanged.
5. Run repository integrity checks for root, Sanity, and ParticleEarth.
6. Confirm the full frontend build fails only because the published noncanonical slugs remain unapproved/unmigrated.
7. Present the local results and remaining approval requirements.

Acceptance:

- All local behavior and regression tests pass.
- The only expected full-build blocker is canonical content.
- No remote write has occurred.

### Step 10 - Prepare the complete reviewed migration map

This step is read-only and approval-gated before apply.

1. Run the fresh inventory after repository recovery.
2. Produce a versioned, secret-free JSON map covering all 13 reviewed projects.
3. Use `dune-sand` for `dune sand` unless the user changes that proposal.
4. Leave the `NUHS` target explicitly unresolved until the user chooses `nuhs` or a more descriptive slug.
5. Include each project's reviewed revision and final disciplines.
6. Run the tokenless dry run.
7. Present:
   - all slug changes,
   - discipline changes,
   - no-ops,
   - conflicts,
   - external collision results,
   - and exact legacy redirect paths.
8. Stop and request approval for the final map and a separate explicit authorization to apply it.

Acceptance:

- The map is complete, collision-free, revision-current, and user-approved.
- The dry run reports no conflicts.
- No token is stored in the map or logs.
- No mutation has occurred.

### Step 11 - Apply the approved migration

Remote write: explicit authorization required.

1. Confirm the user has authorized this exact map and apply command.
2. Run one `--apply` transaction using the existing authenticated environment without printing the token.
3. Capture only non-sensitive transaction results.
4. Re-run the read-only inventory.
5. Re-run the dry run with the same map.
6. Confirm every entry is a no-op, every slug is canonical and unique, disciplines match the map, and legacy slugs contain no duplicates.
7. If apply fails, do not retry blindly; re-inventory and present the new conflict/state for review.

Acceptance:

- All 13 documents match the approved state.
- Every published slug matches `^[a-z0-9]+(?:-[a-z0-9]+)*$`.
- The second dry run produces zero changes and the complete redirect list.
- No unrelated document field changes.

### Step 12 - Add and verify legacy redirects

Local redirect edits may be prepared after map approval; deployment remains a separate remote write.

1. Add permanent 308 redirects in `frontend/vercel.json` for every reviewed legacy path.
2. Include browser-encoded legacy paths where required, especially `dune%20sand`.
3. Add the approved legacy `NUHS` path and any case-sensitive form that Vercel would otherwise treat separately.
4. Keep the React `legacySlugs` query/replace navigation as a client safety net.
5. Confirm all constructed frontend and ParticleEarth project paths use `encodeURIComponent` at the navigation boundary.
6. Add tests that each legacy URL resolves in exactly one redirect to the canonical destination and does not loop.
7. Confirm analytics receives the canonical slug after redirect or legacy lookup replacement.

Acceptance:

- `/project/dune%20sand` redirects once to `/project/dune-sand`.
- The approved NUHS legacy URL redirects once to its canonical destination.
- No redirect affects canonical routes, `/rnd`, `/contact`, or `/particle-earth/*`.

### Step 13 - Generate final artifacts and run the canonical build

1. Run the post-migration inventory and dry run.
2. Run frontend unit tests, e2e tests, lint, full production build, and design audit.
3. Verify the generated sitemap contains only canonical project URLs.
4. Verify route HTML and sitemap sets are identical.
5. Serve `frontend/dist` locally and make no-JavaScript HTTP reads for:
   - `/`
   - `/contact`
   - `/rnd`
   - one project
   - one R&D post.
6. Verify client-rendered Not Found metadata for an unmatched route and unknown project/post routes.
7. Re-run ParticleEarth and Sanity builds/tests so the release evidence covers all applications.
8. Run final root/nested repository integrity checks.

Acceptance:

- Full `npm run build` passes.
- Every generated detail route has its own valid image metadata.
- No noncanonical slug appears in sitemap, generated HTML, client navigation, or ParticleEarth messages.
- All automated and browser checks pass.

### Step 14 - Deploy only after explicit approval

Remote writes: explicit authorization required.

1. Present the final diff, migration result, redirects, generated route count, sitemap count, and verification summary.
2. Request explicit authorization for any required Sanity schema deployment.
3. Request explicit authorization for redirect/production deployment.
4. Deploy schema, frontend code, redirects, sitemap, and route HTML as one compatible release.
5. Do not deploy a frontend expecting canonical slugs before the migration is verified.

Acceptance:

- Deployment reaches a ready state without an incompatible intermediate release.
- Public canonical and legacy URLs behave as tested.

### Step 15 - Post-release monitoring

1. Verify public homepage, Contact, R&D, one project, and one R&D post.
2. Verify both legacy project URLs redirect once.
3. Inspect live HTML metadata and social images for representative routes.
4. Confirm PostHog pageviews and `project_opened` events contain canonical slugs.
5. Check 404s and legacy redirect traffic.
6. Confirm contact form success/failure behavior and client-error telemetry.
7. Confirm ParticleEarth readiness, fallback enable control, offscreen pause, and phone vertical scrolling.
8. Record results and any rollback decision in `.agent/CONTINUITY.md`.

## Verification commands

### Root repository

```text
git status --short --ignore-submodules=none
git ls-files -s sanity ParticleEarth
git diff --check
```

### Frontend before migration

From `frontend/`:

```text
npm run test:unit
npm run test:e2e
npm run lint
npm run build:client
npm run design-audit
```

The full build is expected to fail only on the two published noncanonical slugs until Step 11.

### Frontend after migration

From `frontend/`:

```text
npm run test:unit
npm run test:e2e
npm run lint
npm run build
npm run design-audit
```

### Sanity after repository recovery

From `sanity/`:

```text
git status --short
git diff --check
npm run build
npm run inventory:portfolio
npm run migrate:portfolio:dry-run -- --map=<reviewed-map>
```

Do not run an apply command until the reviewed map and remote write are explicitly authorized.

### ParticleEarth

Prefer Compose when available:

```text
docker compose exec app npm run lint
docker compose exec app npm run test:unit
docker compose exec app npm run build
docker compose exec app npm run test:e2e
```

If Docker is unavailable, use the existing local dependencies and record the limitation:

```text
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```

If ParticleEarth source changes, sync from `frontend/`:

```text
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\syncParticleEarth.ps1
```

## Required browser scenarios

- `/#works`, `/#resume`, and `/#contact` at 390x844, 768x1024, 1280x800, and 1440x900.
- Success, slow, empty, and failed Sanity responses for initial hash navigation.
- `/about`, browser back, and browser forward.
- malformed and unknown hashes.
- all Work filters and exact counts.
- Work card -> overlay -> close metadata restoration.
- project-to-project and R&D-to-post navigation.
- `/contact` empty and invalid-email submissions with no EmailJS request.
- drawer Tab/Shift+Tab wrap, Escape, close button, backdrop, active link, and focus restoration.
- unknown project, unknown R&D post, and unmatched route metadata.
- no-JavaScript metadata for every static route kind.
- legacy redirect paths and canonical destinations.
- no horizontal overflow or rejected CSP requests.

## Release gates

### Gate A - Repository integrity

- Sanity tracking is reproducible.
- Root, Sanity, and ParticleEarth diffs are visible in the correct repository.

### Gate B - Local correctness

- Steps 3-9 pass.
- No remote write has occurred.
- The only remaining build blocker is canonical content.

### Gate C - Content approval

- The user approves the final `NUHS` slug and complete map.
- The tokenless dry run is conflict-free.
- The user explicitly authorizes apply.

### Gate D - Canonical release candidate

- Migration is applied and idempotency is proven.
- Redirects, route HTML, and sitemap use the approved canonical map.
- Full cross-application verification passes.

### Gate E - Deployment approval

- The user explicitly authorizes schema/redirect/production deployment.

### Gate F - Production verification

- Public behavior, metadata, redirects, analytics, contact, and ParticleEarth checks pass.

## Definition of done

- Sanity changes are reproducibly tracked in the correct repository structure.
- Every confirmed defect has an automated regression test.
- Discipline inference handles reviewed aliases and normalization, and no raw `AfterEffects` label is rendered.
- The 13-project filter counts and ordering match the approved inventory.
- All valid homepage hashes settle within 4px at all four standard viewports.
- Unmatched routes, projects, and posts use correct noindex/canonical behavior.
- Blog client descriptions use queried excerpts.
- Static route images use actual Sanity images when available.
- Route HTML and sitemap come from one validated manifest and have identical route sets.
- Migration validation rejects incomplete, stale, colliding, empty-discipline, and partial states.
- An already-slugged but incorrectly disciplined item is never silently treated as a no-op.
- A second migration dry run is a true no-op without duplicate legacy slugs.
- All published project slugs and sitemap URLs are canonical.
- Legacy URLs redirect exactly once to their approved destinations.
- Frontend lint/unit/e2e/full build, Sanity build/tests, and ParticleEarth lint/unit/build/e2e pass.
- The synced ParticleEarth embed remains poster-first, scroll-safe, and free of standalone-control requests.
- No Sanity or production write occurs without explicit authorization.
- `.agent/CONTINUITY.md` records decisions, implementation progress, verification, approvals, and outcomes.
