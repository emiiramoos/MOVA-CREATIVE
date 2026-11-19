import { bindFlipCard } from './flip-cards.js?v=5';
import { initLoopMedia } from './loop-media.js?v=10';
import { initServiceScenes } from './service-scenes.js?v=7';
import { buildQuoteURL,normalizeQuote,quoteSummary,SERVICE_LABELS,SECTOR_PREFILLS,STATES } from './quote-utils.js?v=10';
import { clamp,sectionProgress,coverageIndex,coveragePose } from './motion-utils.js?v=5';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
const html=document.documentElement;
const preference=matchMedia('(prefers-reduced-motion: reduce)');
const narrow=matchMedia('(max-width:700px)');
const pinAllowed=matchMedia('(min-width:901px) and (min-height:720px)');
let motion=!preference.matches;
const videos=$$('video');
let framePending=false;
let render=()=>{};
function requestRender(){if(!framePending){framePending=true;requestAnimationFrame(()=>{framePending=false;render();});}}
function setMotion(enabled){
 motion=enabled;html.classList.toggle('motion-on',motion);html.classList.toggle('motion-off',!motion);
 if(!motion)videos.forEach(v=>v.pause());
 measure();requestRender();
}
preference.addEventListener('change',()=>setMotion(!preference.matches));

// Native dialogs: focus is trapped by the browser, restored on close, videos paused.
const dialogs=$$('.experience-dialog');
dialogs.forEach(dialog=>{
 const heading=$('h2',dialog);
 if(heading){heading.id=dialog.id+'-title';dialog.setAttribute('aria-labelledby',heading.id);}
 $('[data-close-dialog]',dialog)?.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{$$('video',dialog).forEach(v=>v.pause());html.classList.remove('dialog-open');});
});
$$('[data-open-dialog]').forEach(button=>button.addEventListener('click',()=>{
 const dialog=document.getElementById(button.dataset.openDialog);
 if(!dialog||typeof dialog.showModal!=='function'){location.assign('/MOVA-CREATIVE/contacto/');return;}
 videos.forEach(v=>v.pause());dialog.showModal();html.classList.add('dialog-open');
}));

const hoverCards=matchMedia('(hover:hover) and (pointer:fine)');
$$('[data-service-flip]').forEach(card=>bindFlipCard(card,hoverCards));

// Multi-step quote. No messages are sent, stored or submitted to a server here.
const form=$('#quote-form');
if(form){
 const steps=$$('[data-step]',form), progress=$$('[data-progress]',form);
 const controls=$$('[data-quote-service]',form), next=$('[data-quote-next]',form),back=$('[data-quote-back]',form),submit=$('.quote-submit',form);
 const name=$('#quote-name',form),brand=$('#quote-brand',form),city=$('#quote-city',form),sector=$('#quote-sector',form),state=$('#quote-state',form),start=$('#quote-start',form),collaboration=$('#quote-collaboration',form),message=$('#quote-message',form);
 const params=new URL(location.href).searchParams;let step=0;
 const reference=normalizeQuote({reference:params.get('referencia')}).reference;
 const data=()=>({name:name.value,brand:brand.value,city:city.value,sector:sector.value,state:state.value,start:start.value,collaboration:collaboration.value,message:message.value,reference,services:controls.filter(c=>c.checked).map(c=>c.value)});
 const summarize=()=>{$('[data-quote-summary]',form).textContent=quoteSummary(data())||'Selecciona los servicios de tu proyecto.';};
 const showStep=(n,focus=true)=>{
  step=clamp(n,0,2);steps.forEach((el,i)=>{el.hidden=i!==step;el.disabled=i!==step;});
  progress.forEach((el,i)=>{if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');});
  next.hidden=step===2;submit.hidden=step!==2;back.hidden=step===0;summarize();
  if(focus){const heading=$('legend',steps[step]);heading.tabIndex=-1;heading.focus({preventScroll:true});if(form.getBoundingClientRect().top<90)form.scrollIntoView({behavior:motion?'smooth':'auto',block:'start'});}
 };
 const validate=()=>{
  if(step===0&&!controls.some(c=>c.checked)){$('#service-error',form).textContent='Elige al menos un servicio para continuar.';controls[0].focus();return false;}
  if(step===1){
   brand.setCustomValidity(brand.value.trim()?'':'Escribe el nombre de tu marca o negocio.');
   sector.setCustomValidity(sector.value.trim().length>=2?'':'Cuéntanos a qué se dedica tu negocio.');
   state.setCustomValidity(STATES.includes(state.value)?'':'Selecciona el estado de tu negocio.');
   city.setCustomValidity(city.value.trim().length>=2?'':'Escribe la ciudad de tu negocio.');
   for(const input of [brand,sector,state,city])if(!input.reportValidity())return false;
  }
  return true;
 };
 controls.forEach(c=>c.addEventListener('change',()=>{$('#service-error',form).textContent='';summarize();}));
 [name,brand,city,sector,state,start,collaboration,message].forEach(input=>input.addEventListener('input',()=>{input.setCustomValidity('');summarize();}));
 next.addEventListener('click',()=>{if(validate())showStep(step+1);});
 back.addEventListener('click',()=>showStep(step-1));
 form.noValidate=true;
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(step<2){if(validate())showStep(step+1);return;}
  message.setCustomValidity(message.value.trim().length>=10?'':'Cuéntanos tu idea en al menos 10 caracteres.');
  if(!message.reportValidity())return;
  try{location.assign(buildQuoteURL(data()));}
  catch(error){message.setCustomValidity(error.message);message.reportValidity();}
 });
 if(Object.hasOwn(SECTOR_PREFILLS,params.get('sector')))sector.value=SECTOR_PREFILLS[params.get('sector')];
 const preselected=params.getAll('servicio').filter(s=>Object.hasOwn(SERVICE_LABELS,s));
 controls.forEach(c=>{c.checked=preselected.includes(c.value);});
 showStep(0,false);
}
// Feature videos are exclusive; the muted reel has its own visibility budget.
const featureVideos=videos.filter(video=>!video.hasAttribute('data-loop-video')&&!video.closest('[data-hero]'));
featureVideos.forEach(video=>video.addEventListener('play',()=>featureVideos.forEach(other=>{if(other!==video)other.pause();})));
document.addEventListener('visibilitychange',()=>{if(document.hidden)videos.forEach(v=>v.pause());requestRender();});
const hero=$('[data-hero]'),heroVideo=hero?$('video',hero):null;
let heroVisible=false,playPending=false;
async function playHero(){
 if(!heroVideo||playPending||document.hidden||!heroVisible)return;
 if(!heroVideo.getAttribute('src'))heroVideo.src=narrow.matches?'/MOVA-CREATIVE/assets/11-intro-mobile.mp4':'/MOVA-CREATIVE/assets/11-intro-desktop.mp4';
 playPending=true;
 try{await heroVideo.play();}catch{ /* Keep the poster if the browser refuses muted autoplay. */ }
 finally{playPending=false;if(document.hidden||!heroVisible)heroVideo.pause();}
}
if(heroVideo){
 heroVideo.addEventListener('playing',()=>hero.classList.add('has-played'));
 heroVideo.addEventListener('error',()=>hero.classList.remove('has-played'));
 narrow.addEventListener('change',()=>{heroVideo.pause();heroVideo.removeAttribute('src');heroVideo.load();hero.classList.remove('has-played');void playHero();});
 document.addEventListener('visibilitychange',()=>{if(!document.hidden)void playHero();});
 document.addEventListener('pointerdown',()=>void playHero(),{once:true,passive:true});
}
if('IntersectionObserver' in window){
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  entry.target.classList.toggle('is-in-view',entry.isIntersecting);
  if(entry.target===hero){heroVisible=entry.isIntersecting;if(heroVisible)void playHero();else heroVideo.pause();}
  if(entry.target.tagName==='VIDEO'&&!entry.isIntersecting)entry.target.pause();
 }),{threshold:.05});
 [hero,$('.manifesto-chapter'),...videos.filter(v=>v!==heroVideo)].filter(Boolean).forEach(el=>observer.observe(el));
}else{heroVisible=true;void playHero();}

const work=$('.work-chapter'),rail=$('.sector-viewport'),track=$('.sector-track');
const cinema=$('.cinema-chapter'),logo=$('.cinema-logo'),header=$('.home-page .site-header');
const manifesto=$('.manifesto-chapter'),manifestoBG=$('.manifesto-bg');
const methodology=$('.methodology-chapter'),methodSteps=$$('[data-method-step]');
const methodPinned=matchMedia('(min-width:901px) and (min-height:650px)');
const coverage=$('.coverage-chapter'),map=$('.map-plane'),pins=$$('[data-pin]'),routes=$$('[data-route]'),cityButtons=$$('[data-city]');
const cityCount=cityButtons.length;
let railDistance=0,pinned=false,manualCity=null;
function measure(){
 if(work&&rail&&track){railDistance=Math.max(0,rail.scrollWidth-rail.clientWidth);pinned=motion&&pinAllowed.matches&&railDistance>0;work.classList.toggle('is-pinned',pinned);work.style.setProperty('--rail-distance',`${railDistance}px`);}
}
function scrollToProgress(element,p){const r=element.getBoundingClientRect();window.scrollTo({top:window.scrollY+r.top+clamp(p)*Math.max(0,r.height-window.innerHeight),behavior:motion?'smooth':'auto'});}
function moveRail(direction){
 if(!rail)return;
 const step=($('.sector-card')?.getBoundingClientRect().width||300)+26;
 const desired=clamp(rail.scrollLeft+step*direction,0,railDistance);
 if(pinned)scrollToProgress(work,desired/Math.max(1,railDistance));else rail.scrollTo({left:desired,behavior:motion?'smooth':'auto'});
}
rail?.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveRail(event.key==='ArrowRight'?1:-1);}});
rail?.addEventListener('focusin',event=>{const card=event.target.closest('.sector-card');if(card&&pinned){const x=card.offsetLeft-track.offsetLeft;scrollToProgress(work,clamp(x/Math.max(1,railDistance)));}});
cityButtons.forEach((button,i)=>button.addEventListener('click',()=>{
 if(motion){manualCity=null;scrollToProgress(coverage,(i+.3)/cityCount);}else{manualCity=i;requestRender();}
}));
function setCity(index){
 cityButtons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 pins.forEach((pin,i)=>{pin.classList.toggle('is-revealed',!motion||i<=index);pin.classList.toggle('is-active',i===index);});
 routes.forEach(route=>route.classList.toggle('is-revealed',!motion||Number(route.dataset.route)<=index));
}
render=()=>{
 const vh=window.innerHeight;
 if(header)header.classList.toggle('is-visible',window.scrollY>vh*.58);
 if(cinema&&motion){const r=cinema.getBoundingClientRect(),p=clamp(-r.top/vh);hero.style.opacity=String(1-p*.9);hero.style.transform=`scale(${1+p*.08})`;logo.style.transform=`translateY(${-p*90}px) scale(${1+p*.2})`;logo.style.opacity=String(1-clamp(p*1.15));}
 if(pinned){const r=work.getBoundingClientRect();if(r.top<=1&&r.bottom>=vh-1)rail.scrollLeft=sectionProgress(r.top,r.height,vh)*railDistance;}
 if(manifesto&&motion){const r=manifesto.getBoundingClientRect();if(r.top<vh&&r.bottom>0){const p=(vh/2-r.top-r.height/2)/vh;manifestoBG.style.transform=`translateY(${p*70}px) scale(1.08)`;}}
 if(methodology){
  const r=methodology.getBoundingClientRect();
  if(r.top<vh&&r.bottom>0){
   let active=0;
   if(motion&&methodPinned.matches){active=coverageIndex(sectionProgress(r.top,r.height,vh),methodSteps.length);}
   else{methodSteps.forEach((step,i)=>{if(step.getBoundingClientRect().top<vh*.56)active=i;});}
   methodSteps.forEach((step,i)=>{
    step.classList.toggle('is-revealed',!motion||i<=active);
    step.classList.toggle('is-active',i===active);
    if(i===active)step.setAttribute('aria-current','step');else step.removeAttribute('aria-current');
   });
  }
 }
 if(coverage){
  const r=coverage.getBoundingClientRect(),p=sectionProgress(r.top,r.height,vh);
  if(r.top<vh&&r.bottom>0){
   setCity(manualCity??coverageIndex(p,cityCount));
   if(motion){const pose=coveragePose(p);map.style.transform=`translate3d(${pose.x}px,${pose.y}px,0) rotateX(${pose.rotateX}deg) rotateY(${pose.rotateY}deg) rotateZ(${pose.rotateZ}deg) scale(${pose.scale})`;map.style.opacity=String(pose.opacity);}
   else{map.style.removeProperty('transform');map.style.removeProperty('opacity');}
  }
 }

};
window.addEventListener('scroll',requestRender,{passive:true});
window.addEventListener('resize',()=>{measure();requestRender();},{passive:true});
window.addEventListener('pageshow',()=>{measure();requestRender();});
setMotion(!preference.matches);
initLoopMedia();
initServiceScenes();
