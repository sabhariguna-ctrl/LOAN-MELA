import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { UserCog, ChevronDown, X, Plus, Trash2, Camera } from 'lucide-react';
import { getBanks, BANK_TYPES } from '../../services/banksService';

const MANAGER_ROLES = ['Branch Manager', 'Assistant Branch Manager', 'Relationship Manager', 'Operations Manager'];

// A manager's photo only ever renders inside a small round avatar, but a
// phone-camera photo can be several MB — stored as-is, a handful of these
// blow past localStorage's quota (the same issue the Profile page photo
// upload hit). Downscaling to a modest size before saving avoids that.
function resizeImageToDataUrl(file, maxDimension = 320, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDimension) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else if (height >= width && height > maxDimension) {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
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

let managerRowSeq = 0;
function newManagerRow() {
  managerRowSeq += 1;
  return { rowId: `mgr-${managerRowSeq}`, name: '', employeeId: '', phone: '', email: '', role: 'Branch Manager', photo: null };
}

const emptyForm = {
  bankId: '', branchName: '', ifscCode: '', bankType: '', shortDescription: '',
  managers: [newManagerRow()],
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

// "Add Branch Manager": pick one of the banks already added via "Add
// Bank", give that branch its own IFSC/type/description, then list one
// or more branch managers for it (name + contact, with "+" to add more).
export default function BankBranchModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [banks] = useState(() => getBanks());
  const [form, setForm] = useState(() => (initial
    ? { ...initial, managers: initial.managers?.length ? initial.managers.map((m) => ({ rowId: m.rowId || `mgr-${Math.random()}`, ...m })) : [newManagerRow()] }
    : emptyForm));
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const setManager = (rowId, key) => (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, managers: f.managers.map((m) => (m.rowId === rowId ? { ...m, [key]: value } : m)) }));
  };

  const setManagerPhoto = (rowId) => async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const resized = await resizeImageToDataUrl(file);
      setForm((f) => ({ ...f, managers: f.managers.map((m) => (m.rowId === rowId ? { ...m, photo: resized } : m)) }));
    } catch {
      // Skip silently — the row simply keeps whatever photo it had before.
    }
  };

  const addManagerRow = () => setForm((f) => ({ ...f, managers: [...f.managers, newManagerRow()] }));
  const removeManagerRow = (rowId) => setForm((f) => ({
    ...f,
    managers: f.managers.length > 1 ? f.managers.filter((m) => m.rowId !== rowId) : f.managers,
  }));

  const validate = () => {
    const next = {};
    if (!form.bankId) next.bankId = 'Select a bank.';
    if (!form.branchName.trim()) next.branchName = 'Branch name is required.';
    if (!form.ifscCode.trim()) next.ifscCode = 'IFSC code is required.';
    else if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(form.ifscCode.trim())) next.ifscCode = 'Enter a valid 11-character IFSC code.';
    if (!form.bankType) next.bankType = 'Select a bank type.';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const bank = banks.find((b) => b.id === form.bankId);
    onSave({
      ...form,
      ifscCode: form.ifscCode.trim().toUpperCase(),
      bankName: bank?.name || '',
      managers: form.managers
        .map(({ rowId, ...rest }) => rest)
        .filter((m) => m.name.trim() || m.phone.trim() || m.email.trim() || m.employeeId.trim()),
    });
  };

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white" style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}>
        <div className="flex items-start justify-between border-b px-6 py-4" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: BLUE_TINT, color: BLUE }}>
              <UserCog size={18} />
            </div>
            <div>
              <h2 className="text-[15px] font-bold" style={{ color: TEXT }}>{isEdit ? 'Edit Branch Manager' : 'Add Branch Manager'}</h2>
              <p className="text-[12px]" style={{ color: SLATE }}>Fill in the branch and manager details for a registered bank.</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {/* 1. Branch details */}
          <section className="mb-6">
            <SectionTitle index={1}>Branch Details</SectionTitle>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Bank Name <span style={{ color: RED }}>*</span></label>
                <div className="relative">
                  <select value={form.bankId} onChange={set('bankId')} className={`${selectClass} py-2.5`} style={fieldStyle} disabled={banks.length === 0}>
                    <option value="">{banks.length === 0 ? 'Add a bank first' : 'Select bank'}</option>
                    {banks.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                </div>
                {errors.bankId && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.bankId}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Bank Branch <span style={{ color: RED }}>*</span></label>
                <input type="text" value={form.branchName} onChange={set('branchName')} placeholder="Enter branch name" className={textInputClass} style={fieldStyle} />
                {errors.branchName && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.branchName}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>IFSC Code of Bank Branch <span style={{ color: RED }}>*</span></label>
                <input type="text" value={form.ifscCode} onChange={set('ifscCode')} placeholder="Enter IFSC code" maxLength={11} className={textInputClass} style={{ ...fieldStyle, textTransform: 'uppercase' }} />
                {errors.ifscCode && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.ifscCode}</p>}
              </div>
              <div>
                <label className={labelClass} style={{ color: TEXT }}>Bank Type <span style={{ color: RED }}>*</span></label>
                <div className="relative">
                  <select value={form.bankType} onChange={set('bankType')} className={`${selectClass} py-2.5`} style={fieldStyle}>
                    <option value="">Select bank type</option>
                    {BANK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                </div>
                {errors.bankType && <p className="mt-1 text-[11px]" style={{ color: RED }}>{errors.bankType}</p>}
              </div>
              <div className="sm:col-span-2">
                <label className={labelClass} style={{ color: TEXT }}>Short Description</label>
                <textarea rows={2} maxLength={200} value={form.shortDescription} onChange={set('shortDescription')} placeholder="Enter a brief description about this branch" className={textareaClass} style={fieldStyle} />
                <p className="mt-1 text-right text-[10.5px]" style={{ color: SLATE }}>{form.shortDescription.length}/200</p>
              </div>
            </div>
          </section>

          {/* 2. Branch manager details */}
          <section>
            <div className="mb-3 flex items-center justify-between">
              <SectionTitle index={2}>Branch Manager Details</SectionTitle>
              <button
                type="button"
                onClick={addManagerRow}
                className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold"
                style={{ color: BLUE, border: `1px solid ${BORDER}` }}
              >
                <Plus size={13} /> Add Manager
              </button>
            </div>
            <p className="-mt-2 mb-3 text-[11px]" style={{ color: SLATE }}>Add one or more branch manager details for this branch.</p>

            <div className="flex flex-col gap-3">
              {form.managers.map((m, i) => (
                <div key={m.rowId} className="flex items-start gap-3 rounded-xl p-3" style={{ border: `1px solid ${BORDER}` }}>
                  <div className="flex shrink-0 flex-col items-center gap-1.5 pt-0.5">
                    <label
                      htmlFor={`mgr-photo-${m.rowId}`}
                      className="relative flex h-14 w-14 cursor-pointer items-center justify-center overflow-hidden rounded-full"
                      style={{ background: BLUE_TINT, border: `1px solid ${BORDER}` }}
                    >
                      {m.photo ? (
                        <img src={m.photo} alt={m.name || 'Manager'} className="h-full w-full object-cover" />
                      ) : (
                        <UserCog size={20} style={{ color: BLUE }} />
                      )}
                      <span
                        className="absolute bottom-0 right-0 flex h-5 w-5 items-center justify-center rounded-full border border-white"
                        style={{ background: BLUE }}
                      >
                        <Camera size={10} color="#fff" />
                      </span>
                    </label>
                    <input id={`mgr-photo-${m.rowId}`} type="file" accept="image/*" onChange={setManagerPhoto(m.rowId)} className="hidden" />
                    <span className="text-center text-[9.5px] leading-tight" style={{ color: SLATE }}>Photo</span>
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className={labelClass} style={{ color: TEXT }}>Manager Name</label>
                      <input type="text" value={m.name} onChange={setManager(m.rowId, 'name')} placeholder="Enter manager name" className={textInputClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ color: TEXT }}>Manager ID / Employee ID</label>
                      <input type="text" value={m.employeeId} onChange={setManager(m.rowId, 'employeeId')} placeholder="Enter employee ID" className={textInputClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ color: TEXT }}>Phone Number</label>
                      <input type="text" value={m.phone} onChange={setManager(m.rowId, 'phone')} placeholder="Enter contact number" className={textInputClass} style={fieldStyle} />
                    </div>
                    <div>
                      <label className={labelClass} style={{ color: TEXT }}>Email</label>
                      <input type="email" value={m.email} onChange={setManager(m.rowId, 'email')} placeholder="Enter email address" className={textInputClass} style={fieldStyle} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass} style={{ color: TEXT }}>Role</label>
                      <div className="relative">
                        <select value={m.role} onChange={setManager(m.rowId, 'role')} className={`${selectClass} py-2.5`} style={fieldStyle}>
                          {MANAGER_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: SLATE }} />
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeManagerRow(m.rowId)}
                    disabled={form.managers.length === 1}
                    className="mt-6 shrink-0 rounded-lg p-2 disabled:opacity-30"
                    style={{ color: RED }}
                    aria-label="Remove manager"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex items-center justify-end gap-2 border-t px-6 py-4" style={{ borderColor: BORDER }}>
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold" style={{ color: TEXT, border: `1px solid ${BORDER}` }}>
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} className="rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white" style={{ background: NAVY }}>
            Save Branch Manager
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}