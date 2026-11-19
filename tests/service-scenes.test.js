import test from 'node:test';
import assert from 'node:assert/strict';
import {serviceScenePose,initServiceScenes} from '../dist/service-scenes.js';

test('El recorrido muestra el título y los seis servicios completos, en ambos sentidos',()=>{
 for(const position of [0,1,2,3,4,5,6,5,3,1,0]){
  const poses=Array.from({length:7},(_,i)=>serviceScenePose(position,i));
  assert.equal(poses[position].opacity,1);
  assert.equal(poses[position].scale,1);
  assert.equal(Math.abs(poses[position].y),0);
  assert.equal(poses.filter(p=>p.opacity>0).length,1);
 }
});

test('Las transiciones nunca superponen textos y llegan suavemente a cada tarjeta',()=>{
 for(let step=0;step<=600;step++){
  const position=step/100;
  const poses=Array.from({length:7},(_,i)=>serviceScenePose(position,i));
  assert.ok(poses.filter(p=>p.opacity>.001).length<=1);
  for(const pose of poses){assert.ok(pose.opacity>=0&&pose.opacity<=1);assert.ok(Number.isFinite(pose.y));}
 }
 assert.ok(serviceScenePose(.65,1).opacity<serviceScenePose(.8,1).opacity);
 assert.ok(serviceScenePose(1.35,1).opacity<serviceScenePose(1.2,1).opacity);
});

test('El fondo sigue al servicio y se restaura la lectura estática al reducir movimiento',t=>{
 const saved=Object.fromEntries(['window','matchMedia','requestAnimationFrame'].map(key=>[key,globalThis[key]]));
 t.after(()=>{for(const [key,value] of Object.entries(saved))if(value===undefined)delete globalThis[key];else globalThis[key]=value;});
 const node=()=>({style:{setProperty(key,value){this[key]=value;},removeProperty(key){delete this[key];}},classList:{values:new Set(),toggle(key,on){on?this.values.add(key):this.values.delete(key);},remove(key){this.values.delete(key);}}});
 const panels=Array.from({length:7},node),backgrounds=Array.from({length:7},node),events={};
 let top=0,configure;
 const preference={matches:false,addEventListener(type,fn){configure=fn;}};
 const section={...node(),querySelector:()=>({clientHeight:800}),querySelectorAll:selector=>selector==='[data-service-scene]'?panels:backgrounds,getBoundingClientRect:()=>({top,height:4640})};
 globalThis.window={addEventListener(type,fn){events[type]=fn;}};
 globalThis.matchMedia=()=>preference;globalThis.requestAnimationFrame=fn=>{fn();return 1;};
 initServiceScenes({querySelector:()=>section});
 assert.equal(panels[0].style.opacity,'1');
 top=-1920;events.scroll();
 assert.equal(panels[3].style.opacity,'1');assert.equal(backgrounds[3].style.opacity,'1');
 top=-2240;events.scroll();
 assert.equal(backgrounds[3].style.opacity,'0.5');assert.equal(backgrounds[4].style.opacity,'0.5');
 preference.matches=true;configure();
 assert.equal(section.classList.values.has('has-service-scenes'),false);
 assert.ok([...panels,...backgrounds].every(item=>item.style.opacity===undefined&&item.style.transform===undefined));
 preference.matches=false;top=0;configure();
 assert.equal(panels[0].style.opacity,'1');
});
