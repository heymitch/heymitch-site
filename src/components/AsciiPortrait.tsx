"use client";

import { useEffect, useRef } from "react";

const CHAR_RAMP =
  " .'`^\",:;Il!i><~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$";
const CHAR_ASPECT = 0.55;
const BASE_ROWS = 80;
const SHIMMER_RATE = 0.005;
const SCANLINE_WIDTH = 3;    // full-width scanline thickness (rows)
const SCANLINE_BOOST = 0.15; // scanline brightness boost
const BUBBLE_RADIUS = 10;   // hover bubble radius (chars)
const BUBBLE_BOOST = 0.22;  // hover bubble brightness boost
const ASCII_COLOR = "#4a4a4a";

export default function AsciiPortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    const pre = preRef.current;
    if (!container || !pre) return;

    const canvas = document.createElement("canvas");
    let cols = 0, rows = 0;
    let drawCols = 0, drawRows = 0;
    let rawPixels: Uint8ClampedArray | null = null;
    let figureMask: Uint8Array | null = null;
    let mouseGX = -999, mouseGY = -999; // bubble position (over image only)
    let smoothGX = -999, smoothGY = -999;
    let mousePageY = 0;      // Y position from anywhere on the page
    let smoothPageY = 0;
    let isHovering = false;  // is cursor over the ASCII container?
    let lastTime = 0;
    let running = true;

    function computeGrid(img: HTMLImageElement) {
      const w = container!.offsetWidth;
      const h = container!.offsetHeight;
      if (w === 0 || h === 0) return false;

      rows = BASE_ROWS;
      cols = Math.round(rows * (w / h) / CHAR_ASPECT);

      const imgAspect = img.width / img.height;
      const gridAspect = (cols * CHAR_ASPECT) / rows;

      if (imgAspect > gridAspect) {
        drawCols = cols;
        drawRows = Math.round(cols / imgAspect * CHAR_ASPECT);
      } else {
        drawRows = rows;
        drawCols = Math.round(rows * imgAspect / CHAR_ASPECT);
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return false;

      canvas.width = drawCols;
      canvas.height = drawRows;
      ctx.drawImage(img, 0, 0, drawCols, drawRows);
      rawPixels = ctx.getImageData(0, 0, drawCols, drawRows).data;

      figureMask = new Uint8Array(drawCols * drawRows);
      for (let y = 0; y < drawRows; y++) {
        for (let x = 0; x < drawCols; x++) {
          const i = (y * drawCols + x) * 4;
          if (rawPixels[i + 3] > 128) {
            figureMask[y * drawCols + x] = 1;
          }
        }
      }

      const fontSize = Math.floor(h / rows);
      pre!.style.fontSize = fontSize + "px";
      pre!.style.lineHeight = fontSize + "px";
      return true;
    }

    function render(time: number) {
      if (!running) return;
      rafRef.current = requestAnimationFrame(render);

      if (!rawPixels || !figureMask) return;

      const dt = lastTime ? (time - lastTime) / 1000 : 0.016;
      lastTime = time;

      // Smooth the page-wide scanline Y
      smoothPageY += (mousePageY - smoothPageY) * 0.1;

      // Smooth the bubble position (only when hovering)
      if (isHovering) {
        smoothGX += (mouseGX - smoothGX) * 0.12;
        smoothGY += (mouseGY - smoothGY) * 0.12;
      }

      const rampLen = CHAR_RAMP.length - 1;
      let out = "";

      const baseOffX = Math.floor((drawCols - cols) / 2);
      const baseOffY = Math.floor((drawRows - rows) / 2);

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const sx = x + baseOffX;
          const sy = y + baseOffY;

          if (sx < 0 || sx >= drawCols || sy < 0 || sy >= drawRows) {
            out += " ";
            continue;
          }

          const srcIdx = sy * drawCols + sx;

          if (!figureMask![srcIdx]) {
            out += " ";
            continue;
          }

          const pi = srcIdx * 4;
          const r = rawPixels![pi];
          const g = rawPixels![pi + 1];
          const b = rawPixels![pi + 2];
          let lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // 1) Full-width scanline — tracks cursor Y from anywhere on page
          const scanDistY = Math.abs(y - smoothPageY);
          if (scanDistY < SCANLINE_WIDTH) {
            const falloff = 1 - scanDistY / SCANLINE_WIDTH;
            lum = Math.min(1, lum + SCANLINE_BOOST * falloff);
          }

          // 2) Bubble glow — only when cursor hovers over the image
          if (isHovering) {
            const dx = x - smoothGX;
            const dy = y - smoothGY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < BUBBLE_RADIUS) {
              const falloff = 1 - dist / BUBBLE_RADIUS;
              lum = Math.min(1, lum + BUBBLE_BOOST * falloff * falloff);
            }
          }

          let charIndex = Math.floor((1 - lum) * rampLen);
          if (Math.random() < SHIMMER_RATE) {
            charIndex += Math.random() < 0.5 ? 1 : -1;
            charIndex = Math.max(0, Math.min(rampLen, charIndex));
          }

          out += CHAR_RAMP[charIndex];
        }
        out += "\n";
      }

      pre!.textContent = out;
    }

    // Load image and start
    const img = new Image();
    img.onerror = () => {
      console.error("[AsciiPortrait] Failed to load /headshot.png");
    };
    img.onload = () => {
      console.log("[AsciiPortrait] Image loaded:", img.width, "x", img.height);
      console.log("[AsciiPortrait] Container:", container!.offsetWidth, "x", container!.offsetHeight);
      // Retry until container has dimensions (flexbox may not have resolved)
      function tryInit() {
        const w = container!.offsetWidth;
        const h = container!.offsetHeight;
        console.log("[AsciiPortrait] tryInit dimensions:", w, "x", h);
        if (computeGrid(img)) {
          console.log("[AsciiPortrait] Grid computed:", cols, "cols x", rows, "rows");
          rafRef.current = requestAnimationFrame(render);
        } else {
          setTimeout(tryInit, 100);
        }
      }
      tryInit();
    };
    img.src = "/headshot.png";

    // Global mouse Y — scanline tracks from anywhere on page
    const onMouseMove = (e: MouseEvent) => {
      const rect = container!.getBoundingClientRect();
      // Map page Y to grid rows
      mousePageY = ((e.clientY - rect.top) / rect.height) * rows;

      // Check if cursor is over the ASCII container
      const overContainer =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      if (overContainer) {
        isHovering = true;
        mouseGX = ((e.clientX - rect.left) / rect.width) * cols;
        mouseGY = ((e.clientY - rect.top) / rect.height) * rows;
      } else {
        isHovering = false;
      }
    };

    const onResize = () => {
      if (img.complete && img.naturalWidth > 0) computeGrid(img);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}
    >
      <pre
        ref={preRef}
        style={{
          position: "absolute",
          inset: 0,
          margin: 0,
          padding: 0,
          background: "transparent",
          color: ASCII_COLOR,
          fontFamily: "'Courier New', monospace",
          overflow: "hidden",
          whiteSpace: "pre",
          cursor: "default",
          userSelect: "none",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
        }}
      />
    </div>
  );
}
