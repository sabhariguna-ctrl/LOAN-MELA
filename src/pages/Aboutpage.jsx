import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useInView, useScroll, useSpring } from 'framer-motion';
import {
  CheckCircle2, ArrowRight, Sparkles, Lock, X, Info, ShieldCheck, Building2, FileText,
  Award, Users, Clock, Layers, BadgeCheck, Zap, User, Wallet, Quote, MoveRight, Home,
  Briefcase, GraduationCap, Car, ImageIcon, PlayCircle,
} from 'lucide-react';
import { getSession } from '../utils/auth';

/* ================= BRAND TOKENS ================= */
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
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ================= PAGE IMAGES =================
   Header uses only 3D PNG icons. Normal images are used in content sections. */
const U = (id, width = 1000) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=85`;

const IMG = {
  whoMain: U('1600880292203-757bb62b4baf', 1000),
  whoSub: U('1450101499163-c8848c66ca85', 700),
  bankBanner: U('1541354329998-f4d9a9f9297f', 1400),
  appMock: U('1512941937669-90a1b58e7e9c', 600),
  useHome: U('1560518883-ce09059eeffa', 1000),
  useBiz: U('1521737711867-e3b97375f902', 900),
  useEdu: U('1523240795612-9a054b0db644', 900),
  useAuto: U('1503376780353-7e6692767b70', 1000),
};

/* ================= 3D ICON FILE PATHS =================
   Keep these images inside public/images/
   public/images/shield.png, file.png, award.png, lock.png, layers.png, building.png */
const ICONS3D = {
  shield: '/images/shield.png', building: '/images/building.png', lock: '/images/lock.png',
  file: '/images/file.png', award: '/images/award.png', users: '/images/users.png',
  clock: '/images/clock.png', layers: '/images/layers.png', wallet: '/images/wallet.png',
};

/* ================= LUCIDE ICON MAP ================= */
const ICONS = {
  shield: ShieldCheck, building: Building2, lock: Lock, file: FileText, award: Award,
  users: Users, clock: Clock, layers: Layers, badge: BadgeCheck, bolt: Zap, you: User,
  wallet: Wallet, home: Home, biz: Briefcase, edu: GraduationCap, auto: Car,
};

/* ================= HERO 3D ICONS ================= */
const HERO_3D_ICONS = [
  { icon: 'shield', fallback: 'shield', top: '16%', side: 'left', pos: '7%', size: 54, delay: 0, duration: 4.8 },
  { icon: 'file', fallback: 'file', top: '62%', side: 'left', pos: '16%', size: 42, delay: 0.7, duration: 5.1 },
  { icon: 'award', fallback: 'award', top: '32%', side: 'left', pos: '26%', size: 36, delay: 1.1, duration: 4.7 },
  { icon: 'building', fallback: 'building', top: '15%', side: 'right', pos: '7%', size: 53, delay: 0.4, duration: 4.7 },
  { icon: 'lock', fallback: 'lock', top: '61%', side: 'right', pos: '16%', size: 42, delay: 1, duration: 5 },
  { icon: 'layers', fallback: 'layers', top: '32%', side: 'right', pos: '26%', size: 36, delay: 1.4, duration: 4.9 },
];

/* ================= CONTENT DATA ================= */
const HIGHLIGHTS = [
  { label: 'One unified application', detail: 'Apply without completing the same information repeatedly.', icon: 'layers' },
  { label: 'Documents uploaded once', detail: 'Keep your paperwork organised in one secure place.', icon: 'file' },
  { label: 'Multiple schemes available', detail: 'Explore suitable options from our associated banks.', icon: 'badge' },
  { label: 'Direct bank lending', detail: 'Funds are disbursed directly to your account.', icon: 'shield' },
];

const STATS = [
  { target: 15, suffix: '+', label: 'Loan schemes, one application', icon: 'layers', tag: 'Coverage', progress: 85 },
  { target: 48, suffix: 'hr', label: 'Typical bank response time', icon: 'clock', tag: 'Speed', progress: 95 },
  { target: 1, suffix: '', label: 'Document set uploaded once', icon: 'file', tag: 'Simplicity', progress: 100 },
  { target: 100, suffix: '%', label: 'Open access with no hidden score', icon: 'shield', tag: 'Access', progress: 100 },
];

const STANDS = [
  { title: 'Easy to apply', body: 'One simple form, no branch visits, and no repeat paperwork. Apply from your phone in minutes.', icon: 'bolt', tag: 'No Paperwork' },
  { title: 'Quick approval', body: 'Straight answers in as little as 48 hours — without waiting weeks to hear back.', icon: 'clock', tag: 'Fast Track' },
  { title: 'Open to all', body: 'No hidden eligibility score. Every scheme you see is one you can genuinely explore.', icon: 'users', tag: 'No Gatekeeping' },
  { title: 'Backed by associated banks', body: 'Every loan is issued directly by a licensed, RBI-regulated banking partner, with no middlemen.', icon: 'shield', tag: 'RBI Regulated' },
];

const USE_CASES = [
  { img: IMG.useHome, icon: 'home', title: 'Fixing up the house', caption: 'Home Improvement / Repair Loan', filterGroup: 'Housing', span: 'sm:col-span-2 sm:row-span-2' },
  { img: IMG.useBiz, icon: 'biz', title: 'A growing shop', caption: 'Business / MSME Loan', filterGroup: 'Business', span: '' },
  { img: IMG.useEdu, icon: 'edu', title: 'Continuing an education', caption: 'Education / Skill Development Loan', filterGroup: 'Education', span: '' },
  { img: IMG.useAuto, icon: 'auto', title: 'The first vehicle', caption: 'Vehicle / Commercial Vehicle Loan', filterGroup: 'Automotive', span: 'sm:col-span-2' },
];

// LoanMela has just launched, so there are no real borrower stories yet.
// This replaces the earlier placeholder testimonials with what's actually
// true today — the bank backing and how the process is designed to work.
const LAUNCH_POINTS = [
  { title: 'Newly launched, bank-backed', body: 'LoanMela is a new platform. Every scheme here is issued directly by one of our associated banks, not by us — so the lending decision sits with a licensed, RBI-regulated bank from day one.', icon: 'shield' },
  { title: 'One form, reused everywhere', body: 'Fill your details once and use them across every scheme you want to compare, instead of repeating paperwork for each loan type.', icon: 'file' },
  { title: 'Clear answers, no runaround', body: 'You get a straight yes or no, with a real reason if it is a no — not a black-box score you can never see.', icon: 'clock' },
];

const SAMPLE_SCHEMES = [
  { name: 'Cent Home Loan', category: 'Housing', rate: '8.35% p.a.', maxAmount: 'Up to ₹5 Cr', tenure: '30 Years', tag: 'Most Popular', img: IMG.useHome, icon: 'home' },
  { name: 'Cent MSME Enterprise Credit', category: 'Business', rate: '9.10% p.a.', maxAmount: 'Up to ₹2 Cr', tenure: '10 Years', tag: 'Fast Track', img: IMG.useBiz, icon: 'biz' },
  { name: 'Cent Vidyarthi Education', category: 'Education', rate: '8.55% p.a.', maxAmount: 'Up to ₹40 Lakhs', tenure: '15 Years', tag: 'Zero Collateral', img: IMG.useEdu, icon: 'edu' },
  { name: 'Cent Vehicle Loan', category: 'Auto', rate: '8.70% p.a.', maxAmount: 'Up to 90% On-road', tenure: '7 Years', tag: 'Instant Pre-approval', img: IMG.useAuto, icon: 'auto' },
];

/* ================= SMALL COMPONENTS ================= */

function Icon({ name, size = 16, color = NAVY, strokeWidth = 2.2, className = '' }) {
  const IconComponent = ICONS[name];
  if (!IconComponent) return null;
  return <IconComponent size={size} className={className} style={{ color }} strokeWidth={strokeWidth} />;
}

function Icon3D({ name, fallback = 'shield', size = 44 }) {
  const [failed, setFailed] = useState(false);
  const src = ICONS3D[name];
  const Fallback = ICONS[fallback] || Sparkles;

  if (!src || failed) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl backdrop-blur-md"
        style={{ width: size, height: size, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)', boxShadow: '0 12px 28px rgba(19,34,97,.32)' }}
      >
        <Fallback size={Math.round(size * 0.47)} style={{ color: WHITE }} strokeWidth={2} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className="select-none object-contain"
      style={{ width: size, height: size, filter: 'drop-shadow(0 10px 16px rgba(19,34,97,.38))' }}
    />
  );
}

function IconBadge({ name, size = 42 }) {
  const IconComponent = ICONS[name];
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-2xl"
      style={{ width: size, height: size, background: `linear-gradient(145deg, ${BLUE_PALE}, ${BLUE_TINT})`, border: `1px solid ${BLUE_TINT}` }}
    >
      {IconComponent && <IconComponent size={Math.round(size * 0.48)} style={{ color: BLUE }} strokeWidth={2.15} />}
    </div>
  );
}

function Pic({ src, alt = '', className = '', imgClass = '', icon = 'layers', rounded = 'rounded-2xl', ratio, children, style = {} }) {
  const [state, setState] = useState('loading');
  const Fallback = ICONS[icon] || ImageIcon;

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={{ ...(ratio ? { aspectRatio: ratio } : {}), ...style }}>
      {state !== 'ok' && (
        <div className="absolute inset-0 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${BLUE_PALE}, ${BLUE_TINT}, ${BLUE_PALE})` }}>
          <span className="lm-shimmer absolute inset-0" />
          <Fallback className="relative" size={28} style={{ color: BLUE_LIGHT }} strokeWidth={1.6} />
        </div>
      )}
      {state !== 'fail' && src && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          draggable={false}
          onLoad={() => setState('ok')}
          onError={() => setState('fail')}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${state === 'ok' ? 'opacity-100' : 'opacity-0'} ${imgClass}`}
        />
      )}
      {children}
    </div>
  );
}

function SectionHead({ index, title, sub, right }) {
  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }} variants={stagger} className="mb-7">
      <motion.div variants={fadeUp} className="mb-2 flex items-center gap-3">
        <span className="rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.18em]" style={{ background: BLUE_PALE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}>
          {index}
        </span>
        <span className="h-px flex-1" style={{ background: `linear-gradient(90deg, ${BLUE_TINT}, transparent)` }} />
      </motion.div>

      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <motion.h2 variants={fadeUp} className="text-[1.8rem] font-bold leading-tight sm:text-[2.15rem]" style={{ color: NAVY, fontFamily: FONT_SERIF }}>
          {title}
        </motion.h2>
        {right && (
          <motion.span variants={fadeUp} className="text-[10.5px] font-bold uppercase tracking-[0.14em]" style={{ color: SLATE }}>
            {right}
          </motion.span>
        )}
      </div>

      {sub && (
        <motion.p variants={fadeUp} className="mt-3 max-w-2xl text-[14px] leading-relaxed" style={{ color: SLATE }}>
          {sub}
        </motion.p>
      )}
    </motion.div>
  );
}

function StatNumber({ target, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const duration = 1200;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-[2.35rem] font-bold leading-none tracking-tight" style={{ color: NAVY, fontFamily: FONT_SERIF }}>
      {value}
      <span className="ml-0.5 text-[1.15rem] align-super" style={{ color: BLUE }}>{suffix}</span>
    </span>
  );
}

/* Blue side panel fills complete metric card height */
function MetricCard({ stat, index }) {
  const MetricIcon = ICONS[stat.icon] || BadgeCheck;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -6 }}
      className="group relative min-h-[168px] overflow-hidden rounded-[22px] border transition-all duration-500 hover:shadow-xl"
      style={{ background: WHITE, borderColor: `${GRAY}70`, boxShadow: '0 14px 34px -24px rgba(19,34,97,.45)' }}
    >
      <div className="absolute inset-y-0 left-0 w-[84px] overflow-hidden" style={{ background: `linear-gradient(160deg, ${BLUE}, ${NAVY})` }}>
        <span className="absolute left-3 top-3 text-[10px] font-bold tracking-wider" style={{ color: 'rgba(255,255,255,.58)' }}>
          0{index + 1}
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl" style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.20)' }}>
            <MetricIcon className="h-5 w-5" style={{ color: WHITE }} />
          </div>
        </div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full" style={{ background: 'rgba(255,255,255,.08)' }} />
      </div>

      <div className="relative ml-[84px] flex min-h-[168px] flex-col justify-center p-5">
        <span className="inline-flex self-start rounded-full px-2.5 py-1 text-[9.5px] font-bold" style={{ background: BLUE_PALE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}>
          {stat.tag}
        </span>
        <div className="mt-3">
          <StatNumber target={stat.target} suffix={stat.suffix} />
        </div>
        <p className="mt-2 max-w-[190px] text-[12.5px] font-medium leading-snug" style={{ color: TEXT }}>{stat.label}</p>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full" style={{ background: BLUE_TINT }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${stat.progress}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.08 + 0.15, ease: EASE }}
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${BLUE}, ${BLUE_LIGHT})` }}
          />
        </div>
      </div>
    </motion.article>
  );
}

function PromiseCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: EASE }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-[22px] border p-6 transition-all duration-500 hover:shadow-xl"
      style={{ background: WHITE, borderColor: `${GRAY}60` }}
    >
      <div
        className="absolute right-0 top-0 h-24 w-24 rounded-bl-[90px] transition-all duration-500 group-hover:h-full group-hover:w-full group-hover:rounded-none"
        style={{ background: BLUE_PALE, opacity: 0.8 }}
      />
      <div className="relative">
        <div className="mb-4 flex items-start justify-between gap-3">
          <IconBadge name={item.icon} size={46} />
          <span className="rounded-full px-2.5 py-1 text-[9.5px] font-bold" style={{ background: WHITE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}>
            {item.tag}
          </span>
        </div>
        <h3 className="text-[1.1rem] font-bold" style={{ color: NAVY, fontFamily: FONT_SERIF }}>{item.title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed" style={{ color: SLATE }}>{item.body}</p>
        <div className="mt-5 h-1.5 rounded-full" style={{ background: `linear-gradient(90deg, ${BLUE}, ${BLUE_LIGHT})` }} />
      </div>
    </motion.article>
  );
}

/* ================= ABOUT PAGE ================= */
export default function AboutUs() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [session, setSession] = useState(() => getSession());

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 });

  useEffect(() => {
    const syncSession = () => setSession(getSession());
    window.addEventListener('authchange', syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener('authchange', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  return (
    <div
      ref={pageRef}
      className="relative w-full overflow-x-clip antialiased"
      style={{
        /* Changed from pure WHITE to a light blue tint (BLUE_PALE),
           matching the same fix applied in Loanschema.jsx — the white
           Footer sitting directly below otherwise blends into this
           page with no visible seam. */
        background: BLUE_PALE, color: TEXT, fontFamily: FONT_BODY,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes lm-drift { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(4%, -6%, 0) scale(1.12); } }
        @keyframes lm-shimmer { 100% { transform: translateX(100%); } }
        @keyframes lm-spin { to { transform: rotate(360deg); } }
        @keyframes lm-shine { 0% { transform: translateX(-130%); } 100% { transform: translateX(230%); } }
        @keyframes lm-kenburns { 0% { transform: scale(1) translate(0, 0); } 100% { transform: scale(1.12) translate(-1.5%, -1.5%); } }
        .lm-aurora { animation: lm-drift 16s ease-in-out infinite; }
        .lm-grid {
          background-image: linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 35%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 35%, transparent 100%);
        }
        .lm-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,.65), transparent); transform: translateX(-100%); animation: lm-shimmer 1.6s infinite; }
        .lm-ring { animation: lm-spin 26s linear infinite; }
        .lm-ring-reverse { animation: lm-spin 38s linear infinite reverse; }
        .lm-btn-shine { position: relative; overflow: hidden; }
        .lm-btn-shine::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 45%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
          transform: translateX(-140%);
        }
        .lm-btn-shine:hover::after { animation: lm-shine .9s ease forwards; }
        .lm-kenburns img { animation: lm-kenburns 9s ease-in-out infinite alternate; }
        .lm-scrollbar::-webkit-scrollbar { width: 8px; }
        .lm-scrollbar::-webkit-scrollbar-thumb { background: ${BLUE_TINT}; border-radius: 99px; }
        @media (prefers-reduced-motion: reduce) {
          .lm-aurora, .lm-ring, .lm-ring-reverse, .lm-shimmer, .lm-kenburns img { animation: none !important; }
        }
      `}</style>

      {/* Top page progress line */}
      <motion.div
        className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left"
        style={{ scaleX: progress, background: `linear-gradient(90deg, ${NAVY}, ${BLUE}, ${BLUE_LIGHT})` }}
      />

      {/* ================= HERO — WAVE + 3D ICONS ================= */}
      <section
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{ minHeight: 'clamp(250px, 28vw, 325px)', background: `linear-gradient(118deg, ${NAVY} 0%, #1b3583 48%, ${BLUE} 100%)`, borderBottom: 'none' }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="lm-aurora absolute -left-32 -top-40 h-[32rem] w-[32rem] rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: 0.2 }} />
          <div className="lm-aurora absolute -bottom-40 -right-24 h-[30rem] w-[30rem] rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.28, animationDelay: '-6s' }} />
        </div>

        <div className="lm-grid absolute inset-0 pointer-events-none" />

        {/* Decorative rings */}
        <div className="absolute inset-0 hidden items-center justify-center pointer-events-none md:flex">
          <div className="lm-ring rounded-full" style={{ width: 245, height: 245, border: '1px dashed rgba(255,255,255,.15)' }} />
          <div className="lm-ring-reverse absolute rounded-full" style={{ width: 390, height: 390, border: '1px dashed rgba(255,255,255,.09)' }} />
        </div>

        {/* Floating 3D icons - no photo cards */}
        <div className="absolute inset-0 hidden pointer-events-none lg:block">
          {HERO_3D_ICONS.map(({ icon, fallback, top, side, pos, size, delay, duration }, index) => (
            <motion.div
              key={`${icon}-${index}`}
              className="absolute"
              style={{ top, [side]: pos }}
              animate={{ y: [0, -11, 0], rotate: [0, 4, 0] }}
              transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon3D name={icon} fallback={fallback} size={size} />
            </motion.div>
          ))}
        </div>

        {/* Hero wording */}
        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-14 pt-3 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
          >
            <Sparkles className="h-3 w-3" />
            <span>About LoanMela</span>
            <span className="h-1 w-1 rounded-full" style={{ background: BLUE_LIGHT }} />
            <span style={{ color: BLUE_TINT }}>Built for simpler borrowing</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.65, delay: 0.12, ease: EASE }}
            className="max-w-3xl text-[2.25rem] font-bold leading-[1.06] tracking-tight sm:text-[3.2rem]"
            style={{ color: WHITE, fontFamily: FONT_SERIF }}
          >
            <span className="block">Loans made simpler.</span>
            <span className="block" style={{ color: BLUE_LIGHT }}>Answers made faster.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease: EASE }}
            className="mt-5 max-w-2xl text-[15px] leading-relaxed sm:text-[16px]"
            style={{ color: 'rgba(253,253,253,.82)' }}
          >
            One application connects you to loan schemes from our associated banks. No branch visits, repeated documents, or hidden eligibility scores.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.58, ease: EASE }}
            className="mt-3 flex flex-wrap items-center justify-center gap-3"
          >
            <button
              onClick={() => navigate('/how-it-works')}
              className="lm-btn-shine group inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold transition-all hover:-translate-y-0.5 active:scale-95"
              style={{ background: WHITE, color: NAVY, boxShadow: '0 12px 30px -12px rgba(0,0,0,.50)' }}
            >
              <span>See how it works</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate('/schema')}
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold text-white backdrop-blur-md transition-all hover:bg-white/10 active:scale-95"
              style={{ borderColor: 'rgba(255,255,255,.30)' }}
            >
              <PlayCircle className="h-3.5 w-3.5" />
              Explore schemes
            </button>
          </motion.div>
        </div>

        {/* WAVE BOTTOM - NO STRAIGHT LINE */}
        <svg className="absolute left-0 w-full pointer-events-none" style={{ height: '44px', display: 'block', bottom: '-1px' }} preserveAspectRatio="none" viewBox="0 0 1000 100">
          <path
            d="M0,43 C90,61 145,75 220,71 S345,38 420,37 S545,68 620,65 S755,35 845,39 S950,58 1000,50 L1000,100 L0,100 Z"
            fill={BLUE_PALE}
            stroke="none"
          />
        </svg>
      </section>

      {/* No running banner here */}

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
        {/* Breadcrumb */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-12 flex items-center gap-2 text-[13px] font-medium">
          <button onClick={() => navigate('/')} className="cursor-pointer text-slate-500 transition-colors hover:text-slate-800">
            Home
          </button>
          <MoveRight className="h-3.5 w-3.5 text-slate-300" />
          <span className="font-semibold" style={{ color: NAVY }}>About Us</span>
        </motion.div>

        {/* ================= WHO WE ARE ================= */}
        <section id="who" className="mb-24 scroll-mt-24">
          <SectionHead index="01" title="Who we are" right="Our Story" />

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
            <div>
              <motion.div
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="relative mb-6 overflow-hidden rounded-[22px] border p-6 sm:p-7"
                style={{ background: `linear-gradient(135deg, ${BLUE_PALE}, ${WHITE} 60%, ${BLUE_PALE})`, borderColor: `${GRAY}45` }}
              >
                <span className="absolute bottom-0 left-0 top-0 w-1.5" style={{ background: `linear-gradient(180deg, ${BLUE}, ${BLUE_LIGHT})` }} />
                <Quote className="absolute -right-1 -top-3 h-20 w-20 opacity-[.07]" style={{ color: NAVY }} />
                <p className="relative text-[16px] font-medium leading-[1.75] sm:text-[18px]" style={{ color: TEXT, fontFamily: FONT_SERIF }}>
                  "Getting a loan should not mean branch visits, repeat paperwork, and weeks of silence. LoanMela is one simple application that gets you a straight answer, fast."
                </p>
              </motion.div>

              <motion.p
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeUp}
                className="text-[15px] leading-[1.85]"
                style={{ color: TEXT }}
              >
                Fill one form, upload your documents once, and apply across schemes offered by our associated banks — from home loans to business credit. No hidden score and no unnecessary loops.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.75, ease: EASE }}
              className="relative h-[340px] sm:h-[395px]"
            >
              <div className="absolute bottom-10 left-14 right-2 top-6 rounded-[28px] border-2" style={{ borderColor: BLUE_TINT }} />

              <div className="lm-kenburns absolute left-0 top-0 h-[68%] w-[74%] overflow-hidden rounded-[22px] shadow-2xl">
                <Pic src={IMG.whoMain} alt="Person applying for loan online" icon="you" rounded="rounded-[22px]" className="h-full w-full" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 55%, rgba(19,34,97,.62))` }} />
                <span className="absolute bottom-3 left-4 text-[11px] font-semibold" style={{ color: WHITE }}>
                  Apply from home · no branch visit
                </span>
              </div>

              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-4 right-0 h-[53%] w-[58%] overflow-hidden rounded-[22px] border-4 shadow-2xl"
                style={{ borderColor: WHITE }}
              >
                <Pic src={IMG.whoSub} alt="Loan documents" icon="file" rounded="rounded-[18px]" className="h-full w-full" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 180 }}
                animate={{ y: [0, -7, 0] }}
                className="absolute bottom-1 left-1 flex items-center gap-3 rounded-2xl px-4 py-3 shadow-xl"
                style={{ background: 'rgba(253,253,253,.94)', border: `1px solid ${BLUE_TINT}` }}
              >
                <IconBadge name="clock" size={38} />
                <div>
                  <p className="text-[15px] font-bold leading-none" style={{ color: NAVY, fontFamily: FONT_SERIF }}>48 hrs</p>
                  <p className="mt-1 text-[10px] font-medium" style={{ color: SLATE }}>Typical response time</p>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* No flow chart - normal cards */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {HIGHLIGHTS.map((item) => (
              <motion.article
                key={item.label}
                variants={fadeUp}
                whileHover={{ y: -5 }}
                className="group rounded-[20px] border p-5 transition-all duration-500 hover:shadow-xl"
                style={{ background: WHITE, borderColor: `${GRAY}55` }}
              >
                <IconBadge name={item.icon} size={42} />
                <h3 className="mt-4 text-[14px] font-bold" style={{ color: NAVY }}>{item.label}</h3>
                <p className="mt-2 text-[11.5px] leading-relaxed" style={{ color: SLATE }}>{item.detail}</p>
              </motion.article>
            ))}
          </motion.div>
        </section>

        {/* ================= WHY LOANMELA ================= */}
        <section id="numbers" className="mb-24 scroll-mt-24">
          <SectionHead index="02" title="Why LoanMela" right="Key Platform Metrics" sub="A simpler way to discover schemes, understand requirements, and apply with clarity." />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {STATS.map((stat, index) => <MetricCard key={stat.label} stat={stat} index={index} />)}
          </div>
        </section>

        {/* ================= IMAGE GALLERY ================= */}
        <section id="gallery" className="mb-24 scroll-mt-24">
          <SectionHead index="03" title="What people apply for" right="Real Outcomes" sub="A few common goals people bring to LoanMela when they begin their application." />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 sm:auto-rows-[168px]">
            {USE_CASES.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.08, duration: 0.55, ease: EASE }}
                whileHover={{ y: -6 }}
                onClick={() => navigate('/schema', { state: { filterGroup: item.filterGroup } })}
                className={`group relative min-h-[190px] cursor-pointer overflow-hidden rounded-[22px] ${item.span}`}
                style={{ boxShadow: '0 18px 40px -22px rgba(19,34,97,.60)' }}
              >
                <Pic
                  src={item.img}
                  alt={item.title}
                  icon={item.icon}
                  rounded="rounded-[22px]"
                  className="absolute inset-0 h-full w-full"
                  imgClass="transition-transform duration-[1200ms] group-hover:scale-110"
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(19,34,97,.10), rgba(19,34,97,.84))` }} />
                <div
                  className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl backdrop-blur-md"
                  style={{ background: 'rgba(255,255,255,.16)', border: '1px solid rgba(255,255,255,.30)' }}
                >
                  <Icon name={item.icon} size={19} color={WHITE} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-[17px] font-bold" style={{ color: WHITE, fontFamily: FONT_SERIF }}>{item.title}</h3>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: BLUE_TINT }}>{item.caption}</p>
                  <span
                    className="mt-2 inline-flex -translate-y-1 items-center gap-1 text-[11px] font-semibold opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
                    style={{ color: WHITE }}
                  >
                    View scheme
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* ================= BANKING PARTNER ================= */}
        <section id="partner" className="mb-24 scroll-mt-24">
          <SectionHead
            index="04"
            title="Our banking partners"
            right="Direct Lending"
            sub="Every scheme shown on LoanMela is offered by a trusted, RBI-regulated bank from our growing network of associated banks."
          />

          <div className="mb-8 flex flex-wrap justify-center gap-3">
            {[
              { icon: 'shield', title: 'RBI regulated', text: 'Trusted associated banks' },
              { icon: 'building', title: 'Direct lending', text: 'No third-party money transfer' },
              { icon: 'wallet', title: 'Direct disbursal', text: 'Funds reach your account' },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3 rounded-full border px-4 py-2.5" style={{ background: WHITE, borderColor: BLUE_TINT }}>
                <IconBadge name={item.icon} size={34} />
                <div>
                  <p className="text-[11.5px] font-bold leading-tight" style={{ color: NAVY }}>{item.title}</p>
                  <p className="mt-0.5 text-[9.5px]" style={{ color: SLATE }}>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -5 }}
            className="group overflow-hidden rounded-[24px] border transition-all duration-500 hover:shadow-2xl"
            style={{ background: WHITE, borderColor: GRAY, boxShadow: '0 20px 46px -24px rgba(19,34,97,.45)' }}
          >
            <div className="relative h-[205px] overflow-hidden sm:h-[235px]">
              <Pic
                src={IMG.bankBanner}
                alt="Central Bank of India"
                icon="building"
                rounded="rounded-none"
                className="absolute inset-0 h-full w-full"
                imgClass="transition-transform duration-[1400ms] group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, rgba(19,34,97,.90), rgba(19,34,97,.52), rgba(47,118,251,.44))` }} />
              <div className="absolute inset-0 flex items-end justify-between gap-4 p-6 sm:p-7">
                <div className="flex items-end gap-4">
                  <div
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-xl"
                    style={{ background: 'rgba(253,253,253,.94)', border: `1px solid ${BLUE_TINT}` }}
                  >
                    <Building2 className="h-6 w-6" style={{ color: BLUE }} />
                  </div>
                  <div>
                    <h3 className="text-[1.4rem] font-bold leading-tight" style={{ color: WHITE, fontFamily: FONT_SERIF }}>Central Bank of India</h3>
                    <p className="mt-1 text-[11px] font-medium" style={{ color: BLUE_TINT }}>Founding associated bank · Established 1911</p>
                  </div>
                </div>
                <span
                  className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold sm:inline-flex"
                  style={{ background: 'rgba(253,253,253,.94)', color: BLUE, border: `1px solid ${BLUE_TINT}` }}
                >
                  <Lock className="h-3 w-3" />
                  RBI Regulated
                </span>
              </div>
            </div>

            <div className="p-6 sm:p-7">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  { label: 'Schemes Hosted', value: '15+ Direct Loans', color: NAVY },
                  { label: 'Approval Focus', value: 'Clear Bank Decisions', color: '#047857' },
                  { label: 'Branch Network', value: '4,500+ Branches', color: NAVY },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border p-4" style={{ background: BLUE_PALE, borderColor: `${GRAY}35` }}>
                    <p className="text-[10px] font-bold uppercase tracking-[.12em]" style={{ color: SLATE }}>{item.label}</p>
                    <p className="mt-1.5 text-[14px] font-bold" style={{ color: item.color }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t pt-5" style={{ borderColor: `${GRAY}35` }}>
                <span className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: SLATE }}>
                  <Info className="h-3.5 w-3.5" />
                  Loans are disbursed straight to your bank account.
                </span>
                <button
                  onClick={() => navigate('/schema')}
                  className="lm-btn-shine group/btn flex items-center gap-2 rounded-full px-5 py-2.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: `linear-gradient(135deg, ${NAVY}, ${BLUE})` }}
                >
                  View Schemes
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.article>

          <p className="mt-5 text-center text-[12px]" style={{ color: SLATE }}>
            More associated banks are joining LoanMela — this list will keep growing.
          </p>
        </section>

        {/* ================= PROMISES ================= */}
        <section id="stand" className="mb-24 scroll-mt-24">
          <SectionHead index="05" title="What we stand for" right="Our Principles" sub="Four promises we hold ourselves to through every stage of an application." />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {STANDS.map((item, index) => <PromiseCard key={item.title} item={item} index={index} />)}
          </div>
        </section>

        {/* ================= LAUNCH TRUST POINTS ================= */}
        <section id="voices" className="scroll-mt-24">
          <SectionHead index="06" title="What to expect" right="New Platform" sub="LoanMela has just launched — here is what is true about how we work, starting from day one." />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {LAUNCH_POINTS.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.1, duration: 0.55, ease: EASE }}
                whileHover={{ y: -7 }}
                className="group relative overflow-hidden rounded-[22px] border p-6 transition-all duration-500 hover:shadow-xl"
                style={{ background: WHITE, borderColor: `${GRAY}55` }}
              >
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `linear-gradient(150deg, ${BLUE_PALE}, transparent 60%)` }}
                />
                <div className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
                  <Icon name={point.icon} size={18} color={BLUE} />
                </div>
                <p className="relative mb-2 text-[14px] font-bold" style={{ color: NAVY }}>{point.title}</p>
                <p className="relative text-[13px] leading-[1.75]" style={{ color: TEXT }}>{point.body}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* ================= CTA - STRAIGHT TOP ================= */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        className="relative mt-16 overflow-hidden"
        style={{ background: `linear-gradient(125deg, ${NAVY} 0%, #1b3583 55%, ${BLUE} 130%)`, borderTop: `2px solid ${BLUE}` }}
      >
        <div className="lm-grid absolute inset-0 pointer-events-none" />

        {/* Seam — stops the CTA and Footer (both navy) from reading as one block */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24" style={{ background: 'linear-gradient(180deg, transparent, rgba(6,12,36,.55))' }} />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px" style={{ background: 'rgba(137,182,248,.18)' }} />

        <div className="lm-aurora absolute -right-24 -top-32 h-[30rem] w-[30rem] rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: 0.18 }} />
        <div className="lm-aurora absolute -bottom-40 -left-24 h-[26rem] w-[26rem] rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.24, animationDelay: '-7s' }} />

        <div className="relative z-10 mx-auto grid max-w-5xl items-center gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <span
              className="mb-4 inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[.16em]"
              style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.20)', color: BLUE_LIGHT }}
            >
              Get Started Today
            </span>

            <h2 className="text-[1.8rem] font-bold leading-[1.1] sm:text-[2.2rem]" style={{ color: WHITE, fontFamily: FONT_SERIF }}>
              Apply in minutes. <span style={{ color: BLUE_LIGHT }}>Hear back in days.</span>
            </h2>

            <p className="mt-4 max-w-md text-[13px] leading-relaxed" style={{ color: BLUE_TINT }}>
              No paperwork loops. No hidden rejection algorithms. Just one application connecting you to our associated banks.
            </p>

            <div className="mt-6 flex flex-wrap gap-4">
              {[
                { icon: 'shield', text: 'RBI Regulated' },
                { icon: 'clock', text: 'Fast Response' },
                { icon: 'file', text: 'Upload Once' },
              ].map((item) => (
                <span key={item.text} className="flex items-center gap-1.5 text-[11px] font-semibold" style={{ color: 'rgba(253,253,253,.84)' }}>
                  <Icon name={item.icon} size={14} color={BLUE_LIGHT} />
                  {item.text}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/schema')}
                className="lm-btn-shine group flex items-center gap-2 rounded-full px-6 py-3 text-[12.5px] font-semibold text-white transition-all hover:-translate-y-1 active:scale-95"
                style={{ background: BLUE, boxShadow: '0 18px 40px -14px rgba(47,118,251,.9)' }}
              >
                Explore Schemes
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              {!session && (
                <button
                  onClick={() => navigate('/register')}
                  className="rounded-full border px-6 py-3 text-[12.5px] font-semibold text-white transition-all hover:-translate-y-1 hover:bg-white/10"
                  style={{ borderColor: 'rgba(255,255,255,.30)' }}
                >
                  Create Account
                </button>
              )}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28, rotate: -4 }}
            whileInView={{ opacity: 1, y: 0, rotate: -4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative hidden justify-center lg:flex"
          >
            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[150px] rounded-[28px] p-2 shadow-2xl"
              style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.28)', backdropFilter: 'blur(10px)' }}
            >
              <div className="absolute left-1/2 top-3 z-10 h-1 w-10 -translate-x-1/2 rounded-full" style={{ background: 'rgba(0,0,0,.35)' }} />
              <Pic src={IMG.appMock} alt="LoanMela mobile application" icon="layers" ratio="9 / 19.5" rounded="rounded-[21px]" className="w-full" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-8 -left-7 flex items-center gap-2 rounded-xl px-3 py-2 shadow-xl"
              style={{ background: WHITE }}
            >
              <CheckCircle2 className="h-4 w-4" style={{ color: '#047857' }} />
              <div>
                <p className="text-[10px] font-bold" style={{ color: NAVY }}>Application received</p>
                <p className="text-[8.5px]" style={{ color: SLATE }}>Associated Bank</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}