import React from 'react';
import { FileCheck2, Download } from 'lucide-react';

// Same brand tokens as Application_Header.jsx / Dashboard.jsx, kept local
// to this file since each admin page component in this project defines
// its own rather than sharing a constants module.
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const BLUE_PALE = '#f4f8fd';
const SLATE = '#757e9e';
const BORDER = '#e7e9f2';
const GREEN = '#22c55e';
const FONT = "'Poppins', sans-serif";
const SCRIPT_FONT = "'Caveat', cursive";

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Page banner for /dashboard/approved. `onExport` triggers the same CSV
// export the table's own Export button offers, so the header action and
// the table's export always stay in sync rather than being two separate
// implementations.
export default function ApprovedHeader({ onExport }) {
  return (
    <div
      className="relative flex flex-col gap-4 rounded-2xl p-5 sm:flex-row sm:items-center sm:justify-between"
      style={{
        fontFamily: FONT,
        background: `linear-gradient(120deg, ${BLUE_TINT} 0%, ${BLUE_PALE} 55%, #ffffff 100%)`,
        border: `1px solid ${BORDER}`,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Caveat:wght@600&display=swap');`}</style>

      {/* Decorative blurred blobs, clipped to their own inset layer so they
          never fight an interactive control (like a dropdown) for overflow
          behavior. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div
          className="absolute -right-10 -top-16 h-48 w-48 rounded-full"
          style={{ background: GREEN, opacity: 0.14, filter: 'blur(40px)' }}
        />
        <div
          className="absolute -right-24 top-10 h-40 w-40 rounded-full"
          style={{ background: BLUE, opacity: 0.14, filter: 'blur(36px)' }}
        />
      </div>

      <div className="relative">
        <p className="text-[11px] font-bold tracking-[0.14em]" style={{ color: BLUE }}>APPLICATIONS</p>
        <h1 className="mt-1 text-[26px] font-extrabold" style={{ color: NAVY }}>Approved Applications</h1>
        <p className="mt-1 text-[13px]" style={{ color: SLATE }}>
          View and manage all approved loan applications.
        </p>
      </div>

      <div className="relative flex items-center gap-4">
        <div className="hidden items-center gap-2 lg:flex">
          <p className="text-right text-[20px] leading-tight" style={{ fontFamily: SCRIPT_FONT, color: NAVY }}>
            Turning Applications<br />into Opportunities
          </p>
          {/* Small document + check motif, standing in for the reference's
              illustration without an image asset. */}
          <div className="relative shrink-0" style={{ width: 56, height: 56 }}>
            <div
              className="absolute right-0 top-0 flex h-11 w-9 items-center justify-center rounded-md"
              style={{ background: BLUE, boxShadow: `0 10px 18px -8px ${hexToRgba(BLUE, 0.55)}` }}
            >
              <FileCheck2 size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <div
              className="absolute bottom-0 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-white"
              style={{ border: `1px solid ${BORDER}`, boxShadow: '0 6px 14px -6px rgba(19,34,97,0.3)' }}
            >
              <FileCheck2 size={13} style={{ color: GREEN }} />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onExport}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
          style={{ background: NAVY, boxShadow: `0 10px 22px -10px ${hexToRgba(NAVY, 0.55)}` }}
        >
          <Download size={15} />
          Export
        </button>
      </div>
    </div>
  );
}