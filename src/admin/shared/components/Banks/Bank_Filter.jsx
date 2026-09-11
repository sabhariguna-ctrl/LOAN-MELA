import React, { useEffect, useState } from 'react';
import { ChevronDown, Search, RotateCcw } from 'lucide-react';
import { BANK_TYPES } from '../../services/banksService';

const NAVY = '#132261';
const TEXT = '#242938';
const SLATE = '#757e9e';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const fieldStyle = { color: TEXT, border: `1px solid ${BORDER}`, background: '#fff' };
const selectClass = 'w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none';
const inputClass = 'w-full rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none placeholder:text-[#9aa1b8]';

function Field({ label, children }) {
  return (
    <div className="flex min-w-[140px] flex-1 flex-col gap-1.5">
      <label className="text-[11.5px] font-semibold" style={{ color: SLATE }}>{label}</label>
      {children}
    </div>
  );
}

export default function BankFilter({
  bankType = 'All',
  status = 'All',
  search = '',
  onBankTypeChange = () => {},
  onStatusChange = () => {},
  onSearchChange = () => {},
  onApply = () => {},
  onReset = () => {},
}) {
  const [draftSearch, setDraftSearch] = useState(search);

  // Keep the staged search text in sync if the parent resets filters, so
  // the field never shows a stale draft the admin didn't type.
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
        <Field label="Bank Type">
          <div className="relative">
            <select value={bankType} onChange={(e) => onBankTypeChange(e.target.value)} className={selectClass} style={fieldStyle}>
              <option value="All">All Bank Types</option>
              {BANK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Status">
          <div className="relative">
            <select value={status} onChange={(e) => onStatusChange(e.target.value)} className={selectClass} style={fieldStyle}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Search">
          <div className="relative">
            <input
              type="text"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleApply(); }}
              placeholder="Search by bank name, IFSC, or branch..."
              className={inputClass}
              style={fieldStyle}
            />
            <Search size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={handleApply} className="whitespace-nowrap rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white" style={{ background: NAVY }}>
            Apply Filters
          </button>
          <button type="button" onClick={handleReset} className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2.5 text-[12.5px] font-semibold" style={{ color: TEXT, border: `1px solid ${BORDER}` }}>
            <RotateCcw size={13} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}