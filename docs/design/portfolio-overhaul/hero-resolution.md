# Hero sizing, source imagery and phone composition
Historical v4 design decisions resolved 2026-09-08. The user-approved [immersive hero revision](immersive-hero.md) now governs geometry, typography, Cinder composition, phone layout and water. The asset references below remain valid; the old row budgets and pause controls are preserved only as design history. Companion to [Plan.md](../../../Plan.md).

Latest user QC supersedes the water and effects-control details in the initial row studies below: exactly one viewport-wide water plane,28px desktop/22px phone below the active frame,132px/128px deep, with image-only reflections and a shared horizon. Pause effects is removed. Phone controls are previous44px / flexible centred count / next44px, followed by three equal selectors. Main media and caption row budgets stay the same. Stable panels transition smoothly; phone/reduced-motion water remains static. See [current verification and captures](implementation-verification.md).

## 1. Laptop geometry
Use normal document flow; these are target row budgets at default text size, not absolute-positioned text or fixed-height clipping. Measure the CSS viewport excluding browser chrome.

At **1280×800**, 64px outer content gutters, active media frame **672×378 (16:9)**:

| Element | Top–bottom (CSS px) | Height |
| --- | --- | --- |
| Header | 0–64 | 64 |
| Identity + one-line headline | 64–176 | 112 |
| Gap | 176–192 | 16 |
| Active project frame | 192–570 | 378 |
| Gap | 570–586 | 16 |
| Title, role and project action | 586–642 | 56 |
| Gap | 642–654 | 12 |
| Switcher and effects controls | 654–698 | 44 |
| Gap | 698–714 | 16 |
| Scroll cue | 714–746 | 32 |
| Transition spacing | 746–778 | 32 |
| Recognition heading begins | 778 | natural height |

This arithmetic places the complete hero and cue before 800px. Recognition can begin at the fold; its full content does not need to fit. Caption is aligned with the active frame, with title/role left and a 44px-high action right. If actual font metrics or text wrapping require more room, grow the caption and allow page scrolling; never hide or overlap controls.

Use a 52px/60px desktop H1 at this size, then 64px/72px at 1440×900. At 1440×900 the frame may grow to 768×432, with intro124px: cue ends812px and Recognition begins844px. Cap further enlargement at768px media width. A short laptop viewport (height below760px) uses a576×324 frame and44px/52px headline. Keep natural overflow; never force the hero to100vh or shrink interactive targets to fit.

Desktop side previews are recessed, decorative companions at up to0.72 of active size, with at most5deg tilt. Clip horizontal decorative overflow at the gallery wrapper only; preserve focus rings on controls outside it. Select projects using named buttons/links. The numbered selector order remains SIT → JPMorgan → Cinder; side previews are not additional focusable project actions.

At width768–1099 use one centered flat frame, width min(640px, viewport minus64px), with no neighboring cards. At width below768 use the phone rules. Tall tablets retain breathing room through natural spacing rather than stretching the image to fill the screen.

Water adds **zero layout height**. It begins at the project-frame bottom, occupies at most120px on desktop, and becomes transparent before the scroll cue. Captions and controls remain opaque/readable foreground. Reflection sources are project imagery only, aligned to the current frame transforms; no headings, actions, controls or awards are mirrored.

## 2. Final media selection
Read-only published Sanity query at **2026-09-08T13:02:34.537Z**. Exact document IDs, asset references, dimensions and query URL are saved in [hero-media-inventory-2026-09-08.json](hero-media-inventory-2026-09-08.json). Gallery indices below are zero-based discovery locations, **not stable runtime selectors**.

| Project | Chosen source and treatment | Resolution/use |
| --- | --- | --- |
| SIT Open House 2026 | Gallery index7, asset `image-51afde07df8421194186f86a7b061e19b37441eb-1920x1080-png`: [original campus render](media-review/sit-open-house-2026-7.png). Clean landscape architecture, sky and trees; no fabricated otter or UI. | 1920×1080; fills desktop and phone16:9 frames. Supports768px at2× density. |
| JPMorgan SAEI | Main asset `image-ea495433d01714c174f7f534bcb617b7c69ac3e9-1920x1080-jpg`. Reviewed crop `rect=800,60,1100,619`: [pineapple crop](media-review/jpmorgan-hero-crop.jpg). Keeps pineapple/living room and excludes baked campaign copy/logo strip from this preview. Full campaign remains in project detail. | 1100×619 effective crop. Request no more than1100px wide; at672px it supplies1.64× density, at768px1.43×. Accept this source limit; no AI upscale or promise of retina2× on desktop. At350px phone width it supports2× comfortably. |
| Cinder | A paired contained composition: [original350×350 portrait](reference-cinder.jpg), asset `image-6cb458474016f4b556f7de38ba5798f4b979bfef-350x350-jpg`, and [500×500 live-capture photograph](media-review/cinder-0.jpg), asset `image-be8828d4785d430e30f16b4be57141c6abf1d844-500x500-jpg`. Labels “Character” / “Live capture”. Preserve the existing face blur. | Desktop portrait175×175 CSS px plus capture200×200, centered side by side with24px gap inside the same landscape matte frame. Phone140×140 each with16px gap. Both support2× density. Never enlarge the portrait to fill the whole landscape frame. |

**Correction:** the larger Cinder500px asset is a production photograph, not a higher-resolution version of the character. It is chosen to explain the live-capture work. A new portrait export is optional polish, no longer a dependency for this contained design.

The SIT3840×2160 walkway image (gallery8) is suitable for a different selected-work/detail view. The2902×1346 cafeteria screenshot (gallery9) contains baked UI and is better reserved for explaining the actual experience. The original681px square SIT cover remains available for small thumbnails. Additional JPMorgan frames contain large baked campaign copy/disclaimers; do not stretch those into a clean poster or erase their text with image generation.

Implement a local hero presentation map keyed by **project document ID + asset reference**, never gallery array position. Resolve selected asset references from each live record's mainImage/additionalImages; request asset metadata in the homepage projection. Store the JPMorgan hero-only rectangle in this map, leaving the CMS mainImage crop/hotspot and other page uses unchanged. Apply this explicit rectangle once; do not also apply the main-image crop. Default to the existing image builder/hotspot for other images. No CMS mutation or schema change is required.

Missing selected media: render the live mainImage contained in the same matte stage, preserving title and destination. If the Cinder capture image is missing, center the portrait at its capped size. If a project is unavailable, retain Plan.md's deterministic published-project fallback. Reserve frame space before images load. Do not let generated mockup artwork or downloaded review files become production source assets.

Image request targets: SIT desktop1344/1536px and phone700px; JPMorgan desktop capped1100px and phone700px; Cinder original350/500px maximum. Use smaller derivatives for numbered thumbnails if shown. Measure encoded sizes against Plan.md's budgets; these request sizes have not been benchmarked as a loaded page.

Short role lines are editorial paraphrases of published descriptions: SIT “Art direction · 3D · Character animation”; JPMorgan “Storyboards · 3D · Post-production”; Cinder “Team leadership · Real-time mocap”. Keep SIT's collaboration credit with awards/details; no solo-ownership claim.

## 3. Phone composition
At **390×844**,20px gutters yield350px content width. One flat active frame; no miniature desktop carousel, horizontal peeks or pointer tilt.

| Element | Top–bottom (CSS px) | Height |
| --- | --- | --- |
| Header | 0–56 | 56 |
| Identity + two-line H1 | 56–184 | 128 |
| Media frame | 184–381 | 197 (350×9/16 rounded) |
| Gap | 381–397 | 16 |
| Title, role, full-width action | 397–525 | 128 |
| Gap | 525–537 | 12 |
| Previous / count / next / Pause effects | 537–581 | 44 |
| Gap | 581–593 | 12 |
| Three numbered project buttons | 593–637 | 44 |
| Gap | 637–661 | 24 |
| Scroll cue | 661–693 | 32 |
| Transition spacing | 693–733 | 40 |
| Recognition begins | 733 | natural height |

H1 at36px/40px; identity13px; title24px/28px; role15px/18px, reserved two lines. Caption budget: title28 + gap8 + role36 + gap12 + action44 =128px. Use the loaded font and test wrapping; no text truncation. Header brand plus44px Menu target. The navigation opens a compact accessible menu containing existing anchors.

Control row fits350px: previous44 + gap8 + count54 + gap8 + next44 + gap8 + Pause effects128 =294px; distribute remaining room without shrinking targets. Numbered selectors have equal columns, each at least44px tall; use compact visible labels “01 SIT”, “02 JPM”, “03 Cinder” and full accessible project names. Keep selected outline, index and current-state semantics. Pause effects persists across slide changes.

At320px width, use16px gutters (288px inner width),32px/36px H1 and a162px-high media stage. Control row:44+4+44+4+44+4+128=272px. Cinder images reduce to120px each, with16px gap. If copy still wraps, rows grow and scroll normally. At200% zoom do not enforce the first-screen fit target.

Phone reflection has max80px depth (approximately381–461 in the390px study), reduced opacity around15–20%, no extra water spacer and no side-panel reflections. It fades well before the cue. Use static water by default on phone; enable motion only if a later device profile supports it. Pause effects remains available to control other decorative movement; reduced-motion renders immediate gallery changes and static reflections. Awards remain unchanged across all selected projects and always credit SIT Open House2026; never JPMorgan or Cinder.

Horizontal swipes change selection only after clear directional intent; vertical scroll remains native. All three states share frame/caption/control allocations, preventing slide-dependent jumps. “View project” opens the existing project overlay; closing restores selected slide, focus and scroll.

## 4. QC artifacts and implementation checks
- [Laptop concept](desktop-concept-v4.png) shows the reduced opening hierarchy and stage.
- [Phone states](mobile-concept-v4.png) shows all three projects, source-based compositions and stable award attribution.
- Exact prompts are saved as `mockup-prompt-v4-*.txt`. The first phone draft is retained as historical and has superseded attribution errors.
- Generated images are visual illustrations, not pixel-accurate browser captures. They approximate project imagery, frame proportions and control sizing. In particular, the desktop illustration enlarges Cinder's side preview, while production must obey the175/200px caps above. **The numeric layout and original Sanity assets take precedence.** Never ship rasterized/generated interface text or replacement artwork.
- The row arithmetic has been checked; actual font wrapping, overflow, interaction, texture cost and byte budgets await implementation. At1280×800 verify every hero action/control/cue fits. At390×844 verify all three states plus the start of Recognition; at320px/200% zoom verify accessible natural overflow. Also cover1440×900, tablet768×1024 and short landscape.
- Test all media as the active slide, image failure, content fallback, long role text, reduced motion, effects pause, resize and overlay return. Check no layout shift on switching. Confirm award attribution never binds to active project and water never reflects awards.
