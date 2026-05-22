// AI-Native Quiz — pure scoring core.
// No DOM, no fetch, no globals. Inputs in, ScoreResult out. Unit-tested (score.test.ts).
// Mirrors the ai-hunter-engine.ts separation: all grade logic lives here, never in the view.

import type { AnswerDot, AnswerMap, Axis, QuizOption, QuizQuestion, ScoreResult, Vec3 } from './types';
import { AXES } from './types';
import { ARCHETYPES, bandForAltitude, dist2 } from './model';

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

/** A climb-axis answer at or above this weight counts as "top tier". */
const TOP_TIER = 0.75;

/** Score a completed (or partial) answer set against a question set. Pure. */
export function scoreQuiz(answers: AnswerMap, questions: QuizQuestion[]): ScoreResult {
  const sums: Record<Axis, number> = { autonomy: 0, openness: 0, value: 0 };
  const counts: Record<Axis, number> = { autonomy: 0, openness: 0, value: 0 };
  const scoringAnswers: { q: QuizQuestion; opt: QuizOption }[] = [];
  let driftFlag = false;

  for (const q of questions) {
    const optId = answers[q.id];
    if (optId == null) continue;
    const opt = q.options.find(o => o.id === optId);
    if (!opt) continue;

    if (q.isGate) {
      if (opt.drift) driftFlag = true;
      continue; // the gate never votes for a tier and never plots a dot
    }

    scoringAnswers.push({ q, opt });
    for (const axis of AXES) {
      const w = opt.weights[axis];
      if (typeof w === 'number') {
        sums[axis] += w;
        counts[axis] += 1;
      }
    }
  }

  // Centroid = mean of contributions per axis (default 0.5 if an axis got none).
  const centroid: Vec3 = {
    autonomy: counts.autonomy ? clamp01(sums.autonomy / counts.autonomy) : 0.5,
    openness: counts.openness ? clamp01(sums.openness / counts.openness) : 0.5,
    value: counts.value ? clamp01(sums.value / counts.value) : 0.5,
  };

  // One dot per scoring answer: it sits at the user's location but is displaced
  // along whichever axis its question measured — so the cloud spreads meaningfully.
  const dots: AnswerDot[] = scoringAnswers.map(({ q, opt }) => {
    const point: Vec3 = { ...centroid };
    const w = opt.weights[q.axis];
    if (typeof w === 'number') point[q.axis] = clamp01(w);
    return { questionId: q.id, axis: q.axis, point };
  });

  // Altitude (the headline "how AI-native") uses the two CLIMB axes only.
  // Z (Build↔Buy) is a values trade-off and never moves you up or down.
  const altitude = (centroid.autonomy + centroid.openness) / 2;
  const level = bandForAltitude(altitude).name;

  // Archetype = nearest named constellation point (Euclidean in 3D).
  let best = ARCHETYPES[0];
  let bestD2 = Infinity;
  for (const a of ARCHETYPES) {
    const d2 = dist2(centroid, a.coord);
    if (d2 < bestD2) { bestD2 = d2; best = a; }
  }
  const archetypeDistance = Math.sqrt(bestD2);

  // Ungameable signals. Coherence is measured on the CLIMB axes only — the value
  // axis has no "top", so it can't make you look gamed.
  const climbAnswers = scoringAnswers.filter(s => s.q.axis === 'autonomy' || s.q.axis === 'openness');
  const topCount = climbAnswers.filter(s => {
    const w = s.opt.weights[s.q.axis];
    return typeof w === 'number' && w >= TOP_TIER;
  }).length;
  const coherence = climbAnswers.length ? topCount / climbAnswers.length : 0;
  const monocultureFlag = coherence >= 0.9;

  // Respectful, specific caveats — a flag, never a punishment. [NEEDS_VOICE_REVIEW]
  let caveat: string | null = null;
  if (driftFlag && centroid.autonomy >= 0.6) {
    caveat =
      'You scored high on Autonomy but could not point to a specific thing that ' +
      'runs without you. That gap is the most common one — your score here may be ' +
      'aspirational. The fastest win: get one workflow to run end-to-end, hands-off, once.';
  } else if (monocultureFlag) {
    caveat =
      'You rated yourself at the top on every climb question. That happens, but it is ' +
      'also what aspirational answering looks like. Gut-check each one against a concrete, ' +
      'repeatable instance you could show someone.';
  } else if (driftFlag) {
    caveat =
      'Heads up: you flagged that you could not point to a specific hands-off instance. ' +
      'Worth confirming your setup is as real as it feels.';
  }

  return {
    centroid,
    dots,
    subScores: centroid,
    altitude,
    level,
    archetype: best.name,
    archetypeDistance,
    coherence,
    monocultureFlag,
    driftFlag,
    caveat,
  };
}
