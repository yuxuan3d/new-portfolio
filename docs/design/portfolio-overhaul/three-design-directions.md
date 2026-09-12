# Three portfolio directions

Research checked2026-09-09T15:22Z. User requested three distinct improvement suggestions after rejecting realistic water. The contour-water replacement is implemented separately; the directions below are proposals, not approved site-wide changes.

## What the references demonstrate

- [Lusion](https://lusion.co/): inspected the loaded opening in Chrome and primary page content. Large framed 3D imagery, a direct description of its practice, a prominent reel, featured projects and a separate Labs destination. The current opening has a light surround; borrow media hierarchy and coherent art direction, not an inaccurately described all-dark palette.
- [Unseen's2025 review](https://2025.unseen.co/): inspected its black/yellow opening with ASCII texture and oversized mixed typography. Primary page content interleaves completed client projects, motion R&D, interactive petal experiments and process work. Borrow the mixture of outcomes and experimentation. Keep this portfolio one-page and avoid copying the reference's long chronological structure.
- [Aristide Benoist](https://aristidebenoist.com/): inspected the loaded dark, sparse opening with an image strip, small peripheral navigation and an index. Rendered content includes project type, role, client and concise descriptions. Borrow precise hierarchy and purposeful metadata; preserve original portfolio colours and accessible navigation. The web text extractor saw only a loader, so the design observations come from the rendered browser, not that extraction.

My assessment of our current site: the enlarged carousel improved hierarchy, but the rest still repeats covers with short discipline lists. A visitor has little opportunity to discover the making of the work or recognize a distinct authorial identity. Changing the background alone will not resolve that content/composition problem.

## 1. Cinematic showcase

Reference: Lusion's media-led presentation. Keep the dark gradient and best-project switcher, simplify frame furniture, bring the existing showreel action into the opening and use one restrained title transition with each project change. Contours become a sparse stage floor. Below awards, show two or three large, alternating project features with a second detail frame and one concise contribution statement instead of repeating the same thumbnail grid.

Feels polished and cinematic; strongest when owned source clips become available. Existing YouTube links can remain intentional play destinations without extracting or auto-embedding their footage. More frame glow would not replace stronger project media.

## 2. Experimental field notes — recommended

Reference: Unseen's mixture of client work, R&D and process. Treat yxperiments as a working creative practice: dark ink, one deliberate signal accent, small frame numbers and contours as a recurring graphic signature. Keep SIT as lead. Add an optional finished/process view where appropriate assets exist, and expose two or three curated R&D previews on the homepage after selected work. Preserve the awards-before-work order.

Cinder's actual character/capture imagery and SIT's process or alternate campus frames offer possible starting points, subject to curation. Show one useful explanation of the creative decision or contribution, not a list of software. Phone controls remain tap-based and vertical scrolling stays native.

Feels personal, curious and technically creative. It makes discovery substantive and fits the existing name. Requires choosing real process material and editing brief captions; source video is helpful but not a prerequisite.

## 3. Editorial art portfolio

Reference: Aristide's dark gallery, clear index and project metadata. Use an expressive custom wordmark, charcoal/ivory with muted colour, a disciplined image index and fewer rounded containers. Keep the hero switcher but make its titles and numbering the dominant graphics. Below awards, alternate a wide image with a smaller offset portrait/detail and short project context. Turn recognition into a compact, carefully typeset credit block with the existing SIT collaboration attribution.

Contours become quiet hairlines at the hero boundary. Hover/focus reveals may show project context, with persistent equivalents on phones. Avoid wheel hijacking or hiding information behind a custom cursor.

Feels like an art-directed publication. It works best with the existing stills and is the simplest to deliver, but offers less playful exploration than option2.

## Shared contour-water implementation

`ExperienceWater.jsx` now draws26 unfilled SVG contours in one full-width region beneath the project stage. Two layers drift slowly on supported desktop states; colour follows the existing scene palette. Phone/reduced-motion/offscreen/tab/overlay behavior remains static or suspended, and the surface fades before the scroll cue. The gap and reserved gallery geometry are unchanged.

Removed `waterRenderer.js`, image reflection capture, canvas and WebGL. No project or award is reflected. The build/lint and all9 gallery browser tests pass, including no canvas/image sources in the water, motion/static pixels, controls, responsive geometry, blocker resilience and route restoration. Captures: [laptop](contour-water-laptop.png), [phone](contour-water-phone.png). No deployment or CMS writes.
