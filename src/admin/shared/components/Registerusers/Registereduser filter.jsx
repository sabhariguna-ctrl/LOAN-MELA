import React from 'react';
import { Search, ChevronDown, RotateCcw } from 'lucide-react';

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
    <div className="flex min-w-[160px] flex-1 flex-col gap-1.5">
      <label className="text-[11.5px] font-semibold" style={{ color: SLATE }}>{label}</label>
      {children}
    </div>
  );
}

export default function RegisteredUserFilter({
  search = '',
  onSearchChange = () => {},
  city = 'All',
  cityOptions = [],
  onCityChange = () => {},
  hasApplications = 'All',
  onHasApplicationsChange = () => {},
  onReset = () => {},
}) {
  return (
    <div className="rounded-2xl bg-white p-4" style={{ fontFamily: FONT, border: `1px solid ${BORDER}` }}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <Field label="Search">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Name, email or phone…"
              className="w-full rounded-xl py-2.5 pl-9 pr-3 text-[12.5px] font-medium outline-none"
              style={fieldStyle}
            />
          </div>
        </Field>

        <Field label="City">
          <div className="relative">
            <select
              value={city}
              onChange={(e) => onCityChange(e.target.value)}
              className="w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none"
              style={fieldStyle}
            >
              <option value="All">All Cities</option>
              {cityOptions.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <Field label="Applications">
          <div className="relative">
            <select
              value={hasApplications}
              onChange={(e) => onHasApplicationsChange(e.target.value)}
              className="w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none"
              style={fieldStyle}
            >
              <option value="All">All Users</option>
              <option value="Yes">Has Applied</option>
              <option value="No">Never Applied</option>
            </select>
            <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
          </div>
        </Field>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onReset}
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