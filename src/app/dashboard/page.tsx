'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

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
  sources: Record<string, Source>;
};

// ─── Formatters: null → —, never a fake 0 ─────────────────
const money = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? '—' : '$' + new Intl.NumberFormat('en-US').format(Math.round(n));
const int = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? '—' : new Intl.NumberFormat('en-US').format(Math.round(n));
const pct = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? '—' : n + '%';

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
      <div style={{ padding: '20px 24px' }}>
        <div style={{ color, fontSize: 34, fontFamily: "'Jura', sans-serif", fontWeight: 300, lineHeight: 1 }}>{value}</div>
        {sub && <div style={{ color: '#82C896', fontSize: 11, marginTop: 8, fontFamily: "'JetBrains Mono', monospace" }}>{sub}</div>}
      </div>
    </div>
  );
}

export default function MarketingOps() {
  const [d, setD] = useState<Metrics | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/metrics', { credentials: 'same-origin' })
      .then(r => {
        if (r.status === 401) { window.location.href = '/dashboard/login?from=/dashboard'; return null; }
        if (!r.ok) throw new Error('metrics endpoint error');
        return r.json();
      })
      .then(j => { if (j) setD(j); })
      .catch(() => setErr('Failed to load metrics.'));
  }, []);

  const rev = d?.revenue;
  const fun = d?.funnel;
  const em = d?.emails;
  const src = d?.sources ?? {};
  const li = d?.manual?.linkedin_followers;

  return (
    <div style={{ background: '#16120E', minHeight: '100vh', color: '#F0E4D0', fontFamily: "'JetBrains Mono', monospace" }}>
      {/* Nav */}
      <nav style={{ background: '#100E0C', borderBottom: '1px solid #413226', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <span style={{ fontFamily: "'Silkscreen', monospace", fontSize: 10, color: '#6E604E', letterSpacing: '0.2em' }}>◈ MARKETING OPS</span>
        <Link href="/signal" style={{ color: '#6E604E', textDecoration: 'none', fontFamily: "'Silkscreen', monospace", fontSize: 9, letterSpacing: '0.15em' }}>SIGNAL ↗</Link>
        <span style={{ marginLeft: 'auto', fontSize: 10, color: '#6E604E', fontFamily: "'JetBrains Mono', monospace" }}>
          {d ? `updated ${new Date(d.generated_at).toLocaleString()}` : 'loading…'}
        </span>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>
        {err && <div style={{ color: '#FF5555', marginBottom: 24, fontSize: 12 }}>{err}</div>}

        {/* Stat strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          <StatCard label="NET REVENUE — 30D" value={money(rev?.net_30d)} sub={rev ? `${int(rev.sales_30d)} sales` : undefined} color="#FFB86C" source={src.revenue} />
          <StatCard label="NET REVENUE — 90D" value={money(rev?.net_90d)} sub={rev ? `${int(rev.sales_90d)} sales · ${money(rev.refunded_90d)} refunded` : undefined} color="#E8682A" source={src.revenue} />
          <StatCard label="EMAIL SUBSCRIBERS" value={int(em?.total_subscribers)} sub={em?.net_new_90d != null ? `+${int(em.net_new_90d)} last 90d` : undefined} source={src.emails} />
          <StatCard label="QUIZ OPT-IN RATE" value={pct(fun?.optin_rate)} sub={fun ? `${int(fun.optins)} / ${int(fun.quiz_submits)} completed` : undefined} color="#82C896" source={src.funnel} />
        </div>

        {/* Revenue by line + Funnel */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
          <div style={panelStyle}>
            <ScanOverlay />
            <PanelTitleBar title="REVENUE BY LINE — 90D" source={src.revenue} />
            <div style={{ padding: '20px 24px' }}>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={rev?.by_line ?? []} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(65,50,38,0.6)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6E604E', fontSize: 10, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} tickFormatter={(v) => '$' + (v / 1000) + 'k'} />
                  <YAxis type="category" dataKey="line" tick={{ fill: '#B4A690', fontSize: 11, fontFamily: "'JetBrains Mono', monospace" }} axisLine={false} tickLine={false} width={130} />
                  <Tooltip contentStyle={tooltipStyle} formatter={(v: number) => money(v)} cursor={{ fill: 'rgba(232,104,42,0.08)' }} />
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
              { key: 'traffic', label: 'Vercel site traffic', detail: 'add analytics token' },
              { key: 'linkedin', label: 'LinkedIn reach', detail: li ? `${int(li.value)} followers` : 'manual entry — never automate' },
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
      </div>
    </div>
  );
}
