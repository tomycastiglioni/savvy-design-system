#!/bin/bash
# launch30-peek.sh — the website sneak-peek loops, from a Launch30Peek render
# of 0:01.4–0:18.7:
#   npx remotion render Launch30Peek out/launch30-peek-src.mov --codec=prores \
#     --prores-profile=hq --frames=84-1121 --muted
# Writes out/export/launch30-peek-2colors.{mp4,gif} and -3colors.{mp4,gif}.
#
# Both skip three stretches where nothing moves (0:03.75–0:04.4, 0:06.65–0:07.4,
# 0:10.55–0:11.5; identical frames, so the cuts don't show). Each file opens on
# the client list at rest (0:02, just before it scrolls) and ends with a 0.4 s
# crossfade from its last moment into the list rising in, which runs straight
# into that first frame: no seam, and the first frame (the poster) is clean.
#   2colors: beige → green at normal speed, 0:02 → the phone landing (0:14.75).
#   3colors: beige → green → blue, 0:02 → the recap (0:18.6) at 1.425× speed,
#            then 0.4 s on the finished recap.
# Both run 10.4 s.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=out/launch30-peek-src.mov   # starts at 0:01.4, so file time = video time − 1.4
OFF=1.4
OUT=out/export
X=0.4                           # loop crossfade, s

# seg <start> <end> <label>: a piece of the source, by video time
# (printf, since bc writes ".2" and ffmpeg wants "0.2")
num() { printf "%.3f" "$(echo "$1" | bc -l)"; }
seg() { echo "[0:v]trim=start=$(num "$1-$OFF"):end=$(num "$2-$OFF"),setpts=PTS-STARTPTS[$3];"; }
# the first segment starts X (in loop time) before 0:02: that bit is the list
# rising in, used only under the crossfade at the end
cuts() { echo "$(seg "$1" 3.75 a)$(seg 4.4 6.65 b)$(seg 7.4 10.55 c)"; }

# loop <filter so far, ending in [seq]> <seq length> <name>: play [seq] from X
# on, then crossfade its last X s into its first X s (which leads straight
# back to the file's first frame; the fade completes two frames early, so
# nothing of the end is left when it wraps); encode MP4 + GIF.
loop() {
  local f="$1" len="$2" name="$3"
  local body=$(echo "$len-$X" | bc -l)
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$SRC" -filter_complex "$f\
[seq]split=3[s1][s2][s3];\
[s1]trim=start=0:end=$X,setpts=PTS-STARTPTS,format=yuv444p[head];\
[s2]trim=start=$body:end=$len,setpts=PTS-STARTPTS,format=yuv444p[tail];\
[s3]trim=start=$X:end=$body,setpts=PTS-STARTPTS[mid];\
[tail][head]blend=all_expr='A+(B-A)*min(1\,T/$(num "$X-2/60"))',format=yuv420p[blend];\
[mid][blend]concat=n=2,fps=60,format=yuv420p[v]" \
    -map "[v]" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart "$OUT/$name.mp4"
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$OUT/$name.mp4" -filter_complex \
    "fps=25,scale=960:-1:flags=lanczos,split[p][q];[p]palettegen=max_colors=256:stats_mode=full[pal];[q][pal]paletteuse=dither=sierra2_4a" \
    -loop 0 "$OUT/$name.gif"
  echo "$name: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/$name.mp4") s"
}

# 2 colours: 2.15 + 2.25 + 3.15 + 3.25 = 10.8 s → 10.4 s loop
loop "$(cuts 1.6)$(seg 11.5 14.75 d)[a][b][c][d]concat=n=4[seq];" 10.8 launch30-peek-2colors

# 3 colours: 14.82 s of story at 1.425× = 10.4 s, plus 0.4 s on the recap → 10.4 s loop
# (it starts 0.4 × 1.425 = 0.57 s before 0:02)
K=1.425
# (the recap is still from 0:18.6, so its hold is the last frame held)
HOLD="[0:v]trim=start=$(num "18.6-$OFF"):end=$(num "18.68-$OFF"),setpts=PTS-STARTPTS,tpad=stop_mode=clone:stop_duration=0.4,trim=end=0.4[e];"
loop "$(cuts 1.43)$(seg 11.5 18.6 d)[a][b][c][d]concat=n=4,setpts=PTS/$K,fps=60[story];$HOLD[story][e]concat=n=2[seq];" 10.8 launch30-peek-3colors
