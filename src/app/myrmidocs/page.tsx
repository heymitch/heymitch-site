import type { Metadata } from "next";
import MyrLogo from "./MyrLogo";
import EarlyAccessForm from "./EarlyAccessForm";
import AgentSnippet from "./AgentSnippet";
import DemoStage from "./DemoStage";
import "./myrmidocs.css";

export const metadata: Metadata = {
  title: "Myrmidocs: Your team and your AI, working side by side.",
  description:
    "Myrmidocs is a shared workspace for your docs and tasks. Your team works in it together, and so does your AI. Hand it a task, it does the work, and you see exactly what it did before anything is final.",
  openGraph: {
    title: "Myrmidocs: Your team and your AI, working side by side.",
    description:
      "A shared workspace for your docs and tasks. Hand a task to your AI, it does the work, and you see exactly what it did before anything is final.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Myrmidocs: Your team and your AI, working side by side.",
    description:
      "A shared workspace for your docs and tasks. Your team works in it together, and so does your AI.",
  },
};

const features = [
  {
    n: "01",
    title: "Hand work to your AI like a teammate.",
    body: "Put a task on the board. Your AI picks it up, does it, and shows you the result. You stay in control.",
  },
  {
    n: "02",
    title: "See exactly who did what.",
    body: "Every change, by a person or the AI, is right there. Nothing important happens without your okay.",
  },
  {
    n: "03",
    title: "No surprise AI bills.",
    body: "Use AI as much as you want. No per-message fees, no limits, no extra AI charge on your invoice.",
  },
];

const steps = [
  { k: "Write and plan together.", d: "Your whole team in one shared workspace." },
  { k: "Hand a task to your AI.", d: "Drop it on the board, the same as for a person." },
  { k: "It does the work and shows you.", d: "You see exactly what changed." },
  { k: "You approve.", d: "Nothing final until you say so." },
];

const compareTools = ["Myrmidocs", "Notion", "Asana", "Google Docs", "Obsidian"];

// "yes" | "partial" | "no", first cell is always Myrmidocs.
const compareRows: { label: string; cells: ("yes" | "partial" | "no")[] }[] = [
  { label: "Docs and notes, edited together live", cells: ["yes", "yes", "partial", "yes", "no"] },
  { label: "A task board for your projects", cells: ["yes", "yes", "yes", "no", "no"] },
  { label: "Hand tasks to your AI like a teammate", cells: ["yes", "no", "no", "no", "no"] },
  { label: "Every change shows who did it, person or AI", cells: ["yes", "partial", "partial", "partial", "no"] },
  { label: "Approve your AI's work before it is final", cells: ["yes", "no", "no", "no", "no"] },
  { label: "Unlimited AI, no per-message fees", cells: ["yes", "no", "no", "no", "no"] },
  { label: "Your files stay yours, plain and portable", cells: ["yes", "no", "no", "partial", "yes"] },
  { label: "Bring your own AI", cells: ["yes", "no", "no", "no", "no"] },
];

const tiers = [
  {
    name: "Team",
    tag: "Hosted for you",
    price: "$11",
    unit: "/ seat / month",
    blurb: "Everything your team needs, hosted for you.",
    points: [
      "Shared docs and task board",
      "Your AI as a teammate",
      "See who did what, every change",
      "Unlimited AI, no per-message fees",
    ],
    cta: "Get early access",
    featured: false,
  },
  {
    name: "Business",
    tag: "For growing teams",
    price: "$16",
    unit: "/ seat / month",
    blurb: "Everything in Team, plus the extras larger teams ask for.",
    points: [
      "Everything in Team",
      "Single sign-on",
      "Your own domain",
      "Priority support",
    ],
    cta: "Get early access",
    featured: true,
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="font-mono text-[11px] uppercase tracking-[0.34em]"
      style={{ color: "var(--myr-teal-lt)" }}
    >
      {children}
    </p>
  );
}

function CheckTick() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ flexShrink: 0, marginTop: 4 }}
    >
      <path
        d="M3 8.5l3 3 7-8"
        stroke="var(--myr-teal)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompareMark({ state }: { state: "yes" | "partial" | "no" }) {
  if (state === "yes") {
    return (
      <svg
        className="myr-mark-svg"
        width="15"
        height="15"
        viewBox="0 0 16 16"
        fill="none"
        role="img"
        aria-label="Yes"
      >
        <path
          d="M3 8.5l3 3 7-8"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (state === "partial") {
    return (
      <span className="myr-mark-dash" aria-label="Limited">
        –
      </span>
    );
  }
  return <span className="myr-mark-no" aria-label="No" />;
}

export default function MyrmidocsPage() {
  return (
    <div className="myr-root">
      {/* the sky: sparse starfield + one blue-violet nebula */}
      <div className="myr-cosmos" aria-hidden="true" />
      <div className="myr-nebula" aria-hidden="true" />

      {/* ─────────── NAV ─────────── */}
      <nav className="myr-nav">
        <span className="myr-wordmark">
          <MyrLogo className="myr-nav-logo" sigil />
          <span className="myr-wordmark-metal">Myrmidocs</span>
        </span>
        <a href="#myr-final" className="myr-nav-cta">
          Get early access
        </a>
      </nav>

      {/* ─────────── HERO (void) ─────────── */}
      <header className="myr-hero">
        <MyrLogo className="myr-hero-ghost" title="" />

        <div className="myr-shell myr-hero-inner">
          <Eyebrow>Myrmidocs · Myr for short</Eyebrow>

          <h1 className="myr-h1">
            Your team and your AI,
            <br />
            <span className="myr-h1-accent">working side by side.</span>
          </h1>

          <p className="myr-sub">
            Myrmidocs is a shared workspace for your docs and tasks. Your team
            works in it together, and so does your AI. Hand it a task, it does
            the work, and you see exactly what it did before anything is final.
          </p>

          <AgentSnippet />

          <div className="myr-hero-cta">
            <div className="myr-hero-form">
              <EarlyAccessForm id="hero" variant="dark" glint />
            </div>
            <ul className="myr-hero-chips" aria-hidden="false">
              <li>Your team and your AI in one place</li>
              <li>You approve before anything is final</li>
              <li>Your work stays yours</li>
            </ul>
          </div>
        </div>
      </header>

      {/* ─────────── DEMO STAGE ─────────── */}
      <section className="myr-section">
        <div className="myr-shell">
          <div className="myr-rule">
            <span>See it work</span>
          </div>
          <DemoStage url="myr.heymitch.ai" />
        </div>
      </section>

      {/* ─────────── FEATURE CARDS ─────────── */}
      <section className="myr-section">
        <div className="myr-shell">
          <div className="myr-rule">
            <span>What you get</span>
          </div>
          <div className="myr-cards">
            {features.map((f) => (
              <article key={f.n} className="myr-card">
                <span className="myr-card-n">{f.n}</span>
                <h3 className="myr-card-title">{f.title}</h3>
                <p className="myr-card-body">{f.body}</p>
              </article>
            ))}
          </div>

          {/* Fourth point: own your work */}
          <div className="myr-own">
            <MyrLogo className="myr-own-mark" title="" />
            <div>
              <p className="myr-own-ey font-mono">Your work stays yours</p>
              <p className="myr-own-body">
                Take it with you anytime. No lock-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────── HOW IT WORKS ─────────── */}
      <section className="myr-section myr-section-warm">
        <div className="myr-shell">
          <div className="myr-rule">
            <span>How it works</span>
          </div>
          <ol className="myr-steps">
            {steps.map((s, i) => (
              <li key={s.k} className="myr-step">
                <span className="myr-step-n font-mono">{`0${i + 1}`}</span>
                <p className="myr-step-k">{s.k}</p>
                <p className="myr-step-d">{s.d}</p>
                {i < steps.length - 1 && (
                  <span className="myr-step-arrow" aria-hidden="true">
                    →
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ─────────── COMPARISON ─────────── */}
      <section className="myr-section">
        <div className="myr-shell">
          <div className="myr-rule">
            <span>How we compare</span>
          </div>
          <p className="myr-compare-lead">
            Everything a modern team needs in one place, plus your AI as a real
            teammate. The other tools do some of this. Myrmidocs does all of it.
          </p>
          <div className="myr-compare-scroll">
            <table className="myr-compare">
              <thead>
                <tr>
                  <th className="myr-compare-feat" aria-hidden="true" />
                  {compareTools.map((t, i) => (
                    <th
                      key={t}
                      scope="col"
                      className={`myr-compare-tool${i === 0 ? " is-myr" : ""}`}
                    >
                      {t}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {compareRows.map((row) => (
                  <tr key={row.label}>
                    <th scope="row" className="myr-compare-feat">
                      {row.label}
                    </th>
                    {row.cells.map((c, i) => (
                      <td
                        key={i}
                        className={`myr-compare-cell${i === 0 ? " is-myr" : ""}`}
                      >
                        <CompareMark state={c} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="myr-compare-legend font-mono">
            <span>
              <CompareMark state="yes" /> Yes
            </span>
            <span>
              <CompareMark state="partial" /> Limited
            </span>
            <span>
              <CompareMark state="no" /> No
            </span>
          </p>
        </div>
      </section>

      {/* ─────────── PRICING ─────────── */}
      <section className="myr-section myr-section-warm">
        <div className="myr-shell">
          <div className="myr-rule">
            <span>Pricing</span>
          </div>
          <div className="myr-tiers">
            {tiers.map((t) => (
              <article
                key={t.name}
                className={`myr-tier${t.featured ? " is-featured" : ""}`}
              >
                {t.featured && (
                  <span className="myr-tier-flag">Most teams</span>
                )}
                <p className="myr-tier-tag font-mono">{t.tag}</p>
                <h3 className="myr-tier-name">{t.name}</h3>
                <p className="myr-tier-price">
                  <span className="myr-tier-amt">{t.price}</span>
                  <span className="myr-tier-unit">{t.unit}</span>
                </p>
                <p className="myr-tier-blurb">{t.blurb}</p>
                <ul className="myr-tier-list">
                  {t.points.map((p) => (
                    <li key={p}>
                      <CheckTick />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
                <a href="#myr-final" className="myr-tier-cta">
                  {t.cta}
                </a>
              </article>
            ))}
          </div>

          <p className="myr-pricing-foot">
            Free and open for solo use.
          </p>
        </div>
      </section>

      {/* ─────────── FINAL CTA (void) ─────────── */}
      <section id="myr-final" className="myr-final">
        <div className="myr-shell myr-final-inner">
          <Eyebrow>Get early access</Eyebrow>
          <h2 className="myr-final-h">
            Your team and your AI, side by side.
          </h2>
          <p className="myr-final-sub">
            One shared workspace where the work gets done together, and you
            always see what happened before anything is final.
          </p>
          <div className="myr-final-form">
            <EarlyAccessForm id="final" variant="dark" />
          </div>
        </div>
      </section>

      {/* ─────────── FOOTER ─────────── */}
      <footer className="myr-footer">
        <div className="myr-shell myr-footer-inner">
          <span className="myr-wordmark myr-footer-mark">
            <MyrLogo className="myr-nav-logo" sigil />
            <span className="myr-wordmark-metal">Myrmidocs</span>
          </span>
          <a href="/" className="myr-back">
            heymitch.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
