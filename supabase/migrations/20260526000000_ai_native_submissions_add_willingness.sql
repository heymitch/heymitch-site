-- ai_native_submissions: add the non-scoring willingness (intent) signal.
-- Already applied to the live project (dquuimhmbofdhdsbdbly); kept here so the
-- schema the quiz code depends on is reproducible. Idempotent + safe to re-run.
--
-- willingness mirrors ScoreResult.willingness. It also rides inside the `computed`
-- jsonb (source of truth); this dedicated column exists so lead routing can segment
-- on Capability (altitude) x Intent (willingness) with an index instead of jsonb scans.

ALTER TABLE public.ai_native_submissions
  ADD COLUMN IF NOT EXISTS willingness text;

ALTER TABLE public.ai_native_submissions
  DROP CONSTRAINT IF EXISTS ai_native_submissions_willingness_check;

ALTER TABLE public.ai_native_submissions
  ADD CONSTRAINT ai_native_submissions_willingness_check
  CHECK (willingness IS NULL OR willingness IN ('critical', 'building', 'curious', 'none'));

CREATE INDEX IF NOT EXISTS ai_native_submissions_altitude_willingness_idx
  ON public.ai_native_submissions (altitude, willingness);
