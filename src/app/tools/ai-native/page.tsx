'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Quiz from './Quiz';
import Result from './Result';
import { C, AXIS_COLOR } from './palette';
import { AXIS_META } from '@/lib/aiNative/model';
import { scoreQuiz } from '@/lib/aiNative/score';
import { QUESTIONS } from '@/lib/aiNative/questions';
import type { AnswerMap, ScoreResult } from '@/lib/aiNative/types';

type Stage = 'intro' | 'quiz' | 'result';

export default function AINativeQuizPage() {
  const [stage, setStage] = useState<Stage>('intro');
  const [result, setResult] = useState<ScoreResult | null>(null);
  const [percentile, setPercentile] = useState<number | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const sessionId = useRef<string>('');

  useEffect(() => {
    if (!sessionId.current) {
      sessionId.current =
        typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `s_${Date.now()}_${Math.random()}`;
    }
  }, []);

  function handleComplete(answers: AnswerMap) {
    const computed = scoreQuiz(answers, QUESTIONS);
    setResult(computed);
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Persist + fetch percentile (non-blocking; result renders regardless).
    fetch('/api/ai-native/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionId.current, answers, computed, referrer: document.referrer || undefined }),
    })
      .then(r => r.json())
      .then(d => {
        if (d?.id) setSubmissionId(d.id);
        if (typeof d?.percentile === 'number') setPercentile(d.percentile);
        if (d?.sessionId) sessionId.current = d.sessionId;
      })
      .catch(() => { /* storage is best-effort; the on-page result still shows */ });
  }

  function retake() {
    setResult(null);
    setPercentile(null);
    setSubmissionId(null);
    setStage('intro');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Space Grotesk', system-ui, sans-serif", color: C.dark, display: 'flex', flexDirection: 'column' }}>
      {/* ── Nav (site chrome) ──────────────────────────────────────────────── */}
      <nav style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 19, color: C.dark, textDecoration: 'none' }}>
          hey<span style={{ color: C.orange }}>mitch</span>
        </Link>
        <span style={{ color: C.border }}>·</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.mid }}>AI-Native Quiz</span>
        <a href="https://aidispatch.substack.com" style={{ marginLeft: 'auto', fontSize: 12, color: C.orange, textDecoration: 'none', fontWeight: 600 }}>
          AI Dispatch →
        </a>
      </nav>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <main style={{ flex: 1, padding: '48px 0' }}>
        {stage === 'intro' && <Intro onStart={() => setStage('quiz')} />}
        {stage === 'quiz' && <Quiz onComplete={handleComplete} />}
        {stage === 'result' && result && (
          <Result
            result={result}
            percentile={percentile}
            submissionId={submissionId}
            sessionId={sessionId.current}
            onRetake={retake}
          />
        )}
      </main>

      {/* ── Footer (site chrome) ───────────────────────────────────────────── */}
      <footer style={{ background: C.dark, color: C.cream, padding: '28px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
          Built live in the Claude Code Marketing Bootcamp.
        </div>
        <div style={{ fontSize: 12, opacity: 0.6 }}>
          <Link href="/" style={{ color: C.cream }}>heymitch.ai</Link>
          {'  ·  '}
          <a href="https://aidispatch.substack.com" style={{ color: C.cream }}>AI Dispatch</a>
        </div>
      </footer>
    </div>
  );
}

// ─── Intro ─────────────────────────────────────────────────────────────────────

function Intro({ onStart }: { onStart: () => void }) {
  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.faint, marginBottom: 16 }}>
        Free · 12 questions · ~2 minutes
      </div>
      <h1 style={{ fontSize: 'clamp(36px, 8vw, 56px)', fontWeight: 800, color: C.dark, lineHeight: 1.05, letterSpacing: '-0.03em', margin: '0 0 18px' }}>
        How AI-native<br />are you, really?
      </h1>
      <p style={{ fontSize: 17, color: C.mid, lineHeight: 1.6, margin: '0 auto 32px', maxWidth: 520 }}>
        Not how much you <em>want</em> to use AI — how much actually runs in your world today. Answer 12
        honest questions and watch your answers plot themselves in 3D. Then meet your archetype.
      </p>

      <button
        onClick={onStart}
        style={{
          padding: '15px 36px', background: C.orange, color: '#fff', border: 'none', borderRadius: 10,
          fontSize: 17, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.01em',
          boxShadow: '0 4px 14px rgba(232,104,42,0.3)',
        }}
      >
        Start the quiz →
      </button>

      {/* The three axes — teaser of the teaching layer */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 48 }}>
        {(['autonomy', 'openness', 'value'] as const).map(axis => {
          const m = AXIS_META[axis];
          return (
            <div key={axis} style={{ flex: '1 1 170px', maxWidth: 200, background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 14px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: AXIS_COLOR[axis] }} />
                <span style={{ fontSize: 14, fontWeight: 700, color: C.dark }}>{m.name}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 600, color: AXIS_COLOR[axis], textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                {m.sublabel}
              </div>
              <div style={{ fontSize: 12, color: C.faint, lineHeight: 1.45 }}>
                {m.lowLabel} → {m.highLabel}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 12, color: C.faint, marginTop: 20 }}>
        No account. No wrong answers. Your result is yours.
      </p>
    </div>
  );
}
