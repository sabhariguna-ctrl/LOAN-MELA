import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  FileText, CheckCircle2, Clock, XCircle, ArrowUpRight, ArrowDownRight,
  CalendarDays, ChevronDown, MoreVertical,
} from 'lucide-react';
import { getApplications } from '../../../utils/auth';

// Turns a hex color into an rgba() string — used for the soft, tinted
// drop-shadows under the stat cards (each card's shadow matches its icon
// color rather than a single flat grey, per the reference design).
function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Same brand palette as Sidebar.jsx / Topbar.jsx, extended with the
// status/category colors this page's stat cards, charts, and pills need.
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const BLUE_PALE = '#f4f8fd';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";
const SCRIPT_FONT = "'Caveat', cursive";

const GREEN = '#22c55e';
const GREEN_TINT = '#e7f9ee';
const AMBER = '#f5a524';
const AMBER_TINT = '#fef3e2';
const RED = '#ef4444';
const RED_TINT = '#fdeceb';
const TEAL = '#2dd4a7';
const PURPLE = '#a78bfa';
const PINK = '#f4879f';

// Cycled across whatever loan categories actually show up in submitted
// applications, so the type-distribution chart never depends on a fixed
// hardcoded list of loan types.
const TYPE_PALETTE = [BLUE, TEAL, AMBER, PURPLE, PINK, GREEN, RED, '#06b6d4', '#f97316', '#84cc16'];

const STATUS_STYLES = {
  Approved: { fg: '#1a9c53', bg: GREEN_TINT },
  Pending: { fg: '#b3760f', bg: AMBER_TINT },
  Rejected: { fg: '#c23b1f', bg: RED_TINT },
};

const RANGE_OPTIONS = [
  { key: 3, label: 'Last 3 Months' },
  { key: 6, label: 'Last 6 Months' },
  { key: 12, label: 'Last 12 Months' },
];

// Last 12 calendar months (newest first) for the header's month picker,
// each keyed the same way as monthKey() below so lookups line up.
function monthOptions() {
  const now = new Date();
  const months = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: monthKey(d), date: d, label: d.toLocaleString('en-US', { month: 'long', year: 'numeric' }) });
  }
  return months;
}

// ---------------------------------------------------------------------
// Real-data helpers. Every loan application submitted from the Loan
// Scheme page's "Apply Now" form (see utils/auth.js -> submitApplication)
// lands in localStorage with: userEmail, schemeTitle, filterGroup,
// categoryLabel, name, phone, amount, city, status ('Pending' today —
// there's no admin approve/reject workflow yet, so Approved/Rejected
// counts are genuinely 0 until that exists), and appliedAt.
// Everything below is derived from that array — no placeholder numbers.
// ---------------------------------------------------------------------

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

// Builds the last N months (oldest -> newest, ending this month) as
// { date, label } pairs, so every chart/card window shares one source
// of truth for "what months are we looking at".
function lastMonths(n) {
  const now = new Date();
  const months = [];
  for (let i = n - 1; i >= 0; i--) {
    months.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  }
  return months;
}

function buildStats(applications, referenceDate) {
  const now = referenceDate;
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const withDelta = (status) => {
    const current = countInMonth(applications, now, status);
    const previous = countInMonth(applications, lastMonth, status);
    return { value: current, delta: Math.abs(percentDelta(current, previous)), deltaUp: current >= previous };
  };

  const sparkMonths = [];
  for (let i = 7; i >= 0; i--) sparkMonths.push(new Date(now.getFullYear(), now.getMonth() - i, 1));
  const spark = (status) => sparkMonths.map((d) => countInMonth(applications, d, status) || 0.01);

  const total = withDelta(null);
  const approved = withDelta('Approved');
  const pending = withDelta('Pending');
  const rejected = withDelta('Rejected');

  return [
    { key: 'total', label: 'Total Applications', ...total, icon: FileText, color: BLUE, tint: BLUE_TINT, spark: spark(null) },
    { key: 'approved', label: 'Approved', ...approved, icon: CheckCircle2, color: GREEN, tint: GREEN_TINT, spark: spark('Approved') },
    { key: 'pending', label: 'Pending Review', ...pending, icon: Clock, color: AMBER, tint: AMBER_TINT, spark: spark('Pending') },
    { key: 'rejected', label: 'Rejected', ...rejected, icon: XCircle, color: RED, tint: RED_TINT, spark: spark('Rejected') },
  ];
}

function buildTrend(applications, monthsBack) {
  const months = lastMonths(monthsBack);
  return {
    months: months.map((d) => d.toLocaleString('en-US', { month: 'short' })),
    series: {
      approved: months.map((d) => countInMonth(applications, d, 'Approved')),
      inProgress: months.map((d) => countInMonth(applications, d, 'Pending')),
      rejected: months.map((d) => countInMonth(applications, d, 'Rejected')),
    },
  };
}

function loanTypeCounts(applications) {
  const counts = new Map();
  applications.forEach((a) => {
    const label = a.filterGroup || a.categoryLabel || 'Other';
    counts.set(label, (counts.get(label) || 0) + 1);
  });
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function buildLoanTypeDistribution(applications) {
  const counts = loanTypeCounts(applications);
  const total = applications.length;
  if (total === 0) return [];
  return counts.slice(0, 5).map((c, i) => ({
    label: c.label,
    value: Math.round((c.count / total) * 100),
    color: TYPE_PALETTE[i % TYPE_PALETTE.length],
  }));
}

function buildTopLoanTypes(applications) {
  return loanTypeCounts(applications)
    .slice(0, 5)
    .map((c, i) => ({ label: c.label, value: c.count, color: TYPE_PALETTE[i % TYPE_PALETTE.length] }));
}

function formatAmount(raw) {
  const n = parseInt(raw, 10);
  if (!n) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function monthRangeLabel(monthDate) {
  const start = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const end = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
  const fmt = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  return `${fmt(start)} - ${fmt(end)}`;
}

// ---- Small building blocks --------------------------------------------

function Panel({ title, subtitle, action, children, className = '', accent = BLUE }) {
  return (
    <div
      className={`dash-card rounded-2xl bg-white p-5 ${className}`}
      style={{
        '--card-border': BORDER,
        '--card-accent': accent,
        '--card-shadow': '0 10px 28px -18px rgba(19,34,97,0.25)',
        '--card-shadow-hover': `0 18px 34px -14px ${hexToRgba(accent, 0.35)}`,
      }}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {title && <p className="text-[14.5px] font-bold" style={{ color: TEXT }}>{title}</p>}
            {subtitle && <p className="mt-0.5 text-[12px]" style={{ color: SLATE }}>{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

// Tiny trend squiggle used inside each stat card — purely decorative,
// echoes the direction of that card's delta rather than plotting exact values.
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
      className="dash-card rounded-2xl bg-white p-4"
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

// Multi-series area chart, hand-rolled in SVG — no chart library is
// installed in this project, and the rest of the app avoids adding
// external dependencies for what a few paths can draw directly.
function TrendChart({ months, series }) {
  const width = 600, height = 220, padX = 8, padY = 16;
  const innerW = width - padX * 2, innerH = height - padY * 2;
  const allValues = Object.values(series).flat();
  const max = Math.max(Math.ceil(Math.max(...allValues, 0) / 10) * 10, 10);

  const toPoints = (values) => values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * innerW;
    const y = padY + innerH - (v / max) * innerH;
    return [x, y];
  });

  // Catmull-Rom → cubic Bezier conversion, so the line reads as a smooth
  // curve (like the reference) instead of sharp straight-line segments.
  const linePath = (pts) => {
    if (pts.length < 2) return '';
    let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };
  const areaPath = (pts) => `${linePath(pts)} L${pts[pts.length - 1][0].toFixed(1)},${(height - padY).toFixed(1)} L${pts[0][0].toFixed(1)},${(height - padY).toFixed(1)} Z`;

  // Drawn back-to-front so the highest-value series (Approved) stays on top.
  const layers = [
    { key: 'rejected', color: RED, dots: false },
    { key: 'inProgress', color: TEAL, dots: false },
    { key: 'approved', color: BLUE, dots: true },
  ];

  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height: 220 }}>
      {gridLines.map((g) => (
        <line key={g} x1={padX} x2={width - padX} y1={padY + innerH * g} y2={padY + innerH * g} stroke={BORDER} strokeWidth="1" />
      ))}

      {layers.map(({ key, color, dots }) => {
        const pts = toPoints(series[key]);
        return (
          <g key={key}>
            <path d={areaPath(pts)} fill={color} opacity="0.12" />
            <path d={linePath(pts)} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {dots && pts.map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#fff" stroke={color} strokeWidth="2.5" />
            ))}
          </g>
        );
      })}

      {months.map((m, i) => (
        <text
          key={`${m}-${i}`}
          x={padX + (i / (months.length - 1)) * innerW}
          y={height - 2}
          fontSize="10.5"
          textAnchor="middle"
          fill={SLATE}
          fontFamily={FONT}
        >
          {m}
        </text>
      ))}
    </svg>
  );
}

// Donut built from stacked stroke-dasharray arcs on a shared circle —
// same reasoning as TrendChart: no chart library, so plain SVG math.
function DonutChart({ segments, centerValue, centerLabel }) {
  const size = 180, stroke = 26, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  let cumulative = 0;

  if (segments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
        <div
          className="flex h-[180px] w-[180px] items-center justify-center rounded-full"
          style={{ border: `26px solid ${BORDER}` }}
        >
          <div>
            <p className="text-[22px] font-extrabold" style={{ color: TEXT }}>0</p>
            <p className="text-[11px]" style={{ color: SLATE }}>{centerLabel}</p>
          </div>
        </div>
        <p className="text-[12px]" style={{ color: SLATE }}>No applications yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BORDER} strokeWidth={stroke} />
          {segments.map((seg) => {
            const dash = (seg.value / 100) * c;
            const rotation = -90 + (cumulative / 100) * 360;
            cumulative += seg.value;
            return (
              <circle
                key={seg.label}
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${c - dash}`}
                strokeLinecap="butt"
                transform={`rotate(${rotation} ${size / 2} ${size / 2})`}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[22px] font-extrabold" style={{ color: TEXT }}>{centerValue}</p>
          <p className="text-[11px]" style={{ color: SLATE }}>{centerLabel}</p>
        </div>
      </div>

      <ul className="grid w-full grid-cols-2 gap-x-3 gap-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-1.5 text-[11.5px]" style={{ color: TEXT }}>
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: seg.color }} />
            <span className="truncate">{seg.label}</span>
            <span className="ml-auto font-semibold" style={{ color: SLATE }}>{seg.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApprovalRing({ percent, delta, approved, pending }) {
  const size = 150, stroke = 16, r = (size - stroke) / 2, c = 2 * Math.PI * r;
  const dash = (percent / 100) * c;
  const hasDelta = delta !== null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BLUE_TINT} strokeWidth={stroke} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={BLUE} strokeWidth={stroke}
            strokeDasharray={`${dash} ${c - dash}`} strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[26px] font-extrabold" style={{ color: TEXT }}>{percent}%</p>
          {hasDelta ? (
            <p className="flex items-center gap-0.5 text-[10.5px] font-semibold" style={{ color: delta.up ? GREEN : RED }}>
              {delta.up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />} {delta.value}%
            </p>
          ) : (
            <p className="text-[10.5px] font-medium" style={{ color: SLATE }}>No decisions yet</p>
          )}
        </div>
      </div>

      <div className="mt-4 grid w-full grid-cols-2 gap-2 text-center">
        <div>
          <p className="text-[15px] font-bold" style={{ color: TEXT }}>{approved}</p>
          <p className="text-[11px]" style={{ color: SLATE }}>Approved</p>
        </div>
        <div className="border-l" style={{ borderColor: BORDER }}>
          <p className="text-[15px] font-bold" style={{ color: TEXT }}>{pending}</p>
          <p className="text-[11px]" style={{ color: SLATE }}>Pending</p>
        </div>
      </div>
    </div>
  );
}

function TopLoanTypes({ items }) {
  if (items.length === 0) {
    return <p className="py-6 text-center text-[12px]" style={{ color: SLATE }}>No applications yet</p>;
  }
  const max = Math.max(...items.map((i) => i.value));
  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.label}>
          <div className="mb-1 flex items-center justify-between text-[11.5px]">
            <span className="font-semibold" style={{ color: TEXT }}>{item.label}</span>
            <span className="font-semibold" style={{ color: SLATE }}>{item.value}</span>
          </div>
          <div className="h-2 w-full rounded-full" style={{ background: BLUE_TINT }}>
            <div
              className="h-2 rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatusPill({ status }) {
  const s = STATUS_STYLES[status] || { fg: SLATE, bg: '#f5f6fb' };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color: s.fg, background: s.bg }}
    >
      {status}
    </span>
  );
}

// Renders a dropdown's option list into document.body, positioned by the
// trigger button's actual on-screen coordinates. Dropdowns used to be
// nested `position: absolute` inside the header/panel — any scrollable or
// clipped ancestor between them and the page could cut the menu off or
// bury it behind later content. A portal sidesteps that entirely: the
// menu always renders on top, sized and placed from real screen coords.
function DropdownMenu({ anchorRect, align = 'right', width = 192, onClose, children }) {
  if (!anchorRect) return null;
  const style = {
    position: 'fixed',
    top: anchorRect.bottom + 6,
    width,
    ...(align === 'right' ? { left: Math.max(8, anchorRect.right - width) } : { left: anchorRect.left }),
  };
  return createPortal(
    <>
      <div className="fixed inset-0 z-[100]" onClick={onClose} />
      <div
        className="z-[101] max-h-64 overflow-y-auto rounded-xl bg-white py-1"
        style={{ ...style, border: `1px solid ${BORDER}`, boxShadow: '0 12px 28px -12px rgba(19,34,97,0.3)' }}
      >
        {children}
      </div>
    </>,
    document.body
  );
}

// Shared open/close/position state for a button-triggered dropdown. Closes
// automatically on scroll or resize since a fixed-position menu can't
// follow the page if the trigger moves.
function useDropdown() {
  const [open, setOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState(null);
  const btnRef = useRef(null);

  const toggle = () => {
    if (open) {
      setOpen(false);
      return;
    }
    setAnchorRect(btnRef.current.getBoundingClientRect());
    setOpen(true);
  };
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
  }, [open]);

  return { open, anchorRect, btnRef, toggle, close };
}

// Dropdown used by the "Application Trends" panel to pick the trailing
// window (3 / 6 / 12 months) shown in the chart below it.
function RangeDropdown({ value, onChange }) {
  const { open, anchorRect, btnRef, toggle, close } = useDropdown();
  const current = RANGE_OPTIONS.find((o) => o.key === value) || RANGE_OPTIONS[1];

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-semibold"
        style={{ color: TEXT, border: `1px solid ${BORDER}` }}
      >
        {current.label} <ChevronDown size={13} style={{ color: SLATE }} />
      </button>
      {open && (
        <DropdownMenu anchorRect={anchorRect} width={160} onClose={close}>
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { onChange(opt.key); close(); }}
              className="block w-full px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]"
              style={{ color: opt.key === value ? BLUE : TEXT }}
            >
              {opt.label}
            </button>
          ))}
        </DropdownMenu>
      )}
    </>
  );
}

// Header control that lets an admin scope the stat cards, approval rate,
// and recent-applications list to any of the last 12 calendar months
// (instead of always showing the current month).
function MonthDropdown({ value, onChange }) {
  const { open, anchorRect, btnRef, toggle, close } = useDropdown();
  const options = useMemo(() => monthOptions(), []);
  const currentKey = monthKey(value);

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="flex shrink-0 items-center gap-2 rounded-xl bg-white px-3.5 py-2.5 text-[12.5px] font-semibold"
        style={{ color: TEXT, border: `1px solid ${BORDER}`, boxShadow: '0 6px 16px -8px rgba(19,34,97,0.25)' }}
      >
        <CalendarDays size={15} style={{ color: BLUE }} />
        {monthRangeLabel(value)}
        <ChevronDown size={14} style={{ color: SLATE }} />
      </button>
      {open && (
        <DropdownMenu anchorRect={anchorRect} width={192} onClose={close}>
          {options.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { onChange(opt.date); close(); }}
              className="block w-full px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]"
              style={{ color: opt.key === currentKey ? BLUE : TEXT }}
            >
              {opt.label}
            </button>
          ))}
        </DropdownMenu>
      )}
    </>
  );
}

export default function Dashboard() {
  const [applications, setApplications] = useState(() => getApplications());
  const [trendRange, setTrendRange] = useState(6);
  const [showAllApplications, setShowAllApplications] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date());

  // Applications are written from the public site (Loan Scheme page's
  // "Apply Now" form) which may be a different tab/route than the admin
  // panel, so refresh whenever a new one is submitted or storage changes.
  useEffect(() => {
    const refresh = () => setApplications(getApplications());
    window.addEventListener('applicationschange', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('applicationschange', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  // Collapse back to the top 5 rows whenever a different month is picked,
  // so "View All" doesn't stay expanded across an unrelated month.
  useEffect(() => {
    setShowAllApplications(false);
  }, [selectedMonth]);

  const stats = useMemo(() => buildStats(applications, selectedMonth), [applications, selectedMonth]);
  const trend = useMemo(() => buildTrend(applications, trendRange), [applications, trendRange]);
  const loanTypeDistribution = useMemo(() => buildLoanTypeDistribution(applications), [applications]);
  const topLoanTypes = useMemo(() => buildTopLoanTypes(applications), [applications]);

  const approvalStats = useMemo(() => {
    const total = applications.length;
    const approved = applications.filter((a) => a.status === 'Approved').length;
    const pending = applications.filter((a) => a.status === 'Pending').length;
    const percent = total > 0 ? Math.round((approved / total) * 100) : 0;

    const lastMonth = new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1, 1);
    const thisMonthTotal = countInMonth(applications, selectedMonth);
    const thisMonthApproved = countInMonth(applications, selectedMonth, 'Approved');
    const lastMonthTotal = countInMonth(applications, lastMonth);
    const lastMonthApproved = countInMonth(applications, lastMonth, 'Approved');
    const thisRate = thisMonthTotal > 0 ? (thisMonthApproved / thisMonthTotal) * 100 : null;
    const lastRate = lastMonthTotal > 0 ? (lastMonthApproved / lastMonthTotal) * 100 : null;
    const delta = thisRate !== null && lastRate !== null
      ? { value: Math.abs(Math.round(thisRate - lastRate)), up: thisRate >= lastRate }
      : null;

    return { percent, approved, pending, delta };
  }, [applications, selectedMonth]);

  // Recent Applications is scoped to whichever month is picked in the
  // header, so the table and the stat cards above always describe the
  // same period.
  const recentApplications = useMemo(() => {
    const key = monthKey(selectedMonth);
    return applications
      .filter((a) => {
        const applied = new Date(a.appliedAt);
        return !Number.isNaN(applied.getTime()) && monthKey(applied) === key;
      })
      .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
  }, [applications, selectedMonth]);
  const visibleApplications = showAllApplications ? recentApplications : recentApplications.slice(0, 5);

  return (
    <div style={{ fontFamily: FONT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Caveat:wght@600&display=swap');

        .dash-card {
          border: 1px solid var(--card-border, ${BORDER});
          box-shadow: var(--card-shadow, none);
          transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
        }
        .dash-card:hover {
          border-color: var(--card-accent, ${BLUE});
          box-shadow: var(--card-shadow-hover, var(--card-shadow, none));
          transform: translateY(-3px);
        }
      `}</style>

      {/* Header — page identity + a date range control admins actually
          reach for first when checking how the platform is doing. The
          soft gradient + blurred color blobs echo the reference's
          illustrated banner without pulling in an actual image asset. */}
      <div
        className="relative mb-5 flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
        style={{
          background: `linear-gradient(120deg, ${BLUE_TINT} 0%, ${BLUE_PALE} 55%, #ffffff 100%)`,
          border: `1px solid ${BORDER}`,
        }}
      >
        {/* Decorative blurred blobs — purely atmospheric, sit behind everything.
            Clipped to their own inset wrapper (not the header itself) so the
            month dropdown below isn't clipped along with them. */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
          <div
            className="absolute -right-10 -top-16 h-48 w-48 rounded-full"
            style={{ background: BLUE, opacity: 0.16, filter: 'blur(40px)' }}
          />
          <div
            className="absolute -right-24 top-10 h-40 w-40 rounded-full"
            style={{ background: PURPLE, opacity: 0.14, filter: 'blur(36px)' }}
          />
        </div>

        <div className="relative">
          <p className="text-[11px] font-bold tracking-[0.14em]" style={{ color: BLUE }}>DASHBOARD</p>
          <h1 className="mt-1 text-[26px] font-extrabold" style={{ color: NAVY }}>Overview at a Glance</h1>
          <p className="mt-1 text-[13px]" style={{ color: SLATE }}>
            Track your loan applications, approvals and growth in real time.
          </p>
        </div>

        <div className="relative flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            <p className="text-right text-[20px] leading-tight" style={{ fontFamily: SCRIPT_FONT, color: NAVY }}>
              Turning applications<br />into opportunities
            </p>
            {/* Small rising-bars + arrow motif, standing in for the
                reference's growth illustration. */}
            <svg width="52" height="40" viewBox="0 0 52 40" className="shrink-0">
              <rect x="2" y="24" width="7" height="14" rx="2" fill={BLUE_TINT} />
              <rect x="13" y="16" width="7" height="22" rx="2" fill={hexToRgba(BLUE, 0.55)} />
              <rect x="24" y="8" width="7" height="30" rx="2" fill={BLUE} />
              <path d="M4 20 L18 12 L30 16 L46 4" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M38 4 L46 4 L46 12" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <MonthDropdown value={selectedMonth} onChange={setSelectedMonth} />
        </div>
      </div>

      {/* Stat cards */}
      <div className="mb-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => <StatCard key={s.key} {...s} />)}
      </div>

      {/* Trends / distribution / approval rate */}
      <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1.1fr_1.1fr]">
        <Panel
          title="Application Trends"
          subtitle={`Monthly application status overview — ${RANGE_OPTIONS.find((o) => o.key === trendRange).label.toLowerCase()}`}
          action={<RangeDropdown value={trendRange} onChange={setTrendRange} />}
        >
          <div className="mb-3 flex flex-wrap gap-4 text-[11.5px] font-medium" style={{ color: TEXT }}>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: BLUE }} />Approved</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: TEAL }} />Pending</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: RED }} />Rejected</span>
          </div>
          <TrendChart months={trend.months} series={trend.series} />
        </Panel>

        <Panel title="Loan Type Distribution">
          <DonutChart segments={loanTypeDistribution} centerValue={applications.length} centerLabel="Total" />
        </Panel>

        <div className="flex flex-col gap-4">
          <Panel title="Approval Rate">
            <ApprovalRing
              percent={approvalStats.percent}
              delta={approvalStats.delta}
              approved={approvalStats.approved}
              pending={approvalStats.pending}
            />
          </Panel>
          <Panel
            title="Top Performing Loan Types"
            action={<span className="text-[11px] font-semibold" style={{ color: SLATE }}>All Time</span>}
          >
            <TopLoanTypes items={topLoanTypes} />
          </Panel>
        </div>
      </div>

      {/* Recent applications */}
      <Panel
        title="Recent Applications"
        action={
          recentApplications.length > 5 && (
            <button
              type="button"
              onClick={() => setShowAllApplications((v) => !v)}
              className="flex items-center gap-1 text-[12.5px] font-semibold"
              style={{ color: BLUE }}
            >
              {showAllApplications ? 'Show Less' : 'View All'}
              <ArrowUpRight size={13} style={{ transform: showAllApplications ? 'rotate(225deg)' : 'rotate(45deg)' }} />
            </button>
          )
        }
      >
        {recentApplications.length === 0 ? (
          <p className="py-10 text-center text-[13px]" style={{ color: SLATE }}>
            {applications.length === 0
              ? 'No applications yet — submissions from the Loan Scheme page will show up here.'
              : `No applications in ${selectedMonth.toLocaleString('en-US', { month: 'long', year: 'numeric' })}.`}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['Application ID', 'Customer Name', 'Loan Type', 'Amount', 'Status', 'Date', ''].map((h) => (
                    <th key={h} className="px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SLATE }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleApplications.map((row) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td className="px-2 py-3 text-[12.5px] font-semibold" style={{ color: BLUE }}>{row.id}</td>
                    <td className="px-2 py-3 text-[12.5px] font-medium" style={{ color: TEXT }}>{row.name || '—'}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.filterGroup || row.categoryLabel || '—'}</td>
                    <td className="px-2 py-3 text-[12.5px] font-semibold" style={{ color: TEXT }}>{formatAmount(row.amount)}</td>
                    <td className="px-2 py-3"><StatusPill status={row.status} /></td>
                    <td className="px-2 py-3 text-[12px]" style={{ color: SLATE }}>{formatDate(row.appliedAt)}</td>
                    <td className="px-2 py-3 text-right">
                      <button className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }} aria-label="Row actions">
                        <MoreVertical size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </div>
  );
}