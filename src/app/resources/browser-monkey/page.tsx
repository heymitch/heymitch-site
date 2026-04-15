import type { Metadata } from "next";
import RetroStripes from "@/components/RetroStripes";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = {
  title: "BrowserMonkey — Sniff once, shortcut forever.",
  description:
    "Map a website's endpoints once. Run shortcuts forever. Browser automation that skips the screenshot tax — intercepts real API calls and replays them blind.",
};

const workflowSteps = [
  {
    phase: "Without Monkey",
    steps: [
      "Take screenshot",
      "Read screenshot for coordinates",
      "Click element",
      "Screenshot to verify",
      "Find next element",
      "Screenshot again",
      "Repeat every session",
    ],
    verdict: "F",
    color: "#ff5f56",
  },
];

const comparisons = [
  { label: "Screenshot loops", without: "Every. Single. Step.", with: "Zero" },
  { label: "Token cost per run", without: "High (vision calls)", with: "Minimal (text-only)" },
  { label: "Memory across sessions", without: "None — starts over", with: "Reads shortcut file" },
  { label: "Setup required", without: "None (just slow)", with: "One Sniffer run per site" },
];

export default function BrowserMonkeyPage() {
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
              Browser<span className="text-orange">Monkey</span>
            </h1>

            <p className="text-xl sm:text-2xl font-sans font-medium text-brown/80 mb-6 leading-snug">
              Sniff once, shortcut forever. Browser automation without the screenshot tax.
            </p>

            <p className="font-mono text-sm text-brown/50 leading-relaxed mb-8">
              Sniffer maps a website&apos;s real API calls once and writes them to a local file.
              Monkey reads that file and navigates blind — no screenshots, no coordinate guessing,
              no fog-of-war on every run. Built for the 90% of SaaS that won&apos;t give you an API.
            </p>

            <ul className="space-y-3 mb-8">
              {[
                "Sniffer intercepts fetch/XHR calls — documents every endpoint",
                "Monkey replays shortcuts without screenshots",
                "Works on walled-garden tools with no public API",
                "Shortcut files saved locally in your Coworker folder",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-orange shrink-0" />
                  <span className="font-sans text-brown/70 text-base">{item}</span>
                </li>
              ))}
            </ul>

            <a
              href="https://www.notion.so/34301b956bb681cb9f44eeb952c991b2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg bg-brown text-cream font-sans font-bold text-base px-6 py-3.5 hover:bg-brown/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Get BrowserMonkey free
            </a>

            <p className="font-mono text-xs text-brown/40 mt-3">
              Claude Cowork plugin. Install via Plugins &rarr; Add Personal Plugin &rarr; Upload.
            </p>
          </div>

          {/* Floppy disk image */}
          <div className="flex-shrink-0 md:mt-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/products/browser-monkey-floppy.png"
              alt="BrowserMonkey floppy disk"
              className="w-64 sm:w-72 md:w-80 h-auto drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Demo — Comparison */}
      <section className="bg-brown">
        <div className="max-w-[960px] mx-auto px-6 py-16">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-sans text-2xl sm:text-3xl font-bold text-cream mb-2">
              The screenshot tax is real.
            </h2>
            <p className="font-mono text-sm text-cream/50 mb-10">
              Native browser automation rediscovers the maze every session. Monkey reads the map.
            </p>

            {/* Comparison table */}
            <div className="rounded-lg border border-[#2a2520] bg-[#12100E] overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-[#2a2520]">
                <p className="font-mono text-xs text-[#ff5f56] tracking-wider uppercase">
                  Native automation vs BrowserMonkey
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#2a2520]">
                      <th className="px-4 py-3 font-mono text-xs text-cream/30 font-normal">What</th>
                      <th className="px-4 py-3 font-mono text-xs text-[#ff5f56]/60 font-normal">Without Monkey</th>
                      <th className="px-4 py-3 font-mono text-xs text-[#27c93f]/60 font-normal">With Monkey</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisons.map((row, i) => (
                      <tr key={i} className="border-b border-[#2a2520]/50 last:border-0">
                        <td className="px-4 py-3 font-mono text-xs text-cream/50">{row.label}</td>
                        <td className="px-4 py-3 font-mono text-sm text-[#ff5f56]/80">{row.without}</td>
                        <td className="px-4 py-3 font-mono text-sm text-[#27c93f]/80">{row.with}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Anchor case */}
            <div className="rounded-lg border border-[#2a2520] bg-[#12100E] p-6">
              <p className="font-mono text-xs text-[#ff5f56] tracking-wider uppercase mb-4">
                // Real workflow — Roman · April 2026 AIWS Clinic
              </p>
              <p className="font-mono text-sm text-cream/60 mb-3">
                <span className="text-cream/30">Problem:</span> Monthly accounting — 12 invoices from 6 tools with no public APIs. Finnish accounting software. 45 min/month, manually.
              </p>
              <p className="font-mono text-sm text-cream/60 mb-3">
                <span className="text-cream/30">With Monkey:</span> One Sniffer run across all invoice tools (~20 min, once). Every month after: Monkey fetches everything, uploads to accounting, done.
              </p>
              <p className="font-mono text-sm text-[#27c93f]">
                → 45 min/month → 0 min/month. Payback on run one.
              </p>
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
                title: "Get the skill",
                desc: "Click the button above to open the Notion page. Download browser-monkey.zip. Don't unzip it.",
              },
              {
                step: "2",
                title: "Upload to Claude",
                desc: "Go to Customize → Personal Plugins → + → Upload Plugin. Drag and drop the ZIP.",
              },
              {
                step: "3",
                title: "Open a new task and type /monkey",
                desc: "Plugins only load in new tasks. Give it the target site. Sniffer maps it. Monkey runs it every time after.",
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
              href="https://www.notion.so/34301b956bb681cb9f44eeb952c991b2"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded-lg bg-brown text-cream font-sans font-bold text-base px-6 py-3.5 hover:bg-brown/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Get BrowserMonkey free
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
            BrowserMonkey is one skill from the bootcamp.
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
