import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Users, Calendar, Phone, Mail, MapPin, Landmark, Banknote, Building2,
  Fingerprint, Hash, ShieldCheck, Pencil, Save, X, CheckCircle2, ArrowRight,
  CreditCard, Briefcase, Laptop2, Camera, Upload, Home as HomeIcon, Download,
} from 'lucide-react';
import { getSession, getUserByEmail, updateUserProfile } from '../utils/auth';

/* ================= BRAND TOKENS =================
   Matches the tokens used across Loanschema.jsx / Navbar.jsx / Register.jsx
   so this page feels like part of the same product. */
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

/* ================= BANNER IMAGE SIZING =================
   All 4 section banners render at the SAME fixed display size
   (h-40 / sm:h-48 / md:h-56, full width) regardless of each source
   PNG's native dimensions. object-cover + object-center on every
   banner ensures uniform cropping behavior across all sections —
   no per-section scale/position overrides needed. If a specific
   source image is framed oddly, fix the source asset itself rather
   than compensating with per-section CSS hacks. */

/* ================= SECTION DEFINITIONS =================
   Same fields the Register page collects, grouped identically to the
   Register review step, so the profile reads as "the same application,
   now editable" rather than a different shape of data. */
/* ================= DOCUMENT FIELDS =================
   Same checklist Register.jsx collects at sign-up (identity, address,
   income, bank statement, business proof, photo) — kept in sync here so
   Profile can show, replace, or add whatever was or wasn't uploaded then. */
const DOCUMENT_FIELDS = [
  { key: 'idProof', label: 'Identity Proof', hint: 'PAN / Aadhaar / Voter ID / Passport', icon: Fingerprint, required: true },
  { key: 'addressProof', label: 'Address Proof', hint: 'Utility bill / Rental agreement / Aadhaar', icon: HomeIcon, required: true },
  { key: 'incomeProof', label: 'Income Proof', hint: 'Salary slip / ITR / Form 16', icon: Banknote, required: true },
  { key: 'bankStatement', label: 'Bank Statement', hint: 'Last 6 months statement', icon: Landmark, required: true },
  { key: 'businessProof', label: 'Business Proof', hint: 'Udyam certificate / GST / Shop license', icon: Building2, required: false },
  { key: 'photo', label: 'Passport Size Photo', hint: 'Recent photograph', icon: User, required: true },
];

const SECTION_DEFS = [
  {
    id: 'personal',
    navLabel: 'Personal Details',
    navIcon: User,
    title: 'Personal Details',
    subtitle: 'Your basic information',
    quote: 'Accurate details lead to better opportunities.',
    illustration: 'personal',
    bannerImage: 'Personal_Details_p.png',
    sidebarHeading: ['Your', 'Details'],
    sidebarSubheading: ['Build New', 'Opportunities'],
    sidebarBlurb: 'Complete, accurate details help us serve you faster.',
    fields: [
      { key: 'fullName', label: 'Full Name', icon: User, editable: true },
      { key: 'dob', label: 'Date of Birth', icon: Calendar, type: 'date', editable: true },
      { key: 'mobile', label: 'Mobile Number', icon: Phone, editable: true },
      { key: 'email', label: 'Email Address', icon: Mail, editable: false },
      { key: 'gender', label: 'Gender', icon: Users, editable: true, type: 'select', options: ['Male', 'Female', 'Other'] },
    ],
  },
  {
    id: 'identity',
    navLabel: 'Identity & Address',
    navIcon: Fingerprint,
    title: 'Identity & Address',
    subtitle: 'Documents and where you live',
    quote: 'Verified identity keeps your application moving fast.',
    illustration: 'identity',
    bannerImage: 'Identity_p.png',
    sidebarHeading: ['Your', 'Identity'],
    sidebarSubheading: ['Stays', 'Protected'],
    sidebarBlurb: 'Verified identity and address speed up approval.',
    fields: [
      { key: 'aadhar', label: 'Aadhaar Number', icon: Fingerprint, editable: true },
      { key: 'pan', label: 'PAN Number', icon: Hash, editable: true },
      { key: 'addressLine', label: 'Address', icon: MapPin, editable: true },
      { key: 'city', label: 'City', icon: MapPin, editable: true },
      { key: 'state', label: 'State', icon: MapPin, editable: true },
      { key: 'pincode', label: 'Pincode', icon: MapPin, editable: true },
    ],
  },
  {
    id: 'business',
    navLabel: 'Loan & Business',
    navIcon: Briefcase,
    title: 'Loan & Business',
    subtitle: 'Business and credit details',
    quote: 'A clear financial picture unlocks better loan offers.',
    illustration: 'business',
    bannerImage: 'Loan_p.png',
    sidebarHeading: ['Your', 'Business'],
    sidebarSubheading: ['Our', 'Support'],
    sidebarBlurb: 'Access better loan opportunities with accurate details.',
    fields: [
      { key: 'businessName', label: 'Business Name', icon: Building2, editable: true },
      { key: 'businessType', label: 'Business Type', icon: Briefcase, editable: true },
      { key: 'udyamNumber', label: 'Udyam Number', icon: Hash, editable: true },
      { key: 'gstin', label: 'GSTIN', icon: Hash, editable: true },
      { key: 'monthlyIncome', label: 'Monthly Income', icon: Banknote, editable: true },
      { key: 'hasExistingLoans', label: 'Existing Loans', icon: Banknote, editable: true, type: 'select', options: ['Yes', 'No'] },
      { key: 'existingLoanAmount', label: 'Existing Loan Amount', icon: Banknote, editable: true },
    ],
  },
  {
    id: 'bank',
    navLabel: 'Bank Details',
    navIcon: Landmark,
    title: 'Bank Details',
    subtitle: 'Where funds are disbursed',
    quote: 'Your bank details are encrypted and never shared.',
    illustration: 'bank',
    bannerImage: 'Bank_details_p.png',
    sidebarHeading: ['Your', 'Funds'],
    sidebarSubheading: ['Reach You', 'Safely'],
    sidebarBlurb: 'Your bank details are encrypted and never shared.',
    fields: [
      { key: 'bankName', label: 'Bank Name', icon: Landmark, editable: true },
      { key: 'accountNumber', label: 'Account Number', icon: CreditCard, editable: true },
      { key: 'ifsc', label: 'IFSC Code', icon: Hash, editable: true },
    ],
  },
  {
    id: 'documents',
    navLabel: 'Documents',
    navIcon: Upload,
    title: 'Documents',
    subtitle: 'Identity, income, and business proof on file',
    quote: 'Keeping documents current avoids delays at disbursal.',
    illustration: 'documents',
    // NOTE: reusing the Bank Details banner until a dedicated Documents
    // banner image is dropped into /public/images.
    bannerImage: 'Bank_details_p.png',
    sidebarHeading: ['Your', 'Files'],
    sidebarSubheading: ['Always', 'Ready'],
    sidebarBlurb: 'Up-to-date documents keep approvals moving.',
    fields: DOCUMENT_FIELDS,
  },
];

/* ================= DECORATIVE ILLUSTRATIONS =================
   Small original geometric SVG art (not a reproduction of any existing
   artwork) that echoes the reference layout: a per-section motif next
   to the quote. */
function SectionIllustration({ kind }) {
  const common = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 160 140', className: 'h-full w-full' };
  if (kind === 'identity') {
    return (
      <svg {...common}>
        <circle cx="80" cy="70" r="62" fill={BLUE_PALE} />
        <rect x="30" y="46" width="100" height="64" rx="10" fill="#fff" stroke={BLUE_TINT} strokeWidth="2" />
        <circle cx="55" cy="72" r="14" fill={BLUE} opacity="0.85" />
        <rect x="78" y="62" width="38" height="6" rx="3" fill={BLUE_TINT} />
        <rect x="78" y="74" width="30" height="6" rx="3" fill={BLUE_TINT} />
        <rect x="42" y="94" width="76" height="6" rx="3" fill={BLUE_PALE} stroke={BLUE_TINT} />
      </svg>
    );
  }
  if (kind === 'business') {
    return (
      <svg {...common}>
        <circle cx="80" cy="70" r="62" fill={BLUE_PALE} />
        <rect x="36" y="70" width="18" height="34" rx="3" fill={BLUE_TINT} />
        <rect x="62" y="56" width="18" height="48" rx="3" fill={BLUE_LIGHT} opacity="0.7" />
        <rect x="88" y="40" width="18" height="64" rx="3" fill={BLUE} opacity="0.85" />
        <path d="M36 60 L62 46 L88 34 L112 20" stroke={NAVY} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="112" cy="20" r="4" fill={NAVY} />
      </svg>
    );
  }
  if (kind === 'bank') {
    return (
      <svg {...common}>
        <circle cx="80" cy="70" r="62" fill={BLUE_PALE} />
        <rect x="34" y="92" width="92" height="10" rx="3" fill={NAVY} opacity="0.85" />
        <rect x="40" y="60" width="10" height="30" fill={BLUE_TINT} />
        <rect x="58" y="60" width="10" height="30" fill={BLUE_LIGHT} opacity="0.8" />
        <rect x="76" y="60" width="10" height="30" fill={BLUE_TINT} />
        <rect x="94" y="60" width="10" height="30" fill={BLUE_LIGHT} opacity="0.8" />
        <path d="M32 56 L80 32 L128 56 Z" fill={BLUE} opacity="0.85" />
      </svg>
    );
  }
  if (kind === 'documents') {
    return (
      <svg {...common}>
        <circle cx="80" cy="70" r="62" fill={BLUE_PALE} />
        <rect x="44" y="38" width="72" height="84" rx="8" fill="#fff" stroke={BLUE_TINT} strokeWidth="2" />
        <rect x="56" y="54" width="48" height="6" rx="3" fill={BLUE_TINT} />
        <rect x="56" y="68" width="48" height="6" rx="3" fill={BLUE_TINT} />
        <rect x="56" y="82" width="30" height="6" rx="3" fill={BLUE_TINT} />
        <path d="M92 96 l8 8 16 -18" stroke={BLUE} strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  // 'personal' default
  return (
    <svg {...common}>
      <circle cx="80" cy="70" r="62" fill={BLUE_PALE} />
      <circle cx="80" cy="52" r="20" fill={BLUE} opacity="0.85" />
      <path d="M42 108 c4 -26 18 -38 38 -38 s34 12 38 38 Z" fill={NAVY} opacity="0.9" />
    </svg>
  );
}

/* ================= PROFILE PHOTO =================
   Replaces the decorative "personal" illustration with an actual
   photo slot: a circular avatar the user can click (or click the
   camera badge) to upload and place any image of their choice.
   Falls back to a plain silhouette placeholder until a photo is set. */
function ProfilePhoto({ photoUrl, onPhotoChange }) {
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onPhotoChange(reader.result);
    reader.readAsDataURL(file);
    // allow re-selecting the same file later
    e.target.value = '';
  };

  return (
    <div className="relative h-32 w-32 shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="h-32 w-32 overflow-hidden rounded-full border-4"
        style={{ borderColor: BLUE_PALE, background: BLUE_PALE }}
        aria-label={photoUrl ? 'Change profile photo' : 'Upload profile photo'}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-14 w-14" style={{ color: BLUE_LIGHT }} />
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white shadow-sm"
        style={{ background: BLUE }}
        aria-label="Change photo"
      >
        <Camera className="h-4 w-4 text-white" />
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}

function LeafDecoration() {
  // A thin branching sprig — a central stem with small oval leaves
  // alternating off either side — echoing the reference illustration
  // rather than a solid clover shape.
  const leaf = (cx, cy, rx, ry, rotate) => (
    <ellipse
      cx={cx}
      cy={cy}
      rx={rx}
      ry={ry}
      fill={BLUE_LIGHT}
      opacity="0.85"
      transform={`rotate(${rotate} ${cx} ${cy})`}
    />
  );
  return (
    <svg viewBox="0 0 120 160" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 150 C 58 110, 62 70, 60 30" stroke={BLUE} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
      {leaf(45, 115, 14, 7, -35)}
      {leaf(76, 100, 14, 7, 35)}
      {leaf(42, 80, 13, 6.5, -30)}
      {leaf(78, 65, 13, 6.5, 30)}
      {leaf(45, 48, 11, 5.5, -25)}
      {leaf(60, 24, 10, 16, 0)}
    </svg>
  );
}

function SidebarBlob() {
  // Organic blob shape (not a rectangle) that the sprig + text sit
  // inside, bleeding past the sidebar's left edge like the reference.
  return (
    <svg
      viewBox="0 0 300 300"
      preserveAspectRatio="none"
      className="absolute inset-0 -z-10 h-full w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M150,20 C210,15 270,45 285,105 C298,160 275,220 220,255 C165,288 90,290 45,255 C5,222 -10,160 15,105 C35,55 90,25 150,20 Z"
        fill={BLUE_TINT}
      />
    </svg>
  );
}

function FieldRow({ field, value, editing, onChange }) {
  const Icon = field.icon;

  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
        style={{ background: BLUE_PALE }}
      >
        <Icon className="h-4 w-4" style={{ color: BLUE }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] font-semibold" style={{ color: SLATE }}>{field.label}</p>
        {!editing || !field.editable ? (
          <p className="mt-0.5 truncate text-[14px] font-bold" style={{ color: TEXT }}>
            {value || '—'}
          </p>
        ) : field.type === 'select' ? (
          <select
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="mt-1 w-full rounded-lg border bg-white py-1.5 px-2.5 text-[13px] outline-none transition-all focus:border-blue-500"
            style={{ borderColor: GRAY, fontFamily: FONT_BODY }}
          >
            <option value="">Select</option>
            {field.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type || 'text'}
            value={value || ''}
            onChange={(e) => onChange(field.key, e.target.value)}
            className="mt-1 w-full rounded-lg border py-1.5 px-2.5 text-[13px] outline-none transition-all focus:border-blue-500"
            style={{ borderColor: GRAY, fontFamily: FONT_BODY }}
          />
        )}
      </div>
    </div>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Chrome (and other browsers) will often show a blank tab instead of the
// actual PDF/image when you navigate straight to a `data:` URI — this is
// especially common for base64 data URIs opened via target="_blank".
// `blob:` URLs don't have that problem, so both View and Download decode
// the stored base64 back into a Blob first and act on that instead.
function dataUrlToBlob(dataUrl) {
  const [header, base64] = dataUrl.split(',');
  const mimeMatch = header.match(/data:(.*?);base64/);
  const mime = mimeMatch ? mimeMatch[1] : 'application/octet-stream';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

function openDocument(doc) {
  const blobUrl = URL.createObjectURL(dataUrlToBlob(doc.dataUrl));
  window.open(blobUrl, '_blank');
  // Give the new tab time to actually load the blob before it's revoked.
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

function downloadDocument(doc) {
  const blobUrl = URL.createObjectURL(dataUrlToBlob(doc.dataUrl));
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = doc.name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
}

/* ================= DOCUMENT ROW =================
   Mirrors the upload row from the Register page's Documents step, plus
   a "Replace" action for a document that's already on file. Uploads are
   staged into `form.documents` (via onUpload/onRemove) and only take
   effect when the section's Save button is pressed, same as every other
   editable field on this page. */
function DocumentRow({ field, doc, editing, onUpload, onRemove }) {
  const Icon = field.icon;
  return (
    <div className="flex items-center justify-between gap-3 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg" style={{ background: BLUE_PALE }}>
          <Icon className="h-4 w-4" style={{ color: BLUE }} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold" style={{ color: TEXT }}>
            {field.label}
            {field.required && <span style={{ color: '#c0392b' }}> *</span>}
          </p>
          <p className="truncate text-[11.5px]" style={{ color: SLATE }}>
            {doc ? doc.name : (field.required ? 'Not uploaded' : field.hint)}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {editing && doc?.dataUrl && (
          <button
            type="button"
            onClick={() => openDocument(doc)}
            className="rounded-full border px-3 py-1.5 text-[11.5px] font-semibold"
            style={{ borderColor: BLUE_TINT, color: BLUE }}
          >
            View
          </button>
        )}

        {!editing && doc?.dataUrl && (
          <button
            type="button"
            onClick={() => downloadDocument(doc)}
            className="flex shrink-0 items-center justify-center rounded-full border p-1.5"
            style={{ borderColor: GRAY, color: SLATE }}
            aria-label={`Download ${field.label}`}
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
        )}

        {editing && (
          <label
            className="cursor-pointer rounded-full px-3.5 py-1.5 text-[11.5px] font-semibold text-white"
            style={{ background: NAVY }}
          >
            {doc ? 'Replace' : 'Upload'}
            <input
              type="file"
              accept="image/*,.pdf"
              className="hidden"
              onChange={(e) => e.target.files[0] && onUpload(field.key, e.target.files[0])}
            />
          </label>
        )}

        {editing && doc && (
          <button
            type="button"
            onClick={() => onRemove(field.key)}
            className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
            aria-label={`Remove ${field.label}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [session, setSessionState] = useState(() => getSession());
  const [user, setUser] = useState(null);
  const [activeId, setActiveId] = useState('personal');
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [savedBanner, setSavedBanner] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [docError, setDocError] = useState('');

  // Browser localStorage caps out around 5-10MB per origin for this whole
  // demo "database" (all users, all their documents). Capping each upload
  // client-side keeps a handful of documents well within that budget and
  // gives an immediate, specific error instead of a mysterious failed Save
  // once the quota is actually hit.
  const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024; // 2MB

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
      setUser(null);
      return;
    }
    const record = getUserByEmail(session.email);
    setUser(record);
    setForm(record || {});
  }, [session?.email]);

  if (!session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6" style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>
        <div className="max-w-sm rounded-2xl border bg-white p-8 text-center shadow-sm" style={{ borderColor: GRAY }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full" style={{ background: BLUE_PALE }}>
            <ShieldCheck className="h-7 w-7" style={{ color: BLUE }} />
          </div>
          <h2 className="text-[1.3rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Log in to view your profile</h2>
          <p className="mt-2 text-[13px]" style={{ color: SLATE }}>
            Sign in to see and manage the details you registered with.
          </p>
          <button
            onClick={() => navigate('/login', { state: { redirectTo: '/profile' } })}
            className="mt-5 inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
            style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
          >
            Log in <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  const activeSection = SECTION_DEFS.find((s) => s.id === activeId) || SECTION_DEFS[0];

  const selectSection = (id) => {
    if (editing) cancelEditing();
    setActiveId(id);
  };

  const startEditing = () => {
    setForm(user || {});
    setEditing(true);
    setSavedBanner(false);
    setSaveError('');
    setDocError('');
  };

  const cancelEditing = () => {
    setForm(user || {});
    setEditing(false);
    setSaveError('');
    setDocError('');
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateDocument = async (key, file) => {
    if (file.size > MAX_DOCUMENT_BYTES) {
      setDocError(`"${file.name}" is too large (max 2MB per document). Try a compressed PDF or a resized image.`);
      return;
    }
    setDocError('');
    const dataUrl = await fileToDataUrl(file);
    setForm((prev) => ({
      ...prev,
      documents: { ...(prev.documents || {}), [key]: { name: file.name, type: file.type, dataUrl } },
    }));
  };

  const removeDocument = (key) => {
    setForm((prev) => {
      const nextDocuments = { ...(prev.documents || {}) };
      delete nextDocuments[key];
      return { ...prev, documents: nextDocuments };
    });
  };

  const handleSave = () => {
    const result = updateUserProfile(session.email, form);
    if (result.success) {
      setUser(result.user);
      setForm(result.user);
      setEditing(false);
      setSaveError('');
      setSavedBanner(true);
      setTimeout(() => setSavedBanner(false), 3500);
    } else {
      // Previously this branch didn't exist at all, so a failed save
      // (most commonly the localStorage quota above) just did nothing —
      // the page silently stayed in editing mode with no explanation.
      setSaveError(result.message || 'Could not save your changes. Please try again.');
    }
  };

  const handlePhotoChange = (dataUrl) => {
    const result = updateUserProfile(session.email, { ...(user || {}), photoUrl: dataUrl });
    if (result.success) {
      setUser(result.user);
      setForm(result.user);
      setSaveError('');
    } else {
      setSaveError(result.message || 'Could not save your photo. Please try again.');
    }
  };

  return (
    <div className="min-h-[70vh] px-4 py-10 md:px-8" style={{ background: '#ffffff', fontFamily: FONT_BODY }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');`}</style>

      <div className="mx-auto grid max-w-6xl grid-cols-1 items-stretch gap-6 lg:grid-cols-[230px_1fr]">

        {/* ================= BANNER =================
            Standalone grid item so it can be reordered independently
            of the sidebar and details on mobile. On mobile (single
            column) it renders FIRST because it comes first in the DOM.
            On desktop it's explicitly placed into column 2, row 1,
            next to the sidebar. */}
        <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
          <div className="aspect-[1160/302] w-full overflow-hidden rounded-2xl">
            <img
              key={activeSection.bannerImage}
              src={`/images/${activeSection.bannerImage}`}
              alt={activeSection.title}
              className="h-full w-full object-cover object-center transition-transform duration-150"
            />
          </div>
        </div>

        {/* ================= LEFT SIDEBAR =================
            The whole column — nav list and the decorative blob area —
            now sits inside one bordered card, with only the active nav
            item getting a soft pale-blue pill. Renders SECOND on
            mobile (nav buttons), spans both rows in the sidebar
            column on desktop. */}
        <div
          className="order-2 flex flex-col overflow-hidden rounded-2xl border bg-white lg:order-none lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:sticky lg:top-6"
          style={{ borderColor: GRAY }}
        >
          <nav className="flex flex-nowrap gap-2 overflow-x-auto p-3 lg:flex-col lg:overflow-visible lg:gap-1" style={{ scrollbarWidth: 'none' }}>
            {SECTION_DEFS.map((section) => {
              const Icon = section.navIcon;
              const isActive = section.id === activeId;
              return (
                <button
                  key={section.id}
                  onClick={() => selectSection(section.id)}
                  className="flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-left text-[12.5px] font-semibold transition-colors lg:w-full lg:shrink lg:rounded-xl lg:border-0 lg:px-3.5 lg:py-2.5 lg:text-[13px]"
                  style={{
                    background: isActive ? BLUE_PALE : 'transparent',
                    borderColor: isActive ? BLUE_TINT : GRAY,
                    color: isActive ? BLUE : SLATE,
                  }}
                >
                  <Icon className="h-4 w-4 shrink-0" style={{ color: isActive ? BLUE : SLATE }} />
                  {section.navLabel}
                </button>
              );
            })}
          </nav>

          {/* Decorative blob — its heading and blurb change to match
              whichever section is currently selected. Pinned to the
              bottom of the card, filling its width edge-to-edge now
              that the whole sidebar is a single contained card. */}
          <div className="relative mt-auto hidden h-72 pt-8 lg:block">
            <SidebarBlob />
            <div className="relative flex h-full flex-col items-center justify-center px-8 text-left md:items-start md:pl-10">
              <div className="h-16 w-16">
                <LeafDecoration />
              </div>
              <div className="mt-2">
                <p className="text-[1rem] font-bold leading-snug" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
                  {activeSection.sidebarHeading[0]}<br />{activeSection.sidebarHeading[1]}
                </p>
                <p className="mt-0.5 text-[1rem] font-medium leading-snug" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
                  {activeSection.sidebarSubheading[0]}<br />{activeSection.sidebarSubheading[1]}
                </p>
                <div className="mt-3 h-[3px] w-10 rounded-full" style={{ background: BLUE }} />
                <p className="mt-3 max-w-[10rem] text-[12px] leading-relaxed" style={{ color: SLATE }}>
                  {activeSection.sidebarBlurb}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= DETAILS COLUMN =================
            Renders THIRD on mobile (below nav buttons). On desktop
            it's explicitly placed into column 2, row 2, directly
            under the banner. */}
        <div className="order-3 min-w-0 lg:order-none lg:col-start-2 lg:row-start-2">

          {savedBanner && (
            <div
              className="mb-5 flex items-center gap-2 rounded-lg p-3 text-[12.5px] font-semibold"
              style={{ background: '#e9f7ef', color: '#1a7f4b', border: '1px solid #bfe9d2' }}
            >
              <CheckCircle2 className="h-4 w-4" /> Your profile has been updated successfully.
            </div>
          )}

          {saveError && (
            <div
              className="mb-5 flex items-start gap-2 rounded-lg p-3 text-[12.5px] font-semibold"
              style={{ background: '#fdecea', color: '#c0392b', border: '1px solid #f6c6c0' }}
            >
              <X className="mt-0.5 h-4 w-4 shrink-0" /> {saveError}
            </div>
          )}

          {/* Section card */}
          <div className="rounded-2xl border bg-white p-6 shadow-sm md:p-7" style={{ borderColor: GRAY }}>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_190px]">

              {/* Fields column */}
              <div className="order-2 lg:order-none">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-[1.15rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
                      {activeSection.title}
                    </h2>
                    <p className="mt-0.5 text-[12.5px]" style={{ color: SLATE }}>{activeSection.subtitle}</p>
                  </div>

                  {!editing ? (
                    <button
                      onClick={startEditing}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-[12.5px] font-semibold transition-colors"
                      style={{ borderColor: BLUE_TINT, color: BLUE, background: BLUE_PALE }}
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                  ) : (
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        onClick={cancelEditing}
                        className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12.5px] font-semibold"
                        style={{ borderColor: GRAY, color: SLATE }}
                      >
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-semibold text-white"
                        style={{ background: NAVY }}
                      >
                        <Save className="h-3.5 w-3.5" /> Save
                      </button>
                    </div>
                  )}
                </div>

                {activeSection.id === 'documents' ? (
                  <>
                    {docError && (
                      <p className="mb-3 text-[11.5px] font-semibold" style={{ color: '#c0392b' }}>
                        {docError}
                      </p>
                    )}
                    <div className="divide-y" style={{ borderColor: `${GRAY}45` }}>
                      {DOCUMENT_FIELDS.map((field) => (
                        <DocumentRow
                          key={field.key}
                          field={field}
                          doc={(editing ? form.documents : user?.documents)?.[field.key]}
                          editing={editing}
                          onUpload={updateDocument}
                          onRemove={removeDocument}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
                    {activeSection.fields.map((field) => (
                      <FieldRow
                        key={field.key}
                        field={field}
                        value={editing ? form[field.key] : user?.[field.key]}
                        editing={editing}
                        onChange={updateField}
                      />
                    ))}
                  </div>
                )}

                {editing && activeSection.id !== 'documents' && (
                  <div className="mt-5 flex items-start gap-2 rounded-lg p-3 text-[11.5px]" style={{ background: BLUE_PALE, color: SLATE }}>
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLUE }} />
                    Your email address is your login ID and can't be changed here.
                  </div>
                )}
              </div>

              {/* Decorative + quote column — now visible on mobile too
                  (order-1, shown above the fields) instead of being
                  hidden below the lg breakpoint. Desktop keeps its
                  original position as the right-hand column. */}
              <div className="order-1 flex flex-col items-center justify-between pb-6 lg:order-none lg:pb-0">
                {activeSection.id === 'personal' ? (
                  <ProfilePhoto photoUrl={user?.photoUrl} onPhotoChange={handlePhotoChange} />
                ) : (
                  <div className="h-32 w-32">
                    <SectionIllustration kind={activeSection.illustration} />
                  </div>
                )}
                <div className="mt-4 text-center">
                  <p className="text-[12.5px] italic leading-snug" style={{ color: SLATE, fontFamily: 'Georgia, serif' }}>
                    "{activeSection.quote}"
                  </p>
                  <div className="mx-auto mt-2 h-[2px] w-8" style={{ background: BLUE }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}