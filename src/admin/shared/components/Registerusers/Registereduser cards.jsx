import React from 'react';
import { Users, UserPlus, FileText, CalendarCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const GREEN = '#22c55e';
const GREEN_TINT = '#e7f9ee';
const AMBER = '#f5a524';
const AMBER_TINT = '#fef3e2';
const PURPLE = '#a78bfa';
const PURPLE_TINT = '#f3f0ff';

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function dayKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function countRegisteredOnDay(users, date) {
  const key = dayKey(date);
  return users.filter((u) => {
    const registered = new Date(u.registeredAt);
    return !Number.isNaN(registered.getTime()) && dayKey(registered) === key;
  }).length;
}

function countRegisteredInMonth(users, date) {
  const key = monthKey(date);
  return users.filter((u) => {
    const registered = new Date(u.registeredAt);
    return !Number.isNaN(registered.getTime()) && monthKey(registered) === key;
  }).length;
}

function percentDelta(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// `applicantEmails` is the set of borrower emails that have at least one
// entry in getApplications() — passed in from BorrowersPage rather than
// re-derived here, since ApplicationsPage already owns that data shape.
function buildStats(users, applicantEmails) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const currentNew = countRegisteredInMonth(users, now);
  const previousNew = countRegisteredInMonth(users, lastMonth);
  const newDelta = Math.abs(percentDelta(currentNew, previousNew));

  const withApplications = users.filter((u) => applicantEmails.has((u.email || '').toLowerCase())).length;

  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const todayCount = countRegisteredOnDay(users, now);
  const yesterdayCount = countRegisteredOnDay(users, yesterday);
  const todayDelta = Math.abs(percentDelta(todayCount, yesterdayCount));

  const sparkDays = [];
  for (let i = 7; i >= 0; i--) sparkDays.push(new Date(now.getFullYear(), now.getMonth(), now.getDate() - i));
  const dailySpark = sparkDays.map((d) => countRegisteredOnDay(users, d) || 0.01);

  const sparkMonths = [];
  for (let i = 7; i >= 0; i--) sparkMonths.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  const spark = sparkMonths.map((d) => countRegisteredInMonth(users, d) || 0.01);

  return [
    { key: 'total', label: 'Total Registered Users', value: users.length, icon: Users, color: BLUE, tint: BLUE_TINT, spark },
    {
      key: 'new', label: 'New This Month', value: currentNew, delta: newDelta, deltaUp: currentNew >= previousNew,
      icon: UserPlus, color: GREEN, tint: GREEN_TINT, spark,
    },
    { key: 'withApps', label: 'With Applications', value: withApplications, icon: FileText, color: AMBER, tint: AMBER_TINT, spark },
    {
      key: 'today', label: "Today's Registrations", value: todayCount, delta: todayDelta, deltaUp: todayCount >= yesterdayCount,
      icon: CalendarCheck, color: PURPLE, tint: PURPLE_TINT, spark: dailySpark, deltaLabel: 'vs yesterday',
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

function StatCard({ label, value, delta, deltaUp, icon: Icon, color, tint, spark, deltaLabel = 'vs last month' }) {
  return (
    <div
      className="borrower-stat-card rounded-2xl bg-white p-4"
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
          {delta !== undefined ? (
            <p className="mt-1.5 flex items-center gap-0.5 text-[11.5px] font-semibold" style={{ color: deltaUp ? GREEN : '#ef4444' }}>
              {deltaUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
              {delta}% <span className="font-medium" style={{ color: SLATE }}>{deltaLabel}</span>
            </p>
          ) : (
            <p className="mt-1.5 text-[11.5px] font-medium" style={{ color: SLATE }}>All time</p>
          )}
        </div>
        <Sparkline points={spark} color={color} />
      </div>
    </div>
  );
}

export default function RegisteredUserCards({ users = [], applicantEmails = new Set() }) {
  const stats = buildStats(users, applicantEmails);

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        .borrower-stat-card {
          border: 1px solid var(--card-border, ${BORDER});
          box-shadow: var(--card-shadow, none);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .borrower-stat-card:hover {
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