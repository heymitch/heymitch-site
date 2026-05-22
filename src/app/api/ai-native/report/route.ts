// POST /api/ai-native/report
// Accepts { computed: ScoreResult }, renders a PDF via @react-pdf/renderer,
// returns it as application/pdf with a content-disposition attachment header.

import { NextRequest, NextResponse } from 'next/server';
import { renderToBuffer } from '@react-pdf/renderer';
import { buildReport } from '@/lib/aiNative/ReportDocument';
import type { ScoreResult } from '@/lib/aiNative/types';

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
