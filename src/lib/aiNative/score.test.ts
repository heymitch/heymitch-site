import { describe, test, expect } from 'vitest';
import { scoreQuiz } from './score';
import type { AnswerMap, QuizQuestion } from './types';

// ─── Synthetic question set (independent of the real questions.ts) ────────────
// 3 autonomy + 3 openness + 3 value + 1 gate. Option weights at known positions
// so expected centroids are exact arithmetic.

const CLIMB = [0.1, 0.4, 0.7, 0.95]; // o0..o3 for autonomy/openness
const VALUE = [0.12, 0.4, 0.6, 0.88]; // o0..o3 for Build↔Buy

function climbQ(id: string, axis: 'autonomy' | 'openness'): QuizQuestion {
  return {
    id,
    axis,
    prompt: id,
    options: CLIMB.map((w, i) => ({ id: `o${i}`, label: `${id}-o${i}`, weights: { [axis]: w } })),
  };
}
function valueQ(id: string): QuizQuestion {
  return {
    id,
    axis: 'value',
    prompt: id,
    options: VALUE.map((w, i) => ({ id: `o${i}`, label: `${id}-o${i}`, weights: { value: w } })),
  };
}
const GATE: QuizQuestion = {
  id: 'g1',
  axis: 'autonomy',
  isGate: true,
  prompt: 'gate',
  options: [
    { id: 'ok', label: 'I can point to a specific one', weights: {} },
    { id: 'drift', label: 'Not sure / cannot point to one', weights: {}, drift: true },
  ],
};

// Intent question: non-scoring. Each option carries a willingness tier, empty weights.
const INTENT: QuizQuestion = {
  id: 'intent',
  axis: 'autonomy', // ignored; intent never votes
  kind: 'intent',
  prompt: 'how important is AI to your business',
  options: [
    { id: 'crit', label: 'Critical and urgent', weights: {}, willingness: 'critical' },
    { id: 'build', label: 'Important, building toward it', weights: {}, willingness: 'building' },
    { id: 'cur', label: 'Curious, exploring', weights: {}, willingness: 'curious' },
    { id: 'none', label: 'Not a priority', weights: {}, willingness: 'none' },
  ],
};

const QS: QuizQuestion[] = [
  climbQ('a1', 'autonomy'), climbQ('a2', 'autonomy'), climbQ('a3', 'autonomy'),
  climbQ('y1', 'openness'), climbQ('y2', 'openness'), climbQ('y3', 'openness'),
  valueQ('v1'), valueQ('v2'), valueQ('v3'),
  GATE, INTENT,
];

/** Build an answer map by option index per axis (gate defaults to 'ok'). */
function answers(autIdx: number, openIdx: number, valIdx: number, gate: 'ok' | 'drift' = 'ok'): AnswerMap {
  return {
    a1: `o${autIdx}`, a2: `o${autIdx}`, a3: `o${autIdx}`,
    y1: `o${openIdx}`, y2: `o${openIdx}`, y3: `o${openIdx}`,
    v1: `o${valIdx}`, v2: `o${valIdx}`, v3: `o${valIdx}`,
    g1: gate,
  };
}

describe('scoreQuiz — centroid', () => {
  test('centroid is the mean of chosen option weights per axis', () => {
    const a: AnswerMap = {
      a1: 'o1', a2: 'o2', a3: 'o0', // 0.4, 0.7, 0.1 → mean 0.4
      y1: 'o3', y2: 'o3', y3: 'o3', // 0.95
      v1: 'o0', v2: 'o0', v3: 'o0', // 0.12
      g1: 'ok',
    };
    const r = scoreQuiz(a, QS);
    expect(r.centroid.autonomy).toBeCloseTo(0.4, 5);
    expect(r.centroid.openness).toBeCloseTo(0.95, 5);
    expect(r.centroid.value).toBeCloseTo(0.12, 5);
    expect(r.subScores).toEqual(r.centroid);
  });

  test('plots one dot per scoring question — the gate never plots', () => {
    const r = scoreQuiz(answers(2, 2, 2), QS);
    expect(r.dots).toHaveLength(9);
    expect(r.dots.some(d => d.questionId === 'g1')).toBe(false);
  });
});

describe('scoreQuiz — altitude excludes Z (the core design invariant)', () => {
  test('altitude = (autonomy + openness) / 2', () => {
    const r = scoreQuiz(answers(1, 3, 0), QS); // X=0.4, Y=0.95
    expect(r.altitude).toBeCloseTo((0.4 + 0.95) / 2, 5);
  });

  test('opposite Build↔Buy with identical X,Y yields identical altitude + level', () => {
    const buy = scoreQuiz(answers(3, 3, 0), QS); // value 0.12
    const build = scoreQuiz(answers(3, 3, 3), QS); // value 0.88
    expect(build.altitude).toBeCloseTo(buy.altitude, 5);
    expect(build.level).toBe(buy.level);
    // ...but the archetype differs because Z spreads you sideways
    expect(build.archetype).not.toBe(buy.archetype);
  });
});

describe('scoreQuiz — archetype (nearest named point)', () => {
  test('all-low autonomy & openness → Tinkerer at Spark level', () => {
    const r = scoreQuiz(answers(0, 0, 1), QS); // X,Y ~0.1
    expect(r.archetype).toBe('Tinkerer');
    expect(r.level).toBe('Spark');
  });

  test('high autonomy + low openness → Hermit (powerful, fragile)', () => {
    const r = scoreQuiz(answers(3, 0, 3), QS);
    expect(r.archetype).toBe('Hermit');
  });

  test('low autonomy + high openness → Scribe (all map, no engine)', () => {
    const r = scoreQuiz(answers(0, 3, 1), QS);
    expect(r.archetype).toBe('Scribe');
  });

  test('high X + high Y + Buy → Mogul; + Build → Sovereign', () => {
    expect(scoreQuiz(answers(3, 3, 0), QS).archetype).toBe('Mogul');
    expect(scoreQuiz(answers(3, 3, 3), QS).archetype).toBe('Sovereign');
  });

  test('apex everything → Wizard at Wizard level', () => {
    const r = scoreQuiz(answers(3, 3, 2), QS); // X,Y 0.95, value mixed ~0.6
    expect(r.archetype).toBe('Wizard');
    expect(r.level).toBe('Wizard');
  });

  test('archetypeDistance is 0 when centroid sits on a named point', () => {
    // Operator coord is (0.5,0.5,0.5); craft answers averaging exactly that.
    const a: AnswerMap = {
      a1: 'o1', a2: 'o2', a3: 'o1', // (0.4+0.7+0.4)/3 = 0.5
      y1: 'o1', y2: 'o2', y3: 'o1',
      v1: 'o1', v2: 'o2', v3: 'o1', // (0.4+0.6+0.4)/3 ≈ 0.4667
      g1: 'ok',
    };
    const r = scoreQuiz(a, QS);
    expect(r.archetype).toBe('Operator');
    expect(r.archetypeDistance).toBeLessThan(0.1);
  });
});

describe('scoreQuiz — ungameable signals', () => {
  test('drift gate tripped on a high-autonomy claim sets driftFlag + caveat', () => {
    const r = scoreQuiz(answers(3, 3, 2, 'drift'), QS);
    expect(r.driftFlag).toBe(true);
    expect(r.caveat).not.toBeNull();
  });

  test('drift not tripped (and not monoculture) → no flag, no caveat', () => {
    const r = scoreQuiz(answers(2, 2, 2, 'ok'), QS); // 0.7s: high but below top-tier
    expect(r.driftFlag).toBe(false);
    expect(r.caveat).toBeNull();
  });

  test('all-top-tier answers flag monoculture (aspirational/gamed)', () => {
    const r = scoreQuiz(answers(3, 3, 3), QS);
    expect(r.coherence).toBeGreaterThanOrEqual(0.9);
    expect(r.monocultureFlag).toBe(true);
    expect(r.caveat).not.toBeNull();
  });

  test('mixed answers do not flag monoculture', () => {
    const r = scoreQuiz(answers(1, 2, 1), QS);
    expect(r.monocultureFlag).toBe(false);
  });
});

describe('scoreQuiz — willingness is a non-scoring intent signal', () => {
  test('sets willingness from the chosen intent option', () => {
    const r = scoreQuiz({ ...answers(2, 2, 2), intent: 'crit' }, QS);
    expect(r.willingness).toBe('critical');
  });

  test('willingness is null when the intent question is unanswered', () => {
    const r = scoreQuiz(answers(2, 2, 2), QS);
    expect(r.willingness).toBeNull();
  });

  test('intent never plots a dot', () => {
    const r = scoreQuiz({ ...answers(2, 2, 2), intent: 'crit' }, QS);
    expect(r.dots).toHaveLength(9);
    expect(r.dots.some(d => d.questionId === 'intent')).toBe(false);
  });

  // The core requirement: intent rides alongside, it must not move the result.
  test('willingness does NOT change archetype, altitude, level, centroid, or dots', () => {
    const base = answers(3, 3, 2); // a fixed capability profile
    const noIntent = scoreQuiz(base, QS);
    const high = scoreQuiz({ ...base, intent: 'crit' }, QS);
    const low = scoreQuiz({ ...base, intent: 'none' }, QS);

    for (const r of [high, low]) {
      expect(r.archetype).toBe(noIntent.archetype);
      expect(r.altitude).toBeCloseTo(noIntent.altitude, 10);
      expect(r.level).toBe(noIntent.level);
      expect(r.centroid).toEqual(noIntent.centroid);
      expect(r.subScores).toEqual(noIntent.subScores);
      expect(r.dots).toEqual(noIntent.dots);
    }
    // ...but the willingness signal itself does flow through, distinctly.
    expect(high.willingness).toBe('critical');
    expect(low.willingness).toBe('none');
  });
});

describe('scoreQuiz — robustness', () => {
  test('clamps to [0,1] and tolerates a missing answer without throwing', () => {
    const partial: AnswerMap = { a1: 'o3', y1: 'o0', v1: 'o2', g1: 'ok' };
    const r = scoreQuiz(partial, QS);
    expect(r.centroid.autonomy).toBeGreaterThanOrEqual(0);
    expect(r.centroid.autonomy).toBeLessThanOrEqual(1);
    expect(r.archetype).toBeTruthy();
  });
});
