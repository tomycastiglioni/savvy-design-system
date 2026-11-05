#!/bin/bash
# launch30-peek.sh — the 10 s website sneak-peek loops, from a Launch30Peek
# render of 0:02–0:18.7:
#   npx remotion render Launch30Peek out/launch30-peek-src.mov --codec=prores \
#     --prores-profile=hq --frames=120-1121 --muted
# Writes out/export/launch30-peek-2colors.{mp4,gif} and -3colors.{mp4,gif}.
#
# Both skip three stretches where nothing moves (0:03.75–0:04.4, 0:06.65–0:07.4,
# 0:10.55–0:11.5; identical frames, so the cuts don't show) and end with a
# 0.4 s crossfade into their own first frame, so they loop without a seam.
#   2colors: beige → green at normal speed, 0:02 → the phone landing (0:14.75).
#   3colors: beige → green → blue, 0:02 → the recap (0:18.6) at 1.425× speed,
#            then 0.4 s on the finished recap.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=out/launch30-peek-src.mov   # starts at 0:02, so file time = video time − 2
OUT=out/export
X=0.4                           # loop crossfade, s

# seg <start> <end> <label>: a piece of the source, by video time
seg() { echo "[0:v]trim=start=$(echo "$1-2" | bc -l):end=$(echo "$2-2" | bc -l),setpts=PTS-STARTPTS[$3];"; }
CUTS="$(seg 2.0 3.75 a)$(seg 4.4 6.65 b)$(seg 7.4 10.55 c)"

# loop <filter so far, ending in [seq]> <seq length> <name>: crossfade the
# last X s of [seq] under its first X s, keep the rest, then encode MP4 + GIF.
loop() {
  local f="$1" len="$2" name="$3"
  local body=$(echo "$len-$X" | bc -l)
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$SRC" -filter_complex "$f\
[seq]split=3[s1][s2][s3];\
[s1]trim=start=0:end=$X,setpts=PTS-STARTPTS,format=yuva444p,fade=t=in:st=0:d=$X:alpha=1[head];\
[s2]trim=start=$body:end=$len,setpts=PTS-STARTPTS[tail];\
[s3]trim=start=$X:end=$body,setpts=PTS-STARTPTS[mid];\
[tail][head]overlay=format=auto,format=yuv420p[blend];\
[blend][mid]concat=n=2,fps=60,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$OUT/$name.mp4" -filter_complex \
    "fps=25,scale=960:-1:flags=lanczos,split[p][q];[p]palettegen=max_colors=256:stats_mode=full[pal];[q][pal]paletteuse=dither=sierra2_4a" \
    -loop 0 "$OUT/$name.gif"
  echo "$name: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$name.mp4") s"
}

# 2 colours: 1.75 + 2.25 + 3.15 + 3.25 = 10.4 s → 10 s loop
loop "$CUTS$(seg 11.5 14.75 d)[a][b][c][d]concat=n=4[seq];" 10.4 launch30-peek-2colors

# 3 colours: 14.25 s of story at 1.425× = 10.0 s, plus 0.4 s on the recap → 10 s loop
K=1.425
# (the recap is still from 0:18.6, so its hold is the last frame held)
HOLD="[0:v]trim=start=16.6:end=16.68,setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=0.4,trim=end=0.4[e];"
loop "$CUTS$(seg 11.5 18.6 d)[a][b][c][d]concat=n=4,setpts=PTS/$K,fps=60[story];$HOLD[story][e]concat=n=2[seq];" 10.4 launch30-peek-3colors
