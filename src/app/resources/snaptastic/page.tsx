"use client";

import { useEffect, useRef } from "react";
import RetroStripes from "@/components/RetroStripes";
import SectionHeader from "@/components/SectionHeader";

const templates = [
  { name: "Gradient Sunset", desc: "Warm orange-to-pink backdrop. Bold and inviting." },
  { name: "Synthwave", desc: "Neon purple grid. Retro-futuristic energy." },
  { name: "TRD Pro", desc: "Dark matte finish. Professional and sharp." },
  { name: "Catppuccin", desc: "Pastel palette from the beloved theme." },
  { name: "Absolutely", desc: "Clean gradients with soft shadows." },
  { name: "Gradient Dark", desc: "Deep tones with subtle color shifts." },
  { name: "Clean White", desc: "Minimal white frame. Lets the content breathe." },
  { name: "Minimal Gray", desc: "Neutral backdrop. Zero distraction." },
];

export default function SnaptasticPage() {
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!formRef.current) return;
    const script = document.createElement("script");
    script.src = "https://pga.kit.com/SNAPTASTIC_FORM_ID/index.js";
    script.async = true;
    script.dataset.uid = "SNAPTASTIC_FORM_ID";
    formRef.current.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <main className="min-h-screen bg-cream">
      {/* ── Nav ── */}
      <nav className="max-w-[960px] mx-auto px-6 pt-6 pb-4">
        <div className="max-w-[240px] mb-4">
          <RetroStripes />
        </div>
        <div className="flex items-center justify-between">
          <a
            href="/"
            className="font-sans text-3xl sm:text-4xl font-bold text-brown hover:text-brown/70 transition-colors"
          >
            hey<span className="text-orange">mitch</span>
          </a>
          <a
            href="/resources"
            className="flex items-center gap-2 text-brown/50 hover:text-brown text-sm font-medium transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Resources
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <SectionHeader label="Free Tool" />

        <div className="max-w-2xl">
          <h1 className="font-sans text-5xl sm:text-6xl font-bold tracking-tight text-brown mb-4">
            snap<span className="text-orange">tastic</span>
          </h1>

          <p className="text-xl sm:text-2xl font-sans font-medium text-brown/80 mb-6 leading-snug">
            Take a screenshot. Get a beautiful version. That&apos;s it.
          </p>

          <p className="font-mono text-sm text-brown/50 leading-relaxed mb-8">
            Free, open-source, agent-first screenshot beautifier. No
            subscription. No Electron app. No $30/year for rounded corners.
          </p>

          <ul className="space-y-3 mb-8">
            {[
              "Presentations",
              "Course content",
              "Social media (real screenshots, zero AI flags)",
              "Newsletters",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-orange shrink-0" />
                <span className="font-sans text-brown/70 text-base">{item}</span>
              </li>
            ))}
          </ul>

          <p className="font-mono text-xs tracking-wide uppercase text-brown/40">
            No Canva. No Figma. No drag-and-drop.
          </p>
        </div>
      </section>

      {/* ── Email Opt-in Gate ── */}
      <section className="bg-brown">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="max-w-xl mx-auto text-center">
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-cream mb-3">
              Get the install instructions + all 8 templates
            </h2>
            <p className="font-mono text-sm text-cream/50 mb-8">
              Enter your email below. We&apos;ll send you the agent install
              prompt. Paste it into Claude Code, Codex, or OpenClaw.
            </p>

            {/* Kit form embed */}
            <div ref={formRef} className="min-h-[80px]" />

            <p className="font-mono text-xs text-cream/30 mt-6">
              No spam. Unsubscribe anytime. You&apos;ll get the install prompt
              and occasional updates about new tools.
            </p>
          </div>
        </div>
      </section>

      {/* ── Template Preview Grid ── */}
      <section className="max-w-[960px] mx-auto px-6 py-16">
        <SectionHeader label="Templates" />

        <div className="mb-10">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-brown mb-2">
            8 templates included
          </h2>
          <p className="font-mono text-brown/50 text-sm">
            Each one turns a raw screenshot into something you&apos;d actually
            put in a deck.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {templates.map((t) => (
            <div
              key={t.name}
              className="group rounded-xl border border-brown/10 bg-cream-dark/30 p-4 transition-all duration-300 hover:border-brown/20 hover:bg-cream-dark/50"
            >
              {/* Placeholder image */}
              <div className="aspect-[4/3] rounded-lg bg-brown/5 border border-brown/10 mb-4 flex items-center justify-center overflow-hidden">
                <img
                  src={`/products/snaptastic/preview-${t.name.toLowerCase().replace(/\s+/g, "-")}.png`}
                  alt={`${t.name} template preview`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    target.style.display = "none";
                    if (target.parentElement) {
                      const fallback = document.createElement("span");
                      fallback.className =
                        "font-mono text-xs text-brown/30 tracking-wider uppercase";
                      fallback.textContent = "preview";
                      target.parentElement.appendChild(fallback);
                    }
                  }}
                />
              </div>
              <h3 className="font-sans font-bold text-brown text-sm mb-1">
                {t.name}
              </h3>
              <p className="font-mono text-xs text-brown/40 leading-relaxed">
                {t.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── The Agentic Hook ── */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <SectionHeader label="Go further" />

        <div className="max-w-2xl">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-brown mb-3">
            Design your own template with AI
          </h2>
          <p className="font-mono text-sm text-brown/50 mb-8">
            Already installed? Tell your agent to build you a custom look.
          </p>

          <div className="rounded-lg border border-[#2a2520] bg-[#12100E] p-6 overflow-x-auto">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <span className="ml-3 font-mono text-xs text-[#82C896]/40">
                terminal
              </span>
            </div>
            <pre className="font-mono text-sm sm:text-base leading-relaxed">
              <span className="text-[#82C896]">
                {`> Create a custom Snaptastic template for me.\n  I want `}
              </span>
              <span className="text-[#82C896]/50 italic">
                [describe your style]
              </span>
            </pre>
          </div>

          <p className="font-mono text-xs text-brown/40 mt-4">
            Works with Claude Code, Codex, and OpenClaw. The agent reads the
            template spec and builds a new one from scratch.
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-brown px-6 py-6 text-center">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-cream/40">
          By Mitch Harris
        </p>
      </footer>
    </main>
  );
}
