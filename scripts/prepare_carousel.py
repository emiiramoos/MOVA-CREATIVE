"""Prepare the four authorized MOVA Drive clips for the on-page loop."""
from pathlib import Path
import json, subprocess, sys

source=Path(sys.argv[1])
assets=Path(__file__).resolve().parents[1]/'dist/assets'
shots=[('IMG_5716.mov','12-produccion-gastronomia',.35,7.5),
       ('IMG_9268.mov','13-sesion-playa',.1,3.9),
       ('IMG_7872.mov','14-luz-en-set',.1,3.9),
       ('IMG_9850.mov','15-produccion-barberia',.05,2.2)]
records=[]
for name,slug,start,duration in shots:
    out=assets/(slug+'.mp4')
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(start),'-i',str(source/name),
       '-t',str(duration),'-map','0:v:0','-an','-vf','scale=540:960:force_original_aspect_ratio=increase,crop=540:960,fps=24',
       '-c:v','libx264','-preset','medium','-crf','25','-pix_fmt','yuv420p',
       '-movflags','+faststart','-map_metadata','-1',str(out)],check=True)
    subprocess.run(['ffmpeg','-v','error','-y','-ss','0.5','-i',str(out),'-frames:v','1',
       '-quality','86',str(assets/(slug+'-poster.webp'))],check=True)
    records.append({'file':slug+'.mp4','source':name,'start':start,'duration':duration})
print(json.dumps(records,ensure_ascii=False,indent=2))
