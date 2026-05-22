// Local palette for the AI-Native quiz. These hex values MIRROR the workspace
// design tokens in tailwind.config.ts (cream/brown/orange/teal/green) — they do
// NOT re-declare CSS :root variables. Same approach as the AI Hunter tool.
// Inherit, never re-declare (free-tool-builder PATTERNS.md §1).

export const C = {
  bg:      '#faf8f4', // page wash (lighter than cream surface)
  surface: '#ffffff',
  cream:   '#F0E4D0', // tailwind cream
  creamDk: '#E0D4BE', // tailwind cream.dark
  border:  '#e8e2d9',
  dark:    '#2D2118', // tailwind brown
  mid:     '#4A3A2A', // tailwind brown.muted
  faint:   '#b4a898',
  orange:  '#E8682A', // tailwind orange  — Autonomy axis (X)
  teal:    '#2B6B8A', // tailwind teal    — Openness axis (Y)
  green:   '#5B8C5A', // tailwind green   — Build↔Buy axis (Z)
  pass:    '#2b8a3e',
} as const;

// Per-axis accent (used by the quiz progress + sub-score bars + 3D dots).
export const AXIS_COLOR: Record<'autonomy' | 'openness' | 'value', string> = {
  autonomy: C.orange,
  openness: C.teal,
  value:    C.green,
};
