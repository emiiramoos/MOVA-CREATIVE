export const wrapOffset=(position,width)=>width>0?((position%width)+width)%width:0;

export function initLoopMedia(root=document){
 const section=root.querySelector('.reel-chapter'),viewport=root.querySelector('.reel-viewport');
 const track=root.querySelector('.reel-track'),group=root.querySelector('.reel-group');
 const loops=[...root.querySelectorAll('[data-loop-video]')];
 if(!loops.length)return;
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 let inView=false,drag=null;
 let width=0,offset=0,last=0,lastMedia=0,raf=0;
 const visible=new Set(),playing=new WeakSet();
 const featurePlaying=()=>[...root.querySelectorAll('video[controls]')].some(v=>!v.paused&&!v.ended);
 const allowed=()=>!document.hidden&&!preference.matches&&!navigator.connection?.saveData&&!root.querySelector('dialog[open]')&&!featurePlaying();
 async function start(video){
  if(!video.paused||playing.has(video))return;
  if(!video.getAttribute('src'))video.src=video.dataset.src;
  playing.add(video);
  try{await video.play();}catch{ /* Poster remains available if autoplay is refused. */ }
  finally{playing.delete(video);if(!allowed()||!visible.has(video))video.pause();}
 }
 function updateMedia(){
  const permitted=allowed();
  for(const video of loops){
   const enabled=permitted&&visible.has(video);
   if(enabled)void start(video);else video.pause();
  }
 }
 function draw(){if(track)track.style.transform=`translate3d(${-offset}px,0,0)`;}
 function schedule(){if(!raf&&inView&&allowed()&&!drag)raf=requestAnimationFrame(tick);}
 function tick(time){
  raf=0;
  if(!inView||!allowed()||drag){last=0;return;}
  if(last)offset=wrapOffset(offset+Math.min(time-last,64)*.051,width);
  last=time;draw();
  if(time-lastMedia>300){lastMedia=time;updateMedia();}
  schedule();
 }
 function refresh(){last=0;updateMedia();schedule();}
 if('IntersectionObserver' in window){
  const mediaObserver=new IntersectionObserver(entries=>{
   entries.forEach(entry=>entry.isIntersecting?visible.add(entry.target):visible.delete(entry.target));updateMedia();
  },{threshold:.15});loops.forEach(video=>mediaObserver.observe(video));
  if(section)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;refresh();},{threshold:.05}).observe(section);
 }else{loops.forEach(video=>visible.add(video));inView=true;}
 if(group&&'ResizeObserver' in window)new ResizeObserver(()=>{width=group.getBoundingClientRect().width;offset=wrapOffset(offset,width);draw();}).observe(group);
 else if(group)width=group.getBoundingClientRect().width;
 if(viewport){
  viewport.addEventListener('keydown',event=>{
   if(event.key==='ArrowLeft'||event.key==='ArrowRight'){
    event.preventDefault();offset=wrapOffset(offset+(event.key==='ArrowRight'?1:-1)*280,width);draw();updateMedia();
   }
  });
  viewport.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY,offset,id:event.pointerId,locked:false};last=0;});
  viewport.addEventListener('pointermove',event=>{
   if(!drag)return;
   const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
   if(!drag.locked){if(Math.abs(dy)>Math.abs(dx)&&Math.abs(dy)>10){drag=null;return;}if(Math.abs(dx)<8)return;drag.locked=true;viewport.setPointerCapture(event.pointerId);}
   offset=wrapOffset(drag.offset-dx,width);draw();updateMedia();
  });
  const end=()=>{drag=null;refresh();};
  viewport.addEventListener('pointerup',end);viewport.addEventListener('pointercancel',end);
 }
 preference.addEventListener('change',refresh);document.addEventListener('visibilitychange',refresh);
 navigator.connection?.addEventListener?.('change',refresh);
 root.querySelectorAll('video[controls]').forEach(v=>{v.addEventListener('play',refresh);v.addEventListener('pause',refresh);});
 new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
 window.addEventListener('resize',refresh,{passive:true});
 refresh();
}
