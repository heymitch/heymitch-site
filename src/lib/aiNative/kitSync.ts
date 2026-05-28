// Shared constants + pure mapping for the AI-Native → Kit sync.
// Tag/field/sequence ids are from the "Advantage Coaching" Kit account (created 2026-05-28).
import type { ArchetypeName } from './types';

export const QUIZ_LEAD_TAG_ID = 19849295;
export const TRACK1_SEQUENCE_ID = 2772156;

export const ARCHETYPE_TAG_ID: Record<ArchetypeName, number> = {
  Tinkerer: 19849296,
  Operator: 19849297,
  Builder: 19849298,
  Hermit: 19849299,
  Scribe: 19849300,
  Mogul: 19849301,
  Sovereign: 19849302,
  Wizard: 19849303,
};

/** Tags to apply for a taker: always Quiz Lead, plus the archetype tag when recognized. */
export function tagIdsForArchetype(archetype: string): number[] {
  const id = ARCHETYPE_TAG_ID[archetype as ArchetypeName];
  return id ? [QUIZ_LEAD_TAG_ID, id] : [QUIZ_LEAD_TAG_ID];
}

/** The personalized report link emailed to the taker. */
export function buildReportUrl(submissionId: string, baseUrl: string): string {
  return `${baseUrl.replace(/\/+$/, '')}/api/ai-native/report?id=${submissionId}`;
}
