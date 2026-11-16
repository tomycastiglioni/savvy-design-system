#!/usr/bin/env bash
# Renders the meeting-steps ads (01–04, Innovation Campaign "01 — Meeting steps"):
#   scripts/meeting-steps-ads.sh               all formats
#   scripts/meeting-steps-ads.sh 1200x628      just those
# to out/ads/meeting-steps/<format>/savvy-meeting-steps-<nn>-<step>-<format>.mp4
# (h264, muted, 60 fps). Needs the ABC Diatype fonts in public/fonts/
# (licensed, not committed).
set -euo pipefail
cd "$(dirname "$0")/.."
formats=("$@")
[ ${#formats[@]} -eq 0 ] && formats=(4x5 1x1 9x16 1200x628)
ads=("01 AdPrep prep" "02 AdMeet meet" "03 AdCapture capture" "04 AdDeliver deliver")
for fmt in "${formats[@]}"; do
  mkdir -p "out/ads/meeting-steps/$fmt"
  for ad in "${ads[@]}"; do
    read -r nn id step <<<"$ad"
    npx remotion render src/index.ts "$id$fmt" "out/ads/meeting-steps/$fmt/savvy-meeting-steps-$nn-$step-$fmt.mp4" \
      --codec=h264 --crf=18 --muted --log=error
    echo "rendered savvy-meeting-steps-$nn-$step-$fmt.mp4"
  done
done
