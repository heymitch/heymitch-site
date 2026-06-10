import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

// Insert-only. Supabase myrmidocs_waitlist is the source of truth. Mirrors the
// buckler-waitlist pattern: service-role insert from this route only, RLS on
// the table denies anon/authenticated. A downstream Kit sync (edge fn +
// pg_cron) can tag new rows later without putting the Kit key in this app.
interface WaitlistBody {
  email: string;
  useCase?: string; // what they'd run Myrmidocs for
  note?: string;
}

export async function POST(request: NextRequest) {
  let body: WaitlistBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").toLowerCase().trim();
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("myrmidocs_waitlist").insert({
    email,
    use_case: body.useCase ?? null,
    note: body.note ?? null,
    referrer: request.headers.get("referer"),
  });

  // 23505 = unique violation (already signed up). Idempotent, treat as success.
  if (error && error.code !== "23505") {
    console.error("myrmidocs_waitlist insert error:", error.message);
    return NextResponse.json(
      { error: "Could not save. Try again." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
