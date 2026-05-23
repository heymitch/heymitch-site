import { test, expect } from 'vitest';
import { scan } from '../ai-hunter-engine';
import { RECOMMENDATIONS } from './recommendations';
import type { ArchetypeName } from './types';

test('reco copy passes AI Hunter clean', () => {
  const samples: [string, string][] = [];
  (Object.keys(RECOMMENDATIONS) as ArchetypeName[]).forEach(name => {
    const r = RECOMMENDATIONS[name];
    samples.push([`${name} headline`, r.headline]);
    samples.push([`${name} harness`, r.harness.why]);
    samples.push([`${name} tool`, r.tool.why]);
    samples.push([`${name} skill`, r.connectorOrSkill.why]);
    samples.push([`${name} firstStep`, r.firstStep]);
  });

  // "harness" is a real domain term here (Claude Cowork IS an agent harness, and
  // it's a report category) — accept it; AI Hunter's generic jargon rule is a false
  // positive for this tool. Everything else (em-dashes, hooks, other jargon) must be clean.
  const accept = (cat: string, matched: string) =>
    cat === 'Corporate Jargon' && matched.trim().toLowerCase() === 'harness';

  let total = 0;
  for (const [name, text] of samples) {
    const res = scan(text);
    const flags = res.flags.filter(f => !accept(f.category, f.matchedText));
    total += flags.length;
    if (flags.length) {
      // eslint-disable-next-line no-console
      console.log(`  ${res.score}/100 ${name} ⚠ ${flags.map(f => `${f.category}:"${f.matchedText.trim()}"`).join(', ')}`);
    }
  }
  // eslint-disable-next-line no-console
  console.log(`  TOTAL FLAGS across ${samples.length} reco strings: ${total}`);
  expect(total).toBe(0);
});
