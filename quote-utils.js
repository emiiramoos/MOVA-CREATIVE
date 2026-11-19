import { OPTIONS } from './quote-options.js?v=5';
export const SERVICE_LABELS=Object.freeze(Object.fromEntries(Object.entries(OPTIONS.services).map(([key,value])=>[key,value.label])));
export const SECTOR_PREFILLS=OPTIONS.sector_prefills;
export const STATES=Object.freeze([...OPTIONS.states]);
const REFERENCES=new Set(['gastronomia','sayab','joyeria-editorial','ombdusman','sifrinas','barberia','pre']);
const clean=(value,max)=>String(value??'').trim().slice(0,max);
const label=(options,key,fallback)=>Object.hasOwn(options,key)?options[key]:fallback;
export function normalizeQuote(data){
 return {services:[...new Set((Array.isArray(data.services)?data.services:[]).filter(k=>Object.hasOwn(SERVICE_LABELS,k)))],sector:clean(data.sector,160),state:STATES.includes(data.state)?data.state:'',city:clean(data.city,100),start:label(OPTIONS.starts,data.start,'Por definir'),collaboration:label(OPTIONS.collaborations,data.collaboration,'Por definir'),brand:clean(data.brand,100),name:clean(data.name,80),message:clean(data.message,1200),reference:REFERENCES.has(data.reference)?data.reference:''};
}
export function quoteSummary(input){
 const q=normalizeQuote(input);
 return [q.services.map(k=>SERVICE_LABELS[k]).join(' · '),q.brand,q.sector,[q.city,q.state].filter(Boolean).join(', '),q.start!=='Por definir'?q.start:'',q.collaboration!=='Por definir'?q.collaboration:''].filter(Boolean).join('\n');
}
export function buildQuoteURL(input){
 const q=normalizeQuote(input);
 if(!q.services.length)throw new Error('Elige al menos un servicio.');
 if(!q.brand)throw new Error('Escribe el nombre de tu marca o negocio.');
 if(q.sector.length<2)throw new Error('Cuéntanos a qué se dedica tu negocio.');
 if(!q.state)throw new Error('Selecciona el estado de tu negocio.');
 if(q.city.length<2)throw new Error('Escribe la ciudad de tu negocio.');
 if(q.message.length<10)throw new Error('Cuéntanos tu idea en al menos 10 caracteres.');
 const lines=['Hola, MOVA. Me gustaría solicitar una cotización.',q.name?`Soy ${q.name}.`:'',`Marca o negocio: ${q.brand}`,`Actividad: ${q.sector}`,`Servicios: ${q.services.map(k=>SERVICE_LABELS[k]).join(', ')}`,`Ciudad: ${q.city}`,`Estado: ${q.state}, México`,`Cuándo empezamos: ${q.start}`,`Colaboración: ${q.collaboration}`,q.reference?`Referencia del portafolio: ${q.reference}`:'','',q.message];
 const url=new URL('https://wa.me/529982401868');url.searchParams.set('text',lines.filter((s,i)=>s||i===lines.length-2).join('\n'));return url.href;
}
