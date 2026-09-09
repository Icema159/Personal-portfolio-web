import { effectsConfig } from './config';
import { createFluid } from './fluid';
import { createHeadingTexture } from './heading';

// One owner for the context, pointer state and animation clock.
export function createEffectsRuntime(canvas) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const controller = new AbortController();
  const listen = (target, name, handler) => target.addEventListener(name, handler, {
    passive: true, signal: controller.signal,
  });
  const pointer = { x: 0, y: 0, u: 0, v: 0, heroU: 0, heroV: 0,
    dx: 0, dy: 0, inside: false, overHero: false };
  let fluid, heading, failed = false;
  let distortion = 0, hoverPoint = [0, 0], lastMotion = -Infinity;
  let slowWindows = 0, qualityReduced = false;
  const runtimeConfig = { ...effectsConfig };
  let gl, frame = 0, last = 0, lost = false, disposed = false;
  let samples = [], measurementStart = 0;
  const enabled = effectsConfig.smokeEnabled || effectsConfig.distortionEnabled;
  const measuring = import.meta.env.DEV;
  const allowed = () => !reduced.matches && fine.matches && !document.hidden && !lost && !failed;
  canvas.dataset.effects = enabled ? 'enabled' : 'disabled';

  function resetPointer() {
    pointer.inside = false;
    pointer.overHero = false;
    pointer.dx = pointer.dy = 0;
  }
  function coordinates() {
    pointer.u = pointer.x / innerWidth;
    pointer.v = 1 - pointer.y / innerHeight;
    // Read every frame: hero also moves through Framer Motion transforms.
    const rect = document.querySelector('.name-stage')?.getBoundingClientRect();
    pointer.overHero = Boolean(pointer.inside && rect && pointer.x >= rect.left &&
      pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom);
    pointer.heroU = rect?.width ? (pointer.x - rect.left) / rect.width : 0;
    pointer.heroV = rect?.height ? 1 - (pointer.y - rect.top) / rect.height : 0;
  }
  function fallback(error) {
    failed = true; cancelAnimationFrame(frame); frame = 0;
    heading?.dispose(); heading = null; fluid?.dispose(); fluid = null;
    canvas.hidden = true; canvas.dataset.webgl = 'unavailable';
    canvas.dataset.state = 'fallback';
    if (measuring && error) console.warn('Effects fallback:', error.message);
  }
  function resize() {
    try {
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(innerWidth * ratio);
    canvas.height = Math.round(innerHeight * ratio);
    gl?.viewport(0, 0, canvas.width, canvas.height);
    fluid?.resize(canvas.width, canvas.height);
    heading?.invalidate();
    } catch (error) { fallback(error); }
  }
  function initialise() {
    if (gl || lost) return Boolean(gl);
    try {
      gl = canvas.getContext('webgl2', { alpha: true, antialias: false,
        depth: false, stencil: false, premultipliedAlpha: true });
    } catch { /* Keep the existing HTML when WebGL is unavailable. */ }
    canvas.dataset.webgl = gl ? 'ready' : 'unavailable';
    if (gl) { resize(); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); }
    if (gl && enabled) {
      try {
        fluid = createFluid(gl, runtimeConfig);
        if (effectsConfig.distortionEnabled) heading = createHeadingTexture(gl);
      }
      catch (error) {
        fallback(error);
        return false;
      }
    }
    if (!gl) fallback();
    return Boolean(gl) && !failed;
  }
  function tick(now) {
    frame = 0;
    if (disposed || !allowed()) return;
    const delta = last ? now - last : 0;
    last = now;
    coordinates();
    if (measuring) {
      canvas.dataset.pointer = JSON.stringify({
        u: +pointer.u.toFixed(3), v: +pointer.v.toFixed(3),
        heroU: +pointer.heroU.toFixed(3), heroV: +pointer.heroV.toFixed(3),
        overHero: pointer.overHero,
      });
    }
    if (!measurementStart) measurementStart = now;
    if (delta && samples.length < 600) samples.push(delta);
    if (now - measurementStart >= 3000 && samples.length) {
      const ordered = [...samples].sort((a, b) => a - b);
      const fps = 1000 / (samples.reduce((a, b) => a + b, 0) / samples.length);
      if (measuring) canvas.dataset.baseline = JSON.stringify({
        mode: enabled ? 'effects' : 'effects-disabled', frames: samples.length,
        fps: +(1000 / (samples.reduce((a, b) => a + b, 0) / samples.length)).toFixed(1),
        p95Ms: +ordered[Math.floor((ordered.length - 1) * .95)].toFixed(2),
      });
      slowWindows = fps < 45 ? slowWindows + 1 : 0;
      if (slowWindows >= 2 && !qualityReduced && fluid) {
        qualityReduced = true; runtimeConfig.resolution = 256;
        runtimeConfig.pressureIterations = 12;
        try { fluid.resize(canvas.width, canvas.height); }
        catch (error) { fallback(error); return; }
        canvas.dataset.quality = 'reduced';
      }
      samples = []; measurementStart = now;
    }
    if (pointer.overHero) hoverPoint = [pointer.u, pointer.v];
    distortion += ((pointer.overHero ? 1 : 0) - distortion) * (1 - Math.exp(-delta / 180));
    try {
      const headingState = heading?.update();
      if (Math.hypot(pointer.dx, pointer.dy) > .1) lastMotion = now;
      const simulate = now - lastMotion < 8000;
      canvas.dataset.simulation = simulate ? 'active' : 'idle';
      fluid?.step(delta / 1000, pointer, headingState, distortion, hoverPoint, simulate);
      if (delta > 0) headingState?.commit();
    } catch (error) {
      fallback(error);
      return;
    }
    pointer.dx = pointer.dy = 0;
    frame = requestAnimationFrame(tick);
  }
  function sync() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    samples = []; measurementStart = 0; resetPointer();
    heading?.showOriginal(); distortion = 0;
    canvas.hidden = !allowed();
    canvas.dataset.state = allowed() ? 'running' : 'paused';
    if (!lost) fluid?.clear();
    lastMotion = -Infinity;
    if (allowed() && (enabled || measuring) && initialise()) frame = requestAnimationFrame(tick);
  }
  listen(window, 'pointermove', event => {
    if (event.pointerType !== 'mouse' || !allowed()) return;
    pointer.dx += pointer.inside ? event.clientX - pointer.x : 0;
    pointer.dy += pointer.inside ? event.clientY - pointer.y : 0;
    pointer.x = event.clientX; pointer.y = event.clientY; pointer.inside = true;
  });
  listen(document.documentElement, 'pointerleave', resetPointer);
  listen(window, 'blur', resetPointer);
  listen(window, 'resize', resize);
  listen(document, 'visibilitychange', sync);
  listen(reduced, 'change', sync); listen(fine, 'change', sync);
  // Context loss needs preventDefault, so this listener cannot be passive.
  canvas.addEventListener('webglcontextlost', event => {
    event.preventDefault(); lost = true; canvas.dataset.webgl = 'lost'; sync();
  }, { signal: controller.signal });
  listen(canvas, 'webglcontextrestored', () => {
    heading?.dispose(); heading = null; fluid?.dispose(); fluid = null; gl = null; lost = false; sync();
  });
  sync();
  return () => {
    disposed = true; controller.abort(); cancelAnimationFrame(frame);
    // Keep the canvas context reusable during React StrictMode effect replay.
    heading?.dispose(); fluid?.dispose();
    gl?.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (gl && !lost) gl.clear(gl.COLOR_BUFFER_BIT);
  };
}
