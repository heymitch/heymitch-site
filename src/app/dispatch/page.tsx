import type { Metadata } from "next";
import DispatchCountdown from "@/components/DispatchCountdown";
import SubstackEmbed from "@/components/SubstackEmbed";
import RetroStripes from "@/components/RetroStripes";

export const metadata: Metadata = {
  title: "AI Dispatch — One weekly prompt or skill to keep up with AI",
  description:
    "A free weekly briefing for agencies, solopreneurs, coaches, and consultants. One prompt or skill every week, plus what moved in AI and what it means for your work.",
  openGraph: {
    title: "AI Dispatch — One weekly prompt or skill to keep up with AI",
    description:
      "Free weekly AI briefing for knowledge workers. One prompt or skill every issue.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Dispatch — One weekly prompt or skill to keep up with AI",
    description:
      "Free weekly AI briefing for knowledge workers. One prompt or skill every issue.",
  },
};

const heroBullets = [
  "WMD — what's in my AI stack this week",
  "State of AI — filtered for knowledge workers",
  "One free prompt or skill, every issue",
  "5,000-day countdown to AI fluency",
];

const everyIssue = [
  {
    label: "State of AI",
    body: "New models, capability jumps, tool updates, filtered for knowledge workers. You get the three things worth knowing. Everything else gets cut.",
  },
  {
    label: "One free prompt or skill",
    body: "Every week, one thing you can drop into your workflow the same day. A prompt, a Claude skill, a system you can copy. Immediately usable.",
  },
  {
    label: "The countdown",
    body: "A live 5,000-day clock tracking the window before AI fluency becomes table stakes for knowledge work. Updated weekly with what the number means right now.",
  },
];

const weekOneBonus = [
  "First 30 minutes inside Cowork — a video walkthrough to get you started immediately",
  "First 30 minutes inside Claude Code — same format, zero assumed knowledge",
  "My consolidated skills list — the specific skills I use every week for client work",
];

const archetypes = [
  {
    label: "The lean agency owner",
    body: "You're running a 2 to 5 person shop competing against agencies three times your size. Every bid you win gets delivered on hours your team physically has. AI Dispatch gives you the weekly workflows to deliver like a team of ten on a team of three.",
  },
  {
    label: "The solo consultant or coach",
    body: "You're the product, the delivery, and the marketing department. Every new engagement adds hours to a week that's already full. AI Dispatch gives you one skill a week that fits into the work you're already doing.",
  },
  {
    label: "The knowledge worker who wants to stay ahead",
    body: "You have a good job, you're good at it, and you're watching AI reshape your industry in real time. You use AI occasionally but you know you're not using it well. AI Dispatch keeps you current and gives you one thing to practice.",
  },
];

export default function DispatchPage() {
  return (
    <div className="min-h-screen text-brown font-sans">

      {/* ─── NAV ─── */}
      <nav className="bg-brown px-6 lg:px-12 py-5 flex items-center justify-between">
        <a
          href="/"
          className="font-mono text-xs text-cream/50 tracking-[0.25em] uppercase hover:text-orange transition-colors"
        >
          ← heymitch.ai
        </a>
        <span className="font-mono text-xs text-orange tracking-[0.3em] uppercase">
          AI Dispatch
        </span>
      </nav>

      {/* ─── HERO (two-column, dark brown) ─── */}
      <section className="bg-brown text-cream px-6 lg:px-12 pt-12 pb-20 lg:pt-16 lg:pb-24">
        <div className="max-w-[1140px] mx-auto">

          <div className="max-w-[280px] mb-10">
            <RetroStripes />
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">

            {/* LEFT: Content */}
            <div className="flex-1 w-full max-w-2xl">
              <p className="font-mono text-xs text-orange tracking-[0.3em] uppercase mb-7">
                ⊹ Free Weekly Newsletter ⊹
              </p>

              <h1 className="font-sans text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-cream mb-7 leading-[0.92]">
                AI <span className="text-orange">Dispatch</span>
              </h1>

              <p className="font-sans text-2xl sm:text-3xl font-medium text-cream/90 mb-8 leading-[1.15]">
                One weekly prompt or skill to keep up with AI.
              </p>

              {/* Mobile-only embed */}
              <div className="lg:hidden mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="h-2 w-2 rounded-full bg-orange animate-pulse" />
                  <span className="font-mono text-[10px] text-orange tracking-[0.25em] uppercase">
                    Transmission Open
                  </span>
                </div>
                <SubstackEmbed />
              </div>

              <p className="font-mono text-base text-cream/55 leading-relaxed mb-9">
                What moved in AI this week. What it means for knowledge work.
                One prompt or skill you can use the same day. Free, for
                agencies, solopreneurs, coaches, and consultants.
              </p>

              <ul className="space-y-3.5 mb-10">
                {heroBullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2.5 block h-2 w-2 rounded-full bg-orange shrink-0" />
                    <span className="font-sans text-cream/85 text-lg">{item}</span>
                  </li>
                ))}
              </ul>

              {/* Countdown widget */}
              <div className="metal-housing inline-flex flex-wrap items-center gap-5 px-5 py-4 sm:px-6 sm:py-5">
                <div className="metal-well p-2 relative z-10">
                  <DispatchCountdown />
                </div>
                <div className="relative z-10 text-left max-w-[160px]">
                  <p className="font-mono text-[10px] text-brown/70 tracking-[0.2em] leading-relaxed uppercase">
                    Days before AI fluency<br />is table stakes
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT: Substack embed (desktop) */}
            <div className="hidden lg:block flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="h-2 w-2 rounded-full bg-orange animate-pulse" />
                <span className="font-mono text-[10px] text-orange tracking-[0.25em] uppercase">
                  Transmission Open
                </span>
              </div>
              <SubstackEmbed />
              <p className="font-mono text-[10px] text-cream/35 tracking-[0.2em] uppercase mt-4 text-center max-w-[480px]">
                ⊹ Drops every Friday ⊹
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SITUATION (cream) ─── */}
      <section className="bg-cream py-24 lg:py-28 px-6 lg:px-12">
        <div className="max-w-[1000px] mx-auto">

          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-brown/15" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-orange">
              The Situation
            </span>
            <div className="flex-1 h-px bg-brown/15" />
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-brown mb-10 leading-[1.05] max-w-3xl">
            Most knowledge workers<br className="hidden sm:block" />
            <span className="text-orange">are drowning.</span>
          </h2>

          <div className="max-w-2xl space-y-6 mb-12">
            <p className="font-sans text-lg sm:text-xl text-brown/80 leading-relaxed">
              The signal-to-noise ratio is catastrophic. 47 AI newsletters, 200
              Twitter accounts posting &ldquo;BREAKING,&rdquo; a new tool
              dropping every 72 hours. Following all of it is a part-time job.
              Following none of it is a career risk.
            </p>

            <p className="font-sans text-lg sm:text-xl text-brown/80 leading-relaxed">
              Most people are AI tourists. They&apos;ve tried ChatGPT.
              They&apos;ve watched a YouTube demo. They know the names. Claude,
              Cursor, Gemini. They&apos;re watching from the sidelines that&apos;s
              repricing knowledge work. Master it, and you unlock huge leverage
              in the new economy. Miss it, and you get left behind.
            </p>
          </div>

          <div className="border-l-4 border-orange pl-6 py-2 mb-10 max-w-2xl">
            <p className="font-sans text-2xl sm:text-3xl font-bold text-brown leading-tight">
              People with jobs, businesses, families need AI application.
            </p>
          </div>

          <ul className="space-y-5 max-w-2xl">
            {[
              "One workflow that saves four hours this week.",
              "Filtered signal from someone building with the tools every day.",
              "A prompt ready for Friday's client deliverable.",
            ].map((item) => (
              <li key={item} className="flex gap-4 items-start">
                <span className="font-mono text-orange text-2xl mt-0 shrink-0 leading-none">
                  ›
                </span>
                <span className="font-sans text-lg sm:text-xl text-brown/85">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── WHAT YOU GET (teal) ─── */}
      <section className="py-24 lg:py-28 px-6 lg:px-12" style={{ backgroundColor: "#2B6B8A" }}>
        <div className="max-w-[1000px] mx-auto">

          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-cream/20" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/70">
              What You Get
            </span>
            <div className="flex-1 h-px bg-cream/20" />
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream mb-12 leading-[1.05]">
            What&apos;s in <span className="text-orange">every issue:</span>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {everyIssue.map((item, i) => (
              <div
                key={item.label}
                className="bg-cream/[0.07] border border-cream/15 rounded-xl p-7 hover:bg-cream/[0.12] transition-colors flex flex-col"
              >
                <p className="font-mono text-xs text-orange tracking-[0.25em] uppercase mb-4">
                  ⊹ {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-sans font-bold text-cream text-2xl mb-3 leading-tight">
                  {item.label}
                </p>
                <p className="font-sans text-base text-cream/75 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* Week 1 bonus */}
          <div className="metal-housing p-6 sm:p-8 relative z-0 mb-10">
            <p className="font-mono text-[10px] text-brown/60 tracking-[0.3em] uppercase mb-6 relative z-10">
              ⊹ Week One Bonus ⊹
            </p>
            <ul className="space-y-4 relative z-10">
              {weekOneBonus.map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="font-mono text-orange text-xl mt-0 shrink-0 leading-none">
                    ›
                  </span>
                  <span className="font-sans text-base sm:text-lg text-brown/85 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Special issues — WMD callout */}
          <div className="bg-cream/[0.07] border border-cream/15 border-l-4 border-l-orange rounded-xl p-7 sm:p-8">
            <p className="font-mono text-xs text-orange tracking-[0.3em] uppercase mb-4">
              ⊹ Look out for special issues ⊹
            </p>
            <p className="font-sans font-bold text-cream text-2xl sm:text-3xl mb-4 leading-tight">
              WMD: What&apos;s Mitch Doing
            </p>
            <p className="font-sans text-base sm:text-lg text-cream/80 leading-relaxed max-w-2xl">
              The tools, skills, and workflows I&apos;m actually running. Not a
              review. Not sponsored. What&apos;s in the stack this week and why
              it&apos;s there.
            </p>
          </div>
        </div>
      </section>

      {/* ─── WHO IT'S FOR (dark brown) ─── */}
      <section className="bg-brown text-cream py-24 lg:py-28 px-6 lg:px-12">
        <div className="max-w-[1000px] mx-auto">

          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-cream/15" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-orange">
              Who It&apos;s For
            </span>
            <div className="flex-1 h-px bg-cream/15" />
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream mb-16 leading-[1.05]">
            Three people<br />
            this is <span className="text-orange">built for.</span>
          </h2>

          <div className="space-y-14">
            {archetypes.map((a, i) => (
              <div
                key={a.label}
                className="flex flex-col sm:flex-row gap-6 sm:gap-10 pb-14 border-b border-cream/10 last:border-0 last:pb-0"
              >
                <div className="font-mono text-orange text-7xl sm:text-8xl font-bold leading-[0.85] shrink-0 select-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="flex-1 pt-2">
                  <p className="font-sans font-bold text-cream text-2xl sm:text-3xl mb-4 leading-tight">
                    {a.label}
                  </p>
                  <p className="font-sans text-lg text-cream/75 leading-relaxed max-w-2xl">
                    {a.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── WHY MITCH (green) ─── */}
      <section className="py-24 lg:py-28 px-6 lg:px-12" style={{ backgroundColor: "#5B8C5A" }}>
        <div className="max-w-[1000px] mx-auto">

          <div className="flex items-center gap-4 mb-12">
            <div className="flex-1 h-px bg-cream/25" />
            <span className="font-mono text-xs tracking-[0.3em] uppercase text-cream/80">
              Why Mitch
            </span>
            <div className="flex-1 h-px bg-cream/25" />
          </div>

          <h2 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-cream mb-12 leading-[1.05]">
            Three years as the<br />
            internal AI hire<br />
            <span className="text-brown">most can&apos;t afford.</span>
          </h2>

          <div className="space-y-6 max-w-2xl">
            <p className="font-sans text-lg sm:text-xl text-cream/95 leading-relaxed">
              I helped Nicolas Cole and Dickie Bush scale their portfolio of
              companies by being their in-house AI integrator. Building real
              systems, not demos. The kind that run client work, generate
              content at volume, and cut delivery time by half.
            </p>

            <p className="font-sans text-lg sm:text-xl text-cream/95 leading-relaxed">
              I&apos;m not a journalist covering AI from the outside. I build with
              it every day. Claude Code, Cowork, Cursor, the tools that
              actually move work. When something new drops, I test it against
              real deliverables before it shows up in your inbox.
            </p>

            <p className="font-sans text-2xl sm:text-3xl font-bold text-cream leading-tight pt-6 mt-6 border-t-2 border-cream/20">
              AI Dispatch is the weekly brief I wish I&apos;d had three years ago.
            </p>
          </div>
        </div>
      </section>

      {/* ─── CLOSING CTA (orange) ─── */}
      <section className="py-24 lg:py-28 px-6 lg:px-12" style={{ backgroundColor: "#E8682A" }}>
        <div className="max-w-[1000px] mx-auto">

          <div className="max-w-[280px] mx-auto mb-10">
            <RetroStripes />
          </div>

          <div className="text-center mb-12">
            <p className="font-mono text-xs text-brown tracking-[0.3em] uppercase mb-6">
              ⊹ Subscribe Free ⊹
            </p>
            <h2 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-bold text-brown leading-[0.95] mb-6 tracking-tight">
              Keep up with AI.<br />
              <span className="text-cream">One email a week.</span>
            </h2>
            <p className="font-sans text-xl sm:text-2xl text-brown/75 max-w-md mx-auto leading-snug">
              Unsubscribe any time.
            </p>
          </div>

          <div className="flex justify-center">
            <SubstackEmbed />
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-brown px-6 py-10">
        <div className="max-w-[280px] mx-auto mb-6">
          <RetroStripes />
        </div>
        <p className="font-mono text-xs text-cream/40 text-center tracking-[0.3em] uppercase">
          © 2026 Heymitch.ai &nbsp;/&nbsp; AI Dispatch
        </p>
      </footer>

    </div>
  );
}
