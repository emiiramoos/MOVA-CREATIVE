import test from 'node:test';
import assert from 'node:assert/strict';
import {wrapOffset} from '../dist/loop-media.js';
test('El carrusel conserva continuidad al cruzar el final o arrastrar hacia atrás',()=>{
 assert.equal(wrapOffset(1600,1600),0);
 assert.equal(wrapOffset(1608,1600),8);
 assert.equal(wrapOffset(-8,1600),1592);
 assert.equal(wrapOffset(10,0),0);
 for(const width of [300,768,1440])for(let n=-8000;n<8000;n+=57){
  const offset=wrapOffset(n,width);assert.ok(offset>=0&&offset<width);
  assert.equal(wrapOffset(n+width,width),offset);
 }
});
