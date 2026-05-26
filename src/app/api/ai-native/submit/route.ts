import { NextRequest, NextResponse } from 'next/server';
import { randomUUID, createHash } from 'node:crypto';
import { getSupabase } from '@/lib/supabase';
import type { AnswerMap, ScoreResult } from '@/lib/aiNative/types';

// Never let the edge serve a stale submission id to a different user.
export const dynamic = 'force-dynamic';

interface SubmitBody {
  sessionId?: string;
  answers: AnswerMap;
  computed: ScoreResult;
  referrer?: string;
}

// Below this many total submissions, a percentile is noise — say "among the first".
const PERCENTILE_MIN_N = 20;

export async function POST(request: NextRequest) {
  let body: SubmitBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const { answers, computed } = body;
  if (!answers || !computed || typeof computed.altitude !== 'number' || !computed.archetype) {
    return NextResponse.json({ error: 'answers + computed required' }, { status: 400 });
  }

  // Non-scoring intent signal. Persisted to a dedicated `willingness` column (indexed
  // with altitude for the Capability × Intent routing query) and mirrored into the
  // submit-event metadata. Also rides inside `computed` jsonb as the source of truth.
  const willingness = computed.willingness ?? null;

  const id = randomUUID(); // server-side UUID — no select-back needed (PATTERNS.md §4)
  const sessionId = body.sessionId ?? randomUUID();
  const ua = request.headers.get('user-agent') ?? '';
  const userAgentHash = ua ? createHash('sha256').update(ua).digest('hex').slice(0, 16) : null;
  const referrer = body.referrer ?? request.headers.get('referer') ?? null;

  const supabase = getSupabase();

  // Pure INSERT, no .select() → equivalent to Prefer: return=minimal.
  const { error } = await supabase.from('ai_native_submissions').insert({
    id,
    session_id: sessionId,
    responses: answers,
    computed,
    archetype: computed.archetype,
    level_band: computed.level,
    altitude: computed.altitude,
    willingness,
    referrer,
    user_agent_hash: userAgentHash,
  });

  if (error) {
    console.error('ai_native_submissions insert error:', error.message);
    return NextResponse.json({ error: 'store_failed' }, { status: 502 });
  }

  // Fire-and-forget funnel telemetry.
  supabase
    .from('ai_native_events')
    .insert({ session_id: sessionId, event_type: 'submit', metadata: { archetype: computed.archetype, level: computed.level, willingness } })
    .then(({ error: e }) => { if (e) console.error('ai_native_events:', e.message); });

  // Leaderboard percentile: share of takers strictly below this altitude.
  let percentile: number | null = null;
  try {
    const [{ count: total }, { count: below }] = await Promise.all([
      supabase.from('ai_native_submissions').select('*', { count: 'exact', head: true }),
      supabase.from('ai_native_submissions').select('*', { count: 'exact', head: true }).lt('altitude', computed.altitude),
    ]);
    if (typeof total === 'number' && total >= PERCENTILE_MIN_N && typeof below === 'number') {
      percentile = Math.round((below / total) * 100);
    }
  } catch (e) {
    console.error('ai_native percentile error:', (e as Error).message);
  }

  return NextResponse.json({ id, sessionId, percentile });
}
