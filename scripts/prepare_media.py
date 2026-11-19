import json,subprocess,concurrent.futures,shutil,xml.etree.ElementTree as ET
from pathlib import Path
from PIL import Image
ET.register_namespace('','http://www.w3.org/2000/svg')
src=Path('/workspace/scratch/568c74930376/mova-assets');out=Path(__file__).resolve().parents[1]/'dist'/'assets'
for p in src.joinpath('imagenes').glob('*.webp'):
 if p.stat().st_size:shutil.copyfile(p,out/p.name)
 else:
  base,width=p.stem.rsplit('-',1)
  im=Image.open(src/'imagenes'/(base+'-alta.jpg')).convert('RGB');im.thumbnail((int(width),10000));im.save(out/p.name,quality=88,method=4)
for p in src.joinpath('posters').glob('*.jpg'):
 a=Image.open(p).convert('RGB');a.thumbnail((1440,1440));a.save(out/(p.stem+'-poster.webp'),quality=86,method=3)
# Only the original path artwork is retained; crop its supplied artboard and remove background rectangle.
for filename,name,box in [('LOGO.svg','mova-logo.svg','160 240 490 130'),('ISO-EN-NEGATIVO.svg','mova-isotipo.svg','215 215 365 180')]:
 root=ET.parse(src/'identidad'/filename).getroot()
 for parent in root.iter():
  for child in list(parent):
   if child.tag.split('}')[-1]=='rect':parent.remove(child)
 if box:root.set('viewBox',box)
 root.set('role','img');root.set('aria-label','MOVA');ET.ElementTree(root).write(out/name,encoding='unicode')
# Responsive film exports. Keep the reviewed originals outside the public checkout.
def video(p):
 name=p.name;w,h=(1280,720) if name in ['00-hero-desktop.mp4','09-lumea.mp4'] else (720,1280)
 args=['ffmpeg','-v','error','-y','-threads','2','-filter_threads','1','-i',str(p),'-an','-vf',f'scale={w}:{h},fps=30','-c:v','libx264','-preset','veryfast','-crf','25','-pix_fmt','yuv420p','-movflags','+faststart','-map_metadata','-1','-threads','2',str(out/name)]
 subprocess.run(args,check=True,capture_output=True);print(name,(out/name).stat().st_size,flush=True)
 return {'file':name,'bytes':(out/name).stat().st_size,'width':w,'height':h}
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:stats=list(pool.map(video,sorted(src.joinpath('clips').glob('[0-9]*.mp4'))))
(Path(__file__).resolve().parents[1]/'media-sizes.json').write_text(json.dumps(stats,indent=2));print('MEDIA READY',flush=True)
