import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowUpRight, Menu, X, Zap, TrendingUp, User, LogOut, ChevronDown, FileText, UserCircle } from 'lucide-react';
import { getSession, logoutUser } from '../utils/auth';

// Local color/font tokens (previously imported from a shared Colourservice
// file, which no longer exists — defined here directly). ACCENT swapped
// from green to the site's blue brand family (matches BLUE in other pages).
// Both FONT_BODY and FONT_HEAD now use Poppins, matching the rest of the site.
const ACCENT = '#2f76fb';
const ACCENT_DARK = '#1d5fe0';
const BG = '#ffffff';
const TEXT_DARK = '#0a0f0d';
const TEXT_MUTED = 'rgba(10,15,13,0.65)';
const FONT_BODY = "'Poppins', sans-serif";
const FONT_HEAD = "'Poppins', sans-serif";

const LINKS = [
  { label: 'Home', path: '/', hash: null },
  { label: 'About Us', path: '/about-us', hash: null },
  { label: 'Loan Scheme', path: '/schema', hash: null },
  { label: 'How it works', path: '/how-it-works', hash: null },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [session, setSessionState] = useState(() => getSession());
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Active link is derived from the current URL so it always reflects the
  // page actually being viewed (direct URL, back/forward, or a link on the
  // page itself) instead of only updating when a navbar item is clicked.
  const active = LINKS.find((link) => link.path === location.pathname)?.label ?? null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Keep the navbar's logged-in/out state in sync with localStorage.
  // 'authchange' fires in the same tab right after login/logout (auth.js
  // dispatches it); 'storage' covers changes made in other tabs.
  useEffect(() => {
    const syncSession = () => setSessionState(getSession());
    syncSession();
    window.addEventListener('authchange', syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener('authchange', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, [location.pathname]);

  // Close the account dropdown on outside click, same pattern used for the
  // category filter menu on the Loan Scheme page.
  useEffect(() => {
    const onClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close the dropdown whenever the route changes (e.g. after clicking
  // "My Profile"), so it doesn't stay open floating over the new page.
  useEffect(() => {
    setAccountMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    setMobileOpen(false);
    setAccountMenuOpen(false);
    logoutUser();
    navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToProfile = () => {
    setAccountMenuOpen(false);
    setMobileOpen(false);
    navigate('/profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToApplications = () => {
    setAccountMenuOpen(false);
    setMobileOpen(false);
    navigate('/my-applications');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (link) => {
    setMobileOpen(false);

    if (link.hash) {
      if (location.pathname !== '/') {
        // Navigate home first, then scroll once the page has rendered.
        navigate('/');
        setTimeout(() => {
          document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        document.getElementById(link.hash)?.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(link.path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // "Register Free" now navigates to the dedicated /register page
  // instead of opening a popup on top of the current page.
  const handleRegisterClick = () => {
    setMobileOpen(false);
    navigate('/register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginClick = () => {
    setMobileOpen(false);
    navigate('/login');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.92)' : BG,
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        borderBottom: '1px solid rgba(10,15,13,0.08)',
        fontFamily: FONT_BODY,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}</style>

      <div className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(10,15,13,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative max-w-6xl mx-auto flex items-center justify-between px-6 md:px-10 py-4">

        {/* --- LOGO DESIGN --- */}
        <div className="flex items-center gap-3 cursor-pointer group select-none">
          <div className="relative w-9 h-9 bg-gradient-to-br from-[#4F46E5] to-[#142B6F] rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.7)] transition-all duration-500 overflow-hidden">
             <span className="text-white font-black text-lg italic z-10">L</span>
             <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-12 group-hover:left-full transition-all duration-1000"></div>
          </div>

          <div className="flex flex-col leading-none">
            <div className="text-[22px] font-black tracking-tighter flex items-center" style={{ fontFamily: FONT_HEAD }}>
              <span style={{ color: TEXT_DARK }}>L</span>
              
              <div className="relative mx-0.5 w-5 h-5 flex items-center justify-center">
                 <div className="w-full h-full bg-gradient-to-tr from-yellow-600 via-yellow-400 to-yellow-200 rounded-full border border-yellow-700/50 shadow-[0_0_10px_rgba(234,179,8,0.4)] flex items-center justify-center transform group-hover:rotate-[360deg] transition-transform duration-700">
                    <span className="text-[10px] text-yellow-950 font-black not-italic">₹</span>
                 </div>
              </div>

              <span style={{ color: TEXT_DARK }}>an</span>

              <div className="relative ml-1.5 flex items-center">
                <span className="bg-gradient-to-r from-[#4F46E5] to-[#8B7CFF] bg-clip-text text-transparent italic pr-1">Mela</span>
                <TrendingUp size={16} className="text-[#4F46E5] ml-0.5 opacity-40 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
            
            <div className="flex items-center gap-1 mt-0.5">
               <div className="h-[1px] w-4 bg-[#4F46E5] opacity-30"></div>
               <span className="text-[8px] font-bold text-[#4F46E5] tracking-[0.3em] uppercase opacity-70">Fintech Hub</span>
            </div>
          </div>
        </div>

        {/* Menu Links */}
        <ul className="hidden md:flex items-center gap-2 text-[14px] font-semibold" style={{ fontFamily: FONT_HEAD }}>
          {LINKS.map((link) => {
            const isHovered = hovered === link.label;
            return (
              <li
                key={link.label}
                onClick={() => handleNavClick(link)}
                onMouseEnter={() => setHovered(link.label)}
                onMouseLeave={() => setHovered(null)}
                className="relative cursor-pointer px-4 py-1.5 rounded-full transition-all duration-200"
                style={{
                  color: isHovered ? '#fff' : TEXT_DARK,
                  background: isHovered ? ACCENT : 'transparent',
                  boxShadow: isHovered ? '0 8px 20px rgba(47,118,251,0.35)' : 'none',
                }}
              >
                {link.label}
                {!isHovered && active === link.label && (
                  <div className="absolute -bottom-1 left-4 right-4 h-[2px] bg-[#4F46E5] shadow-[0_0_8px_#4F46E5]"></div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Right side buttons */}
        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <div className="relative" ref={accountMenuRef}>
                <button
                  onClick={() => setAccountMenuOpen((v) => !v)}
                  className="flex items-center gap-2 rounded-full px-3.5 py-2 transition-colors"
                  style={{ background: 'rgba(47,118,251,0.08)' }}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full text-white"
                    style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
                  >
                    <User size={14} />
                  </div>
                  <span className="text-[13.5px] font-semibold" style={{ fontFamily: FONT_HEAD, color: TEXT_DARK }}>
                    {session.fullName ? session.fullName.split(' ')[0] : session.email}
                  </span>
                  <ChevronDown
                    size={15}
                    style={{ color: TEXT_MUTED, transform: accountMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
                  />
                </button>

                {accountMenuOpen && (
                  <div
                    className="absolute right-0 top-[calc(100%+8px)] w-52 rounded-xl border bg-white py-1.5 shadow-[0_12px_30px_rgba(10,15,13,0.12)]"
                    style={{ borderColor: 'rgba(10,15,13,0.08)', fontFamily: FONT_HEAD, zIndex: 60 }}
                  >
                    <button
                      onClick={goToProfile}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13.5px] font-semibold transition-colors hover:bg-[rgba(47,118,251,0.08)]"
                      style={{ color: TEXT_DARK }}
                    >
                      <UserCircle size={16} style={{ color: ACCENT }} />
                      My Profile
                    </button>
                    <button
                      onClick={goToApplications}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13.5px] font-semibold transition-colors hover:bg-[rgba(47,118,251,0.08)]"
                      style={{ color: TEXT_DARK }}
                    >
                      <FileText size={16} style={{ color: ACCENT }} />
                      My Applications
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-[14px] font-semibold transition-colors"
                style={{ fontFamily: FONT_HEAD, color: TEXT_MUTED }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
              >
                <LogOut size={15} />
                Log out
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleLoginClick}
                className="text-[14px] font-semibold transition-colors"
                style={{ fontFamily: FONT_HEAD, color: TEXT_MUTED }}
                onMouseEnter={(e) => (e.currentTarget.style.color = TEXT_DARK)}
                onMouseLeave={(e) => (e.currentTarget.style.color = TEXT_MUTED)}
              >
                Log in
              </button>

              <button
                onClick={handleRegisterClick}
                className="group/btn inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-white text-[14px] shadow-[0_8px_20px_rgba(47,118,251,0.35)] hover:shadow-[0_10px_26px_rgba(47,118,251,0.5)] transition-all hover:-translate-y-0.5 active:scale-95"
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})`,
                  fontFamily: FONT_HEAD,
                }}
              >
                <TrendingUp size={14} className="mr-0.5 opacity-80" />
                Register Free
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 -mr-2" style={{ color: TEXT_DARK }} onClick={() => setMobileOpen((v) => !v)}>
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div className={`relative md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`} style={{ borderTop: mobileOpen ? '1px solid rgba(10,15,13,0.08)' : 'none' }}>
        <ul className="flex flex-col gap-1 px-6 pt-4 pb-2 text-[14px] font-semibold" style={{ fontFamily: FONT_HEAD }}>
          {LINKS.map((link) => (
            <li key={link.label} onClick={() => handleNavClick(link)} className="py-3 border-b cursor-pointer" style={{ color: active === link.label ? ACCENT : TEXT_MUTED, borderColor: 'rgba(10,15,13,0.06)' }}>
              {link.label}
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-3 px-6 py-4">
          {session ? (
            <>
              <div
                className="flex items-center gap-2 rounded-full px-3.5 py-2.5"
                style={{ background: 'rgba(47,118,251,0.08)' }}
              >
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                  style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
                >
                  <User size={14} />
                </div>
                <span className="truncate text-[13.5px] font-semibold" style={{ color: TEXT_DARK }}>
                  {session.fullName ? session.fullName.split(' ')[0] : session.email}
                </span>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={goToProfile}
                  className="flex-1 font-bold border rounded-full py-2.5 text-[13px] inline-flex items-center justify-center gap-1.5"
                  style={{ borderColor: 'rgba(10,15,13,0.15)', color: TEXT_DARK }}
                >
                  <UserCircle size={14} style={{ color: ACCENT }} /> My Profile
                </button>
                <button
                  onClick={goToApplications}
                  className="flex-1 font-bold border rounded-full py-2.5 text-[13px] inline-flex items-center justify-center gap-1.5"
                  style={{ borderColor: 'rgba(10,15,13,0.15)', color: TEXT_DARK }}
                >
                  <FileText size={14} style={{ color: ACCENT }} /> My Applications
                </button>
              </div>

              <button
                onClick={handleLogout}
                className="w-full font-bold border rounded-full py-2.5 text-[13.5px] inline-flex items-center justify-center gap-1.5"
                style={{ borderColor: 'rgba(10,15,13,0.15)', color: TEXT_MUTED }}
              >
                <LogOut size={14} /> Log out
              </button>
            </>
          ) : (
            <div className="flex gap-3">
              <button onClick={handleLoginClick} className="flex-1 font-bold border rounded-full py-2.5 text-[13.5px]" style={{ borderColor: 'rgba(10,15,13,0.15)', color: TEXT_MUTED }}>Log in</button>
              <button
                onClick={handleRegisterClick}
                className="flex-1 text-white px-5 py-2.5 rounded-full font-bold flex items-center justify-center gap-2 text-[13.5px]"
                style={{ background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DARK})` }}
              >
                 <TrendingUp size={14} /> Register Free
              </button>
            </div>
          )}
        </div>
      </div>

    </nav>
  );
}