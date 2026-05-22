import type { Metadata } from "next";
import SectionHeader from "@/components/SectionHeader";
import RetroStripes from "@/components/RetroStripes";

export const metadata: Metadata = {
  title: "Free Tools — heymitch",
  description:
    "AI Hunter 2.0, Prompt Research Engine, Ghost Draft. Tools built from 200+ experiments. Yours free.",
};

const resources = [
  {
    title: "AI Hunter 2.0",
    description:
      "Deterministic AI pattern scanner. Dual eval (regex + punctuation landmarks). 200+ experiments of research baked in. Scores your writing 0-100.",
    cta: "Download Skill",
    href: "#ai-hunter-download",
  },
  {
    title: "Prompt Research Engine",
    description:
      "Autonomous prompt optimizer. Test variables against GPTZero or custom evals overnight. Wake up to reports. Open source.",
    cta: "View on GitHub",
    href: "https://github.com/heymitch/prompt-research-engine",
  },
  {
    title: "Ghost Draft",
    description:
      "Generate content that passes human editorial review. Creative coaching CLAUDE.md + real voice samples + dual eval scoring.",
    cta: "Download Skill",
    href: "#ghost-draft-download",
  },
];

function FloppyDisk() {
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="drop-shadow-lg"
    >
      {/* Disk body */}
      <rect x="20" y="16" width="160" height="168" rx="8" fill="#2D2118" />
      <rect
        x="20"
        y="16"
        width="160"
        height="168"
        rx="8"
        stroke="#4A3A2A"
        strokeWidth="2"
      />

      {/* Metal slider area */}
      <rect x="60" y="16" width="80" height="60" rx="4" fill="#b0a898" />
      <rect
        x="60"
        y="16"
        width="80"
        height="60"
        rx="4"
        stroke="#9a9284"
        strokeWidth="1"
      />

      {/* Slider window */}
      <rect x="90" y="22" width="24" height="48" rx="2" fill="#1a1008" />

      {/* Label area */}
      <rect x="40" y="96" width="120" height="72" rx="4" fill="#F0E4D0" />
      <rect
        x="40"
        y="96"
        width="120"
        height="72"
        rx="4"
        stroke="#E0D4BE"
        strokeWidth="1"
      />

      {/* Label lines */}
      <line
        x1="52"
        y1="112"
        x2="148"
        y2="112"
        stroke="#E8682A"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="52"
        y1="124"
        x2="130"
        y2="124"
        stroke="#E8682A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.6"
      />
      <line
        x1="52"
        y1="136"
        x2="140"
        y2="136"
        stroke="#E8682A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.4"
      />
      <line
        x1="52"
        y1="148"
        x2="110"
        y2="148"
        stroke="#E8682A"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.2"
      />

      {/* Corner notch */}
      <rect x="20" y="16" width="16" height="16" fill="#F0E4D0" />
    </svg>
  );
}

function ResourceCard({
  title,
  description,
  cta,
  href,
}: {
  title: string;
  description: string;
  cta: string;
  href: string;
}) {
  const isExternal = href.startsWith("http");
  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="group block metal-housing p-5 transition-all duration-300 hover:scale-[1.02]"
    >
      <div className="relative z-10">
        <h3 className="font-sans font-bold text-brown text-lg mb-2">
          {title}
        </h3>

        <p className="font-mono text-brown/50 text-sm leading-relaxed mb-4">
          {description}
        </p>

        <span className="inline-flex items-center gap-2 text-orange text-sm font-semibold group-hover:gap-3 transition-all duration-200">
          {cta}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </span>
      </div>
    </a>
  );
}

export default function FreePage() {
  return (
    <main className="min-h-screen bg-cream">
      {/* Nav */}
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
            href="/"
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
            Back
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-[960px] mx-auto px-6 pt-8 pb-4 text-center">
        <div className="flex justify-center mb-8">
          <FloppyDisk />
        </div>

        <h1 className="font-sans text-4xl sm:text-5xl font-bold tracking-tight text-brown mb-3">
          Free Resources
        </h1>

        <p className="font-mono text-brown/50 text-sm sm:text-base max-w-md mx-auto">
          Tools I built for my own workflow. Yours now.
        </p>
      </section>

      <SectionHeader />

      {/* Resource Cards */}
      <section className="max-w-[960px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {resources.map((resource) => (
            <ResourceCard key={resource.title} {...resource} />
          ))}
        </div>
      </section>

      {/* Research Dashboard */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <SectionHeader label="Research" />

        <div className="metal-housing p-6 sm:p-8">
          <div className="relative z-10">
            <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-brown mb-3">
              Research Dashboard
            </h2>

            <p className="font-mono text-brown/50 text-sm leading-relaxed mb-6 max-w-xl">
              200+ experiments. Live scoring. Interactive charts. See exactly
              which writing patterns trigger AI detection.
            </p>

            {/* Screenshot placeholder */}
            <div className="rounded-lg border border-brown/10 bg-cream-dark/40 aspect-video flex items-center justify-center mb-6">
              <div className="text-center">
                <p className="font-mono text-brown/30 text-sm tracking-wider">
                  DASHBOARD SCREENSHOT
                </p>
                <p className="font-mono text-brown/20 text-xs mt-1">
                  prompt-research.vercel.app
                </p>
              </div>
            </div>

            <a
              href="https://prompt-research.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange text-sm font-semibold hover:gap-3 transition-all duration-200"
            >
              View Live Dashboard
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M7 7h10v10" />
                <path d="M7 17 17 7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown px-6 py-6 text-center">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-cream/40">
          By Mitch Harris
        </p>
        <p className="font-mono text-xs text-cream/25 mt-1">
          AI coach, builder, writer
        </p>
      </footer>
    </main>
  );
}
