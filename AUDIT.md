# Auditoría de implementación — MOVA v5

Actualización 15 de octubre de 2026, hora de Cancún.

## Revisión vigente

- Cuatro originales descargados del Drive señalado, revisados con muestras de escenas y transcodificados a H.264/yuv420p, 540 × 960, 24 fps, sin audio ni metadatos de captura. Clips 7,5 / 3,9 / 3,9 / 2,2 segundos, menos de 1,2 MB cada uno.
- Clip de conexiones producido con Higgsfield/Higgsedit: 1280 × 800, 12 segundos, wordmark original, tipografía DM Sans 700 verificada y registrada. Se inspeccionaron cuadros nativos y se corrigió la fuente antes de aceptar la exportación. Se confirmó la subida y se preparó faststart para web. Sin humanos.
- Fondo de paisaje recreado con image_gen según referencia; inspección visual de la imagen generada y versión WebP sin ampliación artificial.
- Galería de joyería con tres fotografías, sin la toma marcada de collar rosa/verde ni sus archivos públicos. Captions descriptivos y el rótulo «El detalle» retirados; alt accesible conservado. Rótulos numerados de secciones retirados, números funcionales de metodología y formulario conservados.
- Seis soluciones en mitad del recorrido, después del carrusel y antes del estudio. Formulario con siete servicios, incluida creación web. Cada solución enlaza servicios válidos de la cotización.
- Doce pruebas automatizadas: continuidad del carrusel al cruzar su vuelta y arrastrar hacia atrás, interacciones de tarjetas, progreso y composición/validación del mensaje.
- Auditoría estática extendida a `data-src`, orden de secciones, ausencia de la fotografía retirada, número de imágenes restantes, integridad y decodificación completa de los veinte videos.
- `sites-preview start` falló antes de servir la página: `bwrap: Can't mount proc on /newroot/proc: Operation not permitted`. El estado posterior fue «stopped». Se siguió la guía Sites y no se instaló ni improvisó otro navegador/servidor. No se afirma prueba visual o interacción en navegador ni en dispositivo real.

La evidencia reproducible vigente queda en `audit-results.json` y `sources/media-v5.json`. La auditoría previa se conserva a continuación como historial.

## Historial v4

15 de octubre de 2026. Revisión solicitada por el cliente.

## Cambios

- Eliminados los rótulos de formato y de selección sin audio en proyectos, la lista de ciudades del pie, «Todo el trabajo», el párrafo del estudio, «Explora el estudio» y el párrafo de la ficha de cámaras. Espacios y márgenes revisados en las reglas responsive.
- Manifiesto a mayor escala con tres tratamientos: grotesca regular, serif cursiva y negrita. Texto completo accesible, ciclo de cuatro frases y paleta original.
- Metodología de cinco pasos después del estudio. Iluminación por scroll, disposición horizontal fija en pantallas amplias y altas y vertical en móvil, tablet y ventanas bajas. «Planeamos» tiene una descripción propia, ya que duplicaba la de «Descubrimos» en el material recibido.
- Cuatro tarjetas giratorias sustituyen la espiral y sus cuatro diálogos. Frente con servicio; reverso solo con imagen y frase. Mouse, toque, teclado, Escape y pérdida de foco controlan el giro. Contemplada tablet con mouse conectado.
- Textil: nuevo fotograma real de confección sin subtítulos, inspeccionado visualmente. OMBDUSMAN: emblema original sobre blanco para la tarjeta de identidad y las miniaturas. El caso conserva sus dos variantes originales.

## Verificación

- 19 documentos HTML, 47 WebP, seis SVG y 15 videos. Auditoría estática de enlaces, anclas, etiquetas, dimensiones, CSP y ausencia de secretos/patrones inseguros. Decodificación de imágenes y videos, codec, duraciones, faststart y tamaño.
- Once pruebas automatizadas: interacción de tarjetas con mouse, toque y teclado; progreso reversible de metodología; movimiento del mapa; composición, validación y codificación de la cotización.
- Sintaxis JavaScript y generación HTML comprobadas. Revisión de reglas responsive y balance de delimitadores CSS; sin afirmar validación completa por parser CSS.
- El formulario sigue preparando la solicitud para WhatsApp. No se envían mensajes de prueba ni se guardan datos del formulario.
- Source helper abre el repositorio publicado en un checkout limpio, conservando el espacio anterior y sincronizando el nuevo estado antes del empaquetado. Se mantiene el acceso público reportado por Sites y el historial de versiones.

## Límites

No está disponible control-browser en este entorno administrado. Conforme a Sites, no se instaló un navegador alternativo ni se inició un servidor de vista previa. El renderizado, animaciones, foco y proporciones en navegadores/dispositivos reales permanecen sin prueba visual. Las pruebas de interacción son de lógica de eventos, no de navegador. No se afirman Lighthouse, Core Web Vitals, prueba de penetración ni entrega real de mensajes.

Los detalles reproducibles de integridad y enlaces se encuentran en audit-results.json. Los tipos oficiales del brandbook siguen pendientes; la combinación editorial usa fuentes del sistema autorizada por la solicitud de variedad tipográfica.
