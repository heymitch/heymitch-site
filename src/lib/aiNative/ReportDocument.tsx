// AI-Native Archetype Report — @react-pdf/renderer document (~5 pages).
// Server-side only. No 'use client'. No images. No external fonts.
// Recommendations grounded in the State of AI Q1 2026 Tools Guide.

import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import type { ScoreResult } from './types';
import { ARCHETYPES, AXIS_META, bandForAltitude } from './model';
import { RECOMMENDATIONS, MARQUEE_TOOLS } from './recommendations';
import { AIWS_NAME, AIWS_PRICE, AIWS_URL, AIWS_PITCH, AI_DISPATCH_NAME, AI_DISPATCH_URL } from './links';

const COLOR = {
  cream:   '#F0E4D0',
  white:   '#FFFFFF',
  ink:     '#2D2118',
  muted:   '#4A3A2A',
  orange:  '#E8682A',
  teal:    '#2B6B8A',
  green:   '#5B8C5A',
  faint:   '#b4a898',
  surface: '#FAF6F0',
} as const;

const AXIS_COLOR: Record<string, string> = {
  autonomy: COLOR.orange,
  openness: COLOR.teal,
  value:    COLOR.green,
};

const s = StyleSheet.create({
  page: { backgroundColor: COLOR.cream, paddingHorizontal: 48, paddingVertical: 44, fontFamily: 'Helvetica', flexDirection: 'column' },
  eyebrowRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  eyebrow: { fontSize: 8, letterSpacing: 2, color: COLOR.muted, textTransform: 'uppercase' },
  siteTag: { fontSize: 8, color: COLOR.faint },

  archetypeName: { fontSize: 42, fontFamily: 'Helvetica-Bold', color: COLOR.ink, lineHeight: 1.05, marginBottom: 6 },
  tagline: { fontSize: 13, color: COLOR.muted, lineHeight: 1.4, marginBottom: 14 },
  tierLine: { fontSize: 11, color: COLOR.ink, marginBottom: 8, borderTopWidth: 1, borderTopColor: COLOR.faint, paddingTop: 10 },
  tierHighlight: { fontFamily: 'Helvetica-Bold', color: COLOR.ink },
  levelBlurb: { fontSize: 10, color: COLOR.muted, lineHeight: 1.5, marginBottom: 26, fontStyle: 'italic' },

  sectionLabel: { fontSize: 8, letterSpacing: 1.5, color: COLOR.muted, textTransform: 'uppercase', marginBottom: 12 },
  pageTitle: { fontSize: 22, fontFamily: 'Helvetica-Bold', color: COLOR.ink, marginBottom: 14, lineHeight: 1.15 },
  body: { fontSize: 11, color: COLOR.muted, lineHeight: 1.6, marginBottom: 14 },

  scoreRow: { marginBottom: 12 },
  scoreRowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 },
  scoreAxisName: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLOR.ink },
  scoreAxisSublabel: { fontSize: 8, color: COLOR.muted, marginLeft: 4 },
  scorePct: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLOR.ink },
  barTrack: { height: 7, backgroundColor: COLOR.surface, borderRadius: 4, overflow: 'hidden', width: '100%' },
  barFill: { height: 7, borderRadius: 4 },
  scoreNote: { fontSize: 8, color: COLOR.faint, marginTop: 3, fontStyle: 'italic' },

  caveatBox: { backgroundColor: COLOR.surface, borderLeftWidth: 3, borderLeftColor: COLOR.orange, borderRadius: 4, padding: 12, marginTop: 18 },
  caveatLabel: { fontSize: 8, letterSpacing: 1, color: COLOR.orange, textTransform: 'uppercase', marginBottom: 4, fontFamily: 'Helvetica-Bold' },
  caveatBody: { fontSize: 10, color: COLOR.muted, lineHeight: 1.5 },

  climbBox: { backgroundColor: COLOR.ink, borderRadius: 6, padding: 18, marginBottom: 18 },
  climbLabel: { fontSize: 8, letterSpacing: 1.5, color: COLOR.faint, textTransform: 'uppercase', marginBottom: 6 },
  climbMove: { fontSize: 13, color: COLOR.cream, fontFamily: 'Helvetica-Bold', lineHeight: 1.45 },

  recoHeadline: { fontSize: 14, fontFamily: 'Helvetica-Bold', color: COLOR.ink, lineHeight: 1.35, marginBottom: 18 },
  recoCard: { backgroundColor: COLOR.surface, borderRadius: 6, padding: 14, marginBottom: 12 },
  recoKind: { fontSize: 8, letterSpacing: 1, color: COLOR.faint, textTransform: 'uppercase', marginBottom: 3 },
  recoName: { fontSize: 13, fontFamily: 'Helvetica-Bold', color: COLOR.ink, marginBottom: 4 },
  recoWhy: { fontSize: 10, color: COLOR.muted, lineHeight: 1.5 },
  recoTag: { fontSize: 8, color: COLOR.green, fontFamily: 'Helvetica-Bold' },

  firstStepBox: { borderWidth: 1, borderColor: COLOR.orange, borderRadius: 6, padding: 14, marginTop: 6 },
  firstStepLabel: { fontSize: 8, letterSpacing: 1, color: COLOR.orange, textTransform: 'uppercase', marginBottom: 5, fontFamily: 'Helvetica-Bold' },
  firstStepBody: { fontSize: 11, color: COLOR.ink, lineHeight: 1.5, fontFamily: 'Helvetica-Bold' },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 },
  chip: { backgroundColor: COLOR.ink, color: COLOR.cream, fontSize: 9, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 999, marginRight: 6, marginBottom: 6 },
  chipEmpty: { fontSize: 10, color: COLOR.faint, fontStyle: 'italic', marginBottom: 16 },

  payRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  payTier: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: COLOR.ink },
  payWho: { fontSize: 10, color: COLOR.muted },

  ctaBox: { backgroundColor: COLOR.ink, borderRadius: 8, padding: 22, marginTop: 8 },
  ctaTitle: { fontSize: 18, fontFamily: 'Helvetica-Bold', color: COLOR.cream, marginBottom: 8 },
  ctaBody: { fontSize: 11, color: COLOR.cream, lineHeight: 1.5, marginBottom: 14, opacity: 0.9 },
  ctaLink: { fontSize: 12, fontFamily: 'Helvetica-Bold', color: COLOR.orange },

  footer: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: COLOR.faint, paddingTop: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { fontSize: 8, color: COLOR.faint },
});

const pct = (v: number): number => Math.round(v * 100);
const barWidth = (v: number): string => `${Math.min(1, Math.max(0, v)) * 100}%`;

function ScoreRow({ axis, value, isTradeoff }: { axis: 'autonomy' | 'openness' | 'value'; value: number; isTradeoff?: boolean }) {
  const meta = AXIS_META[axis];
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
        <View style={[s.barFill, { width: barWidth(value), backgroundColor: AXIS_COLOR[axis] }]} />
      </View>
      {isTradeoff && <Text style={s.scoreNote}>No wrong side here. This one is a trade-off, not a climb.</Text>}
    </View>
  );
}

function RecoCard({ kind, name, why, owned }: { kind: string; name: string; why: string; owned: boolean }) {
  return (
    <View style={s.recoCard}>
      <Text style={s.recoKind}>{kind}</Text>
      <Text style={s.recoName}>
        {name}
        {owned ? <Text style={s.recoTag}>  · you already use this</Text> : <Text style={s.recoTag}>  · new for you</Text>}
      </Text>
      <Text style={s.recoWhy}>{why}</Text>
    </View>
  );
}

export function buildReport(result: ScoreResult): React.ReactElement {
  const archetype = ARCHETYPES.find(a => a.name === result.archetype) ?? ARCHETYPES[0];
  const reco = RECOMMENDATIONS[archetype.name];
  const altitudePct = pct(result.altitude);
  const band = bandForAltitude(result.altitude);

  const toolLabel = (id: string) => MARQUEE_TOOLS.find(t => t.id === id)?.label ?? id;
  const usesByLabel = new Set(result.selectedTools.map(toolLabel));
  const owns = (name: string) => usesByLabel.has(name);

  // Data-driven "where you are" line (autonomy vs openness balance).
  const a = result.subScores.autonomy;
  const o = result.subScores.openness;
  const balanceLine =
    Math.abs(a - o) < 0.12
      ? 'Your Autonomy and Openness are roughly matched. You are climbing both together, which is the healthy way up.'
      : a > o
        ? 'You lean more autonomous than open. Things run, but a lot of it may live in your head. Openness is your next unlock.'
        : 'You lean more open than autonomous. It is legible and shareable, but not much runs on its own yet. Autonomy is your next unlock.';

  const tradeoffProse =
    'Two people can sit at the exact same altitude, same autonomy, same openness, and split hard on Build versus Buy. ' +
    'The Mogul bets on speed: best tools off the shelf, low maintenance, happy to let vendors own the engine. ' +
    'Hormozi lives here, and he is not wrong. ' +
    'The Sovereign bets the other way, on control: owns the stack, runs open source, replaceable by no one. Also not wrong. ' +
    'This axis is not a level. It is a choice about what you want to own, and your score just marks where you stand today. ' +
    'You can move it on purpose.';

  return (
    <Document title={`AI-Native Archetype Report — ${archetype.name}`} author="heymitch.ai" subject="How AI-Native Are You?">

      {/* ── PAGE 1 — Hero + standing ─────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <View style={s.eyebrowRow}>
          <Text style={s.eyebrow}>AI-Native Archetype Report</Text>
          <Text style={s.siteTag}>heymitch.ai</Text>
        </View>
        <Text style={s.archetypeName}>{archetype.name}</Text>
        <Text style={s.tagline}>{archetype.tagline}</Text>
        <Text style={s.tierLine}>
          <Text style={s.tierHighlight}>{band.name}-tier</Text>
          {'  ·  AI-native altitude '}
          <Text style={s.tierHighlight}>{altitudePct}/100</Text>
        </Text>
        <Text style={s.levelBlurb}>{band.blurb}</Text>

        <Text style={s.sectionLabel}>Your three axes</Text>
        <ScoreRow axis="autonomy" value={result.subScores.autonomy} />
        <ScoreRow axis="openness" value={result.subScores.openness} />
        <ScoreRow axis="value" value={result.subScores.value} isTradeoff />

        {result.caveat && (
          <View style={s.caveatBox}>
            <Text style={s.caveatLabel}>One honest note</Text>
            <Text style={s.caveatBody}>{result.caveat}</Text>
          </View>
        )}

        <View style={s.footer}>
          <Text style={s.footerText}>How AI-Native Are You? · heymitch.ai/tools/ai-native</Text>
          <Text style={s.footerText}>1 / 5</Text>
        </View>
      </Page>

      {/* ── PAGE 2 — Where you are + the trade-off ───────────────────────── */}
      <Page size="A4" style={s.page}>
        <Text style={s.pageTitle}>Where you actually stand</Text>
        <Text style={s.body}>{balanceLine}</Text>

        <View style={s.climbBox}>
          <Text style={s.climbLabel}>Your next climb move</Text>
          <Text style={s.climbMove}>{archetype.climbMove}</Text>
        </View>

        <Text style={s.sectionLabel}>The trade-off you have chosen</Text>
        <Text style={s.body}>{tradeoffProse}</Text>

        <View style={s.footer}>
          <Text style={s.footerText}>Build ↔ Buy is a choice, not a level.</Text>
          <Text style={s.footerText}>2 / 5</Text>
        </View>
      </Page>

      {/* ── PAGE 3 — What to learn next ──────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <Text style={s.eyebrow}>What to learn next · for the {archetype.name}</Text>
        <Text style={[s.recoHeadline, { marginTop: 10 }]}>{reco.headline}</Text>

        <RecoCard kind="The harness" name={reco.harness.name} why={reco.harness.why} owned={owns(reco.harness.name)} />
        <RecoCard kind="The tool" name={reco.tool.name} why={reco.tool.why} owned={owns(reco.tool.name)} />
        <RecoCard kind="The connector / skill" name={reco.connectorOrSkill.name} why={reco.connectorOrSkill.why} owned={owns(reco.connectorOrSkill.name)} />

        <View style={s.firstStepBox}>
          <Text style={s.firstStepLabel}>Your first step this week</Text>
          <Text style={s.firstStepBody}>{reco.firstStep}</Text>
        </View>

        <View style={s.footer}>
          <Text style={s.footerText}>Picks from Mitch&rsquo;s State of AI Tools Guide.</Text>
          <Text style={s.footerText}>3 / 5</Text>
        </View>
      </Page>

      {/* ── PAGE 4 — Your toolset + how to pay ───────────────────────────── */}
      <Page size="A4" style={s.page}>
        <Text style={s.pageTitle}>Your toolset, and the gap</Text>

        <Text style={s.sectionLabel}>Tools you told us you use</Text>
        {result.selectedTools.length > 0 ? (
          <View style={s.chipRow}>
            {result.selectedTools.map(id => (
              <Text key={id} style={s.chip}>{toolLabel(id)}</Text>
            ))}
          </View>
        ) : (
          <Text style={s.chipEmpty}>You didn&rsquo;t flag any yet. That just means everything below is open road.</Text>
        )}

        <Text style={s.body}>
          The three picks on the previous page are your ladder. Anything marked &ldquo;new for you&rdquo; is the
          gap between where you are and your next level. Start with the harness. The harness is what turns
          a pile of tools into a system that runs.
        </Text>

        <Text style={s.sectionLabel}>How to think about paying</Text>
        <View style={s.payRow}><Text style={s.payTier}>Free tier</Text><Text style={s.payWho}>Test everything. Most AI has a free layer worth using.</Text></View>
        <View style={s.payRow}><Text style={s.payTier}>$20 / month</Text><Text style={s.payWho}>Where most people live. One or two tools at paid tier.</Text></View>
        <View style={s.payRow}><Text style={s.payTier}>$200+ / month</Text><Text style={s.payWho}>Only if AI is genuinely your job 8+ hours a day.</Text></View>

        <View style={s.footer}>
          <Text style={s.footerText}>Don&rsquo;t buy the stack. Buy the next rung.</Text>
          <Text style={s.footerText}>4 / 5</Text>
        </View>
      </Page>

      {/* ── PAGE 5 — Next step + AI Writing Skool ────────────────────────── */}
      <Page size="A4" style={s.page}>
        <Text style={s.pageTitle}>The climb from here</Text>
        <Text style={s.body}>
          Your archetype is set by what you do, not what you own. The fastest way to change it is the one
          step on page three. Do that, and the next time you take this, the sphere moves. That is the
          whole game: one rung at a time.
        </Text>

        <View style={s.ctaBox}>
          <Text style={s.ctaTitle}>Climb faster inside {AIWS_NAME}</Text>
          <Text style={s.ctaBody}>
            {AIWS_PITCH} It is where the field guide becomes real builds. {AIWS_PRICE}.
          </Text>
          <Text style={s.ctaLink}>Join {AIWS_NAME} → {AIWS_URL}</Text>
        </View>

        <Text style={[s.body, { marginTop: 18 }]}>
          And every Monday, {AI_DISPATCH_NAME} drops the field guide free: {AI_DISPATCH_URL}
        </Text>

        <View style={s.footer}>
          <Text style={s.footerText}>heymitch.ai/tools/ai-native · share your archetype</Text>
          <Text style={s.footerText}>5 / 5</Text>
        </View>
      </Page>

    </Document>
  );
}
