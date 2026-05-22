import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

interface OptInBody {
  submissionId?: string;
  sessionId?: string;
  email: string;
  optInDispatch?: boolean; // join the AI Dispatch list (Substack handled client-side via embed)
}

export async function POST(request: NextRequest) {
  let body: OptInBody;
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

  // Pure INSERT. consent_to_outreach defaults true on submit (the explicit contract
  // shown in the UI). submission_id links the email to their result row.
  const { error } = await supabase.from('ai_native_contacts').insert({
    submission_id: body.submissionId ?? null,
    email,
    opt_in_dispatch: body.optInDispatch ?? false,
  });

  if (error) {
    // Don't hard-block the PDF on a storage hiccup — log and continue.
    console.error('ai_native_contacts insert error:', error.message);
  }

  supabase
    .from('ai_native_events')
    .insert({ session_id: body.sessionId ?? null, event_type: 'optin', metadata: { opt_in_dispatch: body.optInDispatch ?? false } })
    .then(({ error: e }) => { if (e) console.error('ai_native_events:', e.message); });

  return NextResponse.json({ ok: true });
}
