import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  MoreVertical, Eye, Clock, XCircle, Download,
  ChevronLeft, ChevronRight, X, FileCheck2,
} from 'lucide-react';

const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const SLATE = '#757e9e';
const TEXT = '#242938';
const BORDER = '#e7e9f2';
const FONT = "'Poppins', sans-serif";

const GREEN = '#22c55e';
const GREEN_TINT = '#e7f9ee';

const AVATAR_PALETTE = [BLUE, GREEN, '#f5a524', '#a78bfa', '#f4879f', '#2dd4a7', '#f97316'];
const PAGE_SIZE = 5;

function avatarColor(name) {
  const s = name || '?';
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

function formatAmount(raw) {
  const n = parseInt(raw, 10);
  if (!n) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCsv(rows) {
  const headers = ['Application ID', 'Applicant Name', 'Loan Type', 'Loan Scheme', 'Bank', 'Approved Date', 'Loan Amount'];
  const lines = [headers.join(',')];
  rows.forEach((r) => {
    lines.push([
      r.id, r.name, r.filterGroup || r.categoryLabel, r.schemeTitle, r.bank || '—',
      formatDate(r.statusUpdatedAt || r.appliedAt), r.amount,
    ].map(csvCell).join(','));
  });
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `approved-applications-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function StatusPill() {
  return (
    <span className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold" style={{ color: '#1a9c53', background: GREEN_TINT }}>
      Approved
    </span>
  );
}

// Row-level "..." menu — an approved row can still be walked back to
// Pending or Rejected (e.g. approved in error), so this reuses the same
// updateApplicationStatus flow the Applications page's row menu does,
// just without an "Approve" option since that's already true here.
// Portal-rendered for the same reason Applications_List.jsx's is: this
// table sits inside an overflow-x-auto wrapper.
function RowMenu({ application, onView, onUpdateStatus }) {
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

  const statusActions = [
    { key: 'Pending', label: 'Mark Pending', icon: Clock, color: '#b3760f' },
    { key: 'Rejected', label: 'Reject', icon: XCircle, color: '#c23b1f' },
  ];

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
            style={{ top: rect.bottom + 6, left: Math.max(8, rect.right - 176), border: `1px solid ${BORDER}`, boxShadow: '0 12px 28px -12px rgba(19,34,97,0.3)' }}
          >
            <button
              type="button"
              onClick={() => { onView(application); close(); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]"
              style={{ color: TEXT }}
            >
              <Eye size={14} /> View Details
            </button>
            {statusActions.map((a) => (
              <button
                key={a.key}
                type="button"
                onClick={() => { onUpdateStatus(application.id, a.key); close(); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-[12px] font-medium hover:bg-[#f4f8fd]"
                style={{ color: a.color }}
              >
                <a.icon size={14} /> {a.label}
              </button>
            ))}
          </div>
        </>,
        document.body
      )}
    </>
  );
}

// Full-detail view for a single approved application, opened from the
// row's "View" button.
function DetailModal({ application, onClose }) {
  if (!application) return null;
  const rows = [
    ['Applicant', application.name],
    ['Phone', application.phone],
    ['Email', application.email],
    ['City', application.city],
    ['Loan Scheme', application.schemeTitle],
    ['Loan Type', application.filterGroup || application.categoryLabel],
    ['Bank', application.bank || '—'],
    ['Loan Amount', formatAmount(application.amount)],
    ['Applied On', formatDate(application.appliedAt)],
    ['Approved On', formatDate(application.statusUpdatedAt || application.appliedAt)],
  ];

  return createPortal(
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4" style={{ fontFamily: FONT }}>
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-5" style={{ boxShadow: '0 30px 60px -20px rgba(19,34,97,0.4)' }}>
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: GREEN_TINT, color: GREEN }}>
              <FileCheck2 size={18} />
            </div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: TEXT }}>{application.id}</p>
              <StatusPill />
            </div>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-1.5 hover:bg-[#f5f6fb]" style={{ color: SLATE }}>
            <X size={18} />
          </button>
        </div>

        <dl className="flex flex-col gap-2.5">
          {rows.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-3 text-[12.5px]">
              <dt style={{ color: SLATE }}>{label}</dt>
              <dd className="text-right font-semibold" style={{ color: TEXT }}>{value || '—'}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>,
    document.body
  );
}

// "Approved Applications (N)" — the table + pagination. `applications`
// here is already filtered by Approved_Filter (loan type + scheme + bank
// + search); this component only owns row selection, the view/revoke row
// menu, export, and pagination — same split of responsibility as
// Applications_List.jsx.
export default function ApprovedList({
  applications = [],
  onUpdateStatus = () => {},
}) {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [viewing, setViewing] = useState(null);

  useEffect(() => {
    setPage(1);
    setSelectedIds(new Set());
  }, [applications.length]);

  const totalPages = Math.max(1, Math.ceil(applications.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageRows = applications.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const allPageSelected = pageRows.length > 0 && pageRows.every((r) => selectedIds.has(r.id));

  const toggleRow = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const toggleAllOnPage = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allPageSelected) pageRows.forEach((r) => next.delete(r.id));
      else pageRows.forEach((r) => next.add(r.id));
      return next;
    });
  };

  const handleExport = () => {
    const rows = selectedIds.size > 0 ? applications.filter((a) => selectedIds.has(a.id)) : applications;
    if (rows.length > 0) downloadCsv(rows);
  };

  const pageNumbers = useMemo(() => {
    const set = new Set([1, totalPages, safePage, safePage - 1, safePage + 1]);
    return [...set].filter((n) => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [totalPages, safePage]);

  return (
    <div className="rounded-2xl bg-white p-4" style={{ fontFamily: FONT, border: `1px solid ${BORDER}` }}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <span
          className="whitespace-nowrap rounded-full px-3.5 py-2 text-[12.5px] font-semibold text-white"
          style={{ background: NAVY }}
        >
          Approved Applications ({applications.length})
        </span>
        <button
          type="button"
          onClick={handleExport}
          disabled={applications.length === 0}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3.5 py-2 text-[12.5px] font-semibold disabled:opacity-40"
          style={{ color: TEXT, border: `1px solid ${BORDER}` }}
        >
          <Download size={14} />
          Export{selectedIds.size > 0 ? ` (${selectedIds.size})` : ''}
        </button>
      </div>

      {applications.length === 0 ? (
        <p className="py-12 text-center text-[13px]" style={{ color: SLATE }}>
          No approved applications match these filters.
        </p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left">
              <thead>
                <tr style={{ borderBottom: `1px solid ${BORDER}` }}>
                  <th className="w-8 px-2 py-2.5">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleAllOnPage} />
                  </th>
                  <th className="w-8 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SLATE }}>#</th>
                  {['Application ID', 'Applicant Name', 'Loan Type', 'Loan Scheme', 'Bank', 'Approved Date', 'Loan Amount', 'Status', ''].map((h) => (
                    <th key={h} className="px-2 py-2.5 text-[11px] font-semibold uppercase tracking-wide" style={{ color: SLATE }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageRows.map((row, i) => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${BORDER}` }}>
                    <td className="px-2 py-3">
                      <input type="checkbox" checked={selectedIds.has(row.id)} onChange={() => toggleRow(row.id)} />
                    </td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: SLATE }}>{(safePage - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-2 py-3 text-[12.5px] font-semibold" style={{ color: BLUE }}>{row.id}</td>
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10.5px] font-bold text-white"
                          style={{ background: avatarColor(row.name) }}
                        >
                          {(row.name || '?').trim().charAt(0).toUpperCase()}
                        </span>
                        <span className="text-[12.5px] font-medium" style={{ color: TEXT }}>{row.name || '—'}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.filterGroup || row.categoryLabel || '—'}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.schemeTitle || '—'}</td>
                    <td className="px-2 py-3 text-[12.5px]" style={{ color: TEXT }}>{row.bank || '—'}</td>
                    <td className="px-2 py-3 text-[12px]" style={{ color: SLATE }}>{formatDate(row.statusUpdatedAt || row.appliedAt)}</td>
                    <td className="px-2 py-3 text-[12.5px] font-semibold" style={{ color: TEXT }}>{formatAmount(row.amount)}</td>
                    <td className="px-2 py-3"><StatusPill /></td>
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
                        <RowMenu application={row} onView={setViewing} onUpdateStatus={onUpdateStatus} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[12px]" style={{ color: SLATE }}>
              Showing {(safePage - 1) * PAGE_SIZE + 1} to {Math.min(safePage * PAGE_SIZE, applications.length)} of {applications.length} applications
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

      {viewing && <DetailModal application={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}