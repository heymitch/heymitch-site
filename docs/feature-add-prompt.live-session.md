# Live Session: Add "Quiz Results Insights" to /dashboard

The on-camera feature-add. The fresh standalone build (Track 1) proves the skill
zero-to-one; this proves the dashboard composes by adding a real section to the
already-live /dashboard. Pre-validated so it does not go sideways on camera.

Brand rule: no em dashes in any copy, on screen or in commits.

---

## Filled spec

- FEATURE: Quiz Results Insights
- WHAT IT SHOWS: archetype distribution, willingness (intent) split, average altitude,
  opt-in rate per archetype, level-band split
- DECISION IT INFORMS: which archetypes the quiz attracts, which segments are hot leads
  (critical + building intent), which archetypes actually convert to email
- DATA SOURCE(S): Supabase tables ai_native_submissions (archetype, level_band,
  altitude, willingness) and ai_native_contacts (opt-in, joined on submission_id)
- DASHBOARD: heymitch-site, route /dashboard, endpoint /api/metrics, Supabase project
  dquuimhmbofdhdsbdbly
- DESIGN SYSTEM: /dashboard tokens (near-black #16120E surfaces, parchment #F0E4D0 text,
  orange #E8682A accent, Jura display numerals, Silkscreen caps labels, hairline
  #413226 borders, scan-line panels)

## Step 1 (resolves instantly, say this on camera)

"The data is already in our Supabase project from the AI-Native quiz, so there is no
connector to wire. The verification prompt short-circuits: own data, read it directly
with a SECURITY DEFINER aggregate." Then show the priority ladder so they learn it,
and point out that an external source (Kit, Substack) is where you would actually run
the verification prompt.

## Step 2: data layer (reference target, build toward this live)

Inspect columns first (live: list_tables / a quick select), then apply this migration.
It returns only aggregates, runs as owner, exposes zero raw rows.

```sql
create or replace function public.dashboard_quiz_insights()
returns json
language sql
security definer
set search_path = public
stable
as $$
  select json_build_object(
    'total_submissions', (select count(*) from ai_native_submissions),
    'total_optins',      (select count(*) from ai_native_contacts),
    'avg_altitude',      (select round(avg(altitude)::numeric, 2) from ai_native_submissions),
    'by_archetype', coalesce((
      select json_agg(t) from (
        select s.archetype,
               count(*)                                                            as submissions,
               count(c.id)                                                         as optins,
               case when count(*) > 0
                    then round((count(c.id)::numeric / count(*)) * 100, 1)
                    else null end                                                  as optin_rate
        from ai_native_submissions s
        left join ai_native_contacts c on c.submission_id = s.id
        where s.archetype is not null
        group by s.archetype
        order by count(*) desc
      ) t
    ), '[]'::json),
    'by_willingness', coalesce((
      select json_agg(t) from (
        select coalesce(willingness, 'unknown') as willingness, count(*) as submissions
        from ai_native_submissions
        group by willingness order by count(*) desc
      ) t
    ), '[]'::json),
    'by_level', coalesce((
      select json_agg(t) from (
        select coalesce(level_band, 'unknown') as level_band, count(*) as submissions
        from ai_native_submissions
        group by level_band order by count(*) desc
      ) t
    ), '[]'::json)
  );
$$;
revoke all on function public.dashboard_quiz_insights() from public;
grant execute on function public.dashboard_quiz_insights() to anon, authenticated, service_role;
```

Test before wiring: `select public.dashboard_quiz_insights();` and read the JSON aloud.

## Step 2b: extend the /api/metrics contract

In src/app/api/metrics/route.ts, add a quiz adapter alongside the existing RPC call
(call dashboard_quiz_insights via getSupabase().rpc), then add to the response:

- `quiz`: the function result (or null on error)
- `sources.quiz`: live when the RPC succeeds, else pending

Own data, so this is a live tile from day one.

## Step 3: UI section on /dashboard

Add a "QUIZ INSIGHTS" block under the existing source ledger, reusing the page's
PanelTitleBar + HorizontalBar + StatCard helpers (already in src/app/dashboard/page.tsx):

- Stat strip: TOTAL SUBMISSIONS, EMAIL OPT-INS, AVG ALTITUDE, OVERALL OPT-IN RATE
- Panel "BY ARCHETYPE": horizontal bars of submissions, with opt-in rate per row
- Panel "INTENT SPLIT": willingness counts (critical + building flagged as hot)
- Panel "LEVEL BAND": level distribution
- Section header source line: "Supabase, ai_native_*, live"
- null renders as "—" with a pending dot. Numbers in Jura, labels in Silkscreen.

## Step 4: verify (the lesson from the 404)

1. `npm run build` locally (stop the dev server first, clear .next if it fights). Green,
   with /dashboard in the route table, before pushing.
2. Prod checks after deploy: /dashboard 307 to login, /api/metrics 401 without cookie
   and 200 with it and a `quiz` block present.
3. Push to main, watch the Vercel deploy flip to ready, then load it.

## Session beats (narration arc)

1. "We shipped /dashboard last time. Now we add a section without touching the renderer
   pattern: one endpoint, one adapter, honest status."
2. Run Step 1, show the verification ladder, explain own-data short-circuit.
3. Build the aggregate, run it, read the real JSON. Tie each number to a decision.
4. Add the adapter and the UI section. Reload, show it live.
5. Run the production build on camera. Call out: dev server does not type-check, the
   deploy does. This is why we build before we push.
6. Push, watch it go green, open the live URL.

## Honest caveat to say out loud

About 13 submissions today, so the bars are thin. That is the point: the section is
correct now and fills as quiz traffic grows. Show the mechanism, not a vanity chart.
