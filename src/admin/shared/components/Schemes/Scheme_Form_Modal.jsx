import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Landmark, ChevronDown, Upload, X } from 'lucide-react';
import { LOAN_TYPES, CATEGORIES, TENURE_OPTIONS, COLLATERAL_OPTIONS } from '../../services/schemesService';

const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const BLUE_PALE = '#f4f8fd';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const RED = '#ef4444';
const FONT = "'Poppins', sans-serif";

const fieldStyle = { color: TEXT, border: `1px solid ${BORDER}`, background: '#fff' };
const selectClass = 'w-full appearance-none rounded-xl px-3 py-2.5 pr-8 text-[12.5px] font-medium outline-none';
const labelClass = 'mb-1.5 block text-[12px] font-semibold';
const textInputClass = 'w-full rounded-xl px-3 py-2.5 text-[12.5px] font-medium outline-none placeholder:text-[#9aa1b8]';
const textareaClass = `${textInputClass} resize-none`;

const emptyForm = {
  name: '', loanType: '', category: '', shortDescription: '',
  bannerImage: null, keywords: '',
  interestRate: '', maxAmount: '', minAmount: '', tenure: '',
  eligibility: '', documents: '',
  collateral: '', status: 'Active',
};

function SectionTitle({ index, children }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white" style={{ background: BLUE }}>
        {index}
      </span>
      <h3 className="text-[13.5px] font-bold" style={{ color: TEXT }}>{children}</h3>
    </div>
  );
}

export default function SchemeFormModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  // `initial.keywords` is stored as an array; the form edits it as one
  // comma-separated string and splits it back apart again on submit.
  const [form, setForm] = useState(() => initial
    ? { ...initial, keywords: (initial.keywords || []).join(', ') }
    : emptyForm);
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleBanner = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, bannerImage: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Scheme name is required.';
    if (!form.loanType) next.loanType = 'Select a loan type.';
    if (!form.category) next.category = 'Select a category.';
    if (!form.shortDescription.trim()) next.shortDescription = 'Add a short description.';
    if (!form.interestRate || Number(form.interestRate) <= 0) next.interestRate = 'Enter a valid rate.';
    if (!form.maxAmount || Number(form.maxAmount) <= 0) next.maxAmount = 'Enter a valid amount.';
    if (!form.minAmount || Number(form.minAmount) <= 0) next.minAmount = 'Enter a valid amount.';
    if (form.minAmount && form.maxAmount && Number(form.minAmount) > Number(form.maxAmount)) {
      next.minAmount = 'Minimum can\'t exceed maximum.';
    }
    if (!form.tenure) next.tenure = 'Select a tenure.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...form,
      interestRate: Number(form.interestRate),
      maxAmount: Number(form.maxAmount),
      minAmount: Number(form.minAmount),
      keywords: form.keywords.split(',').map((k) => k.trim()).filter(Boolean),
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}>
        <div className="flex items-start justify-between border-b px-6 py-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: BLUE_TINT, color: BLUE }}>
              <Landmark size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold" style={{ color: TEXT }}>{isEdit ? 'Edit Loan Scheme' : 'Add Loan Scheme'}</h2>
              <p className="text-[12px]" style={{ color: SLATE }}>Fill in the details to {isEdit ? 'update this' : 'create a new'} loan scheme.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* 1. Basic Information */}
          <section className="mb-6">
            <SectionTitle index={1}>Basic Information</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Scheme Name <span style={{ color: RED }}>*</span></label>
                <input type="text" value={form.name} onChange={set('name')} placeholder="Enter scheme name" className={textInputClass} style={fieldStyle} />
                {errors.name && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.name}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Loan Type <span style={{ color: RED }}>*</span></label>
                <div className="relative">
                  <select value={form.loanType} onChange={set('loanType')} className={`${selectClass} py-2.5`} style={fieldStyle}>
                    <option value="">Select loan type</option>
                    {LOAN_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                </div>
                {errors.loanType && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.loanType}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Category <span style={{ color: RED }}>*</span></label>
                <div className="relative">
                  <select value={form.category} onChange={set('category')} className={`${selectClass} py-2.5`} style={fieldStyle}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                </div>
                {errors.category && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.category}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Short Description <span style={{ color: RED }}>*</span></label>
                <textarea rows={1} maxLength={200} value={form.shortDescription} onChange={set('shortDescription')} placeholder="Enter a brief description about the scheme" className={textareaClass} style={fieldStyle} />
                <p className="mt-1 text-right text-[10.5px]" style={{ color: SLATE }}>{form.shortDescription.length}/200</p>
                {errors.shortDescription && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.shortDescription}</p>}
              </div>
            </div>
          </section>

          {/* 2. User Interface Details */}
          <section className="mb-6">
            <SectionTitle index={2}>User Interface Details</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Banner Image</label>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex h-[92px] w-full flex-col items-center justify-center gap-1.5 rounded-xl text-center"
                  style={{ border: `1.5px dashed ${BORDER}`, background: BLUE_PALE }}
                >
                  {form.bannerImage ? (
                    <img src={form.bannerImage} alt="Banner preview" className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    <>
                      <Upload size={18} style={{ color: BLUE }} />
                      <span className="text-[11px] font-medium" style={{ color: SLATE }}>
                        Drag &amp; drop an image here, or click to upload
                      </span>
                      <span className="text-[10px]" style={{ color: SLATE }}>Recommended size: 1600 × 500 (JPG, PNG)</span>
                    </>
                  )}
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleBanner} className="hidden" />
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Search Keywords</label>
                <textarea rows={3} maxLength={200} value={form.keywords} onChange={set('keywords')} placeholder="Add keywords (e.g. business, agriculture, medical...)" className={textareaClass} style={fieldStyle} />
                <p className="mt-1 text-[10.5px]" style={{ color: SLATE }}>Separate keywords with commas to make it easier to search.</p>
              </div>
            </div>
          </section>

          {/* 3. Loan Details */}
          <section className="mb-6">
            <SectionTitle index={3}>Loan Details</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Interest Rate (% per annum) <span style={{ color: RED }}>*</span></label>
                <input type="number" min="0" step="0.1" value={form.interestRate} onChange={set('interestRate')} placeholder="e.g. 8.5" className={textInputClass} style={fieldStyle} />
                {errors.interestRate && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.interestRate}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Maximum Loan Amount <span style={{ color: RED }}>*</span></label>
                <input type="number" min="0" value={form.maxAmount} onChange={set('maxAmount')} placeholder="e.g. 10,00,000" className={textInputClass} style={fieldStyle} />
                {errors.maxAmount && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.maxAmount}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Minimum Loan Amount <span style={{ color: RED }}>*</span></label>
                <input type="number" min="0" value={form.minAmount} onChange={set('minAmount')} placeholder="e.g. 10,000" className={textInputClass} style={fieldStyle} />
                {errors.minAmount && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.minAmount}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Loan Tenure <span style={{ color: RED }}>*</span></label>
                <div className="relative">
                  <select value={form.tenure} onChange={set('tenure')} className={`${selectClass} py-2.5`} style={fieldStyle}>
                    <option value="">Select tenure</option>
                    {TENURE_OPTIONS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                </div>
                {errors.tenure && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.tenure}</p>}
              </div>
            </div>
          </section>

          {/* 4. Eligibility & Requirements */}
          <section className="mb-6">
            <SectionTitle index={4}>Eligibility &amp; Requirements</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Eligibility Criteria</label>
                <textarea rows={3} maxLength={300} value={form.eligibility} onChange={set('eligibility')} placeholder="Enter eligibility criteria" className={textareaClass} style={fieldStyle} />
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Required Documents</label>
                <textarea rows={3} maxLength={300} value={form.documents} onChange={set('documents')} placeholder="Enter required documents" className={textareaClass} style={fieldStyle} />
              </div>
            </div>
          </section>

          {/* 5. Additional Settings */}
          <section>
            <SectionTitle index={5}>Additional Settings</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Collateral Requirement</label>
                <div className="relative">
                  <select value={form.collateral} onChange={set('collateral')} className={`${selectClass} py-2.5`} style={fieldStyle}>
                    <option value="">Select requirement</option>
                    {COLLATERAL_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                </div>
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Scheme Status</label>
                <div className="flex items-center gap-5 pt-2">
                  <label className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: TEXT }}>
                    <input type="radio" name="status" checked={form.status === 'Active'} onChange={() => setForm((f) => ({ ...f, status: 'Active' }))} />
                    Active
                  </label>
                  <label className="flex items-center gap-2 text-[12.5px] font-medium" style={{ color: TEXT }}>
                    <input type="radio" name="status" checked={form.status === 'Inactive'} onChange={() => setForm((f) => ({ ...f, status: 'Inactive' }))} />
                    Inactive
                  </label>
                </div>
                <p className="mt-1 text-[10.5px]" style={{ color: SLATE }}>
                  {form.status === 'Active' ? 'Scheme will be available for applications.' : 'Scheme will not be visible for applications.'}
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: BORDER }}>
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold" style={{ color: TEXT, border: `1px solid ${BORDER}` }}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white" style={{ background: NAVY }}>
            Save Scheme
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}