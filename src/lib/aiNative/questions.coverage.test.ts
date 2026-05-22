// Integration test: the REAL question set must make all 8 archetypes reachable
// and conform to the ungameable / composition rules. Guards against weight drift.

import { describe, test, expect } from 'vitest';
import { QUESTIONS } from './questions';
import { scoreQuiz } from './score';
import { ARCHETYPES } from './model';
import type { AnswerMap, ArchetypeName } from './types';

// q1-q3 autonomy · q4-q6 openness · q7-q9 value · q10 gate.
// Option letters: a/b/c/d. Climb: 0.12/0.40/0.68/0.92. Value: 0.12/0.38/0.62/0.88.
function ans(
  aut: [string, string, string],
  opn: [string, string, string],
  val: [string, string, string],
  gate = 'a',
): AnswerMap {
  return {
    q1: aut[0], q2: aut[1], q3: aut[2],
    q4: opn[0], q5: opn[1], q6: opn[2],
    q7: val[0], q8: val[1], q9: val[2],
    q10: gate,
  };
}

describe('question set — composition', () => {
  test('exactly 3 autonomy + 3 openness + 3 value + 1 gate = 10', () => {
    expect(QUESTIONS).toHaveLength(10);
    const byAxis = (a: string) => QUESTIONS.filter(q => !q.isGate && q.axis === a).length;
    expect(byAxis('autonomy')).toBe(3);
    expect(byAxis('openness')).toBe(3);
    expect(byAxis('value')).toBe(3);
    expect(QUESTIONS.filter(q => q.isGate)).toHaveLength(1);
  });

  test('every scoring option carries its primary-axis weight; gate has exactly one drift', () => {
    for (const q of QUESTIONS) {
      if (q.isGate) {
        expect(q.options.filter(o => o.drift)).toHaveLength(1);
        continue;
      }
      expect(q.options.length).toBeGreaterThanOrEqual(3);
      for (const o of q.options) {
        expect(typeof o.weights[q.axis]).toBe('number');
      }
    }
  });
});

describe('question set — all 8 archetypes are reachable with honest answers', () => {
  const cases: Record<ArchetypeName, AnswerMap> = {
    Tinkerer:  ans(['a', 'a', 'b'], ['a', 'a', 'b'], ['a', 'b', 'c']),
    Operator:  ans(['b', 'b', 'c'], ['b', 'b', 'c'], ['b', 'b', 'd']),
    Builder:   ans(['b', 'b', 'c'], ['c', 'c', 'c'], ['d', 'd', 'd']),
    Hermit:    ans(['d', 'd', 'd'], ['a', 'a', 'a'], ['d', 'd', 'c']),
    Scribe:    ans(['a', 'a', 'a'], ['d', 'd', 'd'], ['a', 'd', 'c']),
    Mogul:     ans(['d', 'd', 'd'], ['d', 'd', 'd'], ['a', 'a', 'a']),
    Sovereign: ans(['d', 'd', 'd'], ['d', 'd', 'd'], ['d', 'd', 'd']),
    Wizard:    ans(['d', 'd', 'd'], ['d', 'd', 'd'], ['a', 'd', 'c']),
  };

  for (const a of ARCHETYPES) {
    test(`${a.name} is reachable`, () => {
      expect(scoreQuiz(cases[a.name], QUESTIONS).archetype).toBe(a.name);
    });
  }

  test('every archetype is the winner for at least one case (full constellation covered)', () => {
    const reached = new Set(Object.values(cases).map(c => scoreQuiz(c, QUESTIONS).archetype));
    expect(reached.size).toBe(8);
  });
});

describe('question set — Z never changes altitude (the design invariant, on real questions)', () => {
  test('all-Buy vs all-Build at the same X,Y give equal altitude', () => {
    const buy = scoreQuiz(ans(['d', 'd', 'd'], ['d', 'd', 'd'], ['a', 'a', 'a']), QUESTIONS);
    const build = scoreQuiz(ans(['d', 'd', 'd'], ['d', 'd', 'd'], ['d', 'd', 'd']), QUESTIONS);
    expect(build.altitude).toBeCloseTo(buy.altitude, 5);
    expect(build.archetype).not.toBe(buy.archetype); // Mogul vs Sovereign
  });
});
