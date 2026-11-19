import test from 'node:test';
import assert from 'node:assert/strict';
import {buildQuoteURL,normalizeQuote,quoteSummary,STATES,SERVICE_LABELS} from '../dist/quote-utils.js';
const valid={services:['fotografia','video','chatbots','automatizaciones'],sector:'Clínica veterinaria y estética canina',state:'Quintana Roo',city:'Cancún',start:'este-mes',collaboration:'continuo',name:'Ana',brand:'Mi marca',message:'Quiero mejorar la atención y crear contenido para mi negocio.'};
test('La solicitud conserva la actividad libre, ubicación, nuevos servicios y colaboración',()=>{
 const url=new URL(buildQuoteURL({...valid,reference:'gastronomia'}));
 assert.equal(url.origin,'https://wa.me');assert.equal(url.pathname,'/529982401868');
 const text=url.searchParams.get('text');
 for(const part of ['Actividad: Clínica veterinaria y estética canina','Chatbots, Automatizaciones','Ciudad: Cancún','Estado: Quintana Roo, México','Cuándo empezamos: Este mes','Colaboración: Acompañamiento continuo','Marca o negocio: Mi marca','Referencia del portafolio: gastronomia'])assert.ok(text.includes(part),part);
 assert.ok(quoteSummary(valid).includes('Clínica veterinaria'));
});
test('Las entradas potencialmente maliciosas permanecen dentro del texto del mensaje',()=>{
 const malicious='<script>alert(1)</script> &text=otro\nhttps://ejemplo.mx/?x=1#prueba';
 const url=new URL(buildQuoteURL({...valid,sector:malicious,message:malicious}));
 assert.deepEqual([...url.searchParams.keys()],['text']);assert.equal(url.hash,'');
 assert.ok(url.searchParams.get('text').includes(malicious));
});
test('El formulario ofrece las 32 entidades y siete servicios, incluida creación web',()=>{
 assert.equal(STATES.length,32);assert.equal(new Set(STATES).size,32);
 for(const state of ['Baja California','Baja California Sur','Ciudad de México','Estado de México','Quintana Roo','Yucatán'])assert.ok(STATES.includes(state));
 assert.equal(Object.keys(SERVICE_LABELS).length,7);
 assert.ok(new URL(buildQuoteURL({...valid,services:['web']})).searchParams.get('text').includes('Diseño y creación web'));
 assert.equal(normalizeQuote({...valid,sector:'Taller de bicicletas eléctricas'}).sector,'Taller de bicicletas eléctricas');
 for(const state of STATES)assert.doesNotThrow(()=>buildQuoteURL({...valid,state}));
});
test('No se puede generar una solicitud incompleta o con un estado no permitido',()=>{
 for(const invalid of [{services:[]},{services:['desconocido']},{sector:' '},{brand:' '},{city:' '},{state:'No existe'},{message:'Corto'}])assert.throws(()=>buildQuoteURL({...valid,...invalid}));
});
test('Servicios y referencias se validan; datos opcionales vacíos y límites son estables',()=>{
 const q=normalizeQuote({...valid,services:['chatbots','chatbots','constructor','automatizaciones'],reference:'https://evil.invalid',start:'manipulado',collaboration:'constructor',name:'n'.repeat(200),brand:'b'.repeat(200),sector:'s'.repeat(250),city:'c'.repeat(200),message:'m'.repeat(1600)});
 assert.deepEqual(q.services,['chatbots','automatizaciones']);assert.equal(q.reference,'');assert.equal(q.start,'Por definir');assert.equal(q.collaboration,'Por definir');
 for(const [key,length] of [['name',80],['brand',100],['sector',160],['city',100],['message',1200]])assert.equal(q[key].length,length);
 const text=new URL(buildQuoteURL({...valid,name:'',start:'',collaboration:''})).searchParams.get('text');
 assert.ok(!text.includes('Soy '));assert.ok(text.includes('Cuándo empezamos: Por definir'));
});
