// ai-native-kit-sync — retroactive Kit tagging for AI-Native quiz opt-ins.
// Polls ai_native_contacts (kit_synced_at IS NULL), reads the taker's archetype from
// ai_native_submissions, then upserts the Kit subscriber with custom fields, applies
// Quiz Lead + archetype tags, and enrolls Track-1. Source of truth = Supabase.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const KIT_API = 'https://api.kit.com/v4';
const QUIZ_LEAD_TAG_ID = 19849295;
const TRACK1_SEQUENCE_ID = 2772156;
const ARCHETYPE_TAG_ID: Record<string, number> = {
  Tinkerer: 19849296, Operator: 19849297, Builder: 19849298, Hermit: 19849299,
  Scribe: 19849300, Mogul: 19849301, Sovereign: 19849302, Wizard: 19849303,
};
// The one climb move per archetype — mirrors src/lib/aiNative/model.ts ARCHETYPES[].climbMove.
// Feeds the {{ subscriber.climb_move }} Liquid token in the day-0 Track-1 email.
const CLIMB_MOVE: Record<string, string> = {
  Tinkerer: 'Make one thing repeatable. Save a prompt you keep retyping, or install a skill. That is the first rung.',
  Operator: 'Take one workflow you run by hand and make it start itself. A trigger, a schedule, anything.',
  Builder: 'You can build. Now get one of your builds running without you in the loop, or hand it to someone who is not you.',
  Hermit: 'Pick your most important black box and make it legible. Write it down so a person, or an agent, could run it cold.',
  Scribe: 'Take your best doc and make it execute. Turn the map into an engine, even a small one.',
  Mogul: 'Nothing to climb. You are at altitude. Just own the bet you made: speed and focus over owning the thing.',
  Sovereign: 'Nothing to climb. You are at altitude and you own it. Keep it open, keep it yours.',
  Wizard: 'This is where the whole thing points. Your job now is keeping the fleet legible as it grows.',
};
const MAX_ATTEMPTS = 5;
const BATCH = 50;

const SITE_BASE = Deno.env.get('SITE_BASE_URL') ?? 'https://heymitch.ai';

function reportUrl(id: string): string {
  return `${SITE_BASE.replace(/\/+$/, '')}/api/ai-native/report?id=${id}`;
}
function tagIds(archetype: string): number[] {
  const id = ARCHETYPE_TAG_ID[archetype];
  return id ? [QUIZ_LEAD_TAG_ID, id] : [QUIZ_LEAD_TAG_ID];
}

async function kit(path: string, body: unknown, key: string): Promise<Response> {
  return fetch(`${KIT_API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Kit-Api-Key': key },
    body: JSON.stringify(body),
  });
}

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const kitKey = Deno.env.get('KIT_V4_KEY');
  if (!kitKey) {
    return new Response(JSON.stringify({ error: 'KIT_V4_KEY unset' }), { status: 500 });
  }

  // 1. Un-synced contacts that have a result and haven't blown the retry cap.
  const { data: contacts, error: cErr } = await supabase
    .from('ai_native_contacts')
    .select('id, email, submission_id, kit_sync_attempts')
    .is('kit_synced_at', null)
    .not('submission_id', 'is', null)
    .lt('kit_sync_attempts', MAX_ATTEMPTS)
    .limit(BATCH);
  if (cErr) return new Response(JSON.stringify({ error: cErr.message }), { status: 500 });
  if (!contacts?.length) return new Response(JSON.stringify({ synced: 0 }), { status: 200 });

  // 2. Archetype + level band for those submissions, in one query.
  const subIds = [...new Set(contacts.map((c) => c.submission_id))];
  const { data: subs } = await supabase
    .from('ai_native_submissions').select('id, archetype, level_band').in('id', subIds);
  const subById = new Map(
    (subs ?? []).map((s) => [s.id, s as { archetype: string; level_band: string | null }]),
  );

  let synced = 0;
  for (const c of contacts) {
    const sub = subById.get(c.submission_id);
    const archetype = sub?.archetype;
    if (!archetype) {
      await supabase.from('ai_native_contacts')
        .update({ kit_sync_attempts: (c.kit_sync_attempts ?? 0) + 1 }).eq('id', c.id);
      continue;
    }
    try {
      // a. Upsert subscriber with custom fields (mirrors the day-0 email Liquid tokens:
      //    {{ subscriber.archetype }} {{ subscriber.level }} {{ subscriber.climb_move }} {{ subscriber.report_url }}).
      const up = await kit('/subscribers', {
        email_address: c.email,
        fields: {
          archetype,
          level: sub?.level_band ?? '',
          climb_move: CLIMB_MOVE[archetype] ?? '',
          report_url: reportUrl(c.submission_id),
        },
      }, kitKey);
      if (!up.ok) throw new Error(`subscriber upsert ${up.status}`);

      // b. Tags (Quiz Lead + archetype).
      for (const tagId of tagIds(archetype)) {
        const t = await kit(`/tags/${tagId}/subscribers`, { email_address: c.email }, kitKey);
        if (!t.ok) throw new Error(`tag ${tagId} ${t.status}`);
      }

      // c. Enroll Track-1 LAST (after fields exist, so day-0 Liquid resolves).
      const seq = await kit(`/sequences/${TRACK1_SEQUENCE_ID}/subscribers`, { email_address: c.email }, kitKey);
      if (!seq.ok) throw new Error(`sequence ${seq.status}`);

      const { error: stampErr } = await supabase.from('ai_native_contacts')
        .update({ kit_synced_at: new Date().toISOString() }).eq('id', c.id);
      if (stampErr) {
        // Kit calls all succeeded but the stamp didn't land — leave unsynced; next poll
        // re-runs the idempotent Kit calls and re-stamps. Don't count it as synced.
        console.error('kit sync stamp failed for', c.email, stampErr.message);
      } else {
        synced++;
      }
    } catch (e) {
      console.error('kit sync failed for', c.email, (e as Error).message);
      await supabase.from('ai_native_contacts')
        .update({ kit_sync_attempts: (c.kit_sync_attempts ?? 0) + 1 }).eq('id', c.id);
    }
  }
  return new Response(JSON.stringify({ synced }), { status: 200 });
});
