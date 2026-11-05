#!/bin/bash
# launch30-music.sh <original.mp3>
# Builds public/audio/launch30/music-slaptastic.mp3, the 30 s cut of
# "Slaptastic" (Steven Beddall, Creative Cut · Beat, 120 BPM) used by Launch30.
# The track is licensed, so neither the original nor the cut is in this repo.
#
# Bars start at 0.045 s + 2 s × n. The cut starts 1.6 s in (end of the intro
# bar, so bar 1 lands at 0:00.445), drops bars 13–14 (bar 15 repeats bar 13,
# 12 ms crossfade at the bar line) and keeps the ending, so the break (bar 8)
# falls at 0:14.445 and the final hit (bar 17) at 0:28.445, on the logo.
set -euo pipefail
cd "$(dirname "$0")/.."
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$1" -filter_complex \
  "[0:a]aresample=48000,asplit=2[x][y];\
   [x]atrim=start=1.6:end=26.045,asetpts=PTS-STARTPTS[a];\
   [y]atrim=start=30.033,asetpts=PTS-STARTPTS[b];\
   [a][b]acrossfade=d=0.012:c1=qsin:c2=qsin,afade=t=in:d=0.06[m]" \
  -map "[m]" -c:a libmp3lame -b:a 256k public/audio/launch30/music-slaptastic.mp3
echo "wrote public/audio/launch30/music-slaptastic.mp3"
