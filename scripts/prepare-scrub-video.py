"""Encode the supplied clips for accurate, low-latency browser seeking.

Usage: python3 scripts/prepare-scrub-video.py FFMPEG CLIP_ONE CLIP_TWO OUTPUT
"""
from pathlib import Path
import subprocess
import sys

ffmpeg, first, second, destination = sys.argv[1:]
output = Path(destination)
output.mkdir(parents=True, exist_ok=True)

# Continuous camera movement keeps the subject in a generous square composition
# on phones. The video sits in the lower part of the black hero, below the copy.
# Skip the second clip's opening arm reset, cutting directly to the matching
# hands-around-clay pose. 15 frames at 24 fps; resulting film is about 19.3 seconds.
second_start = .625
camera = [(0,.73),(3,.73),(5.3,.56),(7.2,.56),(10,.55),(12.5-second_start,.48),(15-second_start,.49),(17.5-second_start,.51),(20-second_start,.51)]
focus = str(camera[-1][1])
for (start,a),(end,b) in reversed(list(zip(camera,camera[1:]))):
    t = f'((t-{start})/{end-start})'
    ease = f'({t}*{t}*(3-2*{t}))'
    focus = f'if(lt(t,{end}),{a}+({b-a})*{ease},{focus})'
crop = f"crop=2160:2160:x='min(iw-ow,max(0,iw*({focus})-ow/2))':y=0,scale=1080:1080:flags=lanczos"

for variant, transform in [('desktop','scale=1920:1080:flags=lanczos'),('mobile',crop)]:
    filters = f'[0:v]setpts=PTS-STARTPTS[first];[1:v]trim=start={second_start},setpts=PTS-STARTPTS[second];[first][second]concat=n=2:v=1:a=0,{transform},colorchannelmixer=rr=.9:gg=.9:bb=.9,fps=24,format=yuv420p[out]'
    command = [ffmpeg,'-hide_banner','-loglevel','warning','-y','-i',first,'-i',second,
        '-filter_complex',filters,'-map','[out]','-an','-c:v','libx264','-preset','slow',
        '-crf','23','-g','24','-keyint_min','24','-sc_threshold','0','-bf','0',
        '-movflags','+faststart',str(output / f'{variant}.mp4')]
    subprocess.run(command,check=True)
    subprocess.run([ffmpeg,'-hide_banner','-loglevel','warning','-y','-i',str(output / f'{variant}.mp4'),
        '-frames:v','1','-c:v','libwebp','-quality','92',str(output / f'poster-{variant}.webp')],check=True)
    print(f'{variant}: {(output / f"{variant}.mp4").stat().st_size / 1024**2:.1f} MB',flush=True)
