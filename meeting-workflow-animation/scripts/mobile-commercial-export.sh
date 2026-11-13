#!/bin/bash
# mobile-commercial-export.sh — the commercial's three phone screens
# (src/mobile-commercial/Animated.tsx), 1080×2348 at 60 fps, into
# out/mobile-commercial/export/:
#   mov/     ProRes 422 HQ with the UI sounds (masters for the edit)
#   mp4/     H.264 with the UI sounds
#   silent/  H.264, no audio
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=out/mobile-commercial/export
mkdir -p "$OUT/mov" "$OUT/mp4" "$OUT/silent"
pairs=(meeting:commercial-01-meeting plan:commercial-02-retirement-plan notification:commercial-03-0-notification recap:commercial-03-follow-up)
[ $# -gt 0 ] && pairs=("$@")   # e.g. notification:commercial-03-0-notification
for pair in "${pairs[@]}"; do
  key=${pair%%:*}
  name=${pair#*:}
  npx remotion render "MobileCommercial-$key" "$OUT/mov/$name.mov" --codec=prores --prores-profile=hq --log=error
  ffmpeg -nostdin -v error -y -i "$OUT/mov/$name.mov" -c:v libx264 -preset slow -crf 16 -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$OUT/mp4/$name.mp4"
  ffmpeg -nostdin -v error -y -i "$OUT/mp4/$name.mp4" -c:v copy -an -movflags +faststart "$OUT/silent/$name-silent.mp4"
  echo "exported $name"
done
