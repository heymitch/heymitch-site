// AI-Native Quiz — the constellation model.
// Encodes spec §2 (axes) and §3 (8 archetypes) as numeric coordinates.
// Tunable: archetype coords + band thresholds (spec open questions #2).

import type { Archetype, AxisMeta, LevelBand, Vec3 } from './types';

// Low / Mid / High → numeric anchors on a [0,1] axis.
export const LOW = 0.15;
export const MID = 0.5;
export const HIGH = 0.85;
// Value axis (Z): Buy ←→ Build.
export const BUY = 0.15;
export const MIX = 0.5;
export const BUILD = 0.85;

// ─── Axis display metadata (the teaching layer) ──────────────────────────────

export const AXIS_META: Record<'autonomy' | 'openness' | 'value', AxisMeta> = {
  autonomy: {
    axis: 'autonomy',
    letter: 'X',
    name: 'Autonomy',
    kind: 'climb',
    sublabel: 'Scale ↑ climb',
    lowLabel: 'You start everything',
    highLabel: 'Runs without you',
  },
  openness: {
    axis: 'openness',
    letter: 'Y',
    name: 'Openness',
    kind: 'climb',
    sublabel: 'Efficiency ↑ climb',
    lowLabel: 'Locked in your head',
    highLabel: 'Portable & legible',
  },
  value: {
    axis: 'value',
    letter: 'Z',
    name: 'Build ↔ Buy',
    kind: 'trade-off',
    sublabel: 'Value ↔ trade-off',
    lowLabel: 'Buy (off-the-shelf)',
    highLabel: 'Build (own your engine)',
  },
};

// ─── The 8 archetypes (spec §3) ───────────────────────────────────────────────
// Coordinates read straight off the Scale / Open / Value table.
// Mogul, Sovereign, Wizard share the high-X-high-Y corner — Z splits them.
// That split IS the newsletter payoff: same altitude, opposite philosophies.

// Voice: Mitch (heymitch). Punchy, direct, no hedging, no jargon. Every tier is
// seen, not judged. Verified clean against the in-repo AI Hunter engine.
export const ARCHETYPES: Archetype[] = [
  {
    name: 'Tinkerer',
    coord: { autonomy: LOW, openness: LOW, value: MIX },
    tagline: 'You live in the chat box. Endlessly curious, prompting daily, and nothing runs without you yet.',
    climbMove: 'Make one thing repeatable. Save a prompt you keep retyping, or install a skill. That is the first rung.',
  },
  {
    name: 'Operator',
    coord: { autonomy: MID, openness: MID, value: MIX },
    tagline: 'A few workflows you trust, run by hand, every day. This is where most real work gets done.',
    climbMove: 'Take one workflow you run by hand and make it start itself. A trigger, a schedule, anything.',
  },
  {
    name: 'Builder',
    coord: { autonomy: MID, openness: 0.65, value: BUILD },
    tagline: 'You build the real thing, not toys. Still hands-on, still the one pressing go.',
    climbMove: 'You can build. Now get one of your builds running without you in the loop, or hand it to someone who is not you.',
  },
  {
    name: 'Hermit',
    coord: { autonomy: HIGH, openness: LOW, value: 0.8 },
    tagline: 'You have automated a ton. It is also a black box that dies the day you step away.',
    climbMove: 'Pick your most important black box and make it legible. Write it down so a person, or an agent, could run it cold.',
  },
  {
    name: 'Scribe',
    coord: { autonomy: LOW, openness: HIGH, value: MIX },
    tagline: 'Beautiful docs, clean systems, anyone could pick it up. There is just no engine running yet.',
    climbMove: 'Take your best doc and make it execute. Turn the map into an engine, even a small one.',
  },
  {
    name: 'Mogul',
    coord: { autonomy: HIGH, openness: HIGH, value: BUY },
    tagline: 'An empire built on the best tools other people made. Happy to be replaced by Claude, because speed wins.',
    climbMove: 'Nothing to climb. You are at altitude. Just own the bet you made: speed and focus over owning the thing.',
  },
  {
    name: 'Sovereign',
    coord: { autonomy: HIGH, openness: HIGH, value: BUILD },
    tagline: 'You own the engine. Your skills, your agents, your stack, all open. Nobody can cut you off.',
    climbMove: 'Nothing to climb. You are at altitude and you own it. Keep it open, keep it yours.',
  },
  {
    name: 'Wizard',
    coord: { autonomy: 0.95, openness: 0.95, value: MIX },
    tagline: 'The apex. You direct a fleet, most of it agents, and you mostly supervise.',
    climbMove: 'This is where the whole thing points. Your job now is keeping the fleet legible as it grows.',
  },
];

// ─── Level bands (altitude = (X+Y)/2) ─────────────────────────────────────────
// The headline "how AI-native are you" ladder. Tunable thresholds.
// Ordered low→high; a band runs [min, next.min).

export const LEVEL_BANDS: LevelBand[] = [
  { name: 'Spark',     min: 0.0,  blurb: 'You are at the trailhead. Everyone starts here. The only people who do not are the ones who never started.' },
  { name: 'Operator',  min: 0.32, blurb: 'AI is part of your day now. A few things are reliable. You are past playing and into using.' },
  { name: 'Architect', min: 0.55, blurb: 'You build real systems and run them. Past toys, into work that holds weight.' },
  { name: 'Wizard',    min: 0.78, blurb: 'Top of the mountain. Legible, autonomous, supervised. The rare air.' },
];

/** Resolve an altitude in [0,1] to its level-band name. */
export function bandForAltitude(altitude: number): LevelBand {
  let chosen = LEVEL_BANDS[0];
  for (const band of LEVEL_BANDS) {
    if (altitude >= band.min) chosen = band;
  }
  return chosen;
}

/** Squared Euclidean distance in 3D (cheaper; ordering identical to distance). */
export function dist2(a: Vec3, b: Vec3): number {
  const da = a.autonomy - b.autonomy;
  const db = a.openness - b.openness;
  const dv = a.value - b.value;
  return da * da + db * db + dv * dv;
}
