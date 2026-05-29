import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// S6 capstone marketing dashboard — the projection layer.
// One endpoint, many sources, honest status per source.
// null = "no connector yet" (UI shows —). 0 = "live and really zero".

export const dynamic = 'force-dynamic';

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

  const revenue = (m.revenue as Record<string, unknown>) ?? null;
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
  };

  return NextResponse.json({
    generated_at: m.generated_at ?? new Date().toISOString(),
    revenue,
    funnel,
    emails,
    traffic,
    manual,
    sources,
  });
}
