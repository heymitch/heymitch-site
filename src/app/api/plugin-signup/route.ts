import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { email, plugin } = body;

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const supabase = getSupabase();

  const { error } = await supabase
    .from('plugin_leads')
    .upsert(
      { email: email.toLowerCase().trim(), plugin: plugin ?? 'ai-hunter', created_at: new Date().toISOString() },
      { onConflict: 'email,plugin' }
    );

  if (error) {
    // Table may not exist yet — still let them download rather than hard-block
    console.error('plugin_leads insert error:', error.message);
  }

  return NextResponse.json({ ok: true });
}
