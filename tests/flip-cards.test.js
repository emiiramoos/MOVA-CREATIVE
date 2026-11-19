import test from 'node:test';
import assert from 'node:assert/strict';
import { bindFlipCard } from '../dist/flip-cards.js';
function cardWith(hover) {
  const handlers=new Map(),classes=new Set(),attributes=new Map();
  const card={
    classList:{toggle:(key,on)=>on?classes.add(key):classes.delete(key),contains:key=>classes.has(key)},
    setAttribute:(key,value)=>attributes.set(key,value),
    addEventListener:(type,handler)=>handlers.set(type,handler)
  };
  bindFlipCard(card,{matches:hover});
  return {fire:(type,props={})=>handlers.get(type)?.(props),flipped:()=>classes.has('is-flipped'),pressed:()=>attributes.get('aria-pressed')};
}
test('Mouse: entrar revela, hacer clic no invierte la vista y salir la restaura',()=>{
 const c=cardWith(true);c.fire('pointerenter',{pointerType:'mouse'});assert.equal(c.flipped(),true);
 c.fire('pointerdown',{pointerType:'mouse'});c.fire('click',{detail:1});assert.equal(c.flipped(),true);
 c.fire('pointerleave',{pointerType:'mouse'});assert.equal(c.flipped(),false);assert.equal(c.pressed(),'false');
});
test('Toque: alterna ambas caras incluso en una tablet con mouse conectado',()=>{
 for(const hover of [true,false]){const c=cardWith(hover);
  c.fire('pointerenter',{pointerType:'touch'});assert.equal(c.flipped(),false);
  c.fire('pointerdown',{pointerType:'touch'});c.fire('click',{detail:1});assert.equal(c.flipped(),true);
  c.fire('pointerdown',{pointerType:'touch'});c.fire('click',{detail:1});assert.equal(c.flipped(),false);
 }
});
test('Activación nativa por teclado, Escape y pérdida de foco son reversibles',()=>{
 const c=cardWith(true);c.fire('click',{detail:0});assert.equal(c.pressed(),'true');
 c.fire('keydown',{key:'Escape'});assert.equal(c.flipped(),false);
 c.fire('click',{detail:0});c.fire('blur');assert.equal(c.flipped(),false);
});
