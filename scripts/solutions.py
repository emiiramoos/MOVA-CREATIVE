from html import escape
from pathlib import Path
from PIL import Image

LOOP_CLIPS=[
 ('12-produccion-gastronomia','Detrás de una producción gastronómica'),
 ('13-sesion-playa','Sesión fotográfica junto al mar'),
 ('14-luz-en-set','Preparación de luz y cámara en el set'),
 ('15-produccion-barberia','Producción audiovisual en barbería')]

SOLUTIONS=[
 ('Marketing digital','Damos dirección a tu presencia en redes para que tu marca llegue a las personas correctas y convierta el interés en oportunidades.'),
 ('Producción audiovisual','Creamos fotografías y videos que muestran lo mejor de tu negocio y hacen que tu marca se vea, se entienda y se recuerde.'),
 ('Contenido para redes','Transformamos tus ideas en contenido visual que mantiene tu marca presente y conecta con tu comunidad.'),
 ('Diseño y creación web','Diseñamos una página a tu medida para presentar tu negocio, mostrar lo que ofreces y facilitar que te contacten desde cualquier dispositivo.'),
 ('Chatbots','Ayudamos a tu negocio a responder preguntas, orientar a tus clientes y recibir nuevas oportunidades de forma automática.'),
 ('Automatizaciones','Conectamos tus herramientas y simplificamos tareas repetitivas para que tu equipo ahorre tiempo y se concentre en hacer crecer tu negocio.')]

VISUALS=[
 ('Marketing','digital','service-marketing.webp','marketing'),
 ('Producción','audiovisual','img_8943-1280.webp','production'),
 ('Contenido','para redes','dsc02413-1080.webp','content'),
 ('Diseño y','creación web','service-web.webp','web'),
 ('','Chatbots','service-chatbots-v9.webp','chatbots'),
 ('Automatizaciones','','service-automations-v9.webp','automations')]

def background_image(filename):
    with Image.open(Path(__file__).resolve().parents[1]/'dist/assets'/filename) as image:
        width,height=image.size
    return f'<img src="/assets/{filename}" width="{width}" height="{height}" alt="" loading="lazy" decoding="async">'

def render_solutions():
    clips=''.join(f'<figure class="loop-film"><video data-loop-video data-src="/assets/{slug}.mp4" muted loop playsinline preload="none" poster="/assets/{slug}-poster.webp" width="540" height="960" aria-label="{escape(alt)}"></video></figure>' for slug,alt in LOOP_CLIPS)
    carousel=f'''<section class="reel-chapter" id="en-produccion" aria-labelledby="reel-title"><div class="reel-heading section-pad"><h2 id="reel-title">Detrás de<br><em>cada idea.</em></h2></div><div class="reel-viewport" tabindex="0" role="region" aria-label="Videos de producciones MOVA. Usa las flechas del teclado o desliza para explorar."><div class="reel-track"><div class="reel-group">{clips}</div><div class="reel-group" aria-hidden="true">{clips}</div></div></div></section>'''
    cards=''
    backgrounds='<div class="service-background service-background-intro" data-service-backdrop="0"></div>'
    for i,(title,intro) in enumerate(SOLUTIONS):
        lead,accent,filename,theme=VISUALS[i]
        image=background_image(filename)
        heading=(f'<span>{escape(lead)}</span> ' if lead else '')+(f'<em>{escape(accent)}</em>' if accent else '')
        backgrounds+=f'<div class="service-background service-background-{theme}" data-service-backdrop="{i+1}">{image}</div>'
        cards+=f'''<article class="solution-card solution-{theme}" data-solution="{i}" data-service-scene><div class="solution-static-backdrop" aria-hidden="true">{image}</div><div class="solution-card-content"><h3>{heading}</h3><p>{escape(intro)}</p></div></article>'''
    solutions=f'''<section class="solutions-chapter" id="como-ayudamos" aria-labelledby="solutions-title"><div class="solutions-stage"><div class="service-backgrounds" aria-hidden="true">{backgrounds}</div><div class="solutions-intro" data-service-scene><h2 id="solutions-title">¿Cómo podemos<br><em>ayudarte?</em></h2></div><div class="solutions-list">{cards}</div></div></section>'''
    return carousel+solutions
