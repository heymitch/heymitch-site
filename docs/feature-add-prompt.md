# Dashboard Feature-Add Prompt (template)

A fill-in-the-blanks prompt for adding a new data-backed section to an existing
Supabase-backed dashboard without breaking its data-layer pattern. Replace every
[BRACKET], then paste into your coding agent inside the dashboard's repo.

Step 1 reuses the acquisition-method verification prompt, so the feature wires up
through the least-friction, most-durable path (native connector first, API key last).

---

## Fill these in first

- FEATURE: [short name]
- WHAT IT SHOWS: [the metrics or breakdown this section displays]
- DECISION IT INFORMS: [the call this data lets you make]
- DATA SOURCE(S): [where the data lives: your own Supabase tables, or external platforms]
- DASHBOARD: [repo, route, projection endpoint, Supabase project ref]
- DESIGN SYSTEM: [the existing visual tokens to inherit: fonts, accent, surfaces, borders]
- COPY RULES: [any brand rules for user-facing text, or "none"]

---

## The prompt

You are adding a feature to an existing Supabase-backed dashboard. The dashboard is
a dumb renderer: one [ENDPOINT] endpoint is the projection layer, every data source
is an adapter that reports an honest status (live or pending), and the UI renders a
missing value as "—", never a fake 0. Do not break that pattern. Do not invent numbers.

FEATURE: [FEATURE]. It shows [WHAT IT SHOWS], so I can decide [DECISION IT INFORMS].
The data lives in [DATA SOURCE(S)]. The dashboard is [DASHBOARD]. Match this design
system: [DESIGN SYSTEM]. Copy rules: [COPY RULES].

Work in this order. Do not skip the verification step, and do not skip the production build.

### Step 1: Resolve how each metric reaches the dashboard

If the data already lives in my Supabase project, say so plainly and skip to Step 2:
read it directly with a SECURITY DEFINER aggregate, no connector needed.

If any metric comes from an external platform, run this verification first and report
the resolved method per source, with doc links, before writing any code:

> I'm building a marketing dashboard backed by Supabase. For each of these metric
> sources, [SOURCES], verify against the platform's official documentation how I can
> get this data into (or readable alongside) my Supabase-backed dashboard.
>
> Resolve the method in this priority order and tell me which one is actually
> available, with the doc link that confirms it:
>
> 1. Native Claude connector (Settings > Connectors > Browse), preferred, no keys
> 2. The platform's MCP server as a custom connector, if no native connector
> 3. Webhook to Supabase ingestion (the platform pushes events to a Supabase
>    endpoint or edge function), if it supports outbound webhooks
> 4. API key, last resort only; flag it explicitly so I can decide if it's worth it
>
> Do not assume. Check the live documentation. For each source, give me: the
> available method, the confirming doc link, and the setup steps. If a metric is
> only reachable via API key, say so plainly.

Stop after this step and show me the resolved methods before continuing.

### Step 2: Data layer

- Inspect the source table columns first. Do not guess column names. Read a few real
  rows so the aggregate matches reality.
- Write or extend a SECURITY DEFINER SQL function: set search_path = public, return a
  json_build_object of only the aggregates the UI needs, never select *. Grant execute
  to anon, authenticated, service_role. Apply it as a migration, not ad-hoc DDL.
- Test the function with a direct SQL call and paste the real result before wiring
  anything to the UI.
- Add or extend the adapter inside [ENDPOINT]: try/catch returns (never throws), derive
  status as configured-and-not-errored equals live, else pending. One dead source
  degrades its own tile to "—", it never 500s the whole endpoint.
- Keep the service-role key server-side only. The browser never sees it.

### Step 3: UI

- Add one new section to the dashboard route, bound to the new contract keys through
  the existing render path. Do not hard-code numbers in the markup.
- Inherit the design system. Numbers are the dominant element. A null renders as "—"
  in a muted color with a pending dot. The section header carries a small
  "source, status" line that flips live or pending from the contract.
- Cardless by default for stat strips. Use a chart only where the shape needs one.

### Step 4: Verify before calling it done

- Run the PRODUCTION build locally (the framework's build command), not just the dev
  server. The dev server does not type-check; the deploy does. Fix every type and lint
  error the build surfaces.
- Confirm: the gate redirects unauthenticated requests, the endpoint returns 200 with
  the auth cookie and 401 without, and the new section renders real data.
- Then commit, push, and confirm the deploy state flips to ready before declaring it
  live. A green local build is necessary but not sufficient.

### Guardrails

- NEVER ship the service-role key to the browser. Aggregates go through a SECURITY
  DEFINER function (read with the anon key) or server-side with the service key.
- ALWAYS set search_path = public on definer functions.
- ALWAYS run the production build before pushing. Do not rely on the dev server.
- Render a missing value as "—", never 0, when a connector is not live.
- Apply the brand copy rules to all user-facing text.
