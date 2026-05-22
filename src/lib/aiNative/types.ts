// AI-Native Quiz — shared types (the scoring contract).
// Pure data shapes. No DOM, no fetch, no framework imports.
// Spec: docs/superpowers/specs/2026-05-22-ai-native-3d-archetype-quiz-design.md

// ─── The three axes ─────────────────────────────────────────────────────────
// All axis values are normalized to [0, 1].
//
//   X — autonomy : climb. 0 = you type every prompt → 1 = things run without you.
//   Y — openness : climb. 0 = lives only in your head → 1 = portable, legible, hand-offable.
//   Z — value    : trade-off, NOT a climb. 0 = Buy (best off-the-shelf) → 1 = Build (own your engine).
//                  ~0.5 = Mix. Z never affects altitude; it only spreads you sideways.

export type Axis = 'autonomy' | 'openness' | 'value';

export const AXES: readonly Axis[] = ['autonomy', 'openness', 'value'] as const;

/** A point / contribution in the 3D normalized space. */
export interface Vec3 {
  autonomy: number;
  openness: number;
  value: number;
}

/** Axis display metadata — the teaching layer no other quiz does. */
export interface AxisMeta {
  axis: Axis;
  letter: 'X' | 'Y' | 'Z';
  /** Short name shown on the plot axis. */
  name: string;
  /** The *kind* of axis — this is the gut-punch teaching label. */
  kind: 'climb' | 'trade-off';
  /** Sublabel rendered under the name, e.g. "Scale ↑ climb". */
  sublabel: string;
  lowLabel: string;
  highLabel: string;
}

// ─── Questions ──────────────────────────────────────────────────────────────

export interface QuizOption {
  /** Stable id, unique within its question (e.g. 'a', 'b', 'c', 'd'). */
  id: string;
  /** Beginner-legible answer text. Every option is the mature expression of its tier. */
  label: string;
  /**
   * Where this answer sits on each axis it touches, in [0, 1].
   * The question's primary axis MUST be present. Cross-loads optional.
   */
  weights: Partial<Vec3>;
  /**
   * Drift-gate marker. On the gate question, exactly one option carries
   * drift:true — the answer that signals the domain's known failure mode
   * (claimed sophistication with no concrete, repeatable instance behind it).
   */
  drift?: boolean;
}

export interface QuizQuestion {
  id: string;
  /** The axis this question primarily measures. */
  axis: Axis;
  /** The question text (plain English, behavior-based, no jargon). */
  prompt: string;
  /** Optional one-line helper under the prompt. */
  helper?: string;
  options: QuizOption[];
  /** True for the single drift/gaming-gate item (does not vote for a tier). */
  isGate?: boolean;
}

/** A completed answer set: questionId -> chosen optionId. */
export type AnswerMap = Record<string, string>;

// ─── Archetypes & levels ──────────────────────────────────────────────────────

export type ArchetypeName =
  | 'Tinkerer'
  | 'Operator'
  | 'Builder'
  | 'Hermit'
  | 'Scribe'
  | 'Mogul'
  | 'Sovereign'
  | 'Wizard';

export interface Archetype {
  name: ArchetypeName;
  /** Fixed location in normalized 3D space. */
  coord: Vec3;
  /** One-line identity (who this person is). Voiced. */
  tagline: string;
  /** The single move that climbs them toward the high-X-high-Y corner. Voiced. */
  climbMove: string;
}

export interface LevelBand {
  /** Headline "how AI-native are you" label. */
  name: string;
  /** Inclusive lower bound on altitude [0,1]; band runs [min, next.min). */
  min: number;
  /** Short description of this altitude. Voiced. */
  blurb: string;
}

// ─── Scoring result (mirrors the `computed` jsonb column) ─────────────────────

/** One plotted dot in the answer cloud (one per scoring answer). */
export interface AnswerDot {
  questionId: string;
  /** Which axis this answer primarily measured (drives the cloud's spread). */
  axis: Axis;
  point: Vec3;
}

export interface ScoreResult {
  /** Centroid of the answer cloud = the user's location. */
  centroid: Vec3;
  /** The plotted dots (one per scoring question). */
  dots: AnswerDot[];
  /** Per-axis sub-scores (== centroid components), 0..1. */
  subScores: Vec3;
  /** altitude = (autonomy + openness) / 2, in [0,1]. Z excluded by design. */
  altitude: number;
  /** Level-band name resolved from altitude. */
  level: string;
  /** Nearest of the 8 named archetypes. */
  archetype: ArchetypeName;
  /** Euclidean distance from centroid to the resolved archetype (0 = dead-on). */
  archetypeDistance: number;

  // ── Ungameable secondary signals (surfaced softly, never punitive) ──
  /** Fraction of scoring answers landing in the top tier of their axis. */
  coherence: number;
  /** True when the cloud is suspiciously clean (>=0.9) → aspirational/gamed. */
  monocultureFlag: boolean;
  /** True when the drift-gate option was chosen. */
  driftFlag: boolean;
  /**
   * A respectful, specific caveat to show on the result, or null.
   * Set when drift is tripped on a high-autonomy claim, or on monoculture.
   * Voiced.
   */
  caveat: string | null;
}
