// AI Hunter Engine v4 — exact character positions, per-category colors, contrast vocabulary
// Every flag has start + end. No API calls. Pure regex + structural analysis.

export interface Flag {
  id: string;
  category: string;
  severity: 'error' | 'warning' | 'info';
  start: number;
  end: number;
  label: string;        // short display name
  matchedText: string;  // the actual text that was flagged
  explanation: string;
  fix: string;
  /** A blocking flag prevents an approval-grade result regardless of score. */
  blocking?: boolean;
}

export interface ScanResult {
  score: number;
  grade: string;
  flags: Flag[];
  /** Approval metadata is optional so older ScanResult consumers still compile. */
  blockingCount?: number;
  hasBlockingFlags?: boolean;
  stats: {
    sentenceCount: number;
    avgSentenceLength: number;
    paragraphCount: number;
    wordCount: number;
    dashes: number;
    exclamations: number;
  };
}

// ─── Sentence splitter ────────────────────────────────────────────────────────

interface Sentence { text: string; start: number; end: number }

function getSentences(text: string): Sentence[] {
  const results: Sentence[] = [];
  const re = /[^.!?\n]+(?:[.!?]+|$)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const trimmed = m[0].trim();
    if (trimmed.length < 4) continue;
    const trStart = m.index + m[0].indexOf(trimmed[0]);
    results.push({ text: trimmed, start: trStart, end: trStart + trimmed.length });
  }
  return results;
}

function getGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 55) return 'D';
  return 'F';
}

let _flagId = 0;
function mkFlag(
  category: string,
  severity: Flag['severity'],
  start: number,
  end: number,
  rawText: string,
  label: string,
  explanation: string,
  fix: string,
  blocking = false,
): Flag {
  return {
    id: `f${_flagId++}`,
    category,
    severity,
    start,
    end,
    matchedText: rawText.slice(start, end),
    label,
    explanation,
    fix,
    blocking,
  };
}

// ─── Main scan ────────────────────────────────────────────────────────────────

export function scan(rawText: string): ScanResult {
  _flagId = 0;

  const analysisText = rawText
    .replace(/```[\s\S]*?```/g, m => ' '.repeat(m.length))
    .replace(/`[^`]+`/g, m => ' '.repeat(m.length));

  const flags: Flag[] = [];

  const sentences = getSentences(analysisText);
  const sentenceLengths = sentences.map(s => s.text.length);
  const paragraphs = analysisText.split(/\n\n+/).filter(p => p.trim().length > 3);
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
  const exclamations = (analysisText.match(/!/g) || []).length;
  const dashCount = (analysisText.match(/[—–]/g) || []).length;
  const avgLen = sentenceLengths.length
    ? sentenceLengths.reduce((a, b) => a + b, 0) / sentenceLengths.length : 0;

  // ─── EM DASHES ────────────────────────────────────────────────────────────

  const dashRe = /[—–]/g;
  let dm: RegExpExecArray | null;
  while ((dm = dashRe.exec(analysisText)) !== null) {
    flags.push(mkFlag(
      'Em Dash', 'error',
      dm.index, dm.index + 1,
      analysisText,
      'Em Dash',
      'Em dashes are the single biggest AI tell — nobody types them naturally.',
      'Replace with a comma, period, or restructure the clause.',
    ));
  }

  // ─── CRINGE QUESTIONS ─────────────────────────────────────────────────────

  const cringeQ: [RegExp, string, string][] = [
    [/sound familiar\??/gi, 'Sound familiar?', 'State what\'s familiar. Don\'t ask if they recognize it.'],
    [/ready to\b[^?!.\n]{0,30}[?]/gi, 'Ready to X?', 'Drop the pump-up question. Say the thing.'],
    [/guess what[?!]/gi, 'Guess what?', 'Cut it. Just say what.'],
    [/make sense\??/gi, 'Make sense?', 'If you need to ask, rewrite until it does.'],
    [/(?:^|\. )right\?/gim, 'Right?', 'Cut the tag. Let the sentence stand.'],
    [/see the pattern\??/gi, 'See the pattern?', 'Name the pattern. Don\'t ask if they see it.'],
    [/see the problem\??/gi, 'See the problem?', 'Name the problem.'],
    [/the brutal truth[?:]/gi, 'The brutal truth?', 'State the truth. Skip the label.'],
    [/the hard truth[?:]/gi, 'The hard truth?', 'State the truth.'],
    [/let that sink in[.!]/gi, 'Let that sink in.', 'Delete. If it lands, it lands.'],
    [/what if i told you/gi, 'What if I told you', 'Just tell them.'],
    [/and the (?:best|worst|wildest|craziest|real|kicker) part[?:!]/gi, 'And the X part?', 'Drop the setup. Say the thing.'],
    [/(?:^|\. )you know what[?!]/gim, 'You know what?', 'Cut it.'],
    [/coincidence\??/gi, 'Coincidence?', 'If it\'s not a coincidence, say why.'],
    [/wild, right\??/gi, 'Wild, right?', 'If it\'s wild, the sentence should show it.'],
  ];

  for (const [re, label, fix] of cringeQ) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Rhetorical Hook', 'error',
        m.index, m.index + m[0].length,
        analysisText,
        label,
        `Overused pattern: "${label}"`,
        fix,
      ));
    }
  }

  // ─── THROAT-CLEARING ──────────────────────────────────────────────────────

  const throatRe: [RegExp, string][] = [
    [/it'?s (?:crucial|important|essential|vital|worth noting) (?:that|to)\b/gi, 'Cut the setup. Start with the claim.'],
    [/in today'?s (?:rapidly evolving|fast-paced|ever-changing|modern|digital|competitive)\b/gi, 'Drop the scene-setter. Open with the tension.'],
    [/here'?s (?:what|why|how|the thing|the truth|the key|the reality|the deal)\s*:/gi, 'Cut the setup. Start with the actual point.'],
    [/the (?:truth|reality|bottom line|secret|key|answer|problem|issue|solution)\s+is\s*:/gi, 'State it directly. Skip the label.'],
    [/let me (?:be honest|tell you|explain|be clear)\s*:/gi, 'Cut. Just be honest.'],
    [/I (?:want|need|have) to (?:be honest|be clear|be transparent)/gi, 'Cut. Just say it.'],
    [/it'?s worth noting that/gi, 'Cut. Just note it.'],
    [/I(?:'m| am) here to tell you/gi, 'Cut the announcement. Say the thing.'],
  ];

  for (const [re, fix] of throatRe) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Throat-Clearing', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        'Throat-Clearing',
        `Setup with no payload: "${m[0].trim()}"`,
        fix,
      ));
    }
  }

  // ─── AI TRANSITIONS ───────────────────────────────────────────────────────

  const transitions: [string, string][] = [
    ['furthermore', 'Cut it. Start the next sentence.'],
    ['moreover', 'Cut it.'],
    ['additionally', 'Use "Also" or cut it.'],
    ['consequently', '"So" — always.'],
    ['nevertheless', '"But" — always.'],
    ['in conclusion', 'Cut. End with your strongest line.'],
    ['to summarize', 'Cut. They read it.'],
    ['in summary', 'Cut.'],
    ['at the end of the day', 'Cut. State the point.'],
    ['needless to say', 'Then don\'t say it.'],
    ['it goes without saying', 'Then don\'t say it.'],
    ['last but not least', 'Cut. Just say the last thing.'],
  ];

  for (const [phrase, fix] of transitions) {
    const re = new RegExp(`\\b${phrase}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'AI Transition', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        'AI Transition',
        `"${m[0]}" — AI's favorite way to connect paragraphs.`,
        fix,
      ));
    }
  }

  // ─── CORPORATE JARGON ─────────────────────────────────────────────────────

  const jargon: [string, string][] = [
    ['leverage', 'Use the real verb: use, run, deploy, build.'],
    ['synergy', 'Say what actually combines and why.'],
    ['robust', 'Delete or prove it: "handles X, Y, Z without breaking."'],
    ['seamless', 'Delete. Show it by describing the flow.'],
    ['cutting-edge', 'Name what\'s actually new.'],
    ['paradigm', '"The old way was X, the new way is Y."'],
    ['disruptive', 'Name what changes for whom.'],
    ['scalable', 'Say what it handles at 10x volume.'],
    ['ecosystem', 'Name the actual tools or players.'],
    ['streamline', '"Cut X steps, automate Y."'],
    ['empower', 'Use a real verb: give, build, let.'],
    ['utilize', '"use" — always.'],
    ['facilitate', '"help", "run", or "make possible."'],
    ['game-changer', 'Show the change. Don\'t label it.'],
    ['transformative', 'Describe the before and after specifically.'],
    ['unprecedented', 'Name the specific novelty.'],
    ['holistic', 'Delete or say which parts you mean.'],
    ['actionable', '"Actionable" adds no action.'],
    ['impactful', 'Name the impact in numbers.'],
    ['unlock', 'Say what becomes possible.'],
    ['delve', '"look at", "dig into", "examine."'],
    ['tapestry', 'Pick a less decorative word.'],
    ['nuanced', 'State the nuance instead of labeling it.'],
    ['supercharge', '"Speed up X by Y" — be specific.'],
    ['thought leader', 'Name what they actually know.'],
    ['innovative', 'Name the innovation.'],
    ['revolutionary', 'Show the revolution. Don\'t announce it.'],
    ['groundbreaking', 'Same — show it.'],
    ['foster', 'Use a real verb: build, grow, start, run.'],
    ['harness', '"use" or "tap" — always simpler.'],
    ['navigate', 'Name the actual challenge.'],
    ['cornerstone', '"The most important part is X."'],
    ['landscape', 'Delete the word. Name the situation.'],
    ['governance', 'Name the actual rules, people, or process.'],
    ['infrastructure', 'Name what it actually is: servers, pipes, teams, systems.'],
    ['quietly', 'If it\'s worth saying, say it plainly. "Quietly" is narrative decoration.'],
  ];

  for (const [word, fix] of jargon) {
    const escaped = word.replace(/-/g, '[- ]');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    let m: RegExpExecArray | null;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Corporate Jargon', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        'Jargon',
        `"${m[0]}" is corporate filler.`,
        fix,
      ));
      break; // first instance only per word
    }
  }

  // ─── SAVED CAT ────────────────────────────────────────────────────────────
  // Deterministic checks cover only exact, high-confidence voice fingerprints.
  // Whether coinage was intentional or a claim is true requires source context
  // and belongs in human-eval, not a broad regular expression.
  const savedCatPatterns: [RegExp, string, string][] = [
    [
      /\bcapability earned today\b/gi,
      'Packages a normal lesson outcome as a course badge.',
      'State what the learner will know or do in normal speech.',
    ],
    [
      /^[ \t]*(?:[-*#>]+\s*)?(?:\*\*)?one saved prompt(?:\*\*)?[ \t]*[.!:]?[ \t]*$/gim,
      'Turns a routine saved artifact into dashboard status language.',
      'Tell the reader which prompt and outputs to save.',
    ],
    [
      /\bthree[-\s]pass\s+climb\b/gi,
      'Brands three ordinary editing runs as a named method.',
      'Use Pass 1, Pass 2, and Pass 3, or simply tell the reader to try it.',
    ],
    [
      /^[ \t]*(?:[-*#>]+\s*)?(?:\*\*)?what you will save today(?:\*\*)?[ \t]*[.!:]?[ \t]*$/gim,
      'Makes spoken instruction sound like a course dashboard.',
      'State the outcome directly in a sentence the instructor would say aloud.',
    ],
    [
      /\bvisible confirmation\b/gi,
      'Renames a routine check as a branded concept.',
      'Say what the reader should check.',
    ],
    [
      /\bthe answer accountability check\b/gi,
      'Renames an ordinary answer review as a branded method.',
      'Tell the reader how to review the answer.',
    ],
  ];

  for (const [re, explanation, fix] of savedCatPatterns) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Saved Cat', 'error',
        m.index, m.index + m[0].length,
        analysisText,
        'Saved Cat',
        explanation,
        fix,
        true,
      ));
    }
  }

  // ─── CONTRAST FRAMING (structural: "not just X—Y") ────────────────────────

  const contrastStructural: [RegExp, string, string][] = [
    // "not just X—Y" and "isn't/aren't/wasn't just X—Y"
    [/(?:isn'?t|aren'?t|wasn'?t|weren'?t|not)\s+just\s+[^—–.!?\n]{2,60}[—–][^.!?\n]{3,60}/gi,
      'not/isn\'t just X — Y', 'Pick one. The negation + dash + affirmation is the tell.'],
    [/not (?:only|just) [^.!?\n]{3,40}but also/gi, 'not only X but also Y', 'Drop one. State the more important thing.'],
  ];

  for (const [re, label, fix] of contrastStructural) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Contrast Framing', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        'Possible Contrast',
        `Possible contrast framing: "${label}". This structure is common in AI writing — verify it's doing real work.`,
        fix,
      ));
    }
  }

  // ─── CONTRAST WORDS (pivot vocabulary) ───────────────────────────────────
  // These are the individual words/phrases AI reaches for to signal nuance.
  // Yellow-light patterns: not wrong per se, but stacking them is a tell.

  const contrastWords: [string, string][] = [
    ['however', '"So" or restructure. "However" is AI\'s single most-used pivot word.'],
    ['that said', 'Cut the pivot. Commit to a direction.'],
    ['having said that', 'Cut. Say the exception directly.'],
    ['then again', 'Pick a side and stay there.'],
    ['conversely', 'Show the contrast in the content, not with a transitional label.'],
    ['on the other hand', 'Name who thinks what. Don\'t float both sides.'],
    ['on the contrary', '"No." — always shorter.'],
    ['by contrast', 'Cut the label. Show the difference.'],
    ['in contrast', 'Same — show it.'],
    ['at the same time', 'Split into two sentences.'],
    ['to be fair', 'Cut, or name who\'s being fair about what specifically.'],
    ['admittedly', 'State the fact. Drop the hedge.'],
    ['all that being said', 'Cut. Either end or make the point.'],
    ['even so', '"But" — always.'],
    ['be that as it may', 'Delete. State the point.'],
    ['with that in mind', 'Cut. Just say the thing.'],
    ['that being said', 'Cut the pivot. Commit.'],
    ['despite this', 'Name what the contrast is. Don\'t just pivot.'],
    ['despite that', 'Name what the contrast is.'],
    ['while this is true', 'Cut. State the exception.'],
    ['on one hand', 'Drop the both-sides frame. Pick the stronger one.'],
  ];

  for (const [phrase, fix] of contrastWords) {
    const escaped = phrase.replace(/[- ]/g, '[\\s\\-]');
    const re = new RegExp(`\\b${escaped}\\b`, 'gi');
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Contrast Framing', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        'Possible Contrast',
        `Possible contrast pivot: "${m[0].trim()}". Common in AI writing — check if it's stacking with other patterns.`,
        fix,
      ));
    }
  }

  // ─── REFRAME PATTERNS ────────────────────────────────────────────────────
  // Cross-sentence negation → affirmation. The AI loves to "reframe" by
  // negating X in sentence 1 and affirming Y in sentence 2. Single-sentence
  // regex misses these because the pivot crosses a period boundary.

  const reframePatterns: [RegExp, string, string][] = [
    // "you don't have a X problem. you have a Y problem."
    // Catches same-noun-class flips: tool/handoff, time/priority, etc.
    [
      /you\s+don'?t\s+have\s+(?:a\s+|an\s+)?[a-z][^.!?\n]{0,50}[.!?]\s+you\s+have\s+(?:a\s+|an\s+)?/gi,
      'You don\'t have X. You have Y.',
      'State what the actual problem is. The reframe structure is the tell, not the insight.',
    ],
    // "it's not X. it's Y." / "it's not about X. it's about Y."
    [
      /it'?s\s+not\s+(?:about\s+)?(?:a\s+|an\s+|the\s+)?[a-z][^.!?\n]{1,60}[.!?]\s*it'?s\s+(?:about\s+)?/gi,
      'It\'s not X. It\'s Y.',
      'Commit to the second thing. The negation of the first is setup.',
    ],
    // "this isn't X. this is Y." / "this isn't about X. this is about Y."
    [
      /this\s+isn'?t\s+(?:about\s+)?[^.!?\n]{3,60}[.!?]\s*this\s+is\s+(?:about\s+)?/gi,
      'This isn\'t X. This is Y.',
      'Drop the negation. Just say what it is.',
    ],
    // "the X isn't Y. the X is Z." — same noun echoed across both sentences
    [
      /the\s+(\w+)\s+isn'?t\s+[^.!?\n]{3,50}[.!?]\s*the\s+\1\s+is\s+/gi,
      'The X isn\'t Y. The X is Z.',
      'Just say what the X is. The "isn\'t" sentence is filler.',
    ],
    // Orphan negation: sentence starting with "Not a" / "Not the" / "Not about"
    // e.g. "Not a tool problem. A handoff problem."
    [
      /(?:^|\n)\s*[Nn]ot\s+(?:a\s+|an\s+|the\s+|about\s+)[a-z][^.!?\n]{2,50}[.!?]/gm,
      'Not X. Y.',
      'These read like LinkedIn aphorisms. Say the thing you mean directly.',
    ],
    // "stop X. start Y." — action pivot pair
    [
      /\bstop\s+[a-z][^.!?\n]{2,50}[.!?]\s*start\s+/gi,
      'Stop X. Start Y.',
      'Earned once. Used ten times it\'s a template. Show the mechanism instead.',
    ],
    // "forget X. focus on Y." / "ignore X. focus on Y."
    [
      /\b(?:forget|ignore|skip|ditch|drop)\s+[a-z][^.!?\n]{2,50}[.!?]\s*(?:focus|start|do|use|build|try|think)\s+/gi,
      'Forget X. Focus on Y.',
      'Same structure as "Stop X. Start Y." — overused pivot.',
    ],
  ];

  for (const [re, label, fix] of reframePatterns) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Reframe Pattern', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        `Possible: ${label}`,
        `Possible reframe pattern: "${label}". Humans use this too — it's a flag, not a conviction. Check if it stacks.`,
        fix,
      ));
    }
  }

  // ─── FORMULAIC HOOKS ──────────────────────────────────────────────────────

  const hookRe: [RegExp, string, string][] = [
    [/^most (?:people|founders|operators|entrepreneurs|teams|companies|businesses|writers|creators)\b/gim,
      'Most people/founders…', 'Name who specifically, or drop the frame entirely.'],
    [/^everyone (?:says?|thinks?|believes?|knows?|loves?|wants?|talks?)\b/gim,
      'Everyone says/thinks…', 'Name who. "Everyone" is nobody.'],
    [/^stop (?:doing|trying|thinking|believing|using)\b/gim,
      'Stop [verb]ing…', 'Only use if truly earned — it\'s everywhere now.'],
    [/^nobody (?:talks?|tells?|shows?|wants?|mentions?)\b/gim,
      'Nobody talks about…', 'Somebody does. Name who ignores it and why.'],
    [/^no one (?:talks?|tells?|shows?|wants?|mentions?)\b/gim,
      'No one talks about…', 'Same problem.'],
  ];

  for (const [re, label, fix] of hookRe) {
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(analysisText)) !== null) {
      flags.push(mkFlag(
        'Formulaic Hook', 'warning',
        m.index, m.index + m[0].length,
        analysisText,
        'Hook Cliché',
        `Overused opener: "${label}"`,
        fix,
      ));
    }
  }

  // ─── EXCLAMATION OVERUSE ──────────────────────────────────────────────────

  if (exclamations > 1) {
    let count = 0;
    const exRe = /!/g;
    let em: RegExpExecArray | null;
    while ((em = exRe.exec(analysisText)) !== null) {
      count++;
      if (count > 1) {
        flags.push(mkFlag(
          'Exclamation Overuse', 'info',
          em.index, em.index + 1,
          analysisText,
          'Extra !',
          `${exclamations} exclamation marks. More than one makes it feel like a sales pitch.`,
          'Keep one. Let the words do the rest.',
        ));
      }
    }
  }

  // ─── STRUCTURAL CHECKS ────────────────────────────────────────────────────

  if (sentenceLengths.length >= 5) {
    // Flat rhythm: 3 consecutive same-length sentences
    for (let i = 0; i <= sentenceLengths.length - 3; i++) {
      const a = sentenceLengths[i], b = sentenceLengths[i + 1], c = sentenceLengths[i + 2];
      const spread = Math.max(a, b, c) - Math.min(a, b, c);
      if (spread < 10 && Math.min(a, b, c) > 20) {
        for (let j = i; j < i + 3; j++) {
          flags.push(mkFlag(
            'Flat Rhythm', 'info',
            sentences[j].start, sentences[j].end,
            analysisText,
            'Flat Rhythm',
            `3 sentences nearly identical in length (${a}, ${b}, ${c} chars). AI writes in uniform blocks.`,
            'Add a very short sentence, or let one run much longer.',
          ));
        }
        break;
      }
    }

    // Staccato: 3+ consecutive short sentences
    let consecutive = 0;
    let staccatoStart = -1;
    for (let i = 0; i < sentenceLengths.length; i++) {
      if (sentenceLengths[i] < 40) {
        if (consecutive === 0) staccatoStart = i;
        consecutive++;
        if (consecutive >= 3) {
          for (let j = staccatoStart; j <= i; j++) {
            flags.push(mkFlag(
              'Staccato', 'info',
              sentences[j].start, sentences[j].end,
              analysisText,
              'Staccato',
              '3+ short sentences in a row reads like a TikTok script, not prose.',
              'Merge two of these, or expand one with actual detail.',
            ));
          }
          consecutive = 0;
        }
      } else {
        consecutive = 0;
      }
    }
  }

  // ─── DEDUPLICATE + SCORE ──────────────────────────────────────────────────

  const seen = new Set<string>();
  const deduped = flags.filter(f => {
    const key = `${f.category}:${Math.floor(f.start / 8)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const weights: Record<Flag['severity'], number> = { error: 12, warning: 7, info: 4 };
  const totalDeductions = deduped.reduce((a, f) => a + weights[f.severity], 0);
  const score = Math.max(0, Math.min(100, 100 - totalDeductions));
  const blockingCount = deduped.filter(f => f.blocking).length;
  const calculatedGrade = getGrade(score);
  const grade = blockingCount > 0 && calculatedGrade === 'A' ? 'B' : calculatedGrade;

  return {
    score,
    grade,
    flags: deduped.sort((a, b) => a.start - b.start),
    blockingCount,
    hasBlockingFlags: blockingCount > 0,
    stats: {
      sentenceCount: sentences.length,
      avgSentenceLength: Math.round(avgLen),
      paragraphCount: paragraphs.length,
      wordCount,
      dashes: dashCount,
      exclamations,
    },
  };
}
