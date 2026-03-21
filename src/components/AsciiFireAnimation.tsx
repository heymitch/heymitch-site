"use client";

import { useEffect, useRef, useCallback } from "react";

const ASCII_CHARS = " .:-=+*#%@";
const WIDTH = 90;
const HEIGHT = 26;
const TARGET_FPS = 28;
const FRAME_MS = 1000 / TARGET_FPS;

export default function AsciiFireAnimation() {
  const preRef = useRef<HTMLPreElement>(null);
  const bufferRef = useRef(new Float32Array(WIDTH * HEIGHT));
  const animRef = useRef<number>(0);
  const lastRef = useRef(0);

  const tick = useCallback((now: number) => {
    if (now - lastRef.current < FRAME_MS) {
      animRef.current = requestAnimationFrame(tick);
      return;
    }
    lastRef.current = now;

    const buf = bufferRef.current;

    // Seed bottom two rows
    for (let x = 0; x < WIDTH; x++) {
      buf[(HEIGHT - 1) * WIDTH + x] =
        Math.random() > 0.35
          ? 190 + Math.random() * 65
          : Math.random() * 160;
      buf[(HEIGHT - 2) * WIDTH + x] =
        Math.random() > 0.5
          ? 160 + Math.random() * 80
          : Math.random() * 120;
    }

    // Propagate upward
    for (let y = 0; y < HEIGHT - 2; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const b = buf[(y + 1) * WIDTH + x];
        const bl = buf[(y + 1) * WIDTH + Math.max(0, x - 1)];
        const br = buf[(y + 1) * WIDTH + Math.min(WIDTH - 1, x + 1)];
        const b2 = buf[(y + 2) * WIDTH + x];
        const wind = buf[(y + 1) * WIDTH + Math.min(WIDTH - 1, x + 2)];
        const decay = Math.random() * 20 + 6;
        buf[y * WIDTH + x] = Math.max(
          0,
          (b + bl + br + b2 + wind) / 5 - decay
        );
      }
    }

    // Render to text
    let text = "";
    for (let y = 0; y < HEIGHT; y++) {
      for (let x = 0; x < WIDTH; x++) {
        const val = buf[y * WIDTH + x];
        const ci = Math.min(
          ASCII_CHARS.length - 1,
          Math.floor((val / 255) * (ASCII_CHARS.length - 1))
        );
        text += ASCII_CHARS[ci];
      }
      if (y < HEIGHT - 1) text += "\n";
    }

    if (preRef.current) {
      preRef.current.textContent = text;
    }

    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, [tick]);

  return (
    <div className="relative w-full h-full flex items-end justify-center overflow-hidden">
      <pre
        ref={preRef}
        className="fire-pre font-terminal select-none leading-none tracking-wider"
        style={{
          fontSize: "clamp(6px, 1.1vw, 13px)",
          lineHeight: "1.15",
          letterSpacing: "0.5px",
        }}
      />
    </div>
  );
}
