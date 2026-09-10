import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { getSession } from "../../../utils/auth";

/* LoanMela official palette — now matches Navbar / Footer / About / Loanschema / Login */
const PRIMARY = "#2f76fb";   // BLUE
const NAVY = "#132261";      // NAVY
const INK = "#132261";       // NAVY (used as hero base background)
const LAVENDER = "#89b6f8";  // BLUE_LIGHT
const WHITE = "#fdfdfd";     // WHITE
const POPPINS = "'Poppins', sans-serif";

const SCROLL_IMAGES = [
  { src: "/images/homeloan.jpg", pos: "center 40%" },
  { src: "/images/agriculture.jpg", pos: "center 55%" },
  { src: "/images/bike.jpg", pos: "center 45%" },
  { src: "/images/car loan.jpg", pos: "center 50%" },
  { src: "/images/eductional loan.jpg", pos: "center 35%" },
  { src: "/images/delivery partner.jpg", pos: "center 25%" },
  { src: "/images/shopowner.jpg", pos: "center 30%" },
  { src: "/images/mechanic.jpg", pos: "center 30%" },
];

export default function Herosection() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getSession());

  // Keep this in sync with login/logout that happen elsewhere in the app
  // (e.g. the Navbar), same pattern used there — 'authchange' fires in the
  // same tab right after login/logout, 'storage' covers other tabs.
  useEffect(() => {
    const syncSession = () => setSession(getSession());
    window.addEventListener("authchange", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("authchange", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  // "Explore All Schemes" always takes the visitor to the dedicated Loan
  // Scheme page (/schema) instead of scrolling down to the schemes preview
  // embedded further down this same homepage.
  const goToSchemes = () => {
    navigate("/schema");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // "Apply Here" is only shown to visitors who haven't registered yet — a
  // logged-in user has already applied/registered, so the button is hidden
  // for them. For a signed-out visitor it goes to the Register page rather
  // than straight to the schemes page, since they need an account first.
  const goToRegister = () => {
    navigate("/register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section id="home" className="relative h-[100svh] min-h-[600px] w-full flex items-center overflow-hidden select-none" style={{ background: INK }}>

      {/* --- LAYER 1: FULL-BLEED BACKGROUND IMAGE SCROLLER --- */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="flex h-full w-[800%] animate-full-scroll" style={{ willChange: "transform" }}>
          {SCROLL_IMAGES.map((item, i) => (
            <div key={i} className="relative h-full flex-shrink-0" style={{ width: "12.5%" }}>
              <img
                src={item.src}
                alt=""
                className="w-full h-full object-cover block"
                style={{ objectPosition: item.pos }}
              />
            </div>
          ))}
        </div>

        {/* left-to-right scrim — restrained ink-navy fade, not a heavy blue wash */}
        <div className="absolute inset-0 hidden md:block" style={{ background: `linear-gradient(90deg, ${INK}e8 0%, ${INK}c2 30%, ${INK}70 52%, ${INK}2a 72%, transparent 95%)` }} />
        {/* mobile: even tint since content stacks full-width */}
        <div className="absolute inset-0 md:hidden" style={{ background: `linear-gradient(180deg, ${INK}9a 0%, ${INK}70 28%, ${INK}c0 100%)` }} />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
      </div>

      {/* subtle floating accents — quieter, for depth without a heavy blue cast */}
      <div className="absolute top-[14%] left-[6%] w-40 h-40 rounded-full pointer-events-none animate-[lm-float_8s_ease-in-out_infinite]" style={{ background: `${LAVENDER}16`, filter: "blur(46px)" }} />
      <div className="absolute bottom-[18%] right-[8%] w-52 h-52 rounded-full pointer-events-none animate-[lm-float_10s_ease-in-out_infinite_1.2s]" style={{ background: `${PRIMARY}14`, filter: "blur(54px)" }} />

      {/* --- LAYER 2: LEFT-ALIGNED CONTENT --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 pt-14">
        <div className="max-w-xl text-left">

          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full backdrop-blur-md bg-white/[0.07] border border-white/15">
            <Sparkles size={13} style={{ color: LAVENDER }} />
            <span style={{ fontFamily: POPPINS }} className="text-[11.5px] sm:text-[12px] font-medium tracking-wide text-white/90">
              Constituency Loan Mela — One Place, Every Financing Solution
            </span>
          </div>

          <h1
            style={{
              fontFamily: POPPINS,
              fontWeight: 700,
              color: WHITE,
              textShadow: "0 2px 4px rgba(0,0,0,0.9), 0 4px 24px rgba(0,0,0,0.85)",
              letterSpacing: "-0.01em",
            }}
            className="text-[2.3rem] leading-[1.15] sm:text-5xl md:text-[3.4rem] md:leading-[1.12] mb-5"
          >
            Every loan you need.{" "}
            <span style={{ color: LAVENDER, filter: "drop-shadow(0 2px 8px rgba(137,182,248,0.35))" }}>
              One mela you can trust.
            </span>
          </h1>

          <p
            style={{ fontFamily: POPPINS, color: "#e9ebf5", textShadow: "0 2px 10px rgba(0,0,0,0.75)" }}
            className="text-[14.5px] sm:text-base leading-relaxed mb-7 font-normal"
          >
            Business, vehicle, home, education, agriculture or a career
            upgrade — explore{" "}
            <span style={{ fontWeight: 800, color: WHITE, fontVariantNumeric: "tabular-nums" }}>7</span> loan
            categories and{" "}
            <span style={{ fontWeight: 800, color: WHITE, fontVariantNumeric: "tabular-nums" }}>30+</span> purposes,
            matched to your genuine need, not a random product.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md bg-white/[0.07] border border-white/15">
            <ShieldCheck size={14} style={{ color: LAVENDER }} />
            <span style={{ fontFamily: POPPINS, fontWeight: 600 }} className="text-[12px] text-white/90">
              <span style={{ fontWeight: 800, color: LAVENDER, fontVariantNumeric: "tabular-nums", letterSpacing: "0.01em" }}>
                50,000+
              </span>{" "}
              Indians already guided through LoanMela
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {!session && (
              <button
                onClick={goToRegister}
                style={{ fontFamily: POPPINS, fontWeight: 600, background: `linear-gradient(135deg, ${PRIMARY}, ${LAVENDER})`, color: WHITE, boxShadow: "0 10px 30px -8px rgba(47,118,251,0.55)" }}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5 active:scale-95 text-sm sm:text-[15px]"
              >
                Apply Here
                <ArrowRight size={17} className="transition-transform group-hover:translate-x-1.5" />
              </button>
            )}

            <button
              onClick={goToSchemes}
              style={{ fontFamily: POPPINS, fontWeight: 600 }}
              className="px-7 py-3.5 rounded-full border backdrop-blur-md transition-all text-sm sm:text-[15px] bg-white/[0.06] hover:bg-white/[0.12] text-white border-white/25"
            >
              Explore All Schemes
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes full-scroll {
          0%, 10.5%    { transform: translate3d(0, 0, 0); }
          12.5%, 23%   { transform: translate3d(-12.5%, 0, 0); }
          25%, 35.5%   { transform: translate3d(-25%, 0, 0); }
          37.5%, 48%   { transform: translate3d(-37.5%, 0, 0); }
          50%, 60.5%   { transform: translate3d(-50%, 0, 0); }
          62.5%, 73%   { transform: translate3d(-62.5%, 0, 0); }
          75%, 85.5%   { transform: translate3d(-75%, 0, 0); }
          87.5%, 98%   { transform: translate3d(-87.5%, 0, 0); }
          100%         { transform: translate3d(0, 0, 0); }
        }
        .animate-full-scroll {
          animation: full-scroll 24s cubic-bezier(0.8, 0, 0.2, 1) infinite;
        }
        @keyframes lm-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </section>
  );
}