"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const TOOL_URL = "/ai-hunter";

// Don't float the CTA on the AI Hunter pages (redundant) or behind the
// private gated dashboards (/signal, /dashboard) where it just overlaps data.
const HIDDEN_ON = ["/ai-hunter", "/signal", "/dashboard"];

export default function AiHunterCTA() {
  const pathname = usePathname();
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem("aihunter-cta-dismissed") === "1";
    if (dismissed) return;
    const t = setTimeout(() => setShowCard(true), 700);
    return () => clearTimeout(t);
  }, []);

  if (HIDDEN_ON.some((p) => pathname?.startsWith(p))) return null;

  function dismiss(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setShowCard(false);
    sessionStorage.setItem("aihunter-cta-dismissed", "1");
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3 print:hidden">
      {showCard && (
        <a
          href={TOOL_URL}
          className="cta-card-in group relative max-w-[260px] rounded-2xl border border-brown/15 bg-cream-dark p-4 pr-5 shadow-[0_8px_24px_rgba(45,33,24,0.18)] transition-colors hover:border-orange/40"
        >
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-brown/15 bg-cream text-brown/45 transition-colors hover:text-brown"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </button>

          <p className="font-mono text-sm leading-snug text-brown">
            Check your writing for AI tells, fast and free.
          </p>

          <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-xs font-semibold uppercase tracking-wide text-orange transition-all group-hover:gap-2.5">
            Run the scanner
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </span>

          {/* tail pointing down to the launcher */}
          <span className="absolute -bottom-1.5 right-7 h-3 w-3 rotate-45 border-b border-r border-brown/15 bg-cream-dark" />
        </a>
      )}

      <a
        href={TOOL_URL}
        aria-label="AI Hunter — check your writing for AI tells"
        className="group flex h-14 w-14 items-center justify-center rounded-full bg-brown shadow-[0_6px_20px_rgba(45,33,24,0.35)] ring-2 ring-orange/70 transition-transform hover:scale-105"
      >
        <span className="cta-bot-bob text-2xl leading-none" aria-hidden="true">
          🤖
        </span>
      </a>
    </div>
  );
}
