import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "../../../utils/auth";
import {
  Send, ClipboardCheck, FileSearch, BadgeCheck, Wallet, CalendarClock,
  ArrowRight, ShieldCheck, Zap, IndianRupee, Headphones, Users,
  FileText, Timer, Leaf, Lock, Check, PartyPopper, RotateCcw,
} from "lucide-react";

/* Constants for Logic — LoanMela official palette (matches Navbar / Footer / About / Loanschema / Login) */
const PRIMARY = "#2f76fb";   // BLUE
const NAVY = "#132261";      // NAVY
const LAVENDER = "#89b6f8";  // BLUE_LIGHT
const GOLD = "#89b6f8";      // BLUE_LIGHT (accent, replaces old gold accent)
const SUCCESS = "#047857";   // success green, matches About page's "Approval Focus" green
const STEP_MS = 1300;
const HOLD_MS = 3200;

// All text — headings and body — now uses Poppins
const FONT_TEXT = "'Poppins', sans-serif";

const steps = [
  { n: "01", title: "Choose & Apply", desc: "Select the loan you need and fill out a quick online application.", icon: Send },
  { n: "02", title: "Quick Verification", desc: "We verify your identity and documents using secure technology.", icon: ClipboardCheck },
  { n: "03", title: "Smart Assessment", desc: "Our system evaluates your eligibility and finds the best loan options.", icon: FileSearch },
  { n: "04", title: "Get Approved", desc: "Get instant approval with transparent terms and competitive rates.", icon: BadgeCheck },
  { n: "05", title: "Funds Disbursed", desc: "Loan amount is disbursed directly to your bank account instantly.", icon: Wallet },
  { n: "06", title: "Repay with Ease", desc: "Flexible EMI options and timely reminders help you repay with ease.", icon: CalendarClock },
];

const whyChoose = [
  { title: "Safe & Secure", desc: "Bank-level security to protect your data.", icon: ShieldCheck },
  { title: "Instant Process", desc: "100% digital process with quick approvals.", icon: Zap },
  { title: "Best Rates", desc: "Competitive interest rates with zero hidden charges.", icon: IndianRupee },
  { title: "24/7 Support", desc: "We're here to help you at every step.", icon: Headphones },
  { title: "Trusted by Millions", desc: "Join 1M+ happy customers across India.", icon: Users },
];

const CONFETTI = Array.from({ length: 16 }, (_, i) => ({
  left: (i * 6.4) % 100,
  delay: (i % 8) * 0.18,
  duration: 1.6 + (i % 5) * 0.25,
  color: [LAVENDER, GOLD, SUCCESS][i % 3],
}));

function StepCard({ step, status }) {
  const Icon = step.icon;
  const done = status === "done";
  const active = status === "active";

  return (
    <div className="flex flex-col items-center text-center" style={{ fontFamily: FONT_TEXT }}>
      <div className="relative">
        {active && (
          <span className="absolute inset-0 rounded-full border-2 border-[#2f76fb] animate-ping" />
        )}
        <div
          className={`w-24 h-24 rounded-full flex items-center justify-center border transition-all duration-500 shadow-sm
            ${active ? "border-[#2f76fb] opacity-100 shadow-lg shadow-[#2f76fb]/20" : ""}
            ${done ? "border-[#047857] bg-[#047857]/08 opacity-100 shadow-md" : ""}
            ${!active && !done ? "border-[#2f76fb]/10 bg-white opacity-50" : ""}
          `}
        >
          <Icon
            size={30}
            strokeWidth={1.6}
            className={done ? "text-[#047857]" : active ? "text-[#2f76fb]" : "text-[#132261]/30"}
          />
        </div>

        <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full text-[11px] font-bold flex items-center justify-center border-[4px] border-[#f0f6fc] transition-all duration-300
          ${done ? "bg-[#047857] text-white" : active ? "bg-[#2f76fb] text-white" : "bg-slate-200 text-[#242938]"}
        `}>
          {done ? <Check size={14} /> : step.n}
        </span>

        {done && (
          <span className="absolute -top-2 -right-3 flex items-center gap-1 px-2 py-1 rounded-md border-2 border-[#047857] text-[#047857] text-[9px] font-bold tracking-wider bg-white -rotate-12 animate-[lmStampIn_0.55s_ease-out] shadow-sm">
            <Check size={10} strokeWidth={3} /> DONE
          </span>
        )}
      </div>

      <p style={{ fontFamily: FONT_TEXT, fontWeight: 700 }} className={`text-lg mt-6 transition-colors duration-500 ${active || done ? "text-[#132261]" : "text-[#242938]"}`}>
        {step.title}
      </p>
      <p className="text-[#242938]/70 text-[12px] mt-2 leading-relaxed max-w-[190px]">{step.desc}</p>

      <div className={`h-[3px] rounded-full mt-4 transition-all duration-500
        ${done ? "w-14 bg-[#047857]" : active ? "w-10 bg-[#2f76fb]/50" : "w-8 bg-[#2f76fb]/10"}
      `} />
    </div>
  );
}

function Congrats({ onReplay }) {
  return (
    <div className="mt-14 rounded-[32px] border border-[#047857]/25 bg-white relative overflow-hidden px-6 py-10 text-center animate-[lmPopIn_0.6s_ease-out] shadow-xl shadow-[#047857]/10" style={{ fontFamily: FONT_TEXT }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {CONFETTI.map((c, i) => (
          <span
            key={i}
            className="absolute top-0 w-[6px] h-[12px] rounded-sm animate-[lmConfettiFall_1.6s_ease-in_infinite]"
            style={{
                left: `${c.left}%`,
                backgroundColor: c.color,
                animationDuration: `${c.duration}s`,
                animationDelay: `${c.delay}s`
            }}
          />
        ))}
      </div>

      <div className="relative">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#047857] to-[#2f76fb] text-white flex items-center justify-center mx-auto animate-[bounce_0.5s_ease-out]">
          <PartyPopper size={26} />
        </div>
        <p style={{ fontFamily: FONT_TEXT, fontWeight: 800 }} className="text-3xl lg:text-4xl mt-5 text-[#132261]">
          Congratulations! <span className="text-[#047857]">🎉</span>
        </p>
        <p className="text-[#242938]/70 mt-3 text-sm lg:text-base max-w-[420px] mx-auto leading-relaxed">
          That's it — your loan journey is complete. From application to funds in your account, zero drama, all the way through.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-7">
          <button className="flex items-center gap-2 bg-gradient-to-r from-[#2f76fb] to-[#132261] text-white font-semibold text-sm px-6 py-3.5 rounded-full shadow-lg shadow-[#2f76fb]/30 hover:-translate-y-0.5 transition-transform">
            Start Your Real Application <ArrowRight size={16} />
          </button>
          <button onClick={onReplay} className="flex items-center gap-2 border border-slate-200 text-[#242938] font-medium text-sm px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 transition-colors">
            <RotateCcw size={15} /> Replay
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const navigate = useNavigate();
  const [session, setSession] = useState(() => getSession());
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Keep this in sync with login/logout that happen elsewhere in the app
  // (e.g. the Navbar) — 'authchange' fires in the same tab right after
  // login/logout, 'storage' covers other tabs.
  useEffect(() => {
    const syncSession = () => setSession(getSession());
    window.addEventListener("authchange", syncSession);
    window.addEventListener("storage", syncSession);
    return () => {
      window.removeEventListener("authchange", syncSession);
      window.removeEventListener("storage", syncSession);
    };
  }, []);

  // Same rule as the Hero's "Apply Here": logged-in visitors already have
  // an account, so the button is hidden for them; signed-out visitors are
  // sent to Register.
  const goToRegister = () => {
    navigate("/register");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && (setPlaying(true), io.disconnect()),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    const finished = progress === steps.length;
    const delay = finished ? HOLD_MS : STEP_MS;
    const t = setTimeout(() => {
      setProgress((p) => (p === steps.length ? 0 : p + 1));
    }, delay);
    return () => clearTimeout(t);
  }, [playing, progress]);

  const statusFor = (i) => {
    if (!playing) return "pending";
    return i < progress ? "done" : i === progress ? "active" : "pending";
  };
  const linePct = (progress / steps.length) * 100;
  const finished = progress === steps.length;

  return (
    <div id="how-it-works" className="relative overflow-hidden text-[#132261]" style={{ fontFamily: FONT_TEXT, background: "linear-gradient(180deg, #fdfdfd 0%, #f0f6fc 100%)" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');
        @keyframes lmStampIn {0%{transform:scale(2.4) rotate(-18deg);opacity:0;}100%{transform:scale(1) rotate(-12deg);opacity:1;}}
        @keyframes lmPopIn {0%{transform:scale(.95) translateY(10px);opacity:0;}100%{transform:scale(1) translateY(0);opacity:1;}}
        @keyframes lmConfettiFall {0%{transform:translateY(-16px) rotate(0deg);opacity:1;}100%{transform:translateY(150px) rotate(340deg);opacity:0;}}
      `}</style>

      {/* Mild, on-brand decorative background — softer dot grid + gentle blurred blobs */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(circle, ${PRIMARY}22 1px, transparent 1px)`, backgroundSize: "24px 24px" }}
      />
      <div className="absolute -top-16 left-[6%] w-64 h-64 rounded-full pointer-events-none" style={{ background: `${LAVENDER}12`, filter: "blur(70px)" }} />
      <div className="absolute top-1/3 -right-10 w-72 h-72 rounded-full pointer-events-none" style={{ background: `${PRIMARY}0e`, filter: "blur(80px)" }} />
      <div className="absolute bottom-10 left-1/4 w-56 h-56 rounded-full pointer-events-none" style={{ background: `${GOLD}0c`, filter: "blur(70px)" }} />

      {/* --- STEPS ANIMATION --- */}
      <section ref={sectionRef} className="relative overflow-hidden pt-8 pb-20 px-6">
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest px-4 py-1.5 rounded-full border border-[#2f76fb]/30 text-[#2f76fb] bg-white/80 shadow-sm">
                HOW IT WORKS
            </span>
            <h2 style={{ fontFamily: FONT_TEXT, fontWeight: 800 }} className="text-4xl lg:text-6xl text-[#132261] mt-6 leading-[1.1]">
              Simple Process. <span className="text-[#2f76fb]">Instant Support.</span>
            </h2>
            <p className="text-[#242938]/70 mt-4 text-base lg:text-lg">
              Watch your loan move from application to approval — live.
            </p>
            <div className="h-[3px] w-14 bg-[#2f76fb] rounded-full mx-auto mt-5" />
          </div>

          <div className="relative mt-16">
            {/* Progress Track Line */}
            <div className="hidden lg:block absolute left-[8.3%] right-[8.3%] top-11 h-[2px] bg-[#2f76fb]/10 overflow-hidden">
              <div
                className="h-full bg-[#2f76fb] transition-all duration-[1300ms] linear"
                style={{ width: `${linePct}%` }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-14 gap-x-4 relative">
              {steps.map((s, i) => (
                <StepCard key={s.n} step={s} status={statusFor(i)} />
              ))}
            </div>
          </div>

          {finished && <Congrats onReplay={() => setProgress(0)} />}
        </div>
      </section>

      {/* --- WHY CHOOSE --- */}
      <section className="relative max-w-6xl mx-auto px-6 pb-8">
        <div className="bg-[#132261] rounded-[32px] p-8 lg:p-12 relative overflow-hidden shadow-2xl">
          <p style={{ fontFamily: FONT_TEXT, fontWeight: 700 }} className="text-2xl lg:text-3xl text-white text-center relative z-10">
            Why choose <span className="text-[#89b6f8]">LoanMela?</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mt-10 relative z-10">
            {whyChoose.map((w) => {
              const Icon = w.icon;
              return (
                <div key={w.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-white" />
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-white">{w.title}</p>
                    <p className="text-[12px] mt-1 leading-relaxed text-white/60">{w.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- CTA BANNER --- */}
      <section className="relative max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-[32px] relative overflow-hidden px-8 py-12 lg:p-14 bg-gradient-to-br from-[#132261] to-[#1b3583] text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-[#89b6f8]/20 blur-[60px]" />

          <div className="relative z-10 flex flex-wrap gap-8 items-center">
            {/* Phone Visual */}
            <div className="relative w-40 h-56 rounded-[32px] bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-2 shadow-2xl mx-auto lg:mx-0">
              <div style={{ fontFamily: FONT_TEXT, fontWeight: 800 }} className="w-9 h-9 rounded-full bg-white text-[#132261] flex items-center justify-center text-lg">LM</div>
              <p style={{ fontFamily: FONT_TEXT, fontWeight: 700 }} className="text-sm text-white">Loan<span className="text-[#89b6f8]">Mela</span></p>
              <span className="absolute right-[-12px] bottom-6 w-9 h-9 rounded-full bg-[#2f76fb] flex items-center justify-center border-[4px] border-[#1b3583] animate-[bounce_4s_infinite]">
                <ShieldCheck size={15} className="text-white" />
              </span>
            </div>

            <div className="flex-1 min-w-[260px]">
              <p style={{ fontFamily: FONT_TEXT, fontWeight: 800 }} className="text-3xl lg:text-5xl text-white leading-tight">
                Ready to take the next step?
              </p>
              <p className="mt-3 text-[15px] text-white/70">
                Apply now and get the funds you need, when you need them.
              </p>
              <div className="flex flex-wrap gap-3 mt-5">
                {[
                    { icon: FileText, label: "Minimal Documents" },
                    { icon: Zap, label: "Quick Approval" },
                    { icon: Leaf, label: "100% Paperless" }
                ].map((tag, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 text-[12px] px-3 py-1.5 rounded-full border border-white/15 text-white/80 bg-white/5">
                        <tag.icon size={13} /> {tag.label}
                    </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-start gap-3">
              {!session && (
                <button onClick={goToRegister} className="bg-gradient-to-r from-[#2f76fb] to-[#132261] hover:shadow-[#2f76fb]/40 transition-shadow py-5 px-10 text-lg font-bold rounded-full flex items-center gap-2 group">
                  Apply Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              )}
              <span className="inline-flex items-center gap-1.5 text-[12px] text-white/40">
                <Lock size={12} /> Your data is 100% secure
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}