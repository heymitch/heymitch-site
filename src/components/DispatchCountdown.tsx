"use client";

import { useEffect, useState } from "react";

// 5,000 days from newsletter launch (2026-05-20)
const START = new Date("2026-05-20T00:00:00-05:00");
const TARGET = new Date(START.getTime() + 5000 * 24 * 60 * 60 * 1000);

export default function DispatchCountdown() {
  const [days, setDays] = useState(5000);

  useEffect(() => {
    const tick = () => {
      const remaining = Math.max(0, TARGET.getTime() - Date.now());
      setDays(Math.floor(remaining / (1000 * 60 * 60 * 24)));
    };
    tick();
    const interval = setInterval(tick, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mini-crt mini-crt-green px-6 py-4 sm:px-7 sm:py-5">
      <div className="mini-crt-green-prompt font-mono text-[9px] sm:text-[10px] tracking-wider mb-2">
        $ window --knowledge-work
      </div>
      <div className="mini-crt-green-time font-mono tabular-nums text-5xl sm:text-6xl tracking-[0.18em] leading-none">
        {String(days).padStart(4, "0")}
      </div>
      <div className="mini-crt-green-labels font-mono text-[8px] sm:text-[9px] tracking-widest mt-2.5">
        DAYS REMAINING
      </div>
      <div className="mini-crt-green-cursor mt-2" />
    </div>
  );
}
