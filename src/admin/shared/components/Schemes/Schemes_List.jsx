import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Download, Pencil, MoreVertical, Eye, ToggleLeft, ToggleRight, Trash2,
  ChevronLeft, ChevronRight, X, Building2, AlertTriangle,
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
const RED = '#ef4444';
const RED_TINT = '#fdeceb';

const PAGE_SIZE = 7;

function formatAmount(n) {
  const num = Number(n);
  if (!num) return '—';
  return `₹${num.toLocaleString('en-IN')}`;
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows) {
  const headers = ['ID', 'Scheme Name', 'Loan Type', 'Category', 'Bank', 'Interest Rate', 'Max Amount', 'Tenure', 'Status'];
  const lines = [headers.join(',')];
  rows.forEach((r) => {
    lines.push([r.id, r.name, r.loanType, r.category, r.bankName, `${r.interestRate}%`, r.maxAmount, r.tenure, r.status].map(csvCell).join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `loan-schemes-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function StatusPill({ status }) {
  const active = status === 'Active';
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold"
      style={{ color: active ? '#1a9c53' : '#b3760f', background: active ? GREEN_TINT : AMBER_TINT }}
    >
      {status}
    </span>
  );
}

function RowMenu({ scheme, onView, onToggleStatus, onDelete }) {
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
      <button ref={btnRef} type="button" onClick={toggle} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }} aria-label="Row actions">
        <MoreVertical size={16} />
      </button>
      {open && rect && createPortal(
        <>
          <div className="fixed inset-0 z-[100]" onClick={close} />
          <div
            className="fixed z-[101] w-48 overflow-hidden rounded-xl bg-white py-1"
            style={{ top: rect.bottom + 6, left: Math.max(8, rect.right - 192), border: `1px solid ${BORDER}`, boxShadow: '0 12px 28px -12px rgba(19,34,97,0.3)' }}
          >
            <button type="button" onClick={() => { onView(scheme); close(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]" style={{ color: TEXT }}>
              <Eye size={14} /> View Details
            </button>
            <button type="button" onClick={() => { onToggleStatus(scheme); close(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]" style={{ color: scheme.status === 'Active' ? '#b3760f' : '#1a9c53' }}>
              {scheme.status === 'Active' ? <ToggleLeft size={14} /> : <ToggleRight size={14} />}
              {scheme.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}
            </button>
            <button type="button" onClick={() => { onDelete(scheme); close(); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-[#fdf0ee]" style={{ color: '#c23b1f' }}>
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

function DetailModal({ scheme, onClose }) {
  if (!scheme) return null;
  const rows = [
    ['Loan Type', scheme.loanType],
    ['Category', scheme.category],
    ['Bank', scheme.bankName],
    ['Interest Rate', `${scheme.interestRate}% per annum`],
    ['Loan Amount', `${formatAmount(scheme.minAmount)} - ${formatAmount(scheme.maxAmount)}`],
    ['Tenure', scheme.tenure],
    ['Collateral', scheme.collateral],
    ['Eligibility', scheme.eligibility],
    ['Required Documents', scheme.documents],
  ];

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-5" style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: BLUE_TINT, color: BLUE }}>
              <Building2 size={18} />
            </div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: TEXT }}>{scheme.name}</p>
              <StatusPill status={scheme.status} />
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        <p className="mb-4 text-[12.5px]" style={{ color: SLATE }}>{scheme.shortDescription}</p>

        <dl className="flex flex-col gap-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <dt className="shrink-0" style={{ color: SLATE }}>{label}</dt>
              <dd className="text-right font-semibold" style={{ color: TEXT }}>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    document.body
  );
}

function DeleteConfirm({ scheme, onCancel, onConfirm }) {
  if (!scheme) return null;
  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-5" style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}>
        <div className="flex h-11 w-11 items-center justify-center rounded-full" style={{ background: RED_TINT, color: RED }}>
          <AlertTriangle size={20} />
        </div>
        <h3 className="mt-3 text-[15px] font-bold" style={{ color: TEXT }}>Delete this scheme?</h3>
        <p className="mt-1 text-[12.5px]" style={{ color: SLATE }}>
          “{scheme.name}” will be removed and will no longer be visible to borrowers. This can't be undone.
        </p>
        <div className="mt-5 flex gap-2">
          <button type="button" onClick={onCancel} className="flex-1 rounded-xl py-2.5 text-[12.5px] font-semibold" style={{ color: TEXT, border: `1px solid ${BORDER}` }}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} className="flex-1 rounded-xl py-2.5 text-[12.5px] font-semibold text-white" style={{ background: RED }}>
            Delete Scheme
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function SchemesList({
  schemes = [],
  allCount = 0,
  activeCount = 0,
  inactiveCount = 0,
  tab = 'All',
  onTabChange = () => {},
  onEdit = () => {},
  onToggleStatus = () => {},
  onDelete = () => {},
}) {
  const [page, setPage] = useState(1);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => setPage(1), [tab, schemes.length]);

  const totalPages = Math.max(1, Math.ceil(schemes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = schemes.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  // Windowed page numbers (first, last, current ±1, with "…" gaps) so a
  // large result set doesn't render a page button for every single page.
  const pageNumbers = useMemo(() => {
    const set = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
    return [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [totalPages, safePage]);

  const tabs = [
    { key: 'All', label: 'All Schemes', count: allCount },
    { key: 'Active', label: 'Active', count: activeCount },
    { key: 'Inactive', label: 'Inactive', count: inactiveCount },
  ];

  const handleConfirmDelete = () => {
    onDelete(deleting);
    setDeleting(null);
  };

  return (
    <div className="rounded-2xl bg-white p-4" style={{ fontFamily: FONT, border: `1px solid ${BORDER}` }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => onTabChange(t.key)}
                className="whitespace-nowrap rounded-full px-3.5 py-2 text-[12px] font-semibold"
                style={{ background: active ? NAVY : '#fff', color: active ? '#fff' : TEXT, border: `1px solid ${active ? NAVY : BORDER}` }}
              >
                {t.label} ({t.count})
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() => downloadCsv(schemes)}
          disabled={schemes.length === 0}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-[12.5px] font-semibold disabled:opacity-40"
          style={{ color: TEXT, border: `1px solid ${BORDER}` }}
        >
          <Download size={14} />
          Export
        </button>
      </div>

      {schemes.length === 0 ? (
        <p className="py-12 text-center text-[13px]" style={{ color: SLATE }}>No loan schemes match these filters.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[940px] border-collapse text-left">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  {['#', 'Scheme Name', 'Loan Type', 'Category', 'Bank', 'Interest Rate', 'Max Amount', 'Tenure', 'Status', ''].map((h) => (
                    <th key={h} className="px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SLATE }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td className="px-2 py-3 text-[12px]" style={{ color: SLATE }}>{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-2 py-3 text-[12.5px] font-semibold" style={{ color: BLUE }}>{row.name}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.loanType}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.category}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.bankName || '—'}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.interestRate}%</td>
                    <td className="px-2 py-3 text-[12.5px] font-semibold" style={{ color: TEXT }}>{formatAmount(row.maxAmount)}</td>
                    <td className="px-2 py-3 text-[12px]" style={{ color: SLATE }}>{row.tenure}</td>
                    <td className="px-2 py-3"><StatusPill status={row.status} /></td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => onEdit(row)} className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11.5px] font-semibold" style={{ color: BLUE, border: `1px solid ${BORDER}` }}>
                          <Pencil size={12} /> Edit
                        </button>
                        <RowMenu scheme={row} onView={setViewing} onToggleStatus={onToggleStatus} onDelete={setDeleting} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px]" style={{ color: SLATE }}>
              Showing {(safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, schemes.length)} of {schemes.length} schemes
            </p>
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="rounded-lg p-1.5 disabled:opacity-30" style={{ border: `1px solid ${BORDER}`, color: TEXT }} aria-label="Previous page">
                <ChevronLeft size={14} />
              </button>
              {pageNumbers.map((n, i) => (
                <React.Fragment key={n}>
                  {i > 0 && n - pageNumbers[i - 1] > 1 && <span className="px-1 text-[12px]" style={{ color: SLATE }}>…</span>}
                  <button
                    type="button"
                    onClick={() => setPage(n)}
                    className="min-w-[30px] rounded-lg px-2 py-1.5 text-[12px] font-semibold"
                    style={{ background: n === safePage ? BLUE : '#fff', color: n === safePage ? '#fff' : TEXT, border: `1px solid ${n === safePage ? BLUE : BORDER}` }}
                  >
                    {n}
                  </button>
                </React.Fragment>
              ))}
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="rounded-lg p-1.5 disabled:opacity-30" style={{ border: `1px solid ${BORDER}`, color: TEXT }} aria-label="Next page">
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </>
      )}

      {viewing && <DetailModal scheme={viewing} onClose={() => setViewing(null)} />}
      {deleting && <DeleteConfirm scheme={deleting} onCancel={() => setDeleting(null)} onConfirm={handleConfirmDelete} />}
    </div>
  );
}