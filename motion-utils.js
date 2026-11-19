export const clamp=(n,min=0,max=1)=>Math.min(max,Math.max(min,Number.isFinite(n)?n:0));
export function sectionProgress(top,height,viewport){return clamp(-top/Math.max(1,height-viewport));}
export function coverageIndex(progress,count=5){return Math.min(count-1,Math.floor(clamp(progress)*count));}
export function coveragePose(progress){
 const p=clamp(progress),entry=1-Math.pow(1-clamp(p/.2),3);
 return {x:Math.sin(p*Math.PI*2)*14,y:(1-entry)*80,rotateX:26*(1-entry)+Math.sin(p*Math.PI)*4,rotateY:-7+p*14,rotateZ:-4+p*7,scale:.8+entry*.28+Math.sin(p*Math.PI)*.03,opacity:.3+entry*.7};
}
