# Dark colour options

Update 2026-09-10: the user selected **Charcoal + ember** and approved implementation. See the [completed implementation](implementation.md); the options below remain research history.

Researched 2026-09-10T08:52+08:00. The user approved the field-notes composition, requested slowly moving contours, and reopened colour selection because petrol felt bland. No palette is selected yet; these options supersede petrol as the default recommendation, not the application theme.

## Recommendation

**Charcoal + ember**: an almost neutral warm-black canvas, ember-orange controls, warm-white headings and a small lavender accent on selected contour crests. This adds warmth and contrast to the site's graphic elements while leaving the project imagery unfiltered. Use the lavender sparingly; orange stays the only primary action colour. A dark local gradient behind the stage supplies depth without washing every section in a strong hue.

| Option | Base → gradient | Primary accent | Secondary detail | Heading | Character and tradeoff |
| --- | --- | --- | --- | --- | --- |
| Charcoal + ember — recommended | `#100E0D` → `#352019` | `#FF9966` | `#C2B6FF` | `#F5EFE6` | Warm and cinematic; keep brown restricted to the gradient so the site stays crisp. |
| Aubergine + lilac | `#100D18` → `#302047` | `#C6A5FF` | `#FF91C8` | `#F3EEFF` | Expressive and experimental; avoid neon glow or a purple wash over the artwork. |
| Midnight + ice | `#090F1E` → `#152C58` | `#9DC6FF` | `#B9ABFF` | `#F0F4FF` | Precise and technical; coolest and most conventional option here. |
| Oxblood + coral | `#150D12` → `#421C2A` | `#FF9B9B` | `#E9CA93` | `#FFF0E8` | Rich editorial warmth; strongest background personality, requiring restraint near Cinder's red clothing. |

All are custom adaptations rather than copied palettes or a measured popularity ranking. The inline comparison uses the same original Cinder portrait and identical layout for all four; colours do not tint the image. Its small repeated studies illustrate palette and movement, not final hero sizing or functional site navigation.

## Research and application

- [Happy Hues palette 13](https://www.happyhues.co/palettes/13) explicitly pairs near-black `#0F0E17` with orange `#FF8906` and warm secondary accents. It informs the charcoal/ember option; ours reduces saturation, warms the text and uses dark button lettering instead of copying its white-on-orange combination. Page has no explicit palette publication date; accessed 2026-09-10.
- [Happy Hues palette 12](https://www.happyhues.co/palettes/12) pairs dark blue `#232946` with pale rose `#EEBBC3` and periwinkle `#B8C1EC`. This supports a dark chromatic base with pale contrasting accents. Midnight/ice and oxblood/coral are our own variations, not colours claimed to appear on that page. Accessed 2026-09-10.
- [Dracula's official palette](https://draculatheme.com/contribute) documents a community dark theme with purple `#BD93F9`, pink `#FF79C6` and light foreground `#F8F8F2`. Borrow the lilac/pink relationship for the aubergine option, not the full syntax-highlighting palette. It is an application-theme reference, not a portfolio layout. Accessed 2026-09-10.
- [Linear's design account](https://linear.app/now/how-we-redesigned-the-linear-ui), published 2024-03-28, separates base colour, accent and contrast and describes reducing blue tint in its UI surfaces. The useful lesson here is to strengthen the accent without saturating every dark surface.
- [Radix's colour-scale guidance](https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale) assigns distinct roles to backgrounds, borders, interaction states and text. Use semantic roles in the existing theme; no Radix dependency is proposed. Accessed 2026-09-10.
- [Halo Lab's black/orange website examples](https://www.halo-lab.com/blog/black-and-orange-websites/) supplied additional web-design examples, including its use of violet as a secondary accent. Search checked 2026-09-10. Examples demonstrate the combination's use; they do not establish market share.

## Readability checks

Calculated sRGB contrast for the exact opaque swatches above. Heading/brightest-gradient endpoint ratios are 12.45–13.39:1; supporting text ratios are 6.96–7.31:1 using respectively `#BDB1A8`, `#BDB0CE`, `#AABAD3`, `#CBB0BA`. Dark lettering on primary action fill is 9.17–10.88:1. These are palette checks only, not a complete accessibility audit of all rendered states. Decorative contour opacity is deliberately lower and must not carry information.

## Approved movement and review follow-through

Proposed next implementation target: 24s and 32s per direction on the two line layers (48s and 64s complete return loops), small smooth travel and no pulsing. Keep one contour field and the clear air gap. Preserve phone/reduced-motion static behaviour and offscreen/hidden/overlay suspension. The user requested slow motion; no new requirement to animate phones was inferred.

The [Astra medium review](astra-medium-review.md) passed all nine targeted browser tests, lint and full production build for the current implementation. It found that the desktop contour fade endpoint extends beyond the scroll cue. During the approved design implementation, fix the fade endpoint and add a geometry regression that checks both the last visible contour and cue clearance. Existing tests establish motion/gap behaviour but do not cover that endpoint.

Finished / Field notes switching and curated R&D previews are still approved design work awaiting implementation and real content curation. This pass produced options and review evidence; it did not change application source or select a palette for the user.
