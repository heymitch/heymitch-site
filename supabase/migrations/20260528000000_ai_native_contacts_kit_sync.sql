-- Bookkeeping for the ai-native-kit-sync edge function (retroactive Kit tagging).
alter table public.ai_native_contacts
  add column if not exists kit_synced_at timestamptz,
  add column if not exists kit_sync_attempts integer not null default 0;

-- The poll query: un-synced rows that have a result to read, retry-capped.
create index if not exists ai_native_contacts_unsynced_idx
  on public.ai_native_contacts (kit_synced_at)
  where kit_synced_at is null;
