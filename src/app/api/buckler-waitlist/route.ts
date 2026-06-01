import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Insert-only. Supabase buckler_waitlist is the source of truth; the
// `buckler-kit-sync` edge function (driven by a 1-min pg_cron job) tags new
// rows into the Kit "Buckler Waitlist" tag using the Kit key held in Supabase
// secrets. Keeping the Kit key out of this app is deliberate.
interface WaitlistBody {
  email: string;
  currentTool?: string; // what they track with today
  payIntent?: string;
  note?: string;
}

export async function POST(request: NextRequest) {
  let body: WaitlistBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const email = (body.email ?? '').toLowerCase().trim();
  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from('buckler_waitlist').insert({
    email,
    current_tool: body.currentTool ?? null,
    pay_intent: body.payIntent ?? null,
    note: body.note ?? null,
    referrer: request.headers.get('referer'),
  });

  // 23505 = unique violation (already signed up). Idempotent, treat as success.
  if (error && error.code !== '23505') {
    console.error('buckler_waitlist insert error:', error.message);
    return NextResponse.json({ error: 'Could not save. Try again.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
