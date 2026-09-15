import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FilePlus2, ChevronDown, X, CheckCircle2 } from 'lucide-react';
import { getSchemes } from '../../services/schemesService';
import { getBanks } from '../../services/banksService';
import { submitApplication } from '../../../../utils/auth';

// Same brand tokens as the rest of the Applications admin components
// (Application_Header.jsx, Applications_List.jsx), kept local since each
// admin component in this project defines its own rather than sharing a
// constants module.
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const RED = '#ef4444';
const GREEN = '#22c55e';
const GREEN_TINT = '#e7f9ee';
const FONT = "'Poppins', sans-serif";

const fieldStyle = { color: TEXT, border: `1px solid ${BORDER}`, background: '#fff' };
const errorFieldStyle = { color: TEXT, border: `1px solid ${RED}`, background: '#fff' };
const selectClass = 'w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none';
const textInputClass = 'w-full rounded-xl px-3 py-2.5 text-[12.5px] font-medium outline-none placeholder:text-[#9aa1b8]';
const labelClass = 'mb-1.5 block text-[12px] font-semibold';

const STATUS_OPTIONS = [
  { key: 'Pending', label: 'Pending', color: '#b3760f' },
  { key: 'Approved', label: 'Approved', color: '#1a9c53' },
  { key: 'Rejected', label: 'Rejected', color: '#c23b1f' },
];

const emptyForm = { schemeId: '', name: '', phone: '', email: '', city: '', amount: '', bankId: '', status: 'Pending' };

function formatAmount(n) {
  if (!n) return '';
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

// Admin-side "log an application on a borrower's behalf" form — the
// counterpart to the public Loan Scheme page's "Apply Now" form
// (Loanschema.jsx), but reachable from /dashboard/applications for
// walk-in / phone applicants instead of requiring them to self-serve.
// Writes through the same submitApplication() store, so it shows up in
// this list, My Applications and the Dashboard analytics immediately.
export default function NewApplicationModal({ onClose }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  // Only active schemes can be picked — same rule the public Loan
  // Scheme page uses to decide what's open for applications.
  const schemes = useMemo(
    () => getSchemes().filter((s) => s.status === 'Active').sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const selectedScheme = schemes.find((s) => s.id === form.schemeId);

  // Only active banks are offered — mirrors the "only active schemes"
  // rule above.
  const banks = useMemo(
    () => getBanks().filter((b) => b.status === 'Active').sort((a, b) => a.name.localeCompare(b.name)),
    []
  );
  const selectedBank = banks.find((b) => b.id === form.bankId);

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!form.schemeId) next.schemeId = 'Select a loan scheme.';
    if (!form.bankId) next.bankId = 'Select a bank.';
    if (!form.name.trim()) next.name = 'Applicant name is required.';
    if (!/^\d{10}$/.test(form.phone.trim())) next.phone = 'Enter a valid 10-digit mobile number.';
    if (!form.email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!form.city.trim()) next.city = 'City is required.';
    if (!form.amount || Number(form.amount) <= 0) next.amount = 'Enter a valid loan amount.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const application = submitApplication({
      userEmail: form.email.trim(),
      schemeId: selectedScheme.id,
      schemeTitle: selectedScheme.name,
      parentName: selectedScheme.loanType,
      categoryLabel: selectedScheme.loanType,
      filterGroup: selectedScheme.category,
      bank: selectedBank.name,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      amount: form.amount.trim ? form.amount.trim() : String(form.amount),
      city: form.city.trim(),
      status: form.status,
    });

    setSubmitted(application);
  };

  const handleAddAnother = () => {
    setForm(emptyForm);
    setErrors({});
    setSubmitted(null);
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white"
        style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}
      >
        <div className="flex items-start justify-between border-b px-6 py-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: BLUE_TINT, color: BLUE }}>
              <FilePlus2 size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold" style={{ color: TEXT }}>New Application</h2>
              <p className="text-[12px]" style={{ color: SLATE }}>Log a loan application on a borrower's behalf.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        {submitted ? (
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: GREEN_TINT, color: GREEN }}>
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-[15px] font-bold" style={{ color: TEXT }}>Application logged</h3>
            <p className="mt-1.5 max-w-xs text-[12.5px]" style={{ color: SLATE }}>
              <strong style={{ color: TEXT }}>{submitted.id}</strong> was created for {submitted.name} —{' '}
              {submitted.schemeTitle}.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={handleAddAnother}
                className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold"
                style={{ color: TEXT, border: `1px solid ${BORDER}` }}
              >
                Add Another
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
                style={{ background: NAVY }}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className={labelClass} style={{ color: TEXT }}>Loan Scheme <span style={{ color: RED }}>*</span></label>
                  <div className="relative">
                    <select
                      value={form.schemeId}
                      onChange={set('schemeId')}
                      className={`${selectClass} py-2.5`}
                      style={errors.schemeId ? errorFieldStyle : fieldStyle}
                    >
                      <option value="">Select a scheme</option>
                      {schemes.map((s) => (
                        <option key={s.id} value={s.id}>{s.name} — {s.loanType}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                  </div>
                  {errors.schemeId && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.schemeId}</p>}
                  {schemes.length === 0 && (
                    <p className="mt-1 text-[10.5px]" style={{ color: SLATE }}>No active schemes yet — add one under Schemes first.</p>
                  )}
                  {selectedScheme && (
                    <p className="mt-1 text-[10.5px]" style={{ color: SLATE }}>
                      {formatAmount(selectedScheme.minAmount)} – {formatAmount(selectedScheme.maxAmount)} · {selectedScheme.interestRate}% p.a. · {selectedScheme.tenure}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass} style={{ color: TEXT }}>Bank <span style={{ color: RED }}>*</span></label>
                  <div className="relative">
                    <select
                      value={form.bankId}
                      onChange={set('bankId')}
                      className={`${selectClass} py-2.5`}
                      style={errors.bankId ? errorFieldStyle : fieldStyle}
                    >
                      <option value="">Select a bank</option>
                      {banks.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                  </div>
                  {errors.bankId && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.bankId}</p>}
                  {banks.length === 0 && (
                    <p className="mt-1 text-[10.5px]" style={{ color: SLATE }}>No active banks yet — add one under Banks first.</p>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} style={{ color: TEXT }}>Applicant Name <span style={{ color: RED }}>*</span></label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={set('name')}
                      placeholder="Full name"
                      className={textInputClass}
                      style={errors.name ? errorFieldStyle : fieldStyle}
                    />
                    {errors.name && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.name}</p>}
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: TEXT }}>Phone Number <span style={{ color: RED }}>*</span></label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      placeholder="10-digit mobile number"
                      className={textInputClass}
                      style={errors.phone ? errorFieldStyle : fieldStyle}
                    />
                    {errors.phone && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass} style={{ color: TEXT }}>Email Address <span style={{ color: RED }}>*</span></label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={set('email')}
                    placeholder="name@example.com"
                    className={textInputClass}
                    style={errors.email ? errorFieldStyle : fieldStyle}
                  />
                  {errors.email && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.email}</p>}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass} style={{ color: TEXT }}>Loan Amount <span style={{ color: RED }}>*</span></label>
                    <input
                      type="number"
                      min="0"
                      value={form.amount}
                      onChange={set('amount')}
                      placeholder="e.g. 250000"
                      className={textInputClass}
                      style={errors.amount ? errorFieldStyle : fieldStyle}
                    />
                    {errors.amount && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.amount}</p>}
                  </div>
                  <div>
                    <label className={labelClass} style={{ color: TEXT }}>City <span style={{ color: RED }}>*</span></label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={set('city')}
                      placeholder="City"
                      className={textInputClass}
                      style={errors.city ? errorFieldStyle : fieldStyle}
                    />
                    {errors.city && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.city}</p>}
                  </div>
                </div>

                <div>
                  <label className={labelClass} style={{ color: TEXT }}>Application Status</label>
                  <div className="flex items-center gap-5 pt-1">
                    {STATUS_OPTIONS.map((opt) => (
                      <label key={opt.key} className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: TEXT }}>
                        <input
                          type="radio"
                          name="new-app-status"
                          checked={form.status === opt.key}
                          onChange={() => setForm((f) => ({ ...f, status: opt.key }))}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                  <p className="mt-1 text-[10.5px]" style={{ color: SLATE }}>
                    Use Pending unless this application was already decided offline.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: BORDER }}>
              <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold" style={{ color: TEXT, border: `1px solid ${BORDER}` }}>
                Cancel
              </button>
              <button type="button" onClick={handleSubmit} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white" style={{ background: NAVY }}>
                Create Application
              </button>
            </div>
          </>
        )}
      </div>
    </div>,
    document.body
  );
}