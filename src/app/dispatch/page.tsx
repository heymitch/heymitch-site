import type { Metadata } from "next";
import type { ReactNode } from "react";
import DispatchCountdown from "@/components/DispatchCountdown";
import SubstackEmbed from "@/components/SubstackEmbed";

export const metadata: Metadata = {
  title: "AI Dispatch — One useful AI briefing every week",
  description:
    "A free weekly briefing for agencies, solopreneurs, coaches, and consultants. The AI signal that matters, plus one prompt or skill you can use immediately.",
  openGraph: {
    title: "AI Dispatch — One useful AI briefing every week",
    description:
      "The AI signal that matters, plus one prompt or skill you can use immediately.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dispatch — One useful AI briefing every week",
    description:
      "The AI signal that matters, plus one prompt or skill you can use immediately.",
  },
};

const heroBullets = [
  "What moved in AI — minus the breathless noise",
  "What it means for the work already on your desk",
  "One prompt or skill you can put to work the same day",
];

const everyIssue = [
  {
    code: "01 / SIGNAL",
    label: "State of AI",
    body: "New models, useful capability jumps, and tool updates—filtered down to the three things worth knowing for real knowledge work.",
  },
  {
    code: "02 / APPLY",
    label: "One free prompt or skill",
    body: "A prompt, Claude skill, or workflow you can copy into your actual work. No speculative demos. No twenty-step setup ritual.",
  },
  {
    code: "03 / TRACK",
    label: "The 5,000-day countdown",
    body: "A live clock on the window before AI fluency becomes table stakes—and a useful read on what the number means right now.",
  },
];

const weekOneBonus = [
  "First 30 minutes inside Cowork — a practical video walkthrough",
  "First 30 minutes inside Claude Code — zero assumed knowledge",
  "My consolidated skills list — the exact skills I use for client work",
];

const archetypes = [
  {
    label: "Lean agency owners",
    body: "You run a small shop competing with teams three times your size. Get the workflows that help a team of three deliver with the leverage of ten.",
  },
  {
    label: "Solo consultants and coaches",
    body: "You are the product, delivery team, and marketing department. Add one useful capability a week without adding another job to your week.",
  },
  {
    label: "Knowledge workers staying ahead",
    body: "You are good at your work and can see the ground shifting. Stay current, practice deliberately, and turn AI from an occasional tab into real leverage.",
  },
];

const displayFont = {
  fontFamily: "var(--font-dot-matrix), ui-monospace, SFMono-Regular, monospace",
};

function SectionLabel({ index, children }: { index: string; children: ReactNode }) {
  return (
    <div className="mb-10 flex items-center gap-4" aria-hidden="true">
      <span className="h-2.5 w-2.5 rounded-full bg-[#ee2b2b] shadow-[0_0_12px_rgba(238,43,43,0.65)]" />
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-[#4c4c4c]">
        {index} &nbsp;·&nbsp; {children}
      </p>
      <div className="h-px flex-1 bg-[#171717]/15" />
    </div>
  );
}

function Screw({ className = "" }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`absolute h-2.5 w-2.5 rounded-full border border-black/40 bg-[#777] shadow-[inset_1px_1px_1px_rgba(255,255,255,0.65)] ${className}`}
    />
  );
}

function SubscribeModule({ dark = false }: { dark?: boolean }) {
  return (
    <div className="w-full max-w-[480px]">
      <div className={`mb-3 flex items-center justify-between border-b pb-3 ${dark ? "border-white/15" : "border-black/15"}`}>
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#ee2b2b] shadow-[0_0_12px_rgba(238,43,43,0.75)]" />
          <span className={`font-mono text-[10px] font-semibold uppercase tracking-[0.22em] ${dark ? "text-white/70" : "text-black/65"}`}>
            Subscription channel open
          </span>
        </div>
        <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${dark ? "text-white/35" : "text-black/40"}`}>
          Free / weekly
        </span>
      </div>
      <div className="overflow-hidden border border-black/25 bg-white p-1 shadow-[8px_8px_0_rgba(0,0,0,0.2)] [&_iframe]:block [&_iframe]:!w-full [&_iframe]:!border-0">
        <SubstackEmbed />
      </div>
    </div>
  );
}

function DotSignal() {
  const rows = [
    "0000011111110000",
    "0001111111111100",
    "0011110000111110",
    "0111100000011111",
    "1111001100001111",
    "1110011110000111",
    "1110011111000111",
    "1111001100001111",
    "0111100000011110",
    "0011111000111100",
    "0001111111111000",
    "0000011111100000",
  ];

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-[520px] overflow-hidden border border-white/15 bg-[#080808] p-6 shadow-[inset_0_0_60px_rgba(255,255,255,0.03)] sm:p-9">
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="relative flex h-full flex-col justify-center gap-2 sm:gap-2.5" aria-hidden="true">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-2 sm:gap-3">
            {row.split("").map((cell, columnIndex) => (
              <span
                key={`${rowIndex}-${columnIndex}`}
                className={`block aspect-square w-[clamp(4px,0.75vw,9px)] rounded-full ${
                  cell === "1"
                    ? "bg-white shadow-[0_0_7px_rgba(255,255,255,0.32)]"
                    : "bg-white/10"
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-white/35">
        <span>Signal / human</span>
        <span className="text-[#ee2b2b]">Receiving</span>
      </div>
    </div>
  );
}

export default function DispatchPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#d7d7d4] text-[#111] selection:bg-[#ee2b2b] selection:text-white">
      <nav aria-label="Primary" className="border-b border-white/10 bg-[#080808] px-5 py-4 text-white sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6">
          <a
            href="/"
            className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/55 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ee2b2b]"
          >
            ← Heymitch.ai
          </a>
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#ee2b2b]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/65">AI Dispatch / Online</span>
          </div>
        </div>
      </nav>

      <section className="relative border-b border-black bg-[#080808] px-5 py-12 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="pointer-events-none absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_center,rgba(255,255,255,.18)_1px,transparent_1.2px)] [background-size:18px_18px] [mask-image:linear-gradient(to_right,transparent,black_35%,transparent_80%)]" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[1.06fr_.94fr] lg:gap-16">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <span className="bg-[#ee2b2b] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-white">Free weekly briefing</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Issue signal: Friday</span>
            </div>

            <h1
              className="mb-7 text-[clamp(4rem,11vw,8.75rem)] font-bold uppercase leading-[0.72] tracking-[-0.04em] text-white"
              style={displayFont}
            >
              AI<br />Dispatch
            </h1>

            <p className="mb-6 max-w-[640px] text-2xl font-semibold leading-tight text-white sm:text-3xl lg:text-[2.1rem]">
              Let me keep up with AI for you.
            </p>
            <p className="mb-9 max-w-[620px] text-base leading-7 text-white/65 sm:text-lg sm:leading-8">
              One calm, useful transmission each week: what matters, what it means, and one practical workflow you can put to work immediately.
            </p>

            <ul className="mb-10 grid gap-3 text-sm text-white/75 sm:text-base">
              {heroBullets.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#ee2b2b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="#subscribe"
              className="inline-flex min-h-12 items-center justify-center border border-[#ee2b2b] bg-[#ee2b2b] px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[5px_5px_0_#5d0c0c] transition-transform hover:-translate-y-0.5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              Get the dispatch →
            </a>

            <div aria-label="AI fluency countdown" className="mt-10 max-w-[390px] border border-white/15 bg-[#151515] p-3">
              <div className="mb-2 flex items-center justify-between px-2 pt-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">
                <span>5,000-day fluency window</span>
                <span className="text-[#ee2b2b]">Live</span>
              </div>
              <div className="[&_.mini-crt-green-cursor]:!bg-[#ee2b2b] [&_.mini-crt-green-labels]:!text-[#aa3a3a] [&_.mini-crt-green-prompt]:!text-[#aa3a3a] [&_.mini-crt-green-time]:!text-[#f2f2f2]">
                <DispatchCountdown />
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <DotSignal />
            <div className="mx-auto w-full max-w-[520px] border border-white/15 bg-[#151515] p-3 sm:p-4">
              <SubscribeModule dark />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#d7d7d4] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel index="01">The situation</SectionLabel>
          <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
            <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              You do not need more AI news. <span className="text-[#ee2b2b]">You need a usable signal.</span>
            </h2>
            <div className="space-y-6 text-lg leading-8 text-black/70">
              <p>
                A new model, tool, and “breaking” thread appears every morning. Keeping up is a part-time job. Ignoring it completely is a career risk.
              </p>
              <p>
                AI Dispatch is built for people with clients, deadlines, teams, families, and limited attention. I test the tools against real work, cut the noise, and send the useful part.
              </p>
              <div className="border-l-4 border-[#ee2b2b] bg-white/45 px-6 py-5 font-semibold text-black">
                Less spectatorship. More capability. One useful improvement every week.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-[#101010] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-10 flex items-center gap-4">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ee2b2b] shadow-[0_0_12px_rgba(238,43,43,0.65)]" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/45">02 · Every issue</p>
            <div className="h-px flex-1 bg-white/15" />
          </div>
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="max-w-3xl text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Three parts. All signal.
            </h2>
            <p className="max-w-xs font-mono text-xs uppercase leading-6 tracking-[0.16em] text-white/45">Designed to read over coffee and use before lunch.</p>
          </div>

          <div className="grid border-l border-t border-white/15 md:grid-cols-3">
            {everyIssue.map((item) => (
              <article key={item.label} className="group relative min-h-[320px] border-b border-r border-white/15 bg-[#151515] p-7 transition-colors hover:bg-[#1d1d1d] sm:p-8">
                <span className="mb-14 block font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#ee2b2b]">{item.code}</span>
                <h3 className="mb-4 text-2xl font-bold leading-tight">{item.label}</h3>
                <p className="leading-7 text-white/60">{item.body}</p>
                <span aria-hidden="true" className="absolute bottom-6 right-6 h-3 w-3 rounded-full border border-white/25 bg-black group-hover:bg-[#ee2b2b]" />
              </article>
            ))}
          </div>

          <div className="relative mt-10 grid overflow-hidden border border-black/50 bg-[#b9b9b6] p-7 text-black shadow-[10px_10px_0_#050505] sm:p-10 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
            <Screw className="left-3 top-3" />
            <Screw className="right-3 top-3" />
            <Screw className="bottom-3 left-3" />
            <Screw className="bottom-3 right-3" />
            <div>
              <p className="mb-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#a10f0f]">Week one / welcome packet</p>
              <h3 className="mb-5 text-3xl font-bold tracking-[-0.03em]">Start with a working kit.</h3>
              <ul className="space-y-3 text-black/70">
                {weekOneBonus.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="font-mono font-bold text-[#c91616]">+</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 border border-black/25 bg-[#0b0b0b] px-6 py-5 text-center lg:mt-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Special transmission</p>
              <p className="mt-2 text-xl font-bold text-white">WMD</p>
              <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[#ee2b2b]">What Mitch&apos;s Doing</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-black/20 bg-[#ededeb] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1100px]">
          <SectionLabel index="03">Built for real work</SectionLabel>
          <div className="mb-14 grid gap-7 lg:grid-cols-[1fr_.7fr] lg:items-end">
            <h2 className="text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">A weekly advantage for people already in motion.</h2>
            <p className="text-lg leading-8 text-black/60">No technical identity required. Curiosity, useful work, and thirty minutes a week will do.</p>
          </div>
          <div className="divide-y divide-black/20 border-y border-black/20">
            {archetypes.map((item, index) => (
              <article key={item.label} className="grid gap-5 py-9 sm:grid-cols-[110px_1fr_1.4fr] sm:items-start sm:gap-8">
                <span className="text-5xl font-bold leading-none text-black/20" style={displayFont}>{String(index + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-bold leading-tight">{item.label}</h3>
                <p className="leading-7 text-black/65">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-[#1a1a1a] px-5 py-20 text-white sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto grid max-w-[1100px] gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="mb-5 font-mono text-[10px] font-bold uppercase tracking-[0.24em] text-[#ee2b2b]">04 / Why Mitch</p>
            <h2 className="text-4xl font-bold leading-[1.03] tracking-[-0.04em] sm:text-5xl">Built in the field, not reported from the sidelines.</h2>
          </div>
          <div className="space-y-6 text-lg leading-8 text-white/65">
            <p>
              For three years, I was the internal AI hire most small teams cannot afford—building systems that run client work, create content at volume, and reduce delivery time.
            </p>
            <p>
              I use Claude Code, Cowork, Cursor, and the rest against real deliverables every day. Something earns space in AI Dispatch only after it proves useful.
            </p>
            <p className="border-t border-white/15 pt-6 text-xl font-semibold leading-8 text-white">
              This is the weekly briefing I wish I had when I started.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#c3c3c0] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-[1100px]">
          <div className="relative overflow-hidden border border-black/40 bg-[#d7d7d4] p-6 shadow-[12px_12px_0_#111] sm:p-10 lg:p-14">
            <Screw className="left-3 top-3" />
            <Screw className="right-3 top-3" />
            <Screw className="bottom-3 left-3" />
            <Screw className="bottom-3 right-3" />
            <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:items-center">
              <div>
                <p className="mb-5 inline-block bg-[#ee2b2b] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-white">Transmission ready</p>
                <h2 id="subscribe" className="mb-5 text-4xl font-bold leading-[1.02] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Keep up with AI.<br />Keep moving forward.
                </h2>
                <p className="max-w-md text-lg leading-8 text-black/60">One email every Friday. Free. Useful on arrival. Leave whenever you like.</p>
              </div>
              <SubscribeModule />
            </div>
          </div>

          <div className="mt-14 grid gap-8 border-t border-black/20 pt-8 font-mono text-[10px] uppercase tracking-[0.2em] text-black/45 sm:grid-cols-3">
            <p>© 2026 Heymitch.ai</p>
            <p className="sm:text-center">AI Dispatch / Weekly</p>
            <a href="/" className="text-black/55 hover:text-[#c91616] sm:text-right">Return to base →</a>
          </div>
        </div>
      </section>

    </main>
  );
}
