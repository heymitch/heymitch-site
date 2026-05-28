-- Run ai-native-kit-sync every minute: poll ai_native_contacts for un-synced opt-ins
-- and project them into Kit (tags, custom fields, Track-1 enrollment).
-- Mirrors the project's existing overnight-* jobs: pg_net http_post with the
-- service_role key pulled from the `supabase.service_role_key` GUC (no secret in this file).
create extension if not exists pg_cron;
create extension if not exists pg_net;

select cron.schedule(
  'ai-native-kit-sync-every-min',
  '* * * * *',
  $$
  select net.http_post(
    url := 'https://dquuimhmbofdhdsbdbly.supabase.co/functions/v1/ai-native-kit-sync',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('supabase.service_role_key', true),
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb
  );
  $$
);
