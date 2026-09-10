// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import {
//   FileText, Clock, CheckCircle2, XCircle, Banknote, MapPin, Calendar,
//   Landmark, ArrowRight, Inbox, ShieldCheck,
// } from 'lucide-react';
// import { getSession, getApplicationsByEmail } from '../utils/auth';

// /* ================= BRAND TOKENS =================
//    Matches the tokens used across Loanschema.jsx / Navbar.jsx / Register.jsx
//    so this page feels like part of the same product. */
// const NAVY = '#132261';
// const BLUE = '#2f76fb';
// const BLUE_TINT = '#d9e7f9';
// const BLUE_PALE = '#f0f6fc';
// const SLATE = '#757e9e';
// const GRAY = '#c0bec2';
// const TEXT = '#242938';

// const FONT_HEAD = "'Poppins', sans-serif";
// const FONT_BODY = "'Poppins', sans-serif";

// // Status → visual treatment. Every application defaults to 'Pending' the
// // moment it's submitted (see utils/auth.js submitApplication); the other
// // two states are there so the UI already knows how to render them once a
// // real backend starts moving applications through a review pipeline.
// const STATUS_STYLES = {
//   Pending: { bg: '#fff6e5', text: '#a15c00', border: '#f3d896', icon: Clock, label: 'Pending Review' },
//   Approved: { bg: '#e9f7ef', text: '#1a7f4b', border: '#bfe9d2', icon: CheckCircle2, label: 'Approved' },
//   Rejected: { bg: '#fdecea', text: '#c0392b', border: '#f5c6c1', icon: XCircle, label: 'Rejected' },
// };

// function StatusBadge({ status }) {
//   const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
//   const Icon = style.icon;
//   return (
//     <span
//       className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold"
//       style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
//     >
//       <Icon className="h-3.5 w-3.5" />
//       {style.label}
//     </span>
//   );
// }

// function DetailChip({ icon: Icon, label, value }) {
//   if (!value) return null;
//   return (
//     <div className="flex items-center gap-2 text-[12.5px]" style={{ color: SLATE }}>
//       <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: BLUE }} />
//       <span>{label}: <strong style={{ color: TEXT }}>{value}</strong></span>
//     </div>
//   );
// }

// function formatDate(iso) {
//   try {
//     return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
//   } catch {
//     return iso;
//   }
// }

// export default function MyApplications() {
//   const navigate = useNavigate();
//   const [session, setSessionState] = useState(() => getSession());
//   const [applications, setApplications] = useState([]);

//   useEffect(() => {
//     const syncSession = () => setSessionState(getSession());
//     syncSession();
//     window.addEventListener('authchange', syncSession);
//     window.addEventListener('storage', syncSession);
//     return () => {
//       window.removeEventListener('authchange', syncSession);
//       window.removeEventListener('storage', syncSession);
//     };
//   }, []);

//   useEffect(() => {
//     if (!session?.email) {
//       setApplications([]);
//       return;
//     }
//     const load = () => setApplications(getApplicationsByEmail(session.email));
//     load();
//     window.addEventListener('applicationschange', load);
//     return () => window.removeEventListener('applicationschange', load);
//   }, [session?.email]);

//   // Not logged in — send to login instead of showing an empty dashboard.
//   if (!session) {
//     return (
//       <div className="flex min-h-[70vh] items-center justify-center px-6" style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}>
//         <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>
//         <div className="max-w-sm rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: GRAY }}>
//           <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
//             <ShieldCheck className="h-7 w-7" style={{ color: BLUE }} />
//           </div>
//           <h2 className="text-[1.3rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Log in to view your applications</h2>
//           <p className="mt-2 text-[13px]" style={{ color: SLATE }}>
//             Sign in to see every loan scheme you've applied for and track its status.
//           </p>
//           <button
//             onClick={() => navigate('/login', { state: { redirectTo: '/my-applications' } })}
//             className="mt-5 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//             style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
//           >
//             Log in <ArrowRight className="h-4 w-4" />
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-[70vh] px-6 py-12 md:px-10" style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}>
//       <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>

//       <div className="mx-auto max-w-3xl">
//         <div className="mb-8">
//           <span
//             className="inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
//             style={{ background: BLUE_PALE, color: BLUE, border: `1px solid ${BLUE_TINT}` }}
//           >
//             My Applications
//           </span>
//           <h1 className="mt-3 text-[1.8rem] font-bold md:text-[2.1rem]" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
//             Every loan you've applied for
//           </h1>
//           <p className="mt-2 text-[13.5px]" style={{ color: SLATE }}>
//             {applications.length > 0
//               ? `You have ${applications.length} application${applications.length > 1 ? 's' : ''} on file, most recent first.`
//               : 'You can apply for as many schemes as you like — they will all show up here.'}
//           </p>
//         </div>

//         {applications.length === 0 ? (
//           <div className="rounded-2xl border bg-white p-10 text-center shadow-sm" style={{ borderColor: GRAY }}>
//             <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
//               <Inbox className="h-7 w-7" style={{ color: BLUE }} />
//             </div>
//             <h3 className="text-[1.1rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>No applications yet</h3>
//             <p className="mx-auto mt-2 max-w-xs text-[13px]" style={{ color: SLATE }}>
//               Browse the loan schemes and hit "Apply Now" on any scheme that fits — as many as you need.
//             </p>
//             <button
//               onClick={() => navigate('/schema')}
//               className="mt-5 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//               style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
//             >
//               Browse Loan Schemes <ArrowRight className="h-4 w-4" />
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {applications.map((app, index) => (
//               <motion.div
//                 key={app.id}
//                 initial={{ opacity: 0, y: 12 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.05 }}
//                 className="rounded-2xl border bg-white p-5 shadow-sm md:p-6"
//                 style={{ borderColor: GRAY }}
//               >
//                 <div className="flex flex-wrap items-start justify-between gap-3">
//                   <div className="min-w-0">
//                     {app.categoryLabel && (
//                       <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>
//                         {app.categoryLabel}
//                       </p>
//                     )}
//                     <h3 className="mt-0.5 text-[1.05rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
//                       {app.schemeTitle || 'Loan Scheme'}
//                     </h3>
//                     {app.parentName && app.parentName !== app.schemeTitle && (
//                       <p className="mt-0.5 flex items-center gap-1.5 text-[12px]" style={{ color: SLATE }}>
//                         <Landmark className="h-3.5 w-3.5" /> Under {app.parentName}
//                       </p>
//                     )}
//                   </div>
//                   <StatusBadge status={app.status} />
//                 </div>

//                 <div className="mt-4 grid grid-cols-1 gap-2.5 border-t pt-4 sm:grid-cols-2" style={{ borderColor: `${GRAY}45` }}>
//                   <DetailChip icon={Banknote} label="Amount requested" value={app.amount ? `₹${Number(app.amount).toLocaleString('en-IN')}` : ''} />
//                   <DetailChip icon={MapPin} label="City" value={app.city} />
//                   <DetailChip icon={FileText} label="Reference ID" value={app.id} />
//                   <DetailChip icon={Calendar} label="Applied on" value={formatDate(app.appliedAt)} />
//                 </div>
//               </motion.div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText, Clock, CheckCircle2, XCircle, Banknote, MapPin, Calendar,
  Landmark, ArrowRight, Inbox, ShieldCheck, Layers,
} from 'lucide-react';
import { getSession, getApplicationsByEmail } from '../utils/auth';

/* ================= BRAND TOKENS =================
   Matches the tokens used across Loanschema.jsx / Navbar.jsx / Register.jsx
   / Profile.jsx so this page feels like part of the same product. */
const NAVY = '#132261';
const BLUE = '#2f76fb';
const BLUE_LIGHT = '#89b6f8';
const BLUE_TINT = '#d9e7f9';
const BLUE_PALE = '#f0f6fc';
const SLATE = '#757e9e';
const GRAY = '#c0bec2';
const TEXT = '#242938';

const FONT_HEAD = "'Poppins', sans-serif";
const FONT_BODY = "'Poppins', sans-serif";

// Status → visual treatment. Every application defaults to 'Pending' the
// moment it's submitted (see utils/auth.js submitApplication); the other
// two states are there so the UI already knows how to render them once a
// real backend starts moving applications through a review pipeline.
const STATUS_STYLES = {
  Pending: { bg: '#fff6e5', text: '#a15c00', border: '#f3d896', bar: '#e8ac1f', icon: Clock, label: 'Pending Review' },
  Approved: { bg: '#e9f7ef', text: '#1a7f4b', border: '#bfe9d2', bar: '#2fa864', icon: CheckCircle2, label: 'Approved' },
  Rejected: { bg: '#fdecea', text: '#c0392b', border: '#f5c6c1', bar: '#d9564a', icon: XCircle, label: 'Rejected' },
};

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const Icon = style.icon;
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-[11.5px] font-bold"
      style={{ background: style.bg, color: style.text, border: `1px solid ${style.border}` }}
    >
      <Icon className="h-3.5 w-3.5" />
      {style.label}
    </span>
  );
}

function DetailChip({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ background: BLUE_PALE }}
      >
        <Icon className="h-3.5 w-3.5" style={{ color: BLUE }} />
      </div>
      <div className="min-w-0">
        <p className="text-[10.5px] font-semibold" style={{ color: SLATE }}>{label}</p>
        <p className="mt-0.5 truncate text-[13px] font-bold" style={{ color: TEXT }}>{value}</p>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, value, label, tint }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border bg-white px-4 py-3"
      style={{ borderColor: GRAY }}
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: tint }}
      >
        <Icon className="h-4 w-4" style={{ color: NAVY }} />
      </div>
      <div className="min-w-0">
        <p className="text-[1.15rem] font-bold leading-none" style={{ color: NAVY, fontFamily: FONT_HEAD }}>{value}</p>
        <p className="mt-1 text-[11px] font-semibold" style={{ color: SLATE }}>{label}</p>
      </div>
    </div>
  );
}

/* ================= HERO ILLUSTRATION =================
   Original geometric artwork — a document with a rising approval
   checkmark, echoing "track your application's progress" without
   reproducing any existing artwork or iconography. Built from the
   same organic-blob language as Profile.jsx's SidebarBlob so the
   two pages read as one product. */
function ApplicationsHeroArt() {
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <circle cx="230" cy="120" r="150" fill="rgba(255,255,255,0.06)" />
      <circle cx="230" cy="120" r="105" fill="rgba(255,255,255,0.07)" />

      {/* stacked application sheets */}
      <rect x="118" y="96" width="112" height="88" rx="10" fill="rgba(255,255,255,0.18)" transform="rotate(-6 118 96)" />
      <rect x="128" y="82" width="112" height="88" rx="10" fill="rgba(255,255,255,0.9)" />
      <rect x="146" y="102" width="60" height="7" rx="3.5" fill={BLUE_TINT} />
      <rect x="146" y="118" width="76" height="7" rx="3.5" fill={BLUE_TINT} />
      <rect x="146" y="134" width="44" height="7" rx="3.5" fill={BLUE_TINT} />

      {/* approval seal */}
      <circle cx="222" cy="150" r="26" fill={BLUE} />
      <path d="M210 150 L219 159 L236 140" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

      {/* progress arc trailing up, echoing "on track" */}
      <path d="M60 190 C 90 190, 95 150, 125 140" stroke="rgba(255,255,255,0.55)" strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray="1 10" />
    </svg>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

export default function MyApplications() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState(() => getSession());
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const syncSession = () => setSessionState(getSession());
    syncSession();
    window.addEventListener('authchange', syncSession);
    window.addEventListener('storage', syncSession);
    return () => {
      window.removeEventListener('authchange', syncSession);
      window.removeEventListener('storage', syncSession);
    };
  }, []);

  useEffect(() => {
    if (!session?.email) {
      setApplications([]);
      return;
    }
    const load = () => setApplications(getApplicationsByEmail(session.email));
    load();
    window.addEventListener('applicationschange', load);
    return () => window.removeEventListener('applicationschange', load);
  }, [session?.email]);

  const counts = useMemo(() => {
    const base = { Pending: 0, Approved: 0, Rejected: 0 };
    applications.forEach((app) => {
      const key = STATUS_STYLES[app.status] ? app.status : 'Pending';
      base[key] += 1;
    });
    return base;
  }, [applications]);

  // Not logged in — send to login instead of showing an empty dashboard.
  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6" style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>
        <div className="max-w-sm rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: GRAY }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
            <ShieldCheck className="h-7 w-7" style={{ color: BLUE }} />
          </div>
          <h2 className="text-[1.3rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Log in to view your applications</h2>
          <p className="mt-2 text-[13px]" style={{ color: SLATE }}>
            Sign in to see every loan scheme you've applied for and track its status.
          </p>
          <button
            onClick={() => navigate('/login', { state: { redirectTo: '/my-applications' } })}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
          >
            Log in <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-4 py-10 md:px-8" style={{ background: '#ffffff', fontFamily: FONT_BODY }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div className="mx-auto max-w-4xl">

        {/* ================= HERO ================= */}
        <div
          className="relative mb-6 overflow-hidden rounded-2xl px-6 py-8 sm:px-10 sm:py-10"
          style={{ background: `linear-gradient(120deg, ${NAVY}, ${BLUE})` }}
        >
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-72 sm:block">
            <ApplicationsHeroArt />
          </div>
          <div className="relative max-w-md">
            <span
              className="inline-block rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.14)', color: '#fff' }}
            >
              My Applications
            </span>
            <h1 className="mt-3 text-[1.6rem] font-bold leading-tight text-white sm:text-[1.9rem]" style={{ fontFamily: FONT_HEAD }}>
              Every loan you've applied for, tracked in one place
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed" style={{ color: BLUE_TINT }}>
              {applications.length > 0
                ? `${applications.length} application${applications.length > 1 ? 's' : ''} on file, most recent first.`
                : 'Apply for as many schemes as you like — they will all show up here.'}
            </p>
          </div>
        </div>

        {/* ================= STAT SUMMARY ================= */}
        {applications.length > 0 && (
          <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatPill icon={Layers} value={applications.length} label="Total filed" tint={BLUE_TINT} />
            <StatPill icon={Clock} value={counts.Pending} label="Pending review" tint="#fff2d4" />
            <StatPill icon={CheckCircle2} value={counts.Approved} label="Approved" tint="#d9f2e3" />
            <StatPill icon={XCircle} value={counts.Rejected} label="Rejected" tint="#fbe1de" />
          </div>
        )}

        {applications.length === 0 ? (
          <div className="rounded-2xl border bg-white p-10 text-center shadow-sm" style={{ borderColor: GRAY }}>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
              <Inbox className="h-7 w-7" style={{ color: BLUE }} />
            </div>
            <h3 className="text-[1.1rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>No applications yet</h3>
            <p className="mx-auto mt-2 max-w-xs text-[13px]" style={{ color: SLATE }}>
              Browse the loan schemes and hit "Apply Now" on any scheme that fits — as many as you need.
            </p>
            <button
              onClick={() => navigate('/schema')}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
              style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
            >
              Browse Loan Schemes <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app, index) => {
              const style = STATUS_STYLES[app.status] || STATUS_STYLES.Pending;
              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex overflow-hidden rounded-2xl border bg-white shadow-sm"
                  style={{ borderColor: GRAY }}
                >
                  <div className="w-1.5 shrink-0" style={{ background: style.bar }} />

                  <div className="min-w-0 flex-1 p-5 md:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        {app.categoryLabel && (
                          <p className="text-[10.5px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>
                            {app.categoryLabel}
                          </p>
                        )}
                        <h3 className="mt-0.5 text-[1.05rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
                          {app.schemeTitle || 'Loan Scheme'}
                        </h3>
                        {app.parentName && app.parentName !== app.schemeTitle && (
                          <p className="mt-0.5 flex items-center gap-1.5 text-[12px]" style={{ color: SLATE }}>
                            <Landmark className="h-3.5 w-3.5" /> Under {app.parentName}
                          </p>
                        )}
                      </div>
                      <StatusBadge status={app.status} />
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t pt-5 sm:grid-cols-2" style={{ borderColor: `${GRAY}45` }}>
                      <DetailChip icon={Banknote} label="Amount requested" value={app.amount ? `₹${Number(app.amount).toLocaleString('en-IN')}` : ''} />
                      <DetailChip icon={MapPin} label="City" value={app.city} />
                      <DetailChip icon={FileText} label="Reference ID" value={app.id} />
                      <DetailChip icon={Calendar} label="Applied on" value={formatDate(app.appliedAt)} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}