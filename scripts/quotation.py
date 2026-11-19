from pathlib import Path
from html import escape as esc
import json
ROOT=Path(__file__).resolve().parents[1]
OPTIONS=json.loads((ROOT/'sources/quote-options.json').read_text())
def quote_form():
 # One source of truth feeds HTML options and the browser's validation module.
 (ROOT/'dist/quote-options.js').write_text('export const OPTIONS = Object.freeze('+json.dumps(OPTIONS,ensure_ascii=False,separators=(',',':'))+');\n')
 choices=''.join(f'<label class="quote-choice" for="quote-service-{key}"><input id="quote-service-{key}" type="checkbox" name="servicio" value="{key}" data-quote-service><span><strong>{esc(value["label"])}</strong><small>{esc(value["description"])}</small></span></label>' for key,value in OPTIONS['services'].items())
 states=''.join(f'<option value="{esc(state)}">{esc(state)}</option>' for state in OPTIONS['states'])
 starts=''.join(f'<option value="{key}">{esc(label)}</option>' for key,label in OPTIONS['starts'].items())
 collaborations=''.join(f'<option value="{key}">{esc(label)}</option>' for key,label in OPTIONS['collaborations'].items())
 return f'''<form class="quote-form" id="quote-form" action="https://wa.me/529982401868" method="get">
 <div class="quote-progress" aria-label="Pasos de la solicitud"><span data-progress="0" aria-current="step">01 / Servicios</span><span data-progress="1">02 / Tu negocio</span><span data-progress="2">03 / Tu idea</span></div>
 <fieldset class="quote-step" data-step="0"><legend>¿Qué vamos a crear?</legend><p class="quote-hint">Combina los servicios que tu negocio necesita.</p><div class="quote-choices">{choices}</div><p class="quote-error" id="service-error" role="status"></p></fieldset>
 <fieldset class="quote-step" data-step="1"><legend>Conozcamos tu negocio.</legend><div class="quote-fields">
 <div class="full-field"><label for="quote-brand">Nombre de tu marca o negocio</label><input id="quote-brand" type="text" maxlength="100" required placeholder="El nombre de tu marca" autocomplete="organization"></div>
 <div class="full-field"><label for="quote-sector">¿A qué se dedica tu negocio?</label><input id="quote-sector" type="text" maxlength="160" required placeholder="Cuéntanos tu actividad"></div>
 <div><label for="quote-state">Estado <span>México</span></label><select id="quote-state" autocomplete="address-level1" required><option value="">Selecciona tu estado</option>{states}</select></div>
 <div><label for="quote-city">Ciudad</label><input id="quote-city" type="text" maxlength="100" required placeholder="Ciudad de tu negocio" autocomplete="address-level2"></div>
 <div><label for="quote-start">¿Cuándo empezamos?</label><select id="quote-start"><option value="">Vamos definiéndolo</option>{starts}</select></div>
 <div><label for="quote-collaboration">¿Cómo trabajamos juntos?</label><select id="quote-collaboration"><option value="">Elige una opción</option>{collaborations}</select></div>
 </div></fieldset>
 <fieldset class="quote-step" data-step="2"><legend>Tu idea empieza aquí.</legend><div class="quote-summary" aria-label="Resumen de tu proyecto"><span>Tu selección</span><p data-quote-summary>Selecciona los servicios de tu proyecto.</p></div><div class="quote-fields"><div class="full-field"><label for="quote-name">Tu nombre <span>(opcional)</span></label><input id="quote-name" maxlength="80" autocomplete="given-name" placeholder="¿Cómo te llamas?"></div><div class="full-field"><label for="quote-message">Cuéntanos qué quieres lograr</label><textarea id="quote-message" name="text" rows="4" minlength="10" maxlength="1200" required placeholder="Tu idea, tus objetivos o lo que te gustaría mejorar…" aria-describedby="quote-help"></textarea><p id="quote-help" class="quote-hint">Con estos detalles preparamos una propuesta a tu medida.</p></div></div></fieldset>
 <div class="quote-actions"><button class="quote-back" type="button" data-quote-back hidden>Atrás</button><button class="quote-next" type="button" data-quote-next hidden>Continuar</button><button class="quote-submit" type="submit">Solicitar cotización por WhatsApp</button></div>
 <p class="quote-disclosure">Revisa y envía tu solicitud en WhatsApp. El precio se define según el alcance del proyecto. <a href="/sobre-tus-datos/">Sobre tus datos</a>.</p><noscript><p class="quote-hint">Incluye tus servicios y los datos de tu negocio en la descripción. Sin JavaScript, solo se comparte ese texto.</p></noscript></form>'''
