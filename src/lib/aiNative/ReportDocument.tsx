// AI-Native Archetype Report — @react-pdf/renderer document.
// Server-side only. No 'use client'. No images. No external fonts.
// Spec: docs/superpowers/specs/2026-05-22-ai-native-3d-archetype-quiz-design.md

import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ScoreResult } from './types';
import { ARCHETYPES, AXIS_META } from './model';

// ─── Brand palette (hex literals — no import from app palette) ────────────────
const COLOR = {
  cream:    '#F0E4D0',
  white:    '#FFFFFF',
  ink:      '#2D2118',
  muted:    '#4A3A2A',
  orange:   '#E8682A', // autonomy axis
  teal:     '#2B6B8A', // openness axis
  green:    '#5B8C5A', // value axis
  faint:    '#b4a898',
  surface:  '#FAF6F0',
} as const;

// ─── Axis bar color map ───────────────────────────────────────────────────────
const AXIS_COLOR: Record<string, string> = {
  autonomy: COLOR.orange,
  openness: COLOR.teal,
  value:    COLOR.green,
};

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: COLOR.cream,
    paddingHorizontal: 48,
    paddingVertical: 44,
    fontFamily: 'Helvetica',
    flexDirection: 'column',
  },
  // Eyebrow row
  eyebrowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  eyebrow: {
    fontSize: 8,
    letterSpacing: 2,
    color: COLOR.muted,
    textTransform: 'uppercase',
  },
  siteTag: {
    fontSize: 8,
    color: COLOR.faint,
  },
  // Archetype hero block
  archetypeBlock: {
    marginBottom: 22,
  },
  archetypeName: {
    fontSize: 42,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.ink,
    lineHeight: 1.05,
    marginBottom: 6,
  },
  tagline: {
    fontSize: 13,
    color: COLOR.muted,
    lineHeight: 1.4,
  },
  // Headline tier line
  tierLine: {
    fontSize: 11,
    color: COLOR.ink,
    marginBottom: 28,
    borderTopWidth: 1,
    borderTopColor: COLOR.faint,
    paddingTop: 10,
  },
  tierHighlight: {
    fontFamily: 'Helvetica-Bold',
    color: COLOR.ink,
  },
  // Sub-score rows
  scoresSection: {
    marginBottom: 28,
  },
  scoresSectionLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLOR.muted,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  scoreRow: {
    marginBottom: 12,
  },
  scoreRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  scoreAxisName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.ink,
  },
  scoreAxisSublabel: {
    fontSize: 8,
    color: COLOR.muted,
    marginLeft: 4,
  },
  scorePct: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLOR.ink,
  },
  barTrack: {
    height: 7,
    backgroundColor: COLOR.surface,
    borderRadius: 4,
    overflow: 'hidden',
    width: '100%',
  },
  barFill: {
    height: 7,
    borderRadius: 4,
  },
  scoreNote: {
    fontSize: 8,
    color: COLOR.faint,
    marginTop: 3,
    fontStyle: 'italic',
  },
  // Climb move box
  climbBox: {
    backgroundColor: COLOR.ink,
    borderRadius: 6,
    padding: 18,
    marginBottom: 20,
  },
  climbLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLOR.faint,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  climbMove: {
    fontSize: 13,
    color: COLOR.cream,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.45,
  },
  // Trade-off section
  tradeoffSection: {
    marginBottom: 24,
    backgroundColor: COLOR.surface,
    borderRadius: 6,
    padding: 14,
  },
  tradeoffLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLOR.muted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  tradeoffBody: {
    fontSize: 10,
    color: COLOR.muted,
    lineHeight: 1.55,
  },
  // Footer
  footer: {
    marginTop: 'auto',
    borderTopWidth: 1,
    borderTopColor: COLOR.faint,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: COLOR.faint,
  },
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function pct(v: number): number {
  return Math.round(v * 100);
}

/** Clamp to [0, 100] for the bar fill width. */
function barWidth(v: number): string {
  const w = Math.min(1, Math.max(0, v)) * 100;
  return `${w}%`;
}

// ─── Sub-score row component ─────────────────────────────────────────────────

function ScoreRow({
  axis,
  value,
  isTradeoff,
}: {
  axis: 'autonomy' | 'openness' | 'value';
  value: number;
  isTradeoff?: boolean;
}) {
  const meta = AXIS_META[axis];
  const color = AXIS_COLOR[axis];
  return (
    <View style={s.scoreRow}>
      <View style={s.scoreRowHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
          <Text style={s.scoreAxisName}>{meta.name}</Text>
          <Text style={s.scoreAxisSublabel}>  {meta.sublabel}</Text>
        </View>
        <Text style={s.scorePct}>{pct(value)}%</Text>
      </View>
      <View style={s.barTrack}>
        <View style={[s.barFill, { width: barWidth(value), backgroundColor: color }]} />
      </View>
      {isTradeoff && (
        <Text style={s.scoreNote}>
          No wrong side — this axis is a trade-off, not a climb.
        </Text>
      )}
    </View>
  );
}

// ─── Main document builder ────────────────────────────────────────────────────

export function buildReport(result: ScoreResult): React.ReactElement {
  const archetype = ARCHETYPES.find((a) => a.name === result.archetype) ?? ARCHETYPES[0];
  const altitudePct = pct(result.altitude);

  // Trade-off prose: neutral explanation of Mogul vs Sovereign at equal altitude. {/* [NEEDS_VOICE_REVIEW] */}
  const tradeoffProse =
    'Two people can sit at identical altitude—same autonomy, same openness—and make opposite choices on the Build↔Buy axis. ' +
    'The Mogul bets on speed and focus: best off-the-shelf tools, minimal maintenance, delegates the engine to vendors. ' +
    'The Sovereign bets on control: owns the stack, runs open-source, stays replaceable by no one. ' +
    'Neither is wrong. The trade-off reflects your risk tolerance, your budget, and what you want to be sovereign over. ' +
    'Your score just shows where you sit today—you can move it deliberately.'; // [NEEDS_VOICE_REVIEW]

  return (
    <Document
      title={`AI-Native Archetype Report — ${archetype.name}`}
      author="heymitch.ai"
      subject="How AI-Native Are You?"
    >
      <Page size="A4" style={s.page}>

        {/* 1. Eyebrow */}
        <View style={s.eyebrowRow}>
          <Text style={s.eyebrow}>AI-Native Archetype Report</Text>
          <Text style={s.siteTag}>heymitch.ai</Text>
        </View>

        {/* 2. Archetype hero */}
        <View style={s.archetypeBlock}>
          <Text style={s.archetypeName}>{archetype.name}</Text>
          <Text style={s.tagline}>{archetype.tagline}</Text>
        </View>

        {/* 3. Tier headline */}
        <Text style={s.tierLine}>
          <Text style={s.tierHighlight}>{result.level}-tier</Text>
          {'  ·  AI-native altitude '}
          <Text style={s.tierHighlight}>{altitudePct}/100</Text>
        </Text>

        {/* 4. Sub-score rows */}
        <View style={s.scoresSection}>
          <Text style={s.scoresSectionLabel}>Your three axes</Text>
          <ScoreRow axis="autonomy" value={result.subScores.autonomy} />
          <ScoreRow axis="openness" value={result.subScores.openness} />
          <ScoreRow axis="value"    value={result.subScores.value} isTradeoff />
        </View>

        {/* 5. Climb move */}
        <View style={s.climbBox}>
          <Text style={s.climbLabel}>Your next climb move</Text>
          <Text style={s.climbMove}>{archetype.climbMove}</Text>
        </View>

        {/* 6. Trade-off explanation */}
        <View style={s.tradeoffSection}>
          <Text style={s.tradeoffLabel}>The trade-off you've chosen</Text>
          <Text style={s.tradeoffBody}>{tradeoffProse}</Text>
        </View>

        {/* 7. Footer */}
        <View style={s.footer}>
          <Text style={s.footerText}>
            Take it / share it: heymitch.ai/tools/ai-native
          </Text>
          <Text style={s.footerText}>AI Dispatch on Substack</Text>
        </View>

      </Page>
    </Document>
  );
}
