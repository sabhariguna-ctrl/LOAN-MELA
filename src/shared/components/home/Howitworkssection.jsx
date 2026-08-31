import React, { useEffect, useState } from 'react';
import {
  UserPlus, ShieldCheck, LayoutGrid, Wallet, ArrowUpRight, Clock3,
  CheckCircle2, PartyPopper, RotateCcw, Sparkles, ChevronRight,
  Radio, TrendingUp, Building2, Landmark, Shield
} from 'lucide-react';

const GREEN = '#15A362';
const GOLD = '#F0A93A';
const DARK = '#0A0F0D';
const CARD_DARK = '#101915';

const FONT_SERIF = "'Playfair Display', Georgia, serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const FONT_HEAD = "'Plus Jakarta Sans', 'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

// BANKS DATA
const PARTNER_BANKS = [
  { name: 'Central Bank of India', type: 'Lead Partner' },
  { name: 'HDFC Bank', type: 'Digital Payouts' },
  { name: 'State Bank of India', type: 'Institutional' },
  { name: 'ICICI Bank', type: 'Smart Verification' },
];

const STEPS = [
  {
    icon: UserPlus,
    title: 'Register in 60 seconds',
    body: 'Sign up with email. Complete your KYC once — reuse it for every loan.',
    time: '~1 min',
    stat: '99% complete this in one go',
  },
  {
    icon: ShieldCheck,
    title: 'Complete your KYC',
    body: 'Upload PAN & Aadhar. Verification runs instantly against government records.',
    time: '~2 min',
    stat: '256-bit encrypted upload',
  },
  {
    icon: LayoutGrid,
    title: 'Pick your scheme',
    body: 'Browse home, vehicle, personal, business or Delivery Bhai — see EMI upfront.',
    time: '~2 min',
    stat: '15+ schemes to compare',
  },
  {
    icon: Wallet,
    title: 'Submit & track',
    body: 'Fill your details and track your application status live, on your dashboard.',
    time: 'Same day',
    stat: '92% approved on first try',
  },
];

const CONFETTI = [
  { color: GREEN, left: '8%', delay: '0s', size: 8 },
  { color: GOLD, left: '20%', delay: '0.15s', size: 6 },
  { color: '#fff', left: '35%', delay: '0.3s', size: 5 },
  { color: GOLD, left: '52%', delay: '0.1s', size: 8 },
  { color: GREEN, left: '68%', delay: '0.25s', size: 6 },
  { color: '#fff', left: '80%', delay: '0.05s', size: 5 },
  { color: GOLD, left: '92%', delay: '0.2s', size: 6 },
];

function useLiveTicker(base, spread) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const next = c + Math.floor(Math.random() * spread - spread / 2);
        return Math.max(base - spread, Math.min(base + spread, next));
      });
    }, 2200);
    return () => clearInterval(interval);
  }, [base, spread]);
  return count;
}

export default function HowItWorksSection() {
  const [completed, setCompleted] = useState([false, false, false, false]);
  const [activeStep, setActiveStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [cycle, setCycle] = useState(0);

  const liveApplicants = useLiveTicker(247, 30);

  useEffect(() => {
    setCompleted([false, false, false, false]);
    setShowCelebration(false);
    setActiveStep(0);

    const timers = [
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[0] = true; return n; }); setActiveStep(1); }, 1300),
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[1] = true; return n; }); setActiveStep(2); }, 2700),
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[2] = true; return n; }); setActiveStep(3); }, 4100),
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[3] = true; return n; }); setShowCelebration(true); }, 5500),
      setTimeout(() => { setCycle((c) => c + 1); }, 9500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  return (
    <section
      className="relative overflow-hidden px-6 md:px-10 pt-0 pb-20" // Pulled up pt-0
      style={{ background: DARK, fontFamily: FONT_BODY }}
    >
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />

      <div className="relative max-w-6xl mx-auto">

        {/* --- NEW SECTION: BANKING TIE-UPS --- */}
        <div className="mb-20 pt-10">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-10 border-b border-white/5 pb-10">
             <div className="flex-1">
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] mb-3" style={{ color: GREEN, fontFamily: FONT_MONO }}>
                  Our Trusted Ecosystem
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: FONT_SERIF }}>
                  Backed by <span style={{ color: GREEN }}>Institutional</span> Trust.
                </h2>
                <p className="text-white/40 mt-4 max-w-lg font-medium leading-relaxed">
                  We are directly integrated with India's premier financial institutions to ensure your funds are disbursed with banking-grade security and speed.
                </p>
             </div>
             
             {/* Dynamic Bank Cards */}
             <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
               {PARTNER_BANKS.map((bank, i) => (
                 <div key={i} className="bg-white/[0.03] border border-white/10 p-5 rounded-2xl group hover:border-[#15A362] transition-all duration-500">
                    <Landmark size={20} className="text-[#15A362] mb-3 group-hover:scale-110 transition-transform" />
                    <p className="text-white font-black text-sm mb-1">{bank.name}</p>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold">{bank.type}</p>
                 </div>
               ))}
             </div>
          </div>
          
          {/* Trust Footer */}
          <div className="flex flex-wrap justify-center md:justify-start gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-black text-[10px] text-white tracking-[0.2em] uppercase"><Shield size={14} className="text-[#15A362]"/> RBI Regulated</div>
             <div className="flex items-center gap-2 font-black text-[10px] text-white tracking-[0.2em] uppercase"><CheckCircle2 size={14} className="text-[#15A362]"/> PCI DSS Compliant</div>
             <div className="flex items-center gap-2 font-black text-[10px] text-white tracking-[0.2em] uppercase"><Building2 size={14} className="text-[#15A362]"/> NPCI Integrated</div>
          </div>
        </div>

        {/* --- THE ORIGINAL 4 STEPS CODE --- */}
        <p className="text-[12px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: GREEN, fontFamily: FONT_MONO }}>
          The Process
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: FONT_SERIF }}>
          Four steps. Zero drama.
        </h2>
        
        {/* Live ticker */}
        <div className="flex mb-10">
          <span
            className="inline-flex items-center gap-2.5 text-[12.5px] font-bold px-4 py-2 rounded-full border"
            style={{ color: GREEN, background: 'rgba(21,163,98,0.1)', borderColor: 'rgba(21,163,98,0.25)', fontFamily: FONT_MONO }}
          >
            <Radio size={12} className="animate-pulse" />
            {liveApplicants} people going through this exact flow right now
          </span>
        </div>

        {/* Animated steps container */}
        <div className="relative">
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-[2px] rounded-full -z-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="flex h-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1/3 h-full px-[2px]">
                  <div
                    className="h-full rounded-full transition-all ease-out"
                    style={{ width: completed[i] ? '100%' : '0%', background: GREEN, transitionDuration: '900ms' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => {
              const isDone = completed[i];
              const isActive = activeStep === i && !isDone;
              return (
                <div
                  key={step.title}
                  className="group relative rounded-2xl p-6 pt-7 transition-all duration-500 flex flex-col min-h-[240px] border"
                  style={{
                    background: isDone ? 'rgba(21,163,98,0.1)' : CARD_DARK,
                    borderColor: isDone ? 'rgba(21,163,98,0.35)' : isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[13px] font-bold" style={{ color: isDone ? GREEN : 'rgba(255,255,255,0.35)', fontFamily: FONT_MONO }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500`}
                        style={{ background: isDone ? GREEN : 'rgba(255,255,255,0.06)' }}>
                        {isDone ? <CheckCircle2 size={18} color="#fff" /> : <step.icon size={17} className="text-white/60" />}
                    </div>
                  </div>

                  <h3 className="font-bold text-[17px] mb-2 text-white" style={{ fontFamily: FONT_SERIF }}>{step.title}</h3>
                  <p className="text-[13px] text-white/45 leading-relaxed mb-5 flex-1">{step.body}</p>

                  <div className="flex flex-col gap-2 mt-auto">
                     <span className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full w-fit"
                      style={{ background: isDone ? 'rgba(21,163,98,0.18)' : 'rgba(255,255,255,0.06)', color: isDone ? GREEN : 'rgba(255,255,255,0.5)' }}>
                      <Clock3 size={10} /> {isDone ? 'Done' : step.time}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Celebration banner */}
        <div className={`relative overflow-hidden transition-all duration-700 ease-out ${showCelebration ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'}`}>
          <div className="relative p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 justify-between border rounded-3xl"
            style={{ background: 'linear-gradient(120deg, rgba(21,163,98,0.18) 0%, rgba(21,163,98,0.05) 100%)', borderColor: 'rgba(21,163,98,0.25)' }}>
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/10">
                <PartyPopper size={26} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-xl" style={{ fontFamily: FONT_SERIF }}>Congratulations — you're funded!</p>
                <p className="text-white/55 text-[13.5px] mt-1">Our partners at Central Bank of India have processed your request.</p>
              </div>
            </div>
            <button onClick={() => setCycle((c) => c + 1)} className="text-white border px-4 py-2 rounded-full text-xs font-bold hover:bg-white/5 transition-all">
              <RotateCcw size={14} className="inline mr-1"/> Watch again
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-14">
          <button className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#052B1B] shadow-[0_10px_24px_rgba(21,163,98,0.3)] hover:-translate-y-0.5 transition-all"
            style={{ background: GREEN, fontFamily: FONT_HEAD }}>
            Start your application
            <ArrowUpRight size={18} strokeWidth={2.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}









/*
import React, { useEffect, useState } from 'react';
import {
  UserPlus, ShieldCheck, LayoutGrid, Wallet, ArrowUpRight, Clock3,
  CheckCircle2, PartyPopper, RotateCcw, Sparkles, ChevronRight,
  Radio, TrendingUp,
} from 'lucide-react';

const GREEN = '#15A362';
const GOLD = '#F0A93A';
const DARK = '#0A0F0D';
const CARD_DARK = '#101915';

const FONT_SERIF = "'Playfair Display', Georgia, serif";
const FONT_MONO = "'JetBrains Mono', 'Courier New', monospace";
const FONT_HEAD = "'Plus Jakarta Sans', 'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

const STEPS = [
  {
    icon: UserPlus,
    title: 'Register in 60 seconds',
    body: 'Sign up with email. Complete your KYC once — reuse it for every loan.',
    time: '~1 min',
    stat: '99% complete this in one go',
  },
  {
    icon: ShieldCheck,
    title: 'Complete your KYC',
    body: 'Upload PAN & Aadhar. Verification runs instantly against government records.',
    time: '~2 min',
    stat: '256-bit encrypted upload',
  },
  {
    icon: LayoutGrid,
    title: 'Pick your scheme',
    body: 'Browse home, vehicle, personal, business or Delivery Bhai — see EMI upfront.',
    time: '~2 min',
    stat: '15+ schemes to compare',
  },
  {
    icon: Wallet,
    title: 'Submit & track',
    body: 'Fill your details and track your application status live, on your dashboard.',
    time: 'Same day',
    stat: '92% approved on first try',
  },
];

const CONFETTI = [
  { color: GREEN, left: '8%', delay: '0s', size: 8 },
  { color: GOLD, left: '20%', delay: '0.15s', size: 6 },
  { color: '#fff', left: '35%', delay: '0.3s', size: 5 },
  { color: GOLD, left: '52%', delay: '0.1s', size: 8 },
  { color: GREEN, left: '68%', delay: '0.25s', size: 6 },
  { color: '#fff', left: '80%', delay: '0.05s', size: 5 },
  { color: GOLD, left: '92%', delay: '0.2s', size: 6 },
];

function useLiveTicker(base, spread) {
  const [count, setCount] = useState(base);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const next = c + Math.floor(Math.random() * spread - spread / 2);
        return Math.max(base - spread, Math.min(base + spread, next));
      });
    }, 2200);
    return () => clearInterval(interval);
  }, [base, spread]);
  return count;
}

export default function HowItWorksSection() {
  const [completed, setCompleted] = useState([false, false, false, false]);
  const [activeStep, setActiveStep] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [cycle, setCycle] = useState(0);

  const liveApplicants = useLiveTicker(247, 30);

  useEffect(() => {
    setCompleted([false, false, false, false]);
    setShowCelebration(false);
    setActiveStep(0);

    const timers = [
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[0] = true; return n; }); setActiveStep(1); }, 1300),
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[1] = true; return n; }); setActiveStep(2); }, 2700),
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[2] = true; return n; }); setActiveStep(3); }, 4100),
      setTimeout(() => { setCompleted((c) => { const n = [...c]; n[3] = true; return n; }); setShowCelebration(true); }, 5500),
      setTimeout(() => { setCycle((c) => c + 1); }, 9500),
    ];

    return () => timers.forEach(clearTimeout);
  }, [cycle]);

  return (
    <section
      className="relative overflow-hidden px-6 md:px-10 pt-6 md:pt-8 pb-20"
      style={{ background: DARK, fontFamily: FONT_BODY }}
    >
      <div
        className="absolute inset-0 opacity-[0.22] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/[0.06] blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto">

        
        <p className="text-[12px] font-bold uppercase tracking-[0.25em] mb-3" style={{ color: GREEN, fontFamily: FONT_MONO }}>
          How it works
        </p>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: FONT_SERIF }}>
          Four steps. Zero drama.
        </h2>
        <p className="text-white/50 text-[15px] md:text-base leading-relaxed max-w-2xl mb-10">
          A frictionless flow designed for borrowers, by borrowers. No
          paperwork chaos, no branch visits.
        </p>

        
        <div className="flex mb-10">
          <span
            className="inline-flex items-center gap-2.5 text-[12.5px] font-bold px-4 py-2 rounded-full border"
            style={{ color: GREEN, background: 'rgba(21,163,98,0.1)', borderColor: 'rgba(21,163,98,0.25)', fontFamily: FONT_MONO }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <Radio size={12} />
            {liveApplicants} people going through this exact flow right now
          </span>
        </div>

        
        <div className="relative">
          <div className="hidden lg:block absolute top-14 left-[12.5%] right-[12.5%] h-[2px] rounded-full -z-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="flex h-full">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1/3 h-full px-[2px]">
                  <div
                    className="h-full rounded-full transition-all ease-out"
                    style={{ width: completed[i] ? '100%' : '0%', background: GREEN, transitionDuration: '900ms' }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {STEPS.map((step, i) => {
              const isDone = completed[i];
              const isActive = activeStep === i && !isDone;
              return (
                <div
                  key={step.title}
                  className="group relative rounded-2xl p-6 pt-7 transition-all duration-500 flex flex-col min-h-[240px] border"
                  style={{
                    background: isDone ? 'rgba(21,163,98,0.1)' : CARD_DARK,
                    borderColor: isDone ? 'rgba(21,163,98,0.35)' : isActive ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.08)',
                    boxShadow: isActive ? '0 12px 28px rgba(0,0,0,0.35)' : 'none',
                  }}
                >
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-[13px] font-bold"
                      style={{ color: isDone ? GREEN : 'rgba(255,255,255,0.35)', fontFamily: FONT_MONO }}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="relative">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? 'animate-pulse' : ''}`}
                        style={{ background: isDone ? GREEN : 'rgba(255,255,255,0.06)' }}
                      >
                        {isDone ? (
                          <CheckCircle2 size={18} strokeWidth={2.2} color="#fff" />
                        ) : (
                          <step.icon size={17} strokeWidth={2} className="text-white/60" />
                        )}
                      </div>
                      {isActive && (
                        <span className="absolute inset-0 rounded-xl animate-ping" style={{ background: 'rgba(255,255,255,0.15)' }} />
                      )}
                    </div>
                  </div>

                  <h3 className="font-bold text-[17px] mb-2 text-white" style={{ fontFamily: FONT_SERIF }}>
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-white/45 leading-relaxed mb-5 flex-1">
                    {step.body}
                  </p>

                  <div className="flex flex-col gap-2 mt-auto">
                    <span
                      className="inline-flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full w-fit"
                      style={{ background: isDone ? 'rgba(21,163,98,0.18)' : 'rgba(255,255,255,0.06)', color: isDone ? GREEN : 'rgba(255,255,255,0.5)' }}
                    >
                      {isDone ? <CheckCircle2 size={10} /> : <Clock3 size={10} />}
                      {isDone ? 'Done' : step.time}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/30">
                      <TrendingUp size={10} />
                      {step.stat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div
          className={`relative overflow-hidden mt-8 rounded-3xl transition-all duration-700 ease-out ${
            showCelebration ? 'max-h-96 opacity-100 mt-8' : 'max-h-0 opacity-0 mt-0'
          }`}
        >
          <div
            className="relative p-7 md:p-9 flex flex-col md:flex-row items-center gap-6 justify-between border"
            style={{ background: 'linear-gradient(120deg, rgba(21,163,98,0.18) 0%, rgba(21,163,98,0.05) 100%)', borderColor: 'rgba(21,163,98,0.25)' }}
          >
            {showCelebration && CONFETTI.map((c, i) => (
              <span
                key={i}
                className="absolute top-2 rounded-full animate-bounce"
                style={{ left: c.left, width: c.size, height: c.size, background: c.color, animationDelay: c.delay, animationDuration: '1.4s', opacity: 0.85 }}
              />
            ))}

            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <PartyPopper size={26} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-xl flex items-center gap-2" style={{ fontFamily: FONT_SERIF }}>
                  Congratulations — you're funded!
                  <Sparkles size={16} style={{ color: GOLD }} />
                </p>
                <p className="text-white/55 text-[13.5px] mt-1 max-w-md">
                  Priya from Chennai finished this exact flow and had her
                  bike loan approved in 12 minutes flat. You could be next.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCycle((c) => c + 1)}
              className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-white border hover:bg-white/5 transition-colors text-[13px] flex-shrink-0"
              style={{ borderColor: 'rgba(255,255,255,0.2)', fontFamily: FONT_HEAD }}
            >
              <RotateCcw size={14} />
              Watch again
            </button>
          </div>
        </div>

        
        <div className="flex justify-center mt-14">
          <button
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-[#052B1B] shadow-[0_10px_24px_rgba(21,163,98,0.3)] hover:shadow-[0_12px_28px_rgba(21,163,98,0.45)] transition-all hover:-translate-y-0.5 active:scale-95"
            style={{ background: GREEN, fontFamily: FONT_HEAD }}
          >
            Start your application
            <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </section>
  );
}*/