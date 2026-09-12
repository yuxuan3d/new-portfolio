# Particle Sea motion update

Implemented locally on 2026-09-10 from the user's supplied [Particle Sea clip](https://www.youtube.com/watch?v=Jz-w5jMb410). The downloaded source is 720×900, 30 fps, approximately five seconds. No Sanity record was changed. The homepage only selects this motion when its Sanity hero is Particle Sea; other artwork keeps its own image.

The edit begins half a second into the source and blends the final half-second into the opening half-second, producing a 4.5-second repeating sequence. Both exports use the same edit:

| Asset | Purpose | Format | Size |
| --- | --- | --- | --- |
| `frontend/public/media/particle-sea-loop.mp4` | Homepage motion | H.264, 720×900, 30 fps, no audio, fast-start | 1,512,979 bytes |
| `frontend/public/media/particle-sea-loop-560.gif` | Downloadable GIF | 560×700, 12 fps, 128 colors, infinite repeat | 11,890,753 bytes |

The particle detail is expensive to encode as GIF. Using MP4 on the page preserves smoother, full-color motion at about 13% of the GIF's transfer size. The homepage never requests the GIF. The Sanity still stays underneath until playback begins and is retained if autoplay or media loading fails. Motion is removed when offscreen, behind a popup, in a hidden document, or when reduced motion/data saving is enabled.

An acid-yellow asterisk rotates every 20 seconds beside the headline, with matching marks near About and contact. Hover adds a brief half-turn. Each mark pauses offscreen, and global motion preferences suspend it.

## Reproduction

The source copy is preserved locally in ignored `frontend/artifacts/kinetic/particle-sea-source.mp4`. It was obtained using the official yt-dlp release zipapp inside the project container. FFmpeg 6.1.1 was installed inside that container only; no host or frontend package installation is required. A fresh container needs FFmpeg for conversion, but serving/building the existing exports does not.

From `frontend/`, with FFmpeg available in the container:

```sh
docker compose exec app sh scripts/createParticleSeaLoop.sh artifacts/kinetic/particle-sea-source.mp4
```

`createParticleSeaLoop.sh` accepts a different local source path and an optional output directory. It writes both exports with the same crossfade, strips audio and marks the GIF for infinite repeat.

## Verification

Lint and full production build passed. The 19-test browser suite includes actual video progression, offscreen/overlay removal, reduced-motion and data-saving download avoidance, media-failure fallback, asterisk rotation/hover, responsive geometry and existing navigation. The hover check deliberately bypasses stable-position waiting because the decorative target continuously rotates.

The live-content production audit passed on 1440×900 desktop and 390×844 phone: muted playback, the 4.5-second repeat boundary, one H1, no page errors, no failed images and no horizontal overflow. Current captures and lab observations are linked from [the implementation report](implementation.md). No deployment was performed.
