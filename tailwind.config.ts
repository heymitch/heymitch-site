import type { Config } from "tailwindcss";

const config: Config = {
  // Manual override via [data-theme="dark"]; OS default handled by CSS vars.
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // ── Role-based, theme-aware tokens (flip via CSS vars in globals.css) ──
        page: "rgb(var(--c-page) / <alpha-value>)", // page background
        ink: "rgb(var(--c-ink) / <alpha-value>)", // primary text + hairlines
        surface: "rgb(var(--c-surface) / <alpha-value>)", // raised cards

        // ── Fixed brand colors (intentionally do NOT flip) ──
        cream: {
          DEFAULT: "#F0E4D0",
          dark: "#E0D4BE",
        },
        brown: {
          DEFAULT: "#2D2118",
          muted: "#4A3A2A",
        },
        orange: "#E8682A",
        teal: "#2B6B8A",
        green: "#5B8C5A",
      },
      fontFamily: {
        sans: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "IBM Plex Mono", "monospace"],
        serif: ["Newsreader", "Georgia", "serif"],
        terminal: ["'VT323'", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
