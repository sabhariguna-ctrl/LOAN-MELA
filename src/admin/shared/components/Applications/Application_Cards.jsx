import React from 'react';
import { FileText, CheckCircle2, Hourglass, XCircle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
const RED = '#ef4444';
const RED_TINT = '#fdeceb';

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function countInMonth(applications, date, status) {
  const key = monthKey(date);
  return applications.filter((a) => {
    const applied = new Date(a.appliedAt);
    if (Number.isNaN(applied.getTime()) || monthKey(applied) !== key) return false;
    return status ? a.status === status : true;
  }).length;
}

function percentDelta(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// Every application submitted from the public Loan Scheme page's "Apply
// Now" form is saved with status 'Pending' — there's no admin approve/
// reject step until Applications_List.jsx's row menu is used, so these
// numbers are real from the moment applications start coming in, not
// placeholders waiting on a feature.
function buildStats(applications) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const withDelta = (status) => {
    const value = status ? applications.filter((a) => a.status === status).length : applications.length;
    const current = countInMonth(applications, now, status);
    const previous = countInMonth(applications, lastMonth, status);
    return { value, delta: Math.abs(percentDelta(current, previous)), deltaUp: current >= previous };
  };

  const sparkMonths = [];
  for (let i = 7; i >= 0; i--) sparkMonths.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  const spark = (status) => sparkMonths.map((d) => countInMonth(applications, d, status) || 0.01);

  return [
    { key: 'total', label: 'Total Applications', ...withDelta(null), icon: FileText, color: BLUE, tint: BLUE_TINT, spark: spark(null) },
    { key: 'approved', label: 'Approved', ...withDelta('Approved'), icon: CheckCircle2, color: GREEN, tint: GREEN_TINT, spark: spark('Approved') },
    { key: 'inProgress', label: 'In Progress', ...withDelta('Pending'), icon: Hourglass, color: AMBER, tint: AMBER_TINT, spark: spark('Pending') },
    { key: 'rejected', label: 'Rejected', ...withDelta('Rejected'), icon: XCircle, color: RED, tint: RED_TINT, spark: spark('Rejected') },
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
      className="app-stat-card rounded-2xl bg-white p-4"
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

// "Applicant Analysis" — the four at-a-glance totals shown above the
// filter bar and table. Deliberately scoped to ALL applications regardless
// of whatever Application_Filter / Applications_List are currently
// narrowed to, so these numbers always answer "how are we doing overall".
export default function ApplicationCards({ applications = [] }) {
  const stats = buildStats(applications);

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        .app-stat-card {
          border: 1px solid var(--card-border, ${BORDER});
          box-shadow: var(--card-shadow, none);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .app-stat-card:hover {
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