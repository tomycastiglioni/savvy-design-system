#!/bin/bash
# launch30-music.sh <original.mp3>
# Builds public/audio/launch30/music-slaptastic.mp3, the cut of "Slaptastic"
# (Steven Beddall, Creative Cut · Beat, 120 BPM) used by Launch30. The track
# is licensed, so neither the original nor the cut is in this repo.
#
# Bars start at 0.045 s + 2 s × n (bar 0 is a soft intro bar). Each cut drops
# bar 15 (a repeat of bar 13; 12 ms crossfade at the bar line), so its final
# hit, bar 17, lands 30 s after bar 1. Bar 1 is placed at the logo time
# (timeline.ts, L.logoIn: 31.07 s) − 30 s = 1.07 s, so the hit lands on the
# logo; the cut comes in that far before bar 1, partway into the intro bar,
# and the one-bar break (bar 8, 15.07 s) falls on the meeting capture.
# Rebuild after any change to the timeline that moves the logo.
set -euo pipefail
cd "$(dirname "$0")/.."
cut() {
  local bar1="$1" out="$2"
  local start; start=$(printf "%.3f" "$(echo "2.045 - $bar1" | bc -l)")
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$ORIG" -filter_complex \
    "[0:a]aresample=48000,asplit=2[x][y];\
     [x]atrim=start=$start:end=30.045,asetpts=PTS-STARTPTS[a];\
     [y]atrim=start=32.033,asetpts=PTS-STARTPTS[b];\
     [a][b]acrossfade=d=0.012:c1=qsin:c2=qsin,afade=t=in:d=0.06[m]" \
    -map "[m]" -c:a libmp3lame -b:a 256k "$out"
  echo "wrote $out"
}
ORIG="$1"
cut 1.07 public/audio/launch30/music-slaptastic.mp3
