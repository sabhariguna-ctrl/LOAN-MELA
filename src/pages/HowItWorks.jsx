import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Sparkles, ShieldCheck, Building2, FileText, Users, Clock,
  Layers, BadgeCheck, Zap, User, Wallet, MoveRight, Home, Briefcase, GraduationCap, Car,
  UserPlus, Upload, Search, Send, IndianRupee, ChevronDown, CreditCard, Landmark,
  CalendarDays, Percent, ImageIcon, PlayCircle, Fingerprint, Eye, Bell, FileCheck, PiggyBank,
} from 'lucide-react';

/* ================= TOKENS ================= */
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_LIGHT = '#89b6f8';
const BLUE_TINT = '#d9e7f9';
const BLUE_PALE = '#f0f6fc';
const SLATE = '#757e9e';
const GRAY = '#c0bec2';
const WHITE = '#fdfdfd';
const TEXT = '#242938';

const FONT_SERIF = "'Poppins', sans-serif";
const FONT_BODY = "'Poppins', sans-serif";
const EASE = [0.22, 1, 0.36, 1];

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: EASE } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ================= IMAGES ================= */
const IMG = {
  step1: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1000&q=75&auto=format&fit=crop',
  step2: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1000&q=75&auto=format&fit=crop',
  step3: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1000&q=75&auto=format&fit=crop',
  step4: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1000&q=75&auto=format&fit=crop',
  step5: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=1000&q=75&auto=format&fit=crop',
  docs: 'https://images.unsplash.com/photo-1568234928966-359c35dd8327?w=1200&q=75&auto=format&fit=crop',
  review: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=900&q=75&auto=format&fit=crop',
  notify: 'https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=900&q=75&auto=format&fit=crop',
  bank: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=1600&q=75&auto=format&fit=crop',
};

const ICONS3D = {
  shield: '/images/shield.png', building: '/images/building.png', lock: '/images/lock.png',
  file: '/images/file.png', award: '/images/award.png', users: '/images/users.png',
  clock: '/images/clock.png', layers: '/images/layers.png', bolt: '/images/trending.png',
  creditcard: '/images/creditcard.png', piggybank: '/images/piggybank.png',
  rupee: '/images/rupee.png', wallet: '/images/wallet.png', trending: '/images/trending.png',
};

const ICONS = {
  shield: ShieldCheck, building: Building2, file: FileText, users: Users, clock: Clock,
  layers: Layers, badge: BadgeCheck, bolt: Zap, you: User, wallet: Wallet, home: Home,
  biz: Briefcase, edu: GraduationCap, auto: Car, signup: UserPlus, upload: Upload,
  match: Search, send: Send, money: IndianRupee, card: CreditCard, bankIcon: Landmark,
  calendar: CalendarDays, percent: Percent, id: Fingerprint, eye: Eye, bell: Bell,
  fileCheck: FileCheck, creditcard: CreditCard, piggybank: PiggyBank, rupee: IndianRupee, trending: Zap,
};

/* ================= DATA ================= */
const HERO_FLOAT = [
  { icon: 'clock', top: '15%', side: 'left', pos: '7%', size: 46, delay: 0, dur: 4.2, depth: 30 },
  { icon: 'file', top: '58%', side: 'left', pos: '12%', size: 48, delay: 0.5, dur: 4.8, depth: 18 },
  { icon: 'creditcard', top: '30%', side: 'left', pos: '22%', size: 36, delay: 1, dur: 4.4, depth: 22 },
  { icon: 'building', top: '14%', side: 'right', pos: '7%', size: 45, delay: 0.4, dur: 4.1, depth: 30 },
  { icon: 'rupee', top: '55%', side: 'right', pos: '11%', size: 42, delay: 0.8, dur: 4.9, depth: 18 },
  { icon: 'users', top: '34%', side: 'right', pos: '21%', size: 36, delay: 1.2, dur: 4.5, depth: 22 },
];

const HEADLINE_STATS = [
  { v: '7', s: 'min', l: 'To complete your application' },
  { v: '1', s: '', l: 'Document set, uploaded once' },
  { v: '48', s: 'hr', l: 'Typical time to an answer' },
  { v: '0', s: '₹', l: 'Cost to use LoanMela' },
];

const STEPS = [
  {
    n: '01', icon: 'signup', img: IMG.step1, time: '2 min', short: 'Create account',
    title: 'Create your free account',
    body: 'Sign up with your mobile number and verify with a single OTP. No fees, no commitment, and nothing that touches your credit score at this stage.',
    points: ['Mobile number + OTP only', 'Completely free to join', 'Zero credit-score impact'],
  },
  {
    n: '02', icon: 'upload', img: IMG.step2, time: '5 min', short: 'One application',
    title: 'Fill one form, upload once',
    body: 'A single unified application covers every scheme we host. Upload Aadhaar, PAN and bank statements one time — we reuse them everywhere, so you never re-enter the same detail twice.',
    points: ['One form covers 15+ schemes', 'Documents stored encrypted', 'Save and resume anytime'],
  },
  {
    n: '03', icon: 'match', img: IMG.step3, time: 'Instant', short: 'Compare schemes',
    title: 'See every scheme you qualify for',
    body: 'We lay out all matching schemes from our associated banks side by side — rate, tenure and limits in plain language. Nothing is hidden behind an invisible eligibility score.',
    points: ['Transparent rate comparison', 'No secret eligibility filter', 'Compare before committing'],
  },
  {
    n: '04', icon: 'send', img: IMG.step4, time: '1 click', short: 'Submit to bank',
    title: 'Submit straight to the bank',
    body: 'Your application goes directly to the bank you choose. No agents, no lead brokers, nobody reselling your details. Track live status from your dashboard the whole way through.',
    points: ['Direct bank submission', 'Live status on your dashboard', 'SMS and email updates'],
  },
  {
    n: '05', icon: 'money', img: IMG.step5, time: '~48 hrs', short: 'Get funded',
    title: 'Get sanctioned, get funded',
    body: 'You receive a straight answer — and a real written reason if it is a no. Once approved, funds are disbursed directly into the bank account you nominated.',
    points: ['Answer in about 48 hours', 'A reason on every decision', 'Direct-to-account disbursal'],
  },
];

const DOCS = [
  { icon: 'id', name: 'Aadhaar Card', note: 'Identity and address proof', req: 'Required' },
  { icon: 'card', name: 'PAN Card', note: 'Tax identity verification', req: 'Required' },
  { icon: 'bankIcon', name: 'Bank Statement', note: 'Last 3 months, PDF or image', req: 'Required' },
  { icon: 'file', name: 'Income Proof', note: 'Salary slips or latest ITR', req: 'Required' },
  { icon: 'home', name: 'Property Papers', note: 'Home loan applications only', req: 'If applicable' },
  { icon: 'biz', name: 'Business Registration', note: 'MSME and business loans only', req: 'If applicable' },
];

const AFTER = [
  {
    icon: 'fileCheck', tag: 'Within hours', title: 'Documents verified',
    body: 'The bank checks that everything you uploaded is legible, current and matches your profile. If something is missing you are told immediately, not days later.',
    from: '#e6f1fb', to: '#b5d4f4', fg: '#0c447c',
  },
  {
    icon: 'eye', tag: 'Day 1–2', title: 'Credit assessment',
    body: 'Underwriting reviews your income, obligations and the scheme you chose.',
    from: '#eaf3de', to: '#c0dd97', fg: '#27500a',
  },
  {
    icon: 'bell', tag: 'Always on', title: 'You stay informed',
    body: 'Every status change triggers an SMS and email. No chasing anyone for updates.',
    from: '#faeeda', to: '#fac775', fg: '#633806',
  },
];

const FAQS = [
  { q: 'Does applying affect my credit score?', a: 'Creating an account and browsing schemes has zero impact. A formal credit check happens only after you explicitly submit an application to the bank — and we tell you clearly before that step.' },
  { q: 'Do I pay anything to LoanMela?', a: 'No. LoanMela is free for borrowers. We never charge processing fees, platform fees or commissions. Any fee you pay goes directly to the bank and is disclosed in the sanction letter before you accept.' },
  { q: 'Which banks can I apply through?', a: 'LoanMela works with a growing group of associated banks, so every scheme you see is real and directly sanctioned by one of them. There are no lead-selling middlemen, and your documents are never shared with third parties.' },
  { q: 'What happens if I am rejected?', a: 'You get a real, written reason — not a silent no. In most cases we also show which alternative scheme you would qualify for, so you can reapply immediately without re-uploading anything.' },
  { q: 'How secure are my documents?', a: 'Documents are encrypted at rest and in transit, and shared only with the associated bank for the specific application you submit. You can delete them from your dashboard at any time.' },
  { q: 'Can I apply for more than one scheme?', a: 'Yes. Your single document set works across every scheme. You can compare and submit to multiple schemes without filling anything in twice.' },
];

/* ================= PRIMITIVES ================= */

function Pic({ src, alt = '', className = '', imgClass = '', icon = 'layers', rounded = 'rounded-2xl', ratio, style, children }) {
  const [state, setState] = useState('loading');
  const Fallback = ICONS[icon] || ImageIcon;
  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={{ ...(ratio ? { aspectRatio: ratio } : {}), ...style }}>
      {state !== 'ok' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BLUE_PALE} 0%, ${BLUE_TINT} 55%, ${BLUE_PALE} 100%)` }}>
          <span className="hw-shimmer absolute inset-0" />
          <Fallback className="relative" size={28} style={{ color: BLUE_LIGHT }} strokeWidth={1.6} />
        </div>
      )}
      {state !== 'fail' && src && (
        <img
          src={src} alt={alt} loading="lazy" draggable={false}
          onLoad={() => setState('ok')} onError={() => setState('fail')}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${imgClass}`}
        />
      )}
      {children}
    </div>
  );
}

function Icon3D({ name, size = 40 }) {
  const [failed, setFailed] = useState(false);
  const src = ICONS3D[name];
  const Fallback = ICONS[name];
  if (!src || failed) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl backdrop-blur-md"
        style={{ width: size, height: size, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.25)', boxShadow: '0 10px 26px rgba(19,34,97,.35)' }}
      >
        {Fallback && <Fallback size={size * 0.5} style={{ color: WHITE }} strokeWidth={2} />}
      </div>
    );
  }
  return (
    <img
      src={src} alt="" draggable={false} onError={() => setFailed(true)}
      className="object-contain select-none"
      style={{ width: size, height: size, filter: 'drop-shadow(0 10px 18px rgba(19,34,97,.4))' }}
    />
  );
}

function Icon({ name, size = 16, color = NAVY, strokeWidth = 2.25, className = '' }) {
  const Cmp = ICONS[name];
  return Cmp ? <Cmp size={size} className={className} style={{ color }} strokeWidth={strokeWidth} /> : null;
}

function IconBadge({ name, size = 46, iconSize }) {
  const Cmp = ICONS[name];
  const s = iconSize || Math.round(size * 0.48);
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${BLUE_PALE}, ${BLUE_TINT})`, border: `1px solid ${BLUE_TINT}`, boxShadow: `inset 0 1px 0 ${WHITE}` }}
    >
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(145deg, ${BLUE}, ${NAVY})` }} />
      {Cmp && <Cmp size={s} className="relative z-10 transition-colors duration-500 group-hover:!text-white" style={{ color: BLUE }} strokeWidth={2.1} />}
    </div>
  );
}

function SectionHead({ index, title, sub, right }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.6 }} variants={stagger} className="mb-7">
      <motion.div variants={fadeUp} className="flex items-center gap-3 mb-2">
        <span className="text-[11px] font-bold tracking-[.2em] px-2.5 py-1 rounded-full" style={{ background: BLUE_PALE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}>{index}</span>
        <motion.span
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }}
          transition={{ duration: .9, ease: EASE }} className="h-px flex-1 origin-left"
          style={{ background: `linear-gradient(90deg, ${BLUE_TINT}, transparent)` }}
        />
      </motion.div>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <motion.h2 variants={fadeUp} className="text-[1.5rem] sm:text-[1.85rem] font-bold leading-tight" style={{ color: NAVY, fontFamily: FONT_SERIF }}>{title}</motion.h2>
        {right && <motion.span variants={fadeUp} className="text-[11px] font-semibold uppercase tracking-[.14em]" style={{ color: SLATE }}>{right}</motion.span>}
      </div>
      {sub && <motion.p variants={fadeUp} className="mt-2.5 text-[13.5px] leading-relaxed max-w-2xl" style={{ color: SLATE }}>{sub}</motion.p>}
    </motion.div>
  );
}

function TiltCard({ children, className = '', style = {}, delay = 0, intensity = 6 }) {
  const ref = useRef(null);
  const mx = useMotionValue(0), my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [intensity, -intensity]), { stiffness: 220, damping: 20 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-intensity, intensity]), { stiffness: 220, damping: 20 });
  const onMove = useCallback((e) => {
    const el = ref.current; if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }, [mx, my]);
  return (
    <motion.div
      ref={ref} onMouseMove={onMove} onMouseLeave={() => { mx.set(0); my.set(0); }}
      initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} variants={fadeUp}
      transition={{ delay }} style={{ rotateX: rx, rotateY: ry, transformPerspective: 900, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function HeroIcon({ cfg, spx, spy }) {
  const x = useTransform(spx, (v) => v * -cfg.depth);
  const y = useTransform(spy, (v) => v * -cfg.depth);
  return (
    <motion.div className="absolute" style={{ top: cfg.top, [cfg.side]: cfg.pos, x, y }}>
      <motion.div animate={{ y: [0, -14, 0], rotate: [0, 5, 0] }} transition={{ duration: cfg.dur, delay: cfg.delay, repeat: Infinity, ease: 'easeInOut' }}>
        <Icon3D name={cfg.icon} size={cfg.size} />
      </motion.div>
    </motion.div>
  );
}

/* ---------- Steps: sticky selector + swapping editorial panel ---------- */
const STEP_AUTOPLAY_MS = 5000;

function StepShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const step = STEPS[active];
  const railRef = useRef(null);

  // Auto-advance to the next stage every 5s, looping back to the first.
  // Restarts whenever the active stage changes (manual click or autoplay)
  // or when the user hovers the panel (paused).
  useEffect(() => {
    if (paused) return undefined;
    const timer = setTimeout(() => {
      setActive((a) => (a + 1) % STEPS.length);
    }, STEP_AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [active, paused]);

  const goTo = (i) => {
    setActive(i);
    // On mobile the step list scrolls horizontally — keep the active chip
    // scrolled into view instead of leaving it off-screen after autoplay
    // advances or the user taps a prev/next arrow.
    const el = railRef.current?.children?.[i];
    el?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  };

  return (
    <div
      className="grid lg:grid-cols-[290px_1fr] gap-5 lg:gap-9 items-start min-w-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="lg:sticky lg:top-24 min-w-0">
        <div ref={railRef} className="hw-noscroll flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 -mx-4 px-4 sm:-mx-1 sm:px-1 snap-x snap-mandatory lg:snap-none">
          {STEPS.map((s, i) => {
            const on = i === active;
            return (
              <button
                key={s.n} onClick={() => goTo(i)}
                className="relative shrink-0 w-[168px] sm:w-[190px] lg:w-full text-left px-4 py-3.5 rounded-[16px] cursor-pointer transition-colors duration-300 overflow-hidden snap-start lg:snap-align-none"
                style={{ border: `1px solid ${on ? BLUE_TINT : `${GRAY}45`}` }}
              >
                {on && (
                  <motion.span
                    layoutId="hw-step-bg" className="absolute inset-0 rounded-[16px]"
                    style={{ background: BLUE_PALE }} transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-[11.5px] font-bold shrink-0 transition-all duration-300"
                    style={{ background: on ? BLUE : WHITE, color: on ? WHITE : SLATE, border: `1px solid ${on ? BLUE : `${GRAY}55`}` }}
                  >
                    {s.n}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold truncate" style={{ color: on ? NAVY : TEXT }}>{s.short}</span>
                    <span className="block text-[10.5px] font-medium mt-0.5" style={{ color: SLATE }}>{s.time}</span>
                  </span>
                </span>
                {/* autoplay progress rail — fills over 5s, restarts each cycle */}
                <span className="absolute left-3 right-3 bottom-1.5 h-[3px] rounded-full overflow-hidden z-10" style={{ background: on ? `${BLUE}22` : 'transparent' }}>
                  {on && (
                    <span
                      key={`${active}-${paused}`}
                      className="hw-autoprogress block h-full rounded-full"
                      style={{ background: BLUE, animationPlayState: paused ? 'paused' : 'running' }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 mt-4 lg:mt-5 px-1">
          <button
            onClick={() => goTo(active === 0 ? STEPS.length - 1 : active - 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer hover:bg-slate-50 shrink-0"
            style={{ borderColor: `${GRAY}55` }}
          >
            <ArrowRight className="w-4 h-4 rotate-180" style={{ color: NAVY }} />
          </button>
          <button
            onClick={() => goTo((active + 1) % STEPS.length)}
            className="w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer hover:bg-slate-50 shrink-0"
            style={{ borderColor: `${GRAY}55` }}
          >
            <ArrowRight className="w-4 h-4" style={{ color: NAVY }} />
          </button>
          <span className="ml-2 text-[12px] font-semibold tabular-nums" style={{ color: SLATE }}>{active + 1} / {STEPS.length}</span>
          <span className="ml-1 text-[10.5px] font-medium" style={{ color: paused ? BLUE : SLATE }}>
            {paused ? '· paused' : '· auto'}
          </span>
        </div>
      </div>

      <div className="relative rounded-[20px] sm:rounded-[26px] border overflow-hidden min-w-0" style={{ background: WHITE, borderColor: `${GRAY}50`, boxShadow: '0 22px 50px -30px rgba(19,34,97,.55)' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step.n} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .45, ease: EASE }}>
            <div className="relative h-[160px] xs:h-[190px] sm:h-[280px] overflow-hidden">
              <Pic src={step.img} icon={step.icon} rounded="rounded-none" className="absolute inset-0 w-full h-full" imgClass="hw-kb" />
              <span className="absolute inset-0" style={{ background: `linear-gradient(160deg, rgba(19,34,97,.72) 0%, rgba(19,34,97,.32) 45%, rgba(47,118,251,.5) 100%)` }} />
              <div className="hw-grid absolute inset-0 opacity-70" />

              <div className="absolute inset-0 p-4 sm:p-8 flex flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[36px] sm:text-[68px] font-bold leading-none" style={{ color: 'rgba(255,255,255,.3)', fontFamily: FONT_SERIF }}>{step.n}</span>
                  <span
                    className="inline-flex items-center gap-1.5 text-[10px] sm:text-[10.5px] font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full backdrop-blur-md shrink-0"
                    style={{ background: 'rgba(253,253,253,.92)', color: BLUE, border: `1px solid ${BLUE_TINT}` }}
                  >
                    <Clock className="w-3 h-3" /> {step.time}
                  </span>
                </div>
                <h3 className="text-[1.15rem] sm:text-[1.95rem] font-bold leading-tight max-w-md" style={{ color: WHITE, fontFamily: FONT_SERIF }}>{step.title}</h3>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <p className="text-[13.5px] sm:text-[14.5px] leading-[1.75] sm:leading-[1.85] mb-5 sm:mb-6" style={{ color: TEXT }}>{step.body}</p>
              <div className="grid sm:grid-cols-3 gap-2.5 sm:gap-3">
                {step.points.map((p, i) => (
                  <motion.div
                    key={p} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .15 + i * .09 }}
                    className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-[14px] border" style={{ background: BLUE_PALE, borderColor: `${GRAY}35` }}
                  >
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: BLUE }} />
                    <span className="text-[12.5px] font-semibold leading-snug" style={{ color: NAVY }}>{p}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- EMI calculator ---------- */
function EmiCalculator() {
  const [amount, setAmount] = useState(2500000);
  const [rate, setRate] = useState(8.35);
  const [years, setYears] = useState(20);

  const { emi, total, interest } = useMemo(() => {
    const p = amount, r = rate / 12 / 100, n = years * 12;
    const e = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const t = e * n;
    return { emi: Math.round(e), total: Math.round(t), interest: Math.round(t - p) };
  }, [amount, rate, years]);

  const fmt = (v) => '₹' + v.toLocaleString('en-IN');
  const principalPct = Math.round((amount / total) * 100);

  const Slider = ({ label, value, min, max, step, onChange, display, icon }) => (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-2.5">
        <span className="flex items-center gap-2 text-[12.5px] font-semibold" style={{ color: SLATE }}>
          <Icon name={icon} size={14} color={BLUE} />{label}
        </span>
        <span className="text-[14px] font-bold px-3 py-1 rounded-lg tabular-nums" style={{ background: BLUE_PALE, color: NAVY, border: `1px solid ${BLUE_TINT}` }}>{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))}
        className="hw-range w-full"
        style={{ background: `linear-gradient(90deg, ${BLUE} ${((value - min) / (max - min)) * 100}%, ${BLUE_TINT} ${((value - min) / (max - min)) * 100}%)` }}
      />
    </div>
  );

  return (
    <div className="grid lg:grid-cols-[1.1fr_.9fr] gap-5">
      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} variants={fadeUp}
        className="p-6 sm:p-7 rounded-[24px] border" style={{ background: WHITE, borderColor: `${GRAY}55`, boxShadow: '0 18px 40px -28px rgba(19,34,97,.5)' }}
      >
        <Slider label="Loan amount" icon="money" value={amount} min={100000} max={10000000} step={50000} onChange={setAmount} display={fmt(amount)} />
        <Slider label="Interest rate" icon="percent" value={rate} min={7} max={16} step={0.05} onChange={setRate} display={`${rate.toFixed(2)}%`} />
        <Slider label="Tenure" icon="calendar" value={years} min={1} max={30} step={1} onChange={setYears} display={`${years} ${years === 1 ? 'year' : 'years'}`} />
        <p className="text-[11.5px] leading-relaxed mt-6 pt-5 border-t" style={{ color: SLATE, borderColor: `${GRAY}35` }}>
          Indicative only. Your final rate and eligibility are decided by the associated bank after assessment.
        </p>
      </motion.div>

      <motion.div
        initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} variants={fadeUp} transition={{ delay: .1 }}
        className="relative overflow-hidden p-6 sm:p-7 rounded-[24px] flex flex-col justify-center"
        style={{ background: `linear-gradient(140deg, ${NAVY} 0%, #1b3583 60%, ${BLUE} 130%)` }}
      >
        <div className="hw-grid absolute inset-0 pointer-events-none" />
        <div className="hw-aurora absolute -top-20 -right-16 w-72 h-72 rounded-full blur-3xl pointer-events-none" style={{ background: BLUE_LIGHT, opacity: .22 }} />

        <div className="relative">
          <span className="text-[10.5px] font-bold uppercase tracking-[.16em]" style={{ color: BLUE_LIGHT }}>Monthly EMI</span>
          <motion.p
            key={emi} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-[2.5rem] sm:text-[2.9rem] font-bold leading-none mt-2 tabular-nums" style={{ color: WHITE, fontFamily: FONT_SERIF }}
          >
            {fmt(emi)}
          </motion.p>

          <div className="mt-6 h-2.5 rounded-full overflow-hidden flex" style={{ background: 'rgba(255,255,255,.16)' }}>
            <motion.span animate={{ width: `${principalPct}%` }} transition={{ duration: .5, ease: EASE }} className="h-full" style={{ background: BLUE_LIGHT }} />
            <span className="h-full flex-1" style={{ background: 'rgba(255,255,255,.28)' }} />
          </div>

          <div className="mt-5 space-y-3">
            {[
              { k: 'Principal', v: fmt(amount), c: BLUE_LIGHT },
              { k: 'Total interest', v: fmt(interest), c: 'rgba(255,255,255,.78)' },
              { k: 'Total payable', v: fmt(total), c: WHITE },
            ].map((r) => (
              <div key={r.k} className="flex items-center justify-between pb-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,.14)' }}>
                <span className="text-[12.5px] font-medium" style={{ color: BLUE_TINT }}>{r.k}</span>
                <span className="text-[14px] font-bold tabular-nums" style={{ color: r.c }}>{r.v}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ---------- FAQ ---------- */
function Faq({ item, index, open, onToggle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .4 }}
      transition={{ delay: index * .05, duration: .5, ease: EASE }}
      className="rounded-[18px] border overflow-hidden transition-colors duration-300"
      style={{ background: open ? BLUE_PALE : WHITE, borderColor: open ? BLUE_TINT : `${GRAY}55` }}
    >
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 text-left p-5 cursor-pointer">
        <span className="text-[14.5px] font-bold" style={{ color: NAVY }}>{item.q}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: .3 }} className="shrink-0">
          <ChevronDown className="w-5 h-5" style={{ color: BLUE }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: .35, ease: EASE }}>
            <p className="px-5 pb-5 text-[13.5px] leading-[1.8]" style={{ color: SLATE }}>{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------- After-submit timeline ---------- */
function AfterTimeline() {
  return (
    <div className="relative">
      {/* connecting line — desktop only, draws in on scroll */}
      <div
        className="hidden sm:block absolute h-[2px] overflow-hidden"
        style={{ top: 37, left: 'calc(100%/6)', right: 'calc(100%/6)', background: `${GRAY}30` }}
      >
        <motion.div
          initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .6 }}
          transition={{ duration: 1.2, ease: EASE, delay: .15 }}
          className="h-full w-full origin-left"
          style={{ background: `linear-gradient(90deg, ${BLUE}, ${BLUE_LIGHT})` }}
        />
      </div>

      <div className="grid sm:grid-cols-3 gap-6 sm:gap-5 relative">
        {AFTER.map((a, i) => (
          <motion.div
            key={a.title}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }}
            transition={{ delay: i * .16, duration: .6, ease: EASE }}
            className="group relative flex flex-col items-center text-center"
          >
            {/* node: pulsing icon */}
            <div className="relative mb-5" style={{ width: 76, height: 76 }}>
              <span
                className="hw-ping absolute inset-0 rounded-full"
                style={{ background: a.to, animationDelay: `${i * 0.5}s` }}
              />
              <span
                className="hw-ping absolute inset-0 rounded-full"
                style={{ background: a.to, animationDelay: `${i * 0.5 + 1.2}s` }}
              />
              <div
                className="relative w-full h-full rounded-full flex items-center justify-center border-[3px] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6"
                style={{
                  background: `linear-gradient(135deg, ${a.from}, ${a.to})`,
                  borderColor: WHITE,
                  boxShadow: '0 12px 28px -12px rgba(19,34,97,.45)',
                }}
              >
                <Icon name={a.icon} size={28} color={a.fg} />
              </div>
              <span
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border-2"
                style={{ background: NAVY, color: WHITE, borderColor: WHITE }}
              >
                {i + 1}
              </span>
            </div>

            {/* card */}
            <div
              className="hw-after-card w-full p-5 sm:p-6 rounded-[20px] border transition-all duration-400 group-hover:-translate-y-1.5"
              style={{ background: WHITE, borderColor: `${GRAY}40`, boxShadow: '0 16px 34px -28px rgba(19,34,97,.4)' }}
            >
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-[.14em] px-2.5 py-1 rounded-full mb-3"
                style={{ background: BLUE_PALE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}
              >
                {a.tag}
              </span>
              <h4 className="text-[1.05rem] font-bold leading-tight mb-2" style={{ color: NAVY, fontFamily: FONT_SERIF }}>{a.title}</h4>
              <p className="text-[12.5px] leading-relaxed" style={{ color: SLATE }}>{a.body}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ================= PAGE ================= */
export default function HowItWorks() {
  const navigate = useNavigate();
  const heroRef = useRef(null);
  const pageRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(0);

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: .3 });

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 60]);
  const heroFade = useTransform(scrollY, [0, 340], [1, 0]);

  const pmx = useMotionValue(0), pmy = useMotionValue(0);
  const spx = useSpring(pmx, { stiffness: 60, damping: 18 });
  const spy = useSpring(pmy, { stiffness: 60, damping: 18 });
  const onHeroMove = (e) => {
    const r = heroRef.current?.getBoundingClientRect(); if (!r) return;
    pmx.set((e.clientX - r.left) / r.width - .5);
    pmy.set((e.clientY - r.top) / r.height - .5);
  };

  return (
    <div
      ref={pageRef} className="relative w-full antialiased overflow-x-clip"
      style={{ background: BLUE_PALE, fontFamily: FONT_BODY, color: TEXT }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes hw-drift { 0%{transform:translate3d(0,0,0) scale(1);} 50%{transform:translate3d(4%,-6%,0) scale(1.12);} 100%{transform:translate3d(0,0,0) scale(1);} }
        @keyframes hw-shine { 0%{transform:translateX(-120%);} 60%,100%{transform:translateX(220%);} }
        @keyframes hw-shimmer { 100%{transform:translateX(100%);} }
        @keyframes hw-spin { to{transform:rotate(360deg);} }
        @keyframes hw-kenburns { 0%{transform:scale(1);} 100%{transform:scale(1.1);} }
        @keyframes hw-ping { 0%{transform:scale(.85); opacity:.55;} 75%,100%{transform:scale(1.75); opacity:0;} }
        @keyframes hw-fill { from{width:0%;} to{width:100%;} }
        .hw-autoprogress { width:0%; animation: hw-fill ${STEP_AUTOPLAY_MS}ms linear forwards; }
        .hw-aurora { animation: hw-drift 16s ease-in-out infinite; will-change: transform; }
        .hw-grid {
          background-image: linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 35%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 35%, transparent 100%);
        }
        .hw-shimmer { background: linear-gradient(90deg,transparent,rgba(255,255,255,.65),transparent); transform: translateX(-100%); animation: hw-shimmer 1.6s infinite; }
        .hw-ring { animation: hw-spin 28s linear infinite; }
        .hw-kb { animation: hw-kenburns 12s ease-out forwards; }
        .hw-ping { animation: hw-ping 2.6s cubic-bezier(0,0,.2,1) infinite; }
        .hw-btn-shine { position:relative; overflow:hidden; }
        .hw-btn-shine::after { content:''; position:absolute; top:0; bottom:0; width:45%;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent); transform:translateX(-140%); }
        .hw-btn-shine:hover::after { animation: hw-shine .9s ease forwards; }
        .hw-card:hover { border-color:${BLUE} !important;
          box-shadow: 0 0 0 1.5px ${BLUE}, 0 0 26px rgba(47,118,251,.32), 0 20px 40px -24px rgba(19,34,97,.5) !important; }
        .hw-after-card:hover { border-color:${BLUE_TINT} !important; box-shadow: 0 22px 44px -26px rgba(19,34,97,.55) !important; }
        .hw-range { -webkit-appearance:none; appearance:none; height:6px; border-radius:99px; outline:none; cursor:pointer; }
        .hw-range::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:20px; height:20px; border-radius:50%;
          background:${WHITE}; border:3px solid ${BLUE}; cursor:pointer; box-shadow:0 3px 10px rgba(19,34,97,.35); transition:transform .2s; }
        .hw-range::-webkit-slider-thumb:hover { transform:scale(1.18); }
        .hw-range::-moz-range-thumb { width:20px; height:20px; border-radius:50%; background:${WHITE};
          border:3px solid ${BLUE}; cursor:pointer; box-shadow:0 3px 10px rgba(19,34,97,.35); }
        .hw-noscroll { scroll-behavior: smooth; -webkit-overflow-scrolling: touch; }
        .hw-noscroll::-webkit-scrollbar { height:4px; }
        .hw-noscroll::-webkit-scrollbar-thumb { background:${BLUE_TINT}; border-radius:99px; }
        @media (min-width: 480px) {
          .xs\\:h-\\[190px\\] { height: 190px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hw-aurora,.hw-ring,.hw-shimmer,.hw-kb,.hw-ping { animation:none !important; }
        }
      `}</style>

      <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[60]" style={{ scaleX: progress, background: `linear-gradient(90deg, ${NAVY}, ${BLUE}, ${BLUE_LIGHT})` }} />

      {/* ============ HERO ============ */}
      <section
        ref={heroRef} onMouseMove={onHeroMove}
        className="relative w-full overflow-hidden flex items-center"
        style={{ minHeight: 'clamp(250px, 28vw, 325px)', background: `linear-gradient(118deg, ${NAVY} 0%, #1b3583 46%, ${BLUE} 100%)` }}
      >
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="hw-aurora absolute -top-40 -left-32 w-[30rem] h-[30rem] rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: .2 }} />
          <div className="hw-aurora absolute -bottom-48 -right-24 w-[26rem] h-[26rem] rounded-full blur-3xl" style={{ background: BLUE, opacity: .28, animationDelay: '-6s' }} />
        </div>
        <div className="hw-grid absolute inset-0 pointer-events-none" />
        <div className="absolute inset-0 hidden md:flex items-center justify-center pointer-events-none">
          <div className="hw-ring rounded-full" style={{ width: 360, height: 360, border: '1px dashed rgba(255,255,255,.15)' }} />
        </div>
        <div className="absolute inset-0 hidden lg:block pointer-events-none">
          {HERO_FLOAT.map((cfg, i) => <HeroIcon key={i} cfg={cfg} spx={spx} spy={spy} />)}
        </div>

        <motion.div style={{ y: heroY, opacity: heroFade }} className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 pt-3 pb-14 w-full flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .6, ease: EASE }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[11px] font-semibold mb-6 backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
          >
            <motion.span animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.15, 1] }} transition={{ duration: 3.4, repeat: Infinity }}>
              <Sparkles className="w-3.5 h-3.5" style={{ color: WHITE }} />
            </motion.span>
            <span>How It Works</span>
            <span className="w-1 h-1 rounded-full" style={{ background: BLUE_LIGHT }} />
            <span style={{ color: BLUE_TINT }}>Start to funded</span>
          </motion.div>

          <h1 className="text-[2.25rem] sm:text-[3.2rem] leading-[1.06] font-bold tracking-tight max-w-3xl" style={{ color: WHITE, fontFamily: FONT_SERIF }}>
            {['From application', 'to money in your account,', 'without the runaround.'].map((line, i) => (
              <motion.span
                key={line} initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: .75, delay: .12 + i * .14, ease: EASE }} className="block"
                style={i === 2 ? { color: BLUE_LIGHT } : undefined}
              >
                {line}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .6, ease: EASE }}
            className="mt-5 text-[15px] sm:text-[16px] leading-relaxed max-w-2xl" style={{ color: 'rgba(253,253,253,.8)' }}
          >
            No branch queues, no agents, no repeat paperwork. Here is exactly what happens after you click apply — and how long each stage really takes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .8, ease: EASE }}
            className="mt-5 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate('/schema')}
              className="hw-btn-shine group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12.5px] font-semibold cursor-pointer transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: WHITE, color: NAVY, boxShadow: '0 14px 34px -12px rgba(0,0,0,.55)' }}
            >
              <span>Start an application</span><ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => document.getElementById('steps')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12.5px] font-semibold cursor-pointer border backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
              style={{ color: WHITE, borderColor: 'rgba(255,255,255,.32)' }}
            >
              <PlayCircle className="w-4 h-4" /> Walk me through it
            </button>
          </motion.div>
        </motion.div>

        <svg className="absolute bottom-0 left-0 w-full pointer-events-none" style={{ height: 40, display: 'block' }} preserveAspectRatio="none" viewBox="0 0 1000 100">
          <path d="M0,42 C 90,60 140,72 210,70 S 340,38 410,36 S 540,66 610,64 S 740,34 840,38 S 950,56 1000,48 L1000,100 L0,100 Z" fill={BLUE_PALE} />
        </svg>
      </section>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-12 sm:py-16">
        <div className="mb-12 flex items-center gap-2 text-[13px] font-medium">
          <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-700 transition-colors cursor-pointer">Home</button>
          <MoveRight className="w-3.5 h-3.5 text-slate-300" />
          <span style={{ color: NAVY }} className="font-semibold">How it works</span>
        </div>

        {/* ---------- 01 · STEPS ---------- */}
        <section id="steps" className="mb-24 scroll-mt-24">
          <SectionHead index="01" title="The five stages" right="Pick Any Stage" sub="Select a stage on the left to see exactly what happens, what you do, and how long it takes." />
          <StepShowcase />
        </section>

        {/* ---------- 02 · DOCUMENTS ---------- */}
        <section id="documents" className="mb-24 scroll-mt-24">
          <SectionHead index="02" title="What you'll need" right="Document Checklist" sub="Gather these once. We store them securely and reuse them for every scheme you apply to." />

          <div className="grid lg:grid-cols-[.85fr_1.15fr] gap-6 items-start">
            <motion.div initial={{ opacity: 0, scale: .94 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true, amount: .3 }} transition={{ duration: .7, ease: EASE }} className="relative">
              <Pic src={IMG.docs} icon="file" ratio="4 / 5" rounded="rounded-[24px]" className="w-full shadow-2xl">
                <span className="absolute inset-0 pointer-events-none" style={{ background: `linear-gradient(180deg, rgba(19,34,97,.1) 40%, rgba(19,34,97,.82))` }} />
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-[16px] font-bold" style={{ color: WHITE, fontFamily: FONT_SERIF }}>Upload once, reuse forever</p>
                  <p className="text-[11.5px] mt-1.5" style={{ color: BLUE_TINT }}>Encrypted at rest and in transit</p>
                </div>
              </Pic>
              <motion.div
                animate={{ y: [0, -10, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5"
                style={{ background: WHITE, border: `1px solid ${BLUE_TINT}` }}
              >
                <ShieldCheck className="w-5 h-5" style={{ color: BLUE }} />
                <div>
                  <p className="text-[11.5px] font-bold leading-none" style={{ color: NAVY }}>Bank-grade</p>
                  <p className="text-[10px] mt-1" style={{ color: SLATE }}>encryption</p>
                </div>
              </motion.div>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4" style={{ perspective: 1100 }}>
              {DOCS.map((d, i) => (
                <TiltCard key={d.name} delay={i * .06} className="group">
                  <div className="hw-card h-full p-5 rounded-[20px] border transition-all duration-400" style={{ background: WHITE, borderColor: `${GRAY}55` }}>
                    <div className="flex items-start justify-between gap-3 mb-3.5">
                      <div className="transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                        <IconBadge name={d.icon} size={42} />
                      </div>
                      <span
                        className="text-[9.5px] font-bold px-2 py-1 rounded-full whitespace-nowrap"
                        style={{
                          background: d.req === 'Required' ? BLUE_PALE : `${GRAY}25`,
                          color: d.req === 'Required' ? BLUE : SLATE,
                          border: `1px solid ${d.req === 'Required' ? BLUE_TINT : `${GRAY}45`}`,
                        }}
                      >
                        {d.req}
                      </span>
                    </div>
                    <h4 className="text-[14.5px] font-bold mb-1" style={{ color: NAVY }}>{d.name}</h4>
                    <p className="text-[12px] leading-relaxed" style={{ color: SLATE }}>{d.note}</p>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- 03 · AFTER SUBMIT ---------- */}
        <section id="after" className="mb-24 scroll-mt-24">
          <SectionHead index="03" title="After you hit submit" right="Behind the Scenes" sub="What the bank is doing while you wait, and how you stay in the loop throughout." />
          <AfterTimeline />
        </section>

        {/* ---------- 04 · EMI CALCULATOR ---------- */}
        <section id="calculator" className="mb-24 scroll-mt-24">
          <SectionHead index="04" title="Estimate your EMI" right="Plan Ahead" sub="Move the sliders to see what a loan would cost you each month, before you apply." />
          <EmiCalculator />
        </section>

        {/* ---------- 05 · FAQ ---------- */}
        <section id="faq" className="scroll-mt-24">
          <SectionHead index="05" title="Common questions" right="Straight Answers" />
          <div className="space-y-3">
            {FAQS.map((f, i) => <Faq key={f.q} item={f} index={i} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />)}
          </div>
        </section>
      </div>

      {/* ============ CTA ============ */}
      <motion.section
        initial="hidden" whileInView="show" viewport={{ once: true, amount: .3 }} variants={fadeUp}
        className="relative overflow-hidden" style={{ background: `linear-gradient(125deg, ${NAVY} 0%, #1b3583 55%, ${BLUE} 130%)` }}
      >
        <Pic src={IMG.bank} icon="building" rounded="rounded-none" className="absolute inset-0 w-full h-full opacity-[.14]" />
        <div className="hw-grid absolute inset-0 pointer-events-none" />
        <div className="hw-aurora absolute -top-32 -right-24 w-[22rem] h-[22rem] rounded-full blur-3xl pointer-events-none" style={{ background: BLUE_LIGHT, opacity: .18 }} />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,12,36,.45))' }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ background: 'rgba(137,182,248,.18)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 py-12 text-center flex flex-col items-center">
          <span
            className="text-[9.5px] font-bold uppercase tracking-[.18em] px-2.5 py-1 rounded-full inline-block mb-3.5 backdrop-blur-md border"
            style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.2)', color: BLUE_LIGHT }}
          >
            Ready When You Are
          </span>
          <h2 className="text-[1.5rem] sm:text-[1.95rem] font-bold leading-[1.15] max-w-xl" style={{ color: WHITE, fontFamily: FONT_SERIF }}>
            Stage one takes <span style={{ color: BLUE_LIGHT }}>two minutes.</span>
          </h2>
          <p className="mt-3 text-[12.5px] leading-relaxed max-w-md" style={{ color: BLUE_TINT }}>
            Create your account, see every scheme you qualify for, and decide later. Nothing is committed until you choose to submit.
          </p>

          <div className="mt-6 flex flex-wrap gap-3 items-center justify-center">
            <button
              onClick={() => navigate('/schema')}
              className="hw-btn-shine group px-5 py-2.5 font-semibold text-[12.5px] text-white rounded-full transition-all hover:-translate-y-1 active:scale-95 cursor-pointer flex items-center gap-2"
              style={{ background: BLUE, boxShadow: '0 18px 40px -14px rgba(47,118,251,.9)' }}
            >
              <span>Explore Schemes</span><ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => navigate('/about-us')}
              className="px-5 py-2.5 font-semibold text-[12.5px] text-white rounded-full border backdrop-blur-md transition-all hover:bg-white/10 hover:-translate-y-1 cursor-pointer"
              style={{ borderColor: 'rgba(255,255,255,.3)' }}
            >
              About LoanMela
            </button>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-5">
            {[
              { i: 'shield', t: 'RBI Regulated' },
              { i: 'clock', t: '48-Hour Answers' },
              { i: 'file', t: 'Upload Once' },
              { i: 'users', t: 'Open to All' },
            ].map((f) => (
              <span key={f.t} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'rgba(253,253,253,.82)' }}>
                <Icon name={f.i} size={13} color={BLUE_LIGHT} />{f.t}
              </span>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}