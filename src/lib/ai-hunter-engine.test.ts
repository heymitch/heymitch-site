import { describe, expect, test } from 'vitest';
import { scan } from './ai-hunter-engine';

type SavedCatCase = {
  name: string;
  text: string;
  match: string;
};

const savedCatFlags = (text: string) =>
  scan(text).flags.filter(flag => flag.category === 'Saved Cat');

const savedCatCases: SavedCatCase[] = [
  {
    name: 'lesson outcome packaged as a badge',
    text: 'Capability earned today: write one prompt.',
    match: 'Capability earned today',
  },
  {
    name: 'saved artifact packaged as dashboard status',
    text: 'One saved prompt',
    match: 'One saved prompt',
  },
  {
    name: 'ordinary editing passes packaged as a method',
    text: 'Run your three-pass Climb.',
    match: 'three-pass Climb',
  },
  {
    name: 'spoken lesson packaged as a dashboard heading',
    text: 'What you will save today',
    match: 'What you will save today',
  },
  {
    name: 'routine check packaged as a concept',
    text: 'Use Visible Confirmation after every answer.',
    match: 'Visible Confirmation',
  },
  {
    name: 'ordinary review packaged as a method',
    text: 'Run The Answer Accountability Check before class ends.',
    match: 'The Answer Accountability Check',
  },
];

describe.each(savedCatCases)('high-confidence Saved Cat: $name', ({ text, match }) => {
  test('returns the exact blocking error and source span', () => {
    const flags = savedCatFlags(text);
    const expectedStart = text.indexOf(match);

    expect(flags).toHaveLength(1);
    expect(flags[0]).toMatchObject({
      category: 'Saved Cat',
      severity: 'error',
      label: 'Saved Cat',
      blocking: true,
      start: expectedStart,
      end: expectedStart + match.length,
      matchedText: match,
    });
  });
});

describe('Saved Cat category and grade behavior', () => {
  test('one blocking Saved Cat flag denies grade A', () => {
    const result = scan('Capability earned today.');

    expect(savedCatFlags('Capability earned today.')).toHaveLength(1);
    expect(result.score).toBe(88);
    expect(result.grade).toBe('B');
    expect(result.blockingCount).toBe(1);
    expect(result.hasBlockingFlags).toBe(true);
  });

  test('multiple Saved Cat flags deduct independently', () => {
    const text = 'Capability earned today.\n\nRun your three-pass Climb.';
    const result = scan(text);

    expect(savedCatFlags(text)).toHaveLength(2);
    expect(result.score).toBe(76);
    expect(result.grade).toBe('C');
    expect(result.blockingCount).toBe(2);
    expect(result.hasBlockingFlags).toBe(true);
  });
});

const keepCases = [
  {
    name: 'normal learning outcome',
    text: "By the end of today, you'll know how to build a prompt from scratch and test whether it did the job.",
  },
  {
    name: 'intended reader',
    text: 'Name the intended reader before you run the prompt.',
  },
  {
    name: 'pasted context',
    text: 'Check the pasted context before you use it.',
  },
  {
    name: 'labeled sections',
    text: 'Return the answer in three labeled sections.',
  },
  {
    name: 'bundled term',
    text: 'Charismatic is a bundled term.',
  },
  {
    name: 'normal save instruction',
    text: 'Save the prompt you would actually use again, plus the first and final answers.',
  },
  {
    name: 'plain numbered passes',
    text: 'Use Pass 1, Pass 2, and Pass 3 to keep the three runs separate.',
  },
  {
    name: 'source-named teaching tools',
    text: 'The Prompting Ladder includes Show the Target, Unbundle, Steel Man, and Secret Shopper.',
  },
];

describe.each(keepCases)('Saved Cat KEEP: $name', ({ text }) => {
  test('does not flag useful language or block an A grade', () => {
    const result = scan(text);

    expect(savedCatFlags(text)).toEqual([]);
    expect(result.blockingCount).toBe(0);
    expect(result.hasBlockingFlags).toBe(false);
    expect(result.grade).toBe('A');
  });
});

// Intentional hook authorization requires brief/source context. The deterministic
// engine does not receive that context, so semantic evaluation owns that decision.
