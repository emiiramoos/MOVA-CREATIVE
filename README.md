# MOVA — Experiencia en movimiento

## Revisión 10 — Limpieza de contenido y recorrido

La portada muestra el logotipo y «Agencia creativa & digital» centrado debajo, sin enlaces ni controles de pausa. El video permanece en loop mientras la portada está visible. Se retiran los botones del recorrido por sectores y la pausa del carrusel; el carrusel sigue avanzando con mouse o foco sobre él. El ciclo de palabras pasa de 12 a 6 segundos. Servicios enlaza directamente con Metodología y se retira el estudio con sus diálogos.

Las fichas de proyecto conservan el contenido principal y pierden las categorías superiores, rótulos bajo videos, «Una mirada al proyecto» y párrafos finales señalados. Gastronomía conserva su subtítulo y suma su fotografía principal al collage; Inmobiliario, Belleza y Textil sustituyen los nombres de cliente en sus encabezados. Se mantiene la llamada de contacto excepto en Barbería, según la instrucción específica. El video anteriormente presentado en Luméa pasa a Joyería editorial, junto con las fotografías existentes; Luméa desaparece de la navegación, el archivo y las fichas independientes. Se conservan las rutas existentes de los proyectos restantes.

Verificación: 15 pruebas automáticas aprobadas, auditoría de enlaces y medios aprobada, portada con reproducción confirmada y revisión visual de Gastronomía/Joyería editorial en el navegador de escritorio. Los estilos se aplican también a móvil y tablet; la comprobación automática en esos tamaños quedó bloqueada por una restricción del entorno al iniciar otro navegador. No se realizaron envíos de formularios ni pruebas en dispositivos físicos.

## Revisión 7 — Fondos, cristal y tipografía editorial

Cada servicio tiene ahora un fondo propio que cambia al avanzar: interfaz de marketing, rodaje original de MOVA, fotografía gastronómica, diseño web, chatbot y la red de servicios de MOVA. Los fondos digitales reutilizan imágenes conceptuales ya creadas en esta conversación; las dos fotografías de producción y producto proceden del material del propietario. La tarjeta aplica desenfoque real de fondo con `backdrop-filter` y su variante para Safari, tinte translúcido y un borde naranja de 3 px con brillo. La capa de fondo se desvanece independientemente del texto para mantener visible la imagen entre tarjetas. El carrusel conserva 51 px/s y el recorrido por servicios conserva sus tiempos.

Los títulos combinan Syne seminegrita y Cormorant Garamond cursiva. Las fuentes se sirven desde el sitio con `font-display: swap`, subconjuntos latinos y licencias SIL OFL incluidas. Fuentes originales: [Syne](https://github.com/google/fonts/tree/main/ofl/syne) y [Cormorant Garamond](https://github.com/google/fonts/tree/main/ofl/cormorantgaramond). Los tres archivos tipográficos suman unos 53 KB; los cuatro nuevos fondos WebP, unos 320 KB. Sin JavaScript o con movimiento reducido, cada tarjeta conserva un fondo local desenfocado y todo el contenido se presenta sin escenas fijas. La revisión visual en navegador continúa pendiente por el fallo de infraestructura de previsualización ya registrado.

## Revisión 6 — Servicios al hacer scroll

El carrusel avanza a 51 px/s, un 50% más rápido que antes, conservando la reproducción original de los videos. La sección central muestra primero «¿Cómo podemos ayudarte?» a gran tamaño y después una sola tarjeta por escena: Marketing digital, Producción audiovisual, Contenido para redes, Diseño y creación web, Chatbots y Automatizaciones. Cada tarjeta contiene únicamente el nombre y una explicación breve, con entrada, salida y borde naranja iluminado ligados al desplazamiento nativo. El recorrido también se puede invertir al subir.

Se retiran de ese apartado las etiquetas de planes, listas, enlaces de cotización y el video de la red de servicios. Sin JavaScript o con movimiento reducido, todo el contenido se presenta como una lista normal. Las imágenes generadas posteriormente no se incorporan al sitio. Las pruebas cubren la secuencia completa, el retorno y la ausencia de textos superpuestos. La comprobación visual sigue pendiente: el servidor de previsualización no puede arrancar por un error de permisos de infraestructura.

## Revisión 5 — Servicios y nuevos medios (historial)

El recorrido incorpora un carrusel continuo de cuatro nuevas producciones, inmediatamente antes de «¿Cómo podemos ayudar?» y antes del estudio. Sus dos grupos idénticos permiten una vuelta continua en ambas direcciones; los videos se repiten sin audio. Solo se cargan y reproducen los que entran en pantalla. El desplazamiento se pausa al interactuar, con control textual, teclado y arrastre táctil, y se detiene fuera de vista o en segundo plano. Se respetan ahorro de datos y movimiento reducido. Los videos de proyectos conservan reproducción exclusiva.

La sección de ayuda presenta producción audiovisual, contenido mensual y gestión integral de redes con los alcances facilitados por el cliente; añade creación web, chatbots y automatizaciones. Los bloques se destacan progresivamente con el scroll. El clip central de Higgsfield/Higgsedit usa el wordmark MOVA original y seis paneles gráficos conectados, sin humanos; dura 12 segundos, sin audio. Los enlaces de cada solución precargan la selección del formulario, que ahora incluye siete servicios y mantiene sus 32 entidades de México.

El manifiesto usa una recreación con image_gen del paisaje de atardecer aportado como referencia, sin letras ni bordes, en 1672 × 941. Se identifica como recreación en `sources/media-v5.json`; no se presenta como producción original de cliente. Se retiraron los rótulos numerados de secciones, los pies descriptivos de galerías, «El detalle» y la fotografía de collar rosa/verde con rostro. Los dos tamaños públicos de esa foto se retiraron del despliegue y son recuperables por Git. Los originales del usuario no se alteran.

Archivos principales de esta revisión: `scripts/solutions.py`, `dist/solutions.css`, `dist/loop-media.js`, `scripts/prepare_carousel.py`, `scripts/mova-network.js` y `sources/media-v5.json`. Las siguientes secciones describen la base previa y deben leerse junto con estos cambios.

Cuarta versión del sitio. La portada muestra el logotipo original sobre un montaje en loop de producciones, costa y atardecer. El recorrido combina tarjetas por industria, palabras rotatorias, equipo flotante, metodología progresiva y tarjetas de servicios que giran y cobertura de clientes con marcadores progresivos. El cierre conduce a una solicitud de cotización por WhatsApp.

## Estructura

- 19 documentos: inicio, seis sectores, ocho proyectos, archivo filtrable, cotización, información sobre datos y 404.
- `scripts/build.py`, `homepage.py` y `quotation.py`: contenido y plantillas. Ejecutar `python scripts/build.py` después de modificarlos.
- `dist/styles.css`: base editorial, navegación, archivo y proyectos.
- `dist/experience.css`, `refinements.css`, `client-revision.css`, `flip-cards.js` y `experience.js`: escenas, movimiento, diálogos y flujo de cotización.
- `sources/quote-options.json`: seis servicios, 32 entidades de México y opciones de colaboración; genera `dist/quote-options.js` al construir.
- `dist/quote-utils.js`: normalización y composición segura de la solicitud.
- `dist/motion-utils.js`: progreso acotado, pasos de metodología y posiciones del mapa.
- `scripts/audit.py` y `tests/`: comprobaciones reproducibles.
- `.openai/hosting.json`: identidad del sitio existente; conservar su `project_id` y acceso.

No requiere dependencias de aplicación externas ni compilación en el servidor. Los HTML y medios optimizados se versionan. Python/Pillow se usan para generar; FFmpeg/FFprobe, para editar y auditar medios.

## Recorrido y conversión

Las seis tarjetas abren páginas de restaurantes, espacios inmobiliarios, moda y joyería, belleza, textil e identidad de marca. Cada página enlaza evidencia real y una cotización con el sector seleccionado. Los proyectos también pueden añadirse como referencia al formulario.

Las tarjetas giratorias ofrecen Fotografía, Video, Branding y Marketing digital. El frente muestra el nombre; el reverso, únicamente imagen y frase principal. Funcionan con hover de mouse, toque y activación nativa por teclado. No abren diálogos de servicio. El formulario ofrece Fotografía, Video, Branding, Marketing digital, Chatbots y Automatizaciones. Recoge la actividad del negocio como texto libre, marca, ciudad, estado de México, cuándo empezar, tipo de colaboración, nombre opcional y descripción. Ofrece acompañamiento continuo, proyecto específico u orientación. El navegador prepara un mensaje; la persona revisa y decide enviarlo en WhatsApp. No hay precios calculados, backend del formulario ni envío automático.

La cobertura representa clientes en Cancún, Mérida, CDMX, Monterrey y Baja California. No son cinco oficinas. Baja California es una ubicación regional aproximada; no se ha atribuido a una ciudad específica.

## Movimiento y accesibilidad

Scroll nativo con actualizaciones agrupadas en requestAnimationFrame; sin librerías de animación ni scroll artificial. En escritorio, el desplazamiento vertical recorre las tarjetas. En móvil se pueden deslizar horizontalmente. La metodología aparece después del estudio, con cinco pasos que se iluminan al bajar. En escritorio alto usa una escena fija; en móvil, tablet y pantallas bajas se lee verticalmente. El mapa ocupa una escena completa, con entrada desde profundidad, zoom, marcadores y rutas progresivas.

Se implementan navegación por teclado, diálogos nativos, pausa del video, pausa fuera de vista, selección de un único video según el ancho, ahorro de datos y movimiento reducido. Se retiró el control de movimiento de la página; se conserva únicamente el respeto a la preferencia de accesibilidad del sistema operativo. Todos los controles propios usan texto, sin emojis ni flechas decorativas. La verificación real de estos comportamientos en navegador continúa pendiente; ver `AUDIT.md`.

## Recursos y edición

Todas las fotografías, identidades y producciones proceden de los recursos del propietario. No se añadieron fotografías de stock ni imágenes generadas. La marca MOVA conserva su SVG original; la variante clara cambia únicamente su color oscuro por arena.

`11-intro-desktop.mp4` y `11-intro-mobile.mp4` comparten exactamente las cinco escenas y el montaje temporal: atardecer, playa desde el aire, mariscos, burritos y casa. Duran 13,7 segundos, sin audio, con transiciones de 0,3 segundos y vuelta al atardecer. Solo cambia el encuadre para cada proporción. La toma de burritos utiliza un recorte vertical progresivo en escritorio para mantener el alimento visible. `intro-edit.json` registra los cortes y `scripts/create_intro.py` los reproduce desde los masters aprobados indicados mediante `MOVA_MASTERS_DIR`.

Las tarjetas muestran únicamente sus nombres; «Tu mundo. Otra perspectiva.» encabeza la sección. Identidad de marca utiliza el SVG original dorado de OMBDUSMAN sobre blanco. Textil muestra un fotograma de máquina de coser, sin subtítulos, tomado del master PRE en 6,2 s (recorte 1080 × 1000, x=0, y=180). El manifiesto usa una fotografía editorial de collar más visible y el texto «Hacemos que tu marca se mueva / conecte / se sienta / se recuerde». El estudio conserva sus tres fotografías interactivas. Se retiraron el párrafo introductorio, la indicación «Explora el estudio» y el párrafo de la ficha de cámaras. También se eliminaron los indicadores de formato y silencio en proyectos, el enlace «Todo el trabajo» y la lista de ciudades del pie. Los espacios se reajustan en client-revision.css.

La cartografía procede de Natural Earth, de dominio público según sus [términos de uso](https://www.naturalearthdata.com/about/terms-of-use/). `sources/mexico-context.geojson` conserva los países utilizados y `dist/assets/mexico-map.svg` la representación. Proyección ilustrativa: x=(longitud+119)×27+50; y=(34,5−latitud)×32+30, viewBox 1000×700. Las posiciones son aproximadas.

Las fotografías de joyería no se atribuyen a Luméa. Gastronomía y Barbería mantienen títulos genéricos por atribución pendiente. No se publican testimonios, resultados ni modelos de equipo no confirmados. Las fuentes oficiales Alte Haas Grotesk e Inter siguen pendientes de recibir/licenciar; se usan fuentes del sistema. Por petición del cliente, el manifiesto combina Arial/Helvetica para «Hacemos que», Georgia cursiva para «marca» y Arial Black con alternativa Arial en negrita para las palabras rotativas. La paleta y los logotipos se conservan.

## Referencias de movimiento revisadas

- [The Goonies](https://the-goonies.webflow.io/): capas, escala y desvanecimiento al hacer scroll; sin reproducir su contador inicial.
- [Translate](https://www.translate-wf.com/): escena fija y aparición progresiva de marcadores.
- [3D Spiral Menu](https://3d-spiral-menu.webflow.io/): perspectiva y atenuación en el menú.
- [Text Rotater](https://text-rotater.webflow.io/): ciclo vertical de palabras.
- [Horizontal Cards](https://simple-horizontal-cards.webflow.io/): recorrido horizontal y elevación de tarjeta.
- [Interactive Section](https://interactive-section.webflow.io/): capas flotantes y respuesta al cursor.
- [T.Ricks Horizontal Scroll](https://tricks-horizontal-scroll.webflow.io/) y [Hero Loop](https://hero-loop.webflow.io/): recorrido y tratamiento de apertura.
- [Orbital Test](https://orbital-test.webflow.io/): visitado; la captura no mostró su animación, por lo que no se afirma una inspección completa.

Las referencias se consultaron para entender comportamientos. Su código y recursos gráficos no se copiaron.

## Auditoría y protección

Ejecutar `node --test tests/*.test.js`, `node --check dist/experience.js`, `node --check dist/app.js`, `python scripts/audit.py` y `git diff --check`. `audit-results.json` conserva la evidencia de integridad de medios y enlaces.

Al iniciar esta revisión, Sites informó acceso público, con el propietario como único editor. Se conserva esa configuración sin modificar la audiencia. El código mantiene su historial de versiones. El código enviado al navegador es accesible para sus visitantes; la protección consiste en control de acceso, ausencia de secretos, entradas acotadas y versionado. No hay analítica propia, píxeles publicitarios ni persistencia del formulario.

Pendientes de validación: comprobar visualmente el recorrido en dispositivos reales, confirmar atribuciones y permisos de uso, fuentes, dominio, recepción de contacto y datos legales finales. No se han medido Core Web Vitals ni enviado mensajes de prueba. No alterar el público, canonical o robots.txt sin la decisión correspondiente. El historial permite recuperar versiones sin force-push.
