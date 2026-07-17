import dynamic from "next/dynamic";
import resources from "@/data/resources.json";
import feed from "@/data/feed.json";

/*
  Cloudflare preview branch: neo-brutalist thought-leadership + services lander.
  Bold type, useful content, and direct calls to action.
  This page only links to routes and products that exist on the current main branch.
*/

const AsciiPortrait = dynamic(() => import("@/components/AsciiPortrait"), { ssr: false });
const freeTools = resources.filter((r) => r.published);

const builds = [
  { name: "Sifu", kind: "Open source", job: "Record your workflow once, get the SOP automatically.", href: "/sifu" },
  { name: "Wingman", kind: "Managed agents", job: "Give your team personal agents that run real workflows.", href: "/wingman" },
  { name: "Scaling With Agents", kind: "Publishing", job: "Field reports for operators building companies around agents.", href: "/dispatch" },
  { name: "AI-Native", kind: "Assessment", job: "Benchmark how AI-native you are, then close the gap.", href: "/ai-native" },
  { name: "Myrmidocs", kind: "Agent documentation", job: "Keep agent instructions synchronized with the code they govern.", href: "/myrmidocs" },
  { name: "Buckler", kind: "Open source", job: "A practical security layer for AI-native operators.", href: "/buckler" },
  { name: "AI Hunter", kind: "Skill", job: "Find the AI tells in your writing and show exactly what to rewrite.", href: "/ai-hunter-skill" },
];

const nav = [
  { label: "Personal Agent", href: "#bootcamp" },
  { label: "Writing", href: "#writing" },
  { label: "Free Tools", href: "#tools" },
  { label: "Services", href: "#builds" },
  { label: "Scaling With Agents", href: "/dispatch" },
  { label: "Disciple AI", href: "https://discipleai.substack.com/" },
];

const socials = [
  { label: "YouTube", href: "https://youtube.com/@heymitchh" },
  { label: "LinkedIn", href: "https://linkedin.com/in/heymitchh" },
  { label: "GitHub", href: "https://github.com/heymitch" },
  { label: "X", href: "https://x.com/heymitch" },
];

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
          <a href="https://personal-agent-bootcamp.vercel.app" className="neo-btn">
            Join the Bootcamp <span aria-hidden>→</span>
          </a>
        </div>
      </header>

      <main id="top">
        {/* ═══ HERO ═══ */}
        <section className="relative border-b border-ink/10 overflow-hidden">
          {/* ascii portrait — big right-half backdrop, module sits on top */}
          <div className="hidden lg:block absolute top-0 right-0 h-full w-[54%] z-0 opacity-90 pointer-events-none">
            <AsciiPortrait density={130} />
          </div>

          <div className="relative max-w-[1320px] mx-auto px-6 lg:px-12 pt-20 pb-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center min-h-[80vh]">
              {/* LEFT: brutalist headline */}
              <div>
                <p className="font-mono text-[12px] tracking-[0.24em] uppercase text-ink/50 mb-5">
                  Practical Agent Education · Managed Agent Systems
                </p>
                <h1 className="font-sans font-bold leading-[0.78] tracking-tighter text-[clamp(3.75rem,19vw,9rem)]">
                  <span className="block">SCALING</span>
                  <span className="block">WITH</span>
                  <span className="block text-orange">AGENTS</span>
                </h1>
                <p className="font-serif text-3xl leading-snug text-ink/80 max-w-[36ch] mt-12">
                  Learn how agents work and put them to work—through practical
                  education for operators and managed agent systems for teams.
                </p>

                <p className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/45 mt-7">
                  Built in the field. Published with receipts.
                </p>
              </div>

              {/* ascii portrait owns the right side (hero backdrop above) */}
              <div className="hidden lg:block" aria-hidden />
            </div>
          </div>
        </section>

        {/* ═══ BOOTCAMP ═══ */}
        <section id="bootcamp" className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="bg-brown text-cream border-2 border-ink p-9 lg:p-14">
            <div className="max-w-4xl">
              <p className="font-mono text-[11px] tracking-[0.22em] uppercase text-orange mb-6">The Bootcamp · Flagship</p>
              <h2 className="font-serif text-4xl sm:text-5xl leading-[1.04] tracking-tight">
                Build a personal agent that runs real work with you in control.
              </h2>
              <p className="font-mono text-sm leading-relaxed text-cream/70 max-w-[58ch] mt-6">
                Wire one useful loop to your actual job: Trigger, Act, Remember.
                Your agent carries the context, completes repeatable work, shows
                its receipts, and stops for approval before consequential action.
              </p>
              <div className="flex flex-wrap items-center gap-4 mt-9">
                <a href="https://personal-agent-bootcamp.vercel.app" className="neo-btn">
                  Join the Bootcamp <span aria-hidden>→</span>
                </a>
                <a href="#writing" className="neo-btn neo-btn-dark">
                  Read the field notes <span aria-hidden>→</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ FIELD NOTE CONCEPTS ═══ */}
        <section id="writing" className="max-w-[1320px] mx-auto px-6 py-16">
          <div className="flex items-end justify-between border-b border-ink/15 pb-4 mb-9">
            <div>
              <h2 className="font-serif text-4xl sm:text-5xl tracking-tight">Field note concepts</h2>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.16em] text-ink/45">Preview topics for Scaling With Agents, not published essays</p>
            </div>
            <a href="/dispatch" className="font-mono text-[11px] tracking-[0.18em] uppercase text-ink/45 hover:text-ink">Open Dispatch →</a>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-3 flex flex-col gap-8 lg:border-r lg:border-ink/12 lg:pr-8">
              {left.map((p) => (
                <a key={p.title} href={p.href} className="group block">
                  <div className="aspect-[16/10] mb-4 rounded-md" style={{ backgroundColor: p.accent }} />
                  <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink/45 mb-2">Concept · {p.category}</p>
                  <h3 className="font-serif text-2xl leading-tight group-hover:text-orange transition-colors">{p.title}</h3>
                </a>
              ))}
            </div>
            <div className="lg:col-span-6 lg:border-r lg:border-ink/12 lg:pr-8">
              <a href={feature.href} className="group block">
                <div className="aspect-[16/10] mb-6 rounded-md" style={{ backgroundColor: feature.accent }} />
                <p className="font-mono text-[11px] tracking-[0.16em] uppercase text-ink/45 mb-3 text-center">Featured concept · {feature.category}</p>
                <h3 className="font-serif text-4xl sm:text-5xl leading-[1.05] tracking-tight text-center group-hover:text-orange transition-colors">{feature.title}</h3>
                <p className="font-serif text-xl italic text-ink/65 mt-4 text-center max-w-[44ch] mx-auto">{feature.dek}</p>
              </a>
            </div>
            <div className="lg:col-span-3">
              <p className="font-mono text-[11px] tracking-[0.2em] uppercase text-ink/45 mb-5">Concept queue</p>
              <div className="flex flex-col divide-y divide-ink/12">
                {recent.map((p) => (
                  <a key={p.title} href={p.href} className="group flex gap-4 py-4 first:pt-0">
                    <span className="w-16 h-16 flex-none rounded-md" style={{ backgroundColor: p.accent }} />
                    <div>
                      <h4 className="font-serif text-lg leading-tight group-hover:text-orange transition-colors">{p.title}</h4>
                      <p className="font-mono text-[10px] tracking-[0.14em] uppercase text-ink/45 mt-1.5">Preview</p>
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
                <JobCard key={r.url} name={r.title} job={r.description} href={r.url} label={r.category} />
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
          <div className="flex flex-wrap justify-center gap-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cream/50">
            {socials.map((social) => (
              <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" className="hover:text-orange">
                {social.label}
              </a>
            ))}
          </div>
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-cream/40">Scaling With Agents</span>
        </div>
      </footer>
    </div>
  );
}
