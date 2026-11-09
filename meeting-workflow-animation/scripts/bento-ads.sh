#!/usr/bin/env bash
# Renders the six bento ads (Innovation Campaign, "03 — Feature bento"):
#   scripts/bento-ads.sh            all formats
#   scripts/bento-ads.sh 4x5 1x1    just those
# to out/ads/bento/<format>/savvy-bento-<nn>-<name>-<format>.mp4 (h264,
# muted, 60 fps, one seamless loop each). Needs the ABC Diatype fonts in
# public/fonts/ (licensed, not committed).
set -euo pipefail
cd "$(dirname "$0")/.."
formats=("$@")
[ ${#formats[@]} -eq 0 ] && formats=(4x5 1x1 9x16)
ads=("07 say just-say" "08 know know-more" "09 report every-report" "10 day start-the-day" "11 monitor year-end-rmds" "12 hunt skip-the-pdf-hunt")
for fmt in "${formats[@]}"; do
  mkdir -p "out/ads/bento/$fmt"
  for ad in "${ads[@]}"; do
    read -r nn card name <<<"$ad"
    npx remotion render src/index.ts "AdBento-$nn-$card-$fmt" "out/ads/bento/$fmt/savvy-bento-$nn-$name-$fmt.mp4" \
      --codec=h264 --crf=18 --muted --log=error
    echo "rendered savvy-bento-$nn-$name-$fmt.mp4"
  done
done
