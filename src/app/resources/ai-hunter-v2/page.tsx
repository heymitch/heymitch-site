import type { Metadata } from "next";
import RetroStripes from "@/components/RetroStripes";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "AI Hunter 2.0 — Search and Destroy Robo-Writing",
  description:
    "Deterministic AI pattern scanner with 200+ experiments baked in. Scores your writing 0-100. Finds exactly which sentences to rewrite.",
};

const beforeText = `In today's rapidly evolving landscape, it's crucial to understand that effective communication is the cornerstone of success. By leveraging cutting-edge strategies and fostering meaningful connections, you can navigate the complexities of modern business. Furthermore, it's important to note that embracing innovation isn't just beneficial — it's essential for driving sustainable growth and unlocking your full potential.`;

const flags = [
  { text: "rapidly evolving landscape", pattern: "Dead metaphor", fix: '"since GPT-4 dropped 3 years ago"' },
  { text: "it's crucial to understand that", pattern: "Throat-clearing", fix: "Cut entirely" },
  { text: "cornerstone of success", pattern: "Corporate cliche stack", fix: '"what closes deals"' },
  { text: "leveraging cutting-edge strategies", pattern: "Double AI buzzword combo", fix: '"using the playbook from Q4"' },
  { text: "fostering meaningful connections", pattern: "Vague corporate filler", fix: '"calling 3 past clients this week"' },
  { text: "navigate the complexities", pattern: "AI verb + AI noun", fix: '"figure out pricing"' },
  { text: "Furthermore, it's important to note that", pattern: "Transition filler", fix: "Cut entirely" },
  { text: "driving sustainable growth", pattern: "Boardroom bingo", fix: '"adding $20K MRR by June"' },
  { text: "unlocking your full potential", pattern: "Motivational poster language", fix: '"doing work that actually ships"' },
];

export default function AIHunterPage() {
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

      {/* Hero */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <SectionHeader label="Free Skill" />

        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="flex-1 max-w-xl">
            <h1 className="font-sans text-5xl sm:text-6xl font-bold tracking-tight text-brown mb-4">
              AI Hunter<span className="text-orange"> 2.0</span>
            </h1>

            <p className="text-xl sm:text-2xl font-sans font-medium text-brown/80 mb-6 leading-snug">
              Search and destroy robo-writing. 200+ experiments of research baked into one skill.
            </p>

            <p className="font-mono text-sm text-brown/50 leading-relaxed mb-8">
              Paste any text. Get a score from 0-100. Every flagged sentence gets a pattern name,
              an explanation, and a rewrite direction. Built from months of GPTZero evasion research.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Dual evaluation: regex patterns + punctuation landmarks",
                "Scores 0-100 with letter grade (A through F)",
                "Flags exact sentences with pattern names",
                "Rewrite directions for every flag",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-orange shrink-0" />
                  <span className="font-sans text-brown/70 text-base">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="/downloads/ai-hunter-v2.plugin.zip"
              download
              className="inline-flex items-center gap-3 rounded-lg bg-brown text-cream font-sans font-bold text-base px-6 py-3.5 hover:bg-brown/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download AI Hunter 2.0
            </a>

            <p className="font-mono text-xs text-brown/40 mt-3">
              Claude Cowork plugin. Install via Plugins &rarr; Add Personal Plugin &rarr; Upload.
            </p>
          </div>

          {/* Floppy disk image */}
          <div className="flex-shrink-0 md:mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/ai-hunter-floppy.png"
              alt="AI Hunter 2.0 floppy disk"
              className="w-64 sm:w-72 md:w-80 h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Before/After Demo */}
      <section className="bg-brown">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-cream mb-2">
              See it in action
            </h2>
            <p className="font-mono text-sm text-cream/50 mb-10">
              Run this paragraph through AI Hunter. Watch it light up like a crime scene.
            </p>

            {/* Input sample */}
            <div className="rounded-lg border border-[#2a2520] bg-[#12100E] p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <span className="ml-3 font-mono text-xs text-[#ff5f56]/60">
                  input &mdash; Grade: F
                </span>
              </div>
              <p className="font-mono text-sm leading-relaxed text-cream/60 italic">
                &ldquo;{beforeText}&rdquo;
              </p>
            </div>

            {/* Flags table */}
            <div className="rounded-lg border border-[#2a2520] bg-[#12100E] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2520]">
                <p className="font-mono text-xs text-[#ff5f56] tracking-wider uppercase">
                  9 flags in 3 sentences &mdash; Verdict: F
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#2a2520]">
                      <th className="px-4 py-3 font-mono text-xs text-cream/30 font-normal">#</th>
                      <th className="px-4 py-3 font-mono text-xs text-cream/30 font-normal">Flagged</th>
                      <th className="px-4 py-3 font-mono text-xs text-cream/30 font-normal">Pattern</th>
                      <th className="px-4 py-3 font-mono text-xs text-cream/30 font-normal">Fix</th>
                    </tr>
                  </thead>
                  <tbody>
                    {flags.map((f, i) => (
                      <tr key={i} className="border-b border-[#2a2520]/50 last:border-0">
                        <td className="px-4 py-3 font-mono text-xs text-cream/30">{i + 1}</td>
                        <td className="px-4 py-3 font-mono text-sm text-[#ff5f56]/80">&ldquo;{f.text}&rdquo;</td>
                        <td className="px-4 py-3 font-mono text-xs text-cream/50">{f.pattern}</td>
                        <td className="px-4 py-3 font-mono text-xs text-[#27c93f]/80">{f.fix}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Callouts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              <div className="rounded-lg border border-[#2a2520] bg-[#12100E] p-5">
                <p className="font-sans font-bold text-cream text-sm mb-2">
                  Contrast Framing &mdash; The #1 Dead Giveaway
                </p>
                <p className="font-mono text-xs text-cream/40 leading-relaxed">
                  &ldquo;Not just X&mdash;it&apos;s Y&rdquo; is the single biggest AI tipoff. AI thinks in contrasts so deeply that even after cleaning,
                  it creeps back. Stay vigilant on this one.
                </p>
              </div>
              <div className="rounded-lg border border-[#2a2520] bg-[#12100E] p-5">
                <p className="font-sans font-bold text-cream text-sm mb-2">
                  Rule of Three &mdash; AI&apos;s Favorite Rhythm
                </p>
                <p className="font-mono text-xs text-cream/40 leading-relaxed">
                  AI defaults to listing things in threes every time it wants to sound persuasive.
                  Break the pattern&mdash;use two, use five, or just say the one thing that matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Install Instructions */}
      <section className="max-w-[960px] mx-auto px-6 py-16">
        <SectionHeader label="Install" />

        <div className="max-w-2xl">
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-brown mb-6">
            3 steps. 2 minutes.
          </h2>

          <div className="space-y-6">
            {[
              {
                step: "1",
                title: "Download the plugin",
                desc: "Click the download button above. You'll get a .plugin.zip file.",
              },
              {
                step: "2",
                title: "Open Claude Cowork",
                desc: "Go to Plugins \u2192 Add Personal Plugin \u2192 Upload the .zip file.",
              },
              {
                step: "3",
                title: "Run it",
                desc: 'Paste any text and say "Run AI Hunter on this." Watch it score and flag every AI pattern.',
              },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-orange text-cream font-sans font-bold text-sm flex items-center justify-center">
                  {s.step}
                </span>
                <div>
                  <p className="font-sans font-bold text-brown text-base">{s.title}</p>
                  <p className="font-mono text-sm text-brown/50">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10">
            <a
              href="/downloads/ai-hunter-v2.plugin.zip"
              download
              className="inline-flex items-center gap-3 rounded-lg bg-brown text-cream font-sans font-bold text-base px-6 py-3.5 hover:bg-brown/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download AI Hunter 2.0
            </a>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[960px] mx-auto px-6 pb-16">
        <div className="rounded-xl border border-brown/10 bg-cream-dark/30 p-8 sm:p-10 text-center">
          <p className="font-mono text-xs tracking-wider uppercase text-brown/40 mb-3">
            Want the full system?
          </p>
          <h3 className="font-sans text-2xl sm:text-3xl font-bold text-brown mb-3">
            AI Hunter is one of 20+ skills you build in the bootcamp.
          </h3>
          <p className="font-mono text-sm text-brown/50 mb-6 max-w-lg mx-auto">
            Claude Cowork Bootcamp teaches you to build AI workflows that run your business.
            6 live sessions. Real skills. Not prompts.
          </p>
          <a
            href="https://ccb-waitlist.vercel.app"
            className="inline-flex items-center gap-2 rounded-lg bg-orange text-cream font-sans font-bold text-base px-6 py-3.5 hover:bg-orange/90 transition-colors"
          >
            Join the Waitlist
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brown px-6 py-6 text-center">
        <p className="font-sans text-xs tracking-[0.25em] uppercase text-cream/40">
          By Mitch Harris
        </p>
      </footer>
    </main>
  );
}
