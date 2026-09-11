import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreVertical, Eye, Download, ChevronLeft, ChevronRight, X, User, FileText,
} from 'lucide-react';

const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";
const GREEN_TINT = '#e7f9ee';
const AMBER_TINT = '#fef3e2';

const AVATAR_PALETTE = [BLUE, '#22c55e', '#f5a524', '#a78bfa', '#f4879f', '#2dd4a7', '#f97316'];
const PAGE_SIZE = 5;

function avatarColor(name) {
  const s = name || '?';
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

// A registered user may have a real photo from two possible places:
// `photoUrl` (set later from their Profile page) takes priority since
// it's the one they chose as their profile picture, falling back to the
// passport-size photo they uploaded as a KYC document during Register.
// Only when neither exists do we fall back to the colored-initial circle.
function resolvePhoto(user) {
  return user?.photoUrl || user?.documents?.photo?.dataUrl || null;
}

function UserAvatar({ user, size = 40, textSize = 13 }) {
  const photo = resolvePhoto(user);
  if (photo) {
    return (
      <img
        src={photo}
        alt={user.fullName || 'User'}
        className="shrink-0 rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{ width: size, height: size, fontSize: textSize, background: avatarColor(user?.fullName) }}
    >
      {(user?.fullName || '?').trim().charAt(0).toUpperCase()}
    </span>
  );
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Registered users carry sensitive identifiers (Aadhar, PAN, bank account
// number) collected during Register's KYC steps. The admin list still
// needs enough of each to confirm identity against a physical document,
// but showing them in full on a screen is unnecessary exposure — mask all
// but the last 4 characters, same convention as a bank statement.
function mask(value) {
  if (!value) return '—';
  const s = String(value);
  if (s.length <= 4) return s;
  return `${'•'.repeat(s.length - 4)}${s.slice(-4)}`;
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows) {
  const headers = ['Full Name', 'Email', 'Phone', 'City', 'State', 'Business Name', 'Applications', 'Registered On'];
  const lines = [headers.join(',')];
  rows.forEach((r) => {
    lines.push([
      r.fullName, r.email, r.mobile, r.city, r.state, r.businessName, r.applicationCount, formatDate(r.registeredAt),
    ].map(csvCell).join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registered-users-export-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function RowMenu({ borrower, onView }) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState(null);
  const btnRef = useRef(null);

  const toggle = () => {
    if (open) { setOpen(false); return; }
    setRect(btnRef.current.getBoundingClientRect());
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

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        onClick={toggle}
        className="rounded-lg p-1.5 hover:bg-[#f5f6fb]"
        style={{ color: SLATE }}
        aria-label="Row actions"
      >
        <MoreVertical size={16} />
      </button>
      {open && rect && createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={close} />
          <div
            className="fixed z-[101] w-44 overflow-hidden rounded-xl bg-white py-1"
            style={{
              top: rect.bottom + 6,
              left: Math.max(8, rect.right - 176),
              border: `1px solid ${BORDER}`,
              boxShadow: '0 12px 28px -12px rgba(19,34,97,0.3)',
            }}
          >
            <button
              type="button"
              onClick={() => { onView(borrower); close(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]"
              style={{ color: TEXT }}
            >
              <Eye size={14} /> View Profile
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function DetailModal({ borrower, onClose }) {
  if (!borrower) return null;
  const sections = [
    {
      title: 'Contact',
      rows: [
        ['Full Name', borrower.fullName],
        ['Email', borrower.email],
        ['Phone', borrower.mobile],
        ['Gender', borrower.gender],
        ['Date of Birth', borrower.dob],
      ],
    },
    {
      title: 'Address',
      rows: [
        ['Address', borrower.addressLine],
        ['City', borrower.city],
        ['State', borrower.state],
        ['Pincode', borrower.pincode],
      ],
    },
    {
      title: 'Identity (masked)',
      rows: [
        ['Aadhar', mask(borrower.aadhar)],
        ['PAN', mask(borrower.pan)],
      ],
    },
    {
      title: 'Business',
      rows: [
        ['Business Name', borrower.businessName],
        ['Business Type', borrower.businessType],
        ['Udyam Number', borrower.udyamNumber],
        ['GSTIN', borrower.gstin],
        ['Years In Operation', borrower.yearsInOperation],
        ['Monthly Income', borrower.monthlyIncome],
      ],
    },
    {
      title: 'Banking (masked)',
      rows: [
        ['Bank Name', borrower.bankName],
        ['Account Number', mask(borrower.accountNumber)],
        ['IFSC', borrower.ifsc],
      ],
    },
  ].filter((section) => section.rows.some(([, v]) => v));

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div
        className="relative flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white"
        style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}
      >
        <div className="flex items-start justify-between border-b p-5" style={{ borderColor: BORDER }}>
          <div className="flex items-center gap-2.5">
            <UserAvatar user={borrower} size={40} textSize={13} />
            <div>
              <p className="text-[14px] font-bold" style={{ color: TEXT }}>{borrower.fullName || 'Unnamed'}</p>
              <p className="text-[12px]" style={{ color: SLATE }}>
                Registered {formatDate(borrower.registeredAt)} · {borrower.applicationCount} application{borrower.applicationCount === 1 ? '' : 's'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {sections.map((section) => (
            <div key={section.title} className="mb-5 last:mb-0">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>{section.title}</p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                {section.rows.filter(([, v]) => v).map(([label, value]) => (
                  <div key={label}>
                    <p className="text-[10.5px] font-semibold" style={{ color: SLATE }}>{label}</p>
                    <p className="text-[12.5px] font-medium" style={{ color: TEXT }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

// `borrowers` is the already-filtered/searched list from BorrowersPage,
// each item is a registered user (from getUsers()) plus an
// `applicationCount` field this component doesn't compute itself.
export default function RegisteredUsersList({ borrowers = [] }) {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [borrowers.length]);

  const totalPages = Math.max(1, Math.ceil(borrowers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = borrowers.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.email));

  const toggleRow = (email) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(email)) next.delete(email); else next.add(email);
      return next;
    });
  };
  const toggleAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageRows.forEach((r) => next.delete(r.email));
      else pageRows.forEach((r) => next.add(r.email));
      return next;
    });
  };

  const handleExport = () => {
    const rows = selectedIds.size > 0 ? borrowers.filter((b) => selectedIds.has(b.email)) : borrowers;
    if (rows.length > 0) downloadCsv(rows);
  };

  const pageNumbers = useMemo(() => {
    const set = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
    return [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [totalPages, safePage]);

  return (
    <div className="rounded-2xl bg-white p-4" style={{ fontFamily: FONT, border: `1px solid ${BORDER}` }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <User size={16} style={{ color: BLUE }} />
          <p className="text-[13px] font-semibold" style={{ color: TEXT }}>
            {borrowers.length} registered user{borrowers.length === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={borrowers.length === 0}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-[12.5px] font-semibold disabled:opacity-40"
          style={{ color: TEXT, border: `1px solid ${BORDER}` }}
        >
          <Download size={14} />
          Export{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
        </button>
      </div>

      {borrowers.length === 0 ? (
        <p className="py-12 text-center text-[13px]" style={{ color: SLATE }}>
          No registered users match these filters.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <th className="w-8 px-2 py-2.5">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleAllOnPage} />
                  </th>
                  {['User', 'Email', 'Phone', 'City', 'Applications', 'Registered On', ''].map((h) => (
                    <th key={h} className="px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SLATE }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row) => (
                  <tr key={row.email} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td className="px-2 py-3">
                      <input type="checkbox" checked={selectedIds.has(row.email)} onChange={() => toggleRow(row.email)} />
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <UserAvatar user={row} size={24} textSize={10.5} />
                        <span className="text-[12.5px] font-medium" style={{ color: TEXT }}>{row.fullName || 'Unnamed'}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.email}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.mobile || '—'}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.city || '—'}</td>
                    <td className="px-2 py-3">
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                        style={{ color: row.applicationCount > 0 ? '#1a9c53' : SLATE, background: row.applicationCount > 0 ? GREEN_TINT : '#f5f6fb' }}
                      >
                        <FileText size={11} /> {row.applicationCount}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-[12px]" style={{ color: SLATE }}>{formatDate(row.registeredAt)}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => setViewing(row)}
                          className="rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold"
                          style={{ color: BLUE, border: `1px solid ${BORDER}` }}
                        >
                          View
                        </button>
                        <RowMenu borrower={row} onView={setViewing} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px]" style={{ color: SLATE }}>
              Showing {(safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, borrowers.length)} of {borrowers.length} registered users
            </p>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="rounded-lg p-1.5 disabled:opacity-30"
                style={{ border: `1px solid ${BORDER}`, color: TEXT }}
                aria-label="Previous page"
              >
                <ChevronLeft size={14} />
              </button>
              {pageNumbers.map((n, i) => (
                <React.Fragment key={n}>
                  {i > 0 && n - pageNumbers[i - 1] > 1 && <span className="px-1 text-[12px]" style={{ color: SLATE }}>…</span>}
                  <button
                    type="button"
                    onClick={() => setPage(n)}
                    className="min-w-[30px] rounded-lg px-2 py-1.5 text-[12px] font-semibold"
                    style={{
                      background: n === safePage ? BLUE : '#fff',
                      color: n === safePage ? '#fff' : TEXT,
                      border: `1px solid ${n === safePage ? BLUE : BORDER}`,
                    }}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))}
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="rounded-lg p-1.5 disabled:opacity-30"
                style={{ border: `1px solid ${BORDER}`, color: TEXT }}
                aria-label="Next page"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}

      {viewing && <DetailModal borrower={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}