import React, { useEffect, useState } from 'react';
import { ChevronDown, CalendarDays, RotateCcw } from 'lucide-react';

const NAVY = '#132261';
const TEXT = '#242938';
const SLATE = '#757e9e';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const fieldStyle = {
  color: TEXT,
  border: `1px solid ${BORDER}`,
  background: '#fff',
};

function Field({ label, children }) {
  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
      <label className="text-[11.5px] font-semibold" style={{ color: SLATE }}>{label}</label>
      {children}
    </div>
  );
}

const selectClass =
  'w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none';
const dateClass =
  'w-full rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none';

// Loan Type + Status are applied the moment they're changed (cheap,
// exact-match filters an admin expects to react instantly). From/To Date
// are staged locally and only take effect on "Apply Filters" — a date
// range is usually set by adjusting both ends before it's meant to run,
// so filtering on every keystroke would just flash results twice.
export default function ApplicationFilter({
  loanTypeOptions = [],
  loanType = 'All',
  status = 'All',
  statusOptions = [],
  fromDate = '',
  toDate = '',
  onLoanTypeChange = () => {},
  onStatusChange = () => {},
  onApplyDates = () => {},
  onReset = () => {},
}) {
  const [draftFrom, setDraftFrom] = useState(fromDate);
  const [draftTo, setDraftTo] = useState(toDate);

  // Keep the staged date inputs in sync if the parent resets filters
  // (e.g. the Reset button, or a tab-driven status change that also clears
  // dates) so the fields never show a stale draft the admin didn't type.
  useEffect(() => {
    setDraftFrom(fromDate);
    setDraftTo(toDate);
  }, [fromDate, toDate]);

  const handleApply = () => onApplyDates({ from: draftFrom, to: draftTo });
  const handleReset = () => {
    setDraftFrom('');
    setDraftTo('');
    onReset();
  };

  return (
    <div
      className="rounded-2xl bg-white p-4"
      style={{ fontFamily: FONT, border: `1px solid ${BORDER}` }}
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <Field label="Loan Type">
          <div className="relative">
            <select
              value={loanType}
              onChange={(e) => onLoanTypeChange(e.target.value)}
              className={selectClass}
              style={fieldStyle}
            >
              <option value="All">All Loan Types</option>
              {loanTypeOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Status">
          <div className="relative">
            <select
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={selectClass}
              style={fieldStyle}
            >
              <option value="All">All Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="From Date">
          <div className="relative">
            <input
              type="date"
              value={draftFrom}
              onChange={(e) => setDraftFrom(e.target.value)}
              max={draftTo || undefined}
              className={dateClass}
              style={fieldStyle}
            />
            <CalendarDays size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="To Date">
          <div className="relative">
            <input
              type="date"
              value={draftTo}
              onChange={(e) => setDraftTo(e.target.value)}
              min={draftFrom || undefined}
              className={dateClass}
              style={fieldStyle}
            />
            <CalendarDays size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={handleApply}
            className="whitespace-nowrap rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
            style={{ background: NAVY }}
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[12.5px] font-semibold"
            style={{ color: TEXT, border: `1px solid ${BORDER}` }}
          >
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}