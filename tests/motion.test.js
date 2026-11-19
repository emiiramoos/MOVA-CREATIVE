import test from 'node:test';
import assert from 'node:assert/strict';
import {sectionProgress,coverageIndex,coveragePose} from '../dist/motion-utils.js';
test('El scroll permanece acotado antes y después de cada escena',()=>{
 assert.equal(sectionProgress(500,2400,800),0);assert.equal(sectionProgress(-800,2400,800),.5);assert.equal(sectionProgress(-5000,2400,800),1);
 for(const h of [0,600,800])for(const top of [0,-500,500])assert.ok(Number.isFinite(sectionProgress(top,h,800)));
});
test('Todos los lugares aparecen en orden y el mapa entra desde profundidad',()=>{
 assert.deepEqual([-.1,0,.2,.4,.6,.8,1,2].map(p=>coverageIndex(p)),[0,0,1,2,3,4,4,4]);
 const start=coveragePose(0),end=coveragePose(1);assert.ok(start.scale<end.scale);assert.ok(start.y>end.y);assert.ok(start.opacity<end.opacity);
});
test('La metodología recorre cinco pasos y permite volver hacia atrás sin salir del rango',()=>{
 assert.deepEqual([0,.2,.4,.6,.8,1,.6,.2,0].map(p=>coverageIndex(p,5)),[0,1,2,3,4,4,3,1,0]);
});
