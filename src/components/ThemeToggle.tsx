"use client";

import { useEffect, useState } from "react";

// localStorage can throw in sandboxed/embedded contexts — never let it break the UI.
const store = {
  get(k: string): string | null {
    try {
      return localStorage.getItem(k);
    } catch {
      return null;
    }
  },
  set(k: string, v: string) {
    try {
      localStorage.setItem(k, v);
    } catch {
      /* no-op */
    }
  },
};

function osPrefersDark(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Sync initial state from the attribute the no-flash script already set.
  useEffect(() => {
    const root = document.documentElement;
    const forced = root.getAttribute("data-theme");
    setIsDark(forced ? forced === "dark" : osPrefersDark());
    setMounted(true);

    // Follow live OS changes only while the user hasn't made a manual choice.
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (!root.getAttribute("data-theme")) setIsDark(mq.matches);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  function toggle() {
    const next = isDark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    store.set("theme", next);
    setIsDark(next === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light" : "Switch to dark"}
      className={`theme-toggle ${mounted && isDark ? "is-dark" : ""}`}
    >
      {/* sun — shown in dark mode (tap to lighten) */}
      <svg
        className="icon-sun"
        viewBox="0 0 24 24"
        aria-hidden="true"
        width="22"
        height="22"
      >
        <circle cx="12" cy="12" r="4.2" />
        <line x1="12" y1="2.5" x2="12" y2="5" />
        <line x1="12" y1="19" x2="12" y2="21.5" />
        <line x1="2.5" y1="12" x2="5" y2="12" />
        <line x1="19" y1="12" x2="21.5" y2="12" />
        <line x1="5.1" y1="5.1" x2="6.8" y2="6.8" />
        <line x1="17.2" y1="17.2" x2="18.9" y2="18.9" />
        <line x1="18.9" y1="5.1" x2="17.2" y2="6.8" />
        <line x1="6.8" y1="17.2" x2="5.1" y2="18.9" />
      </svg>
      {/* moon — shown in light mode (tap to darken) */}
      <svg
        className="icon-moon"
        viewBox="0 0 24 24"
        aria-hidden="true"
        width="22"
        height="22"
      >
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.3 6.3 0 0 0 10.5 10.5z" />
      </svg>
    </button>
  );
}
