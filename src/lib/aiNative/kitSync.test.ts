import { describe, it, expect } from 'vitest';
import { buildReportUrl, tagIdsForArchetype, QUIZ_LEAD_TAG_ID, TRACK1_SEQUENCE_ID } from './kitSync';

describe('kitSync helpers', () => {
  it('builds the report url from id + base (no trailing slash issues)', () => {
    expect(buildReportUrl('abc-123', 'https://heymitch.ai')).toBe('https://heymitch.ai/ai-native/report?id=abc-123');
    expect(buildReportUrl('abc-123', 'https://heymitch.ai/')).toBe('https://heymitch.ai/ai-native/report?id=abc-123');
  });

  it('maps a known archetype to Quiz Lead + its archetype tag', () => {
    expect(tagIdsForArchetype('Wizard')).toEqual([QUIZ_LEAD_TAG_ID, 19849303]);
    expect(tagIdsForArchetype('Tinkerer')).toEqual([QUIZ_LEAD_TAG_ID, 19849296]);
  });

  it('falls back to just Quiz Lead for an unknown archetype', () => {
    expect(tagIdsForArchetype('Nope' as never)).toEqual([QUIZ_LEAD_TAG_ID]);
  });

  it('exposes the Track-1 sequence id', () => {
    expect(TRACK1_SEQUENCE_ID).toBe(2772156);
  });
});
