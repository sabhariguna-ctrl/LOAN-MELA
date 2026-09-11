import React from 'react';
import { Landmark, ShieldCheck, PauseCircle, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const PURPLE = '#a78bfa';
const PURPLE_TINT = '#f2edfe';
const GREEN = '#22c55e';
const GREEN_TINT = '#e7f9ee';
const AMBER = '#f5a524';
const AMBER_TINT = '#fef3e2';
const RED = '#ef4444';

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function countUpTo(list, cutoff, predicate) {
  return list.filter((b) => {
    const created = new Date(b.createdAt);
    if (Number.isNaN(created.getTime()) || created > cutoff) return false;
    return predicate ? predicate(b) : true;
  }).length;
}

function distinctBankTypesUpTo(list, cutoff) {
  const set = new Set();
  list.forEach((b) => {
    const created = new Date(b.createdAt);
    if (!Number.isNaN(created.getTime()) && created <= cutoff) set.add(b.bankType);
  });
  return set.size;
}

function percentDelta(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

function buildStats(banks) {
  const now = new Date();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth() - 1, 28);

  const months = [];
  for (let i = 7; i >= 0; i--) months.push(new Date(now.getFullYear(), now.getMonth() - i, 28));

  const totalNow = banks.length;
  const totalPrev = countUpTo(banks, lastMonthEnd, null);
  const activeNow = banks.filter((b) => b.status === 'Active').length;
  const activePrev = countUpTo(banks, lastMonthEnd, (b) => b.status === 'Active');
  const inactiveNow = banks.filter((b) => b.status === 'Inactive').length;
  const inactivePrev = countUpTo(banks, lastMonthEnd, (b) => b.status === 'Inactive');
  const typesNow = new Set(banks.map((b) => b.bankType)).size;
  const typesPrev = distinctBankTypesUpTo(banks, lastMonthEnd);

  return [
    {
      key: 'total', label: 'Total Banks', value: totalNow,
      delta: Math.abs(percentDelta(totalNow, totalPrev)), deltaUp: totalNow >= totalPrev,
      icon: Landmark, color: BLUE, tint: BLUE_TINT,
      spark: months.map((d) => countUpTo(banks, d, null) || 0.01),
    },
    {
      key: 'active', label: 'Active Banks', value: activeNow,
      delta: Math.abs(percentDelta(activeNow, activePrev)), deltaUp: activeNow >= activePrev,
      icon: ShieldCheck, color: GREEN, tint: GREEN_TINT,
      spark: months.map((d) => countUpTo(banks, d, (b) => b.status === 'Active') || 0.01),
    },
    {
      key: 'inactive', label: 'Inactive Banks', value: inactiveNow,
      delta: Math.abs(percentDelta(inactiveNow, inactivePrev)), deltaUp: inactiveNow >= inactivePrev,
      icon: PauseCircle, color: AMBER, tint: AMBER_TINT,
      spark: months.map((d) => countUpTo(banks, d, (b) => b.status === 'Inactive') || 0.01),
    },
    {
      key: 'types', label: 'Bank Types', value: typesNow,
      delta: Math.abs(percentDelta(typesNow, typesPrev)), deltaUp: typesNow >= typesPrev,
      icon: Layers, color: PURPLE, tint: PURPLE_TINT,
      spark: months.map((d) => distinctBankTypesUpTo(banks, d) || 0.01),
    },
  ];
}

function Sparkline({ points, color }) {
  const w = 64, h = 24;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const coords = points.map((v, i) => {
    const x = (i / (points.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} className="shrink-0">
      <polyline points={coords.join(' ')} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StatCard({ label, value, delta, deltaUp, icon: Icon, color, tint, spark }) {
  return (
    <div
      className="bank-stat-card rounded-2xl bg-white p-4"
      style={{
        '--card-border': BORDER,
        '--card-accent': color,
        '--card-shadow': `0 14px 28px -12px ${hexToRgba(color, 0.35)}`,
        '--card-shadow-hover': `0 20px 36px -12px ${hexToRgba(color, 0.55)}`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-xl"
          style={{ background: tint, color, boxShadow: `0 4px 10px -2px ${hexToRgba(color, 0.4)}` }}
        >
          <Icon size={18} strokeWidth={2.2} />
        </div>
        <p className="text-[12.5px] font-semibold" style={{ color: SLATE }}>{label}</p>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <p className="text-[26px] font-extrabold leading-none" style={{ color: TEXT }}>{value}</p>
          <p className="mt-1.5 flex items-center gap-0.5 text-[11.5px] font-semibold" style={{ color: deltaUp ? GREEN : RED }}>
            {deltaUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
            {delta}% <span className="font-medium" style={{ color: SLATE }}>vs last month</span>
          </p>
        </div>
        <Sparkline points={spark} color={color} />
      </div>
    </div>
  );
}

export default function BankCards({ banks = [] }) {
  const stats = buildStats(banks);

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        .bank-stat-card {
          border: 1px solid var(--card-border, ${BORDER});
          box-shadow: var(--card-shadow, none);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .bank-stat-card:hover {
          border-color: var(--card-accent, ${BLUE});
          box-shadow: var(--card-shadow-hover, var(--card-shadow, none));
          transform: translateY(-3px);
        }
      `}</style>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.key} {...s} />)}
      </div>
    </div>
  );
}