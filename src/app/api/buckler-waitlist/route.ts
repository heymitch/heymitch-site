import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Kit (ConvertKit v4) "Buckler Waitlist" tag. Subscribing to a tag creates the
// subscriber if needed and applies the tag in one call.
const KIT_BUCKLER_TAG_ID = 19989996;

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

  // PRIMARY: add to Kit and tag "Buckler Waitlist" (feeds the ai-dispatch audience).
  const kitKey = process.env.KIT_V4_KEY;
  if (kitKey) {
    try {
      const res = await fetch(`https://api.kit.com/v4/tags/${KIT_BUCKLER_TAG_ID}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': kitKey },
        body: JSON.stringify({ email_address: email }),
      });
      if (!res.ok) {
        console.error('kit tag-subscribe failed:', res.status, await res.text().catch(() => ''));
      }
    } catch (e) {
      console.error('kit tag-subscribe error:', (e as Error).message);
    }
  } else {
    console.error('KIT_V4_KEY not set — skipping Kit subscribe');
  }

  // BACKUP: raw log in Supabase so a lead is never lost on a Kit hiccup. Non-blocking.
  try {
    const supabase = getSupabase();
    const { error } = await supabase.from('buckler_waitlist').insert({
      email,
      current_tool: body.currentTool ?? null,
      pay_intent: body.payIntent ?? null,
      note: body.note ?? null,
      referrer: request.headers.get('referer'),
    });
    if (error && error.code !== '23505') {
      console.error('buckler_waitlist insert error:', error.message);
    }
  } catch (e) {
    console.error('buckler_waitlist insert threw:', (e as Error).message);
  }

  return NextResponse.json({ ok: true });
}
