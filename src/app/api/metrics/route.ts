import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// S6 capstone marketing dashboard — the projection layer.
// One endpoint, many sources, honest status per source.
// null = "no connector yet" (UI shows —). 0 = "live and really zero".

export const dynamic = 'force-dynamic';
// Never cache the Supabase fetch: metrics must reflect the latest snapshots,
// not a build-time copy. Without this, Next's Data Cache freezes /api/metrics.
export const fetchCache = 'force-no-store';

// Demo mode: serve illustrative revenue instead of the real SamCart figures.
// The dashboard is shown publicly (session/recording) and real revenue stays private.
// Real data is untouched in Supabase via dashboard_metrics(); flip to false to surface it.
const DEMO_REVENUE = true;
const DEMO_REVENUE_DATA = {
  net_30d: 18400,
  net_90d: 52700,
  gross_90d: 54200,
  refunded_90d: 1500,
  sales_30d: 42,
  sales_90d: 128,
  by_line: [
    { line: 'Bootcamp', net_90d: 31000, sales_90d: 60 },
    { line: 'Membership', net_90d: 12500, sales_90d: 40 },
    { line: 'Workshop', net_90d: 6200, sales_90d: 18 },
    { line: 'Templates', net_90d: 3000, sales_90d: 10 },
  ],
};

type SourceStatus = { status: 'live' | 'pending'; note: string };

export async function GET(req: NextRequest) {
  // Gate: this exposes business revenue — never serve it unauthenticated.
  if (req.cookies.get('dash_auth')?.value !== 'granted') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let m: Record<string, unknown> = {};
  let ownDataLive = true;
  try {
    const { data, error } = await getSupabase().rpc('dashboard_metrics');
    if (error || !data) ownDataLive = false;
    else m = data as Record<string, unknown>;
  } catch {
    ownDataLive = false;
  }

  // Quiz Results Insights: own data, so read it directly via a SECURITY DEFINER
  // aggregate (dashboard_quiz_insights). A failure here degrades only the quiz
  // tile to null/pending; it never blocks revenue or funnel.
  let quiz: Record<string, unknown> | null = null;
  let quizLive = true;
  try {
    const { data, error } = await getSupabase().rpc('dashboard_quiz_insights');
    if (error || !data) quizLive = false;
    else quiz = data as Record<string, unknown>;
  } catch {
    quizLive = false;
  }

  const revenue = DEMO_REVENUE ? DEMO_REVENUE_DATA : ((m.revenue as Record<string, unknown>) ?? null);
  const funnel = (m.funnel as Record<string, unknown>) ?? null;
  const emails = (m.emails as Record<string, unknown>) ?? null;
  const traffic = (m.traffic as Record<string, unknown>) ?? null;
  const manual = (m.manual as Record<string, Record<string, unknown>>) ?? null;

  const sources: Record<string, SourceStatus> = {
    revenue: ownDataLive
      ? { status: 'live', note: 'Supabase · SamCart · live' }
      : { status: 'pending', note: 'Supabase RPC unreachable' },
    funnel: ownDataLive
      ? { status: 'live', note: 'Supabase · quiz funnel · live' }
      : { status: 'pending', note: 'Supabase RPC unreachable' },
    emails: emails
      ? { status: 'live', note: 'Kit · snapshot · live' }
      : { status: 'pending', note: 'Kit · run the sync to populate' },
    traffic: traffic
      ? { status: 'live', note: 'Vercel · snapshot · live' }
      : { status: 'pending', note: 'Vercel · add analytics token' },
    linkedin: manual?.linkedin_followers
      ? { status: 'live', note: 'LinkedIn · manual entry' }
      : { status: 'pending', note: 'LinkedIn · manual entry (never automate)' },
    quiz: quizLive
      ? { status: 'live', note: 'Supabase · ai_native_* · live' }
      : { status: 'pending', note: 'Supabase RPC unreachable' },
  };

  return NextResponse.json({
    generated_at: m.generated_at ?? new Date().toISOString(),
    revenue,
    funnel,
    emails,
    traffic,
    manual,
    quiz,
    sources,
  });
}
