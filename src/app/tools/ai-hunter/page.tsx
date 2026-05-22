'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { scan, type ScanResult, type Flag } from '@/lib/ai-hunter-engine';

// ─── Design tokens ────────────────────────────────────────────────────────────

const C = {
  bg:      '#faf8f4',
  surface: '#ffffff',
  border:  '#e8e2d9',
  dark:    '#2D2118',
  mid:     '#7a6a58',
  faint:   '#b4a898',
  orange:  '#E8682A',
  cream:   '#F0E4D0',
  pass:    '#2b8a3e',
};

// ─── Per-category color palette ───────────────────────────────────────────────

interface CatColor { bg: string; line: string; text: string }

const CAT_COLORS: Record<string, CatColor> = {
  'Em Dash':             { bg: '#fff5f5', line: '#ff6b6b', text: '#c92a2a' },
  'Rhetorical Hook':     { bg: '#fff0f6', line: '#f783ac', text: '#a61e4d' },
  'Throat-Clearing':     { bg: '#fffbe0', line: '#ffe066', text: '#945c00' },
  'AI Transition':       { bg: '#e3fafc', line: '#3bc9db', text: '#0b7285' },
  'Corporate Jargon':    { bg: '#f3f0ff', line: '#9775fa', text: '#5f3dc4' },
  'Contrast Framing':    { bg: '#fff4e6', line: '#ffa94d', text: '#c05900' },
  'Formulaic Hook':      { bg: '#f4fce3', line: '#94d82d', text: '#3d6b00' },
  'Exclamation Overuse': { bg: '#e7f5ff', line: '#74c0fc', text: '#1864ab' },
  'Reframe Pattern':     { bg: '#f0fbf4', line: '#40c057', text: '#1a5c2a' },
  'Flat Rhythm':         { bg: '#fce4ec', line: '#f48fb1', text: '#880e4f' },
  'Staccato':            { bg: '#e8f5e9', line: '#66bb6a', text: '#1b5e20' },
};

function catColor(cat: string): CatColor {
  return CAT_COLORS[cat] ?? { bg: '#f5f5f5', line: '#bbb', text: '#555' };
}

// ─── Grade metadata ───────────────────────────────────────────────────────────

const GRADE_INFO: Record<string, { label: string; desc: string; color: string }> = {
  A: { label: 'Reads human',     desc: 'It\'s either 100% human or you kick ass at prompting.',          color: C.pass },
  B: { label: 'Mostly clean',    desc: 'Eh, you might get away with it.',                                color: '#1971c2' },
  C: { label: 'Needs work',      desc: 'A trained eye will clock this. The patterns are stacking.',      color: '#c05900' },
  D: { label: 'High risk',       desc: 'High risk.',                                                     color: '#d9480f' },
  F: { label: 'Rewrite needed',  desc: 'Slop on full display. This needs some human attention.',         color: '#c92a2a' },
};

// ─── Build "Copy for Claude" prompt ──────────────────────────────────────────

function buildClaudePrompt(text: string, result: ScanResult): string {
  const gi = GRADE_INFO[result.grade];
  const lines: string[] = [
    'Help me fix the AI writing patterns in this copy.',
    'I\'ve run it through AI Hunter, which detected the issues listed below.',
    'For each issue: suggest a specific rewrite that removes the AI tell while',
    'preserving my voice and meaning. Start with the highest-severity issues first.',
    '',
    `=== ORIGINAL TEXT (${result.stats.wordCount} words) ===`,
    text.trim(),
    '',
    `=== AI HUNTER SCAN: ${result.score}/100 — Grade ${result.grade} (${gi?.label ?? ''}) ===`,
  ];

  if (result.flags.length === 0) {
    lines.push('No issues found. Copy reads clean.');
  } else {
    result.flags.forEach((f, i) => {
      const snippet = f.matchedText.length > 60
        ? f.matchedText.slice(0, 58).trim() + '…'
        : f.matchedText.trim();
      lines.push('');
      lines.push(`${i + 1}. [${f.category}${f.severity === 'error' ? ' ⚠️ HIGH' : ''}] "${snippet}"`);
      lines.push(`   Why: ${f.explanation}`);
      lines.push(`   Fix: ${f.fix}`);
    });
  }

  lines.push('');
  lines.push('=== END ===');

  return lines.join('\n');
}

// ─── Highlighted text overlay ─────────────────────────────────────────────────
// Positioned absolute on top of the textarea.
// The div itself is pointer-events:none so clicks pass through to textarea.
// Individual <mark> elements have pointer-events:auto for hover detection.

function HighlightedText({
  text, flags, activeId, onHover,
}: {
  text: string;
  flags: Flag[];
  activeId: string | null;
  onHover: (id: string | null) => void;
}) {
  const ranges: Flag[] = [];
  let lastEnd = 0;
  for (const flag of [...flags].sort((a, b) => a.start - b.start)) {
    if (flag.start >= lastEnd && flag.end > flag.start && flag.end <= text.length) {
      ranges.push(flag);
      lastEnd = flag.end;
    }
  }

  const parts: React.ReactNode[] = [];
  let cursor = 0;

  for (const flag of ranges) {
    if (flag.start > cursor) {
      parts.push(
        <span key={`t-${cursor}`} style={{ whiteSpace: 'pre-wrap' }}>
          {text.slice(cursor, flag.start)}
        </span>
      );
    }
    const cc = catColor(flag.category);
    const isActive = activeId === flag.id;
    parts.push(
      <mark
        key={flag.id}
        onMouseEnter={() => onHover(flag.id)}
        onMouseLeave={() => onHover(null)}
        style={{
          background: isActive ? cc.line : cc.bg,
          color: isActive ? '#fff' : cc.text,
          borderBottom: `2px solid ${cc.line}`,
          borderRadius: 2,
          cursor: 'text',
          padding: '1px 0',
          whiteSpace: 'pre-wrap',
          transition: 'background 0.1s, color 0.1s',
          pointerEvents: 'auto',
        }}
      >
        {text.slice(flag.start, flag.end)}
      </mark>
    );
    cursor = flag.end;
  }

  if (cursor < text.length) {
    parts.push(
      <span key="t-end" style={{ whiteSpace: 'pre-wrap' }}>
        {text.slice(cursor)}
      </span>
    );
  }

  return <>{parts}</>;
}

// ─── Score ring ───────────────────────────────────────────────────────────────

function ScoreRing({ score, grade }: { score: number; grade: string }) {
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = GRADE_INFO[grade]?.color ?? C.faint;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <svg width={80} height={80} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
        <circle cx={40} cy={40} r={r} fill="none" stroke={C.border} strokeWidth={6} />
        <circle cx={40} cy={40} r={r} fill="none" stroke={color} strokeWidth={6}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.6s ease' }}
        />
        <text x={40} y={40} textAnchor="middle" dominantBaseline="central"
          style={{ transform: 'rotate(90deg)', transformOrigin: '40px 40px', fill: color, fontSize: 22, fontWeight: 800, fontFamily: 'inherit' }}>
          {grade}
        </text>
      </svg>
      <div>
        <div style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontSize: 11, color: C.faint, marginTop: 2 }}>/100</div>
      </div>
    </div>
  );
}

// ─── Sample text ──────────────────────────────────────────────────────────────

const SAMPLE = `In today's rapidly evolving landscape, it's crucial to understand that effective communication is the cornerstone of success. By leveraging cutting-edge strategies and fostering meaningful connections, you can navigate the complexities of modern business.

Furthermore, it's important to note that embracing innovation isn't just beneficial — it's essential for driving sustainable growth and unlocking your full potential. The key to transformative results lies in a holistic approach that seamlessly integrates all your systems.

Sound familiar? Most people overlook this. However, here's the truth: the solution is simpler than you think. That said, the brutal truth? You've been doing this wrong the whole time! On the other hand, with the right framework in place, you can streamline everything. Make sense?`;

// ─── Shared editor styles ─────────────────────────────────────────────────────
// Textarea and overlay must have pixel-perfect identical layout or the
// highlight positions will drift off the text they're meant to cover.

const EDITOR_STYLE: React.CSSProperties = {
  fontFamily: "'Space Grotesk', system-ui, sans-serif",
  fontSize: 16,
  lineHeight: 1.85,
  letterSpacing: 'normal',
  padding: '0 0 80px',
  margin: 0,
  width: '100%',
  boxSizing: 'border-box' as const,
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
};

// ─── Main component ───────────────────────────────────────────────────────────

export default function AIHunterTool() {
  const [input, setInput]         = useState(SAMPLE);
  const [result, setResult]       = useState<ScanResult | null>(null);
  const [scanning, setScanning]   = useState(false);
  const [typing, setTyping]       = useState(false);
  const [activeId, setActiveId]   = useState<string | null>(null);
  const [copied, setCopied]       = useState(false);
  const textareaRef               = useRef<HTMLTextAreaElement>(null);
  const debounceRef               = useRef<ReturnType<typeof setTimeout>>();
  const mirrorRef                 = useRef<HTMLDivElement>(null);
  // Popup card: position written directly to DOM on mousemove — zero re-renders on move
  const flagCardRef               = useRef<HTMLDivElement>(null);

  // Auto-resize textarea to match content
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = ta.scrollHeight + 'px';
  }, [input]);

  // Scan sample text on first load
  useEffect(() => { runScan(SAMPLE); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const runScan = useCallback((text: string) => {
    setScanning(true);
    setTimeout(() => {
      const r = scan(text);
      setResult(r);
      setScanning(false);
      setTyping(false);
      setActiveId(null);
    }, 40);
  }, []);

  const handleChange = (text: string) => {
    setInput(text);
    setTyping(true);
    setActiveId(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (text.trim().length >= 40) {
      debounceRef.current = setTimeout(() => runScan(text), 650);
    } else {
      setResult(null);
      setTyping(false);
    }
  };

  const copyForClaude = () => {
    if (!result) return;
    const prompt = buildClaudePrompt(input, result);
    navigator.clipboard.writeText(prompt).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const activeFlag = result?.flags.find(f => f.id === activeId) ?? null;
  const gradeInfo = result ? GRADE_INFO[result.grade] : null;

  // The overlay shows when there's a result AND the user isn't actively typing
  const showOverlay = Boolean(result && !typing);

  const categories: Record<string, Flag[]> = {};
  if (result) {
    for (const f of result.flags) {
      if (!categories[f.category]) categories[f.category] = [];
      categories[f.category].push(f);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: C.bg, fontFamily: "'Space Grotesk', system-ui, sans-serif", color: C.dark }}>

      {/* ── Nav ────────────────────────────────────────────────────────────── */}
      <nav style={{
        background: C.surface, borderBottom: `1px solid ${C.border}`,
        padding: '0 28px', height: 52, display: 'flex', alignItems: 'center', gap: 12,
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 19, color: C.dark, textDecoration: 'none' }}>
          hey<span style={{ color: C.orange }}>mitch</span>
        </Link>
        <span style={{ color: C.border }}>·</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.mid }}>AI Hunter</span>

        {scanning && (
          <span style={{ fontSize: 11, color: C.faint, marginLeft: 4, fontStyle: 'italic' }}>scanning…</span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          {input !== SAMPLE && (
            <button
              onClick={() => { setInput(SAMPLE); runScan(SAMPLE); setTyping(false); setActiveId(null); }}
              style={{ fontSize: 12, color: C.faint, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              reset sample
            </button>
          )}
          <a href="/resources/ai-hunter-v2" style={{ fontSize: 12, color: C.orange, textDecoration: 'none', fontWeight: 600 }}>
            Get the Cowork skill →
          </a>
        </div>
      </nav>

      {/* ── Body ───────────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', height: 'calc(100vh - 52px)' }}>

        {/* ── Writing canvas ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: 700, padding: '52px 32px 0' }}>

            {/* Hero — always visible */}
            <div style={{ marginBottom: 36 }}>
              <h1 style={{ fontSize: 36, fontWeight: 800, margin: '0 0 10px', color: C.dark, letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                Find the robot<br />in your writing.
              </h1>
              <p style={{ fontSize: 15, color: C.mid, margin: 0, lineHeight: 1.7, maxWidth: 520 }}>
                Good prompts still leave fingerprints. Paste your copy — AI Hunter highlights every tell
                inline and tells you exactly how to fix it. No account. No API. Nothing leaves your browser.
              </p>
            </div>

            {/* Sample indicator — visible only while showing the pre-loaded sample */}
            <div style={{ height: 24, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
              {input === SAMPLE && (
                <>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
                    background: C.border, color: C.mid, padding: '2px 7px', borderRadius: 3,
                  }}>Sample</span>
                  <span style={{ fontSize: 12, color: C.faint }}>Paste your own copy to replace this</span>
                </>
              )}
            </div>

            {/* ── The editor ────────────────────────────────────────────── */}
            {/* Stack: textarea (interaction layer) + overlay div (highlight layer).    */}
            {/* Both use identical EDITOR_STYLE so highlight positions never drift.     */}
            {/* The overlay div is pointer-events:none; marks inside it are auto.       */}
            <div style={{ position: 'relative' }}>

              {/* Highlight overlay — sits in front, lets clicks through to textarea */}
              {showOverlay && (
                <div
                  ref={mirrorRef}
                  aria-hidden="true"
                  style={{
                    ...EDITOR_STYLE,
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    color: C.dark,
                    pointerEvents: 'none',   // pass through; marks below override
                    zIndex: 2,
                    minHeight: textareaRef.current?.scrollHeight,
                  }}
                >
                  <HighlightedText
                    text={input}
                    flags={result!.flags}
                    activeId={activeId}
                    onHover={setActiveId}
                  />
                </div>
              )}

              {/* Textarea — always present, always the interaction surface */}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => handleChange(e.target.value)}
                onFocus={() => { if (result) { setTyping(true); } }}
                placeholder="Paste a LinkedIn post, email, newsletter, or any AI-assisted copy here…"
                style={{
                  ...EDITOR_STYLE,
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                  background: 'transparent',
                  // Text transparent when overlay showing — highlights appear instead
                  color: showOverlay ? 'transparent' : C.dark,
                  caretColor: C.dark,
                  border: 'none',
                  borderBottom: `2px solid ${C.border}`,
                  outline: 'none',
                  resize: 'none',
                  overflow: 'hidden',
                  minHeight: 280,
                  transition: 'color 0.05s',
                }}
              />
            </div>

            {/* Scanning indicator — brief flash while processing */}
            {scanning && (
              <div style={{ marginTop: 12, fontSize: 12, color: C.faint, fontStyle: 'italic' }}>
                scanning…
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ─────────────────────────────────────────────────────── */}
        <div style={{
          width: 320, flexShrink: 0,
          borderLeft: `1px solid ${C.border}`,
          background: C.surface,
          overflow: 'auto',
          display: 'flex', flexDirection: 'column',
        }}>

          {/* Empty state */}
          {!result && (
            <div style={{ padding: '28px 22px' }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.faint, marginBottom: 20, textTransform: 'uppercase' }}>
                What it catches
              </div>
              {[
                { cat: 'Em Dash',             desc: 'Nobody types — manually. It\'s the #1 tell.' },
                { cat: 'Rhetorical Hook',     desc: '"Sound familiar?" "Make sense?" "Right?"' },
                { cat: 'Throat-Clearing',     desc: '"Here\'s the truth:" "It\'s worth noting…"' },
                { cat: 'AI Transition',       desc: 'Furthermore. Moreover. Additionally.' },
                { cat: 'Corporate Jargon',    desc: 'leverage, seamless, robust, holistic, unlock.' },
                { cat: 'Contrast Framing',    desc: '"However," "That said," "On the other hand"' },
                { cat: 'Formulaic Hook',      desc: '"Most people…" "Stop doing…" "Nobody talks…"' },
                { cat: 'Exclamation Overuse', desc: 'More than one ! makes it a sales pitch.' },
                { cat: 'Reframe Pattern',      desc: '"You don\'t have X. You have Y." "It\'s not X. It\'s Y."' },
                { cat: 'Flat Rhythm',         desc: '3 sentences nearly the same length.' },
                { cat: 'Staccato',            desc: '3+ short sentences in a row.' },
              ].map(({ cat, desc }) => {
                const cc = catColor(cat);
                return (
                  <div key={cat} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: cc.line, flexShrink: 0, marginTop: 4 }} />
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.dark, marginBottom: 2 }}>{cat}</div>
                      <div style={{ fontSize: 11, color: C.faint, lineHeight: 1.45 }}>{desc}</div>
                    </div>
                  </div>
                );
              })}

              <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.faint, marginBottom: 14, textTransform: 'uppercase' }}>
                  Grades
                </div>
                {Object.entries(GRADE_INFO).map(([grade, gi]) => (
                  <div key={grade} style={{ display: 'flex', gap: 10, marginBottom: 12, alignItems: 'flex-start' }}>
                    <span style={{
                      width: 22, height: 22, borderRadius: 4, background: gi.color,
                      flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 800, color: '#fff',
                    }}>{grade}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: C.dark }}>{gi.label}</div>
                      <div style={{ fontSize: 11, color: C.faint, lineHeight: 1.4 }}>{gi.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>

              {/* Score */}
              <div style={{ padding: '24px 22px', borderBottom: `1px solid ${C.border}` }}>
                <ScoreRing score={result.score} grade={result.grade} />
                {gradeInfo && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: gradeInfo.color }}>{gradeInfo.label}</div>
                    <div style={{ fontSize: 12, color: C.mid, marginTop: 3, lineHeight: 1.5 }}>{gradeInfo.desc}</div>
                  </div>
                )}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 0', marginTop: 18 }}>
                  {[
                    ['Words', result.stats.wordCount],
                    ['Sentences', result.stats.sentenceCount],
                    ['Avg length', `${result.stats.avgSentenceLength}c`],
                    ['Flags', result.flags.length],
                  ].map(([l, v]) => (
                    <div key={l as string}>
                      <div style={{ fontSize: 10, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: C.dark }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA block — just under the grade */}
              <div style={{ padding: '14px 14px 16px', borderBottom: `1px solid ${C.border}` }}>
                <button
                  onClick={copyForClaude}
                  style={{
                    width: '100%', padding: '11px 16px',
                    background: copied ? C.pass : C.dark,
                    color: C.cream,
                    border: 'none', borderRadius: 6,
                    fontSize: 13, fontWeight: 700, cursor: 'pointer',
                    fontFamily: 'inherit', letterSpacing: '0.02em',
                    transition: 'background 0.2s',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    marginBottom: 6,
                  }}
                >
                  {copied ? (
                    <>✓ Copied — paste into Claude</>
                  ) : (
                    <>
                      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                        <rect x={9} y={3} width={6} height={4} rx={1} />
                      </svg>
                      Copy text + issues for Claude
                    </>
                  )}
                </button>
                <div style={{ fontSize: 10, color: C.faint, textAlign: 'center', lineHeight: 1.5, marginBottom: 10 }}>
                  Copies your text + every flag + a fix prompt.<br />
                  Paste directly into Claude to get rewrites.
                </div>
                <a
                  href="https://claudecodemarketingbootcamp.com"
                  style={{
                    display: 'block', padding: '9px', background: C.orange, color: '#fff',
                    borderRadius: 5, fontSize: 12, fontWeight: 600,
                    textDecoration: 'none', textAlign: 'center',
                  }}
                >
                  Learn to build this in CCMB →
                </a>
              </div>

              {/* Active flag popup — rendered in a portal-like fixed position so it
                  floats over the list without pushing anything down. */}

              {/* Flag list */}
              <div style={{ padding: '16px 0', flex: 1 }}>
                {result.flags.length === 0 ? (
                  <div style={{ padding: '12px 22px', fontSize: 13, color: C.pass, fontWeight: 500 }}>✓ All clear</div>
                ) : (
                  <>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.14em', color: C.faint, textTransform: 'uppercase', padding: '0 22px', marginBottom: 6 }}>
                      {result.flags.length} issue{result.flags.length !== 1 ? 's' : ''} · hover to inspect
                    </div>
                    {result.flags.map(flag => {
                      const cc = catColor(flag.category);
                      const isActive = activeId === flag.id;
                      const snippet = flag.matchedText.length > 36
                        ? flag.matchedText.slice(0, 34).trim() + '…'
                        : flag.matchedText.trim();
                      return (
                        <div
                          key={flag.id}
                          onMouseEnter={() => setActiveId(flag.id)}
                          onMouseMove={e => {
                            const card = flagCardRef.current;
                            if (!card) return;
                            const CARD_W = 288;
                            const CARD_H = 180;
                            const offset = 16;
                            let left = e.clientX - CARD_W - offset;
                            let top  = e.clientY + offset;
                            if (top + CARD_H > window.innerHeight - 8) top = e.clientY - CARD_H - offset;
                            left = Math.max(8, left);
                            top  = Math.max(8, top);
                            card.style.left = `${left}px`;
                            card.style.top  = `${top}px`;
                            card.style.visibility = 'visible';
                          }}
                          onMouseLeave={() => {
                            setActiveId(null);
                            if (flagCardRef.current) flagCardRef.current.style.visibility = 'hidden';
                          }}
                          style={{
                            display: 'flex', alignItems: 'flex-start', gap: 10,
                            padding: '8px 22px',
                            background: isActive ? cc.bg : 'transparent',
                            cursor: 'default', transition: 'background 0.1s',
                          }}
                        >
                          <span style={{ width: 8, height: 8, borderRadius: 2, background: cc.line, flexShrink: 0, marginTop: 5 }} />
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 12, fontWeight: 600, color: isActive ? cc.text : C.dark }}>{flag.label}</div>
                            {snippet && (
                              <div style={{ fontSize: 11, color: C.faint, fontStyle: 'italic', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {snippet}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ── Flag detail popup ─────────────────────────────────────────────────
           Position is written directly to the DOM on mousemove (zero re-renders).
           visibility:hidden when no flag active so it holds its last position
           without flashing. Content updates only when activeFlag changes. ── */}
      {(() => {
        const cc = activeFlag ? catColor(activeFlag.category) : { bg: '#fff', line: '#ccc', text: '#555' };
        return (
          <div
            ref={flagCardRef}
            style={{
              position: 'fixed',
              visibility: 'hidden',
              width: 288,
              zIndex: 200,
              background: cc.bg,
              border: `1px solid ${cc.line}`,
              borderLeft: `4px solid ${cc.line}`,
              borderRadius: 8,
              padding: '14px 16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.14)',
              pointerEvents: 'none',
              transition: 'background 0.1s, border-color 0.1s',
            }}
          >
            {activeFlag && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ background: cc.line, color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 3 }}>
                    {activeFlag.label}
                  </span>
                  <span style={{ fontSize: 10, color: C.faint }}>{activeFlag.category}</span>
                </div>
                {activeFlag.matchedText && activeFlag.matchedText.length < 80 && (
                  <div style={{ fontSize: 12, fontFamily: 'monospace', color: cc.text, background: cc.line + '25', padding: '4px 8px', borderRadius: 3, marginBottom: 10, overflowWrap: 'break-word' }}>
                    &ldquo;{activeFlag.matchedText.trim()}&rdquo;
                  </div>
                )}
                <p style={{ fontSize: 13, color: C.dark, margin: '0 0 10px', lineHeight: 1.55 }}>
                  {activeFlag.explanation}
                </p>
                <div style={{ borderTop: `1px solid ${cc.line}40`, paddingTop: 8 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.pass, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Fix → </span>
                  <span style={{ fontSize: 12, color: C.mid }}>{activeFlag.fix}</span>
                </div>
              </>
            )}
          </div>
        );
      })()}
    </div>
  );
}
