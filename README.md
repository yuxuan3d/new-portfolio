# Portfolio Website

This workspace contains the public portfolio frontend, the Sanity Studio content backend, and the standalone `ParticleEarth/` app that is embedded into the first screen of the home page.

## Current Experience

- `/` is now the canonical dark-only, CVIO-inspired one-page route.
- The home page is split into `Home`, `Resume`, `Works`, `Blog`, and `Contact` sections.
- `/about` redirects to `/#resume`.
- `/project/:slug`, `/rnd`, `/rnd/:slug`, and `/contact` remain active and share the same design system.
- The first viewport embeds the separate `ParticleEarth` build so visitors can interact with the earth model immediately.

## Workspace Layout

- `frontend/`: public React/Vite site
- `sanity/`: Sanity Studio content backend
- `ParticleEarth/`: standalone interactive earth app used for the home hero embed

## Stack

- React 18
- Vite
- styled-components
- React Router
- Sanity client
- EmailJS

## Data Flow

- Portfolio and R&D/blog content still come from Sanity.
- The contact form still uses EmailJS.
- This redesign does not require backend or CMS schema changes.

## Local Development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Sanity Studio:

```bash
cd sanity
npm install
npm run dev
```

Frontend environment variables:

```bash
VITE_SANITY_PROJECT_ID=your_project_id
VITE_SANITY_DATASET=production
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Particle Earth Embed Workflow

From `frontend/`, rebuild and sync the hero embed with:

```bash
powershell -NoProfile -ExecutionPolicy Bypass -File scripts\syncParticleEarth.ps1
```

That script builds `../ParticleEarth` and copies its output into `frontend/public/particle-earth`.

## Verification

Frontend:

```bash
cd frontend
npm run lint
npm run build
```

Particle Earth:

```bash
cd ParticleEarth
npm run lint
npm run test:unit
npm run build
npm run test:e2e
```
