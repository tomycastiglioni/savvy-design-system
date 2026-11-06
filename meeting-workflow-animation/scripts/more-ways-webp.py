# more-ways-webp.py <master.mov> <out.webp> [fps]
# Animated WebP with transparency from a ProRes 4444 master: plays as a plain
# image in every current browser, Safari included. Colour is lossy, alpha is
# kept exact (lossy alpha lets earlier frames show through later ones).
import subprocess
import sys

from PIL import Image

src, out = sys.argv[1], sys.argv[2]
fps = int(sys.argv[3]) if len(sys.argv) > 3 else 30
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries", "stream=width,height", "-of", "csv=p=0:s=x", src], capture_output=True, text=True, check=True)
w, h = map(int, probe.stdout.strip().split("x"))
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", src, "-vf", f"fps={fps}", "-f", "rawvideo", "-pix_fmt", "rgba", "-"], capture_output=True, check=True).stdout
size = w * h * 4
frames = [Image.frombytes("RGBA", (w, h), raw[i : i + size]) for i in range(0, len(raw), size)]
# Exact frame times (33/34 ms), so the loop keeps its length.
durations = [round((i + 1) * 1000 / fps) - round(i * 1000 / fps) for i in range(len(frames))]
# A keyframe at least every 6 frames (0.2 s): anything a frame inherits from
# the last (a passing cursor, a placeholder) is gone before it can be seen.
frames[0].save(
    out,
    save_all=True,
    append_images=frames[1:],
    duration=durations,
    loop=0,
    quality=82,
    alpha_quality=100,
    method=6,
    kmin=3,
    kmax=6,
)
print(f"{out}: {len(frames)} frames, {w}×{h}")
