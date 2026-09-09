import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const code = readFileSync(new URL('../src/effects/runtime.js', import.meta.url), 'utf8')
  .replace(/^import .*;$/gm, '').replace('export function', 'function')
  .replaceAll('import.meta.env.DEV', 'false');
function setup({ unsupported = false, reduced = false } = {}) {
  const media = value => Object.assign(new EventTarget(), { matches: value });
  const reduce = media(reduced), fine = media(true);
  const window = new EventTarget(), document = Object.assign(new EventTarget(), {
    hidden: false, documentElement: new EventTarget(),
    querySelector: () => ({ getBoundingClientRect: () => ({left:0,right:800,top:100,bottom:300,width:800,height:200}) }),
  });
  const frames = new Map(); let id = 0, visible = true, disposed = 0, simulate, resizes = 0;
  const gl = { viewport(){}, clearColor(){}, clear(){}, bindFramebuffer(){} };
  const canvas = Object.assign(new EventTarget(), { dataset:{}, hidden:false,
    getContext: () => unsupported ? null : gl });
  const context = vm.createContext({ window, document, console, AbortController,
    innerWidth:1000,innerHeight:800,devicePixelRatio:2,
    matchMedia: query => query.includes('reduced') ? reduce : fine,
    effectsConfig:{smokeEnabled:true,distortionEnabled:true,resolution:384},
    createFluid:()=>({ resize(){resizes++;},clear(){},dispose(){disposed++;},step(...args){simulate=args[5];} }),
    createHeadingTexture:()=>({invalidate(){},showOriginal(){visible=true;},dispose(){visible=true;},
      update:()=>({commit(){visible=false;}})}),
    requestAnimationFrame: fn => { frames.set(++id,fn); return id; },
    cancelAnimationFrame: key => frames.delete(key),
  });
  vm.runInContext(code,context);
  const start = () => context.createEffectsRuntime(canvas);
  const cleanup = start();
  return {canvas,reduce,fine,document,window,frames,cleanup,start,
    get visible(){return visible;},get disposed(){return disposed;},get simulate(){return simulate;},get resizes(){return resizes;},
    tick(now){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(now));},
    move(){const e=new Event('pointermove');Object.assign(e,{pointerType:'mouse',clientX:150,clientY:150});window.dispatchEvent(e);},
  };
}
test('media changes pause RAF and restore semantic heading',()=>{
  const h=setup();h.tick(10);h.tick(27);assert.equal(h.visible,false);
  h.reduce.matches=true;h.reduce.dispatchEvent(new Event('change'));
  assert.equal(h.visible,true);assert.equal(h.frames.size,0);assert.equal(h.canvas.hidden,true);
  h.reduce.matches=false;h.reduce.dispatchEvent(new Event('change'));assert.equal(h.frames.size,1);
  h.fine.matches=false;h.fine.dispatchEvent(new Event('change'));assert.equal(h.frames.size,0);h.cleanup();
});
test('visibility resume and StrictMode replay own exactly one loop',()=>{
  const h=setup();h.document.hidden=true;h.document.dispatchEvent(new Event('visibilitychange'));assert.equal(h.frames.size,0);
  h.document.hidden=false;h.document.dispatchEvent(new Event('visibilitychange'));assert.equal(h.frames.size,1);
  h.cleanup();assert.equal(h.frames.size,0);assert.equal(h.disposed,1);
  const cleanup=h.start();assert.equal(h.frames.size,1);cleanup();assert.equal(h.frames.size,0);
});
test('context loss restores HTML and context restoration restarts',()=>{
  const h=setup();h.tick(10);h.tick(27);
  h.canvas.dispatchEvent(new Event('webglcontextlost',{cancelable:true}));
  assert.equal(h.visible,true);assert.equal(h.frames.size,0);
  h.canvas.dispatchEvent(new Event('webglcontextrestored'));assert.equal(h.frames.size,1);h.cleanup();
});
test('unavailable WebGL and initial reduced motion leave HTML visible',()=>{
  for(const options of [{unsupported:true},{reduced:true}]){const h=setup(options);assert.equal(h.visible,true);assert.equal(h.frames.size,0);h.cleanup();}
});
test('idle skips fluid passes and motion resumes them',()=>{
  const h=setup();h.tick(10);h.tick(27);assert.equal(h.simulate,false);
  h.move();h.tick(44);h.window.dispatchEvent(new Event('pointermove')); // ignored non-mouse event
  const e=new Event('pointermove');Object.assign(e,{pointerType:'mouse',clientX:200,clientY:150});h.window.dispatchEvent(e);
  h.tick(61);assert.equal(h.simulate,true);h.tick(9000);assert.equal(h.simulate,false);h.cleanup();
});
test('sustained low frame rate reduces quality once',()=>{
  const h=setup();for(let t=1;t<13000;t+=40)h.tick(t);
  assert.equal(h.canvas.dataset.quality,'reduced');assert.equal(h.resizes,1);h.cleanup();
});
