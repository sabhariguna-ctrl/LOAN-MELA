import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, RotateCcw } from 'lucide-react';

const NAVY = '#132261';
const TEXT = '#242938';
const SLATE = '#757e9e';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const fieldStyle = { color: TEXT, border: `1px solid ${BORDER}`, background: '#fff' };
const selectClass = 'w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none';
const inputClass = 'w-full rounded-xl pl-9 pr-3 py-2.5 text-[12.5px] font-medium outline-none placeholder:text-[#9aa1b8]';

function Field({ label, children, className = '' }) {
  return (
    <div className={`flex min-w-[140px] flex-1 flex-col gap-1.5 ${className}`}>
      <label className="text-[11.5px] font-semibold" style={{ color: SLATE }}>{label}</label>
      {children}
    </div>
  );
}

// Loan Type / Loan Scheme / Bank are exact-match dropdowns applied the
// moment they change (cheap filters an admin expects to react instantly).
// Search is staged locally and only takes effect on "Apply Filters" or
// Enter, same convention as Bank_Filter.jsx, so it doesn't re-filter on
// every keystroke.
export default function ApprovedFilter({
  loanTypeOptions = [],
  loanType = 'All',
  schemeOptions = [],
  loanScheme = 'All',
  bankOptions = [],
  bank = 'All',
  search = '',
  onLoanTypeChange = () => {},
  onLoanSchemeChange = () => {},
  onBankChange = () => {},
  onSearchChange = () => {},
  onApply = () => {},
  onReset = () => {},
}) {
  const [draftSearch, setDraftSearch] = useState(search);

  useEffect(() => setDraftSearch(search), [search]);

  const handleApply = () => {
    onSearchChange(draftSearch);
    onApply();
  };
  const handleReset = () => {
    setDraftSearch('');
    onReset();
  };

  return (
    <div className="rounded-2xl bg-white p-4" style={{ fontFamily: FONT, border: `1px solid ${BORDER}` }}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <Field label="Loan Type">
          <div className="relative">
            <select value={loanType} onChange={(e) => onLoanTypeChange(e.target.value)} className={selectClass} style={fieldStyle}>
              <option value="All">All Loan Types</option>
              {loanTypeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Loan Scheme">
          <div className="relative">
            <select value={loanScheme} onChange={(e) => onLoanSchemeChange(e.target.value)} className={selectClass} style={fieldStyle}>
              <option value="All">All Schemes</option>
              {schemeOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Bank">
          <div className="relative">
            <select value={bank} onChange={(e) => onBankChange(e.target.value)} className={selectClass} style={fieldStyle}>
              <option value="All">All Banks</option>
              {bankOptions.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Search" className="lg:min-w-[220px] lg:flex-[1.4]">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
            <input
              type="text"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
              placeholder="Search by application ID, name, or phone number..."
              className={inputClass}
              style={fieldStyle}
            />
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