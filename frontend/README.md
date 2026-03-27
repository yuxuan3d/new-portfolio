# Frontend

This app is the public React/Vite frontend for the portfolio. It keeps the existing Sanity portfolio/blog queries and EmailJS contact flow, but the home route is now a dark-only, CVIO-inspired one-page experience.

## Current Structure

- `/` is the canonical anchored home with `Home`, `Resume`, `Works`, `Blog`, and `Contact` sections.
- `/about` redirects to `/#resume`.
- `/project/:slug`, `/rnd`, `/rnd/:slug`, and `/contact` remain first-class routes and share the same visual system.
- The first screen on `/` embeds the separately built `ParticleEarth` app through an iframe at `/particle-earth/index.html?embed=1`.

## Content Sources

- Portfolio and R&D/blog content still come from Sanity.
- The contact form still uses EmailJS.
- No CMS schema migration is required for this frontend.

## Development

From `frontend/`:

```bash
npm install
npm run dev
```

Required environment variables:

```bash
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Particle Earth Sync

The earth hero is built in the sibling `ParticleEarth/` app, then copied into this app's static assets for deployment.

From `frontend/`:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\syncParticleEarth.ps1
```

That script:

1. runs `npm run build` inside `../ParticleEarth`
2. copies `../ParticleEarth/dist` into `frontend/public/particle-earth`

If you only need to recopy an already-built earth bundle, run:

```bash
node scripts/syncParticleEarth.mjs
```

## Verification

From `frontend/`:

```bash
npm run lint
npm run build
```

There is also a Playwright-based audit script:

```bash
npm run design-audit
```

It expects the site to already be reachable at `BASE_URL` or on a local dev server.
