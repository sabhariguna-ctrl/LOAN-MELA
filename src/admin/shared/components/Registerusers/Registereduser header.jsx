import React from 'react';
import { Users, UserCheck } from 'lucide-react';

// Same brand tokens as Application_Header.jsx, kept local to this file
// since each admin page component in this project defines its own rather
// than sharing a constants module.
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

// Page banner for /dashboard/registered-users. Every entry shown below comes from
// registerUser() in utils/auth.js — i.e. real people who signed up on the
// public site — so there's no "add borrower" action here the way
// Applications has "New Application"; admin observes this list, it
// doesn't create entries in it.
export default function RegisteredUserHeader() {
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

      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
        <div
          className="absolute -right-10 -top-16 h-48 w-48 rounded-full"
          style={{ background: BLUE, opacity: 0.16, filter: 'blur(40px)' }}
        />
        <div
          className="absolute -right-24 top-10 h-40 w-40 rounded-full"
          style={{ background: PURPLE, opacity: 0.14, filter: 'blur(36px)' }}
        />
      </div>

      <div className="relative">
        <p className="text-[11px] font-bold tracking-[0.14em]" style={{ color: BLUE }}>REGISTERED USERS</p>
        <h1 className="mt-1 text-[26px] font-extrabold" style={{ color: NAVY }}>Registered Users</h1>
        <p className="mt-1 text-[13px]" style={{ color: SLATE }}>
          Everyone who has created an account on the public site, pulled straight from Register.
        </p>
      </div>

      <div className="relative flex items-center gap-4">
        <div className="hidden items-center gap-2 lg:flex">
          <p className="text-right text-[20px] leading-tight" style={{ fontFamily: SCRIPT_FONT, color: NAVY }}>
            People Behind<br />Every Application
          </p>
          <div className="relative shrink-0" style={{ width: 56, height: 56 }}>
            <div
              className="absolute right-0 top-0 flex h-11 w-9 items-center justify-center rounded-md"
              style={{ background: BLUE, boxShadow: `0 10px 18px -8px ${hexToRgba(BLUE, 0.55)}` }}
            >
              <Users size={18} color="#fff" strokeWidth={2.2} />
            </div>
            <div
              className="absolute bottom-0 left-0 flex h-7 w-7 items-center justify-center rounded-full bg-white"
              style={{ border: `1px solid ${BORDER}`, boxShadow: '0 6px 14px -6px rgba(19,34,97,0.3)' }}
            >
              <UserCheck size={13} style={{ color: BLUE }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}