(() => {
  const IMG_SRC = './headshot.png';
  const CHAR_RAMP = ' .\'`^",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$';
  const CHAR_ASPECT = 0.55;
  const BASE_ROWS = 80;
  const SHIMMER_RATE = 0.005;
  const SCANLINE_WIDTH = 4;   // rows the glow covers
  const SCANLINE_BOOST = 0.18; // brightness boost at center
  const ASCII_COLOR = '#4a4a4a';
  const GLOW_RADIUS = 12; // horizontal glow radius in cols

  const pre = document.createElement('pre');
  pre.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;margin:0;padding:0;background:transparent;color:' + ASCII_COLOR + ';font-family:"Courier New",monospace;overflow:hidden;display:flex;align-items:center;justify-content:center;white-space:pre;cursor:default;user-select:none;z-index:10;';
  document.body.appendChild(pre);

  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  let cols = 0, rows = 0;
  let drawCols = 0, drawRows = 0;
  let rawPixels = null;
  let figureMask = null;
  let running = false;
  // Mouse position in grid coords (smoothed)
  let mouseGridX = 0, mouseGridY = 0;
  let smoothGX = 0, smoothGY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseGridX = (e.clientX / window.innerWidth) * cols;
    mouseGridY = (e.clientY / window.innerHeight) * rows;
  });

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    computeGrid();
    running = true;
    requestAnimationFrame(render);
  };
  img.src = IMG_SRC;

  function computeGrid() {
    rows = BASE_ROWS;
    cols = Math.round(rows * (window.innerWidth / window.innerHeight) / CHAR_ASPECT);

    const imgAspect = img.width / img.height;
    const gridAspect = (cols * CHAR_ASPECT) / rows;

    if (imgAspect > gridAspect) {
      drawCols = cols;
      drawRows = Math.round(drawCols / imgAspect * CHAR_ASPECT);
    } else {
      drawRows = rows;
      drawCols = Math.round(drawRows * imgAspect / CHAR_ASPECT);
    }

    canvas.width = drawCols;
    canvas.height = drawRows;
    ctx.drawImage(img, 0, 0, drawCols, drawRows);
    rawPixels = ctx.getImageData(0, 0, drawCols, drawRows).data;

    // Mask = alpha channel. Transparent pixels = background. That's it.
    figureMask = new Uint8Array(drawCols * drawRows);
    for (let y = 0; y < drawRows; y++) {
      for (let x = 0; x < drawCols; x++) {
        const i = (y * drawCols + x) * 4;
        if (rawPixels[i + 3] > 128) {
          figureMask[y * drawCols + x] = 1;
        }
      }
    }

    const fontSize = Math.floor(window.innerHeight / rows);
    pre.style.fontSize = fontSize + 'px';
    pre.style.lineHeight = fontSize + 'px';
  }

  let scanlineY = 0;
  let lastTime = 0;

  function render(time) {
    if (!running) return;
    requestAnimationFrame(render);

    const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
    lastTime = time;

    // Smooth cursor tracking in grid space
    smoothGX += (mouseGridX - smoothGX) * 0.1;
    smoothGY += (mouseGridY - smoothGY) * 0.1;

    const rampLen = CHAR_RAMP.length - 1;
    let out = '';

    const baseOffX = Math.floor((drawCols - cols) / 2);
    const baseOffY = Math.floor((drawRows - rows) / 2);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const sx = x + baseOffX;
        const sy = y + baseOffY;

        if (sx < 0 || sx >= drawCols || sy < 0 || sy >= drawRows) {
          out += ' ';
          continue;
        }

        const srcIdx = sy * drawCols + sx;

        if (!figureMask[srcIdx]) {
          out += ' ';
          continue;
        }

        const pi = srcIdx * 4;
        const r = rawPixels[pi];
        const g = rawPixels[pi + 1];
        const b = rawPixels[pi + 2];
        let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

        // Cursor-following glow — distance from cursor position
        const dx = x - smoothGX;
        const dy = y - smoothGY;
        const distY = Math.abs(dy);
        const distX = Math.abs(dx);

        if (distY < SCANLINE_WIDTH && distX < GLOW_RADIUS) {
          const falloffY = 1 - distY / SCANLINE_WIDTH;
          const falloffX = 1 - distX / GLOW_RADIUS;
          lum = Math.min(1, lum + SCANLINE_BOOST * falloffY * falloffX);
        }

        let charIndex = Math.floor((1 - lum) * rampLen);
        if (Math.random() < SHIMMER_RATE) {
          charIndex += Math.random() < 0.5 ? 1 : -1;
          charIndex = Math.max(0, Math.min(rampLen, charIndex));
        }

        out += CHAR_RAMP[charIndex];
      }
      out += '\n';
    }

    pre.textContent = out;
  }

  window.addEventListener('resize', () => {
    if (img.complete && img.naturalWidth > 0) {
      computeGrid();
    }
  });
})();
