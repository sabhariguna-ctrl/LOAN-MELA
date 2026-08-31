import { useLocation } from 'react-router-dom';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'framer-motion';
import {
  Search, CheckCircle2, ArrowRight, ShieldCheck, FileText, Info, X, Lock, Unlock,
  Landmark, User, Phone, Mail, MapPin, Banknote, Send, ChevronDown, Sparkles, ImageIcon,
} from 'lucide-react';

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

/* ================= LOAN CARD IMAGES =================
   Keys now match the official loan categories from the
   Constituency-Wise Loan Mela guide. */
const GROUP_IMAGES = {
  Professional: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=85',
  Business: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=85',
  Livelihood: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=85',
  Education: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85',
  Medical: 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=1200&q=85',
  Agriculture: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=85',
  Vehicle: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=85',
  Home: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=85',
  Equipment: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&w=1200&q=85',
  'Working Capital': 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=85',
  'Women Enterprise': 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=1200&q=85',
};

/* ================= HERO 3D ICONS ================= */
const ICONS3D = {
  shield: '/images/shield.png', lock: '/images/lock.png', wallet: '/images/wallet.png',
  piggybank: '/images/piggybank.png', award: '/images/award.png', trending: '/images/trending.png',
};

const HERO_FLOAT_ICONS = [
  { icon: 'shield', top: '15%', side: 'left', pos: '7%', size: 46, delay: 0, duration: 4.2 },
  { icon: 'piggybank', top: '58%', side: 'left', pos: '12%', size: 48, delay: 0.5, duration: 4.8 },
  { icon: 'lock', top: '30%', side: 'left', pos: '22%', size: 36, delay: 1, duration: 4.4 },
  { icon: 'award', top: '14%', side: 'right', pos: '7%', size: 45, delay: 0.4, duration: 4.1 },
  { icon: 'wallet', top: '55%', side: 'right', pos: '11%', size: 42, delay: 0.8, duration: 4.9 },
  { icon: 'trending', top: '34%', side: 'right', pos: '21%', size: 36, delay: 1.2, duration: 4.5 },
];

function Icon3D({ name, size = 40 }) {
  const [failed, setFailed] = useState(false);
  const src = ICONS3D[name];

  if (!src || failed) {
    return (
      <div
        className="flex items-center justify-center rounded-2xl"
        style={{ width: size, height: size, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.24)' }}
      >
        <Sparkles size={size * 0.45} style={{ color: WHITE }} />
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
      style={{ width: size, height: size, filter: 'drop-shadow(0 9px 15px rgba(19,34,97,0.4))' }}
    />
  );
}

/* ================= SAFE IMAGE ================= */
function Pic({ src, alt = '', className = '', imgClass = '', rounded = 'rounded-2xl', style = {} }) {
  const [state, setState] = useState('loading');

  useEffect(() => {
    setState('loading');
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${rounded} ${className}`} style={style}>
      {state !== 'ok' && (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${BLUE_PALE}, ${BLUE_TINT}, ${BLUE_PALE})` }}
        >
          <span className="loan-shimmer absolute inset-0" />
          <ImageIcon size={28} style={{ color: BLUE_LIGHT }} />
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
    </div>
  );
}

/* ================= LOAN CATALOG =================
   Sourced from the "Constituency-Wise Loan Mela — Loan Matching &
   Applicant Guidance Framework". Categories, purposes, eligibility
   signals and document lists follow that guide directly; final
   sanction, rate, tenure and collateral remain subject to the
   participating lender's own policy and assessment. */
const LOAN_SCHEMES = [
  {
    id: 'professional-career',
    name: 'Professional / Career Loan',
    filterGroup: 'Professional',
    categoryLabel: 'Unsecured Loan',
    collateralStatus: 'unsecured',
    types: ['Professional Equipment', 'Certification & Licensing', 'Office Setup', 'Career-Related Investment'],
    eligibility: [
      'Working professional, self-employed professional or applicant seeking career advancement',
      'Stated purpose supports career-related investment',
      'Stable income source',
      'Basic KYC and income details on record',
    ],
    documents: ['Identity Proof', 'Address Proof', 'Income Proof', 'Bank Statements'],
    collateral: 'Not Required',
  },
  {
    id: 'business-msme',
    name: 'Business / MSME Loan',
    filterGroup: 'Business',
    categoryLabel: 'Secured / Unsecured',
    collateralStatus: 'mixed',
    types: ['Business Expansion', 'Machinery Purchase', 'Working Capital', 'Shop / Office Setup'],
    eligibility: [
      'Small business owner, trader, service provider or entrepreneur',
      'Business or activity proof available',
      'Approximate turnover and duration of business known',
    ],
    documents: ['Identity / Address Proof', 'Income Proof', 'Bank Statements', 'Business / Activity Proof'],
    collateral: 'Subject to lender policy',
  },
  {
    id: 'self-employment-livelihood',
    name: 'Self-Employment / Livelihood Loan',
    filterGroup: 'Livelihood',
    categoryLabel: 'Mostly Unsecured',
    collateralStatus: 'unsecured',
    types: ['Tools & Equipment', 'Small Enterprise Setup', 'Income-Generating Assets'],
    eligibility: [
      'Individual seeking to start or strengthen a livelihood activity',
      'Purpose creates or supports income generation',
      'Basic KYC and activity details available',
    ],
    documents: ['Identity / Address Proof', 'Income Proof (if available)', 'Business / Activity Proof', 'Quotations for Tools or Equipment'],
    collateral: 'Not Required',
  },
  {
    id: 'education-skill',
    name: 'Education / Skill Development Loan',
    filterGroup: 'Education',
    categoryLabel: 'Mostly Unsecured',
    collateralStatus: 'mixed',
    types: ['Higher Education', 'Vocational Training', 'Technical Courses', 'Certifications'],
    eligibility: [
      'Student, trainee or worker upgrading skills',
      'Admission or enrolment confirmation available',
      'Purpose supports education or skill upgrade',
    ],
    documents: ['Identity / Address Proof', 'Education Documents', 'Income Proof', 'Bank Statements'],
    collateral: 'Depends on loan amount',
  },
  {
    id: 'medical-healthcare',
    name: 'Medical / Healthcare Loan',
    filterGroup: 'Medical',
    categoryLabel: 'Unsecured Loan',
    collateralStatus: 'unsecured',
    types: ['Hospitalisation', 'Medical Procedures', 'Treatment-Related Expenses'],
    eligibility: [
      'Individual or family facing an eligible healthcare expense',
      'Current eligibility and documentation verified with the lender',
    ],
    documents: ['Identity / Address Proof', 'Income Proof', 'Bank Statements', 'Medical Estimates'],
    collateral: 'Not Required',
  },
  {
    id: 'agriculture-allied',
    name: 'Agriculture & Allied Activities Loan',
    filterGroup: 'Agriculture',
    categoryLabel: 'Secured / Government',
    collateralStatus: 'mixed',
    types: ['Farm Inputs', 'Irrigation', 'Equipment', 'Dairy & Poultry', 'Allied Activities'],
    eligibility: [
      'Farmer or rural entrepreneur',
      'Land ownership or lease details available',
      'KYC required',
    ],
    documents: ['Identity / Address Proof', 'Business / Activity Proof', 'Bank Statements', 'Quotations for Equipment'],
    collateral: 'Depends on scheme',
  },
  {
    id: 'vehicle-commercial',
    name: 'Vehicle / Commercial Vehicle Loan',
    filterGroup: 'Vehicle',
    categoryLabel: 'Secured Loan',
    collateralStatus: 'secured',
    types: ['Eligible Personal Vehicle', 'Income-Generating Commercial Vehicle'],
    eligibility: [
      'Worker, self-employed person or small operator',
      'Regular income source',
      'Purpose is personal use or income generation',
    ],
    documents: ['Identity / Address Proof', 'Income Proof', 'Bank Statements', 'Vehicle Quotation'],
    collateral: 'Vehicle Financed',
  },
  {
    id: 'home-improvement-repair',
    name: 'Home Improvement / Repair Loan',
    filterGroup: 'Home',
    categoryLabel: 'Secured / Unsecured',
    collateralStatus: 'mixed',
    types: ['Repairs', 'Renovation', 'Essential Home Improvements'],
    eligibility: [
      'Existing homeowner',
      'Stable income source',
      'Purpose limited to repair or improvement of existing home',
    ],
    documents: ['Identity / Address Proof', 'Income Proof', 'Bank Statements', 'Property Documents'],
    collateral: 'Subject to lender policy',
  },
  {
    id: 'equipment-asset-finance',
    name: 'Equipment / Asset Finance',
    filterGroup: 'Equipment',
    categoryLabel: 'Secured Loan',
    collateralStatus: 'secured',
    types: ['Productive Equipment', 'Machinery', 'Eligible Business Assets'],
    eligibility: [
      'Business or self-employed applicant',
      'Business / activity proof available',
      'Quotation for the equipment or asset',
    ],
    documents: ['Identity / Address Proof', 'Business / Activity Proof', 'Bank Statements', 'Quotations'],
    collateral: 'Equipment / Asset Financed',
  },
  {
    id: 'working-capital',
    name: 'Working Capital Loan',
    filterGroup: 'Working Capital',
    categoryLabel: 'Business Loan',
    collateralStatus: 'mixed',
    types: ['Inventory Financing', 'Receivables Financing', 'Day-to-Day Business Requirements'],
    eligibility: [
      'Existing business with operating cash-flow needs',
      'Business / activity proof available',
    ],
    documents: ['Identity / Address Proof', 'Business / Activity Proof', 'Bank Statements', 'Income Proof'],
    collateral: 'Subject to lender policy',
  },
  {
    id: 'women-group-enterprise',
    name: 'Women / Group Enterprise Finance',
    filterGroup: 'Women Enterprise',
    categoryLabel: 'Scheme-Based Finance',
    collateralStatus: 'mixed',
    types: ['Micro-Enterprise Creation', 'Micro-Enterprise Expansion'],
    eligibility: [
      'Eligible women-led or group-based enterprise',
      'Subject to the participating lender\u2019s scheme criteria',
    ],
    documents: ['Identity / Address Proof', 'Business / Activity Proof', 'Bank Statements', 'Group / Enterprise Details'],
    collateral: 'Depends on lender scheme',
  },
];

const TYPE_CARDS = LOAN_SCHEMES.flatMap((scheme) =>
  scheme.types.map((type) => ({
    id: `${scheme.id}-${type.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    typeName: type,
    parentName: scheme.name,
    filterGroup: scheme.filterGroup,
    categoryLabel: scheme.categoryLabel,
    collateralStatus: scheme.collateralStatus,
    eligibility: scheme.eligibility,
    documents: scheme.documents,
    collateral: scheme.collateral,
  }))
);

const CATEGORIES = [
  'All', 'Professional', 'Business', 'Livelihood', 'Education', 'Medical',
  'Agriculture', 'Vehicle', 'Home', 'Equipment', 'Working Capital', 'Women Enterprise',
];

const collateralBadge = (status) => {
  if (status === 'secured') {
    return { label: 'Secured', icon: Lock, color: NAVY, bg: BLUE_PALE, border: BLUE_TINT };
  }
  if (status === 'unsecured') {
    return { label: 'Unsecured', icon: Unlock, color: '#1a7f4b', bg: '#e9f7ef', border: '#bfe6cf' };
  }
  return { label: 'Flexible Security', icon: ShieldCheck, color: NAVY, bg: BLUE_PALE, border: BLUE_TINT };
};

/* ================= TILT CARD ================= */
function TiltCard({ children, className = '' }) {
  const cardRef = useRef(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 220, damping: 20 });

  const handleMouseMove = useCallback(
    (event) => {
      const element = cardRef.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      mx.set((event.clientX - rect.left) / rect.width - 0.5);
      my.set((event.clientY - rect.top) / rect.height - 0.5);
    },
    [mx, my]
  );

  return (
    <motion.div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { mx.set(0); my.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  );
}

/* ================= MAIN PAGE ================= */
export default function Loanschema() {
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState(location.state?.filterGroup || 'All');
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const categoryMenuRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchActive, setSearchActive] = useState(false);

  const [applyItem, setApplyItem] = useState(null);
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [applyErrors, setApplyErrors] = useState({});

  const [applyForm, setApplyForm] = useState({ name: '', phone: '', email: '', amount: '', city: '' });

  const pageRef = useRef(null);

  const { scrollYProgress } = useScroll({ target: pageRef, offset: ['start start', 'end end'] });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.3 });

  const openApplyForm = (item) => {
    setApplyItem(item);
    setApplySubmitted(false);
    setApplyErrors({});
    setApplyForm({ name: '', phone: '', email: '', amount: '', city: '' });
  };

  const closeApplyForm = () => {
    setApplyItem(null);
  };

  const updateApplyField = (field, value) => {
    setApplyForm((previous) => ({ ...previous, [field]: value }));
    setApplyErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleApplySubmit = (event) => {
    event.preventDefault();

    const errors = {};

    if (!applyForm.name.trim()) errors.name = 'Full name is required';
    if (!/^\d{10}$/.test(applyForm.phone.trim())) errors.phone = 'Enter a valid 10-digit mobile number';

    if (!applyForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(applyForm.email.trim())) {
      errors.email = 'Enter a valid email address';
    }

    if (!applyForm.amount.trim()) errors.amount = 'Loan amount is required';
    if (!applyForm.city.trim()) errors.city = 'City is required';

    if (Object.keys(errors).length > 0) {
      setApplyErrors(errors);
      return;
    }

    setApplySubmitted(true);
  };

  const query = searchQuery.toLowerCase();

  const cardsToShow = TYPE_CARDS.filter((type) => {
    const matchesCategory = selectedCategory === 'All' || type.filterGroup === selectedCategory;
    const matchesSearch =
      type.typeName.toLowerCase().includes(query) || type.parentName.toLowerCase().includes(query);
    return matchesCategory && matchesSearch;
  }).map((type) => ({
    id: type.id,
    title: type.typeName,
    parentName: type.parentName,
    groupLabel: type.filterGroup,
    categoryLabel: type.categoryLabel,
    collateralStatus: type.collateralStatus,
    collateral: type.collateral,
    eligibility: type.eligibility,
    documents: type.documents,
  }));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryMenuRef.current && !categoryMenuRef.current.contains(event.target)) {
        setCategoryMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBrowse = () => {
    document.getElementById('loan-browse')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div
      ref={pageRef}
      className="w-full overflow-x-clip antialiased"
      style={{
        /* Page background changed from pure WHITE to a light blue tint
           (BLUE_PALE). With Footer.jsx now also on a white background,
           a pure-white content section blended straight into it with no
           visible break. The tint keeps the light theme but gives the
           section a distinct edge against the white footer below. */
        background: BLUE_PALE, color: TEXT, fontFamily: FONT_BODY,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        @keyframes loan-drift { 0%, 100% { transform: translate3d(0, 0, 0) scale(1); } 50% { transform: translate3d(4%, -6%, 0) scale(1.12); } }
        @keyframes loan-shimmer { 100% { transform: translateX(100%); } }
        @keyframes loan-shine { 0% { transform: translateX(-130%); } 100% { transform: translateX(230%); } }
        .loan-aurora { animation: loan-drift 15s ease-in-out infinite; }
        .loan-shimmer { background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent); transform: translateX(-100%); animation: loan-shimmer 1.6s infinite; }
        .loan-grid-bg {
          background-image: linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 35%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 45%, #000 35%, transparent 100%);
        }
        .image-loan-card:hover .loan-card-image { transform: scale(1.09); }
        .image-loan-card:hover .loan-card-button { background: ${BLUE} !important; }
        .loan-btn-shine { position: relative; overflow: hidden; }
        .loan-btn-shine::after {
          content: ''; position: absolute; top: 0; bottom: 0; width: 45%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent);
          transform: translateX(-140%);
        }
        .loan-btn-shine:hover::after { animation: loan-shine .9s ease forwards; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { scrollbar-width: none; }
        @media (prefers-reduced-motion: reduce) {
          .loan-aurora, .loan-shimmer { animation: none !important; }
        }
      `}</style>

      <motion.div
        className="fixed left-0 right-0 top-0 z-[70] h-[3px] origin-left"
        style={{ scaleX: progress, background: `linear-gradient(90deg, ${NAVY}, ${BLUE}, ${BLUE_LIGHT})` }}
      />

      {/* ================= HERO ================= */}
      <section
        className="relative flex w-full items-center justify-center overflow-hidden"
        style={{ minHeight: 'clamp(250px, 28vw, 325px)', background: `linear-gradient(115deg, ${NAVY} 0%, #1b3583 45%, ${BLUE} 100%)` }}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="loan-aurora absolute -top-40 -left-28 h-[32rem] w-[32rem] rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: 0.2 }} />
          <div className="loan-aurora absolute -bottom-44 -right-28 h-[32rem] w-[32rem] rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.28, animationDelay: '-6s' }} />
        </div>

        <div className="loan-grid-bg absolute inset-0 pointer-events-none" />

        <div className="absolute inset-0 hidden pointer-events-none sm:block">
          {HERO_FLOAT_ICONS.map((item, index) => (
            <motion.div
              key={index}
              className="absolute"
              style={{ top: item.top, [item.side]: item.pos }}
              animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
              transition={{ duration: item.duration, delay: item.delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon3D name={item.icon} size={item.size} />
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-5 pb-14 pt-3 text-center sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
          >
            <Landmark className="h-3.5 w-3.5" />
            <span>Loan Types & Application Requirements</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="max-w-3xl text-[2.25rem] font-bold leading-[1.06] tracking-tight sm:text-[3.2rem]"
            style={{ color: WHITE, fontFamily: FONT_SERIF }}
          >
            Find the loan that fits your next big move.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="mt-5 max-w-2xl text-[15px] leading-relaxed sm:text-[16px]"
            style={{ color: 'rgba(253,253,253,.82)' }}
          >
            Browse loan types, understand eligibility, prepare documents, and apply with confidence — all from one place.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.55 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToBrowse}
            className="loan-btn-shine group mt-7 inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-[13.5px] font-semibold shadow-lg"
            style={{ background: WHITE, color: NAVY }}
          >
            <span>Explore loan types</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        </div>

        <svg className="absolute left-0 w-full pointer-events-none" style={{ height: '64px', display: 'block', bottom: '-2px' }} preserveAspectRatio="none" viewBox="0 0 1000 100">
          <path
            d="M0,42 C90,60 140,72 210,70 S340,38 410,36 S540,66 610,64 S740,34 840,38 S950,56 1000,48 L1000,100 L0,100 Z"
            fill={BLUE_PALE}
            stroke="none"
          />
        </svg>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14" style={{ marginTop: '-2px' }}>
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={fadeUp} className="mb-8 text-center">
          <span
            className="inline-block rounded-full px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em]"
            style={{ background: WHITE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}
          >
            One form. Many possibilities.
          </span>

          <h2 className="mt-3 text-[1.9rem] font-bold sm:text-[2.25rem]" style={{ color: NAVY, fontFamily: FONT_SERIF }}>
            Browse loan types
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-[14px] leading-relaxed" style={{ color: SLATE }}>
            Select a category or search for a specific need such as business expansion, farm equipment, medical treatment, or professional certification.
          </p>
        </motion.div>

        {/* Search and filters */}
        <div id="loan-browse" className="mb-10 space-y-4 scroll-mt-8">
          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-lg" onMouseEnter={() => setSearchActive(true)} onMouseLeave={() => setSearchActive(false)}>
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: searchActive ? BLUE : '#94a3b8' }} />

              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setSearchActive(true)}
                onBlur={() => setSearchActive(false)}
                placeholder="Search business, agriculture, medical, professional..."
                className="w-full rounded-full border py-3 pl-11 pr-10 text-[13px] outline-none transition-all"
                style={{ background: WHITE, borderColor: searchActive ? BLUE : GRAY, boxShadow: searchActive ? '0 0 0 3px rgba(47,118,251,.12)' : 'none' }}
              />

              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Category dropdown */}
            <div className="relative shrink-0" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={() => setCategoryMenuOpen((open) => !open)}
                className="flex w-full items-center justify-between gap-3 rounded-full border py-3 pl-5 pr-4 text-[13px] font-semibold outline-none transition-all sm:w-56"
                style={{ background: WHITE, borderColor: categoryMenuOpen ? BLUE : GRAY, color: NAVY, boxShadow: categoryMenuOpen ? '0 0 0 3px rgba(47,118,251,.12)' : 'none' }}
              >
                <span className="truncate">{selectedCategory}</span>
                <ChevronDown
                  className={`h-4 w-4 shrink-0 transition-transform duration-300 ${categoryMenuOpen ? 'rotate-180' : ''}`}
                  style={{ color: categoryMenuOpen ? BLUE : '#94a3b8' }}
                />
              </button>

              <AnimatePresence>
                {categoryMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.98 }}
                    transition={{ duration: 0.18, ease: EASE }}
                    className="absolute right-0 top-[calc(100%+8px)] z-30 w-full min-w-[15rem] overflow-hidden rounded-2xl border p-1.5 sm:w-56"
                    style={{ background: WHITE, borderColor: `${GRAY}75`, boxShadow: '0 18px 40px -18px rgba(19,34,97,.35)' }}
                  >
                    <div className="max-h-72 overflow-y-auto no-scrollbar">
                      {CATEGORIES.map((category) => {
                        const selected = selectedCategory === category;

                        return (
                          <button
                            key={category}
                            onClick={() => { setSelectedCategory(category); setSearchQuery(''); setCategoryMenuOpen(false); }}
                            className="relative flex w-full items-center justify-between gap-2 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition-colors"
                            style={{ background: selected ? BLUE_PALE : 'transparent', color: selected ? NAVY : '#475569' }}
                            onMouseEnter={(event) => { if (!selected) event.currentTarget.style.background = '#f8fafc'; }}
                            onMouseLeave={(event) => { if (!selected) event.currentTarget.style.background = 'transparent'; }}
                          >
                            <span>{category}</span>
                            {selected && <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: BLUE }} />}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="shrink-0 text-center text-[12.5px] font-medium sm:ml-auto sm:text-right" style={{ color: SLATE }}>
              Showing <strong style={{ color: NAVY }}>{cardsToShow.length}</strong> loan types
            </p>
          </div>
        </div>

        {/* Empty State */}
        {cardsToShow.length === 0 ? (
          <div className="rounded-2xl border py-16 text-center" style={{ background: WHITE, borderColor: `${GRAY}55` }}>
            <Info className="mx-auto mb-3 h-9 w-9" style={{ color: BLUE }} />
            <h3 className="text-[1.2rem] font-bold" style={{ color: NAVY, fontFamily: FONT_SERIF }}>No loan types found</h3>
            <p className="mt-2 text-[13px]" style={{ color: SLATE }}>Try a different keyword or reset your filters.</p>
            <button
              onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
              className="mt-4 text-[13px] font-bold hover:underline"
              style={{ color: BLUE }}
            >
              Reset filters
            </button>
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {cardsToShow.map((item, index) => {
                const badge = collateralBadge(item.collateralStatus);
                const BadgeIcon = badge.icon;
                const image = GROUP_IMAGES[item.groupLabel];

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.45, delay: (index % 9) * 0.035, ease: EASE }}
                    className="h-full"
                  >
                    <TiltCard className="h-full">
                      <article
                        className="image-loan-card group flex h-full flex-col overflow-hidden rounded-[22px] border transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl"
                        style={{ background: WHITE, borderColor: `${GRAY}75`, boxShadow: '0 14px 34px -24px rgba(19,34,97,.55)' }}
                      >
                        {/* Category and tag pills removed */}
                        <div className="relative h-[178px] overflow-hidden">
                          <Pic
                            src={image}
                            alt={item.groupLabel}
                            rounded="rounded-none"
                            className="absolute inset-0 h-full w-full"
                            imgClass="loan-card-image duration-[1200ms] transition-transform"
                          />
                          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(19,34,97,.08), rgba(19,34,97,.65))` }} />
                          <div className="absolute bottom-4 left-4 right-4 text-center">
                            <p className="text-[11px] font-semibold" style={{ color: BLUE_TINT }}>Part of {item.parentName}</p>
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col items-center px-5 py-5 text-center">
                          <h3 className="min-h-[48px] text-[1.2rem] font-bold leading-tight" style={{ color: NAVY, fontFamily: FONT_SERIF }}>
                            {item.title}
                          </h3>

                          <span
                            className="mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10.5px] font-bold"
                            style={{ background: badge.bg, border: `1px solid ${badge.border}`, color: badge.color }}
                          >
                            <BadgeIcon className="h-3.5 w-3.5" />
                            {badge.label}
                          </span>

                          <p className="mt-3 text-[11.5px] font-medium" style={{ color: SLATE }}>
                            Collateral: <strong style={{ color: TEXT }}>{item.collateral}</strong>
                          </p>

                          <div className="my-4 h-[1px] w-16" style={{ background: BLUE_TINT }} />

                          <div className="space-y-1.5">
                            {item.eligibility.slice(0, 2).map((requirement, requirementIndex) => (
                              <p key={requirementIndex} className="flex items-center justify-center gap-1.5 text-[11.5px]" style={{ color: TEXT }}>
                                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: BLUE }} />
                                <span>{requirement}</span>
                              </p>
                            ))}
                          </div>

                          {/* Details button removed */}
                          <div className="mt-auto flex w-full items-center justify-center pt-5">
                            <button
                              onClick={() => openApplyForm(item)}
                              className="loan-card-button loan-btn-shine inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[11.5px] font-semibold text-white transition-all"
                              style={{ background: NAVY }}
                            >
                              <span>Apply Now</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </article>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* Seam — this page's own background is BLUE_PALE, so a soft border
          plus a touch of fade keeps a visible edge right where the white
          Footer begins, instead of a hard, unbroken flat line. */}
      <div
        className="relative"
        style={{ height: '48px', background: `linear-gradient(180deg, transparent, ${BLUE_TINT}55)`, borderBottom: `1px solid ${BLUE_TINT}` }}
      />

      {/* ================= APPLICATION MODAL ================= */}
      <AnimatePresence>
        {applyItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeApplyForm}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
              className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border bg-white p-6 shadow-2xl"
              style={{ borderColor: GRAY }}
            >
              <button onClick={closeApplyForm} className="absolute right-5 top-5 rounded-full p-2 text-slate-500 hover:bg-slate-100">
                <X className="h-4 w-4" />
              </button>

              {applySubmitted ? (
                <div className="py-7 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 220 }}
                    className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
                    style={{ background: '#e9f7ef' }}
                  >
                    <CheckCircle2 className="h-8 w-8" style={{ color: '#1a7f4b' }} />
                  </motion.div>

                  <h3 className="text-[1.4rem] font-bold" style={{ color: NAVY, fontFamily: FONT_SERIF }}>
                    Application Submitted
                  </h3>

                  <p className="mx-auto mt-3 max-w-xs text-[13px] leading-relaxed" style={{ color: SLATE }}>
                    Thanks, {applyForm.name.split(' ')[0]}. Your request for{' '}
                    <strong style={{ color: TEXT }}>{applyItem.title}</strong> was received. Our team will call you on{' '}
                    <strong style={{ color: TEXT }}>{applyForm.phone}</strong> within 24 hours.
                  </p>

                  <button onClick={closeApplyForm} className="mt-6 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white" style={{ background: NAVY }}>
                    Done
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 text-center">
                    <span
                      className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                      style={{ background: BLUE_PALE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}
                    >
                      LoanMela Application
                    </span>

                    <h3 className="mt-3 text-[1.4rem] font-bold" style={{ color: NAVY, fontFamily: FONT_SERIF }}>
                      Apply for {applyItem.title}
                    </h3>

                    <p className="mt-1 text-[12.5px]" style={{ color: SLATE }}>
                      Enter your details and we will contact you with the next steps.
                    </p>
                  </div>

                  <form onSubmit={handleApplySubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="text"
                          value={applyForm.name}
                          onChange={(event) => updateApplyField('name', event.target.value)}
                          placeholder="e.g. Surega R"
                          className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
                          style={{ borderColor: applyErrors.name ? '#e0554f' : GRAY }}
                        />
                      </div>
                      {applyErrors.name && <p className="mt-1 text-[11px]" style={{ color: '#c0392b' }}>{applyErrors.name}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>Mobile Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="tel"
                          value={applyForm.phone}
                          onChange={(event) => updateApplyField('phone', event.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="10-digit mobile number"
                          className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
                          style={{ borderColor: applyErrors.phone ? '#e0554f' : GRAY }}
                        />
                      </div>
                      {applyErrors.phone && <p className="mt-1 text-[11px]" style={{ color: '#c0392b' }}>{applyErrors.phone}</p>}
                    </div>

                    <div>
                      <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                          type="email"
                          value={applyForm.email}
                          onChange={(event) => updateApplyField('email', event.target.value)}
                          placeholder="you@example.com"
                          className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
                          style={{ borderColor: applyErrors.email ? '#e0554f' : GRAY }}
                        />
                      </div>
                      {applyErrors.email && <p className="mt-1 text-[11px]" style={{ color: '#c0392b' }}>{applyErrors.email}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>Loan Amount</label>
                        <div className="relative">
                          <Banknote className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={applyForm.amount}
                            onChange={(event) => updateApplyField('amount', event.target.value.replace(/[^\d]/g, ''))}
                            placeholder="500000"
                            className="w-full rounded-lg border py-2.5 pl-10 pr-2 text-[12px] outline-none transition-all focus:border-blue-500"
                            style={{ borderColor: applyErrors.amount ? '#e0554f' : GRAY }}
                          />
                        </div>
                        {applyErrors.amount && <p className="mt-1 text-[10px]" style={{ color: '#c0392b' }}>{applyErrors.amount}</p>}
                      </div>

                      <div>
                        <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>City</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={applyForm.city}
                            onChange={(event) => updateApplyField('city', event.target.value)}
                            placeholder="Chennai"
                            className="w-full rounded-lg border py-2.5 pl-10 pr-2 text-[12px] outline-none transition-all focus:border-blue-500"
                            style={{ borderColor: applyErrors.city ? '#e0554f' : GRAY }}
                          />
                        </div>
                        {applyErrors.city && <p className="mt-1 text-[10px]" style={{ color: '#c0392b' }}>{applyErrors.city}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: `${GRAY}45` }}>
                      <button type="button" onClick={closeApplyForm} className="text-[12.5px] font-semibold hover:underline" style={{ color: SLATE }}>
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="loan-btn-shine inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[12.5px] font-semibold text-white"
                        style={{ background: BLUE }}
                      >
                        <span>Submit Application</span>
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}