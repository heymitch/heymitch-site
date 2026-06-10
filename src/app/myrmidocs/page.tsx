import type { Metadata } from "next";
import MyrLogo from "./MyrLogo";
import EarlyAccessForm from "./EarlyAccessForm";
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

export default function MyrmidocsPage() {
  return (
    <div className="myr-root">
      {/* ─────────── NAV ─────────── */}
      <nav className="myr-nav">
        <span className="myr-wordmark">
          <MyrLogo className="myr-nav-logo" />
          <span>Myrmidocs</span>
        </span>
        <a href="#myr-final" className="myr-nav-cta">
          Get early access
        </a>
      </nav>

      {/* ─────────── HERO (dark / ink) ─────────── */}
      <header className="myr-hero">
        <div className="myr-hero-grid" aria-hidden="true" />
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

          <div className="myr-hero-cta">
            <div className="myr-hero-form">
              <EarlyAccessForm id="hero" variant="dark" />
            </div>
            <ul className="myr-hero-chips" aria-hidden="false">
              <li>Your team and your AI in one place</li>
              <li>You approve before anything is final</li>
              <li>Your work stays yours</li>
            </ul>
          </div>
        </div>
      </header>

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

      {/* ─────────── PRICING ─────────── */}
      <section className="myr-section">
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

      {/* ─────────── FINAL CTA (dark) ─────────── */}
      <section id="myr-final" className="myr-final">
        <div className="myr-final-grid" aria-hidden="true" />
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
            <MyrLogo className="myr-nav-logo" />
            <span>Myrmidocs</span>
          </span>
          <a href="/" className="myr-back">
            heymitch.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
