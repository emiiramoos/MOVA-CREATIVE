const clamp=value=>Math.max(0,Math.min(1,Number.isFinite(value)?value:0));
const smooth=value=>{const p=clamp(value);return p*p*(3-2*p);};

// Adjacent panels reach zero at their shared boundary, so titles never overlap.
export function serviceScenePose(position,index){
 const offset=position-index;
 const entering=smooth((offset+.5)/.32),leaving=smooth((.5-offset)/.32);
 return {opacity:Math.min(entering,leaving),y:offset<0?(1-entering)*42:-(1-leaving)*30,scale:.94+.06*entering};
}

export function initServiceScenes(root=document){
 const section=root.querySelector('.solutions-chapter');
 if(!section)return;
 const stage=section.querySelector('.solutions-stage'),panels=[...section.querySelectorAll('[data-service-scene]')];
 const backgrounds=[...section.querySelectorAll('[data-service-backdrop]')];
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let pending=false;
 function render(){
  pending=false;
  if(preference.matches)return;
  const bounds=section.getBoundingClientRect();
  const position=clamp(-bounds.top/Math.max(1,bounds.height-stage.clientHeight))*(panels.length-1);
  panels.forEach((panel,index)=>{
   const pose=serviceScenePose(position,index);
   panel.style.opacity=String(pose.opacity);
   panel.style.transform=`translate3d(0,${pose.y}px,0) scale(${pose.scale})`;
   panel.classList.toggle('is-active',pose.opacity>.01);
  });
  // Backgrounds crossfade independently; the glass always samples an image.
  backgrounds.forEach((background,index)=>{
   const blend=clamp(1-Math.abs(position-index));
   background.style.opacity=String(blend);
   background.style.transform=`scale(${1.055-.025*blend})`;
  });
 }
 function schedule(){if(!pending&&!preference.matches){pending=true;requestAnimationFrame(render);}}
 function configure(){
  section.classList.toggle('has-service-scenes',!preference.matches);
  section.style.setProperty('--scene-count',String(panels.length-1));
  if(preference.matches){
   panels.forEach(panel=>{
    panel.style.removeProperty('opacity');panel.style.removeProperty('transform');panel.classList.remove('is-active');
   });
   backgrounds.forEach(background=>{background.style.removeProperty('opacity');background.style.removeProperty('transform');});
  }
  else render();
 }
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 preference.addEventListener('change',configure);
 configure();
}
