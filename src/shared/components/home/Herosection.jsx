import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Sparkles, Radio } from 'lucide-react';

// Local color/font tokens (previously imported from a shared Colourservice
// file, which no longer exists — defined here directly). Matches Navbar.jsx.
const GREEN = '#22c55e';
const DARK = '#0a0f0d';
const CARD_DARK = '#141a18';
const FONT_SERIF = "'Playfair Display', serif";
const FONT_MONO = "'JetBrains Mono', monospace";
const FONT_HEAD = "'Poppins', sans-serif";
const FONT_BODY = "'Inter', sans-serif";

const STATS = [
  { value: 7.5, decimals: 1, suffix: '%', label: 'Starting interest' },
  { value: 24, decimals: 0, suffix: 'hr', label: 'Quick approval' },
  { value: 35, decimals: 0, suffix: 'Cr', label: 'Max funding' },
];

const FEED = [
  { name: 'Rahul K.', city: 'Chennai', loan: 'Bike Loan', amount: '₹85,000', time: '2 min ago' },
  { name: 'Ananya S.', city: 'Bengaluru', loan: 'Personal Loan', amount: '₹1.2L', time: '4 min ago' },
  { name: 'Vignesh M.', city: 'Coimbatore', loan: 'Business Loan', amount: '₹4.5L', time: '6 min ago' },
  { name: 'Fathima B.', city: 'Kochi', loan: 'Home Renovation', amount: '₹2.1L', time: '9 min ago' },
  { name: 'Arjun P.', city: 'Pune', loan: 'Car Loan', amount: '₹6.8L', time: '11 min ago' },
  { name: 'Divya R.', city: 'Hyderabad', loan: 'Gold Loan', amount: '₹95,000', time: '14 min ago' },
];

function useCountUp(target, decimals, active) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf;
    const duration = 1300;
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
  return value.toFixed(decimals);
}

function StatItem({ stat, active }) {
  const display = useCountUp(stat.value, stat.decimals, active);
  return (
    <div>
      <p className="text-2xl font-bold" style={{ color: GREEN, fontFamily: FONT_MONO }}>
        {display}{stat.suffix}
      </p>
      <p className="text-[12px] text-white/45 mt-1">{stat.label}</p>
    </div>
  );
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const feedTrack = [...FEED, ...FEED];

  return (
    <section
      className="relative overflow-hidden"
      style={{ background: DARK, fontFamily: FONT_BODY }}
    >
      <div
        className="absolute inset-0 opacity-[0.25] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.12) 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      <div className="absolute top-0 left-[5%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-6 pb-20 md:pt-10 md:pb-28 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-center">

        <div>
          <div
            className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-8 text-[12px]"
            style={{ borderColor: 'rgba(79,70,229,0.35)', color: GREEN, fontFamily: FONT_MONO }}
          >
            India's Loan Mela — Everything. One Roof.
          </div>

          <h1
            className="text-[2.75rem] md:text-6xl leading-[1.08] mb-7 font-bold"
            style={{ color: '#fff', fontFamily: FONT_SERIF }}
          >
            Loans that <span style={{ color: GREEN }}>meet your</span>
            <br />
            moment.
          </h1>

          <p className="text-white/55 text-base md:text-lg leading-relaxed mb-10 max-w-lg">
            From your first bike to your dream home, from delivery gig capital
            to business growth — compare, apply and get funded in minutes.
            Transparent rates, zero hidden charges.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-14">
            <button
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-bold text-white shadow-[0_10px_24px_rgba(79,70,229,0.35)] hover:shadow-[0_12px_30px_rgba(79,70,229,0.5)] transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: GREEN, fontFamily: FONT_HEAD }}
            >
              Explore Schemes
              <ArrowUpRight size={17} strokeWidth={2.5} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              className="px-7 py-3.5 rounded-full font-bold text-white border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all"
              style={{ fontFamily: FONT_HEAD }}
            >
              Create Account
            </button>
          </div>

          <div className="flex flex-wrap gap-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {STATS.map((s) => (
              <StatItem key={s.label} stat={s} active={mounted} />
            ))}
          </div>
        </div>

        <div className="relative">
          <div
            className="relative rounded-3xl overflow-hidden border"
            style={{ background: CARD_DARK, borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <div className="flex items-center justify-between px-5 pt-5 pb-4">
              <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest" style={{ color: GREEN, fontFamily: FONT_MONO }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                Live activity
              </span>
              <Radio size={13} className="text-white/25" />
            </div>

            <div
              className="relative h-[320px] overflow-hidden px-3 pb-3"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
              }}
            >
              <div className="lm-feed-track flex flex-col gap-2.5">
                {feedTrack.map((f, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-3"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-extrabold text-[12px] text-white"
                      style={{ background: 'rgba(79,70,229,0.2)', fontFamily: FONT_HEAD }}
                    >
                      {f.name.split(' ').map((p) => p[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-bold text-white truncate" style={{ fontFamily: FONT_HEAD }}>
                        {f.name} <span className="font-medium text-white/40">&middot; {f.city}</span>
                      </p>
                      <p className="text-[11.5px] text-white/45">{f.loan} approved</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-[12.5px] font-bold" style={{ color: GREEN, fontFamily: FONT_MONO }}>{f.amount}</p>
                      <p className="text-[10px] text-white/30">{f.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-5 py-4 flex items-center gap-2" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Sparkles size={13} style={{ color: GREEN }} />
              <span className="text-[11.5px] text-white/45">New approvals happening across India, right now</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes lm-feed-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(-50%); }
        }
        .lm-feed-track {
          animation: lm-feed-scroll 18s linear infinite;
        }
        .lm-feed-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}