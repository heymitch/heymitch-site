'use client';

import { useState } from 'react';
import { QUESTIONS } from '@/lib/aiNative/questions';
import { AXIS_COLOR } from './palette';
import { C } from './palette';
import type { AnswerMap } from '@/lib/aiNative/types';

export default function Quiz({ onComplete }: { onComplete: (answers: AnswerMap) => void }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});
  const [leaving, setLeaving] = useState(false);

  const q = QUESTIONS[index];
  const total = QUESTIONS.length;
  const selected = answers[q.id];

  function choose(optId: string) {
    const next = { ...answers, [q.id]: optId };
    setAnswers(next);
    // Snappy auto-advance — personality-quiz feel.
    setLeaving(true);
    window.setTimeout(() => {
      setLeaving(false);
      if (index + 1 >= total) {
        onComplete(next);
      } else {
        setIndex(index + 1);
      }
    }, 240);
  }

  function back() {
    if (index === 0) return;
    setIndex(index - 1);
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px' }}>
      {/* Progress — segmented, colored by the axis each question measures (no axis labels: avoids priming) */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28 }}>
        {QUESTIONS.map((qq, i) => {
          const done = answers[qq.id] != null;
          const current = i === index;
          const color = qq.isGate ? C.faint : AXIS_COLOR[qq.axis];
          return (
            <div
              key={qq.id}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
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
          <button
            onClick={back}
            style={{ fontSize: 12, color: C.faint, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            ← Back
          </button>
        )}
      </div>

      {/* Question card — replaced on advance so the enter animation re-fires */}
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
        {q.helper && (
          <p style={{ fontSize: 14, color: C.mid, margin: '0 0 22px', lineHeight: 1.55 }}>{q.helper}</p>
        )}
        {!q.helper && <div style={{ height: 22 }} />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {q.options.map(opt => {
            const isSel = selected === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => choose(opt.id)}
                style={{
                  textAlign: 'left',
                  padding: '16px 18px',
                  borderRadius: 10,
                  border: `1.5px solid ${isSel ? C.dark : C.border}`,
                  background: isSel ? C.cream : C.surface,
                  color: C.dark,
                  fontSize: 15,
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s, background 0.15s, transform 0.05s',
                  display: 'flex',
                  gap: 12,
                  alignItems: 'flex-start',
                }}
                onMouseEnter={e => { if (!isSel) e.currentTarget.style.borderColor = C.faint; }}
                onMouseLeave={e => { if (!isSel) e.currentTarget.style.borderColor = C.border; }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: 22, height: 22, borderRadius: '50%', marginTop: 1,
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
      </div>
    </div>
  );
}
