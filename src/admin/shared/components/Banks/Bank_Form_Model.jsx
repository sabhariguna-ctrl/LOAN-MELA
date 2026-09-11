import React, { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Landmark, Upload, X } from 'lucide-react';

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
const labelClass = 'mb-1.5 block text-[12px] font-semibold';
const textInputClass = 'w-full rounded-xl px-3 py-2.5 text-[12.5px] font-medium outline-none placeholder:text-[#9aa1b8]';

const emptyForm = { name: '', logo: null, status: 'Active' };

// Deliberately just the bare identity of a bank (name, logo, active/
// inactive) — branch-level detail (IFSC, type, managers, etc.) belongs to
// Bank_Branch_Modal's "Add Branch Manager" flow instead, one bank can
// carry several of those.
export default function BankFormModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState(() => (initial ? { ...initial } : emptyForm));
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, logo: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = 'Bank name is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({ ...form, name: form.name.trim() });
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}>
        <div className="flex items-start justify-between border-b px-6 py-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: BLUE_TINT, color: BLUE }}>
              <Landmark size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold" style={{ color: TEXT }}>{isEdit ? 'Edit Bank' : 'Add Bank'}</h2>
              <p className="text-[12px]" style={{ color: SLATE }}>Fill in the details to {isEdit ? 'update this' : 'add a new'} bank.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className={labelClass} style={{ color: TEXT }}>Bank Name <span style={{ color: RED }}>*</span></label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="Enter bank name" className={textInputClass} style={fieldStyle} />
              {errors.name && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.name}</p>}
            </div>

            <div>
              <label className={labelClass} style={{ color: TEXT }}>Logo</label>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="flex h-[110px] w-full flex-col items-center justify-center gap-1.5 rounded-xl text-center"
                style={{ border: `1.5px dashed ${BORDER}`, background: BLUE_PALE }}
              >
                {form.logo ? (
                  <img src={form.logo} alt="Logo preview" className="h-full w-full rounded-xl object-contain p-2" />
                ) : (
                  <>
                    <Upload size={18} style={{ color: BLUE }} />
                    <span className="text-[11px] font-medium" style={{ color: SLATE }}>
                      Drag &amp; drop an image here, or click to upload
                    </span>
                    <span className="text-[10px]" style={{ color: SLATE }}>Recommended size: 500 × 500 (JPG, PNG)</span>
                  </>
                )}
              </button>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleLogo} className="hidden" />
            </div>

            <div>
              <label className={labelClass} style={{ color: TEXT }}>Status</label>
              <div className="flex flex-col gap-2.5 pt-1">
                <label className="flex items-start gap-2 text-[12.5px] font-medium" style={{ color: TEXT }}>
                  <input type="radio" name="status" className="mt-0.5" checked={form.status === 'Active'} onChange={() => setForm((f) => ({ ...f, status: 'Active' }))} />
                  <span>
                    Active
                    <span className="block text-[10.5px] font-normal" style={{ color: SLATE }}>Bank will be available for applications.</span>
                  </span>
                </label>
                <label className="flex items-start gap-2 text-[12.5px] font-medium" style={{ color: TEXT }}>
                  <input type="radio" name="status" className="mt-0.5" checked={form.status === 'Inactive'} onChange={() => setForm((f) => ({ ...f, status: 'Inactive' }))} />
                  <span>
                    Inactive
                    <span className="block text-[10.5px] font-normal" style={{ color: SLATE }}>Bank will not be visible for applications.</span>
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: BORDER }}>
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold" style={{ color: TEXT, border: `1px solid ${BORDER}` }}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white" style={{ background: NAVY }}>
            Save Bank
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}