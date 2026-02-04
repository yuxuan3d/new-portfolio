# Continuity Notes (Portfolio Website)

This document is a “grab-and-go” reference for future edits: what lives where, how data flows, how to run locally, and common gotchas.

## What this repo is

- A React + Vite portfolio site (`frontend/`) backed by Sanity CMS (`sanity/`).
- Key features: portfolio grid + project detail pages, an “R&D” blog, dark/light theme toggle, and a contact form (EmailJS).

## High-level architecture

- `frontend/` is a client-side rendered SPA (React Router).
- `sanity/` defines the content model (schemas) and provides the Studio to edit content.
- The site fetches content at runtime from Sanity using `@sanity/client`.

## Frontend entry points

- App + routing: `frontend/src/App.jsx`
- React mount: `frontend/src/main.jsx`
- HTML shell / meta tags / theme flash prevention: `frontend/index.html`
- Theme provider (localStorage + system preference): `frontend/src/context/ThemeContext.jsx`
- Theme hook + context (for lint/Fast Refresh): `frontend/src/context/useTheme.js`, `frontend/src/context/themeContext.js`
- Theme tokens for styled-components: `frontend/src/styles/theme.js`

## Routes (React Router)

Defined in `frontend/src/App.jsx`:

- `/` – Home (intro + featured work + project grid; Sanity `portfolioItem`)
- `/project/:slug` – Project detail page
- `/about` – About page
- `/contact` – Contact form + social links
- `/rnd` – R&D blog index (Sanity `blogPost`)
- `/rnd/:slug` – Blog post detail

## Sanity content model

Sanity schemas live in `sanity/schemaTypes/`.

### `portfolioItem` (used on `/` and `/project/:slug`)

Defined in `sanity/schemaTypes/portfolioItem.js`, queried by the frontend for:

- `title`, `slug`
- `mainImage` (grid tile)
- `additionalImages` (detail page gallery)
- `description`
- `arsenal[]` (tools/tech used)
- `tags[]`
- `featured` (homepage Featured Work toggle)
- `videoEmbeds[]` (embed HTML snippets)

### `blogPost` (used on `/rnd` and `/rnd/:slug`)

Defined in `sanity/schemaTypes/blogPost.js`, queried by the frontend for:

- `title`, `slug`, `publishedAt`, `mainImage`, `excerpt`, `tags`
- `body[]` (Portable Text)
  - Includes custom blocks like `youtube` (`sanity/schemaTypes/youtube.js`)

## Data fetching (Sanity)

- Client config + image URL helper: `frontend/src/lib/sanityClient.js`
  - Env vars: `VITE_SANITY_PROJECT_ID`, `VITE_SANITY_DATASET`, `VITE_SANITY_API_VERSION`
  - `urlFor(...)` builds optimized image URLs.
- Fetching hook: `frontend/src/hooks/useSanityData.js`
  - Simple in-memory cache + background revalidation.

## Images

- Portfolio grid uses `frontend/src/components/LazyImage.jsx`:
  - IntersectionObserver-based lazy loading
  - `srcSet` + `sizes`
  - Blur-up placeholder
- Blog post images use `frontend/src/components/BlogLazyImage.jsx` (simple fade-in).

## Contact form (EmailJS)

- UI + EmailJS integration: `frontend/src/components/Contact.jsx`
- Required env vars:
  - `VITE_EMAILJS_SERVICE_ID`
  - `VITE_EMAILJS_TEMPLATE_ID`
  - `VITE_EMAILJS_PUBLIC_KEY`

## SEO (robots + sitemap)

- `frontend/public/robots.txt`
- `frontend/public/sitemap.xml`
- Generator script: `frontend/scripts/generateSitemap.js`
  - Intended to query Sanity and write `frontend/public/sitemap.xml`.
  - Run from `frontend/` via `npm run generate-sitemap`.

## Local development

Frontend:

- `cd frontend`
- `npm install`
- `npm run dev`

Sanity Studio:

- `cd sanity`
- `npm install`
- `npm run dev`

## Deployment notes

- The frontend is designed for Vercel (SPA rewrite rules): `frontend/vercel.json`.
- Build output is `frontend/dist/` (standard Vite).

## Where to edit common things

- Header / nav links / site title: `frontend/src/components/SiteHeader.jsx`
- Footer links: `frontend/src/components/SiteFooter.jsx`
- Social links + external URLs: `frontend/src/constants/social.js`
- About page content: `frontend/src/components/About.jsx`
- Sanity queries (portfolio/blog): `frontend/src/pages/Home.jsx`, `frontend/src/components/RnDBlog.jsx`, `frontend/src/components/ProjectDetail.jsx`, `frontend/src/components/BlogPost.jsx`
