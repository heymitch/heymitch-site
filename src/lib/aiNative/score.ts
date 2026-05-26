// AI-Native Quiz — pure scoring core.
// No DOM, no fetch, no globals. Inputs in, ScoreResult out. Unit-tested (score.test.ts).
// Mirrors the ai-hunter-engine.ts separation: all grade logic lives here, never in the view.

import type { AnswerDot, AnswerMap, Axis, QuizOption, QuizQuestion, ScoreResult, Vec3, WillingnessLevel } from './types';
import { AXES } from './types';
import { ARCHETYPES, bandForAltitude, dist2 } from './model';

const clamp01 = (n: number): number => Math.max(0, Math.min(1, n));

/** A climb-axis answer at or above this weight counts as "top tier". */
const TOP_TIER = 0.75;

/** Sophistication value per tool tier. */
const TIER_VALUE: Record<number, number> = { 1: 0.2, 2: 0.45, 3: 0.7, 4: 0.92 };

/** Toolset sophistication: most advanced tool used + a small breadth bonus. */
function computeToolSophistication(chosen: QuizOption[]): number {
  if (chosen.length === 0) return 0.1; // answered, but uses ~nothing
  const maxTier = Math.max(...chosen.map(o => TIER_VALUE[o.tier ?? 1] ?? 0.2));
  const breadthBonus = Math.min(0.08, 0.02 * (chosen.length - 1));
  return clamp01(maxTier + breadthBonus);
}

/** Score a completed (or partial) answer set against a question set. Pure. */
export function scoreQuiz(answers: AnswerMap, questions: QuizQuestion[]): ScoreResult {
  const sums: Record<Axis, number> = { autonomy: 0, openness: 0, value: 0 };
  const counts: Record<Axis, number> = { autonomy: 0, openness: 0, value: 0 };
  const scoringAnswers: { q: QuizQuestion; opt: QuizOption }[] = [];
  let driftFlag = false;
  let selectedTools: string[] = [];
  let toolSophistication: number | null = null;
  let willingness: WillingnessLevel | null = null;

  for (const q of questions) {
    const raw = answers[q.id];
    if (raw == null) continue;

    // Tools inventory: multi-select. Never votes on the centroid, never plots.
    if (q.kind === 'tools') {
      const ids = Array.isArray(raw) ? raw : [raw];
      const chosen = q.options.filter(o => ids.includes(o.id));
      selectedTools = chosen.map(o => o.id);
      toolSophistication = computeToolSophistication(chosen);
      continue;
    }

    // Intent: single-select willingness signal. Reads the chosen option's tier and
    // continues BEFORE any vote — never moves the centroid, plots, or shifts altitude.
    if (q.kind === 'intent') {
      const optId = Array.isArray(raw) ? raw[0] : raw;
      const opt = q.options.find(o => o.id === optId);
      willingness = opt?.willingness ?? null;
      continue;
    }

    const optId = Array.isArray(raw) ? raw[0] : raw;
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
  // The tool inventory, if answered, lightly nudges altitude (10%) — your tools
  // can raise the headline number a touch, but your archetype stays behavior-driven.
  const climbAltitude = (centroid.autonomy + centroid.openness) / 2;
  const altitude =
    toolSophistication == null
      ? climbAltitude
      : clamp01(0.9 * climbAltitude + 0.1 * toolSophistication);
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

  // Voice: Mitch. A flag, never a punishment. Direct, on your side.
  let caveat: string | null = null;
  if (driftFlag && centroid.autonomy >= 0.6) {
    caveat =
      'You scored high on Autonomy, but you could not name one thing that actually runs without you. ' +
      'That is the most common gap there is. Do not sweat it. Go get one workflow running end-to-end, ' +
      'hands-off, one time. Then the score is real.';
  } else if (toolSophistication != null && centroid.autonomy >= 0.7 && toolSophistication < 0.4) {
    // Claims high autonomy, but the toolset is entry-level. The numbers do not add up yet.
    caveat =
      'You scored high on Autonomy, but the tools you checked are mostly entry-level. ' +
      'Real autonomy needs something that can actually run on its own. Pick up one harness or ' +
      'automation tool and wire up a single hands-off workflow. That is the gap, and it is a small one.';
  } else if (monocultureFlag) {
    caveat =
      'You maxed out every climb question. Could be true. Could also be how it feels right before you check. ' +
      'Gut-check each one against something concrete you could show someone.';
  } else if (driftFlag) {
    caveat =
      'Quick flag: you said you could not point to one specific hands-off task. ' +
      'Worth making sure your setup is as real as it feels.';
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
    selectedTools,
    toolSophistication,
    willingness,
  };
}
