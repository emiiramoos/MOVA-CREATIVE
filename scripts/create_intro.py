"""Five approved scenes, identical edit decisions on desktop and mobile."""
from pathlib import Path
import subprocess,json,sys,tempfile,os
ROOT=Path(__file__).resolve().parents[1]
ASSET=ROOT/'dist/assets'
SRC=Path(os.environ.get('MOVA_MASTERS_DIR','/workspace/scratch/568c74930376/mova-masters'))
TMP=Path(tempfile.mkdtemp(prefix='mova-intro-v3-'))
# The food master contains distinct seafood (2.05–3.85 s) and burrito (4.2–6.8 s) shots.
SHOTS=[
 {'scene':'Atardecer','source':'06-atardecer','start':1,'duration':3.6,'focal_y':.22},
 {'scene':'Playa desde el aire','source':'05-dron-cancun','start':1,'duration':3.6,'focal_y':.4},
 {'scene':'Mariscos','source':'01-gastronomia','start':2.05,'duration':1.8,'focal_y':.45},
 {'scene':'Burritos','source':'01-gastronomia','start':4.2,'duration':2.6,'focal_y':.76,'focal_y_end':.52},
 {'scene':'Casa','source':'02-sayab-interiores','start':.2,'duration':3.6,'focal_y':.5},
]
FADE=.3
DURATION=round(sum(s['duration']-FADE for s in SHOTS),3)
def run(args):
 subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-threads','2','-filter_threads','1','-filter_complex_threads','1']+args,check=True)
def make(mode):
 w,h=(1280,720) if mode=='desktop' else (720,1280)
 files=[]
 for i,shot in enumerate(SHOTS):
  path=TMP/f'{mode}-{i}.mp4';files.append(path)
  focal=f"({shot['focal_y']}+{shot.get('focal_y_end',shot['focal_y'])-shot['focal_y']}*t/{shot['duration']})"
  vf=f"scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}:(iw-ow)/2:(ih-oh)*{focal},setsar=1,fps=30,eq=contrast=1.025:saturation=0.96:brightness=-0.005,format=yuv420p"
  run(['-ss',str(shot['start']),'-i',str(SRC/(shot['source']+'-master.mp4')),'-t',str(shot['duration']),'-an','-vf',vf,'-c:v','libx264','-crf','18','-preset','veryfast','-threads','2',str(path)])
  subprocess.run(['ffprobe','-v','error','-show_entries','format=duration',str(path)],stdout=subprocess.DEVNULL,check=True)
 inputs=[]
 for path in files+[files[0]]:inputs+=['-i',str(path)]
 graph=[]
 for i in range(6):
  length=SHOTS[i]['duration'] if i<5 else FADE
  graph.append(f'[{i}:v]trim=duration={length},setpts=PTS-STARTPTS,settb=1/30[v{i}]')
 current='v0';offset=0
 for i in range(1,6):
  offset+=SHOTS[i-1]['duration']-FADE
  graph.append(f'[{current}][v{i}]xfade=transition=fade:duration={FADE}:offset={offset:.3f}[x{i}]');current=f'x{i}'
 graph.append(f'[{current}]trim=start={FADE}:end={DURATION+FADE},setpts=PTS-STARTPTS,format=yuv420p[out]')
 output=ASSET/f'11-intro-{mode}.mp4'
 run(inputs+['-filter_complex',';'.join(graph),'-map','[out]','-an','-c:v','libx264','-crf','23','-preset','veryfast','-threads','2','-movflags','+faststart','-map_metadata','-1',str(output)])
 run(['-i',str(output),'-frames:v','1','-c:v','libwebp','-quality','90',str(ASSET/f'11-intro-{mode}-poster.webp')])
 print(mode,output.stat().st_size,flush=True)
for mode in (sys.argv[1:] or ['desktop','mobile']):make(mode)
(ROOT/'intro-edit.json').write_text(json.dumps({'version':3,'duration':DURATION,'transition_seconds':FADE,'loop':'tail returns to first shot; first fade interval removed for continuous wrap','shots':SHOTS,'identical_shots_on_all_devices':True,'audio':False},ensure_ascii=False,indent=2)+'\n')
