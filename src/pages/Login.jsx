import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, LogIn, ShieldCheck } from 'lucide-react';
import { loginUser } from '../utils/auth';

/* Same brand tokens as Register.jsx so this page feels like part of the
   same product rather than a bolt-on. */
const NAVY = '#132261';
const BLUE = '#2f76fb';
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

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}
    >
      {/* Full-bleed banner instead of a floating card header */}
      <div
        className="w-full px-4 py-8 sm:py-10"
        style={{ background: `linear-gradient(115deg, ${NAVY} 0%, #1b3583 45%, ${BLUE} 100%)` }}
      >
        <div className="mx-auto max-w-md">
          <div className="mb-4 flex items-center gap-2 text-[13px] font-medium">
            <button onClick={() => navigate('/')} className="text-white/60 transition-colors hover:text-white">Home</button>
            <ArrowRight className="h-3.5 w-3.5 text-white/40" />
            <span className="font-semibold text-white">Login</span>
          </div>

          <span
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-semibold backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
          >
            <LogIn className="h-3.5 w-3.5" />
            Welcome back
          </span>
          <h2 className="mt-3 text-[1.5rem] font-bold sm:text-[1.7rem]" style={{ color: WHITE, fontFamily: FONT_HEAD }}>
            Log in to your account
          </h2>
        </div>
      </div>

      {/* Form body — plain section on the page, no floating card */}
      <div className="mx-auto max-w-md px-4 py-8 sm:py-10">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          className="space-y-4"
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
            className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
          >
            {submitting ? 'Logging in…' : 'Log In'}
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-2 pt-2 text-[12px]" style={{ color: SLATE }}>
            <ShieldCheck className="h-4 w-4 shrink-0" style={{ color: BLUE }} />
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold hover:underline" style={{ color: NAVY }}>
              Register here
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
}