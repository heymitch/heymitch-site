import type { Metadata } from 'next';
import './pab.css';

export const metadata: Metadata = {
  title: 'Personal Agent Bootcamp | Build & Sell AI Agents',
  robots: 'noindex, nofollow',
};

/* ── helpers ─────────────────────────────────────────────────────── */

function Editorial({ children }: { children: React.ReactNode }) {
  return <div className="pab-editorial">{children}</div>;
}

function Cta({ label, first = false }: { label: string; first?: boolean }) {
  return (
    <div className="pab-cta-wrap">
      <a href="#enroll-pending" className="pab-cta">
        {label}
      </a>
      {first && <span className="pab-cta-pending">[checkout URL pending]</span>}
    </div>
  );
}

function SecId({ pos, children }: { pos: 'tl' | 'tr' | 'bl'; children: React.ReactNode }) {
  return (
    <span className={`pab-secid pab-secid--${pos}`} aria-hidden="true">
      {children}
    </span>
  );
}

/* ── locked copy data ────────────────────────────────────────────── */

const archetypes = [
  {
    name: `The Operator / Founder`,
    body: `You want a personal assistant for your business. Real work offloaded onto an agent so one person can do the work of several, and the work keeps running while you sleep.`,
    tag: `TYPE.A / OPS`,
  },
  {
    name: `The Freelancer / Agency Owner`,
    body: `You want a new recurring service line. Learn to build these for other business owners and sell them as managed retainers, with your own agent as the living demo.`,
    tag: `TYPE.B / SVC`,
  },
  {
    name: `The Team Lead`,
    body: `You want a team agent living in your Slack that does real work. A shared operator the whole team can hand things to, where the work already happens.`,
    tag: `TYPE.C / TEAM`,
  },
  {
    name: `The Prosumer`,
    body: `You want to finally build your own Jarvis for work and life. The demos got old. You want the one that's actually yours, knows you, and earns its keep.`,
    tag: `TYPE.D / SOLO`,
  },
];

const problems = [
  `"I've watched every demo. I still don't have an agent doing my actual work."`,
  `"I built a bot once. It impressed for a minute and then sat idle."`,
  null, // rendered inline (italic *would*)
  `"Every session starts from zero. The AI forgets me."`,
  `"Nothing runs while I sleep. Laptop closed, agent dead."`,
  `"I got stuck in setup hell and never reached the part where it does real work."`,
  `"I want to sell this to clients, but I can't sell what I don't run myself."`,
  `"I've paid for hype before: another course, no proof, no durable result."`,
  `"Doing it myself means a year stitching together open-source docs alone."`,
];

const mistakes = [
  {
    title: `Mistake 1: Chasing every new tool instead of mastering one loop.`,
    body: `A new model, a new app, a new "agent platform" every week. You learn one, everyone moves to the next. The bootcamp teaches ONE agent loop (Trigger, Act, Remember), taught once on a hero build, then forked to YOUR work. The set of primitives is closed. We teach the primitives, not the bots, so what you learn keeps working when the tools change.`,
  },
  {
    title: `Mistake 2: Treating setup as an afterthought.`,
    body: `Setup is the number one reason people quit before their agent ever does real work. So here, the friction IS the curriculum. Click-by-click pre-work walkthroughs mean your agent is live before Session 1 even starts, and we stand it up together on a cheap box you control. Bring an API key, not an engineering background.`,
  },
  {
    title: `Mistake 3: Building a bot nobody will pay for.`,
    body: `A demo with no offer, no buyer, no pricing. In this bootcamp, selling starts on day 1: you pick your niche in Session 1, every skill you build for yourself becomes inventory you can sell, and you leave with a productized menu, an offer page, and a pitch motion. The build IS the sales asset the whole way.`,
  },
];

const sessions = [
  {
    lead: `Session 1: Onboard Your Personal Agent.`,
    body: `By the end of Day 1, your agent is alive — set up, connected, and answering you. You'll also pick the niche you're going to build skills for, so everything you create over the next 2 weeks compounds toward a sellable offer.`,
  },
  {
    lead: `Session 2: Equip Your Agent With Skills.`,
    body: `This is where your agent goes from "cool demo" to "doing my actual work." We'll install 3 skills that solve real problems in your own life and business — and every skill you build for yourself becomes inventory you can sell later.`,
  },
  {
    lead: `Session 3: Package Your Agent For Sale.`,
    body: `Turn your skills into a productized menu prospects can buy from. Clear deliverables, clear pricing, clear scope — so you're never on a call trying to explain "AI agents" from scratch. You walk out with an offer you could pitch tomorrow.`,
  },
  {
    lead: `Session 4: Create Your Sales Funnel.`,
    body: `Launch your offer page and send 3 free-consulting Looms to real prospects. No cold calls, no sales scripts — just you showing a real business owner a real agent solving a real problem. (This is the highest-converting demo we've ever seen.)`,
  },
  {
    lead: `Session 5: Evergreen Marketing Strategy.`,
    body: `Build a content pipeline skill that fills your prospect list on autopilot. Your agent helps create the content that attracts the clients who pay for agents. The flywheel starts spinning here.`,
  },
  {
    lead: `Session 6: Land Your First Client.`,
    body: `Close your first client and install the skill on their agent — without getting stuck in support hell. We'll cover scoping, delivery, and the watchdog systems that keep client agents running so you're not their 24/7 help desk.`,
  },
];

const includes = [
  {
    lead: `6 Live Sessions With Mitch:`,
    body: ` 6x hour-long sessions packed with live demos, walkthroughs, and plain-English skill files taking you from "no agent" to "working agent doing your work" to "first paying client" — onboarding, skills, packaging, funnel, marketing pipeline, and close`,
  },
  {
    lead: `6 Pre-Work Walkthroughs ($300 value).`,
    body: ` Click-by-click setup guides so you arrive ready to build. Your agent is live before Session 1 even starts.`,
  },
  {
    lead: `6 Deep Dive Reference Docs ($300 value).`,
    body: ` 5,000+ word walkthroughs for every session. Every click documented. Every error troubleshot. Go at your own pace.`,
  },
  {
    lead: `The "Business-in-a-Box" Tech Stack For A Hermes Agent Service ($2500 value).`,
    body: ` The plug-and-play backend system that creates a few-click Agent installation and management so you can deliver agents to clients and keep them on retainer.`,
  },
  {
    lead: `The "What Agent Should I Build" Skill Stack ($2500 value)`,
    body: ` that helps you select your niche, turns you into a high ticket AI consultant, and generates the prompts and skills you need to actually build these agents for clients.`,
  },
  {
    lead: `The Agent-As-A-Service Sales Kit ($1,000 value).`,
    body: ` The productized offer menu template, the offer page template, the free-consulting Loom script, and the retainer pricing calculator—everything from the live sessions packaged as reusable agent skills.`,
  },
  {
    lead: `Session Replays ($300 value).`,
    body: ` Every recording available within hours so you can reference it forever and build along.`,
  },
  {
    lead: `LIFETIME ACCESS`,
    body: ` to the Personal Agent Bootcamp curriculum and library of bonuses.`,
  },
];

const bonuses = [
  {
    lead: `[BONUS] State of AI Agents 2026 Guide ($99 value).`,
    body: ` Quick-start overviews of the agent landscape right now — harnesses, models, infrastructure, and where the money is being made. Our picks for the exact stack you should actually use. Built fresh right before launch so it's not stale by the time you read it.`,
  },
  {
    lead: `[BONUS] Talk To Your Agent Voice Pack ($149 value).`,
    body: ` The skills to talk to your agent like a real assistant — send it tasks from your phone on a walk, get briefings read back to you, and run your business out loud.`,
  },
  {
    lead: `[BONUS] Customer Support Agent Pack ($199 value).`,
    body: ` A complete, sellable agent build — intake, FAQ handling, escalation, follow-up. Install it for a client as-is and you've got your first $3K offer ready on day one.`,
  },
];

const expiringBonuses = [
  {
    lead: `[BONUS] 5 Extra SOUL.md Templates ($99 value).`,
    body: ` Pre-built agent personalities — the Classic Butler, the Chief of Staff, the No-Nonsense Operator, and more. Give your agent (and every client agent you sell) a personality people actually enjoy working with.`,
  },
  {
    lead: `[BONUS] Trend Jacking Agent Pack 2.0 ($350 value).`,
    body: ` The agent that monitors your niche for breaking trends and drafts the content to ride them — updated for 2026. This bonus disappears when enrollment closes and will not be sold separately.`,
  },
];

const scheduleSessions = [
  `Session 1: Onboard Your Personal Agent`,
  `Session 2: Equip Your Agent With Skills`,
  `Session 3: Package Your Agent For Sale`,
  `Session 4: Create Your Sales Funnel`,
  `Session 5: Evergreen Marketing Strategy`,
  `Session 6: Land Your First Client`,
];

const valueRows: Array<[string, string]> = [
  [`6 Live Sessions With Mitch`, `(the core)`],
  [`6 Pre-Work Walkthroughs`, `$300`],
  [`6 Deep Dive Reference Docs`, `$300`],
  [`"Business-in-a-Box" Tech Stack`, `$2,500`],
  [`"What Agent Should I Build" Skill Stack`, `$2,500`],
  [`Agent-As-A-Service Sales Kit`, `$1,000`],
  [`Session Replays`, `$300`],
  [`State of AI Agents 2026 Guide`, `$99`],
  [`Talk To Your Agent Voice Pack`, `$149`],
  [`Customer Support Agent Pack`, `$199`],
  [`5 Extra SOUL.md Templates (expires)`, `$99`],
  [`Trend Jacking Agent Pack 2.0 (expires)`, `$350`],
];

const faqLogistics: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: `Is this live or self-paced?`,
    a: (
      <p>{`Live. 6 sessions over 2 weeks, each delivering a tangible same-day outcome. You get lifetime access to recordings, the curriculum, and every bonus, so nothing falls through the cracks.`}</p>
    ),
  },
  {
    q: `What if I can't attend live?`,
    a: (
      <p>{`Every session is recorded and posted within hours. The live experience is where the build happens, but the replays are complete and actionable on their own.`}</p>
    ),
  },
  {
    q: `When are the sessions?`,
    a: (
      <>
        <p>{`The cohort runs Monday, June 22 through Friday, July 3.`}</p>
        <div style={{ paddingLeft: 28, paddingBottom: 20 }}>
          <Editorial>{`[NEED MITCH: session days/times]`}</Editorial>
        </div>
      </>
    ),
  },
  {
    q: `What do I need before we start?`,
    a: (
      <p>{`An API key and a cheap box, and the pre-work walkthroughs handle the rest, click by click. Your agent is live before Session 1 even starts.`}</p>
    ),
  },
  {
    q: `What exactly do I walk away owning?`,
    a: (
      <p>{`Your own Wingman: a packaged, customized Hermes distribution that is yours to keep and fork, plus the prompts and .skills from every session, plus a repeatable offer to sell the result.`}</p>
    ),
  },
  {
    q: `How long do I have access?`,
    a: (
      <p>{`Lifetime. The curriculum, the replays, and the library of bonuses are yours for good.`}</p>
    ),
  },
  {
    q: `What's the time commitment?`,
    a: (
      <p>{`6 hour-long live sessions across 2 weeks, plus the pre-work walkthroughs before kickoff so you arrive ready to build.`}</p>
    ),
  },
];

const faqFit: Array<{ q: string; a: React.ReactNode }> = [
  {
    q: `Do I need to be technical?`,
    a: (
      <p>{`No. Setup is the number one churn point and we treat it as the curriculum: we stand the agent up together on a cheap box. Bring an API key, not an engineering background.`}</p>
    ),
  },
  {
    q: `Couldn't I just figure this out from free open-source docs?`,
    a: (
      <p>{`You could stand up the chassis. That is a commodity. What free docs do not give you is the loop that forks to your work, the compounding setup, the security gate, and the motion to SELL it. Information is free; accountability and a proven sequence are the product.`}</p>
    ),
  },
  {
    q: `How is this different from ChatGPT, or an agent platform I already use?`,
    a: (
      <p>{`Most of those narrate or answer in a chat window. This builds a durable agent that acts on real work async, on infra you own, and gets better at your work every week. And none of them teach you to sell the capability as a managed service.`}</p>
    ),
  },
  {
    q: `My business is different. Will this work for me?`,
    a: (
      <p>{`It is not bots, it is primitives. One loop forks to any workflow, and we fork it to YOUR work live. You pick your niche in Session 1 so everything you build compounds toward your offer.`}</p>
    ),
  },
  {
    q: `What happens when the models change?`,
    a: (
      <p>{`Your agent runs on infrastructure you control with your own key, so you can plug in any model and switch providers when a better one ships. The loop you learn stays the same; the brain is swappable.`}</p>
    ),
  },
  {
    q: `Can I really sell this?`,
    a: (
      <p>{`That's half the curriculum. Sessions 3 through 6 take you from productized menu to offer page to free-consulting Looms to your first close, and Mitch coaches the exact sell motion he runs on his own managed-agent sales.`}</p>
    ),
  },
  {
    q: `I can't afford it.`,
    a: (
      <p>{`$800 once, and the camp is built to pay for itself: the "& Sell" track gets you to your first paid pilot before graduation. One client covers it.`}</p>
    ),
  },
  {
    q: `Do you have a refund policy?`,
    a: (
      <p>{`Yes. Install the agent for yourself, complete the first three sessions, and if you then decide it's not for your business, you get a full refund. Details below.`}</p>
    ),
  },
];

/* ── page ────────────────────────────────────────────────────────── */

export default function PabLandingPage() {
  return (
    <div className="pab-root">
      {/* ── 1. HERO ── */}
      <header className="pab-sec pab-hero">
        <span className="pab-hero-coord" aria-hidden="true">
          SEC.01/HERO ·· 39.74N 104.99W ·· REC●
        </span>
        <span className="pab-ticks pab-ticks--r" aria-hidden="true" />
        <span className="pab-crop pab-crop--tl" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-kicker">Personal Agent Bootcamp</p>
          <h1 className="pab-h1">{`Build Your First (Or Next) AI Agent In 2 Weeks— Then Turn It Into A New Income Stream`}</h1>
          <p className="pab-sub">{`Join our next live bootcamp (starting Monday, June 22nd) and build an always-on personal AI agent that does real work for you — then package it into a productized offer you can sell for $3,000-$5,000`}</p>
          <div className="pab-spec" role="list">
            <span role="listitem">6 Live Sessions</span>
            <span role="listitem">Starts Mon, June 22</span>
            <span role="listitem">2 Weeks</span>
            <span role="listitem">$800</span>
            <span role="listitem">Week-One Guarantee</span>
          </div>
          <Cta label="Enroll in the Personal Agent Bootcamp" first />
          <p className="pab-note">{`Enrollment closes Sunday, June 21 at 11:59 PM.`}</p>
        </div>
      </header>

      {/* ── 2. ARCHETYPES ── */}
      <section className="pab-sec">
        <SecId pos="tr">SEC.02/ARCHETYPES</SecId>
        <span className="pab-crop pab-crop--tl" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">Which one are you</p>
          <h2 className="pab-h2">{`This bootcamp was built for four kinds of people.`}</h2>
          <div className="pab-arche">
            {archetypes.map((a) => (
              <article key={a.name} className="pab-arche-card">
                <span className="pab-arche-tag">{a.tag}</span>
                <h3>{a.name}</h3>
                <p>{a.body}</p>
              </article>
            ))}
          </div>
          <p className="pab-p">{`You've watched the demos. You don't need more inspiration. What you've never done is build a durable agent live, with someone watching, on infrastructure you control. If any of these sound like you, this was built for you.`}</p>
          <Cta label="Enroll in the Personal Agent Bootcamp" />
        </div>
      </section>

      {/* ── 3. INSTRUCTOR ── */}
      <section className="pab-sec">
        <SecId pos="bl">SEC.03/INSTRUCTOR ·· SRC:LIVE</SecId>
        <div className="pab-shell">
          <div className="pab-off-r pab-rail">
            <p className="pab-eyebrow">Instructor</p>
            <h2 className="pab-h2">{`Meet Your Instructor: Mitch Harris, the AI Coach`}</h2>
            <p className="pab-p">
              {`Mitch started using AI to help run his business on top of his day job, managing clients, drafting proposals, keeping the chaos organized. Then he started using it `}
              <em>for</em>
              {` his job, automating more and more of the drudgery until all he had to do was focus on the fun stuff.`}
            </p>
            <p className="pab-p">{`Today he runs his business on agents he built himself, including Cathy, a managed agent he works with every single day. The setups you'll install in this bootcamp are the ones he actually runs.`}</p>
            <p className="pab-p">{`The "& Sell" half is the part you can't fake, and it's the part Mitch is uniquely positioned to teach:`}</p>
            <ul className="pab-instr-list">
              <li>{`He has built and sold agents, so he's teaching a sell motion he actually runs.`}</li>
              <li>{`His own managed-agent sale is captured as it runs: calls recorded, the call-review build pointed at his own sales. You watch the exact motion in real time instead of hearing a story about it.`}</li>
            </ul>
            <p className="pab-p">{`A pure product vendor can't coach you to build a competitor without cannibalizing itself. A pure course-seller coaches a sell motion they don't run, which is theater. Mitch sells the managed agent AND coaches the exact motion he runs. That combination is the proof.`}</p>
            <Editorial>{`[NEED MITCH: SDK-agent sales proof: client count, dollar figures, 1-2 named closed-deal stories]`}</Editorial>
          </div>
        </div>
      </section>

      {/* ── 4. PROOF ── */}
      <section className="pab-sec">
        <SecId pos="tl">SEC.04/PROOF</SecId>
        <span className="pab-barcode pab-barcode--br" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">Proof</p>
          <h2 className="pab-h2">{`Built in public, run for real.`}</h2>
          <ul className="pab-proof-list">
            <li>
              <strong>{`The live dogfood:`}</strong>
              {` Mitch runs Cathy, a real managed agent, daily inside his own business. The bootcamp's curriculum is the same loop she runs on.`}
            </li>
            <li>
              <strong>{`The sell motion, documented:`}</strong>
              {` Mitch's managed-agent sales calls are recorded and reviewed by his own agent build. The case studies you'll study are documented closed deals, not staged performances.`}
            </li>
            <li>
              <Editorial>{`[NEED MITCH: verified proof numbers: the re-verify-flagged claims (Overclock's 17 skills, Dispatcher's live loop, Cathy's revenue tracking figure) need your confirmation before they go on the page]`}</Editorial>
            </li>
            <li>
              <Editorial>{`[NEED MITCH: 1-2 documented closed-deal case studies to feature here]`}</Editorial>
            </li>
          </ul>
          <p className="pab-p">
            <strong>{`What students say:`}</strong>
          </p>
          <div className="pab-testimonial">{`[TESTIMONIAL PLACEHOLDER]`}</div>
          <div className="pab-testimonial">{`[TESTIMONIAL PLACEHOLDER]`}</div>
        </div>
      </section>

      {/* ── 5. PROBLEMS ── */}
      <section className="pab-sec">
        <SecId pos="tr">SEC.05/SYMPTOMS ·· LOG</SecId>
        <span className="pab-ticks pab-ticks--l" aria-hidden="true" />
        <div className="pab-shell">
          <div className="pab-off-l">
            <p className="pab-eyebrow">Problems</p>
            <h2 className="pab-h2">{`Sound like your last six months with AI agents?`}</h2>
            <ol className="pab-problems">
              {problems.map((p, i) =>
                p === null ? (
                  <li key={i}>
                    {`"It narrates what it `}
                    <em>would</em>
                    {` do instead of acting. It loops and burns tokens."`}
                  </li>
                ) : (
                  <li key={i}>{p}</li>
                )
              )}
            </ol>
            <Cta label="Enroll in the Personal Agent Bootcamp" />
          </div>
        </div>
      </section>

      {/* ── 6. MISTAKES ── */}
      <section className="pab-sec">
        <SecId pos="tl">SEC.06/FAILURE-MODES</SecId>
        <span className="pab-crop pab-crop--br" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">Mistakes</p>
          <h2 className="pab-h2">{`The 3 mistakes people make building an agent alone`}</h2>
          <div className="pab-mistakes">
            {mistakes.map((m, i) => (
              <article key={m.title} className="pab-mistake">
                <span className="pab-mistake-n">ERR.0{i + 1}</span>
                <h3>{m.title}</h3>
                <p>{m.body}</p>
              </article>
            ))}
          </div>
          <Cta label="Enroll in the Personal Agent Bootcamp" />
        </div>
      </section>

      {/* ── 7. EVERYTHING INCLUDED ── */}
      <section className="pab-sec">
        <SecId pos="tr">SEC.07/MANIFEST ·· FULL</SecId>
        <span className="pab-ticks pab-ticks--r" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">Everything included</p>
          <h2 className="pab-h2">{`One loop, wired for your work, then sold.`}</h2>
          <p className="pab-p">{`The spine of the curriculum is one agent loop (Trigger, Act, Remember), wired for YOUR job. We teach the primitives, not the bots.`}</p>

          <h3 className="pab-sess-head">{`Session Outline`}</h3>
          <ol className="pab-sessions">
            {sessions.map((s, i) => (
              <li key={s.lead} className="pab-session">
                <span className="pab-session-n">S{i + 1}</span>
                <p>
                  <strong>{s.lead}</strong>
                  {s.body}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="pab-sess-head">{`Here's everything you will get access to as a member of this Bootcamp:`}</h3>
          <ul className="pab-includes">
            {includes.map((it) => (
              <li key={it.lead}>
                <strong>{it.lead}</strong>
                {it.body}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 8. BONUSES ── */}
      <section className="pab-sec">
        <SecId pos="bl">SEC.08/BONUS-STACK</SecId>
        <span className="pab-barcode pab-barcode--tl" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">Bonuses</p>
          <h2 className="pab-h2">{`Free bonuses included`}</h2>
          <ul className="pab-bonus">
            {bonuses.map((b) => (
              <li key={b.lead}>
                <strong>{b.lead}</strong>
                {b.body}
              </li>
            ))}
          </ul>
          <p className="pab-expires-head">{`EXPIRES WITH ENROLLMENT (gone when enrollment closes Sunday, June 21 at 11:59 PM)`}</p>
          <ul className="pab-bonus pab-bonus--expires">
            {expiringBonuses.map((b) => (
              <li key={b.lead}>
                <strong>{b.lead}</strong>
                {b.body}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── 9. SCHEDULE ── */}
      <section className="pab-sec">
        <SecId pos="tl">SEC.09/TIMETABLE</SecId>
        <span className="pab-crop pab-crop--tr" aria-hidden="true" />
        <div className="pab-shell">
          <div className="pab-off-r">
            <p className="pab-eyebrow">Schedule</p>
            <h2 className="pab-h2">{`The window: Monday, June 22 through Friday, July 3`}</h2>
            <p className="pab-p">{`6 live sessions across 2 weeks. Each session is an hour. Every replay posts within hours, so a missed session never breaks your build.`}</p>
            <Editorial>{`[NEED MITCH: session days/times]`}</Editorial>
            <ul className="pab-sched">
              {scheduleSessions.map((s, i) => (
                <li key={s}>
                  <span>S{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
            <p className="pab-p">{`This is a live build, with a cohort, on a clock. Enrollment closes Sunday, June 21 at 11:59 PM. After that, the doors are shut for this cohort.`}</p>
          </div>
        </div>
      </section>

      {/* ── 10. PRICING ── */}
      <section className="pab-sec" id="enroll-pending">
        <SecId pos="tr">SEC.10/PRICING ·· LOCKED</SecId>
        <span className="pab-ticks pab-ticks--l" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">Pricing</p>
          <h2 className="pab-h2">{`Add it up`}</h2>

          <div className="pab-price-panel">
            <div className="pab-price-panel-head">
              <span>VALUE MANIFEST</span>
              <span>PAB-2026-06</span>
            </div>
            <table className="pab-vtable">
              <thead>
                <tr>
                  <th>What you get</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {valueRows.map(([item, value]) => (
                  <tr key={item}>
                    <td>{item}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pab-price-total">
              <span className="pab-total-label">{`Total value:`}</span>
              <span className="pab-total-amt">{`~$7,800`}</span>
            </div>
          </div>

          <div className="pab-price-reveal">
            <span className="pab-eyebrow">{`Your price:`}</span>
            <span className="pab-price-amt">{`$800`}</span>
            <span className="pab-price-split">{`(or 2 payments of $400)`}</span>
          </div>

          <Cta label="Enroll in the Personal Agent Bootcamp: $800" />

          <p className="pab-guarantee-line">{`Backed by the week-one guarantee: install the agent for yourself, complete the first three sessions, and if you decide it's not for your business, full refund.`}</p>

          <div className="pab-offers">
            <article className="pab-offer">
              <span className="pab-offer-tag">Members</span>
              <h3>{`AI Writing Skool subscribers: 50% off`}</h3>
              <p>
                {`Members of the AI Writing Skool get the entire bootcamp for `}
                <strong>$400</strong>
                {` with code `}
                <strong>
                  <span className="pab-code">SPRINTER</span>
                </strong>
                {`. And as long as you stay a subscriber, you keep 50% off all future bootcamps, instant access to info products, weekly template, prompt, and .skill drops, weekly Monday hot seats, the weekly Tech Clinic with Mitch, and the daily Q&A channel.`}
              </p>
              <p>{`Not a member yet? The math is simple: the membership pays for itself on this one purchase.`}</p>
            </article>

            <article className="pab-offer pab-offer--vip">
              <span className="pab-offer-tag">Done-with-you</span>
              <h3>{`Want us in the trenches with you? VIP Mastermind: $2,500`}</h3>
              <p>{`Everything in the bootcamp, plus done-with-you:`}</p>
              <ul>
                <li>{`We design your agent's first real workflow with you, custom for your business and situation`}</li>
                <li>
                  <strong>{`Private VIP Slack channel`}</strong>
                  {` for the duration of the bootcamp: post your work, get asynchronous feedback and build reviews with direct access`}
                </li>
                <li>
                  <strong>{`Accountability kickoff call`}</strong>
                  {` before the bootcamp begins`}
                </li>
                <li>
                  <strong>{`Group consulting sessions`}</strong>
                  {` at the end of each week to workshop your agent, troubleshoot blockers, and get real-time strategy`}
                </li>
                <li>
                  <strong>{`Behind-the-scenes managed-sale breakdown:`}</strong>
                  {` a private walkthrough of how the live Wingman managed sale actually runs`}
                </li>
              </ul>
              <Editorial>{`[NEED MITCH: VIP seat count, if capped]`}</Editorial>
            </article>
          </div>
        </div>
      </section>

      {/* ── 11. LAST NUDGE ── */}
      <section className="pab-sec">
        <SecId pos="bl">SEC.11/FINAL-CALL</SecId>
        <div className="pab-shell">
          <div className="pab-off-l">
            <p className="pab-eyebrow">Last nudge</p>
            <h2 className="pab-nudge-h">{`Two weeks from now, you own an agent that does your work. And an offer that sells it.`}</h2>
            <p className="pab-p">{`By Day 1 it's alive and answering you. By the end of week one it's doing your actual work. By the end of week two you have a productized offer, an offer page, and Looms in front of real prospects.`}</p>
            <p className="pab-p">{`Enrollment closes Sunday, June 21 at 11:59 PM. The SOUL.md Templates and the Trend Jacking Agent Pack 2.0 expire with it. Miss the window and you miss this cohort.`}</p>
            <Cta label="Enroll in the Personal Agent Bootcamp: $800" />
          </div>
        </div>
      </section>

      {/* ── 12. FAQ ── */}
      <section className="pab-sec">
        <SecId pos="tl">SEC.12/FAQ ·· 15 ENTRIES</SecId>
        <span className="pab-crop pab-crop--tr" aria-hidden="true" />
        <div className="pab-shell">
          <p className="pab-eyebrow">FAQ</p>

          <div className="pab-faq-group">
            <p className="pab-faq-label">{`Logistics`}</p>
            <div className="pab-faq">
              {faqLogistics.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  {f.a}
                </details>
              ))}
            </div>
          </div>

          <div className="pab-faq-group">
            <p className="pab-faq-label">{`Will this work for me?`}</p>
            <div className="pab-faq">
              {faqFit.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  {f.a}
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. GUARANTEE ── */}
      <section className="pab-sec pab-guarantee">
        <div className="pab-shell">
          <div className="pab-guarantee-card">
            <span className="pab-seal">◈ Week-One Guarantee</span>
            <h2 className="pab-h2" style={{ marginTop: 22 }}>{`The Week-One Guarantee`}</h2>
            <p className="pab-p">{`Install the agent for yourself and complete the first three sessions. If you then decide this isn't for your business, email us and you get a full refund.`}</p>
            <p className="pab-p">{`That's the whole condition. We ask you to actually stand the agent up and sit through the first half of the camp because that's where you find out what it does for your work. If the answer is "not for my business," the $800 comes back to you.`}</p>
            <Cta label="Enroll in the Personal Agent Bootcamp: $800" />
            <p className="pab-note">{`Enrollment closes Sunday, June 21 at 11:59 PM.`}</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="pab-footer">
        <div className="pab-shell pab-footer-inner">
          <span>◈ PERSONAL AGENT BOOTCAMP</span>
          <a href="/">HEYMITCH.AI</a>
        </div>
      </footer>
    </div>
  );
}
