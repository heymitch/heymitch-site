// AI-Native Quiz — question set (spec §4 + build plan).
// Generated: 2026-05-22.
//
// ─── Archetype reachability map ──────────────────────────────────────────────
//
// Each archetype is reached by the centroid (mean per axis across scoring Qs).
// Scoring questions: q1-q3 (autonomy), q4-q6 (openness), q7-q9 (value), q10 (gate — no vote).
// Gate question q10 never moves the centroid; it only sets driftFlag.
//
// Autonomy options spread:   ~0.12 / 0.40 / 0.68 / 0.92
// Openness options spread:   ~0.12 / 0.40 / 0.68 / 0.92
// Value options spread:       0.12 (Buy) / 0.38 / 0.62 / 0.88 (Build)
//   — value Q7 options:       0.12 / 0.38 / 0.62 / 0.88
//   — value Q8 options:       0.12 / 0.38 / 0.62 / 0.88
//   — value Q9 options:       0.12 / 0.38 / 0.62 / 0.88
//   Consistent Buy  (3 × 0.12)  → centroid.value = 0.12  → nearest to Mogul (0.15)  ✓
//   Consistent Build (3 × 0.88) → centroid.value = 0.88  → nearest to Sovereign (0.85) ✓
//   Mixed  (0.12/0.88/0.62)     → centroid.value = 0.54  → nearest to Wizard/Operator (0.5) ✓
//
// TINKERER  (0.15, 0.15, 0.5) → autonomy 0.12/0.12/0.40 ≈ 0.21
//                                openness 0.12/0.12/0.40 ≈ 0.21
//                                value    0.12/0.38/0.62 ≈ 0.37   → nearest Tinkerer ✓
//
// OPERATOR  (0.50, 0.50, 0.5) → autonomy 0.40/0.40/0.68 ≈ 0.49
//                                openness 0.40/0.40/0.68 ≈ 0.49
//                                value    0.38/0.38/0.88 ≈ 0.55   → nearest Operator ✓
//
// BUILDER   (0.50, 0.65, 0.85)→ autonomy 0.40/0.40/0.68 ≈ 0.49
//                                openness 0.68/0.68/0.68 ≈ 0.68
//                                value    0.88/0.88/0.88 = 0.88   → nearest Builder ✓
//
// HERMIT    (0.85, 0.15, 0.8) → autonomy 0.92/0.92/0.92 = 0.92
//                                openness 0.12/0.12/0.12 = 0.12
//                                value    0.88/0.88/0.62 ≈ 0.79   → nearest Hermit ✓
//
// SCRIBE    (0.15, 0.85, 0.5) → autonomy 0.12/0.12/0.12 = 0.12
//                                openness 0.92/0.92/0.92 = 0.92
//                                value    0.12/0.88/0.62 ≈ 0.54   → nearest Scribe ✓
//
// MOGUL     (0.85, 0.85, 0.15)→ autonomy 0.92/0.92/0.92 = 0.92
//                                openness 0.92/0.92/0.92 = 0.92
//                                value    0.12/0.12/0.12 = 0.12   → nearest Mogul ✓
//
// SOVEREIGN (0.85, 0.85, 0.85)→ autonomy 0.92/0.92/0.92 = 0.92
//                                openness 0.92/0.92/0.92 = 0.92
//                                value    0.88/0.88/0.88 = 0.88   → nearest Sovereign ✓
//
// WIZARD    (0.95, 0.95, 0.50)→ autonomy 0.92/0.92/0.92 = 0.92   (near 0.95)
//                                openness 0.92/0.92/0.92 = 0.92   (near 0.95)
//                                value    0.12/0.88/0.62 ≈ 0.54   → nearest Wizard ✓
//   Note: Wizard coord is 0.95/0.95. A full-high autonomy+openness respondent lands at 0.92/0.92
//   — closer to Wizard (0.95,0.95,0.5) than to Mogul/Sovereign when value is mixed. ✓
//
// ─── End reachability map ─────────────────────────────────────────────────────

import type { QuizQuestion } from './types';
import { MARQUEE_TOOLS } from './recommendations';

export const QUESTIONS: QuizQuestion[] = [
  // ── Q1: Autonomy — how much runs without you starting it ──────────────────
  {
    id: 'q1',
    axis: 'autonomy',
    prompt: 'When you use AI, how does most of it start?',
    helper: 'Think about a typical workday — not your ideal setup, what actually happens.',
    options: [
      {
        id: 'a',
        label: 'I open a chat and type a prompt. Every time, manually.',
        weights: { autonomy: 0.12 },
      },
      {
        id: 'b',
        label:
          'I have a few saved prompts or shortcuts I reuse, but I still kick each one off myself.',
        weights: { autonomy: 0.40 },
      },
      {
        id: 'c',
        label:
          'Some tasks run on a schedule or trigger — I set them up and they go without me.',
        weights: { autonomy: 0.68 },
      },
      {
        id: 'd',
        label:
          'Multiple workflows run on their own. I mostly review outputs, not run the jobs.',
        weights: { autonomy: 0.92 },
      },
    ],
  },

  // ── Q2: Autonomy — what kicks off an AI task ──────────────────────────────
  {
    id: 'q2',
    axis: 'autonomy',
    prompt:
      'Think of the most complex AI task you run regularly. What kicks it off?',
    options: [
      {
        id: 'a',
        label: 'Me, typing a prompt and sending it.',
        weights: { autonomy: 0.12 },
      },
      {
        id: 'b',
        label:
          'Me, but using a template or saved workflow so I do not have to think from scratch.',
        weights: { autonomy: 0.40 },
      },
      {
        id: 'c',
        label:
          'An event — an email arriving, a form submission, a file drop — triggers it automatically.',
        weights: { autonomy: 0.68 },
      },
      {
        id: 'd',
        label:
          'Another agent or script hands it off. I am not in the loop until there is a result to review.',
        weights: { autonomy: 0.92 },
      },
    ],
  },

  // ── Q3: Autonomy — what happens while you sleep ───────────────────────────
  {
    id: 'q3',
    axis: 'autonomy',
    prompt: 'What happens with your AI setup while you are asleep?',
    options: [
      {
        id: 'a',
        label: 'Nothing — it waits for me.',
        weights: { autonomy: 0.12 },
      },
      {
        id: 'b',
        label:
          'Maybe a scheduled export or report runs, but nothing meaningful without me.',
        weights: { autonomy: 0.40 },
      },
      {
        id: 'c',
        label:
          'At least one thing runs overnight — a digest, a data pull, a draft — and it is waiting for me in the morning.',
        weights: { autonomy: 0.68 },
      },
      {
        id: 'd',
        label:
          'Work gets done. Leads get processed, content gets drafted, emails get sorted. I wake up to outputs.',
        weights: { autonomy: 0.92 },
      },
    ],
  },

  // ── Q4: Openness — handoff legibility ─────────────────────────────────────
  {
    id: 'q4',
    axis: 'openness',
    prompt:
      'If a teammate had to take over your AI setup tomorrow with zero handoff from you, what would happen?',
    helper: 'Not a dream scenario — what would literally happen based on what exists today.',
    options: [
      {
        id: 'a',
        label: 'They would be lost. It only works because I know how to run it.',
        weights: { openness: 0.12 },
      },
      {
        id: 'b',
        label:
          'They could figure out the basics — I have some notes — but they would hit walls quickly.',
        weights: { openness: 0.40 },
      },
      {
        id: 'c',
        label:
          'Most of it is documented. A competent person could pick it up in a day or two.',
        weights: { openness: 0.68 },
      },
      {
        id: 'd',
        label:
          'Everything is documented, versioned, and explained. Someone — or another AI — could run it from cold start.',
        weights: { openness: 0.92 },
      },
    ],
  },

  // ── Q5: Openness — portability of prompts/workflows ───────────────────────
  {
    id: 'q5',
    axis: 'openness',
    prompt: 'Where do your prompts and AI workflows live?',
    options: [
      {
        id: 'a',
        label:
          'In my head, or scattered across chat windows. I rebuild them when I need them.',
        weights: { openness: 0.12 },
      },
      {
        id: 'b',
        label:
          'I have a doc or folder where I save the ones that work, but it is not organized.',
        weights: { openness: 0.40 },
      },
      {
        id: 'c',
        label:
          'I have a named, organized library — prompts, configs, templates — that I update and reuse.',
        weights: { openness: 0.68 },
      },
      {
        id: 'd',
        label:
          'They are versioned files or installable skills. Anyone can run them without asking me how.',
        weights: { openness: 0.92 },
      },
    ],
  },

  // ── Q6: Openness — how much context an AI task needs from you ────────────
  {
    id: 'q6',
    axis: 'openness',
    prompt:
      'When you hand a task to an AI tool, how much do you have to explain before it can run?',
    helper: 'Think about a repeating task you do at least weekly.',
    options: [
      {
        id: 'a',
        label:
          'A lot — I re-explain the whole situation, who I am, what I need, every time.',
        weights: { openness: 0.12 },
      },
      {
        id: 'b',
        label:
          'Some — I have a rough starting point but I am still filling in context each run.',
        weights: { openness: 0.40 },
      },
      {
        id: 'c',
        label:
          'A little — I have a good system prompt or template, so the AI mostly already knows the context.',
        weights: { openness: 0.68 },
      },
      {
        id: 'd',
        label:
          'Essentially nothing — the context is baked in. I trigger it and get a result.',
        weights: { openness: 0.92 },
      },
    ],
  },

  // ── Q7: Value — ownership vs. best-off-shelf ──────────────────────────────
  {
    id: 'q7',
    axis: 'value',
    prompt:
      'When you need a new AI capability, what is your instinct?',
    helper: 'Neither answer is more advanced — they reflect different priorities.',
    options: [
      {
        id: 'a',
        label:
          'Find the best tool that already does it and plug it in. Speed and simplicity win.',
        weights: { value: 0.12 },
      },
      {
        id: 'b',
        label:
          'Start with a good off-the-shelf option, but customize it a bit so it fits my exact situation.',
        weights: { value: 0.38 },
      },
      {
        id: 'c',
        label:
          'Lean toward building or scripting my own — I like having control even if it costs more time upfront.',
        weights: { value: 0.62 },
      },
      {
        id: 'd',
        label:
          'Build it myself. I want to own the stack — scripts, models, integrations — not depend on a vendor.',
        weights: { value: 0.88 },
      },
    ],
  },

  // ── Q8: Value — vendor lock-in tolerance ──────────────────────────────────
  {
    id: 'q8',
    axis: 'value',
    prompt:
      'How do you feel about your AI setup depending on a third-party product you do not control?',
    options: [
      {
        id: 'a',
        label:
          'Completely fine. If the vendor makes it better or obsoletes it, I will just switch to the next best thing.',
        weights: { value: 0.12 },
      },
      {
        id: 'b',
        label:
          'Fine for now, but I prefer to keep my core workflows portable so I am not stuck if something changes.',
        weights: { value: 0.38 },
      },
      {
        id: 'c',
        label:
          'I try to minimize it. I prefer open formats and self-hosted options where I can get them.',
        weights: { value: 0.62 },
      },
      {
        id: 'd',
        label:
          'I actively avoid it. Vendor dependency is a liability I engineer around.',
        weights: { value: 0.88 },
      },
    ],
  },

  // ── Q9: Value — what "winning with AI" looks like ─────────────────────────
  {
    id: 'q9',
    axis: 'value',
    prompt:
      'Which of these most closely matches your picture of what it means to "win" with AI?',
    options: [
      {
        id: 'a',
        label:
          'Move faster than competitors by deploying the best tools available — whoever ships fastest wins.',
        weights: { value: 0.12 },
      },
      {
        id: 'b',
        label:
          'Pick the right mix: best-in-class tools for commodity tasks, custom builds only where they create a real edge.',
        weights: { value: 0.38 },
      },
      {
        id: 'c',
        label:
          'Build leverage that compounds: a proprietary system that gets smarter and harder to replicate over time.',
        weights: { value: 0.62 },
      },
      {
        id: 'd',
        label:
          'Own the engine. Control the model, the data, the stack. No one can cut off or clone what you built.',
        weights: { value: 0.88 },
      },
    ],
  },

  // ── Q10: Gate — drift detector ─────────────────────────────────────────────
  {
    id: 'q10',
    axis: 'autonomy',
    isGate: true,
    prompt:
      'Can you name a specific AI task that runs without you starting it — something that has already happened at least twice in the past month?',
    helper:
      'This question has no wrong answer — it just helps calibrate your result. All options are honest.',
    options: [
      {
        id: 'a',
        label:
          'Yes — and I can name it right now. It ran on its own and delivered a result I used.',
        weights: {},
      },
      {
        id: 'b',
        label:
          'Yes, roughly. It is not perfectly hands-off yet but it is largely automatic.',
        weights: {},
      },
      {
        id: 'c',
        label:
          'Not really — I said I use AI automatically but thinking about it, I still kick things off myself.',
        weights: {},
        drift: true,
      },
      {
        id: 'd',
        label:
          'No, and that is accurate — everything I run, I start myself. That is where I am right now.',
        weights: {},
      },
    ],
  },

  // ── Intent — non-scoring willingness signal. Captures how urgent getting great
  // at AI is for the taker's business. Never votes on an axis, never plots, never
  // moves altitude/archetype. Sets ScoreResult.willingness for downstream routing. ──
  {
    id: 'intent',
    axis: 'autonomy', // required by the type; ignored — intent never votes
    kind: 'intent',
    prompt: 'How important is getting great at AI to your business right now?',
    helper: 'No wrong answer. This just helps us point you at the right next step.',
    options: [
      {
        id: 'critical',
        label: 'Critical and urgent. Falling behind on AI is a real risk to my business right now.',
        weights: {},
        willingness: 'critical',
      },
      {
        id: 'building',
        label: 'Important. I am actively building toward it, just not there yet.',
        weights: {},
        willingness: 'building',
      },
      {
        id: 'curious',
        label: 'Curious. I am exploring what is possible but not committed to a real push yet.',
        weights: {},
        willingness: 'curious',
      },
      {
        id: 'none',
        label: 'Not a priority right now. Other things matter more.',
        weights: {},
        willingness: 'none',
      },
    ],
  },

  // ── Q11: Tool inventory — multi-select. Does not vote on archetype; lightly
  // nudges altitude, cross-checks the autonomy claim, and drives recommendations. ──
  {
    id: 'tools',
    axis: 'autonomy',
    kind: 'tools',
    prompt: 'Last one: which of these have you actually used?',
    helper: 'Pick all that apply, or none. This sharpens your recommendations and sanity-checks your scores.',
    options: MARQUEE_TOOLS.map(t => ({ id: t.id, label: t.label, weights: {}, tier: t.tier })),
  },
];
