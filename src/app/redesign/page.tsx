import dynamic from "next/dynamic";
import resources from "@/data/resources.json";
import feed from "@/data/feed.json";
import OptinTerminal from "@/components/OptinTerminal";

/*
  REDESIGN PROTOTYPE — /redesign  (analog instrument-panel thought-leadership + services lander)
  Safe sandbox: does NOT touch the live homepage. Promote to page.tsx when approved.
  Ref: Mitch's "Agent Operations Module" mock. Bold spacing, brutalist USEFUL AI,
  cockpit fire-button CTAs (red button in plate casing), instrument panels, metadata rails.
  Signal accents (red / yellow / teal) used sparingly on LEDs, knobs, meters, status.
  Placeholders: [N] builders + telemetry numbers (sample), card art, feed essays.
*/

const AsciiPortrait = dynamic(() => import("@/components/AsciiPortrait"), { ssr: false });
const freeTools = resources.filter((r) => r.published);

// placeholder services & courses — copy / links / art to finalize
const builds = [
  { name: "Sifu", kind: "Open source", job: "Record your workflow once, get the SOP automatically.", href: "https://sifu-lander.vercel.app" },
  { name: "HeyCoach", kind: "Coaching", job: "An AI coach that knows your business and answers like Mitch.", href: "#" },
  { name: "Signal", kind: "Open source", job: "Own your LinkedIn analytics, no lock-in.", href: "/signal" },
  { name: "Wingman", kind: "Product", job: "An always-on agent that knows you and runs your work.", href: "#" },
  { name: "Dispatcher", kind: "SaaS", job: "A content engine that ships in your voice, on a schedule.", href: "/dispatch" },
  { name: "AI-Native", kind: "Assessment", job: "Benchmark how AI-native you are, then close the gap.", href: "/ai-native" },
  { name: "Speakeasy Audiobooks", kind: "Audio", job: "Books for builders, narrated for the commute.", href: "#" },
  { name: "InkAgent", kind: "Course", job: "Draft fiction with an agent, and still sign your own name.", href: "#" },
];

const nav = [
  { label: "Bootcamp", href: "#bootcamp" },
  { label: "Writing", href: "#writing" },
  { label: "Free Tools", href: "#tools" },
  { label: "Services", href: "#builds" },
  { label: "AI Dispatch", href: "/dispatch" },
  { label: "Disciple AI", href: "https://discipleai.substack.com/" },
];

const HERO_WAVE = [30, 55, 40, 70, 45, 60, 35, 80, 50, 65, 40, 75, 55, 45, 60, 35, 70, 50, 40, 62, 48, 72, 38, 58, 44, 68, 52, 42, 60, 36];
const TELE_WAVE = [40, 60, 35, 72, 50, 44, 66, 38, 78, 52, 46, 70, 40, 58, 34, 64, 48, 74, 42, 56, 38, 68, 50, 60, 36, 72, 44, 54];

function Wave({ data, className = "" }: { data: number[]; className?: string }) {
  return (
    <div className={`wave ${className}`}>
      {data.map((h, i) => (
        <i key={i} style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

function JobCard({ name, job, href, label }: { name: string; job: string; href: string; label?: string }) {
  return (
    <a href={href} className="group border border-ink/15 bg-page hover:border-ink transition-colors p-6 flex flex-col gap-3">
      <h3 className="font-serif text-2xl leading-snug">{job}</h3>
      <span className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink/45">
        {name}
        {label ? <span className="text-ink/30"> · {label}</span> : null}
      </span>
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-orange mt-auto pt-3 group-hover:translate-x-1 transition-transform inline-block">
        Try it →
      </span>
    </a>
  );
}

export default function Redesign() {
  const feature = feed[0];
  const left = feed.slice(1, 3);
  const recent = feed.slice(3, 7);

  return (
    <div className="bg-page text-ink min-h-screen">
      {/* registration crosshairs */}
      <div className="reg-mark reg-tl" /><div className="reg-mark reg-tr" />
      <div className="reg-mark reg-bl" /><div className="reg-mark reg-br" />

      {/* ═══ NAV ═══ */}
      <header className="sticky top-0 z-50 bg-page/85 backdrop-blur border-b border-ink/10">
        <div className="max-w-[1320px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
          <a href="#top" className="font-sans text-2xl font-bold tracking-tight">
            hey<span className="text-orange">mitch</span>
          </a>
          <nav className="hidden lg:flex items-center gap-6">
            {nav.map((n) => (
              <a key={n.label} href={n.href} className="font-mono text-[12px] tracking-[0.12em] uppercase text-ink/55 hover:text-ink transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-5">
            <div className="hidden xl:flex items-center gap-3">
              <span className="led led-g" />
              <span className="font-mono text-[10px] leading-tight tracking-[0.14em] uppercase text-ink/45">
                SYS: A/01<br />GRID: 8&times;5
              </span>
            </div>
            <a href="https://ccmb-waitlist.vercel.app/" className="fire-btn">
              <span className="face">JOIN THE BOOTCAMP <span aria-hidden>→</span></span>
            </a>
          </div>
        </div>
      </header>

      <main id="top">
        {/* ═══ HERO ═══ */}
        <section className="relative border-b border-ink/10 overflow-hidden">
          {/* ascii portrait — big right-half backdrop, module sits on top */}
          <div className="hidden lg:block absolute top-0 right-0 h-full w-[54%] z-0 opacity-90 pointer-events-none">
            <AsciiPortrait density={130} />
          </div>

          {/* readout strip */}
          <div className="relative z-10 border-b border-ink/10">
            <div className="max-w-[1320px] mx-auto px-6 lg:px-12 py-2.5 flex items-center justify-between font-mono text-[10px] tracking-[0.16em] uppercase text-ink/45">
              <span className="text-orange">01 / Useful AI</span>
              <span className="hidden sm:flex items-center gap-5">
                <span>Sys: A/01</span><span>Grid: 8&times;5</span><span>Lat 107.221</span><span>MMXXVI</span>
              </span>
            </div>
          </div>

          {/* left numeric rail */}
          <div className="hidden xl:flex flex-col gap-3 absolute left-5 top-1/2 -translate-y-1/2 z-20">
            {["01", "02", "03", "04", "05"].map((n, i) => (
              <div key={n} className="flex items-center gap-2">
                <span className={`font-mono text-[10px] ${i === 0 ? "text-orange" : "text-ink/35"}`}>{n}</span>
                <span className="block w-5 h-px bg-ink/20" />
              </div>
            ))}
          </div>

          {/* right levels rail */}
          <div className="hidden xl:flex flex-col items-end gap-6 absolute right-5 top-1/2 -translate-y-1/2 z-20 w-28">
            <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/45 text-right leading-relaxed">
              // Human<br />Intelligence<br />Amplified
            </p>
            <div className="font-mono text-[10px] text-ink/40 leading-relaxed text-right">
              X: 107.221<br />Y: 45.662<br />Z: 12.009
            </div>
            <div className="w-full">
              <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/45 mb-2">Levels</p>
              {["100", "75", "50", "25", "00"].map((v, i) => (
                <div key={v} className="flex items-center gap-2 mb-1.5">
                  <span className="flex-1 h-px bg-ink/15" />
                  {i === 0 ? <span className="led led-r" style={{ width: 7, height: 7 }} /> : null}
                  <span className="font-mono text-[10px] text-ink/40 w-6 text-right">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative max-w-[1320px] mx-auto px-6 lg:px-12 pt-20 pb-24">
            <span className="crop tl" style={{ top: 24, left: 24 }} /><span className="crop tr" style={{ top: 24, right: 24 }} />
            <span className="crop bl" style={{ bottom: 24, left: 24 }} /><span className="crop br" style={{ bottom: 24, right: 24 }} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center min-h-[80vh]">
              {/* LEFT: brutalist headline */}
              <div>
                <p className="font-mono text-[12px] tracking-[0.24em] uppercase text-ink/50 mb-5">
                  AI Coach · Builder · Writer
                </p>
                <div className="relative">
                  <h1 className="font-sans font-bold leading-[0.72] tracking-tighter text-[26vw] sm:text-[18vw] lg:text-[13.5rem]">
                    USEFUL
                    <span className="block text-orange">AI</span>
                  </h1>
                  <span className="absolute right-0 top-[44%] hidden sm:block border border-ink/30 px-2.5 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-ink/50 leading-tight">
                    A/01<br />Series
                  </span>
                </div>
                <p className="font-serif text-3xl leading-snug text-ink/80 max-w-[36ch] mt-12">
                  The coach, the tools, and the bootcamp for people who would
                  rather use AI than talk about it.
                </p>

                {/* email opt-in plate (live-site metal aesthetic) under the subtitle */}
                <div className="mt-9">
                  <OptinTerminal />
                </div>

                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/45 mt-7">
                  Trusted by [N] builders
                </p>
                <div className="flex items-center gap-6 mt-5 text-ink/30">
                  {["✳", "N", "△", "G"].map((g, i) => (
                    <span key={i} className="font-sans text-2xl font-bold">{g}</span>
                  ))}
                </div>
              </div>

              {/* ascii portrait owns the right side (hero backdrop above) */}
              <div className="hidden lg:block" aria-hidden />
            </div>
          </div>
        </section>

        {/* ═══ BOOTCAMP MINI-SALES CARD + TELEMETRY ═══ */}
        <section id="bootcamp" className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="bg-brown text-cream rounded-xl border border-ink/30 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
            {/* sell side */}
            <div className="p-9 lg:p-12">
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange mb-6">The Bootcamp · Flagship</p>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.04] tracking-tight">
                Build a personal AI agent that runs real work. Then sell it.
              </h2>
              <p className="font-mono text-sm leading-relaxed text-cream/70 max-w-[58ch] mt-6">
                One agent loop, wired for your job. You walk out owning a Wingman
                that wakes up on its own, drafts, acts, and ships real work while
                you sleep.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-9">
                <a href="https://ccmb-waitlist.vercel.app/" className="fire-btn">
                  <span className="face">Join the Bootcamp <span aria-hidden>→</span></span>
                </a>
                <a href="#writing" className="fire-btn ghost">
                  <span className="face">See curriculum <span aria-hidden>→</span></span>
                </a>
              </div>
            </div>
            {/* telemetry side */}
            <div className="bg-[#16110d] p-9 lg:p-12 border-t lg:border-t-0 lg:border-l border-black/40">
              <div className="flex items-center justify-between mb-7">
                <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-cream/60">System Telemetry</span>
                <span className="flex items-center gap-2 font-mono text-[9px] tracking-[0.14em] uppercase text-cream/30"><span className="led led-g" /> sample</span>
              </div>
              {[
                { k: "Agents deployed", v: "2,347", c: "text-orange" },
                { k: "Workflows improved", v: "18,902", c: "text-orange" },
                { k: "Hours saved", v: "76,214", c: "text-orange" },
              ].map((r) => (
                <div key={r.k} className="flex items-center justify-between border-b border-cream/10 py-3.5">
                  <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cream/55">{r.k}</span>
                  <span className={`font-sans font-bold text-2xl ${r.c}`}>{r.v}</span>
                </div>
              ))}
              <div className="flex items-center justify-between py-3.5">
                <span className="font-mono text-[11px] tracking-[0.12em] uppercase text-cream/55">System online</span>
                <span className="font-mono text-[12px] tracking-[0.1em] uppercase" style={{ color: "var(--sig-green)" }}>All systems nominal</span>
              </div>
              <div className="mt-4" style={{ color: "var(--sig-teal)" }}>
                <Wave data={TELE_WAVE} />
              </div>
              <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-cream/30 mt-3 text-right">Mag residue: 12%</p>
            </div>
          </div>
        </section>

        {/* ═══ WRITING ═══ */}
        <section id="writing" className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="flex items-end justify-between border-b border-ink/15 pb-4 mb-9">
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">Writing</h2>
            <a href="/dispatch" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/45 hover:text-ink">All essays →</a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 flex flex-col gap-8 lg:border-r lg:border-ink/12 lg:pr-8">
              {left.map((p) => (
                <a key={p.title} href={p.href} className="group block">
                  <div className="aspect-[16/10] mb-4 rounded-md" style={{ backgroundColor: p.accent }} />
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink/45 mb-2">{p.date} · {p.category}</p>
                  <h3 className="font-serif text-2xl leading-tight group-hover:text-orange transition-colors">{p.title}</h3>
                  <p className="font-mono text-[11px] text-ink/55 mt-3">{p.author}</p>
                </a>
              ))}
            </div>
            <div className="lg:col-span-6 lg:border-r lg:border-ink/12 lg:pr-8">
              <a href={feature.href} className="group block">
                <div className="aspect-[16/10] mb-6 rounded-md" style={{ backgroundColor: feature.accent }} />
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink/45 mb-3 text-center">{feature.date} · {feature.category}</p>
                <h3 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-center group-hover:text-orange transition-colors">{feature.title}</h3>
                <p className="font-serif text-xl italic text-ink/65 mt-4 text-center max-w-[44ch] mx-auto">{feature.dek}</p>
                <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink/55 mt-5 text-center">{feature.author}</p>
              </a>
            </div>
            <div className="lg:col-span-3">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink/45 mb-5">Recent Essays</p>
              <div className="flex flex-col divide-y divide-ink/12">
                {recent.map((p) => (
                  <a key={p.title} href={p.href} className="group flex gap-4 py-4 first:pt-0">
                    <span className="w-16 h-16 flex-none rounded-md" style={{ backgroundColor: p.accent }} />
                    <div>
                      <h4 className="font-serif text-lg leading-tight group-hover:text-orange transition-colors">{p.title}</h4>
                      <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/45 mt-1.5">{p.author}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FREE TOOLS ═══ */}
        <section id="tools" className="bg-surface/30 border-t border-ink/10">
          <div className="max-w-[1320px] mx-auto px-6 py-16">
            <div className="flex items-end justify-between border-b border-ink/15 pb-4 mb-9">
              <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">Free Tools</h2>
              <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/45">No account, no cost</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {freeTools.map((r) => (
                <JobCard key={r.url} name={r.title} job={r.job} href={r.url} label={r.category} />
              ))}
            </div>
          </div>
        </section>

        {/* ═══ BUILDS ═══ */}
        <section id="builds" className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="flex items-end justify-between border-b border-ink/15 pb-4 mb-9">
            <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">Services &amp; Courses</h2>
            <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/45">What I ship</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {builds.map((b) => (
              <JobCard key={b.name} name={b.name} job={b.job} href={b.href} label={b.kind} />
            ))}
          </div>
        </section>
      </main>

      {/* ═══ FOOTER ═══ */}
      <footer className="bg-brown text-cream">
        <div className="max-w-[1320px] mx-auto px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-sans text-xl font-bold">hey<span className="text-orange">mitch</span></span>
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-cream/40">AI coach · builder · writer · MMXXVI</span>
          <span className="barcode text-cream/40">{[14, 22, 9, 26, 12, 18, 7, 24, 16, 10, 20, 8, 23, 13, 19, 11].map((h, i) => (<i key={i} style={{ height: h }} />))}</span>
        </div>
      </footer>
    </div>
  );
}
