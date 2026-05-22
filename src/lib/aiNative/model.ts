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

export const ARCHETYPES: Archetype[] = [
  {
    name: 'Tinkerer',
    coord: { autonomy: LOW, openness: LOW, value: MIX },
    tagline: 'Plays in one chat window. Fiddles. Nothing ships yet.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Make one thing repeatable: save a reused prompt, install a skill.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Operator',
    coord: { autonomy: MID, openness: MID, value: MIX },
    tagline: 'A couple reliable workflows, driven daily, hands-on.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Let one workflow run without you starting it.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Builder',
    coord: { autonomy: MID, openness: 0.65, value: BUILD },
    tagline: 'Builds real custom tools — not toys — but still hands-on.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Get one of your builds to run autonomously, or hand it off.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Hermit',
    coord: { autonomy: HIGH, openness: LOW, value: 0.8 },
    tagline: 'Automated a ton, but it is a black box. Dies if you vanish.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Make one workflow legible enough to hand to a person or an agent.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Scribe',
    coord: { autonomy: LOW, openness: HIGH, value: MIX },
    tagline: 'Documented and shareable. All map, no engine — nothing running yet.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Turn one beautiful doc into something that executes.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Mogul',
    coord: { autonomy: HIGH, openness: HIGH, value: BUY },
    tagline: 'Empire on the best off-the-shelf tools. Happy to be replaced by Claude.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Already at altitude. Trade-off chosen: speed & focus over ownership.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Sovereign',
    coord: { autonomy: HIGH, openness: HIGH, value: BUILD },
    tagline: 'Owns the engine — skills, agents, stack, open. Replaceable by no one.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Already at altitude. Trade-off chosen: control & sovereignty.', // [NEEDS_VOICE_REVIEW]
  },
  {
    name: 'Wizard',
    coord: { autonomy: 0.95, openness: 0.95, value: MIX },
    tagline: 'Apex. Directs a fleet — most of them agents — and supervises.', // [NEEDS_VOICE_REVIEW]
    climbMove: 'Where the whole tool points.', // [NEEDS_VOICE_REVIEW]
  },
];

// ─── Level bands (altitude = (X+Y)/2) ─────────────────────────────────────────
// The headline "how AI-native are you" ladder. Tunable thresholds.
// Ordered low→high; a band runs [min, next.min).

export const LEVEL_BANDS: LevelBand[] = [
  { name: 'Spark',     min: 0.0,  blurb: 'You are at the entry point. Everyone starts here.' },          // [NEEDS_VOICE_REVIEW]
  { name: 'Operator',  min: 0.32, blurb: 'You drive AI daily and a few workflows are reliable.' },        // [NEEDS_VOICE_REVIEW]
  { name: 'Architect', min: 0.55, blurb: 'You build and run real things — past toys, into leverage.' },    // [NEEDS_VOICE_REVIEW]
  { name: 'Wizard',    min: 0.78, blurb: 'Apex altitude. Legible, autonomous operation you supervise.' },  // [NEEDS_VOICE_REVIEW]
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
