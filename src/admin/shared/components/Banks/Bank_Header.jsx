import React from 'react';
import { Landmark, Plus, UserCog } from 'lucide-react';

const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#eaf1fe';
const BLUE_PALE = '#f4f8fd';
const SLATE = '#757e9e';
const BORDER = '#e7e9f2';
const PURPLE = '#a78bfa';
const FONT = "'Poppins', sans-serif";
const SCRIPT_FONT = "'Caveat', cursive";

function hexToRgba(hex, alpha) {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255, g = (bigint >> 8) & 255, b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function BankHeader({ onAddNew, onAddManager }) {
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
          never fight an interactive control for overflow behavior. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full" style={{ background: BLUE, opacity: 0.16, filter: 'blur(40px)' }} />
        <div className="absolute -right-24 top-10 h-40 w-40 rounded-full" style={{ background: PURPLE, opacity: 0.14, filter: 'blur(36px)' }} />
      </div>

      <div className="relative">
        <p className="text-[11px] font-bold tracking-[0.14em]" style={{ color: BLUE }}>BANKS</p>
        <h1 className="mt-1 text-[26px] font-extrabold" style={{ color: NAVY }}>Manage Banks</h1>
        <p className="mt-1 text-[13px]" style={{ color: SLATE }}>
          Add, view and manage all bank details in one place.
        </p>
      </div>

      <div className="relative flex flex-wrap items-center justify-end gap-3">
        <div className="hidden items-center gap-2 lg:flex">
          <p className="text-right text-[20px] leading-tight" style={{ fontFamily: SCRIPT_FONT, color: NAVY }}>
            Stronger Partnerships<br />for a Brighter Tomorrow
          </p>
          {/* Bank pillar icon, standing in for the reference's illustration
              without an image asset. */}
          <div className="relative shrink-0 flex h-11 w-9 items-center justify-center rounded-md" style={{ background: BLUE, boxShadow: `0 10px 18px -8px ${hexToRgba(BLUE, 0.55)}` }}>
            <Landmark size={18} color="#fff" strokeWidth={2.2} />
          </div>
        </div>

        <button
          type="button"
          onClick={onAddManager}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
          style={{ background: BLUE, boxShadow: `0 10px 22px -10px ${hexToRgba(BLUE, 0.55)}` }}
        >
          <UserCog size={15} />
          Add Branch Manager
        </button>

        <button
          type="button"
          onClick={onAddNew}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-[12.5px] font-semibold text-white"
          style={{ background: NAVY, boxShadow: `0 10px 22px -10px ${hexToRgba(NAVY, 0.55)}` }}
        >
          <Plus size={15} />
          Add Bank
        </button>
      </div>
    </div>
  );
}