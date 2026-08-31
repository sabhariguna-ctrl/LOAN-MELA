import React from 'react';
import {
  Mail, Phone, MapPin, ArrowRight, Smartphone, TrendingUp,
} from 'lucide-react';

// Matches the wordmark font used in the Navbar logo (kept local there too,
// since it's distinct from the Playfair Display FONT_HEAD used for section titles).
const LOGO_FONT = "'Poppins', sans-serif";

// Local font tokens (previously imported from a shared Colourservice file,
// which no longer exists — defined here directly to avoid re-adding it).
const FONT_HEAD = "'Playfair Display', serif";
const FONT_BODY = "'Inter', sans-serif";

/* ================= LOCAL LIGHT-THEME TOKENS =================
   Footer now sits on a white background (previously matched the dark
   navy CTA above it, which made the two sections blend into one slab).
   These mirror the brand tokens used elsewhere in the app. */
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_TINT = '#d9e7f9';
const BLUE_PALE = '#f0f6fc';
const SLATE = '#757e9e';
const TEXT = '#3d4459';   // darker than SLATE — used for links & body copy so they're readable on white
const GRAY = '#c0bec2';
const WHITE = '#fdfdfd';

// Hand-coded social icons — avoids relying on lucide-react's brand icons,
// which get added/removed across versions due to trademark policy.
const SocialIconPaths = {
  Instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  X: (
    <path d="M4 4l16 16M20 4L4 20" />
  ),
  LinkedIn: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" />
      <circle cx="7.5" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
      <path d="M11 17v-4.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V17" />
      <line x1="11" y1="10" x2="11" y2="17" />
    </>
  ),
  Facebook: (
    <path d="M15 4h-2a4 4 0 0 0-4 4v3H7v3h2v6h3v-6h2.5l.5-3H12V8a1 1 0 0 1 1-1h2z" />
  ),
  YouTube: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.5l4.5 2.5-4.5 2.5z" fill="currentColor" stroke="none" />
    </>
  ),
};

const SOCIALS = [
  { key: 'Instagram', label: 'Instagram' },
  { key: 'X', label: 'X (Twitter)' },
  { key: 'LinkedIn', label: 'LinkedIn' },
  { key: 'Facebook', label: 'Facebook' },
  { key: 'YouTube', label: 'YouTube' },
];

function SocialIcon({ iconKey, size = 15 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {SocialIconPaths[iconKey]}
    </svg>
  );
}

const LINK_GROUPS = [
  {
    heading: 'Loan Schemes',
    links: ['Vehicle Loans', 'Home & Property', 'Business & MSME', 'Education & Career', 'Personal & Gold'],
  },
  {
    heading: 'Company',
    links: ['About Us', 'How It Works', 'Careers', 'Press & Media', 'Blog'],
  },
  {
    heading: 'Support',
    links: ['Contact Us', 'Help Center', 'Track Application', 'EMI Calculator', 'Partner With Us'],
  },
  {
    heading: 'Legal',
    links: ['Privacy Policy', 'Terms of Service', 'RBI Disclosure', 'Grievance Redressal', 'Fair Practice Code'],
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        fontFamily: FONT_BODY,
        background: WHITE,
        borderTop: `1px solid ${BLUE_TINT}`,
      }}
    >

      {/* Main grid */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14 grid grid-cols-1 md:grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-10">

        {/* Brand column */}
        <div>
          <div className="flex items-center gap-3 mb-4 select-none">
            <div className="relative w-9 h-9 bg-gradient-to-br from-[#4F46E5] to-[#142B6F] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.25)] overflow-hidden">
              <span className="text-white font-black text-lg italic z-10">L</span>
            </div>

            <div className="flex flex-col leading-none">
              <div className="text-[22px] font-black tracking-tighter flex items-center" style={{ fontFamily: LOGO_FONT }}>
                <span style={{ color: NAVY }}>L</span>

                <div className="relative mx-0.5 w-5 h-5 flex items-center justify-center">
                  <div className="w-full h-full bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-200 rounded-full border border-yellow-700/50 shadow-[0_0_10px_rgba(234,179,8,0.4)] flex items-center justify-center">
                    <span className="text-[10px] text-yellow-950 font-black not-italic">₹</span>
                  </div>
                </div>

                <span style={{ color: NAVY }}>an</span>

                <div className="relative ml-1.5 flex items-center">
                  <span className="bg-gradient-to-r from-[#4F46E5] to-[#8B7CFF] bg-clip-text text-transparent italic pr-1">Mela</span>
                  <TrendingUp size={16} className="text-[#4F46E5] ml-0.5 opacity-80" />
                </div>
              </div>

              <div className="flex items-center gap-1 mt-0.5">
                <div className="h-[1px] w-4" style={{ background: BLUE, opacity: 0.4 }} />
                <span className="text-[8px] font-bold tracking-[0.3em] uppercase" style={{ color: BLUE, opacity: 0.75 }}>Fintech Hub</span>
              </div>
            </div>
          </div>
          <p className="text-[13px] leading-relaxed mb-6 max-w-xs" style={{ color: SLATE }}>
            Every loan scheme you need, compared honestly, approved fast.
            RBI-registered partners only — no exceptions.
          </p>

          <div className="flex items-center gap-2 mb-3">
            <MapPin size={14} className="flex-shrink-0" style={{ color: SLATE, opacity: 0.75 }} />
            <span className="text-[12.5px]" style={{ color: SLATE }}>Chennai, Tamil Nadu, India</span>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <Mail size={14} className="flex-shrink-0" style={{ color: SLATE, opacity: 0.75 }} />
            <span className="text-[12.5px]" style={{ color: SLATE }}>support@loanmela.in</span>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Phone size={14} className="flex-shrink-0" style={{ color: SLATE, opacity: 0.75 }} />
            <span className="text-[12.5px]" style={{ color: SLATE }}>1800-123-4567 (toll-free)</span>
          </div>

          <div className="flex items-center gap-2.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{ background: BLUE_PALE, color: NAVY, border: `1px solid ${BLUE_TINT}` }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = BLUE_TINT;
                  e.currentTarget.style.color = BLUE;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = BLUE_PALE;
                  e.currentTarget.style.color = NAVY;
                }}
              >
                <SocialIcon iconKey={s.key} />
              </a>
            ))}
          </div>
        </div>

        {/* Link groups */}
        {LINK_GROUPS.map((group) => (
          <div key={group.heading}>
            <p className="font-bold text-[13px] uppercase tracking-wider mb-4" style={{ fontFamily: FONT_HEAD, color: NAVY }}>
              {group.heading}
            </p>
            <ul className="space-y-3">
              {group.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 text-[13px] transition-colors"
                    style={{ color: SLATE }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = BLUE; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = SLATE; }}
                  >
                    {link}
                    <ArrowRight size={11} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright bar */}
      <div style={{ borderTop: `1px solid ${BLUE_TINT}` }}>
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px]" style={{ color: SLATE, opacity: 0.85 }}>
            &copy; {new Date().getFullYear()} LoanMela. All rights reserved.
          </p>
         
        </div>
      </div>
    </footer>
  );
}