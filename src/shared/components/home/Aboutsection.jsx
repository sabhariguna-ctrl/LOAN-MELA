import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Zap, ShieldCheck, Users2, Headphones, IndianRupee, Package, Landmark,
  ArrowUpRight, ArrowRight, Sparkles, Building2, CheckCircle2, Flame,
} from "lucide-react";

/* LoanMela official palette — now matches Navbar / Footer / About / Loanschema / Login */
const PRIMARY = "#2f76fb";   // BLUE
const NAVY = "#132261";      // NAVY
const MUTED = "#757e9e";     // SLATE
const LAVENDER = "#89b6f8";  // BLUE_LIGHT
const GOLD = "#89b6f8";      // BLUE_LIGHT (accent, replaces old gold accent)
const WHITE = "#fdfdfd";     // WHITE
const CREAM = "#ffffff";     // WHITE
const CREAM_2 = "#f0f6fc";   // BLUE_PALE
const POPPINS = "'Poppins', sans-serif";

const MARQUEE_WORDS = [
  "GENUINE MATCHING", "ZERO GUESSWORK", "7 CATEGORIES", "30+ PURPOSES",
  "100% TRANSPARENT", "REAL LENDERS", "NO HIDDEN FEES",
];

const WHY_US = [
  { n: "01", title: "We listen first", desc: "Tell us the real reason you need the money — we don't push a product before we understand the need." },
  { n: "02", title: "We match, not guess", desc: "Every purpose maps to a specific loan category. No random offers, no spray-and-pray." },
  { n: "03", title: "Lenders decide, honestly", desc: "We never promise approval, rate, or amount — that call always belongs to the participating lender." },
];

const STATS = [
  { icon: Users2, value: 50000, suffix: "+", label: "Applicants Guided", format: (n) => Math.round(n).toLocaleString("en-IN") },
  { icon: Package, value: 30, suffix: "+", label: "Loan Purposes", format: (n) => Math.round(n) },
  { icon: Landmark, value: 7, suffix: "", label: "Loan Categories", format: (n) => Math.round(n) },
  { icon: IndianRupee, value: 500, suffix: "+ Cr", label: "Financing Facilitated", prefix: "₹", format: (n) => Math.round(n) },
];

const PARTNERS = [
  { name: "National Trust Bank", icon: Landmark },
  { name: "Bharat Finserv", icon: Building2 },
  { name: "Sundaram Capital", icon: Landmark },
  { name: "IndusPrime NBFC", icon: Building2 },
  { name: "Apex Rural Bank", icon: Landmark },
  { name: "Coastal Co-operative Bank", icon: Building2 },
  { name: "Metro Housing Finance", icon: Landmark },
  { name: "Unity Microfinance", icon: Building2 },
];

const LIVE_ACTIVITY = [
  "Priya S. matched to a Business Loan · Chennai",
  "Arjun K. matched to a Two-Wheeler Loan · Madurai",
  "Meena R. matched to an Education Loan · Coimbatore",
  "Suresh V. matched to a Home Loan · Trichy",
  "Kavya N. matched to a Farm Equipment Loan · Salem",
];

const SHOWCASE_PHOTOS = [
  { src: "/images/homeloan.jpg", label: "Home Loan" },
  { src: "/images/shopowner.jpg", label: "Business Loan" },
  { src: "/images/agriculture.jpg", label: "Agriculture Loan" },
  { src: "/images/bike.jpg", label: "Vehicle Loan" },
  { src: "/images/delivery partner.jpg", label: "Gig Worker Loan" },
  { src: "/images/eductional loan.jpg", label: "Education Loan" },
];

function useCountUp(target, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);
  return value;
}

function LiveTicker() {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const cycle = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % LIVE_ACTIVITY.length);
        setVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full" style={{ background: WHITE, border: `1px solid ${GOLD}55` }}>
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "#047857" }} />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#047857" }} />
      </span>
      <span
        style={{ fontFamily: POPPINS, fontWeight: 600, color: NAVY, opacity: visible ? 1 : 0, transition: "opacity 0.3s ease" }}
        className="text-[11px] whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {LIVE_ACTIVITY[index]}
      </span>
    </div>
  );
}

function PhotoBanner() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const cycle = setInterval(() => setIndex((i) => (i + 1) % SHOWCASE_PHOTOS.length), 3200);
    return () => clearInterval(cycle);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] rounded-[2rem] overflow-hidden shadow-[0_30px_60px_rgba(19,34,97,0.2)]">
      {SHOWCASE_PHOTOS.map((p, i) => (
        <img
          key={p.src}
          src={p.src}
          alt={p.label}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: i === index ? 1 : 0,
            transition: "opacity 1.1s ease",
            animation: i === index ? "lm-kenburns 18s ease-in-out infinite" : "none",
          }}
        />
      ))}
      <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${NAVY}b0 0%, ${NAVY}30 45%, transparent 75%)` }} />
      <div className="absolute inset-x-0 bottom-0 h-28" style={{ background: `linear-gradient(0deg, ${NAVY}90, transparent)` }} />

      {/* sticker badges */}
      <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] shadow-lg animate-[lm-wiggle_3s_ease-in-out_infinite]"
          style={{ fontFamily: POPPINS, fontWeight: 800, background: GOLD, color: NAVY, transform: "rotate(6deg)" }}
        >
          <Flame size={12} /> TRENDING
        </span>
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] shadow-lg"
          style={{ fontFamily: POPPINS, fontWeight: 700, background: "rgba(255,255,255,0.92)", color: NAVY, transform: "rotate(-4deg)" }}
        >
          <CheckCircle2 size={12} style={{ color: PRIMARY }} /> Verified Lenders
        </span>
      </div>

      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
        <span
          key={SHOWCASE_PHOTOS[index].label}
          style={{ fontFamily: POPPINS, fontWeight: 700, color: WHITE }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-[13px] animate-[lm-fade-in_0.5s_ease] w-fit"
        >
          <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} />
          {SHOWCASE_PHOTOS[index].label}
        </span>

        <div className="flex items-end justify-between gap-3 flex-wrap">
          <div>
            <p style={{ fontFamily: POPPINS, fontWeight: 900, color: WHITE }} className="text-3xl md:text-4xl leading-none">
              Every category.
            </p>
            <p style={{ fontFamily: POPPINS, fontWeight: 500, color: "rgba(253,253,253,0.8)" }} className="text-[13px] mt-1.5">
              One genuine match, every single time.
            </p>
          </div>
          <div className="flex gap-1.5">
            {SHOWCASE_PHOTOS.map((p, i) => (
              <span
                key={p.src}
                className="rounded-full transition-all duration-300"
                style={{ width: i === index ? 18 : 6, height: 6, background: i === index ? GOLD : "rgba(255,255,255,0.4)" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

export default function Aboutsection() {
  const navigate = useNavigate();

  // "Find My Loan Category" now takes the visitor to the dedicated Loan
  // Scheme page (/schema) instead of scrolling to the schemes preview
  // further down this same homepage.
  const goToSchemes = () => {
    navigate("/schema");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const partnerTrack = [...PARTNERS, ...PARTNERS];
  const marqueeTrack = [...MARQUEE_WORDS, ...MARQUEE_WORDS];
  const [topRef, topInView] = useInView();
  const [statsRef, statsInView] = useInView();
  const [whyRef, whyInView] = useInView();

  return (
    <section id="about" className="relative overflow-hidden py-20 md:py-28" style={{ background: `linear-gradient(160deg, ${CREAM} 0%, ${CREAM_2} 55%, ${CREAM} 100%)` }}>

      {/* vivid textured backdrop */}
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{ backgroundImage: `radial-gradient(circle, ${GOLD}35 1px, transparent 1px)`, backgroundSize: "26px 26px" }}
      />
      <div className="absolute -top-16 right-[-6%] w-[26rem] h-[26rem] rounded-full pointer-events-none animate-[lm-float_10s_ease-in-out_infinite]" style={{ background: `${GOLD}28`, filter: "blur(85px)" }} />
      <div className="absolute bottom-10 left-[-6%] w-96 h-96 rounded-full pointer-events-none animate-[lm-float_12s_ease-in-out_infinite_1s]" style={{ background: `${LAVENDER}28`, filter: "blur(75px)" }} />
      <div className="absolute top-[45%] left-[45%] w-64 h-64 rounded-full pointer-events-none animate-[lm-float_14s_ease-in-out_infinite_0.5s]" style={{ background: `${PRIMARY}14`, filter: "blur(70px)" }} />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10">

        {/* ============ CENTERED INTRO — bold oversized headline ============ */}
        <div
          ref={topRef}
          className="text-center max-w-3xl mx-auto mb-9 transition-all duration-700 ease-out"
          style={{ opacity: topInView ? 1 : 0, transform: topInView ? "translateY(0)" : "translateY(18px)" }}
        >
          <div className="inline-flex items-center gap-2 mb-5 px-3.5 py-1.5 rounded-full" style={{ background: WHITE, border: `1px solid ${GOLD}50` }}>
            <Sparkles size={12} style={{ color: GOLD }} />
            <span style={{ fontFamily: POPPINS, fontWeight: 700, color: NAVY }} className="text-[11.5px] uppercase tracking-[0.18em]">
              About LoanMela
            </span>
          </div>

          <h2 style={{ fontFamily: POPPINS, fontWeight: 900, color: NAVY, letterSpacing: "-0.02em" }} className="text-[2.6rem] leading-[1.05] sm:text-5xl md:text-6xl mb-5">
            No more guessing.{" "}
            <span style={{ color: PRIMARY }}>Just the right loan,</span> found fast.
          </h2>

          <p style={{ fontFamily: POPPINS, color: MUTED }} className="text-[15px] md:text-[16.5px] leading-relaxed mb-6 font-medium">
            A constituency-level loan discovery platform built for how you
            actually live — gig work, first business, dream bike, next
            semester. Tell us the real reason you need the money, and
            we'll match it to the right category, then hand you off to a
            lender who decides honestly.
          </p>

          <div className="flex justify-center">
            <LiveTicker />
          </div>
        </div>

        {/* ============ SCROLLING MARQUEE STRIP ============ */}
        <div
          className="relative w-full overflow-hidden mb-12 py-3 rounded-full"
          style={{ background: `linear-gradient(90deg, ${PRIMARY}, ${LAVENDER})` }}
        >
          <div className="flex items-center gap-8 w-max animate-[lm-marquee_20s_linear_infinite]">
            {marqueeTrack.map((w, i) => (
              <span key={i} style={{ fontFamily: POPPINS, fontWeight: 800, color: WHITE }} className="text-[13px] tracking-wide flex items-center gap-8 whitespace-nowrap">
                {w}
                <span style={{ color: GOLD }}>★</span>
              </span>
            ))}
          </div>
        </div>

        {/* ============ PHOTO BANNER ============ */}
        <div
          className="mb-14 transition-all duration-700 ease-out"
          style={{ opacity: topInView ? 1 : 0, transform: topInView ? "scale(1)" : "scale(0.97)", transitionDelay: "150ms" }}
        >
          <PhotoBanner />
        </div>

        {/* ============ WHY US — big numeral list ============ */}
        <div ref={whyRef} className="grid md:grid-cols-3 gap-6 mb-16">
          {WHY_US.map((item, i) => (
            <div
              key={item.n}
              className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{
                background: WHITE,
                border: `1px solid ${GOLD}30`,
                opacity: whyInView ? 1 : 0,
                transform: whyInView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 120}ms`,
              }}
            >
              <span
                style={{ fontFamily: POPPINS, fontWeight: 900, color: `${PRIMARY}14` }}
                className="absolute -top-3 -right-1 text-7xl leading-none select-none transition-transform duration-300 group-hover:scale-110"
              >
                {item.n}
              </span>
              <p style={{ fontFamily: POPPINS, fontWeight: 800, color: NAVY }} className="relative text-[16px] mb-2">{item.title}</p>
              <p style={{ fontFamily: POPPINS, color: MUTED }} className="relative text-[12.5px] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* ============ STATS BAND ============ */}
        <div
          ref={statsRef}
          className="rounded-[2rem] px-6 md:px-10 py-9 mb-16"
          style={{ background: `linear-gradient(120deg, ${NAVY}, #1b3583)` }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s, i) => (
              <div key={s.label} className={`text-center ${i > 0 ? "md:border-l md:border-white/10 md:pl-8" : ""}`}>
                <StatFigure stat={s} active={statsInView} />
              </div>
            ))}
          </div>
        </div>

        {/* ============ BANK & NBFC PARTNER MARQUEE ============ */}
        <div className="text-center mb-6">
          <p style={{ fontFamily: POPPINS, fontWeight: 800, color: NAVY }} className="text-2xl md:text-[1.9rem]">
            Collaborating With Banks & NBFCs
          </p>
        </div>

        <div
          className="relative w-full overflow-hidden mb-14"
          style={{ maskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 6%, black 94%, transparent 100%)" }}
        >
          <div className="flex items-stretch gap-4 w-max animate-[lm-cards-scroll_28s_linear_infinite] hover:[animation-play-state:paused]">
            {partnerTrack.map((p, i) => (
              <div
                key={`${p.name}-${i}`}
                className="flex-shrink-0 flex items-center gap-3 px-5 py-3.5 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ background: WHITE, border: `1px solid ${GOLD}30`, boxShadow: "0 6px 16px rgba(19,34,97,0.06)", minWidth: 230 }}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${LAVENDER})` }}>
                  <p.icon size={19} color={WHITE} />
                </div>
                <div>
                  <p style={{ color: NAVY, fontFamily: POPPINS, fontWeight: 700, fontSize: "13px", lineHeight: 1.25, whiteSpace: "nowrap" }}>{p.name}</p>
                  <span className="inline-flex items-center gap-1 mt-0.5" style={{ color: MUTED, fontFamily: POPPINS, fontWeight: 600, fontSize: "10px" }}>
                    <CheckCircle2 size={10} style={{ color: PRIMARY }} />
                    Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ============ BOTTOM CTA ============ */}
        <div className="rounded-[1.75rem] px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ background: WHITE, border: `1px solid ${GOLD}40` }}>
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${PRIMARY}12` }}>
              <ShieldCheck size={17} style={{ color: PRIMARY }} />
            </div>
            <p style={{ fontFamily: POPPINS, fontWeight: 600, color: NAVY }} className="text-[13.5px]">Your data is shared with lenders only after your consent.</p>
          </div>
          <button
            onClick={goToSchemes}
            style={{ fontFamily: POPPINS, fontWeight: 700, background: `linear-gradient(135deg, ${PRIMARY}, ${LAVENDER})`, color: WHITE }}
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13.5px] flex-shrink-0 transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-95"
          >
            Find My Loan Category
            <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes lm-cards-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes lm-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes lm-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        @keyframes lm-kenburns {
          0% { transform: scale(1) translate(0, 0); }
          50% { transform: scale(1.1) translate(-1%, -1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes lm-fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes lm-wiggle {
          0%, 100% { transform: rotate(6deg); }
          50% { transform: rotate(-2deg); }
        }
      `}</style>
    </section>
  );
}

function StatFigure({ stat, active }) {
  const val = useCountUp(stat.value, active);
  return (
    <div>
      <div className="flex items-center justify-center gap-2 mb-1.5">
        <stat.icon size={16} style={{ color: "#89b6f8" }} />
        <p style={{ fontFamily: POPPINS, fontWeight: 800, color: "#fdfdfd" }} className="text-2xl md:text-[1.9rem] leading-none">
          {stat.prefix || ""}{stat.format(val)}{stat.suffix}
        </p>
      </div>
      <p style={{ fontFamily: POPPINS, color: "rgba(253,253,253,0.65)" }} className="text-[11.5px]">{stat.label}</p>
    </div>
  );
}