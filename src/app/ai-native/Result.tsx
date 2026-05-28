'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { C, AXIS_COLOR } from './palette';
import { ARCHETYPES, AXIS_META } from '@/lib/aiNative/model';
import { RECOMMENDATIONS } from '@/lib/aiNative/recommendations';
import { AIWS_NAME, AIWS_PRICE, AIWS_URL, AIWS_PITCH } from '@/lib/aiNative/links';
import type { ScoreResult } from '@/lib/aiNative/types';

// Kit "Clare form" — capture target. Subscriber enrichment (tags/fields/sequence)
// is done server-side by the ai-native-kit-sync edge function, so this POST is
// best-effort: if it fails, the edge function still creates the subscriber by email.
const KIT_FORM_ID = '9488687';
function kitSubscribe(email: string): void {
  void fetch(`https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email_address: email }),
  }).catch(() => { /* best-effort; edge function backstops */ });
}

// Plot3D is WebGL — never render it server-side.
const Plot3D = dynamic(() => import('./Plot3D'), {
  ssr: false,
  loading: () => (
    <div style={{ height: 'clamp(320px, 60vh, 520px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.orange, opacity: 0.6, fontSize: 13 }}>
      Loading your plot…
    </div>
  ),
});

interface ResultProps {
  result: ScoreResult;
  percentile: number | null;
  submissionId: string | null;
  sessionId: string | null;
  onRetake: () => void;
}

const pct = (v: number) => Math.round(v * 100);

export default function Result({ result, percentile, submissionId, sessionId, onRetake }: ResultProps) {
  const arch = ARCHETYPES.find(a => a.name === result.archetype)!;
  const reco = RECOMMENDATIONS[result.archetype];

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '8px 20px 64px' }}>
      {/* Eyebrow */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>
        Your result
      </div>

      {/* The shareable claim */}
      <h1 style={{ fontSize: 'clamp(40px, 9vw, 64px)', fontWeight: 800, color: C.dark, lineHeight: 1, letterSpacing: '-0.03em', margin: '0 0 12px' }}>
        {arch.name}
      </h1>

      {/* Level + altitude headline */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, flexWrap: 'wrap', marginBottom: 14 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color: C.orange }}>
          {result.level}-tier
        </span>
        <span style={{ fontSize: 13, color: C.mid }}>
          AI-native altitude {pct(result.altitude)}/100
        </span>
      </div>

      {/* Tagline */}
      <p style={{ fontSize: 18, fontStyle: 'italic', color: C.mid, lineHeight: 1.5, margin: '0 0 8px' }}>
        {arch.tagline}
      </p>
      <p style={{ fontSize: 13, color: C.faint, margin: '0 0 28px' }}>
        Here is where your answers actually landed.
      </p>

      {/* ── The 3D plot — the differentiator ─────────────────────────────── */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16, padding: 8, marginBottom: 10 }}>
        <Plot3D dots={result.dots} centroid={result.centroid} archetype={result.archetype} />
      </div>
      <p style={{ fontSize: 12, color: C.faint, textAlign: 'center', margin: '0 0 32px' }}>
        Drag to rotate. Each dot is one of your answers; the glowing sphere is you.
        Two axes are a <strong style={{ color: C.mid }}>climb</strong> (higher = more AI-native).
        One is a <strong style={{ color: C.mid }}>trade-off</strong> — no wrong side.
      </p>

      {/* ── Sub-scores ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, marginBottom: 8 }}>
        {/* Climb axes: filled bars */}
        {(['autonomy', 'openness'] as const).map(axis => {
          const meta = AXIS_META[axis];
          const v = result.subScores[axis];
          return (
            <div key={axis}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{meta.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: AXIS_COLOR[axis], textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {meta.sublabel}
                </span>
              </div>
              <div style={{ height: 10, background: C.creamDk, borderRadius: 5, overflow: 'hidden' }}>
                <div style={{ width: `${pct(v)}%`, height: '100%', background: AXIS_COLOR[axis], borderRadius: 5, transition: 'width 0.8s ease' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: C.faint }}>{meta.lowLabel}</span>
                <span style={{ fontSize: 11, color: C.faint }}>{meta.highLabel}</span>
              </div>
            </div>
          );
        })}

        {/* Value axis: a position marker on a track — trade-off, not a climb */}
        {(() => {
          const meta = AXIS_META.value;
          const v = result.subScores.value;
          return (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{meta.name}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: AXIS_COLOR.value, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {meta.sublabel}
                </span>
              </div>
              <div style={{ position: 'relative', height: 10, background: `linear-gradient(90deg, ${C.creamDk}, ${C.green}30)`, borderRadius: 5 }}>
                <div style={{
                  position: 'absolute', top: '50%', left: `${pct(v)}%`,
                  width: 16, height: 16, borderRadius: '50%', background: AXIS_COLOR.value,
                  border: `2px solid ${C.surface}`, transform: 'translate(-50%, -50%)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.2)', transition: 'left 0.8s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ fontSize: 11, color: C.faint }}>{meta.lowLabel}</span>
                <span style={{ fontSize: 11, color: C.faint }}>{meta.highLabel}</span>
              </div>
            </div>
          );
        })()}
      </div>
      <p style={{ fontSize: 12, color: C.faint, lineHeight: 1.6, margin: '14px 0 28px' }}>
        Autonomy and Openness are the climb. That&rsquo;s your altitude. Build↔Buy isn&rsquo;t a level, it&rsquo;s a
        values call: the Mogul who runs the best off-the-shelf and the Sovereign who owns the engine sit at
        the exact same height, pointed opposite ways.
      </p>

      {/* ── Caveat (only if tripped) ──────────────────────────────────────── */}
      {result.caveat && (
        <div style={{ borderLeft: `3px solid ${C.orange}`, background: '#fff7f0', padding: '14px 16px', borderRadius: '0 8px 8px 0', marginBottom: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
            One honest note
          </div>
          <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: 0 }}>{result.caveat}</p>
        </div>
      )}

      {/* ── The one climb move ────────────────────────────────────────────── */}
      <div style={{ background: C.dark, borderRadius: 14, padding: '22px 24px', marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: C.orange, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          Your next climb move
        </div>
        <p style={{ fontSize: 17, color: C.cream, lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
          {arch.climbMove}
        </p>
      </div>

      {/* ── What to learn next (preview; full why + first step in the PDF) ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, marginBottom: 12 }}>
          What to learn next
        </div>
        <p style={{ fontSize: 16, fontWeight: 700, color: C.dark, lineHeight: 1.35, margin: '0 0 16px' }}>
          {reco.headline}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {([['Harness', reco.harness.name], ['Tool', reco.tool.name], ['Connector / skill', reco.connectorOrSkill.name]] as const).map(([kind, name]) => {
            const owned = (result.selectedTools ?? []).some(id => name.toLowerCase().includes(id.replace(/-/g, ' ')) || id.replace(/-/g, ' ').includes(name.toLowerCase()));
            return (
              <div key={kind} style={{ display: 'flex', alignItems: 'baseline', gap: 10, padding: '10px 14px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: C.faint, width: 116, flexShrink: 0 }}>{kind}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: C.dark }}>{name}</span>
                {owned && <span style={{ fontSize: 11, color: C.green, marginLeft: 'auto' }}>you use this</span>}
              </div>
            );
          })}
        </div>
        <p style={{ fontSize: 12, color: C.faint, margin: '12px 0 0', lineHeight: 1.5 }}>
          Why each one, your first step, and the full 5-page playbook are in your report below.
        </p>
      </div>

      {/* ── Leaderboard percentile ────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        {percentile != null ? (
          <p style={{ fontSize: 15, color: C.mid, margin: 0 }}>
            You&rsquo;re more AI-native than <strong style={{ color: C.orange, fontSize: 20 }}>{percentile}%</strong> of people who&rsquo;ve taken this.
          </p>
        ) : (
          <p style={{ fontSize: 14, color: C.faint, margin: 0 }}>
            You&rsquo;re among the first to take this — your percentile unlocks as more people plot in.
          </p>
        )}
      </div>

      {/* ── Email gate → PDF + AI Dispatch ────────────────────────────────── */}
      <OptInBlock submissionId={submissionId} sessionId={sessionId} result={result} />

      {/* ── AI Writing Skool — the end CTA ────────────────────────────────── */}
      <a href={AIWS_URL} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
        <div style={{ background: C.dark, borderRadius: 14, padding: '22px 24px' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: C.cream, marginBottom: 8 }}>
            Climb faster inside {AIWS_NAME}
          </div>
          <p style={{ fontSize: 14, color: C.cream, opacity: 0.9, lineHeight: 1.55, margin: '0 0 14px' }}>
            {AIWS_PITCH} {AIWS_PRICE}.
          </p>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.orange }}>Join {AIWS_NAME} &rarr;</span>
        </div>
      </a>

      {/* ── Share + retake ────────────────────────────────────────────────── */}
      <ShareRow archetype={result.archetype} />
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button onClick={onRetake} style={{ fontSize: 13, color: C.faint, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline' }}>
          Retake the quiz
        </button>
      </div>
    </div>
  );
}

// ─── Opt-in: email-gated personalized report ──────────────────────────────────

function OptInBlock({ submissionId, sessionId, result }: { submissionId: string | null; sessionId: string | null; result: ScoreResult }) {
  const archetype = result.archetype;
  const [email, setEmail] = useState('');
  const [optInDispatch, setOptInDispatch] = useState(true);
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes('@')) { setState('error'); return; }
    setState('sending');
    kitSubscribe(email); // best-effort; edge function backstops
    try {
      const r = await fetch('/api/ai-native/optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionId, sessionId, email, optInDispatch }),
      });
      if (r.ok) {
        setState('done');
      } else {
        setState('error');
      }
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <div style={{ background: C.cream, border: `1px solid ${C.creamDk}`, borderRadius: 14, padding: '26px 24px', marginBottom: 28, textAlign: 'center' }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.dark, marginBottom: 8 }}>You&rsquo;re in. ✓</div>
        <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: '0 0 4px' }}>
          Check your inbox — your full {archetype} report is on its way. Open it, then watch for the
          follow-ups that show you how to climb.
        </p>
      </div>
    );
  }

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px', marginBottom: 28 }}>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: C.dark, margin: '0 0 6px' }}>
        Get your full {archetype} report
      </h3>
      <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.55, margin: '0 0 18px' }}>
        A personalized PDF — your 3D plot, your three scores, the one move that climbs you a level, and the
        trade-off you&rsquo;ve chosen — sent straight to your inbox, plus the follow-ups that show you how to make the climb.
      </p>

      <form onSubmit={submit}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
            placeholder="you@email.com"
            style={{
              flex: '1 1 220px', padding: '12px 14px', fontSize: 15, fontFamily: 'inherit',
              border: `1.5px solid ${state === 'error' ? '#c92a2a' : C.border}`, borderRadius: 8, outline: 'none', color: C.dark,
            }}
          />
          <button
            type="submit"
            disabled={state === 'sending' || !submissionId}
            style={{
              padding: '12px 22px', background: C.orange, color: '#fff', border: 'none', borderRadius: 8,
              fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
              opacity: (state === 'sending' || !submissionId) ? 0.7 : 1,
            }}
          >
            {!submissionId ? 'Saving your result…' : state === 'sending' ? 'Sending…' : 'Send my report →'}
          </button>
        </div>
        {state === 'error' && (
          <div style={{ fontSize: 12, color: '#c92a2a', marginTop: 8 }}>Enter a valid email and try again.</div>
        )}

        <label style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginTop: 14, cursor: 'pointer' }}>
          <input type="checkbox" checked={optInDispatch} onChange={e => setOptInDispatch(e.target.checked)} style={{ marginTop: 3 }} />
          <span style={{ fontSize: 13, color: C.mid, lineHeight: 1.5 }}>
            Add me to AI Dispatch — the newsletter on building AI that runs without you.
          </span>
        </label>
      </form>

      {/* Consent contract — verbatim from the funnel template. Do not reword. */}
      <p style={{ fontSize: 11, color: C.faint, lineHeight: 1.6, marginTop: 16, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
        <strong style={{ color: C.mid }}>What we&rsquo;ll do with your information:</strong> We use it to send you your
        report and the newsletter — nothing else. We will <strong style={{ color: C.mid }}>never</strong> publish, quote, or
        attribute your quiz answers without your explicit, written permission.
      </p>
    </div>
  );
}

// ─── Share row ─────────────────────────────────────────────────────────────────

function ShareRow({ archetype }: { archetype: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = typeof window !== 'undefined' ? window.location.href.split('?')[0] : '';
    const text = `I'm a ${archetype} on the AI-Native quiz. Find your archetype: ${url}`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  }

  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <button
        onClick={copyLink}
        style={{
          padding: '10px 18px', background: copied ? C.pass : C.surface, color: copied ? '#fff' : C.dark,
          border: `1.5px solid ${copied ? C.pass : C.border}`, borderRadius: 8, fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        {copied ? '✓ Copied' : `Share: "I'm a ${archetype}"`}
      </button>
      <span style={{ fontSize: 12, color: C.faint }}>or screenshot your plot ↑</span>
    </div>
  );
}
