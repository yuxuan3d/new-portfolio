#!/bin/sh
# Run in the project container with FFmpeg installed. The source is the user's
# Particle Sea clip (https://www.youtube.com/watch?v=Jz-w5jMb410), 720x900, 30fps.
set -eu
source_video=${1:?Pass the local source video path}
output_dir=${2:-public/media}
mkdir -p "$output_dir"
# Move the opening half-second to the end and crossfade into it. The last frame
# then meets the first at the same point in the source, avoiding a hard reset.
ffmpeg -hide_banner -loglevel error -y -i "$source_video" -filter_complex \
  "[0:v]fps=30,split[a][b];[a]trim=start=0.5:end=5,setpts=PTS-STARTPTS[body];[b]trim=end=0.5,setpts=PTS-STARTPTS[head];[body][head]xfade=transition=fade:duration=0.5:offset=4,format=yuv420p" \
  -an -c:v libx264 -preset slow -crf 25 -movflags +faststart "$output_dir/particle-sea-loop.mp4"
# The downloadable GIF shares the same edit. The homepage uses MP4 for much
# smaller transfer size, smoother playback, and full-colour particle detail.
ffmpeg -hide_banner -loglevel error -y -i "$output_dir/particle-sea-loop.mp4" -filter_complex \
  "fps=12,scale=560:-1:flags=lanczos,split[colors][frames];[colors]palettegen=max_colors=128:stats_mode=diff[palette];[frames][palette]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
  -an -loop 0 "$output_dir/particle-sea-loop-560.gif"
