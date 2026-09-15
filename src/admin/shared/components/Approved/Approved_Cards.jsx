import React from 'react';
import { FileCheck2, Users, IndianRupee, Landmark, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const GREEN = '#22c55e';
const GREEN_TINT = '#e7f9ee';
const PURPLE = '#a78bfa';
const PURPLE_TINT = '#f3f0fe';
const AMBER = '#f5a524';
const AMBER_TINT = '#fef3e2';

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function monthKey(date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

// `statusDate` is the date an approved row should be counted against —
// statusUpdatedAt (when Applications_List.jsx's Approve action ran) when
// present, falling back to appliedAt for rows approved before that field
// existed.
function statusDate(row) {
  return new Date(row.statusUpdatedAt || row.appliedAt);
}

function countInMonth(rows, date) {
  const key = monthKey(date);
  return rows.filter((r) => {
    const d = statusDate(r);
    return !Number.isNaN(d.getTime()) && monthKey(d) === key;
  }).length;
}

function sumAmountInMonth(rows, date) {
  const key = monthKey(date);
  return rows
    .filter((r) => {
      const d = statusDate(r);
      return !Number.isNaN(d.getTime()) && monthKey(d) === key;
    })
    .reduce((sum, r) => sum + (parseInt(r.amount, 10) || 0), 0);
}

function percentDelta(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}

// ₹4,25,000 reads fine in a table cell but not in a headline stat, so the
// total loan amount card collapses into Lakh/Crore the way an Indian
// lending dashboard actually would.
function formatCr(amount) {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} L`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

function buildStats(approved) {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const totalCurrent = countInMonth(approved, now);
  const totalPrevious = countInMonth(approved, lastMonth);

  const uniqueBorrowers = new Set(approved.map((a) => (a.userEmail || a.name || '').toLowerCase())).size;
  const uniqueCurrent = new Set(
    approved.filter((a) => monthKey(statusDate(a)) === monthKey(now)).map((a) => (a.userEmail || a.name || '').toLowerCase())
  ).size;
  const uniquePrevious = new Set(
    approved.filter((a) => monthKey(statusDate(a)) === monthKey(lastMonth)).map((a) => (a.userEmail || a.name || '').toLowerCase())
  ).size;

  const totalAmount = approved.reduce((sum, a) => sum + (parseInt(a.amount, 10) || 0), 0);
  const amountCurrent = sumAmountInMonth(approved, now);
  const amountPrevious = sumAmountInMonth(approved, lastMonth);

  const schemeCount = new Set(approved.map((a) => a.schemeTitle).filter(Boolean)).size;
  const schemesCurrent = new Set(
    approved.filter((a) => monthKey(statusDate(a)) === monthKey(now)).map((a) => a.schemeTitle).filter(Boolean)
  ).size;
  const schemesPrevious = new Set(
    approved.filter((a) => monthKey(statusDate(a)) === monthKey(lastMonth)).map((a) => a.schemeTitle).filter(Boolean)
  ).size;

  return [
    {
      key: 'total', label: 'Total Approved', value: approved.length,
      delta: Math.abs(percentDelta(totalCurrent, totalPrevious)), deltaUp: totalCurrent >= totalPrevious,
      icon: FileCheck2, color: GREEN, tint: GREEN_TINT,
    },
    {
      key: 'borrowers', label: 'Unique Borrowers', value: uniqueBorrowers,
      delta: Math.abs(percentDelta(uniqueCurrent, uniquePrevious)), deltaUp: uniqueCurrent >= uniquePrevious,
      icon: Users, color: BLUE, tint: BLUE_TINT,
    },
    {
      key: 'amount', label: 'Total Loan Amount', value: formatCr(totalAmount),
      delta: Math.abs(percentDelta(amountCurrent, amountPrevious)), deltaUp: amountCurrent >= amountPrevious,
      icon: IndianRupee, color: PURPLE, tint: PURPLE_TINT,
    },
    {
      key: 'schemes', label: 'Loan Schemes', value: schemeCount,
      delta: Math.abs(percentDelta(schemesCurrent, schemesPrevious)), deltaUp: schemesCurrent >= schemesPrevious,
      icon: Landmark, color: AMBER, tint: AMBER_TINT,
    },
  ];
}

function StatCard({ label, value, delta, deltaUp, icon: Icon, color, tint }) {
  return (
    <div
      className="approved-stat-card rounded-2xl bg-white p-4"
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

      <div className="mt-3">
        <p className="text-[26px] font-extrabold leading-none" style={{ color: TEXT }}>{value}</p>
        <p className="mt-1.5 flex items-center gap-0.5 text-[11.5px] font-semibold" style={{ color: deltaUp ? GREEN : '#ef4444' }}>
          {deltaUp ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {delta}% <span className="font-medium" style={{ color: SLATE }}>vs last month</span>
        </p>
      </div>
    </div>
  );
}

// The four at-a-glance totals shown above the filter bar and table.
// Deliberately scoped to ALL approved applications regardless of whatever
// Approved_Filter / Approved_List are currently narrowed to, so these
// numbers always answer "how are we doing overall" — same convention as
// Application_Cards.jsx on the Applications page.
export default function ApprovedCards({ approved = [] }) {
  const stats = buildStats(approved);

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        .approved-stat-card {
          border: 1px solid var(--card-border, ${BORDER});
          box-shadow: var(--card-shadow, none);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .approved-stat-card:hover {
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