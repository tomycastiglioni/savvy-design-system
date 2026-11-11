#!/bin/bash
# hero-export.sh — the website hero's six pill graphics, at 2× (1240×720),
# into out/hero/export/:
#   mov/      ProRes 4444 with alpha (masters; Safari's HEVC-with-alpha is made
#             from these on a Mac, see README)
#   webm/     VP9 with alpha (Chrome, Firefox, Edge)
#   webp/     animated WebP with alpha, 30 fps (every browser, Safari too)
#   preview/  MP4 on the hero's background, for review
#   png/      each graphic's finished state, transparent, no cursor
# `hero-export.sh scenarios prep` does just those.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=out/hero/export
mkdir -p "$OUT/mov" "$OUT/webm" "$OUT/webp" "$OUT/preview" "$OUT/png"
names=(scenarios:hero-01-financial-planning-scenarios prep:hero-02-automated-meeting-prep
  summaries:hero-03-customizable-meeting-summaries contacts:hero-04-household-contact-summaries
  report:hero-05-performance-report-builder prospect:hero-06-prospect-analysis)
only=("$@")
for pair in "${names[@]}"; do
  pill=${pair%%:*}
  name=${pair#*:}
  if [ ${#only[@]} -gt 0 ] && [[ ! " ${only[*]} " =~ " $pill " ]]; then continue; fi
  npx remotion render "Hero-$pill" "$OUT/mov/$name.mov" --codec=prores --prores-profile=4444 \
    --pixel-format=yuva444p10le --image-format=png --scale=2 --log=error
  ffmpeg -nostdin -v error -y -i "$OUT/mov/$name.mov" -c:v libvpx-vp9 -pix_fmt yuva420p -crf 30 -b:v 0 \
    -row-mt 1 -auto-alt-ref 0 -deadline good -cpu-used 2 -an "$OUT/webm/$name.webm"
  python3 -I scripts/more-ways-webp.py "$OUT/mov/$name.mov" "$OUT/webp/$name.webp"
  npx remotion render "Hero-$pill-preview" "$OUT/preview/$name.mp4" --codec=h264 --crf=18 --scale=2 --muted --log=error
  npx remotion still "Hero-still-$pill" "$OUT/png/$name.png" --scale=2 --log=error
  echo "exported $name"
done
