import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// Historical trends for the dashboard charts. Range-parameterized (?days=7|30|90).
// Reads the dashboard_history(days) SECURITY DEFINER aggregate: daily opt-ins,
// quiz submits, and revenue (zero-filled), plus the traffic/subscriber snapshot series.
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  // Gate: this rides alongside revenue data — never serve it unauthenticated.
  if (req.cookies.get('dash_auth')?.value !== 'granted') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const raw = parseInt(req.nextUrl.searchParams.get('days') ?? '30', 10);
  const days = Number.isFinite(raw) ? Math.min(Math.max(raw, 1), 365) : 30;

  try {
    const { data, error } = await getSupabase().rpc('dashboard_history', { days });
    if (error || !data) {
      return NextResponse.json({ days, daily: [], traffic: [], subscribers: [], live: false });
    }
    return NextResponse.json({ ...(data as Record<string, unknown>), live: true });
  } catch {
    return NextResponse.json({ days, daily: [], traffic: [], subscribers: [], live: false });
  }
}
