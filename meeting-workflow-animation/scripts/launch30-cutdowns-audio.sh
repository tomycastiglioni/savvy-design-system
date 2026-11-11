#!/bin/bash
# launch30-cutdowns-audio.sh — the audio the 15 s and 6 s cutdowns
# (src/launch30/Cutdowns.tsx) need on top of the 30 s video's:
#   vo/05-deliver-first.mp3  "Afterwards, your recap is ready to send." (the
#                            deliver line's first sentence, 60 ms after it)
#   vo/06-close-tight.mp3    "Prep, meet, deliver, and so much more." with the
#                            pauses between the words cut to ~60 ms
#   vo/06a-prep … 06d-more   the same line in four parts ("Prep," "meet,"
#                            "deliver," "and so much more."), for the 6 s cut
#   music-slaptastic-15.mp3  the music for 15 s: the 30 s cut from its start to
#                            bar 6, then bar 16 and the final hit (13.27 s)
#   music-slaptastic-6.mp3   for 6 s: 0.57 s in to bar 2, then bar 16 and the
#                            final hit (4.7 s)
# The music is made from the 30 s cut (public/audio/launch30/
# music-slaptastic.mp3, built by launch30-music.sh; licensed, not in the repo).
# In it, bar n starts at 2n − 0.73 s, bar 16 at 29.27 s and the hit at 31.27 s;
# the joins are at bar lines with a 12 ms crossfade.
set -euo pipefail
cd "$(dirname "$0")/.."
A=public/audio/launch30
VO=$A/vo
MP3=(-c:a libmp3lame -b:a 192k)

ffmpeg -nostdin -hide_banner -loglevel error -y -i "$VO/05-deliver.mp3" \
  -af "atrim=0:2.565,afade=t=out:st=2.535:d=0.03" "${MP3[@]}" "$VO/05-deliver-first.mp3"

# cuts inside the three pauses (0.504–0.725, 1.206–1.387, 1.977–2.182 s),
# keeping 30 ms of each side
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$VO/06-close.mp3" -filter_complex \
  "[0:a]asplit=4[a][b][c][d];\
   [a]atrim=0:0.534,asetpts=PTS-STARTPTS[p];\
   [b]atrim=0.695:1.236,asetpts=PTS-STARTPTS[q];\
   [c]atrim=1.357:2.007,asetpts=PTS-STARTPTS[r];\
   [d]atrim=start=2.152,asetpts=PTS-STARTPTS[s];\
   [p][q][r][s]concat=n=4:v=0:a=1[o]" -map "[o]" "${MP3[@]}" "$VO/06-close-tight.mp3"

# the same line in its four parts, for the 6 s cut's beats (cuts mid-pause)
part() { ffmpeg -nostdin -hide_banner -loglevel error -y -i "$VO/06-close.mp3" -af "atrim=$1,asetpts=PTS-STARTPTS" "${MP3[@]}" "$VO/$2.mp3"; }
part 0:0.534 06a-prep
part 0.695:1.236 06b-meet
part 1.357:2.007 06c-deliver
part start=2.152 06d-more

music() {
  local from="$1" to="$2" out="$3"
  ffmpeg -nostdin -hide_banner -loglevel error -y -i "$A/music-slaptastic.mp3" -filter_complex \
    "[0:a]asplit=2[x][y];\
     [x]atrim=start=$from:end=$to,asetpts=PTS-STARTPTS[a];\
     [y]atrim=start=29.27,asetpts=PTS-STARTPTS[b];\
     [a][b]acrossfade=d=0.012:c1=qsin:c2=qsin,afade=t=in:d=0.06[m]" \
    -map "[m]" -c:a libmp3lame -b:a 256k "$out"
}
music 0 11.27 "$A/music-slaptastic-15.mp3"
music 0.57 3.27 "$A/music-slaptastic-6.mp3"

for f in "$VO/05-deliver-first.mp3" "$VO/06-close-tight.mp3" "$VO"/06?-*.mp3 "$A/music-slaptastic-15.mp3" "$A/music-slaptastic-6.mp3"; do
  echo "$f: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$f") s"
done
