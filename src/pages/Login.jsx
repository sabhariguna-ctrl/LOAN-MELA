import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, LogIn, ShieldCheck, Landmark, Wallet } from 'lucide-react';
import { loginUser } from '../utils/auth';

/* Same brand tokens as Register.jsx so this page feels like part of the
   same product rather than a bolt-on. */
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_LIGHT = '#89b6f8';
const BLUE_TINT = '#d9e7f9';
const BLUE_PALE = '#f0f6fc';
const SLATE = '#757e9e';
const GRAY = '#c0bec2';
const WHITE = '#fdfdfd';
const TEXT = '#242938';
const RED = '#c0392b';

const FONT_HEAD = "'Poppins', sans-serif";
const FONT_BODY = "'Poppins', sans-serif";
const EASE = [0.22, 1, 0.36, 1];

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>{label}</label>
      {children}
      {error && <p className="mt-1 text-[11px]" style={{ color: RED }}>{error}</p>}
    </div>
  );
}

function InputWithIcon({ icon: Icon, error, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
        style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY }}
      />
    </div>
  );
}

/**
 * Login — a routed page at /login. Checks credentials against the users
 * that Register.jsx has saved in localStorage.
 */
export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    const result = loginUser(form.email, form.password);
    setSubmitting(false);

    if (!result.success) {
      setErrors({ form: result.message });
      return;
    }

    navigate('/schema');
  };

  const TRUST_ITEMS = [
    { icon: ShieldCheck, label: 'Bank-grade encryption', desc: 'Your data is encrypted at rest and in transit.' },
    { icon: Landmark, label: 'RBI-regulated partners', desc: 'Every scheme is issued by a licensed bank.' },
    { icon: Wallet, label: 'Direct disbursal', desc: 'Funds move straight to your account, no middlemen.' },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col overflow-x-clip lg:flex-row" style={{ fontFamily: FONT_BODY }}>
      <style>{`
        @keyframes auth-drift { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4%,-6%,0) scale(1.12); } }
        .auth-aurora { animation: auth-drift 15s ease-in-out infinite; }
        .auth-grid-bg {
          background-image: linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, #000 30%, transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, #000 30%, transparent 100%);
        }
        @media (prefers-reduced-motion: reduce) { .auth-aurora { animation: none !important; } }
      `}</style>

      {/* ============ LEFT BRAND PANEL — desktop/tablet only ============
          Stretches to match the full height of the row (i.e. however tall
          the form column on the right ends up), so there's no dead white
          gap below it. The actual visible content (wordmark, heading,
          trust list) lives in an inner `sticky` wrapper further down so it
          pins near the top of the viewport as the page scrolls, instead of
          being stretched out with huge gaps. */}
      <div
        className="relative hidden w-full shrink-0 flex-col px-10 py-10 lg:flex lg:w-[42%] xl:w-[38%]"
        style={{ background: `linear-gradient(150deg, ${NAVY} 0%, #1b3583 55%, ${BLUE} 130%)` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="auth-aurora absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: 0.22 }} />
          <div className="auth-aurora absolute -bottom-28 -right-16 h-72 w-72 rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.3, animationDelay: '-6s' }} />
        </div>
        <div className="auth-grid-bg pointer-events-none absolute inset-0" />

        {/* Extra decorative icons — anchored by a fixed pixel offset (not
            percentage) so they always land in the clear background area
            below the sticky content block, regardless of how tall the
            panel stretches to match the form column. */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ bottom: 210, left: '14%' }}
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4.7, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <Landmark size={17} style={{ color: WHITE }} />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ bottom: 130, left: '58%' }}
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 32, height: 32, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <Wallet size={16} style={{ color: WHITE }} />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ bottom: 40, left: '18%' }}
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4.3, delay: 0.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 30, height: 30, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <ShieldCheck size={15} style={{ color: WHITE }} />
          </div>
        </motion.div>

        {/* Content pins near the top of the viewport as the page scrolls,
            while the gradient panel behind it stretches the full height
            of the taller form column. */}
        <div className="relative z-10 flex flex-col gap-8 lg:sticky lg:top-10">
          {/* Decorative shield icon — travels with the pinned header so it
              never drifts out of sync with the content as the page scrolls. */}
          <motion.div
            className="pointer-events-none absolute -top-1 right-0"
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 38, height: 38, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}
            >
              <ShieldCheck size={19} style={{ color: WHITE }} />
            </div>
          </motion.div>

          {/* Top — wordmark */}
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.26)' }}>
              <Landmark className="h-4.5 w-4.5" style={{ color: WHITE }} />
            </div>
            <span className="text-[15px] font-bold" style={{ color: WHITE, fontFamily: FONT_HEAD }}>LoanMela</span>
          </div>

          {/* Middle — heading */}
          <div className="max-w-sm">
            <motion.span
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
              className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-semibold backdrop-blur-md"
              style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
            >
              <LogIn className="h-3.5 w-3.5" />
              Welcome back
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
              className="text-[1.7rem] font-bold leading-[1.16]" style={{ color: WHITE, fontFamily: FONT_HEAD }}
            >
              Your schemes are right where you left them.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
              className="mt-3 text-[13px] leading-relaxed" style={{ color: 'rgba(253,253,253,.78)' }}
            >
              Log in to pick up your application, check saved loan types, and keep moving toward an answer.
            </motion.p>
          </div>

          {/* Bottom — trust list */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            className="space-y-3.5"
          >
            {TRUST_ITEMS.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.22)' }}>
                  <Icon className="h-4 w-4" style={{ color: WHITE }} />
                </div>
                <div>
                  <p className="text-[12.5px] font-bold" style={{ color: WHITE }}>{label}</p>
                  <p className="mt-0.5 text-[11.5px] leading-snug" style={{ color: 'rgba(253,253,253,.7)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ============ RIGHT FORM PANEL ============ */}
      <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-10" style={{ background: BLUE_PALE }}>
        <div className="w-full max-w-[26rem]">
          {/* Mobile-only compact header — the brand panel is hidden below lg */}
          <div className="mb-6 lg:hidden">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-medium">
              <button onClick={() => navigate('/')} className="transition-colors" style={{ color: SLATE }}>Home</button>
              <ArrowRight className="h-3.5 w-3.5" style={{ color: GRAY }} />
              <span className="font-semibold" style={{ color: NAVY }}>Login</span>
            </div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: NAVY }}>
              <LogIn className="h-4.5 w-4.5" style={{ color: WHITE }} />
            </div>
            <h1 className="text-[1.5rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Log in to your account</h1>
            <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: SLATE }}>Pick up right where you left off.</p>
          </div>

          {/* Desktop-only compact eyebrow, since the big heading already lives in the left panel */}
          <div className="mb-6 hidden lg:block">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-medium">
              <button onClick={() => navigate('/')} className="transition-colors hover:text-slate-700" style={{ color: SLATE }}>Home</button>
              <ArrowRight className="h-3.5 w-3.5" style={{ color: GRAY }} />
              <span className="font-semibold" style={{ color: NAVY }}>Login</span>
            </div>
            <h2 className="text-[1.55rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Sign in</h2>
            <p className="mt-1.5 text-[12.5px]" style={{ color: SLATE }}>Enter your email and password to continue.</p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="space-y-4 rounded-[22px] border p-6 sm:p-7"
            style={{ background: WHITE, borderColor: `${GRAY}45`, boxShadow: '0 24px 50px -30px rgba(19,34,97,.35)' }}
          >
            {errors.form && (
              <div
                className="rounded-lg p-3 text-[12.5px] font-medium"
                style={{ background: '#fbeceb', color: RED }}
              >
                {errors.form}
              </div>
            )}

            <Field label="Email Address" error={errors.email}>
              <InputWithIcon icon={Mail} error={errors.email} type="email" placeholder="you@example.com"
                value={form.email} onChange={(e) => update('email', e.target.value)} />
            </Field>

            <Field label="Password" error={errors.password}>
              <InputWithIcon icon={Lock} error={errors.password} type="password" placeholder="Your password"
                value={form.password} onChange={(e) => update('password', e.target.value)} />
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})`, boxShadow: '0 14px 30px -14px rgba(19,34,97,.55)' }}
            >
              {submitting ? 'Logging in…' : 'Log In'}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 pt-1 text-[12px]" style={{ color: SLATE }}>
              <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: BLUE }} />
              Don't have an account yet?{' '}
              <Link to="/register" className="font-semibold hover:underline" style={{ color: NAVY }}>
                Register here
              </Link>
            </div>
          </motion.form>

          {/* Trust strip — mobile only, desktop shows the same info in the left panel */}
          <motion.div
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3 lg:hidden"
          >
            {TRUST_ITEMS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2.5 rounded-xl border px-3 py-2.5"
                style={{ background: WHITE, borderColor: `${GRAY}55` }}
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
                  <Icon className="h-4 w-4" style={{ color: BLUE }} />
                </div>
                <p className="text-[11px] font-semibold leading-tight" style={{ color: NAVY }}>{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}


