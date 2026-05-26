'use client';

import { useState } from 'react';
import { QUESTIONS } from '@/lib/aiNative/questions';
import { AXIS_COLOR, C } from './palette';
import type { AnswerMap } from '@/lib/aiNative/types';

export default function Quiz({ onComplete }: { onComplete: (answers: AnswerMap) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [leaving, setLeaving] = useState(false);

  const q = QUESTIONS[index];
  const total = QUESTIONS.length;
  const isTools = q.kind === 'tools';
  const selected = answers[q.id];
  const toolSel: string[] = Array.isArray(selected) ? selected : [];

  function advance(next: AnswerMap) {
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      if (index + 1 >= total) onComplete(next);
      else setIndex(index + 1);
    }, 240);
  }

  // Single-select: pick + auto-advance.
  function choose(optId: string) {
    const next = { ...answers, [q.id]: optId };
    setAnswers(next);
    advance(next);
  }

  // Tools multi-select: toggle, no auto-advance.
  function toggleTool(optId: string) {
    const has = toolSel.includes(optId);
    const nextTools = has ? toolSel.filter(t => t !== optId) : [...toolSel, optId];
    setAnswers({ ...answers, [q.id]: nextTools });
  }

  function continueTools() {
    advance({ ...answers, [q.id]: toolSel });
  }

  function back() {
    if (index === 0) return;
    setIndex(index - 1);
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px' }}>
      {/* Progress — segmented, colored by the axis each question measures */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {QUESTIONS.map((qq, i) => {
          const done = answers[qq.id] != null;
          const current = i === index;
          const color = qq.isGate || qq.kind === 'tools' || qq.kind === 'intent' ? C.faint : AXIS_COLOR[qq.axis];
          return (
            <div
              key={qq.id}
              style={{
                flex: 1, height: 4, borderRadius: 2,
                background: done || current ? color : C.border,
                opacity: done ? 1 : current ? 0.55 : 1,
                transition: 'background 0.25s, opacity 0.25s',
              }}
            />
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint }}>
          Question {index + 1} / {total}
        </span>
        {index > 0 && (
          <button onClick={back} style={{ fontSize: 12, color: C.faint, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
            ← Back
          </button>
        )}
      </div>

      <div
        key={q.id}
        style={{
          opacity: leaving ? 0 : 1,
          transform: leaving ? 'translateY(-6px)' : 'translateY(0)',
          transition: 'opacity 0.2s ease, transform 0.2s ease',
        }}
      >
        <h2 style={{ fontSize: 23, fontWeight: 800, color: C.dark, lineHeight: 1.25, margin: '0 0 8px', letterSpacing: '-0.01em' }}>
          {q.prompt}
        </h2>
        {q.helper && <p style={{ fontSize: 14, color: C.mid, margin: '0 0 22px', lineHeight: 1.55 }}>{q.helper}</p>}
        {!q.helper && <div style={{ height: 22 }} />}

        {isTools ? (
          /* ── Multi-select tool inventory ──────────────────────────────── */
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {q.options.map(opt => {
                const on = toolSel.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleTool(opt.id)}
                    style={{
                      padding: '10px 16px', borderRadius: 999,
                      border: `1.5px solid ${on ? C.dark : C.border}`,
                      background: on ? C.dark : C.surface,
                      color: on ? C.cream : C.dark,
                      fontSize: 14, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
                      transition: 'all 0.12s', display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    <span style={{ fontSize: 13 }}>{on ? '✓' : '+'}</span>
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14 }}>
              <button
                onClick={continueTools}
                style={{
                  padding: '13px 28px', background: C.orange, color: '#fff', border: 'none', borderRadius: 9,
                  fontSize: 16, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {index + 1 >= total ? 'See my result →' : 'Continue →'}
              </button>
              <span style={{ fontSize: 12, color: C.faint }}>
                {toolSel.length === 0 ? 'Pick all that apply, or none.' : `${toolSel.length} selected`}
              </span>
            </div>
          </>
        ) : (
          /* ── Single-select ────────────────────────────────────────────── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {q.options.map(opt => {
              const isSel = selected === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => choose(opt.id)}
                  style={{
                    textAlign: 'left', padding: '16px 18px', borderRadius: 10,
                    border: `1.5px solid ${isSel ? C.dark : C.border}`,
                    background: isSel ? C.cream : C.surface, color: C.dark,
                    fontSize: 15, lineHeight: 1.5, fontFamily: 'inherit', cursor: 'pointer',
                    transition: 'border-color 0.15s, background 0.15s',
                    display: 'flex', gap: 12, alignItems: 'flex-start',
                  }}
                  onMouseEnter={e => { if (!isSel) e.currentTarget.style.borderColor = C.faint; }}
                  onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = C.border; }}
                >
                  <span
                    style={{
                      flexShrink: 0, width: 22, height: 22, borderRadius: '50%', marginTop: 1,
                      border: `2px solid ${isSel ? C.dark : C.faint}`,
                      background: isSel ? C.dark : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    {isSel && <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.cream }} />}
                  </span>
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
