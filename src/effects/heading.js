// Rasterise the actual DOM glyph positions, retaining the semantic heading.
export function createHeadingTexture(gl) {
  const heading = document.querySelector('.name-stage h1');
  if (!heading) return null;
  const surface = document.createElement('canvas');
  const ctx = surface.getContext('2d');
  const texture = gl.createTexture();
  const padding = 90;
  let dirty = true, ready = false, disposed = false;
  let width = 0, height = 0;
  const observer = new ResizeObserver(() => { dirty = true; });
  observer.observe(heading);
  const fontsChanged = () => { dirty = true; };
  document.fonts.addEventListener('loadingdone', fontsChanged);
  document.fonts.ready.then(() => { if (!disposed) { ready = true; dirty = true; } });
  function showOriginal() { heading.classList.remove('fluid-heading-ready'); }
  function update() {
    if (!ready || innerWidth <= 760) { showOriginal(); return null; }
    const rect = heading.getBoundingClientRect();
    if (!rect.width || !rect.height || rect.bottom < 0 || rect.top > innerHeight) {
      showOriginal(); return null;
    }
    if (dirty) {
      showOriginal();
      const style = getComputedStyle(heading);
      const dpr = Math.min(devicePixelRatio || 1, 2);
      width = rect.width + padding * 2; height = rect.height + padding * 2;
      surface.width = Math.ceil(width * dpr); surface.height = Math.ceil(height * dpr);
      ctx.scale(dpr, dpr);
      ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
      ctx.fillStyle = style.color; ctx.textBaseline = 'alphabetic';
      const metrics = ctx.measureText('Hg');
      const ascent = metrics.fontBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent;
      const lineHeight = parseFloat(style.lineHeight);
      for (const span of heading.querySelectorAll('span')) {
        const node = span.firstChild;
        if (!node || node.nodeType !== Node.TEXT_NODE) continue;
        const spanRect = span.getBoundingClientRect();
        const baseline = spanRect.top - rect.top + (lineHeight - ascent - descent) / 2 + ascent + padding;
        const range = document.createRange();
        for (let i = 0; i < node.length; i++) {
          range.setStart(node, i); range.setEnd(node, i + 1);
          ctx.fillText(node.textContent[i], range.getBoundingClientRect().left - rect.left + padding, baseline);
        }
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, surface);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      dirty = false;
    }
    const opacity = Number(getComputedStyle(heading.closest('.hero-center')).opacity);
    const workTop = document.getElementById('projects').getBoundingClientRect().top;
    return { texture, origin: [(rect.left - padding) / innerWidth,
      1 - (rect.bottom + padding) / innerHeight],
      size: [width / innerWidth, height / innerHeight], opacity,
      clipY: 1 - Math.min(innerHeight, workTop) / innerHeight,
      commit: () => heading.classList.add('fluid-heading-ready') };
  }
  return { update, showOriginal, invalidate: () => { dirty = true; }, dispose() {
    disposed = true; showOriginal(); observer.disconnect();
    document.fonts.removeEventListener('loadingdone', fontsChanged); gl.deleteTexture(texture);
  } };
}
