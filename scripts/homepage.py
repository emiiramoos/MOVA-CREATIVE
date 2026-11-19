from html import escape as esc
from quotation import quote_form
from solutions import render_solutions
SECTORS=[
('restaurantes','Restaurantes','Que tu próximo cliente empiece por los ojos.','dsc02413','Platillo sobre una mesa amarilla','gastronomia'),
('inmobiliario','Inmobiliario','Haz que se imaginen ahí.','02-sayab-interiores-poster.webp','Interior de un departamento en Sayab','sayab'),
('moda-y-joyeria','Moda y joyería','Detalles que merecen otra mirada.','dsc00024','Collar sobre un top blanco','joyeria-editorial'),
('belleza','Belleza','El valor está en la experiencia.','03-sifrinas-belleza-poster.webp','Trabajo profesional en el salón Sifrinas','sifrinas'),
('textil','Textil','Muestra lo que hace distinta a tu marca.','textil-confeccion.webp','Manos guiando una tela en la máquina de coser de PRE','pre'),
('marcas','Identidad de marca','Una marca que se reconoce.','ombdusman-1.svg','Emblema dorado OMBDUSMAN sobre fondo blanco','ombdusman')]
SERVICES=[
('fotografia','Fotografía','Imágenes que hacen detenerse.','Producto, gastronomía, espacios y fotografía editorial. Elegimos el lenguaje visual según tu marca.','dsc00659','/proyectos/?tipo=foto'),
('video','Video','Tu marca, en movimiento.','Producción audiovisual, contenido para redes y tomas aéreas con dron. Damos forma al concepto, la producción y la edición.','05-dron-cancun-poster.webp','/proyectos/?tipo=video'),
('branding','Branding','Dale una identidad propia.','Concepto e identidad visual para conectar cada expresión de tu marca. El punto de partida para comunicar con coherencia.','ombdusman-1.svg','/proyectos/ombdusman/'),
('marketing','Marketing digital','Una dirección para tu contenido.','Conectamos estrategia, contenido y objetivos. Empezamos por entender a tu negocio y a las personas a las que quieres llegar.','img_4684-2','/contacto/?servicio=marketing')]
CITIES=[('cancun','Cancún',918.05,456.88,47,'Quintana Roo'),('merida','Mérida',844.07,462.96,-65,'Yucatán'),('cdmx','CDMX',586.41,512.14,48,'Ciudad de México'),('monterrey','Monterrey',554.47,312.05,-65,'Nuevo León'),('baja-california','Baja California',144.5,158,-65,'Región norte')]
def render_home(img,film):
 hero='''<section class="cinema-chapter" aria-label="MOVA en movimiento"><div class="cinema-sticky"><div class="cinema-frame" data-hero><picture class="cinema-poster"><source media="(max-width:700px)" srcset="/assets/11-intro-mobile-poster.webp"><img src="/assets/11-intro-desktop-poster.webp" width="1280" height="720" alt="Producciones, paisajes y atardeceres de MOVA" fetchpriority="high"></picture><video muted loop playsinline disablepictureinpicture disableremoteplayback preload="none" aria-label="Reel de MOVA, sin audio"></video><div class="cinema-shade"></div><div class="cinema-logo"><div class="cinema-brand"><h1><img src="/assets/mova-logo-light.svg" width="980" height="260" alt="MOVA"></h1><p class="cinema-tagline">Agencia creativa &amp; digital</p></div></div></div></div></section>'''
 cards=''.join(f'''<article class="sector-card"><a href="/sectores/{slug}/" class="sector-card-link"><div class="sector-photo">{img(cover,alt,sizes='(max-width:700px) 82vw, 30vw')}</div><div class="sector-card-copy"><h3>{title}</h3></div></a></article>''' for slug,title,copy,cover,alt,case in SECTORS)
 work=f'''<section class="work-chapter" id="trabajos" aria-labelledby="work-title"><div class="work-sticky"><div class="chapter-heading section-pad"><div><h2 id="work-title">Tu mundo.<br><em>Otra perspectiva.</em></h2></div></div><div class="sector-viewport" tabindex="0" role="region" aria-label="Sectores; desliza o usa las teclas de dirección para explorar"><div class="sector-track">{cards}</div></div></div></section>'''
 words=['se mueva.','conecte.','se sienta.','se recuerde.']
 rotator='''<section class="manifesto-chapter section-pad" id="nosotros"><div class="manifesto-bg">'''+img('mova-atardecer-1672.webp','',sizes='100vw')+'''</div><div class="manifesto-content"><h2><span class="manifesto-lead">Hacemos que</span><span class="manifesto-brand">tu <em>marca</em></span><span class="sr-only">se mueva, conecte, se sienta y se recuerde.</span><span class="word-window" aria-hidden="true"><span class="word-reel">'''+''.join(f'<span>{w}</span>' for w in words+[words[0]])+'''</span></span></h2></div></section>'''
 method_steps=[
 ('Descubrimos','Conocemos tu marca, objetivos y público.'),
 ('Planeamos','Definimos la estrategia, el concepto y los pasos para llevarlos a cabo.'),
 ('Creamos','Desarrollamos contenido visual con altos estándares de calidad.'),
 ('Optimizamos','Revisamos cada detalle antes de entregar.'),
 ('Impulsamos','Entregamos herramientas que ayudan a fortalecer tu marca y generar resultados.')]
 method_items=''.join(f'<li class="method-step" data-method-step="{i}"><div class="method-node"><span class="method-number">{i+1:02d}</span><h3>{name}</h3></div><p>{copy}</p></li>' for i,(name,copy) in enumerate(method_steps))
 methodology=f'<section class="methodology-chapter" id="metodologia" aria-labelledby="method-title"><div class="methodology-sticky section-pad"><h2 id="method-title">Nuestra<br><em>metodología.</em></h2><ol class="method-track">{method_items}</ol></div></section>'
 flip_cards=''.join(f'''<button type="button" class="service-flip service-flip-{key}" aria-label="{name}: {head}" aria-pressed="false" data-service-flip><span class="flip-inner"><span class="flip-face flip-front" aria-hidden="true"><span class="flip-service-name">{name}</span></span><span class="flip-face flip-back" aria-hidden="true">{img(cover,'',sizes='(max-width:700px) 90vw, 45vw')}<span class="flip-headline">{head}</span></span></span></button>''' for key,name,head,copy,cover,href in SERVICES)
 services=f'<section class="services-chapter section-pad" id="servicios" aria-labelledby="services-title"><h2 id="services-title" class="sr-only">Servicios de MOVA</h2><div class="service-flip-grid">{flip_cards}</div></section>'
 pins=''
 for i,(key,name,x,y,offset,region) in enumerate(CITIES):
  # Stagger Yucatán labels so Mérida and Cancún remain distinct.
  tx=x-10 if key=='merida' else x;anchor='end' if key=='merida' else 'middle'
  pins+=f'<g class="map-pin" data-pin="{i}"><circle class="map-halo" cx="{x}" cy="{y}" r="22"/><line x1="{x}" y1="{y}" x2="{x}" y2="{y+offset}" pathLength="1"/><circle class="map-dot" cx="{x}" cy="{y}" r="6"/><text x="{tx}" y="{y+offset+(22 if offset>0 else -12)}" text-anchor="{anchor}">{name}</text></g>'
 buttons=''.join(f'<button type="button" data-city="{i}" aria-pressed="false"><span class="city-dot" aria-hidden="true"></span>{name}</button>' for i,(key,name,x,y,offset,region) in enumerate(CITIES))
 routes=''
 for i in range(1,len(CITIES)):
  x0,y0=CITIES[i-1][2:4];x1,y1=CITIES[i][2:4]
  routes+=f'<path class="map-route" data-route="{i}" d="M{x0} {y0} Q{(x0+x1)/2} {min(y0,y1)-65} {x1} {y1}" pathLength="1"/>'
 coverage=f'''<section class="coverage-chapter" id="cobertura" aria-labelledby="coverage-title"><div class="coverage-sticky section-pad"><div class="coverage-heading"><h2 id="coverage-title">Distintos lugares.<br><em>La misma visión.</em></h2></div><div class="map-stage"><div class="map-plane"><img src="/assets/mexico-map.svg" width="1000" height="700" alt="Mapa de México con presencia de clientes en las ubicaciones indicadas"><svg class="coverage-pins" viewBox="0 0 1000 700" aria-hidden="true"><g class="map-routes">{routes}</g>{pins}</svg></div></div><div class="coverage-bottom"><div class="city-buttons" aria-label="Ubicaciones de clientes">{buttons}</div><p class="sr-only">Ubicaciones aproximadas por ciudad o región.</p></div></div></section>'''
 quote=f'''<section class="quote-chapter section-pad" id="cotizar"><div class="quote-intro"><h2>Hagamos<br><em>que pase.</em></h2><p>Elige lo que necesitas.<br>Nosotros damos forma a la propuesta.</p><a class="text-link" href="mailto:contacto@movacreative.mx">Prefiero escribir por correo</a></div>{quote_form()}</section>'''
 return hero+work+rotator+render_solutions()+methodology+services+coverage+quote
