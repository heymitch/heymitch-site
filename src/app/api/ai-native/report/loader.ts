import type { SupabaseClient } from '@supabase/supabase-js';
import type { ScoreResult } from '@/lib/aiNative/types';

/** Fetch the stored ScoreResult for a submission id, or null if absent/errored. */
export async function loadComputedById(
  supabase: SupabaseClient,
  id: string,
): Promise<ScoreResult | null> {
  const { data, error } = await supabase
    .from('ai_native_submissions')
    .select('computed')
    .eq('id', id)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { computed: ScoreResult }).computed ?? null;
}
