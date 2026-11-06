#!/bin/bash
# more-ways-export.sh — the seven "More ways" card loops for the website, at
# 2× their Figma size, into out/more-ways/export/:
#   mov/      ProRes 4444 with alpha (masters; Safari's HEVC-with-alpha is
#             made from these on a Mac, see README)
#   webm/     VP9 with alpha (Chrome, Firefox, Edge)
#   webp/     animated WebP with alpha, 30 fps (every browser, Safari too, as
#             a plain image)
#   preview/  MP4 on the site's card glass, for review
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=out/more-ways/export
mkdir -p "$OUT/mov" "$OUT/webm" "$OUT/webp" "$OUT/preview"
names=(say:01-just-say-what-you-need know:02-know-more-than-they-expect report:03-every-report-sounds-like-you
  day:04-start-the-day monitor:05-monitor-across-your-book hunt:06-skip-the-data-hunting more:07-and-a-whole-lot-more)
for pair in "${names[@]}"; do
  card=${pair%%:*}
  name=${pair#*:}
  npx remotion render "MoreWays-$card" "$OUT/mov/$name.mov" --codec=prores --prores-profile=4444 \
    --pixel-format=yuva444p10le --image-format=png --scale=2 --log=error
  ffmpeg -nostdin -v error -y -i "$OUT/mov/$name.mov" -c:v libvpx-vp9 -pix_fmt yuva420p -crf 30 -b:v 0 \
    -row-mt 1 -auto-alt-ref 0 -deadline good -cpu-used 2 -an "$OUT/webm/$name.webm"
  python3 -I scripts/more-ways-webp.py "$OUT/mov/$name.mov" "$OUT/webp/$name.webp"
  npx remotion render "MoreWays-$card-preview" "$OUT/preview/$name.mp4" --codec=h264 --crf=18 --scale=2 --muted --log=error
  echo "exported $name"
done
