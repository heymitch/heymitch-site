import type { Metadata } from "next";
import BucklerWaitlistForm from "./BucklerWaitlistForm";

const REPO = "https://github.com/heymitch/buckler";

export const metadata: Metadata = {
  title:
    "Buckler: Own your LinkedIn analytics. The free, open-source Shield replacement.",
  description:
    "Shield is winding down. Buckler is the free, open-source replacement: import your export, keep every metric, run the whole thing yourself. No subscription, no lock-in, your data lives in your database.",
  openGraph: {
    title:
      "Buckler: the free, open-source Shield replacement for LinkedIn analytics.",
    description:
      "Import your export, keep every metric, self-host it, own your data. Free and open source.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Buckler: own your LinkedIn analytics.",
    description:
      "The free, open-source Shield replacement. Import, keep every metric, self-host, own your data.",
  },
};

// Force the cool-grey cassette-futurism palette regardless of the site theme.
// Setting --c-* on the wrapper makes every bg-page/text-ink/bg-surface utility
// inside it inherit the override; colorScheme keeps form controls dark.
const palette = {
  "--c-page": "13 17 22",
  "--c-surface": "22 26 33",
  "--c-ink": "224 228 234",
  "--link": "#6fb3c9",
  colorScheme: "dark",
} as React.CSSProperties;

const YELLOW = "#facc15";
const RED = "#dc2625";
const MUTED = "#8b9099";
const HAIR = "rgba(224,228,234,0.12)";

const whatBucklerIs = [
  {
    n: "01",
    title: "Import in seconds",
    body: "Drop your Shield CSV or LinkedIn's official export. Your history is back on screen before your coffee's cold.",
  },
  {
    n: "02",
    title: "Passive, local capture",
    body: "An optional browser extension reads your own analytics from your own session. No scraping, no bots, no stored passwords. The thing that got Shield shut down is the thing Buckler refuses to do.",
  },
  {
    n: "03",
    title: "Free. Open. Yours.",
    body: "Open source, top to bottom. Clone it, build it with your agent, run it on your own machine. Your numbers live in your database, not a vendor's. Nothing to cancel, nothing to lose when the next tool sunsets.",
  },
];

const getItSteps = [
  "Clone the repo",
  "Build it with your agent (the README has the prompt)",
  "Import your Shield or LinkedIn export",
  "Self-host it, own your data",
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-xs uppercase tracking-[0.3em]"
      style={{ color: YELLOW }}
    >
      {children}
    </p>
  );
}

function SectionRule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-4 mb-10">
      <div className="flex-1 h-px" style={{ background: HAIR }} />
      <span
        className="font-mono text-xs uppercase tracking-[0.3em]"
        style={{ color: MUTED }}
      >
        {label}
      </span>
      <div className="flex-1 h-px" style={{ background: HAIR }} />
    </div>
  );
}

function GitHubButton({ className = "" }: { className?: string }) {
  return (
    <a
      href={REPO}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-mono text-sm uppercase tracking-[0.18em] px-6 py-3 transition-colors ${className}`}
      style={{ background: YELLOW, color: "#0d1116" }}
    >
      Get the code on GitHub &rarr;
    </a>
  );
}

export default function BucklerPage() {
  return (
    <div className="min-h-screen bg-page text-ink font-sans" style={palette}>
      {/* ─── NAV ─── */}
      <nav
        className="px-6 lg:px-12 py-5 flex items-center justify-between bg-page"
        style={{ borderBottom: `1px solid ${HAIR}` }}
      >
        <a
          href="/"
          className="font-mono text-xs uppercase tracking-[0.25em] transition-colors"
          style={{ color: MUTED }}
        >
          &larr; heymitch.ai
        </a>
        <span
          className="font-mono text-xs uppercase tracking-[0.3em]"
          style={{ color: YELLOW }}
        >
          Buckler
        </span>
      </nav>

      {/* ─── HERO ─── */}
      <section className="bg-page px-6 lg:px-12 pt-16 pb-20 lg:pt-20 lg:pb-24">
        <div className="max-w-[1080px] mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
            {/* LEFT */}
            <div className="flex-1 w-full max-w-2xl">
              <Eyebrow>For Shield Refugees</Eyebrow>

              <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-ink mt-6 mb-6 leading-[1.02]">
                Shield is going dark.{" "}
                <span style={{ color: RED }}>Your analytics shouldn&apos;t.</span>
              </h1>

              <p className="font-sans text-lg sm:text-xl text-ink/80 leading-relaxed mb-8">
                Buckler is the free, open-source replacement for Shield. Import
                your export, keep every metric, and run the whole thing yourself.
                No subscription, no lock-in, no company holding your data
                hostage.
              </p>

              <div className="mb-8">
                <GitHubButton />
              </div>

              {/* Mobile form */}
              <div className="lg:hidden">
                <BucklerWaitlistForm id="hero-m" />
                <p
                  className="font-mono text-xs leading-relaxed mt-4 max-w-md"
                  style={{ color: MUTED }}
                >
                  Free and open source. The email gets you the build walkthrough
                  and the occasional update. No card, no spam.
                </p>
              </div>
            </div>

            {/* RIGHT: form panel (desktop) */}
            <div className="hidden lg:block flex-shrink-0 w-full max-w-md">
              <div
                className="p-6"
                style={{ background: "#161a21", border: `1px solid ${HAIR}` }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: YELLOW }}
                  />
                  <span
                    className="font-mono text-[10px] uppercase tracking-[0.25em]"
                    style={{ color: YELLOW }}
                  >
                    Free + Open Source
                  </span>
                </div>
                <p className="font-mono text-[11px] leading-relaxed mb-4" style={{ color: MUTED }}>
                  Want the build walkthrough? Drop your email.
                </p>
                <BucklerWaitlistForm id="hero-d" />
                <p
                  className="font-mono text-[11px] leading-relaxed mt-4"
                  style={{ color: MUTED }}
                >
                  The step-by-step build, plus updates when it gets better. No
                  card, no spam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── WHAT YOU'RE ABOUT TO LOSE ─── */}
      <section className="px-6 lg:px-12 py-20 lg:py-24" style={{ background: "#11151b" }}>
        <div className="max-w-[1080px] mx-auto">
          <SectionRule label="What You're About To Lose" />
          <p className="font-sans text-xl sm:text-2xl text-ink/85 leading-relaxed max-w-3xl">
            Shield (shieldapp.ai) is winding down. When it goes, so does the
            dashboard you built your content habit around: your follower
            history, your top-post archive, your audience breakdown. Years of
            signal, gone with a sunset email.
          </p>
        </div>
      </section>

      {/* ─── WHAT BUCKLER IS ─── */}
      <section className="bg-page px-6 lg:px-12 py-20 lg:py-24">
        <div className="max-w-[1080px] mx-auto">
          <SectionRule label="What Buckler Is" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whatBucklerIs.map((c) => (
              <div
                key={c.n}
                className="p-6 flex flex-col"
                style={{
                  background: "#161a21",
                  border: `1px solid ${HAIR}`,
                }}
              >
                <p
                  className="font-mono text-xs uppercase tracking-[0.25em] mb-4"
                  style={{ color: YELLOW }}
                >
                  {c.n}
                </p>
                <p className="font-sans font-bold text-ink text-xl mb-3 leading-tight">
                  {c.title}
                </p>
                <p className="font-sans text-base text-ink/70 leading-relaxed">
                  {c.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY THIS ONE SURVIVES ─── */}
      <section className="px-6 lg:px-12 py-20 lg:py-24" style={{ background: "#11151b" }}>
        <div className="max-w-[1080px] mx-auto">
          <SectionRule label="Why This One Survives" />
          <div
            className="border-l-2 pl-6 max-w-3xl"
            style={{ borderColor: RED }}
          >
            <p className="font-sans text-xl sm:text-2xl text-ink/85 leading-relaxed">
              Shield scraped LinkedIn from its own servers, at scale. That is
              exactly why LinkedIn killed it. Buckler never touches LinkedIn from
              a server. It rides your session, captures only what LinkedIn
              already shows you, and stores it where you control it. Less magic,
              more permanence.
            </p>
          </div>
        </div>
      </section>

      {/* ─── GET BUCKLER ─── */}
      <section className="bg-page px-6 lg:px-12 py-20 lg:py-24">
        <div className="max-w-[1080px] mx-auto">
          <SectionRule label="Get Buckler" />

          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* LEFT: price + how to get it */}
            <div className="flex-1 w-full max-w-xl">
              <div className="flex items-baseline gap-4 mb-2">
                <span
                  className="font-mono font-bold text-6xl sm:text-7xl"
                  style={{ color: YELLOW }}
                >
                  $0
                </span>
              </div>
              <p
                className="font-mono text-xs uppercase tracking-[0.25em] mb-10"
                style={{ color: MUTED }}
              >
                open source. yours to run, fork, and keep.
              </p>

              <ul className="space-y-4 mb-10">
                {getItSteps.map((b) => (
                  <li key={b} className="flex gap-3 items-start">
                    <span
                      className="font-mono text-lg leading-none mt-0.5"
                      style={{ color: YELLOW }}
                    >
                      &rsaquo;
                    </span>
                    <span className="font-mono text-sm uppercase tracking-[0.12em] text-ink/85">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              <GitHubButton className="mb-10" />

              {/* Honest note */}
              <div
                className="p-6"
                style={{
                  background: "#161a21",
                  border: `1px solid ${HAIR}`,
                  borderLeft: `2px solid ${YELLOW}`,
                }}
              >
                <p
                  className="font-mono text-[10px] uppercase tracking-[0.3em] mb-3"
                  style={{ color: MUTED }}
                >
                  Straight talk, from Mitch
                </p>
                <p className="font-sans text-base text-ink/80 leading-relaxed">
                  I am not selling this. Shield left a hole and I could fill it
                  in an afternoon, so I did, and open-sourced it. Intelligence
                  tools should not be hostages. Take it, build your own, make it
                  better. The email list is just so I can send you the build
                  walkthrough and tell you when it gets better.
                </p>
              </div>
            </div>

            {/* RIGHT: form */}
            <div className="w-full max-w-md flex-shrink-0">
              <div
                className="p-6"
                style={{ background: "#161a21", border: `1px solid ${HAIR}` }}
              >
                <Eyebrow>Get The Build Walkthrough</Eyebrow>
                <div className="mt-5">
                  <BucklerWaitlistForm id="get" />
                </div>
                <p
                  className="font-mono text-[11px] leading-relaxed mt-4"
                  style={{ color: MUTED }}
                >
                  Free and open. The email gets you the step-by-step build and
                  updates. No card, ever.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        className="bg-page px-6 py-10"
        style={{ borderTop: `1px solid ${HAIR}` }}
      >
        <p
          className="font-mono text-xs text-center uppercase tracking-[0.3em]"
          style={{ color: MUTED }}
        >
          Buckler. Built by Mitch Harris. Open source. Own your reach.
        </p>
      </footer>
    </div>
  );
}
