from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit,unquote
from PIL import Image
import re,json,hashlib,subprocess,xml.etree.ElementTree as ET,concurrent.futures
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';errors=[];warnings=[]
class Doc(HTMLParser):
 def __init__(self,path):super().__init__();self.path=path;self.refs=[];self.ids=set();self.h1=0;self.lang=False;self.csp=False;self.labels=set();self.controls=[];self.dialogs=[];self.dialog_targets=[];self.counts={};self.forms=0
 def handle_starttag(self,tag,items):
  a=dict(items)
  for cls in a.get('class','').split():self.counts[cls]=self.counts.get(cls,0)+1
  if tag=='label' and a.get('for'):self.labels.add(a['for'])
  if tag in ['input','select','textarea']:self.controls.append(a.get('id'))
  if tag=='dialog':self.dialogs.append(a.get('id'))
  if 'data-open-dialog' in a:self.dialog_targets.append(a['data-open-dialog'])
  if tag=='form':self.forms+=1
  if tag=='html':self.lang=a.get('lang')=='es-MX'
  if tag=='h1':self.h1+=1
  if 'id' in a:
   if a['id'] in self.ids:errors.append(f'{self.path}: duplicate id {a["id"]}')
   self.ids.add(a['id'])
  if tag=='meta' and a.get('http-equiv')=='Content-Security-Policy':self.csp=True
  if tag=='img':
   for key in ['alt','width','height']:
    if key not in a:errors.append(f'{self.path}: img missing {key}')
  if tag=='script' and not a.get('src'):errors.append(f'{self.path}: inline script')
  if any(k.lower().startswith('on') for k in a):errors.append(f'{self.path}: inline event handler')
  if 'style' in a:errors.append(f'{self.path}: inline style')
  for key in ['href','src','poster','data-src']:
   if key in a:self.refs.append(a[key])
  if 'srcset' in a:self.refs += [part.strip().split()[0] for part in a['srcset'].split(',')]
  if tag=='form' and a.get('action')!='https://wa.me/529982401868':errors.append('Unexpected form destination')
  if tag=='video' and 'autoplay' in a:errors.append('Unconditional autoplay in HTML')
docs={}
for path in DIST.rglob('*.html'):
 d=Doc(str(path.relative_to(DIST)));d.feed(path.read_text());docs[path]=d
 if d.h1!=1:errors.append(f'{path}: expected one h1, got {d.h1}')
 if not d.lang or not d.csp:errors.append(f'{path}: missing lang/CSP')
for path,d in docs.items():
 for target in d.dialog_targets:
  if target not in d.dialogs:errors.append(f'{path}: missing dialog {target}')
 for control in d.controls:
  if not control or control not in d.labels:errors.append(f'{path}: unlabeled input {control}')
 if d.forms>1:errors.append(f'{path}: multiple quote forms')
 for ref in d.refs:
  u=urlsplit(ref)
  if u.scheme in ['javascript','data']:errors.append(f'{path}: unsafe ref {ref[:50]}');continue
  if u.scheme or u.netloc:continue
  target=(DIST/unquote(u.path).lstrip('/')) if u.path.startswith('/') else path.parent/unquote(u.path)
  if not u.path:target=path
  if target.is_dir():target=target/'index.html'
  if not target.exists():errors.append(f'{path}: broken {ref}')
  elif u.fragment and target in docs and u.fragment not in docs[target].ids:errors.append(f'{path}: absent anchor {ref}')
home=docs[DIST/'index.html']
for cls,count in {'sector-card':6,'service-flip':4,'method-step':5,'map-pin':5,'floating-piece':0,'experience-dialog':0,'solution-card':6,'loop-film':8}.items():
 if home.counts.get(cls,0)!=count:errors.append(f'Homepage {cls}: expected {count}')
for path in [DIST/'index.html',DIST/'contacto/index.html']:
 text=path.read_text()
 if text.count('data-quote-service')!=7:errors.append(f'{path}: expected seven quote services')
 state_select=re.search(r'<select id="quote-state"[^>]*>(.*?)</select>',text,re.S)
 if not state_select or state_select.group(1).count('<option')!=33:errors.append(f'{path}: missing Mexico state options')
 if not re.search(r'<input id="quote-sector"',text):errors.append(f'{path}: business activity must be free text')
for forbidden in ['01 / Trabajo que se ve','03 / Dentro del estudio','06 / Tu siguiente paso','Reducir movimiento','Encuentra<br>tu siguiente','Conectamos con','Cuéntanos dónde está tu proyecto','Estrategia, identidad y producción.','Otra mirada.','Tu industria','Explora el estudio','Todo el trabajo','Selección en movimiento','case-format','spiral-chapter','id="service-fotografia"','Cámaras profesionales, drones y una producción']:
 if forbidden in (DIST/'index.html').read_text():errors.append('Removed homepage copy remains: '+forbidden)
edit=json.loads((ROOT/'intro-edit.json').read_text())
if [s['scene'] for s in edit['shots']]!=['Atardecer','Playa desde el aire','Mariscos','Burritos','Casa']:errors.append('Wrong hero edit order')
if not edit['identical_shots_on_all_devices']:errors.append('Device-specific scene replacement')
home_text=(DIST/'index.html').read_text()
if home_text.index('id="en-produccion"')>home_text.index('id="como-ayudamos"'):errors.append('Reel must precede solutions')
if home_text.index('id="como-ayudamos"')>home_text.index('id="metodologia"'):errors.append('Solutions must precede methodology')
if not re.search(r'</section><section class="methodology-chapter"',home_text):errors.append('Services must lead directly to methodology')
for removed in ['Descubre MOVA','data-rail-prev','data-rail-next','data-reel-toggle','film-toggle','id="estudio"']:
 if removed in home_text:errors.append('Removed homepage element remains: '+removed)
if (DIST/'proyectos/lumea/index.html').exists():errors.append('Removed Lumea project remains')
for path in DIST.glob('proyectos/*/index.html'):
 text=path.read_text()
 for removed in ['Una mirada al proyecto','<figcaption>','<p class="eyebrow">Video ·','El encuadre se acerca a las piezas','La secuencia de cocina se acompaña','La identidad reúne el emblema','Un formato vertical que acompaña','El video recorre momentos']:
  if removed in text:errors.append(f'{path}: removed project copy remains: {removed}')
jewelry=(DIST/'proyectos/joyeria-editorial/index.html').read_text()
if 'dsc00066-' in jewelry or '<figcaption>' in jewelry:errors.append('Removed jewelry image or captions remain')
if len(re.findall(r'<figure>',jewelry))!=3 or '/assets/09-lumea.mp4' not in jewelry:errors.append('Jewelry must preserve three photos and include the transferred video')
for path in DIST.glob('*.js'):
 text=path.read_text()
 for ref in re.findall(r"['\"](/assets/[^'\"]+)['\"]",text):
  if not (DIST/ref.lstrip('/')).exists():errors.append(f'{path}: missing dynamic asset {ref}')
 for ref in re.findall(r"from ['\"](\./[^'\"]+)['\"]",text):
  if not (path.parent/urlsplit(ref).path).exists():errors.append(f'{path}: missing module {ref}')
images=[]
for path in DIST.rglob('*.webp'):
 try:
  with Image.open(path) as im:
   im.load();images.append({'file':str(path.relative_to(DIST)),'width':im.width,'height':im.height,'bytes':path.stat().st_size})
   if im.getexif():errors.append(f'Unexpected EXIF {path}')
 except Exception as e:errors.append(f'{path}: {e}')
svgs=[]
for path in DIST.rglob('*.svg'):
 root=ET.parse(path).getroot()
 for el in root.iter():
  tag=el.tag.split('}')[-1].lower()
  if tag in ['script','foreignobject','iframe','image']:errors.append(f'Active SVG element {path}: {tag}')
  for key,value in el.attrib.items():
   key=key.split('}')[-1].lower()
   if key.startswith('on'):errors.append(f'SVG event {path}')
   if key in ['href','src'] and not value.startswith('#'):errors.append(f'SVG external ref {path}')
  if tag=='style' and re.search(r'@import|url\(\s*[\'"]?(?!#)[a-z]',el.text or '',re.I):errors.append(f'SVG CSS external reference {path}')
 svgs.append(path.name)
for path in DIST.rglob('*'):
 if path.is_file() and path.suffix in ['.js','.html','.css','.json']:
  text=path.read_text()
  for pattern in [r'sk-[a-zA-Z0-9]{20}',r'gh[pousr]_[A-Za-z0-9]{20}',r'(?i)(?:access_token|refresh_token|client_secret)\s*[=:]',r'drive\.google\.com',r'X-Amz-Signature',r'innerHTML\s*=',r'\beval\s*\(']:
   if re.search(pattern,text):errors.append(f'Sensitive/unsafe pattern {path}: {pattern}')
  if re.search(r'[↗→←↓↑▶Ⅱ×✕✓✔✗✘\U0001F000-\U0001FAFF]',text):errors.append(f'Decorative glyph remains: {path}')
  if path.stat().st_size>1000000:errors.append(f'Oversized code {path}')

def check_video(path):
 probe=subprocess.run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(path)],capture_output=True,text=True,check=True)
 data=json.loads(probe.stdout);streams=data['streams'];v=next(s for s in streams if s['codec_type']=='video')
 assert not any(s['codec_type']=='audio' for s in streams),'Unexpected audio'
 assert v['codec_name']=='h264' and v['pix_fmt']=='yuv420p','Wrong codec'
 assert path.stat().st_size<4000000,'Video over 4MB'
 expected=edit['duration'] if path.name.startswith('11-intro') else 18.2 if path.name.startswith('10-intro') else 12 if path.name.startswith('00-hero') else {'01':10,'02':7,'03':8,'04':8,'05':8,'06':8,'07':8,'08':7,'09':8,'12':7.5,'13':3.9,'14':3.9,'15':2.2,'16':12}[path.name[:2]]
 assert abs(float(data['format']['duration'])-expected)<.1,'Duration mismatch'
 subprocess.run(['ffmpeg','-v','error','-threads','2','-i',str(path),'-f','null','-'],capture_output=True,check=True)
 blob=path.read_bytes();assert blob.find(b'moov')<blob.find(b'mdat'),'No faststart'
 return {'file':str(path.relative_to(DIST)),'duration':data['format']['duration'],'size':path.stat().st_size,'resolution':f"{v['width']}x{v['height']}",'sha256':hashlib.sha256(blob).hexdigest(),'full_decode':'pass'}
videos=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 for path,result in zip(sorted(DIST.glob('assets/*.mp4')),pool.map(check_video,sorted(DIST.glob('assets/*.mp4')))):videos.append(result)
report={'html_pages':len(docs),'images_decoded':len(images),'svg_reviewed':svgs,'videos':videos,'public_bytes':sum(p.stat().st_size for p in DIST.rglob('*') if p.is_file()),'errors':errors,'limitations':['Desktop browser preview checked; automated mobile/tablet viewport checks blocked by socket EPERM when launching headless Chromium.','No real-device, Lighthouse or live contact-delivery test performed.','Static checks are not a penetration test.']}
(ROOT/'audit-results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({k:v for k,v in report.items() if k not in ['videos']},ensure_ascii=False,indent=2))
if errors:raise SystemExit(1)
print(f'AUDIT PASS: {len(docs)} pages, {len(images)} images, {len(svgs)} SVGs, {len(videos)} fully decoded videos')
