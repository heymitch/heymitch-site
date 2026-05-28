// POST /api/ai-native/report
// Accepts { computed: ScoreResult }, renders a PDF via @react-pdf/renderer,
// returns it as application/pdf with a content-disposition attachment header.

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { buildReport } from '@/lib/aiNative/ReportDocument';
import type { ScoreResult } from '@/lib/aiNative/types';
import { getSupabase } from '@/lib/supabase';
import { loadComputedById } from './loader';

// Never serve a cached PDF — each is personalised.
export const dynamic = 'force-dynamic';

interface ReportBody {
  computed: ScoreResult;
}

export async function POST(request: NextRequest) {
  let body: ReportBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  const { computed } = body;

  // Validate the minimum fields we need to render a meaningful report.
  if (
    !computed ||
    !computed.archetype ||
    typeof computed.altitude !== 'number' ||
    isNaN(computed.altitude)
  ) {
    return NextResponse.json(
      { error: 'computed.archetype and numeric computed.altitude are required' },
      { status: 400 },
    );
  }

  let pdfBuffer: Buffer;
  try {
    const element = buildReport(computed);
    pdfBuffer = await renderToBuffer(element);
  } catch (err) {
    console.error('ai_native report render error:', (err as Error).message);
    return NextResponse.json({ error: 'render_failed' }, { status: 500 });
  }

  const safeArchetype = computed.archetype.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  // Convert Node Buffer → Uint8Array so the Web API Response constructor accepts it.
  const pdfBytes = new Uint8Array(pdfBuffer);

  return new Response(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="ai-native-${safeArchetype}.pdf"`,
      'Content-Length': String(pdfBuffer.length),
    },
  });
}

// GET /api/ai-native/report?id=<submissionId>
// Public, link-safe: renders the stored result as a PDF for the Kit nurture email.
export async function GET(request: NextRequest) {
  const id = new URL(request.url).searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'id required' }, { status: 400 });
  }

  const computed = await loadComputedById(getSupabase(), id);
  if (!computed) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  let pdfBuffer: Buffer;
  try {
    pdfBuffer = await renderToBuffer(buildReport(computed));
  } catch (err) {
    console.error('ai_native report GET render error:', (err as Error).message);
    return NextResponse.json({ error: 'render_failed' }, { status: 500 });
  }

  const safeArchetype = computed.archetype.toLowerCase().replace(/[^a-z0-9-]/g, '-');
  return new Response(new Uint8Array(pdfBuffer), {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="ai-native-${safeArchetype}.pdf"`,
      'Content-Length': String(pdfBuffer.length),
    },
  });
}
