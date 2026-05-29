'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

// ─── Contract types (from /api/metrics) ───────────────────
type Source = { status: 'live' | 'pending'; note: string };
type Metrics = {
  generated_at: string;
  revenue: {
    net_30d: number; net_90d: number; gross_90d: number; refunded_90d: number;
    sales_30d: number; sales_90d: number;
    by_line: { line: string; net_90d: number; sales_90d: number }[];
  } | null;
  funnel: { quiz_submits: number; optins: number; optin_rate: number | null } | null;
  emails: { total_subscribers: number | null; net_new_30d: number | null; net_new_90d: number | null; open_rate: number | null; click_rate: number | null } | null;
  traffic: { visits_30d: number | null; pageviews_30d: number | null } | null;
  manual: Record<string, { label: string; value: number | null; unit: string | null; note: string | null }> | null;
  quiz: {
    total_submissions: number | null;
    total_optins: number | null;
    converted_submissions: number | null;
    avg_altitude: number | null;
    optin_rate: number | null;
    by_archetype: { archetype: string; submissions: number; optins: number; optin_rate: number | null }[];
    by_willingness: { willingness: string; submissions: number }[];
    by_level: { level_band: string; submissions: number }[];
  } | null;
  sources: Record<string, Source>;
};
type History = {
  days: number;
  daily: { day: string; optins: number; submits: number; revenue: number }[];
  traffic: { captured_at: string; visits: number; pageviews: number }[];
  subscribers: { captured_at: string; total: number }[];
  live: boolean;
};

// ─── Formatters: null → —, never a fake 0 ─────────────────
const money = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? '—' : '$' + new Intl.NumberFormat('en-US').format(Math.round(n));
const int = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? '—' : new Intl.NumberFormat('en-US').format(Math.round(n));
const pct = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? '—' : n + '%';
const shortDay = (s: string | number) => {
  const d = new Date(typeof s === 'string' && s.length <= 10 ? s + 'T00:00:00' : s);
  return Number.isNaN(d.getTime()) ? '' : `${d.getMonth() + 1}/${d.getDate()}`;
};

// ─── Shared styles (inherited from /signal design system) ──
const SCAN_LINE = 'repeating-linear-gradient(to bottom, transparent 0px, transparent 4px, rgba(28,22,18,0.4) 4px, rgba(28,22,18,0.4) 5px)';
const panelStyle: React.CSSProperties = { background: '#1C1612', border: '1px solid #413226', borderRadius: 2, position: 'relative', overflow: 'hidden' };
const tooltipStyle = { background: '#1C1612', border: '1px solid #413226', color: '#F0E4D0', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, borderRadius: 2, padding: '8px 12px' };

function ScanOverlay() {
  return <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: SCAN_LINE, zIndex: 1 }} />;
}
function PanelTitleBar({ title, source }: { title: string; source?: Source }) {
  return (
    <div style={{ background: '#100E0C', borderBottom: '1px solid #413226', padding: '6px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 9, letterSpacing: '0.2em', color: '#6E604E' }}>{title}</span>
      {source && <SourceDot source={source} />}
    </div>
  );
}
function SourceDot({ source }: { source: Source }) {
  const live = source.status === 'live';
  return (
    <span title={source.note} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: live ? '#82C896' : '#6E604E' }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: live ? '#82C896' : '#FFB86C', opacity: live ? 1 : 0.7, boxShadow: live ? '0 0 6px #82C896' : 'none' }} />
      {source.note}
    </span>
  );
}
function StatCard({ label, value, sub, color = '#F0E4D0', source }: { label: string; value: string; sub?: string; color?: string; source?: Source }) {
  return (
    <div style={panelStyle}>
      <ScanOverlay />
      <PanelTitleBar title={label} source={source} />
      <div style={{ padding: '18px 16px' }}>
        <div style={{ color, fontSize: 27, fontFamily: "'Jura', sans-serif", fontWeight: 300, lineHeight: 1, whiteSpace: 'nowrap' }}>{value}</div>
        {sub && <div style={{ color: '#82C896', fontSize: 10, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>}
      </div>
    </div>
  );
}

// HorizontalBar: token-matched row bar with label, value-scaled fill, count, optional badge.
function HorizontalBar({
  label, value, max, count, badge, badgeColor = '#82C896', fill = '#E8682A',
}: {
  label: string; value: number; max: number; count: string;
  badge?: string; badgeColor?: string; fill?: string;
}) {
  const w = max > 0 ? Math.max(2, Math.round((value / max) * 100)) : 0;
  return (
    <div style={{ padding: '10px 0', borderBottom: '1px solid rgba(65,50,38,0.4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#F0E4D0' }}>{label}</span>
        <span style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          {badge && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: badgeColor }}>{badge}</span>}
          <span style={{ fontFamily: "'Jura', sans-serif", fontWeight: 300, fontSize: 18, color: '#F0E4D0' }}>{count}</span>
        </span>
      </div>
      <div style={{ height: 6, background: 'rgba(65,50,38,0.4)', borderRadius: 1, overflow: 'hidden' }}>
        <div style={{ width: `${w}%`, height: '100%', background: fill, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

export default function MarketingOps() {
  const [d, setD] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/metrics', { credentials: 'same-origin', cache: 'no-store' })
      .then(r => {
        if (r.status === 401) { window.location.href = '/dashboard/login?from=/dashboard'; return null; }
        if (!r.ok) throw new Error('metrics endpoint error');
        return r.json();
      })
      .then(j => { if (j) { setD(j); setErr(null); } })
      .catch(() => setErr('Failed to load metrics.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const [hist, setHist] = useState<History | null>(null);
  const [range, setRange] = useState(30);
  const [histLoading, setHistLoading] = useState(false);
  const loadHistory = useCallback((days: number) => {
    setHistLoading(true);
    fetch(`/api/history?days=${days}`, { credentials: 'same-origin', cache: 'no-store' })
      .then(r => (r.ok ? r.json() : null))
      .then(j => { if (j) setHist(j); })
      .catch(() => {})
      .finally(() => setHistLoading(false));
  }, []);
  useEffect(() => { loadHistory(range); }, [range, loadHistory]);

  const rev = d?.revenue;
  const fun = d?.funnel;
  const em = d?.emails;
  const src = d?.sources ?? {};
  const tr = d?.traffic;
  const li = d?.manual?.linkedin_followers;
  const qz = d?.quiz;
  const archMax = Math.max(1, ...(qz?.by_archetype ?? []).map(a => a.submissions));
  const willMax = Math.max(1, ...(qz?.by_willingness ?? []).map(w => w.submissions));
  const lvlMax = Math.max(1, ...(qz?.by_level ?? []).map(l => l.submissions));
  const isHotIntent = (w: string) => /critical|building/i.test(w);

  return (
    <div style={{ background: '#16120E', minHeight: '100vh', color: '#F0E4D0', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Nav */}
      <nav style={{ background: '#100E0C', borderBottom: '1px solid #413226', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 10, color: '#6E604E', letterSpacing: '0.2em' }}>◈ MARKETING OPS</span>
        <Link href="/signal" style={{ color: '#6E604E', textDecoration: 'none', fontFamily: "'Silkscreen', monospace", fontSize: 9, letterSpacing: '0.15em' }}>SIGNAL ↗</Link>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 10, color: '#6E604E', fontFamily: "'JetBrains Mono', monospace" }}>
            {d ? `updated ${new Date(d.generated_at).toLocaleString()}` : 'loading…'}
          </span>
          <button onClick={() => { load(); loadHistory(range); }} disabled={loading} style={{
            padding: '5px 12px', background: loading ? 'transparent' : '#E8682A', color: loading ? '#6E604E' : '#16120E',
            border: '1px solid #413226', cursor: loading ? 'default' : 'pointer',
            fontFamily: "'Silkscreen', monospace", fontSize: 8, letterSpacing: '0.15em',
          }}>{loading ? 'SYNCING' : '↻ REFRESH'}</button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
        {err && <div style={{ color: '#FF5555', marginBottom: 24, fontSize: 12 }}>{err}</div>}

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard label="NET REVENUE · 30D" value={money(rev?.net_30d)} sub={rev ? `${int(rev.sales_30d)} sales` : undefined} color="#FFB86C" source={src.revenue} />
          <StatCard label="NET REVENUE · 90D" value={money(rev?.net_90d)} sub={rev ? `${int(rev.sales_90d)} sales · ${money(rev.refunded_90d)} refunded` : undefined} color="#E8682A" source={src.revenue} />
          <StatCard label="SITE VISITORS · 30D" value={int(tr?.visits_30d)} sub={tr ? `${int(tr.pageviews_30d)} page views` : undefined} color="#4A9DB8" source={src.traffic} />
          <StatCard label="EMAIL SUBSCRIBERS" value={int(em?.total_subscribers)} sub={em?.net_new_90d != null ? `+${int(em.net_new_90d)} last 90d` : undefined} source={src.emails} />
          <StatCard label="QUIZ OPT-IN RATE" value={pct(fun?.optin_rate)} sub={fun ? `${int(fun.optins)} / ${int(fun.quiz_submits)} completed` : undefined} color="#82C896" source={src.funnel} />
        </div>

        {/* Trends over time (range-controlled) */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ background: '#100E0C', border: '1px solid #413226', borderBottom: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 10, letterSpacing: '0.2em', color: '#6E604E' }}>TRENDS</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {histLoading && <span style={{ fontSize: 9, color: '#6E604E', fontFamily: "'JetBrains Mono', monospace" }}>loading…</span>}
              <select value={range} onChange={e => setRange(Number(e.target.value))} style={{ background: '#16120E', color: '#F0E4D0', border: '1px solid #413226', borderRadius: 2, padding: '4px 8px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, cursor: 'pointer' }}>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#413226', border: '1px solid #413226', borderTop: 'none' }}>
            <div style={{ ...panelStyle, border: 'none', borderRadius: 0 }}>
              <ScanOverlay />
              <PanelTitleBar title="OPT-INS & QUIZ SUBMITS · DAILY" source={src.funnel} />
              <div style={{ padding: '16px 16px 8px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={hist?.daily ?? []} margin={{ left: -16, right: 8, top: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,50,38,0.5)" vertical={false} />
                    <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
                    <YAxis allowDecimals={false} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => shortDay(l as string)} />
                    <Legend wrapperStyle={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} />
                    <Line type="monotone" dataKey="optins" name="Opt-ins" stroke="#82C896" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="submits" name="Submits" stroke="#E8682A" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div style={{ ...panelStyle, border: 'none', borderRadius: 0 }}>
              <ScanOverlay />
              <PanelTitleBar title="REVENUE · DAILY" source={src.revenue} />
              <div style={{ padding: '16px 16px 8px' }}>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={hist?.daily ?? []} margin={{ left: -8, right: 8, top: 8 }}>
                    <defs>
                      <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFB86C" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#FFB86C" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,50,38,0.5)" vertical={false} />
                    <XAxis dataKey="day" tickFormatter={shortDay} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
                    <YAxis tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={44} tickFormatter={(v) => '$' + (v >= 1000 ? (v / 1000) + 'k' : v)} />
                    <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => shortDay(l as string)} formatter={(v) => money(Number(v))} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#FFB86C" strokeWidth={2} fill="url(#revFill)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: '#413226', border: '1px solid #413226', borderTop: 'none' }}>
            <div style={{ ...panelStyle, border: 'none', borderRadius: 0 }}>
              <ScanOverlay />
              <PanelTitleBar title="SITE TRAFFIC · SNAPSHOTS" source={src.traffic} />
              <div style={{ padding: '16px 16px 8px' }}>
                {(hist?.traffic?.length ?? 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={hist?.traffic ?? []} margin={{ left: -16, right: 8, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,50,38,0.5)" vertical={false} />
                      <XAxis dataKey="captured_at" tickFormatter={shortDay} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis allowDecimals={false} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={32} />
                      <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => shortDay(l as string)} />
                      <Line type="monotone" dataKey="visits" name="Visitors" stroke="#4A9DB8" strokeWidth={2} dot={{ r: 3, fill: '#4A9DB8' }} />
                      <Line type="monotone" dataKey="pageviews" name="Page views" stroke="#6E604E" strokeWidth={1} dot={{ r: 2 }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E604E', fontSize: 11 }}>fills as snapshots accrue</div>
                )}
              </div>
            </div>
            <div style={{ ...panelStyle, border: 'none', borderRadius: 0 }}>
              <ScanOverlay />
              <PanelTitleBar title="EMAIL SUBSCRIBERS · SNAPSHOTS" source={src.emails} />
              <div style={{ padding: '16px 16px 8px' }}>
                {(hist?.subscribers?.length ?? 0) > 0 ? (
                  <ResponsiveContainer width="100%" height={160}>
                    <LineChart data={hist?.subscribers ?? []} margin={{ left: 0, right: 8, top: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,50,38,0.5)" vertical={false} />
                      <XAxis dataKey="captured_at" tickFormatter={shortDay} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={24} />
                      <YAxis domain={['dataMin - 5', 'dataMax + 5']} tick={{ fill: '#6E604E', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={40} />
                      <Tooltip contentStyle={tooltipStyle} labelFormatter={(l) => shortDay(l as string)} />
                      <Line type="monotone" dataKey="total" name="Subscribers" stroke="#82C896" strokeWidth={2} dot={{ r: 3, fill: '#82C896' }} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6E604E', fontSize: 11 }}>fills as snapshots accrue</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by line + Funnel */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
          <div style={panelStyle}>
            <ScanOverlay />
            <PanelTitleBar title="REVENUE BY LINE · 90D" source={src.revenue} />
            <div style={{ padding: '20px 24px' }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={rev?.by_line ?? []} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,50,38,0.6)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6E604E', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => '$' + (v / 1000) + 'k'} />
                  <YAxis type="category" dataKey="line" tick={{ fill: '#B4A690', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => money(Number(v))} cursor={{ fill: 'rgba(232,104,42,0.08)' }} />
                  <Bar dataKey="net_90d" fill="#E8682A" radius={[0, 2, 2, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Funnel — cardless hairline strip */}
          <div style={panelStyle}>
            <ScanOverlay />
            <PanelTitleBar title="QUIZ FUNNEL" source={src.funnel} />
            <div style={{ padding: '24px' }}>
              {[
                { label: 'QUIZ COMPLETED', value: int(fun?.quiz_submits) },
                { label: 'EMAIL OPT-INS', value: int(fun?.optins) },
                { label: 'OPT-IN RATE', value: pct(fun?.optin_rate), accent: true },
              ].map((row, i, arr) => (
                <div key={row.label} style={{ padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(65,50,38,0.5)' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 8, letterSpacing: '0.15em', color: '#6E604E' }}>{row.label}</span>
                  <span style={{ fontFamily: "'Jura', sans-serif", fontWeight: 300, fontSize: 28, color: row.accent ? '#82C896' : '#F0E4D0' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Source ledger — provenance for every feed */}
        <div style={panelStyle}>
          <ScanOverlay />
          <PanelTitleBar title="SOURCE LEDGER" />
          <div style={{ padding: '4px 0' }}>
            {[
              { key: 'revenue', label: 'SamCart revenue', detail: 'Supabase · sam_cart_transactions' },
              { key: 'funnel', label: 'Quiz funnel', detail: 'Supabase · ai_native_*' },
              { key: 'emails', label: 'Kit email', detail: em ? `${int(em.total_subscribers)} subscribers` : 'snapshot pending' },
              { key: 'traffic', label: 'Vercel site traffic', detail: tr ? `${int(tr.visits_30d)} visitors · ${int(tr.pageviews_30d)} views (30d)` : 'add analytics token' },
              { key: 'linkedin', label: 'LinkedIn reach', detail: li ? `${int(li.value)} followers` : 'manual entry, never automate' },
            ].map((row, i, arr) => {
              const s = src[row.key];
              const live = s?.status === 'live';
              return (
                <div key={row.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderBottom: i < arr.length - 1 ? '1px solid rgba(65,50,38,0.4)' : 'none' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: live ? '#82C896' : '#FFB86C', opacity: live ? 1 : 0.7, boxShadow: live ? '0 0 6px #82C896' : 'none', flexShrink: 0 }} />
                  <span style={{ width: 160, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#F0E4D0' }}>{row.label}</span>
                  <span style={{ flex: 1, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#6E604E' }}>{row.detail}</span>
                  <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 8, letterSpacing: '0.1em', color: live ? '#82C896' : '#FFB86C' }}>{(s?.status ?? 'pending').toUpperCase()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Quiz Results Insights ─────────────────────────── */}
        <div style={{ marginTop: 40 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 18 }}>
            <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 11, letterSpacing: '0.2em', color: '#E8682A' }}>QUIZ INSIGHTS</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6E604E' }}>Supabase · ai_native_* · live</span>
          </div>

          {/* Stat strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            <StatCard label="TOTAL SUBMISSIONS" value={int(qz?.total_submissions)} color="#F0E4D0" />
            <StatCard label="EMAIL OPT-INS" value={int(qz?.total_optins)} sub={qz?.converted_submissions != null ? `${int(qz.converted_submissions)} submissions converted` : undefined} color="#82C896" />
            <StatCard label="AVG ALTITUDE" value={qz?.avg_altitude != null ? String(qz.avg_altitude) : '—'} color="#4A9DB8" />
            <StatCard label="OPT-IN RATE" value={pct(qz?.optin_rate)} sub={qz?.converted_submissions != null && qz?.total_submissions != null ? `${int(qz.converted_submissions)} of ${int(qz.total_submissions)} submissions` : undefined} color="#FFB86C" />
          </div>

          {/* Three panels: by archetype, intent split, level band */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 24 }}>
            {/* By archetype */}
            <div style={panelStyle}>
              <ScanOverlay />
              <PanelTitleBar title="BY ARCHETYPE" source={src.quiz} />
              <div style={{ padding: '14px 20px 18px' }}>
                {qz?.by_archetype?.length ? qz.by_archetype.map(a => (
                  <HorizontalBar
                    key={a.archetype}
                    label={a.archetype}
                    value={a.submissions}
                    max={archMax}
                    count={int(a.submissions)}
                    badge={`${pct(a.optin_rate)} opt-in`}
                    badgeColor={a.optin_rate != null && a.optin_rate > 0 ? '#82C896' : '#6E604E'}
                  />
                )) : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6E604E', fontSize: 12 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFB86C', opacity: 0.7 }} />—</span>}
              </div>
            </div>

            {/* Intent split (willingness) */}
            <div style={panelStyle}>
              <ScanOverlay />
              <PanelTitleBar title="INTENT SPLIT" source={src.quiz} />
              <div style={{ padding: '14px 20px 18px' }}>
                {qz?.by_willingness?.length ? qz.by_willingness.map(w => (
                  <HorizontalBar
                    key={w.willingness}
                    label={w.willingness}
                    value={w.submissions}
                    max={willMax}
                    count={int(w.submissions)}
                    badge={isHotIntent(w.willingness) ? 'HOT' : undefined}
                    badgeColor="#E8682A"
                    fill={isHotIntent(w.willingness) ? '#E8682A' : '#6E604E'}
                  />
                )) : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6E604E', fontSize: 12 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFB86C', opacity: 0.7 }} />—</span>}
              </div>
            </div>

            {/* Level band */}
            <div style={panelStyle}>
              <ScanOverlay />
              <PanelTitleBar title="LEVEL BAND" source={src.quiz} />
              <div style={{ padding: '14px 20px 18px' }}>
                {qz?.by_level?.length ? qz.by_level.map(l => (
                  <HorizontalBar
                    key={l.level_band}
                    label={l.level_band}
                    value={l.submissions}
                    max={lvlMax}
                    count={int(l.submissions)}
                    fill="#4A9DB8"
                  />
                )) : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6E604E', fontSize: 12 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FFB86C', opacity: 0.7 }} />—</span>}
              </div>
            </div>
          </div>

          {/* Honesty caption: leads vs converted submissions, and thin-data note */}
          <div style={{ marginTop: 16, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#6E604E', lineHeight: 1.6 }}>
            Opt-ins count distinct emails captured; opt-in rate is submission-based (submissions that produced at least one email). Bars fill as quiz traffic grows.
          </div>
        </div>
      </div>
    </div>
  );
}
