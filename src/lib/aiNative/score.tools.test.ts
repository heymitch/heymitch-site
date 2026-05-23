import { describe, test, expect } from 'vitest';
import { scoreQuiz } from './score';
import type { AnswerMap, QuizQuestion } from './types';

// Synthetic set: 2 autonomy questions + 1 multi-select tools inventory.
const CLIMB = [0.1, 0.4, 0.7, 0.95];

function autQ(id: string): QuizQuestion {
  return {
    id, axis: 'autonomy', prompt: id,
    options: CLIMB.map((w, i) => ({ id: `o${i}`, label: `${id}-o${i}`, weights: { autonomy: w } })),
  };
}

// Tier-tagged tools. Tier 1 = entry (chat), Tier 4 = agentic/sovereign.
const TOOLS_Q: QuizQuestion = {
  id: 'tools',
  axis: 'autonomy',
  kind: 'tools',
  prompt: 'Which have you actually used?',
  options: [
    { id: 'chatgpt', label: 'ChatGPT',    weights: {}, tier: 1 },
    { id: 'cursor',  label: 'Cursor',     weights: {}, tier: 2 },
    { id: 'n8n',     label: 'n8n',        weights: {}, tier: 3 },
    { id: 'cowork',  label: 'Claude Cowork', weights: {}, tier: 4 },
  ],
};

const QS: QuizQuestion[] = [autQ('a1'), autQ('a2'), TOOLS_Q];

function ans(autIdx: number, tools: string[]): AnswerMap {
  return { a1: `o${autIdx}`, a2: `o${autIdx}`, tools };
}

describe('tools inventory — capture + sophistication', () => {
  test('selected tools are surfaced on the result', () => {
    const r = scoreQuiz(ans(1, ['chatgpt', 'cursor']), QS);
    expect(r.selectedTools.sort()).toEqual(['chatgpt', 'cursor']);
  });

  test('toolSophistication is driven by the most advanced tool used', () => {
    const entry = scoreQuiz(ans(1, ['chatgpt']), QS);
    const agentic = scoreQuiz(ans(1, ['chatgpt', 'cowork']), QS);
    expect(agentic.toolSophistication).toBeGreaterThan(entry.toolSophistication!);
  });

  test('no tools question answered → toolSophistication null, selectedTools empty', () => {
    const r = scoreQuiz({ a1: 'o1', a2: 'o1' }, QS);
    expect(r.toolSophistication).toBeNull();
    expect(r.selectedTools).toEqual([]);
  });
});

describe('tools inventory — does NOT touch the centroid/archetype', () => {
  test('centroid.autonomy is the mean of the autonomy questions only', () => {
    const r = scoreQuiz(ans(2, ['chatgpt', 'cowork']), QS); // autonomy 0.7 each
    expect(r.centroid.autonomy).toBeCloseTo(0.7, 5);
  });

  test('the tools question never plots a dot', () => {
    const r = scoreQuiz(ans(2, ['cowork']), QS);
    expect(r.dots.some(d => d.questionId === 'tools')).toBe(false);
  });
});

describe('tools inventory — light altitude nudge', () => {
  test('same climb answers, more advanced tools → higher altitude (but small)', () => {
    const basic = scoreQuiz(ans(2, ['chatgpt']), QS);
    const advanced = scoreQuiz(ans(2, ['cowork', 'n8n']), QS);
    expect(advanced.altitude).toBeGreaterThan(basic.altitude);
    expect(Math.abs(advanced.altitude - basic.altitude)).toBeLessThanOrEqual(0.15); // light
  });

  test('archetype is unchanged by tools (behavior decides type)', () => {
    const a = scoreQuiz(ans(3, ['chatgpt']), QS).archetype;
    const b = scoreQuiz(ans(3, ['cowork', 'n8n', 'cursor']), QS).archetype;
    expect(a).toBe(b);
  });
});

describe('tools inventory — ungameable cross-check', () => {
  // a1=o3 (0.95), a2=o2 (0.7) → autonomy ~0.825 (high) but not monoculture (coherence 0.5),
  // so the tool cross-check is isolated from the monoculture caveat.
  test('high autonomy claim + only entry tools trips a caveat', () => {
    const r = scoreQuiz({ a1: 'o3', a2: 'o2', tools: ['chatgpt'] }, QS);
    expect(r.caveat).not.toBeNull();
  });

  test('high autonomy claim backed by advanced tools → no tool caveat', () => {
    const r = scoreQuiz({ a1: 'o3', a2: 'o2', tools: ['cowork', 'n8n'] }, QS);
    expect(r.caveat).toBeNull();
  });
});
