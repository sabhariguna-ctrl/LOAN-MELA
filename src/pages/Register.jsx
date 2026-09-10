// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import {
// //   User, Calendar, Phone, Mail, MapPin, Landmark, Banknote, Building2,
// //   Briefcase, Upload, CheckCircle2, ArrowRight, ArrowLeft, X, FileText,
// //   CreditCard, Users, ShieldCheck, Fingerprint, Home as HomeIcon, Hash, Lock,
// // } from 'lucide-react';
// // import { registerUser } from '../utils/auth';

// // /* ================= BRAND TOKENS =================
// //    Matches the tokens used across Loanschema.jsx / Navbar.jsx / Footer.jsx
// //    so this modal feels like part of the same product, not a bolt-on. */
// // const NAVY = '#132261';
// // const BLUE = '#2f76fb';
// // const BLUE_TINT = '#d9e7f9';
// // const BLUE_PALE = '#f0f6fc';
// // const SLATE = '#757e9e';
// // const GRAY = '#c0bec2';
// // const WHITE = '#fdfdfd';
// // const TEXT = '#242938';
// // const RED = '#c0392b';

// // const FONT_HEAD = "'Poppins', sans-serif";
// // const FONT_BODY = "'Poppins', sans-serif";
// // const EASE = [0.22, 1, 0.36, 1];

// // const STEPS = [
// //   { title: 'Personal', icon: User },
// //   { title: 'Identity & Address', icon: Fingerprint },
// //   { title: 'Loan & Business', icon: Briefcase },
// //   { title: 'Documents', icon: Upload },
// //   { title: 'Review', icon: ShieldCheck },
// // ];

// // // Document checklist reflects what Indian lenders actually ask for on an
// // // MSME / business loan application: KYC, address, income and business
// // // legitimacy proof, plus bank statements — not just a generic "upload file".
// // const DOCUMENT_FIELDS = [
// //   { key: 'idProof', label: 'Identity Proof', hint: 'PAN / Aadhaar / Voter ID / Passport', icon: Fingerprint, required: true },
// //   { key: 'addressProof', label: 'Address Proof', hint: 'Utility bill / Rental agreement / Aadhaar', icon: HomeIcon, required: true },
// //   { key: 'incomeProof', label: 'Income Proof', hint: 'Salary slip / ITR / Form 16', icon: Banknote, required: true },
// //   { key: 'bankStatement', label: 'Bank Statement', hint: 'Last 6 months statement', icon: Landmark, required: true },
// //   { key: 'businessProof', label: 'Business Proof', hint: 'Udyam certificate / GST / Shop license', icon: Building2, required: false },
// //   { key: 'photo', label: 'Passport Size Photo', hint: 'Recent photograph', icon: User, required: true },
// // ];

// // const emptyForm = {
// //   fullName: '', dob: '', gender: '', mobile: '', email: '',
// //   password: '', confirmPassword: '',
// //   aadhar: '', pan: '', addressLine: '', city: '', state: '', pincode: '',
// //   businessName: '', businessType: '',
// //   udyamNumber: '', gstin: '', yearsInOperation: '', monthlyIncome: '',
// //   hasExistingLoans: '', existingLoanAmount: '',
// //   bankName: '', accountNumber: '', ifsc: '',
// // };

// // function Field({ label, error, children }) {
// //   return (
// //     <div>
// //       <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>{label}</label>
// //       {children}
// //       {error && <p className="mt-1 text-[11px]" style={{ color: RED }}>{error}</p>}
// //     </div>
// //   );
// // }

// // function InputWithIcon({ icon: Icon, error, ...props }) {
// //   return (
// //     <div className="relative">
// //       <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
// //       <input
// //         {...props}
// //         className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
// //         style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY }}
// //       />
// //     </div>
// //   );
// // }

// // function SelectWithIcon({ icon: Icon, error, children, ...props }) {
// //   return (
// //     <div className="relative">
// //       <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
// //       <select
// //         {...props}
// //         className="w-full appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
// //         style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY, color: props.value ? TEXT : '#94a3b8' }}
// //       >
// //         {children}
// //       </select>
// //     </div>
// //   );
// // }

// // /**
// //  * Register — a routed page at /register (not a popup).
// //  * Link to it with <Link to="/register"> or navigate('/register').
// //  */
// // export default function Register() {
// //   const navigate = useNavigate();
// //   const [step, setStep] = useState(0);
// //   const [direction, setDirection] = useState(1);
// //   const [form, setForm] = useState(emptyForm);
// //   const [files, setFiles] = useState({});
// //   const [errors, setErrors] = useState({});
// //   const [submitted, setSubmitted] = useState(false);
// //   const [referenceId, setReferenceId] = useState('');

// //   const resetAndClose = () => {
// //     navigate('/');
// //   };

// //   const update = (field, value) => {
// //     setForm((prev) => ({ ...prev, [field]: value }));
// //     setErrors((prev) => ({ ...prev, [field]: undefined }));
// //   };

// //   const updateFile = (field, file) => {
// //     setFiles((prev) => ({ ...prev, [field]: file }));
// //     setErrors((prev) => ({ ...prev, [field]: undefined }));
// //   };

// //   const removeFile = (field) => {
// //     setFiles((prev) => {
// //       const next = { ...prev };
// //       delete next[field];
// //       return next;
// //     });
// //   };

// //   const validateStep = (index) => {
// //     const e = {};

// //     if (index === 0) {
// //       if (!form.fullName.trim()) e.fullName = 'Full name is required';
// //       if (!form.dob) e.dob = 'Date of birth is required';
// //       if (!form.gender) e.gender = 'Please select gender';
// //       if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
// //       if (!form.email.trim()) e.email = 'Email is required';
// //       else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
// //       if (!form.password) e.password = 'Please create a password';
// //       else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
// //       if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
// //       else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
// //     }

// //     if (index === 1) {
// //       if (!/^\d{12}$/.test(form.aadhar.trim())) e.aadhar = 'Enter a valid 12-digit Aadhaar number';
// //       if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.trim().toUpperCase())) e.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
// //       if (!form.addressLine.trim()) e.addressLine = 'Address is required';
// //       if (!form.city.trim()) e.city = 'City is required';
// //       if (!form.state.trim()) e.state = 'State is required';
// //       if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
// //     }

// //     if (index === 2) {
// //       if (!form.businessType) e.businessType = 'Please select an option';
// //       if (!form.monthlyIncome.trim()) e.monthlyIncome = 'Monthly income is required';
// //       if (!form.hasExistingLoans) e.hasExistingLoans = 'Please select an option';
// //       if (form.hasExistingLoans === 'Yes' && !form.existingLoanAmount.trim()) {
// //         e.existingLoanAmount = 'Enter the existing loan amount';
// //       }
// //     }

// //     if (index === 3) {
// //       if (!form.bankName.trim()) e.bankName = 'Bank name is required';
// //       if (!/^\d{9,18}$/.test(form.accountNumber.trim())) e.accountNumber = 'Enter a valid account number';
// //       if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim().toUpperCase())) e.ifsc = 'Enter a valid IFSC code';
// //       DOCUMENT_FIELDS.forEach(({ key, required }) => {
// //         if (required && !files[key]) e[key] = 'Required';
// //       });
// //     }

// //     setErrors(e);
// //     return Object.keys(e).length === 0;
// //   };

// //   const goNext = () => {
// //     if (!validateStep(step)) return;
// //     setDirection(1);
// //     setStep((s) => Math.min(s + 1, STEPS.length - 1));
// //   };

// //   const goBack = () => {
// //     setDirection(-1);
// //     setStep((s) => Math.max(s - 1, 0));
// //   };

// //   const handleSubmit = () => {
// //     const result = registerUser(form);

// //     if (!result.success) {
// //       // Duplicate email — send the user back to step 0 so they can see
// //       // the problem next to the field that caused it.
// //       setErrors({ email: result.message });
// //       setStep(0);
// //       return;
// //     }

// //     const ref = 'LM' + Math.floor(100000 + Math.random() * 900000);
// //     setReferenceId(ref);
// //     setSubmitted(true);
// //   };

// //   const progressPct = ((step + 1) / STEPS.length) * 100;

// //   return (
// //     <div
// //       className="min-h-screen w-full"
// //       style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}
// //     >
// //       {/* Full-bleed banner instead of a floating card header */}
// //       <div
// //         className="w-full px-4 py-8 sm:py-10"
// //         style={{ background: `linear-gradient(115deg, ${NAVY} 0%, #1b3583 45%, ${BLUE} 100%)` }}
// //       >
// //         <div className="mx-auto max-w-2xl">
// //           <div className="mb-4 flex items-center gap-2 text-[13px] font-medium">
// //             <button onClick={() => navigate('/')} className="text-white/60 transition-colors hover:text-white">Home</button>
// //             <ArrowRight className="h-3.5 w-3.5 text-white/40" />
// //             <span className="font-semibold text-white">Register</span>
// //           </div>

// //           <span
// //             className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-semibold backdrop-blur-md"
// //             style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
// //           >
// //             <Landmark className="h-3.5 w-3.5" />
// //             Loan Application Registration
// //           </span>
// //           <h2 className="mt-3 text-[1.5rem] font-bold sm:text-[1.7rem]" style={{ color: WHITE, fontFamily: FONT_HEAD }}>
// //             Register your loan application
// //           </h2>
// //         </div>
// //       </div>

// //       <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
// //           {submitted ? (
// //               <div className="py-6 text-center">
// //                 <motion.div
// //                   initial={{ scale: 0 }}
// //                   animate={{ scale: 1 }}
// //                   transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
// //                   className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
// //                   style={{ background: '#e9f7ef' }}
// //                 >
// //                   <CheckCircle2 className="h-8 w-8" style={{ color: '#1a7f4b' }} />
// //                 </motion.div>

// //                 <h2 className="text-[1.4rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
// //                   Registration Submitted
// //                 </h2>

// //                 <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed" style={{ color: SLATE }}>
// //                   Thanks, {form.fullName.split(' ')[0]}. Your loan application has been received
// //                   and your account has been created. Our team will review your details and
// //                   contact you on <strong style={{ color: TEXT }}>{form.mobile}</strong> within
// //                   24-48 hours.
// //                 </p>

// //                 <div
// //                   className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
// //                   style={{ background: BLUE_PALE, color: NAVY, border: `1px solid ${BLUE_TINT}` }}
// //                 >
// //                   Reference ID: <span style={{ color: BLUE }}>{referenceId}</span>
// //                 </div>

// //                 <button
// //                   onClick={() => navigate('/login')}
// //                   className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
// //                   style={{ background: NAVY }}
// //                 >
// //                   Continue to Login
// //                 </button>
// //               </div>
// //             ) : (
// //               <>
// //                 {/* Stepper */}
// //                 <div className="pb-5">
// //                   <div className="mb-2.5 flex items-center justify-between">
// //                     {STEPS.map((s, i) => {
// //                       const Icon = s.icon;
// //                       const active = i === step;
// //                       const done = i < step;
// //                       return (
// //                         <div key={s.title} className="flex flex-1 flex-col items-center">
// //                           <div
// //                             className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all"
// //                             style={{
// //                               background: done || active ? BLUE : WHITE,
// //                               color: done || active ? WHITE : SLATE,
// //                               border: `2px solid ${done || active ? BLUE : GRAY}`,
// //                             }}
// //                           >
// //                             {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
// //                           </div>
// //                           <span
// //                             className="mt-1 hidden text-center text-[9.5px] font-semibold leading-tight sm:block"
// //                             style={{ color: active ? NAVY : SLATE }}
// //                           >
// //                             {s.title}
// //                           </span>
// //                         </div>
// //                       );
// //                     })}
// //                   </div>
// //                   <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: BLUE_TINT }}>
// //                     <motion.div
// //                       className="h-full rounded-full"
// //                       style={{ background: `linear-gradient(90deg, ${NAVY}, ${BLUE})` }}
// //                       animate={{ width: `${progressPct}%` }}
// //                       transition={{ duration: 0.4, ease: EASE }}
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="h-px w-full" style={{ background: `${GRAY}45` }} />

// //                 {/* Form body */}
// //                 <div className="py-6">
// //                   <AnimatePresence mode="wait" custom={direction}>
// //                     <motion.div
// //                       key={step}
// //                       custom={direction}
// //                       initial={{ opacity: 0, x: direction * 24 }}
// //                       animate={{ opacity: 1, x: 0 }}
// //                       exit={{ opacity: 0, x: direction * -24 }}
// //                       transition={{ duration: 0.3, ease: EASE }}
// //                     >
// //                       {/* ===== STEP 0: PERSONAL ===== */}
// //                       {step === 0 && (
// //                         <div className="space-y-4">
// //                           <Field label="Full Name" error={errors.fullName}>
// //                             <InputWithIcon icon={User} error={errors.fullName} type="text" placeholder="e.g. Surega R"
// //                               value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
// //                           </Field>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Date of Birth" error={errors.dob}>
// //                               <InputWithIcon icon={Calendar} error={errors.dob} type="date"
// //                                 value={form.dob} onChange={(e) => update('dob', e.target.value)} />
// //                             </Field>

// //                             <Field label="Gender" error={errors.gender}>
// //                               <SelectWithIcon icon={Users} error={errors.gender}
// //                                 value={form.gender} onChange={(e) => update('gender', e.target.value)}>
// //                                 <option value="">Select gender</option>
// //                                 <option>Male</option>
// //                                 <option>Female</option>
// //                                 <option>Other</option>
// //                               </SelectWithIcon>
// //                             </Field>
// //                           </div>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Mobile Number" error={errors.mobile}>
// //                               <InputWithIcon icon={Phone} error={errors.mobile} type="tel" placeholder="10-digit mobile number"
// //                                 value={form.mobile}
// //                                 onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
// //                             </Field>

// //                             <Field label="Email Address" error={errors.email}>
// //                               <InputWithIcon icon={Mail} error={errors.email} type="email" placeholder="you@example.com"
// //                                 value={form.email} onChange={(e) => update('email', e.target.value)} />
// //                             </Field>
// //                           </div>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Create Password" error={errors.password}>
// //                               <InputWithIcon icon={Lock} error={errors.password} type="password" placeholder="At least 6 characters"
// //                                 value={form.password} onChange={(e) => update('password', e.target.value)} />
// //                             </Field>

// //                             <Field label="Confirm Password" error={errors.confirmPassword}>
// //                               <InputWithIcon icon={Lock} error={errors.confirmPassword} type="password" placeholder="Re-enter password"
// //                                 value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
// //                             </Field>
// //                           </div>
// //                         </div>
// //                       )}

// //                       {/* ===== STEP 1: IDENTITY & ADDRESS ===== */}
// //                       {step === 1 && (
// //                         <div className="space-y-4">
// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Aadhaar Number" error={errors.aadhar}>
// //                               <InputWithIcon icon={Fingerprint} error={errors.aadhar} type="text" placeholder="12-digit Aadhaar number"
// //                                 value={form.aadhar}
// //                                 onChange={(e) => update('aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} />
// //                             </Field>

// //                             <Field label="PAN Number" error={errors.pan}>
// //                               <InputWithIcon icon={CreditCard} error={errors.pan} type="text" placeholder="ABCDE1234F"
// //                                 value={form.pan}
// //                                 onChange={(e) => update('pan', e.target.value.toUpperCase().slice(0, 10))} />
// //                             </Field>
// //                           </div>

// //                           <Field label="Address" error={errors.addressLine}>
// //                             <InputWithIcon icon={MapPin} error={errors.addressLine} type="text" placeholder="House no, street, locality"
// //                               value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} />
// //                           </Field>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
// //                             <Field label="City" error={errors.city}>
// //                               <InputWithIcon icon={Building2} error={errors.city} type="text" placeholder="Chennai"
// //                                 value={form.city} onChange={(e) => update('city', e.target.value)} />
// //                             </Field>

// //                             <Field label="State" error={errors.state}>
// //                               <InputWithIcon icon={MapPin} error={errors.state} type="text" placeholder="Tamil Nadu"
// //                                 value={form.state} onChange={(e) => update('state', e.target.value)} />
// //                             </Field>

// //                             <Field label="Pincode" error={errors.pincode}>
// //                               <InputWithIcon icon={MapPin} error={errors.pincode} type="text" placeholder="600001"
// //                                 value={form.pincode}
// //                                 onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
// //                             </Field>
// //                           </div>
// //                         </div>
// //                       )}

// //                       {/* ===== STEP 2: LOAN & BUSINESS ===== */}
// //                       {step === 2 && (
// //                         <div className="space-y-4">
// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Business / Enterprise Name (optional)">
// //                               <InputWithIcon icon={Building2} type="text" placeholder="e.g. Surega Textiles"
// //                                 value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
// //                             </Field>

// //                             <Field label="Business Type" error={errors.businessType}>
// //                               <SelectWithIcon icon={Briefcase} error={errors.businessType}
// //                                 value={form.businessType} onChange={(e) => update('businessType', e.target.value)}>
// //                                 <option value="">Select type</option>
// //                                 <option>Sole Proprietorship</option>
// //                                 <option>Partnership</option>
// //                                 <option>Private Limited</option>
// //                                 <option>Not Applicable</option>
// //                               </SelectWithIcon>
// //                             </Field>
// //                           </div>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Udyam Registration Number (optional)">
// //                               <InputWithIcon icon={Hash} type="text" placeholder="UDYAM-XX-00-0000000"
// //                                 value={form.udyamNumber} onChange={(e) => update('udyamNumber', e.target.value.toUpperCase())} />
// //                             </Field>

// //                             <Field label="GSTIN (optional)">
// //                               <InputWithIcon icon={FileText} type="text" placeholder="15-digit GST number"
// //                                 value={form.gstin} onChange={(e) => update('gstin', e.target.value.toUpperCase().slice(0, 15))} />
// //                             </Field>
// //                           </div>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Years in Business / Operation (optional)">
// //                               <InputWithIcon icon={Calendar} type="text" placeholder="e.g. 3"
// //                                 value={form.yearsInOperation}
// //                                 onChange={(e) => update('yearsInOperation', e.target.value.replace(/\D/g, ''))} />
// //                             </Field>

// //                             <Field label="Monthly Income (₹)" error={errors.monthlyIncome}>
// //                               <InputWithIcon icon={Banknote} error={errors.monthlyIncome} type="text" placeholder="25000"
// //                                 value={form.monthlyIncome}
// //                                 onChange={(e) => update('monthlyIncome', e.target.value.replace(/\D/g, ''))} />
// //                             </Field>
// //                           </div>

// //                           <Field label="Do you have any existing loans?" error={errors.hasExistingLoans}>
// //                             <div className="flex gap-3">
// //                               {['Yes', 'No'].map((opt) => (
// //                                 <button
// //                                   type="button"
// //                                   key={opt}
// //                                   onClick={() => update('hasExistingLoans', opt)}
// //                                   className="flex-1 rounded-lg border py-2.5 text-[13px] font-semibold transition-all"
// //                                   style={{
// //                                     borderColor: form.hasExistingLoans === opt ? BLUE : GRAY,
// //                                     background: form.hasExistingLoans === opt ? BLUE_PALE : WHITE,
// //                                     color: form.hasExistingLoans === opt ? NAVY : SLATE,
// //                                   }}
// //                                 >
// //                                   {opt}
// //                                 </button>
// //                               ))}
// //                             </div>
// //                           </Field>

// //                           {form.hasExistingLoans === 'Yes' && (
// //                             <Field label="Existing Loan Amount (₹)" error={errors.existingLoanAmount}>
// //                               <InputWithIcon icon={Banknote} error={errors.existingLoanAmount} type="text" placeholder="100000"
// //                                 value={form.existingLoanAmount}
// //                                 onChange={(e) => update('existingLoanAmount', e.target.value.replace(/\D/g, ''))} />
// //                             </Field>
// //                           )}
// //                         </div>
// //                       )}

// //                       {/* ===== STEP 3: DOCUMENTS ===== */}
// //                       {step === 3 && (
// //                         <div className="space-y-4">
// //                           <Field label="Bank Name" error={errors.bankName}>
// //                             <InputWithIcon icon={Landmark} error={errors.bankName} type="text" placeholder="e.g. Central Bank of India"
// //                               value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
// //                           </Field>

// //                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
// //                             <Field label="Account Number" error={errors.accountNumber}>
// //                               <InputWithIcon icon={CreditCard} error={errors.accountNumber} type="text" placeholder="Bank account number"
// //                                 value={form.accountNumber}
// //                                 onChange={(e) => update('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))} />
// //                             </Field>

// //                             <Field label="IFSC Code" error={errors.ifsc}>
// //                               <InputWithIcon icon={ShieldCheck} error={errors.ifsc} type="text" placeholder="e.g. CBIN0284012"
// //                                 value={form.ifsc} onChange={(e) => update('ifsc', e.target.value.toUpperCase().slice(0, 11))} />
// //                             </Field>
// //                           </div>

// //                           <div className="mt-2 h-px w-full" style={{ background: BLUE_TINT }} />

// //                           <p className="text-[12.5px] font-semibold" style={{ color: NAVY }}>Upload Documents</p>
// //                           <p className="text-[11.5px]" style={{ color: SLATE }}>
// //                             These are what a lender checks before sanctioning a loan — identity, address, income, and a bank statement are mandatory. Business proof is required only if you're borrowing for a registered business.
// //                           </p>

// //                           <div className="divide-y" style={{ borderColor: `${GRAY}45` }}>
// //                             {DOCUMENT_FIELDS.map(({ key, label, hint, icon: Icon, required }) => {
// //                               const file = files[key];
// //                               return (
// //                                 <div
// //                                   key={key}
// //                                   className="flex items-center justify-between gap-3 py-3"
// //                                   style={{ borderColor: `${GRAY}45` }}
// //                                 >
// //                                   <div className="flex min-w-0 items-center gap-3">
// //                                     <div
// //                                       className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
// //                                       style={{ background: BLUE_PALE }}
// //                                     >
// //                                       <Icon className="h-4 w-4" style={{ color: BLUE }} />
// //                                     </div>
// //                                     <div className="min-w-0">
// //                                       <p className="truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
// //                                         {label}{required && <span style={{ color: RED }}> *</span>}
// //                                       </p>
// //                                       <p className="truncate text-[11px]" style={{ color: errors[key] ? RED : SLATE }}>
// //                                         {file ? file.name : (errors[key] ? 'Required' : hint)}
// //                                       </p>
// //                                     </div>
// //                                   </div>

// //                                   {file ? (
// //                                     <button
// //                                       type="button"
// //                                       onClick={() => removeFile(key)}
// //                                       className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
// //                                     >
// //                                       <X className="h-4 w-4" />
// //                                     </button>
// //                                   ) : (
// //                                     <label
// //                                       className="shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white"
// //                                       style={{ background: NAVY }}
// //                                     >
// //                                       Upload
// //                                       <input
// //                                         type="file"
// //                                         accept="image/*,.pdf"
// //                                         className="hidden"
// //                                         onChange={(e) => e.target.files[0] && updateFile(key, e.target.files[0])}
// //                                       />
// //                                     </label>
// //                                   )}
// //                                 </div>
// //                               );
// //                             })}
// //                           </div>
// //                         </div>
// //                       )}

// //                       {/* ===== STEP 4: REVIEW ===== */}
// //                       {step === 4 && (
// //                         <div className="space-y-4">
// //                           <ReviewSection title="Personal Details">
// //                             <ReviewRow label="Name" value={form.fullName} />
// //                             <ReviewRow label="DOB" value={form.dob} />
// //                             <ReviewRow label="Gender" value={form.gender} />
// //                             <ReviewRow label="Mobile" value={form.mobile} />
// //                             <ReviewRow label="Email" value={form.email} />
// //                           </ReviewSection>

// //                           <ReviewSection title="Identity & Address">
// //                             <ReviewRow label="Aadhaar" value={form.aadhar} />
// //                             <ReviewRow label="PAN" value={form.pan} />
// //                             <ReviewRow label="Address" value={`${form.addressLine}, ${form.city}, ${form.state} - ${form.pincode}`} />
// //                           </ReviewSection>

// //                           <ReviewSection title="Loan & Business">
// //                             <ReviewRow label="Business Name" value={form.businessName || '—'} />
// //                             <ReviewRow label="Business Type" value={form.businessType} />
// //                             <ReviewRow label="Udyam No." value={form.udyamNumber || '—'} />
// //                             <ReviewRow label="GSTIN" value={form.gstin || '—'} />
// //                             <ReviewRow label="Monthly Income" value={form.monthlyIncome && `₹${form.monthlyIncome}`} />
// //                             <ReviewRow label="Existing Loans" value={form.hasExistingLoans === 'Yes' ? `Yes (₹${form.existingLoanAmount})` : 'No'} />
// //                           </ReviewSection>

// //                           <ReviewSection title="Bank Details">
// //                             <ReviewRow label="Bank" value={form.bankName} />
// //                             <ReviewRow label="Account No." value={form.accountNumber} />
// //                             <ReviewRow label="IFSC" value={form.ifsc} />
// //                           </ReviewSection>

// //                           <ReviewSection title="Documents">
// //                             {DOCUMENT_FIELDS.map(({ key, label }) => (
// //                               <ReviewRow key={key} label={label} value={files[key] ? files[key].name : 'Not uploaded'} />
// //                             ))}
// //                           </ReviewSection>

// //                           <div
// //                             className="flex items-start gap-2 rounded-lg p-3 text-[11.5px]"
// //                             style={{ background: BLUE_PALE, color: SLATE }}
// //                           >
// //                             <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLUE }} />
// //                             By submitting, you confirm that the details provided above are accurate to the best of your knowledge.
// //                           </div>
// //                         </div>
// //                       )}
// //                     </motion.div>
// //                   </AnimatePresence>
// //                 </div>

// //                 {/* Navigation */}
// //                 <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: `${GRAY}45` }}>
// //                   <button
// //                     type="button"
// //                     onClick={step === 0 ? resetAndClose : goBack}
// //                     className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline"
// //                     style={{ color: SLATE }}
// //                   >
// //                     <ArrowLeft className="h-4 w-4" />
// //                     {step === 0 ? 'Cancel' : 'Back'}
// //                   </button>

// //                   {step < STEPS.length - 1 ? (
// //                     <button
// //                       type="button"
// //                       onClick={goNext}
// //                       className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
// //                       style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
// //                     >
// //                       Continue
// //                       <ArrowRight className="h-4 w-4" />
// //                     </button>
// //                   ) : (
// //                     <button
// //                       type="button"
// //                       onClick={handleSubmit}
// //                       className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
// //                       style={{ background: NAVY }}
// //                     >
// //                       Submit Application
// //                       <CheckCircle2 className="h-4 w-4" />
// //                     </button>
// //                   )}
// //                 </div>
// //               </>
// //             )}
// //       </div>
// //     </div>
// //   );
// // }

// // function ReviewSection({ title, children }) {
// //   return (
// //     <div className="border-b pb-4" style={{ borderColor: `${GRAY}45` }}>
// //       <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>{title}</p>
// //       <div className="space-y-1.5">{children}</div>
// //     </div>
// //   );
// // }

// // function ReviewRow({ label, value }) {
// //   return (
// //     <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
// //       <span style={{ color: SLATE }}>{label}</span>
// //       <span className="text-right font-semibold" style={{ color: TEXT }}>{value || '—'}</span>
// //     </div>
// //   );
// // }


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   User, Calendar, Phone, Mail, MapPin, Landmark, Banknote, Building2,
//   Briefcase, Upload, CheckCircle2, ArrowRight, ArrowLeft, X, FileText,
//   CreditCard, Users, ShieldCheck, Fingerprint, Home as HomeIcon, Hash, Lock, Sparkles,
// } from 'lucide-react';
// import { registerUser } from '../utils/auth';

// /* ================= BRAND TOKENS =================
//    Matches the tokens used across Loanschema.jsx / Navbar.jsx / Footer.jsx
//    so this modal feels like part of the same product, not a bolt-on. */
// const NAVY = '#132261';
// const BLUE = '#2f76fb';
// const BLUE_LIGHT = '#89b6f8';
// const BLUE_TINT = '#d9e7f9';
// const BLUE_PALE = '#f0f6fc';
// const SLATE = '#757e9e';
// const GRAY = '#c0bec2';
// const WHITE = '#fdfdfd';
// const TEXT = '#242938';
// const RED = '#c0392b';

// const FONT_HEAD = "'Poppins', sans-serif";
// const FONT_BODY = "'Poppins', sans-serif";
// const EASE = [0.22, 1, 0.36, 1];

// const STEPS = [
//   { title: 'Personal', icon: User },
//   { title: 'Identity & Address', icon: Fingerprint },
//   { title: 'Loan & Business', icon: Briefcase },
//   { title: 'Documents', icon: Upload },
//   { title: 'Review', icon: ShieldCheck },
// ];

// // Document checklist reflects what Indian lenders actually ask for on an
// // MSME / business loan application: KYC, address, income and business
// // legitimacy proof, plus bank statements — not just a generic "upload file".
// const DOCUMENT_FIELDS = [
//   { key: 'idProof', label: 'Identity Proof', hint: 'PAN / Aadhaar / Voter ID / Passport', icon: Fingerprint, required: true },
//   { key: 'addressProof', label: 'Address Proof', hint: 'Utility bill / Rental agreement / Aadhaar', icon: HomeIcon, required: true },
//   { key: 'incomeProof', label: 'Income Proof', hint: 'Salary slip / ITR / Form 16', icon: Banknote, required: true },
//   { key: 'bankStatement', label: 'Bank Statement', hint: 'Last 6 months statement', icon: Landmark, required: true },
//   { key: 'businessProof', label: 'Business Proof', hint: 'Udyam certificate / GST / Shop license', icon: Building2, required: false },
//   { key: 'photo', label: 'Passport Size Photo', hint: 'Recent photograph', icon: User, required: true },
// ];

// const emptyForm = {
//   fullName: '', dob: '', gender: '', mobile: '', email: '',
//   password: '', confirmPassword: '',
//   aadhar: '', pan: '', addressLine: '', city: '', state: '', pincode: '',
//   businessName: '', businessType: '',
//   udyamNumber: '', gstin: '', yearsInOperation: '', monthlyIncome: '',
//   hasExistingLoans: '', existingLoanAmount: '',
//   bankName: '', accountNumber: '', ifsc: '',
// };

// function Field({ label, error, children }) {
//   return (
//     <div>
//       <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>{label}</label>
//       {children}
//       {error && <p className="mt-1 text-[11px]" style={{ color: RED }}>{error}</p>}
//     </div>
//   );
// }

// function InputWithIcon({ icon: Icon, error, ...props }) {
//   return (
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//       <input
//         {...props}
//         className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
//         style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY }}
//       />
//     </div>
//   );
// }

// function SelectWithIcon({ icon: Icon, error, children, ...props }) {
//   return (
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
//       <select
//         {...props}
//         className="w-full appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
//         style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY, color: props.value ? TEXT : '#94a3b8' }}
//       >
//         {children}
//       </select>
//     </div>
//   );
// }

// /**
//  * Register — a routed page at /register (not a popup).
//  * Link to it with <Link to="/register"> or navigate('/register').
//  */
// export default function Register() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [form, setForm] = useState(emptyForm);
//   const [files, setFiles] = useState({});
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [referenceId, setReferenceId] = useState('');

//   const resetAndClose = () => {
//     navigate('/');
//   };

//   const update = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const updateFile = (field, file) => {
//     setFiles((prev) => ({ ...prev, [field]: file }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const removeFile = (field) => {
//     setFiles((prev) => {
//       const next = { ...prev };
//       delete next[field];
//       return next;
//     });
//   };

//   const validateStep = (index) => {
//     const e = {};

//     if (index === 0) {
//       if (!form.fullName.trim()) e.fullName = 'Full name is required';
//       if (!form.dob) e.dob = 'Date of birth is required';
//       if (!form.gender) e.gender = 'Please select gender';
//       if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
//       if (!form.email.trim()) e.email = 'Email is required';
//       else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
//       if (!form.password) e.password = 'Please create a password';
//       else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
//       if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
//       else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
//     }

//     if (index === 1) {
//       if (!/^\d{12}$/.test(form.aadhar.trim())) e.aadhar = 'Enter a valid 12-digit Aadhaar number';
//       if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.trim().toUpperCase())) e.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
//       if (!form.addressLine.trim()) e.addressLine = 'Address is required';
//       if (!form.city.trim()) e.city = 'City is required';
//       if (!form.state.trim()) e.state = 'State is required';
//       if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
//     }

//     if (index === 2) {
//       if (!form.businessType) e.businessType = 'Please select an option';
//       if (!form.monthlyIncome.trim()) e.monthlyIncome = 'Monthly income is required';
//       if (!form.hasExistingLoans) e.hasExistingLoans = 'Please select an option';
//       if (form.hasExistingLoans === 'Yes' && !form.existingLoanAmount.trim()) {
//         e.existingLoanAmount = 'Enter the existing loan amount';
//       }
//     }

//     if (index === 3) {
//       if (!form.bankName.trim()) e.bankName = 'Bank name is required';
//       if (!/^\d{9,18}$/.test(form.accountNumber.trim())) e.accountNumber = 'Enter a valid account number';
//       if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim().toUpperCase())) e.ifsc = 'Enter a valid IFSC code';
//       DOCUMENT_FIELDS.forEach(({ key, required }) => {
//         if (required && !files[key]) e[key] = 'Required';
//       });
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const goNext = () => {
//     if (!validateStep(step)) return;
//     setDirection(1);
//     setStep((s) => Math.min(s + 1, STEPS.length - 1));
//   };

//   const goBack = () => {
//     setDirection(-1);
//     setStep((s) => Math.max(s - 1, 0));
//   };

//   const handleSubmit = () => {
//     const result = registerUser(form);

//     if (!result.success) {
//       // Duplicate email — send the user back to step 0 so they can see
//       // the problem next to the field that caused it.
//       setErrors({ email: result.message });
//       setStep(0);
//       return;
//     }

//     const ref = 'LM' + Math.floor(100000 + Math.random() * 900000);
//     setReferenceId(ref);
//     setSubmitted(true);
//   };

//   const progressPct = ((step + 1) / STEPS.length) * 100;

//   // FIX: the floating decorative icons previously used top/left percentages
//   // (e.g. top: '78%', left: '10%') that landed on top of the vertical
//   // stepper at the bottom of the panel, visually colliding with the
//   // "Loan & Business" / "Documents" step icons. All three are now kept
//   // in the upper portion of the panel (top <= 32%), well clear of the
//   // stepper region which sits below the heading block.
//   return (
//     <div className="flex min-h-screen w-full flex-col overflow-x-clip lg:flex-row" style={{ fontFamily: FONT_BODY }}>
//       <style>{`
//         @keyframes auth-drift { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(4%,-6%,0) scale(1.12); } }
//         .auth-aurora { animation: auth-drift 15s ease-in-out infinite; }
//         .auth-grid-bg {
//           background-image: linear-gradient(to right, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.07) 1px, transparent 1px);
//           background-size: 40px 40px;
//           mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, #000 30%, transparent 100%);
//           -webkit-mask-image: radial-gradient(ellipse 90% 90% at 50% 40%, #000 30%, transparent 100%);
//         }
//         @media (prefers-reduced-motion: reduce) { .auth-aurora { animation: none !important; } }
//       `}</style>

//       {/* ============ LEFT BRAND PANEL — desktop/tablet only ============ */}
//       <div
//         className="relative hidden w-full shrink-0 flex-col px-9 py-7 lg:flex lg:w-[38%] xl:w-[34%]"
//         style={{ background: `linear-gradient(150deg, ${NAVY} 0%, #1b3583 55%, ${BLUE} 130%)` }}
//       >
//         <div className="pointer-events-none absolute inset-0 overflow-hidden">
//           <div className="auth-aurora absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: 0.22 }} />
//           <div className="auth-aurora absolute -bottom-28 -right-16 h-72 w-72 rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.3, animationDelay: '-6s' }} />
//         </div>
//         <div className="auth-grid-bg pointer-events-none absolute inset-0" />

//         {/* Extra decorative icons — anchored by a fixed pixel offset (not
//             percentage) so they always land in the clear background area
//             below the sticky header/stepper block, regardless of how tall
//             the panel stretches to match the form column. */}
//         <motion.div
//           className="pointer-events-none absolute"
//           style={{ top: 640, left: '14%' }}
//           animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
//           transition={{ duration: 4.7, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <div className="flex items-center justify-center rounded-2xl" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
//             <Landmark size={17} style={{ color: WHITE }} />
//           </div>
//         </motion.div>
//         <motion.div
//           className="pointer-events-none absolute"
//           style={{ top: 820, left: '58%' }}
//           animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
//           transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <div className="flex items-center justify-center rounded-2xl" style={{ width: 32, height: 32, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
//             <FileText size={16} style={{ color: WHITE }} />
//           </div>
//         </motion.div>
//         <motion.div
//           className="pointer-events-none absolute"
//           style={{ top: 590, left: '82%' }}
//           animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
//           transition={{ duration: 4.2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <div className="flex items-center justify-center rounded-2xl" style={{ width: 30, height: 30, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
//             <Sparkles size={15} style={{ color: WHITE }} />
//           </div>
//         </motion.div>
//         <motion.div
//           className="pointer-events-none absolute"
//           style={{ top: 960, left: '20%' }}
//           animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
//           transition={{ duration: 5.3, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <div className="flex items-center justify-center rounded-2xl" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
//             <Briefcase size={17} style={{ color: WHITE }} />
//           </div>
//         </motion.div>
//         <motion.div
//           className="pointer-events-none absolute"
//           style={{ top: 1110, left: '65%' }}
//           animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
//           transition={{ duration: 4.6, delay: 1.1, repeat: Infinity, ease: 'easeInOut' }}
//         >
//           <div className="flex items-center justify-center rounded-2xl" style={{ width: 32, height: 32, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
//             <CreditCard size={16} style={{ color: WHITE }} />
//           </div>
//         </motion.div>

//         {/* Content pins near the top of the viewport as the page scrolls,
//             while the gradient panel behind it (see wrapper above) stretches
//             the full height of the taller form column. */}
//         <div className="relative z-10 flex flex-col gap-8 lg:sticky lg:top-7">
//           {/* Decorative shield icon — travels with the pinned header so it
//               never drifts out of sync with the content as the page scrolls. */}
//           <motion.div
//             className="pointer-events-none absolute -top-1 right-0"
//             animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
//             transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
//           >
//             <div
//               className="flex items-center justify-center rounded-2xl"
//               style={{ width: 36, height: 36, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}
//             >
//               <ShieldCheck size={18} style={{ color: WHITE }} />
//             </div>
//           </motion.div>
//         {/* Top — wordmark */}
//         <div className="flex items-center gap-2">
//           <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: 'rgba(255,255,255,.14)', border: '1px solid rgba(255,255,255,.26)' }}>
//             <Landmark className="h-4.5 w-4.5" style={{ color: WHITE }} />
//           </div>
//           <span className="text-[15px] font-bold" style={{ color: WHITE, fontFamily: FONT_HEAD }}>LoanMela</span>
//         </div>

//         {/* Middle — heading */}
//         <div className="relative z-10 max-w-sm">
//           <motion.span
//             initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
//             className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-semibold backdrop-blur-md"
//             style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
//           >
//             <Sparkles className="h-3.5 w-3.5" />
//             Loan Application Registration
//           </motion.span>
//           <motion.h1
//             initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
//             transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
//             className="text-[1.6rem] font-bold leading-[1.16]" style={{ color: WHITE, fontFamily: FONT_HEAD }}
//           >
//             One form, five short steps, one straight answer.
//           </motion.h1>
//           <motion.p
//             initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
//             className="mt-3 text-[12.5px] leading-relaxed" style={{ color: 'rgba(253,253,253,.78)' }}
//           >
//             Personal details, identity, loan needs, documents, then a final review — nothing to repeat later.
//           </motion.p>
//         </div>

//         {/* Bottom — vertical stepper */}
//         <motion.div
//           initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
//           className="relative z-10 mt-2 space-y-1"
//         >
//           {STEPS.map((s, i) => {
//             const Icon = s.icon;
//             const active = i === step;
//             const done = i < step;
//             return (
//               <div key={s.title} className="flex items-center gap-3">
//                 <div className="flex flex-col items-center">
//                   <div
//                     className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all"
//                     style={{
//                       background: done || active ? WHITE : 'transparent',
//                       color: done || active ? NAVY : 'rgba(253,253,253,.55)',
//                       border: `2px solid ${done || active ? WHITE : 'rgba(255,255,255,.3)'}`,
//                     }}
//                   >
//                     {done ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-2.5 w-2.5" />}
//                   </div>
//                   {i < STEPS.length - 1 && (
//                     <div className="h-5 w-0.5" style={{ background: done ? WHITE : 'rgba(255,255,255,.25)' }} />
//                   )}
//                 </div>
//                 <span className="pb-4 text-[12px] font-semibold" style={{ color: active ? WHITE : 'rgba(253,253,253,.62)' }}>
//                   {s.title}
//                 </span>
//               </div>
//             );
//           })}
//         </motion.div>
//         </div>
//       </div>

//       {/* ============ RIGHT FORM PANEL ============ */}
//       <div className="flex-1" style={{ background: BLUE_PALE }}>
//         <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
//           {/* Mobile-only compact header — the brand panel is hidden below lg */}
//           {!submitted && (
//           <div className="mb-5 lg:hidden">
//             <div className="mb-3 flex items-center gap-2 text-[13px] font-medium">
//               <button onClick={() => navigate('/')} className="transition-colors" style={{ color: SLATE }}>Home</button>
//               <ArrowRight className="h-3.5 w-3.5" style={{ color: GRAY }} />
//               <span className="font-semibold" style={{ color: NAVY }}>Register</span>
//             </div>
//             <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: NAVY }}>
//               <Landmark className="h-4.5 w-4.5" style={{ color: WHITE }} />
//             </div>
//             <h1 className="text-[1.45rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Register your loan application</h1>
//             <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: SLATE }}>Five short steps — takes about five minutes.</p>
//           </div>
//           )}

//           {/* Desktop-only compact eyebrow, since the big heading already lives in the left panel */}
//           {!submitted && (
//           <div className="mb-6 hidden lg:block">
//             <div className="mb-3 flex items-center gap-2 text-[13px] font-medium">
//               <button onClick={() => navigate('/')} className="transition-colors hover:text-slate-700" style={{ color: SLATE }}>Home</button>
//               <ArrowRight className="h-3.5 w-3.5" style={{ color: GRAY }} />
//               <span className="font-semibold" style={{ color: NAVY }}>Register</span>
//             </div>
//             <h2 className="text-[1.55rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>{STEPS[step]?.title}</h2>
//             <p className="mt-1.5 text-[12.5px]" style={{ color: SLATE }}>Step {step + 1} of {STEPS.length}</p>
//           </div>
//           )}

//           {submitted ? (
//               <div className="py-6 text-center">
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
//                   className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
//                   style={{ background: '#e9f7ef' }}
//                 >
//                   <CheckCircle2 className="h-8 w-8" style={{ color: '#1a7f4b' }} />
//                 </motion.div>

//                 <h2 className="text-[1.4rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
//                   Registration Submitted
//                 </h2>

//                 <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed" style={{ color: SLATE }}>
//                   Thanks, {form.fullName.split(' ')[0]}. Your loan application has been received
//                   and your account has been created. Our team will review your details and
//                   contact you on <strong style={{ color: TEXT }}>{form.mobile}</strong> within
//                   24-48 hours.
//                 </p>

//                 <div
//                   className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
//                   style={{ background: BLUE_PALE, color: NAVY, border: `1px solid ${BLUE_TINT}` }}
//                 >
//                   Reference ID: <span style={{ color: BLUE }}>{referenceId}</span>
//                 </div>

//                 <button
//                   onClick={() => navigate('/login')}
//                   className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//                   style={{ background: NAVY }}
//                 >
//                   Continue to Login
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {/* Stepper — mobile only; desktop shows the vertical version in the left panel */}
//                 <div className="pb-5 lg:hidden">
//                   <div className="mb-2.5 flex items-center justify-between">
//                     {STEPS.map((s, i) => {
//                       const Icon = s.icon;
//                       const active = i === step;
//                       const done = i < step;
//                       return (
//                         <div key={s.title} className="flex flex-1 flex-col items-center">
//                           <div
//                             className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all"
//                             style={{
//                               background: done || active ? BLUE : WHITE,
//                               color: done || active ? WHITE : SLATE,
//                               border: `2px solid ${done || active ? BLUE : GRAY}`,
//                             }}
//                           >
//                             {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
//                           </div>
//                           <span
//                             className="mt-1 hidden text-center text-[9.5px] font-semibold leading-tight sm:block"
//                             style={{ color: active ? NAVY : SLATE }}
//                           >
//                             {s.title}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: BLUE_TINT }}>
//                     <motion.div
//                       className="h-full rounded-full"
//                       style={{ background: `linear-gradient(90deg, ${NAVY}, ${BLUE})` }}
//                       animate={{ width: `${progressPct}%` }}
//                       transition={{ duration: 0.4, ease: EASE }}
//                     />
//                   </div>
//                 </div>

//                 {/* Desktop progress bar — compact, under the step-title eyebrow above */}
//                 <div className="mb-6 hidden h-1.5 w-full overflow-hidden rounded-full lg:block" style={{ background: BLUE_TINT }}>
//                   <motion.div
//                     className="h-full rounded-full"
//                     style={{ background: `linear-gradient(90deg, ${NAVY}, ${BLUE})` }}
//                     animate={{ width: `${progressPct}%` }}
//                     transition={{ duration: 0.4, ease: EASE }}
//                   />
//                 </div>

//                 <div className="h-px w-full lg:hidden" style={{ background: `${GRAY}45` }} />

//                 {/* Form body */}
//                 <div className="py-6">
//                   <AnimatePresence mode="wait" custom={direction}>
//                     <motion.div
//                       key={step}
//                       custom={direction}
//                       initial={{ opacity: 0, x: direction * 24 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: direction * -24 }}
//                       transition={{ duration: 0.3, ease: EASE }}
//                     >
//                       {/* ===== STEP 0: PERSONAL ===== */}
//                       {step === 0 && (
//                         <div className="space-y-4">
//                           <Field label="Full Name" error={errors.fullName}>
//                             <InputWithIcon icon={User} error={errors.fullName} type="text" placeholder="e.g. Surega R"
//                               value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
//                           </Field>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Date of Birth" error={errors.dob}>
//                               <InputWithIcon icon={Calendar} error={errors.dob} type="date"
//                                 value={form.dob} onChange={(e) => update('dob', e.target.value)} />
//                             </Field>

//                             <Field label="Gender" error={errors.gender}>
//                               <SelectWithIcon icon={Users} error={errors.gender}
//                                 value={form.gender} onChange={(e) => update('gender', e.target.value)}>
//                                 <option value="">Select gender</option>
//                                 <option>Male</option>
//                                 <option>Female</option>
//                                 <option>Other</option>
//                               </SelectWithIcon>
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Mobile Number" error={errors.mobile}>
//                               <InputWithIcon icon={Phone} error={errors.mobile} type="tel" placeholder="10-digit mobile number"
//                                 value={form.mobile}
//                                 onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
//                             </Field>

//                             <Field label="Email Address" error={errors.email}>
//                               <InputWithIcon icon={Mail} error={errors.email} type="email" placeholder="you@example.com"
//                                 value={form.email} onChange={(e) => update('email', e.target.value)} />
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Create Password" error={errors.password}>
//                               <InputWithIcon icon={Lock} error={errors.password} type="password" placeholder="At least 6 characters"
//                                 value={form.password} onChange={(e) => update('password', e.target.value)} />
//                             </Field>

//                             <Field label="Confirm Password" error={errors.confirmPassword}>
//                               <InputWithIcon icon={Lock} error={errors.confirmPassword} type="password" placeholder="Re-enter password"
//                                 value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
//                             </Field>
//                           </div>
//                         </div>
//                       )}

//                       {/* ===== STEP 1: IDENTITY & ADDRESS ===== */}
//                       {step === 1 && (
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Aadhaar Number" error={errors.aadhar}>
//                               <InputWithIcon icon={Fingerprint} error={errors.aadhar} type="text" placeholder="12-digit Aadhaar number"
//                                 value={form.aadhar}
//                                 onChange={(e) => update('aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} />
//                             </Field>

//                             <Field label="PAN Number" error={errors.pan}>
//                               <InputWithIcon icon={CreditCard} error={errors.pan} type="text" placeholder="ABCDE1234F"
//                                 value={form.pan}
//                                 onChange={(e) => update('pan', e.target.value.toUpperCase().slice(0, 10))} />
//                             </Field>
//                           </div>

//                           <Field label="Address" error={errors.addressLine}>
//                             <InputWithIcon icon={MapPin} error={errors.addressLine} type="text" placeholder="House no, street, locality"
//                               value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} />
//                           </Field>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                             <Field label="City" error={errors.city}>
//                               <InputWithIcon icon={Building2} error={errors.city} type="text" placeholder="Chennai"
//                                 value={form.city} onChange={(e) => update('city', e.target.value)} />
//                             </Field>

//                             <Field label="State" error={errors.state}>
//                               <InputWithIcon icon={MapPin} error={errors.state} type="text" placeholder="Tamil Nadu"
//                                 value={form.state} onChange={(e) => update('state', e.target.value)} />
//                             </Field>

//                             <Field label="Pincode" error={errors.pincode}>
//                               <InputWithIcon icon={MapPin} error={errors.pincode} type="text" placeholder="600001"
//                                 value={form.pincode}
//                                 onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
//                             </Field>
//                           </div>
//                         </div>
//                       )}

//                       {/* ===== STEP 2: LOAN & BUSINESS ===== */}
//                       {step === 2 && (
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Business / Enterprise Name (optional)">
//                               <InputWithIcon icon={Building2} type="text" placeholder="e.g. Surega Textiles"
//                                 value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
//                             </Field>

//                             <Field label="Business Type" error={errors.businessType}>
//                               <SelectWithIcon icon={Briefcase} error={errors.businessType}
//                                 value={form.businessType} onChange={(e) => update('businessType', e.target.value)}>
//                                 <option value="">Select type</option>
//                                 <option>Sole Proprietorship</option>
//                                 <option>Partnership</option>
//                                 <option>Private Limited</option>
//                                 <option>Not Applicable</option>
//                               </SelectWithIcon>
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Udyam Registration Number (optional)">
//                               <InputWithIcon icon={Hash} type="text" placeholder="UDYAM-XX-00-0000000"
//                                 value={form.udyamNumber} onChange={(e) => update('udyamNumber', e.target.value.toUpperCase())} />
//                             </Field>

//                             <Field label="GSTIN (optional)">
//                               <InputWithIcon icon={FileText} type="text" placeholder="15-digit GST number"
//                                 value={form.gstin} onChange={(e) => update('gstin', e.target.value.toUpperCase().slice(0, 15))} />
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Years in Business / Operation (optional)">
//                               <InputWithIcon icon={Calendar} type="text" placeholder="e.g. 3"
//                                 value={form.yearsInOperation}
//                                 onChange={(e) => update('yearsInOperation', e.target.value.replace(/\D/g, ''))} />
//                             </Field>

//                             <Field label="Monthly Income (₹)" error={errors.monthlyIncome}>
//                               <InputWithIcon icon={Banknote} error={errors.monthlyIncome} type="text" placeholder="25000"
//                                 value={form.monthlyIncome}
//                                 onChange={(e) => update('monthlyIncome', e.target.value.replace(/\D/g, ''))} />
//                             </Field>
//                           </div>

//                           <Field label="Do you have any existing loans?" error={errors.hasExistingLoans}>
//                             <div className="flex gap-3">
//                               {['Yes', 'No'].map((opt) => (
//                                 <button
//                                   type="button"
//                                   key={opt}
//                                   onClick={() => update('hasExistingLoans', opt)}
//                                   className="flex-1 rounded-lg border py-2.5 text-[13px] font-semibold transition-all"
//                                   style={{
//                                     borderColor: form.hasExistingLoans === opt ? BLUE : GRAY,
//                                     background: form.hasExistingLoans === opt ? BLUE_PALE : WHITE,
//                                     color: form.hasExistingLoans === opt ? NAVY : SLATE,
//                                   }}
//                                 >
//                                   {opt}
//                                 </button>
//                               ))}
//                             </div>
//                           </Field>

//                           {form.hasExistingLoans === 'Yes' && (
//                             <Field label="Existing Loan Amount (₹)" error={errors.existingLoanAmount}>
//                               <InputWithIcon icon={Banknote} error={errors.existingLoanAmount} type="text" placeholder="100000"
//                                 value={form.existingLoanAmount}
//                                 onChange={(e) => update('existingLoanAmount', e.target.value.replace(/\D/g, ''))} />
//                             </Field>
//                           )}
//                         </div>
//                       )}

//                       {/* ===== STEP 3: DOCUMENTS ===== */}
//                       {step === 3 && (
//                         <div className="space-y-4">
//                           <Field label="Bank Name" error={errors.bankName}>
//                             <InputWithIcon icon={Landmark} error={errors.bankName} type="text" placeholder="e.g. Central Bank of India"
//                               value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
//                           </Field>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Account Number" error={errors.accountNumber}>
//                               <InputWithIcon icon={CreditCard} error={errors.accountNumber} type="text" placeholder="Bank account number"
//                                 value={form.accountNumber}
//                                 onChange={(e) => update('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))} />
//                             </Field>

//                             <Field label="IFSC Code" error={errors.ifsc}>
//                               <InputWithIcon icon={ShieldCheck} error={errors.ifsc} type="text" placeholder="e.g. CBIN0284012"
//                                 value={form.ifsc} onChange={(e) => update('ifsc', e.target.value.toUpperCase().slice(0, 11))} />
//                             </Field>
//                           </div>

//                           <div className="mt-2 h-px w-full" style={{ background: BLUE_TINT }} />

//                           <p className="text-[12.5px] font-semibold" style={{ color: NAVY }}>Upload Documents</p>
//                           <p className="text-[11.5px]" style={{ color: SLATE }}>
//                             These are what a lender checks before sanctioning a loan — identity, address, income, and a bank statement are mandatory. Business proof is required only if you're borrowing for a registered business.
//                           </p>

//                           <div className="divide-y" style={{ borderColor: `${GRAY}45` }}>
//                             {DOCUMENT_FIELDS.map(({ key, label, hint, icon: Icon, required }) => {
//                               const file = files[key];
//                               return (
//                                 <div
//                                   key={key}
//                                   className="flex items-center justify-between gap-3 py-3"
//                                   style={{ borderColor: `${GRAY}45` }}
//                                 >
//                                   <div className="flex min-w-0 items-center gap-3">
//                                     <div
//                                       className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
//                                       style={{ background: BLUE_PALE }}
//                                     >
//                                       <Icon className="h-4 w-4" style={{ color: BLUE }} />
//                                     </div>
//                                     <div className="min-w-0">
//                                       <p className="truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
//                                         {label}{required && <span style={{ color: RED }}> *</span>}
//                                       </p>
//                                       <p className="truncate text-[11px]" style={{ color: errors[key] ? RED : SLATE }}>
//                                         {file ? file.name : (errors[key] ? 'Required' : hint)}
//                                       </p>
//                                     </div>
//                                   </div>

//                                   {file ? (
//                                     <button
//                                       type="button"
//                                       onClick={() => removeFile(key)}
//                                       className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
//                                     >
//                                       <X className="h-4 w-4" />
//                                     </button>
//                                   ) : (
//                                     <label
//                                       className="shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white"
//                                       style={{ background: NAVY }}
//                                     >
//                                       Upload
//                                       <input
//                                         type="file"
//                                         accept="image/*,.pdf"
//                                         className="hidden"
//                                         onChange={(e) => e.target.files[0] && updateFile(key, e.target.files[0])}
//                                       />
//                                     </label>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}

//                       {/* ===== STEP 4: REVIEW ===== */}
//                       {step === 4 && (
//                         <div className="space-y-4">
//                           <ReviewSection title="Personal Details">
//                             <ReviewRow label="Name" value={form.fullName} />
//                             <ReviewRow label="DOB" value={form.dob} />
//                             <ReviewRow label="Gender" value={form.gender} />
//                             <ReviewRow label="Mobile" value={form.mobile} />
//                             <ReviewRow label="Email" value={form.email} />
//                           </ReviewSection>

//                           <ReviewSection title="Identity & Address">
//                             <ReviewRow label="Aadhaar" value={form.aadhar} />
//                             <ReviewRow label="PAN" value={form.pan} />
//                             <ReviewRow label="Address" value={`${form.addressLine}, ${form.city}, ${form.state} - ${form.pincode}`} />
//                           </ReviewSection>

//                           <ReviewSection title="Loan & Business">
//                             <ReviewRow label="Business Name" value={form.businessName || '—'} />
//                             <ReviewRow label="Business Type" value={form.businessType} />
//                             <ReviewRow label="Udyam No." value={form.udyamNumber || '—'} />
//                             <ReviewRow label="GSTIN" value={form.gstin || '—'} />
//                             <ReviewRow label="Monthly Income" value={form.monthlyIncome && `₹${form.monthlyIncome}`} />
//                             <ReviewRow label="Existing Loans" value={form.hasExistingLoans === 'Yes' ? `Yes (₹${form.existingLoanAmount})` : 'No'} />
//                           </ReviewSection>

//                           <ReviewSection title="Bank Details">
//                             <ReviewRow label="Bank" value={form.bankName} />
//                             <ReviewRow label="Account No." value={form.accountNumber} />
//                             <ReviewRow label="IFSC" value={form.ifsc} />
//                           </ReviewSection>

//                           <ReviewSection title="Documents">
//                             {DOCUMENT_FIELDS.map(({ key, label }) => (
//                               <ReviewRow key={key} label={label} value={files[key] ? files[key].name : 'Not uploaded'} />
//                             ))}
//                           </ReviewSection>

//                           <div
//                             className="flex items-start gap-2 rounded-lg p-3 text-[11.5px]"
//                             style={{ background: BLUE_PALE, color: SLATE }}
//                           >
//                             <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLUE }} />
//                             By submitting, you confirm that the details provided above are accurate to the best of your knowledge.
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>

//                 {/* Navigation */}
//                 <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: `${GRAY}45` }}>
//                   <button
//                     type="button"
//                     onClick={step === 0 ? resetAndClose : goBack}
//                     className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline"
//                     style={{ color: SLATE }}
//                   >
//                     <ArrowLeft className="h-4 w-4" />
//                     {step === 0 ? 'Cancel' : 'Back'}
//                   </button>

//                   {step < STEPS.length - 1 ? (
//                     <button
//                       type="button"
//                       onClick={goNext}
//                       className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//                       style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
//                     >
//                       Continue
//                       <ArrowRight className="h-4 w-4" />
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//                       style={{ background: NAVY }}
//                     >
//                       Submit Application
//                       <CheckCircle2 className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}
//       </div>
//       </div>
//     </div>
//   );
// }

// function ReviewSection({ title, children }) {
//   return (
//     <div className="border-b pb-4" style={{ borderColor: `${GRAY}45` }}>
//       <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>{title}</p>
//       <div className="space-y-1.5">{children}</div>
//     </div>
//   );
// }

// function ReviewRow({ label, value }) {
//   return (
//     <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
//       <span style={{ color: SLATE }}>{label}</span>
//       <span className="text-right font-semibold" style={{ color: TEXT }}>{value || '—'}</span>
//     </div>
//   );
// }


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   User, Calendar, Phone, Mail, MapPin, Landmark, Banknote, Building2,
//   Briefcase, Upload, CheckCircle2, ArrowRight, ArrowLeft, X, FileText,
//   CreditCard, Users, ShieldCheck, Fingerprint, Home as HomeIcon, Hash, Lock,
// } from 'lucide-react';
// import { registerUser } from '../utils/auth';

// /* ================= BRAND TOKENS =================
//    Matches the tokens used across Loanschema.jsx / Navbar.jsx / Footer.jsx
//    so this modal feels like part of the same product, not a bolt-on. */
// const NAVY = '#132261';
// const BLUE = '#2f76fb';
// const BLUE_TINT = '#d9e7f9';
// const BLUE_PALE = '#f0f6fc';
// const SLATE = '#757e9e';
// const GRAY = '#c0bec2';
// const WHITE = '#fdfdfd';
// const TEXT = '#242938';
// const RED = '#c0392b';

// const FONT_HEAD = "'Poppins', sans-serif";
// const FONT_BODY = "'Poppins', sans-serif";
// const EASE = [0.22, 1, 0.36, 1];

// const STEPS = [
//   { title: 'Personal', icon: User },
//   { title: 'Identity & Address', icon: Fingerprint },
//   { title: 'Loan & Business', icon: Briefcase },
//   { title: 'Documents', icon: Upload },
//   { title: 'Review', icon: ShieldCheck },
// ];

// // Document checklist reflects what Indian lenders actually ask for on an
// // MSME / business loan application: KYC, address, income and business
// // legitimacy proof, plus bank statements — not just a generic "upload file".
// const DOCUMENT_FIELDS = [
//   { key: 'idProof', label: 'Identity Proof', hint: 'PAN / Aadhaar / Voter ID / Passport', icon: Fingerprint, required: true },
//   { key: 'addressProof', label: 'Address Proof', hint: 'Utility bill / Rental agreement / Aadhaar', icon: HomeIcon, required: true },
//   { key: 'incomeProof', label: 'Income Proof', hint: 'Salary slip / ITR / Form 16', icon: Banknote, required: true },
//   { key: 'bankStatement', label: 'Bank Statement', hint: 'Last 6 months statement', icon: Landmark, required: true },
//   { key: 'businessProof', label: 'Business Proof', hint: 'Udyam certificate / GST / Shop license', icon: Building2, required: false },
//   { key: 'photo', label: 'Passport Size Photo', hint: 'Recent photograph', icon: User, required: true },
// ];

// const emptyForm = {
//   fullName: '', dob: '', gender: '', mobile: '', email: '',
//   password: '', confirmPassword: '',
//   aadhar: '', pan: '', addressLine: '', city: '', state: '', pincode: '',
//   businessName: '', businessType: '',
//   udyamNumber: '', gstin: '', yearsInOperation: '', monthlyIncome: '',
//   hasExistingLoans: '', existingLoanAmount: '',
//   bankName: '', accountNumber: '', ifsc: '',
// };

// function Field({ label, error, children }) {
//   return (
//     <div>
//       <label className="mb-1 block text-[12px] font-semibold" style={{ color: SLATE }}>{label}</label>
//       {children}
//       {error && <p className="mt-1 text-[11px]" style={{ color: RED }}>{error}</p>}
//     </div>
//   );
// }

// function InputWithIcon({ icon: Icon, error, ...props }) {
//   return (
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//       <input
//         {...props}
//         className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
//         style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY }}
//       />
//     </div>
//   );
// }

// function SelectWithIcon({ icon: Icon, error, children, ...props }) {
//   return (
//     <div className="relative">
//       <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
//       <select
//         {...props}
//         className="w-full appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
//         style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY, color: props.value ? TEXT : '#94a3b8' }}
//       >
//         {children}
//       </select>
//     </div>
//   );
// }

// /**
//  * Register — a routed page at /register (not a popup).
//  * Link to it with <Link to="/register"> or navigate('/register').
//  */
// export default function Register() {
//   const navigate = useNavigate();
//   const [step, setStep] = useState(0);
//   const [direction, setDirection] = useState(1);
//   const [form, setForm] = useState(emptyForm);
//   const [files, setFiles] = useState({});
//   const [errors, setErrors] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [referenceId, setReferenceId] = useState('');

//   const resetAndClose = () => {
//     navigate('/');
//   };

//   const update = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const updateFile = (field, file) => {
//     setFiles((prev) => ({ ...prev, [field]: file }));
//     setErrors((prev) => ({ ...prev, [field]: undefined }));
//   };

//   const removeFile = (field) => {
//     setFiles((prev) => {
//       const next = { ...prev };
//       delete next[field];
//       return next;
//     });
//   };

//   const validateStep = (index) => {
//     const e = {};

//     if (index === 0) {
//       if (!form.fullName.trim()) e.fullName = 'Full name is required';
//       if (!form.dob) e.dob = 'Date of birth is required';
//       if (!form.gender) e.gender = 'Please select gender';
//       if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
//       if (!form.email.trim()) e.email = 'Email is required';
//       else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
//       if (!form.password) e.password = 'Please create a password';
//       else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
//       if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
//       else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
//     }

//     if (index === 1) {
//       if (!/^\d{12}$/.test(form.aadhar.trim())) e.aadhar = 'Enter a valid 12-digit Aadhaar number';
//       if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.trim().toUpperCase())) e.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
//       if (!form.addressLine.trim()) e.addressLine = 'Address is required';
//       if (!form.city.trim()) e.city = 'City is required';
//       if (!form.state.trim()) e.state = 'State is required';
//       if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
//     }

//     if (index === 2) {
//       if (!form.businessType) e.businessType = 'Please select an option';
//       if (!form.monthlyIncome.trim()) e.monthlyIncome = 'Monthly income is required';
//       if (!form.hasExistingLoans) e.hasExistingLoans = 'Please select an option';
//       if (form.hasExistingLoans === 'Yes' && !form.existingLoanAmount.trim()) {
//         e.existingLoanAmount = 'Enter the existing loan amount';
//       }
//     }

//     if (index === 3) {
//       if (!form.bankName.trim()) e.bankName = 'Bank name is required';
//       if (!/^\d{9,18}$/.test(form.accountNumber.trim())) e.accountNumber = 'Enter a valid account number';
//       if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim().toUpperCase())) e.ifsc = 'Enter a valid IFSC code';
//       DOCUMENT_FIELDS.forEach(({ key, required }) => {
//         if (required && !files[key]) e[key] = 'Required';
//       });
//     }

//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   const goNext = () => {
//     if (!validateStep(step)) return;
//     setDirection(1);
//     setStep((s) => Math.min(s + 1, STEPS.length - 1));
//   };

//   const goBack = () => {
//     setDirection(-1);
//     setStep((s) => Math.max(s - 1, 0));
//   };

//   const handleSubmit = () => {
//     const result = registerUser(form);

//     if (!result.success) {
//       // Duplicate email — send the user back to step 0 so they can see
//       // the problem next to the field that caused it.
//       setErrors({ email: result.message });
//       setStep(0);
//       return;
//     }

//     const ref = 'LM' + Math.floor(100000 + Math.random() * 900000);
//     setReferenceId(ref);
//     setSubmitted(true);
//   };

//   const progressPct = ((step + 1) / STEPS.length) * 100;

//   return (
//     <div
//       className="min-h-screen w-full"
//       style={{ background: BLUE_PALE, fontFamily: FONT_BODY }}
//     >
//       {/* Full-bleed banner instead of a floating card header */}
//       <div
//         className="w-full px-4 py-8 sm:py-10"
//         style={{ background: `linear-gradient(115deg, ${NAVY} 0%, #1b3583 45%, ${BLUE} 100%)` }}
//       >
//         <div className="mx-auto max-w-2xl">
//           <div className="mb-4 flex items-center gap-2 text-[13px] font-medium">
//             <button onClick={() => navigate('/')} className="text-white/60 transition-colors hover:text-white">Home</button>
//             <ArrowRight className="h-3.5 w-3.5 text-white/40" />
//             <span className="font-semibold text-white">Register</span>
//           </div>

//           <span
//             className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-semibold backdrop-blur-md"
//             style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
//           >
//             <Landmark className="h-3.5 w-3.5" />
//             Loan Application Registration
//           </span>
//           <h2 className="mt-3 text-[1.5rem] font-bold sm:text-[1.7rem]" style={{ color: WHITE, fontFamily: FONT_HEAD }}>
//             Register your loan application
//           </h2>
//         </div>
//       </div>

//       <div className="mx-auto max-w-2xl px-4 py-8 sm:py-10">
//           {submitted ? (
//               <div className="py-6 text-center">
//                 <motion.div
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
//                   className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
//                   style={{ background: '#e9f7ef' }}
//                 >
//                   <CheckCircle2 className="h-8 w-8" style={{ color: '#1a7f4b' }} />
//                 </motion.div>

//                 <h2 className="text-[1.4rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
//                   Registration Submitted
//                 </h2>

//                 <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed" style={{ color: SLATE }}>
//                   Thanks, {form.fullName.split(' ')[0]}. Your loan application has been received
//                   and your account has been created. Our team will review your details and
//                   contact you on <strong style={{ color: TEXT }}>{form.mobile}</strong> within
//                   24-48 hours.
//                 </p>

//                 <div
//                   className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
//                   style={{ background: BLUE_PALE, color: NAVY, border: `1px solid ${BLUE_TINT}` }}
//                 >
//                   Reference ID: <span style={{ color: BLUE }}>{referenceId}</span>
//                 </div>

//                 <button
//                   onClick={() => navigate('/login')}
//                   className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//                   style={{ background: NAVY }}
//                 >
//                   Continue to Login
//                 </button>
//               </div>
//             ) : (
//               <>
//                 {/* Stepper */}
//                 <div className="pb-5">
//                   <div className="mb-2.5 flex items-center justify-between">
//                     {STEPS.map((s, i) => {
//                       const Icon = s.icon;
//                       const active = i === step;
//                       const done = i < step;
//                       return (
//                         <div key={s.title} className="flex flex-1 flex-col items-center">
//                           <div
//                             className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all"
//                             style={{
//                               background: done || active ? BLUE : WHITE,
//                               color: done || active ? WHITE : SLATE,
//                               border: `2px solid ${done || active ? BLUE : GRAY}`,
//                             }}
//                           >
//                             {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
//                           </div>
//                           <span
//                             className="mt-1 hidden text-center text-[9.5px] font-semibold leading-tight sm:block"
//                             style={{ color: active ? NAVY : SLATE }}
//                           >
//                             {s.title}
//                           </span>
//                         </div>
//                       );
//                     })}
//                   </div>
//                   <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: BLUE_TINT }}>
//                     <motion.div
//                       className="h-full rounded-full"
//                       style={{ background: `linear-gradient(90deg, ${NAVY}, ${BLUE})` }}
//                       animate={{ width: `${progressPct}%` }}
//                       transition={{ duration: 0.4, ease: EASE }}
//                     />
//                   </div>
//                 </div>

//                 <div className="h-px w-full" style={{ background: `${GRAY}45` }} />

//                 {/* Form body */}
//                 <div className="py-6">
//                   <AnimatePresence mode="wait" custom={direction}>
//                     <motion.div
//                       key={step}
//                       custom={direction}
//                       initial={{ opacity: 0, x: direction * 24 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: direction * -24 }}
//                       transition={{ duration: 0.3, ease: EASE }}
//                     >
//                       {/* ===== STEP 0: PERSONAL ===== */}
//                       {step === 0 && (
//                         <div className="space-y-4">
//                           <Field label="Full Name" error={errors.fullName}>
//                             <InputWithIcon icon={User} error={errors.fullName} type="text" placeholder="e.g. Surega R"
//                               value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
//                           </Field>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Date of Birth" error={errors.dob}>
//                               <InputWithIcon icon={Calendar} error={errors.dob} type="date"
//                                 value={form.dob} onChange={(e) => update('dob', e.target.value)} />
//                             </Field>

//                             <Field label="Gender" error={errors.gender}>
//                               <SelectWithIcon icon={Users} error={errors.gender}
//                                 value={form.gender} onChange={(e) => update('gender', e.target.value)}>
//                                 <option value="">Select gender</option>
//                                 <option>Male</option>
//                                 <option>Female</option>
//                                 <option>Other</option>
//                               </SelectWithIcon>
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Mobile Number" error={errors.mobile}>
//                               <InputWithIcon icon={Phone} error={errors.mobile} type="tel" placeholder="10-digit mobile number"
//                                 value={form.mobile}
//                                 onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
//                             </Field>

//                             <Field label="Email Address" error={errors.email}>
//                               <InputWithIcon icon={Mail} error={errors.email} type="email" placeholder="you@example.com"
//                                 value={form.email} onChange={(e) => update('email', e.target.value)} />
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Create Password" error={errors.password}>
//                               <InputWithIcon icon={Lock} error={errors.password} type="password" placeholder="At least 6 characters"
//                                 value={form.password} onChange={(e) => update('password', e.target.value)} />
//                             </Field>

//                             <Field label="Confirm Password" error={errors.confirmPassword}>
//                               <InputWithIcon icon={Lock} error={errors.confirmPassword} type="password" placeholder="Re-enter password"
//                                 value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
//                             </Field>
//                           </div>
//                         </div>
//                       )}

//                       {/* ===== STEP 1: IDENTITY & ADDRESS ===== */}
//                       {step === 1 && (
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Aadhaar Number" error={errors.aadhar}>
//                               <InputWithIcon icon={Fingerprint} error={errors.aadhar} type="text" placeholder="12-digit Aadhaar number"
//                                 value={form.aadhar}
//                                 onChange={(e) => update('aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} />
//                             </Field>

//                             <Field label="PAN Number" error={errors.pan}>
//                               <InputWithIcon icon={CreditCard} error={errors.pan} type="text" placeholder="ABCDE1234F"
//                                 value={form.pan}
//                                 onChange={(e) => update('pan', e.target.value.toUpperCase().slice(0, 10))} />
//                             </Field>
//                           </div>

//                           <Field label="Address" error={errors.addressLine}>
//                             <InputWithIcon icon={MapPin} error={errors.addressLine} type="text" placeholder="House no, street, locality"
//                               value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} />
//                           </Field>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
//                             <Field label="City" error={errors.city}>
//                               <InputWithIcon icon={Building2} error={errors.city} type="text" placeholder="Chennai"
//                                 value={form.city} onChange={(e) => update('city', e.target.value)} />
//                             </Field>

//                             <Field label="State" error={errors.state}>
//                               <InputWithIcon icon={MapPin} error={errors.state} type="text" placeholder="Tamil Nadu"
//                                 value={form.state} onChange={(e) => update('state', e.target.value)} />
//                             </Field>

//                             <Field label="Pincode" error={errors.pincode}>
//                               <InputWithIcon icon={MapPin} error={errors.pincode} type="text" placeholder="600001"
//                                 value={form.pincode}
//                                 onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
//                             </Field>
//                           </div>
//                         </div>
//                       )}

//                       {/* ===== STEP 2: LOAN & BUSINESS ===== */}
//                       {step === 2 && (
//                         <div className="space-y-4">
//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Business / Enterprise Name (optional)">
//                               <InputWithIcon icon={Building2} type="text" placeholder="e.g. Surega Textiles"
//                                 value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
//                             </Field>

//                             <Field label="Business Type" error={errors.businessType}>
//                               <SelectWithIcon icon={Briefcase} error={errors.businessType}
//                                 value={form.businessType} onChange={(e) => update('businessType', e.target.value)}>
//                                 <option value="">Select type</option>
//                                 <option>Sole Proprietorship</option>
//                                 <option>Partnership</option>
//                                 <option>Private Limited</option>
//                                 <option>Not Applicable</option>
//                               </SelectWithIcon>
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Udyam Registration Number (optional)">
//                               <InputWithIcon icon={Hash} type="text" placeholder="UDYAM-XX-00-0000000"
//                                 value={form.udyamNumber} onChange={(e) => update('udyamNumber', e.target.value.toUpperCase())} />
//                             </Field>

//                             <Field label="GSTIN (optional)">
//                               <InputWithIcon icon={FileText} type="text" placeholder="15-digit GST number"
//                                 value={form.gstin} onChange={(e) => update('gstin', e.target.value.toUpperCase().slice(0, 15))} />
//                             </Field>
//                           </div>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Years in Business / Operation (optional)">
//                               <InputWithIcon icon={Calendar} type="text" placeholder="e.g. 3"
//                                 value={form.yearsInOperation}
//                                 onChange={(e) => update('yearsInOperation', e.target.value.replace(/\D/g, ''))} />
//                             </Field>

//                             <Field label="Monthly Income (₹)" error={errors.monthlyIncome}>
//                               <InputWithIcon icon={Banknote} error={errors.monthlyIncome} type="text" placeholder="25000"
//                                 value={form.monthlyIncome}
//                                 onChange={(e) => update('monthlyIncome', e.target.value.replace(/\D/g, ''))} />
//                             </Field>
//                           </div>

//                           <Field label="Do you have any existing loans?" error={errors.hasExistingLoans}>
//                             <div className="flex gap-3">
//                               {['Yes', 'No'].map((opt) => (
//                                 <button
//                                   type="button"
//                                   key={opt}
//                                   onClick={() => update('hasExistingLoans', opt)}
//                                   className="flex-1 rounded-lg border py-2.5 text-[13px] font-semibold transition-all"
//                                   style={{
//                                     borderColor: form.hasExistingLoans === opt ? BLUE : GRAY,
//                                     background: form.hasExistingLoans === opt ? BLUE_PALE : WHITE,
//                                     color: form.hasExistingLoans === opt ? NAVY : SLATE,
//                                   }}
//                                 >
//                                   {opt}
//                                 </button>
//                               ))}
//                             </div>
//                           </Field>

//                           {form.hasExistingLoans === 'Yes' && (
//                             <Field label="Existing Loan Amount (₹)" error={errors.existingLoanAmount}>
//                               <InputWithIcon icon={Banknote} error={errors.existingLoanAmount} type="text" placeholder="100000"
//                                 value={form.existingLoanAmount}
//                                 onChange={(e) => update('existingLoanAmount', e.target.value.replace(/\D/g, ''))} />
//                             </Field>
//                           )}
//                         </div>
//                       )}

//                       {/* ===== STEP 3: DOCUMENTS ===== */}
//                       {step === 3 && (
//                         <div className="space-y-4">
//                           <Field label="Bank Name" error={errors.bankName}>
//                             <InputWithIcon icon={Landmark} error={errors.bankName} type="text" placeholder="e.g. Central Bank of India"
//                               value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
//                           </Field>

//                           <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//                             <Field label="Account Number" error={errors.accountNumber}>
//                               <InputWithIcon icon={CreditCard} error={errors.accountNumber} type="text" placeholder="Bank account number"
//                                 value={form.accountNumber}
//                                 onChange={(e) => update('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))} />
//                             </Field>

//                             <Field label="IFSC Code" error={errors.ifsc}>
//                               <InputWithIcon icon={ShieldCheck} error={errors.ifsc} type="text" placeholder="e.g. CBIN0284012"
//                                 value={form.ifsc} onChange={(e) => update('ifsc', e.target.value.toUpperCase().slice(0, 11))} />
//                             </Field>
//                           </div>

//                           <div className="mt-2 h-px w-full" style={{ background: BLUE_TINT }} />

//                           <p className="text-[12.5px] font-semibold" style={{ color: NAVY }}>Upload Documents</p>
//                           <p className="text-[11.5px]" style={{ color: SLATE }}>
//                             These are what a lender checks before sanctioning a loan — identity, address, income, and a bank statement are mandatory. Business proof is required only if you're borrowing for a registered business.
//                           </p>

//                           <div className="divide-y" style={{ borderColor: `${GRAY}45` }}>
//                             {DOCUMENT_FIELDS.map(({ key, label, hint, icon: Icon, required }) => {
//                               const file = files[key];
//                               return (
//                                 <div
//                                   key={key}
//                                   className="flex items-center justify-between gap-3 py-3"
//                                   style={{ borderColor: `${GRAY}45` }}
//                                 >
//                                   <div className="flex min-w-0 items-center gap-3">
//                                     <div
//                                       className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
//                                       style={{ background: BLUE_PALE }}
//                                     >
//                                       <Icon className="h-4 w-4" style={{ color: BLUE }} />
//                                     </div>
//                                     <div className="min-w-0">
//                                       <p className="truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
//                                         {label}{required && <span style={{ color: RED }}> *</span>}
//                                       </p>
//                                       <p className="truncate text-[11px]" style={{ color: errors[key] ? RED : SLATE }}>
//                                         {file ? file.name : (errors[key] ? 'Required' : hint)}
//                                       </p>
//                                     </div>
//                                   </div>

//                                   {file ? (
//                                     <button
//                                       type="button"
//                                       onClick={() => removeFile(key)}
//                                       className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
//                                     >
//                                       <X className="h-4 w-4" />
//                                     </button>
//                                   ) : (
//                                     <label
//                                       className="shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white"
//                                       style={{ background: NAVY }}
//                                     >
//                                       Upload
//                                       <input
//                                         type="file"
//                                         accept="image/*,.pdf"
//                                         className="hidden"
//                                         onChange={(e) => e.target.files[0] && updateFile(key, e.target.files[0])}
//                                       />
//                                     </label>
//                                   )}
//                                 </div>
//                               );
//                             })}
//                           </div>
//                         </div>
//                       )}

//                       {/* ===== STEP 4: REVIEW ===== */}
//                       {step === 4 && (
//                         <div className="space-y-4">
//                           <ReviewSection title="Personal Details">
//                             <ReviewRow label="Name" value={form.fullName} />
//                             <ReviewRow label="DOB" value={form.dob} />
//                             <ReviewRow label="Gender" value={form.gender} />
//                             <ReviewRow label="Mobile" value={form.mobile} />
//                             <ReviewRow label="Email" value={form.email} />
//                           </ReviewSection>

//                           <ReviewSection title="Identity & Address">
//                             <ReviewRow label="Aadhaar" value={form.aadhar} />
//                             <ReviewRow label="PAN" value={form.pan} />
//                             <ReviewRow label="Address" value={`${form.addressLine}, ${form.city}, ${form.state} - ${form.pincode}`} />
//                           </ReviewSection>

//                           <ReviewSection title="Loan & Business">
//                             <ReviewRow label="Business Name" value={form.businessName || '—'} />
//                             <ReviewRow label="Business Type" value={form.businessType} />
//                             <ReviewRow label="Udyam No." value={form.udyamNumber || '—'} />
//                             <ReviewRow label="GSTIN" value={form.gstin || '—'} />
//                             <ReviewRow label="Monthly Income" value={form.monthlyIncome && `₹${form.monthlyIncome}`} />
//                             <ReviewRow label="Existing Loans" value={form.hasExistingLoans === 'Yes' ? `Yes (₹${form.existingLoanAmount})` : 'No'} />
//                           </ReviewSection>

//                           <ReviewSection title="Bank Details">
//                             <ReviewRow label="Bank" value={form.bankName} />
//                             <ReviewRow label="Account No." value={form.accountNumber} />
//                             <ReviewRow label="IFSC" value={form.ifsc} />
//                           </ReviewSection>

//                           <ReviewSection title="Documents">
//                             {DOCUMENT_FIELDS.map(({ key, label }) => (
//                               <ReviewRow key={key} label={label} value={files[key] ? files[key].name : 'Not uploaded'} />
//                             ))}
//                           </ReviewSection>

//                           <div
//                             className="flex items-start gap-2 rounded-lg p-3 text-[11.5px]"
//                             style={{ background: BLUE_PALE, color: SLATE }}
//                           >
//                             <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLUE }} />
//                             By submitting, you confirm that the details provided above are accurate to the best of your knowledge.
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   </AnimatePresence>
//                 </div>

//                 {/* Navigation */}
//                 <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: `${GRAY}45` }}>
//                   <button
//                     type="button"
//                     onClick={step === 0 ? resetAndClose : goBack}
//                     className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline"
//                     style={{ color: SLATE }}
//                   >
//                     <ArrowLeft className="h-4 w-4" />
//                     {step === 0 ? 'Cancel' : 'Back'}
//                   </button>

//                   {step < STEPS.length - 1 ? (
//                     <button
//                       type="button"
//                       onClick={goNext}
//                       className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//                       style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
//                     >
//                       Continue
//                       <ArrowRight className="h-4 w-4" />
//                     </button>
//                   ) : (
//                     <button
//                       type="button"
//                       onClick={handleSubmit}
//                       className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
//                       style={{ background: NAVY }}
//                     >
//                       Submit Application
//                       <CheckCircle2 className="h-4 w-4" />
//                     </button>
//                   )}
//                 </div>
//               </>
//             )}
//       </div>
//     </div>
//   );
// }

// function ReviewSection({ title, children }) {
//   return (
//     <div className="border-b pb-4" style={{ borderColor: `${GRAY}45` }}>
//       <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>{title}</p>
//       <div className="space-y-1.5">{children}</div>
//     </div>
//   );
// }

// function ReviewRow({ label, value }) {
//   return (
//     <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
//       <span style={{ color: SLATE }}>{label}</span>
//       <span className="text-right font-semibold" style={{ color: TEXT }}>{value || '—'}</span>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Calendar, Phone, Mail, MapPin, Landmark, Banknote, Building2,
  Briefcase, Upload, CheckCircle2, ArrowRight, ArrowLeft, X, FileText,
  CreditCard, Users, ShieldCheck, Fingerprint, Home as HomeIcon, Hash, Lock, Sparkles,
} from 'lucide-react';
import { registerUser } from '../utils/auth';

/* ================= BRAND TOKENS =================
   Matches the tokens used across Loanschema.jsx / Navbar.jsx / Footer.jsx
   so this modal feels like part of the same product, not a bolt-on. */
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

const STEPS = [
  { title: 'Personal', icon: User },
  { title: 'Identity & Address', icon: Fingerprint },
  { title: 'Loan & Business', icon: Briefcase },
  { title: 'Documents', icon: Upload },
  { title: 'Review', icon: ShieldCheck },
];

// Document checklist reflects what Indian lenders actually ask for on an
// MSME / business loan application: KYC, address, income and business
// legitimacy proof, plus bank statements — not just a generic "upload file".
const DOCUMENT_FIELDS = [
  { key: 'idProof', label: 'Identity Proof', hint: 'PAN / Aadhaar / Voter ID / Passport', icon: Fingerprint, required: true },
  { key: 'addressProof', label: 'Address Proof', hint: 'Utility bill / Rental agreement / Aadhaar', icon: HomeIcon, required: true },
  { key: 'incomeProof', label: 'Income Proof', hint: 'Salary slip / ITR / Form 16', icon: Banknote, required: true },
  { key: 'bankStatement', label: 'Bank Statement', hint: 'Last 6 months statement', icon: Landmark, required: true },
  { key: 'businessProof', label: 'Business Proof', hint: 'Udyam certificate / GST / Shop license', icon: Building2, required: false },
  { key: 'photo', label: 'Passport Size Photo', hint: 'Recent photograph', icon: User, required: true },
];

const emptyForm = {
  fullName: '', dob: '', gender: '', mobile: '', email: '',
  password: '', confirmPassword: '',
  aadhar: '', pan: '', addressLine: '', city: '', state: '', pincode: '',
  businessName: '', businessType: '',
  udyamNumber: '', gstin: '', yearsInOperation: '', monthlyIncome: '',
  hasExistingLoans: '', existingLoanAmount: '',
  bankName: '', accountNumber: '', ifsc: '',
};

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

function SelectWithIcon({ icon: Icon, error, children, ...props }) {
  return (
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 z-10" />
      <select
        {...props}
        className="w-full appearance-none rounded-lg border bg-white py-2.5 pl-10 pr-3 text-[13px] outline-none transition-all focus:border-blue-500"
        style={{ borderColor: error ? RED : GRAY, fontFamily: FONT_BODY, color: props.value ? TEXT : '#94a3b8' }}
      >
        {children}
      </select>
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

/**
 * Register — a routed page at /register (not a popup).
 * Link to it with <Link to="/register"> or navigate('/register').
 */
export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState({});
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [referenceId, setReferenceId] = useState('');

  const resetAndClose = () => {
    navigate('/');
  };

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Same 2MB-per-document cap as Profile.jsx's Documents section — keeps
  // the eventual base64 payload well inside localStorage's quota instead
  // of failing later, silently, at final submit.
  const MAX_DOCUMENT_BYTES = 2 * 1024 * 1024;

  const updateFile = (field, file) => {
    if (file.size > MAX_DOCUMENT_BYTES) {
      setErrors((prev) => ({ ...prev, [field]: 'File is too large (max 2MB). Try a compressed PDF or a resized image.' }));
      return;
    }
    setFiles((prev) => ({ ...prev, [field]: file }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const removeFile = (field) => {
    setFiles((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validateStep = (index) => {
    const e = {};

    if (index === 0) {
      if (!form.fullName.trim()) e.fullName = 'Full name is required';
      if (!form.dob) e.dob = 'Date of birth is required';
      if (!form.gender) e.gender = 'Please select gender';
      if (!/^\d{10}$/.test(form.mobile.trim())) e.mobile = 'Enter a valid 10-digit mobile number';
      if (!form.email.trim()) e.email = 'Email is required';
      else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
      if (!form.password) e.password = 'Please create a password';
      else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
      if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password';
      else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match';
    }

    if (index === 1) {
      if (!/^\d{12}$/.test(form.aadhar.trim())) e.aadhar = 'Enter a valid 12-digit Aadhaar number';
      if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(form.pan.trim().toUpperCase())) e.pan = 'Enter a valid PAN (e.g. ABCDE1234F)';
      if (!form.addressLine.trim()) e.addressLine = 'Address is required';
      if (!form.city.trim()) e.city = 'City is required';
      if (!form.state.trim()) e.state = 'State is required';
      if (!/^\d{6}$/.test(form.pincode.trim())) e.pincode = 'Enter a valid 6-digit pincode';
    }

    if (index === 2) {
      if (!form.businessType) e.businessType = 'Please select an option';
      if (!form.monthlyIncome.trim()) e.monthlyIncome = 'Monthly income is required';
      if (!form.hasExistingLoans) e.hasExistingLoans = 'Please select an option';
      if (form.hasExistingLoans === 'Yes' && !form.existingLoanAmount.trim()) {
        e.existingLoanAmount = 'Enter the existing loan amount';
      }
    }

    if (index === 3) {
      if (!form.bankName.trim()) e.bankName = 'Bank name is required';
      if (!/^\d{9,18}$/.test(form.accountNumber.trim())) e.accountNumber = 'Enter a valid account number';
      if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc.trim().toUpperCase())) e.ifsc = 'Enter a valid IFSC code';
      DOCUMENT_FIELDS.forEach(({ key, required }) => {
        if (required && !files[key]) e[key] = 'Required';
      });
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (!validateStep(step)) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    // Convert each uploaded document to a base64 data URL so it can be
    // saved into the same localStorage-backed user record as everything
    // else (a raw File object can't survive JSON.stringify). This is what
    // lets the Profile page's Documents section show what was uploaded
    // here at registration.
    const documents = {};
    for (const { key } of DOCUMENT_FIELDS) {
      const file = files[key];
      if (file) {
        documents[key] = { name: file.name, type: file.type, dataUrl: await fileToDataUrl(file) };
      }
    }

    const result = registerUser({ ...form, documents });
    setSubmitting(false);

    if (!result.success) {
      if (result.message && result.message.toLowerCase().includes('already exists')) {
        // Duplicate email — send the user back to step 0 so they can see
        // the problem next to the field that caused it.
        setErrors({ email: result.message });
        setStep(0);
      } else {
        // Anything else (most likely the localStorage quota, since the
        // documents just converted to base64 are usually the biggest
        // thing being saved) — show it right where the user already is
        // instead of misattributing it to the email field.
        setSubmitError(result.message || 'Could not complete registration. Please try again.');
      }
      return;
    }

    setSubmitError('');
    const ref = 'LM' + Math.floor(100000 + Math.random() * 900000);
    setReferenceId(ref);
    setSubmitted(true);
  };

  const progressPct = ((step + 1) / STEPS.length) * 100;

  // FIX: the floating decorative icons previously used top/left percentages
  // (e.g. top: '78%', left: '10%') that landed on top of the vertical
  // stepper at the bottom of the panel, visually colliding with the
  // "Loan & Business" / "Documents" step icons. All three are now kept
  // in the upper portion of the panel (top <= 32%), well clear of the
  // stepper region which sits below the heading block.
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

      {/* ============ LEFT BRAND PANEL — desktop/tablet only ============ */}
      <div
        className="relative hidden w-full shrink-0 flex-col px-9 py-7 lg:flex lg:w-[38%] xl:w-[34%]"
        style={{ background: `linear-gradient(150deg, ${NAVY} 0%, #1b3583 55%, ${BLUE} 130%)` }}
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="auth-aurora absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl" style={{ background: BLUE_LIGHT, opacity: 0.22 }} />
          <div className="auth-aurora absolute -bottom-28 -right-16 h-72 w-72 rounded-full blur-3xl" style={{ background: BLUE, opacity: 0.3, animationDelay: '-6s' }} />
        </div>
        <div className="auth-grid-bg pointer-events-none absolute inset-0" />

        {/* Extra decorative icons — anchored by a fixed pixel offset (not
            percentage) so they always land in the clear background area
            below the sticky header/stepper block, regardless of how tall
            the panel stretches to match the form column. */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ top: 640, left: '14%' }}
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4.7, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <Landmark size={17} style={{ color: WHITE }} />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ top: 820, left: '58%' }}
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 32, height: 32, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <FileText size={16} style={{ color: WHITE }} />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ top: 590, left: '82%' }}
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4.2, delay: 0.3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 30, height: 30, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <Sparkles size={15} style={{ color: WHITE }} />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ top: 960, left: '20%' }}
          animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 5.3, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <Briefcase size={17} style={{ color: WHITE }} />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute"
          style={{ top: 1110, left: '65%' }}
          animate={{ y: [0, -12, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 4.6, delay: 1.1, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-center rounded-2xl" style={{ width: 32, height: 32, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}>
            <CreditCard size={16} style={{ color: WHITE }} />
          </div>
        </motion.div>

        {/* Content pins near the top of the viewport as the page scrolls,
            while the gradient panel behind it (see wrapper above) stretches
            the full height of the taller form column. */}
        <div className="relative z-10 flex flex-col gap-8 lg:sticky lg:top-7">
          {/* Decorative shield icon — travels with the pinned header so it
              never drifts out of sync with the content as the page scrolls. */}
          <motion.div
            className="pointer-events-none absolute -top-1 right-0"
            animate={{ y: [0, -12, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div
              className="flex items-center justify-center rounded-2xl"
              style={{ width: 36, height: 36, background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.24)' }}
            >
              <ShieldCheck size={18} style={{ color: WHITE }} />
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
        <div className="relative z-10 max-w-sm">
          <motion.span
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
            className="mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10.5px] font-semibold backdrop-blur-md"
            style={{ background: 'rgba(255,255,255,.10)', borderColor: 'rgba(255,255,255,.24)', color: WHITE }}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Loan Application Registration
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
            className="text-[1.6rem] font-bold leading-[1.16]" style={{ color: WHITE, fontFamily: FONT_HEAD }}
          >
            One form, five short steps, one straight answer.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
            className="mt-3 text-[12.5px] leading-relaxed" style={{ color: 'rgba(253,253,253,.78)' }}
          >
            Personal details, identity, loan needs, documents, then a final review — nothing to repeat later.
          </motion.p>
        </div>

        {/* Bottom — vertical stepper */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
          className="relative z-10 mt-2 space-y-1"
        >
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <div key={s.title} className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold transition-all"
                    style={{
                      background: done || active ? WHITE : 'transparent',
                      color: done || active ? NAVY : 'rgba(253,253,253,.55)',
                      border: `2px solid ${done || active ? WHITE : 'rgba(255,255,255,.3)'}`,
                    }}
                  >
                    {done ? <CheckCircle2 className="h-3 w-3" /> : <Icon className="h-2.5 w-2.5" />}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="h-5 w-0.5" style={{ background: done ? WHITE : 'rgba(255,255,255,.25)' }} />
                  )}
                </div>
                <span className="pb-4 text-[12px] font-semibold" style={{ color: active ? WHITE : 'rgba(253,253,253,.62)' }}>
                  {s.title}
                </span>
              </div>
            );
          })}
        </motion.div>
        </div>
      </div>

      {/* ============ RIGHT FORM PANEL ============ */}
      <div className="flex-1" style={{ background: BLUE_PALE }}>
        <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8 sm:py-10 lg:px-10">
          {/* Mobile-only compact header — the brand panel is hidden below lg */}
          {!submitted && (
          <div className="mb-5 lg:hidden">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-medium">
              <button onClick={() => navigate('/')} className="transition-colors" style={{ color: SLATE }}>Home</button>
              <ArrowRight className="h-3.5 w-3.5" style={{ color: GRAY }} />
              <span className="font-semibold" style={{ color: NAVY }}>Register</span>
            </div>
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: NAVY }}>
              <Landmark className="h-4.5 w-4.5" style={{ color: WHITE }} />
            </div>
            <h1 className="text-[1.45rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>Register your loan application</h1>
            <p className="mt-1.5 text-[12.5px] leading-relaxed" style={{ color: SLATE }}>Five short steps — takes about five minutes.</p>
          </div>
          )}

          {/* Desktop-only compact eyebrow, since the big heading already lives in the left panel */}
          {!submitted && (
          <div className="mb-6 hidden lg:block">
            <div className="mb-3 flex items-center gap-2 text-[13px] font-medium">
              <button onClick={() => navigate('/')} className="transition-colors hover:text-slate-700" style={{ color: SLATE }}>Home</button>
              <ArrowRight className="h-3.5 w-3.5" style={{ color: GRAY }} />
              <span className="font-semibold" style={{ color: NAVY }}>Register</span>
            </div>
            <h2 className="text-[1.55rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>{STEPS[step]?.title}</h2>
            <p className="mt-1.5 text-[12.5px]" style={{ color: SLATE }}>Step {step + 1} of {STEPS.length}</p>
          </div>
          )}

          {submitted ? (
              <div className="py-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 220, delay: 0.15 }}
                  className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full"
                  style={{ background: '#e9f7ef' }}
                >
                  <CheckCircle2 className="h-8 w-8" style={{ color: '#1a7f4b' }} />
                </motion.div>

                <h2 className="text-[1.4rem] font-bold" style={{ color: NAVY, fontFamily: FONT_HEAD }}>
                  Registration Submitted
                </h2>

                <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed" style={{ color: SLATE }}>
                  Thanks, {form.fullName.split(' ')[0]}. Your loan application has been received
                  and your account has been created. Our team will review your details and
                  contact you on <strong style={{ color: TEXT }}>{form.mobile}</strong> within
                  24-48 hours.
                </p>

                <div
                  className="mx-auto mt-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-semibold"
                  style={{ background: BLUE_PALE, color: NAVY, border: `1px solid ${BLUE_TINT}` }}
                >
                  Reference ID: <span style={{ color: BLUE }}>{referenceId}</span>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="mt-7 inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
                  style={{ background: NAVY }}
                >
                  Continue to Login
                </button>
              </div>
            ) : (
              <>
                {/* Stepper — mobile only; desktop shows the vertical version in the left panel */}
                <div className="pb-5 lg:hidden">
                  <div className="mb-2.5 flex items-center justify-between">
                    {STEPS.map((s, i) => {
                      const Icon = s.icon;
                      const active = i === step;
                      const done = i < step;
                      return (
                        <div key={s.title} className="flex flex-1 flex-col items-center">
                          <div
                            className="flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold transition-all"
                            style={{
                              background: done || active ? BLUE : WHITE,
                              color: done || active ? WHITE : SLATE,
                              border: `2px solid ${done || active ? BLUE : GRAY}`,
                            }}
                          >
                            {done ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-3.5 w-3.5" />}
                          </div>
                          <span
                            className="mt-1 hidden text-center text-[9.5px] font-semibold leading-tight sm:block"
                            style={{ color: active ? NAVY : SLATE }}
                          >
                            {s.title}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: BLUE_TINT }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${NAVY}, ${BLUE})` }}
                      animate={{ width: `${progressPct}%` }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  </div>
                </div>

                {/* Desktop progress bar — compact, under the step-title eyebrow above */}
                <div className="mb-6 hidden h-1.5 w-full overflow-hidden rounded-full lg:block" style={{ background: BLUE_TINT }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: `linear-gradient(90deg, ${NAVY}, ${BLUE})` }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: EASE }}
                  />
                </div>

                <div className="h-px w-full lg:hidden" style={{ background: `${GRAY}45` }} />

                {/* Form body */}
                <div className="py-6">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={step}
                      custom={direction}
                      initial={{ opacity: 0, x: direction * 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: direction * -24 }}
                      transition={{ duration: 0.3, ease: EASE }}
                    >
                      {/* ===== STEP 0: PERSONAL ===== */}
                      {step === 0 && (
                        <div className="space-y-4">
                          <Field label="Full Name" error={errors.fullName}>
                            <InputWithIcon icon={User} error={errors.fullName} type="text" placeholder="e.g. Surega R"
                              value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
                          </Field>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Date of Birth" error={errors.dob}>
                              <InputWithIcon icon={Calendar} error={errors.dob} type="date"
                                value={form.dob} onChange={(e) => update('dob', e.target.value)} />
                            </Field>

                            <Field label="Gender" error={errors.gender}>
                              <SelectWithIcon icon={Users} error={errors.gender}
                                value={form.gender} onChange={(e) => update('gender', e.target.value)}>
                                <option value="">Select gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                              </SelectWithIcon>
                            </Field>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Mobile Number" error={errors.mobile}>
                              <InputWithIcon icon={Phone} error={errors.mobile} type="tel" placeholder="10-digit mobile number"
                                value={form.mobile}
                                onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))} />
                            </Field>

                            <Field label="Email Address" error={errors.email}>
                              <InputWithIcon icon={Mail} error={errors.email} type="email" placeholder="you@example.com"
                                value={form.email} onChange={(e) => update('email', e.target.value)} />
                            </Field>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Create Password" error={errors.password}>
                              <InputWithIcon icon={Lock} error={errors.password} type="password" placeholder="At least 6 characters"
                                value={form.password} onChange={(e) => update('password', e.target.value)} />
                            </Field>

                            <Field label="Confirm Password" error={errors.confirmPassword}>
                              <InputWithIcon icon={Lock} error={errors.confirmPassword} type="password" placeholder="Re-enter password"
                                value={form.confirmPassword} onChange={(e) => update('confirmPassword', e.target.value)} />
                            </Field>
                          </div>
                        </div>
                      )}

                      {/* ===== STEP 1: IDENTITY & ADDRESS ===== */}
                      {step === 1 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Aadhaar Number" error={errors.aadhar}>
                              <InputWithIcon icon={Fingerprint} error={errors.aadhar} type="text" placeholder="12-digit Aadhaar number"
                                value={form.aadhar}
                                onChange={(e) => update('aadhar', e.target.value.replace(/\D/g, '').slice(0, 12))} />
                            </Field>

                            <Field label="PAN Number" error={errors.pan}>
                              <InputWithIcon icon={CreditCard} error={errors.pan} type="text" placeholder="ABCDE1234F"
                                value={form.pan}
                                onChange={(e) => update('pan', e.target.value.toUpperCase().slice(0, 10))} />
                            </Field>
                          </div>

                          <Field label="Address" error={errors.addressLine}>
                            <InputWithIcon icon={MapPin} error={errors.addressLine} type="text" placeholder="House no, street, locality"
                              value={form.addressLine} onChange={(e) => update('addressLine', e.target.value)} />
                          </Field>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <Field label="City" error={errors.city}>
                              <InputWithIcon icon={Building2} error={errors.city} type="text" placeholder="Chennai"
                                value={form.city} onChange={(e) => update('city', e.target.value)} />
                            </Field>

                            <Field label="State" error={errors.state}>
                              <InputWithIcon icon={MapPin} error={errors.state} type="text" placeholder="Tamil Nadu"
                                value={form.state} onChange={(e) => update('state', e.target.value)} />
                            </Field>

                            <Field label="Pincode" error={errors.pincode}>
                              <InputWithIcon icon={MapPin} error={errors.pincode} type="text" placeholder="600001"
                                value={form.pincode}
                                onChange={(e) => update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                            </Field>
                          </div>
                        </div>
                      )}

                      {/* ===== STEP 2: LOAN & BUSINESS ===== */}
                      {step === 2 && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Business / Enterprise Name (optional)">
                              <InputWithIcon icon={Building2} type="text" placeholder="e.g. Surega Textiles"
                                value={form.businessName} onChange={(e) => update('businessName', e.target.value)} />
                            </Field>

                            <Field label="Business Type" error={errors.businessType}>
                              <SelectWithIcon icon={Briefcase} error={errors.businessType}
                                value={form.businessType} onChange={(e) => update('businessType', e.target.value)}>
                                <option value="">Select type</option>
                                <option>Sole Proprietorship</option>
                                <option>Partnership</option>
                                <option>Private Limited</option>
                                <option>Not Applicable</option>
                              </SelectWithIcon>
                            </Field>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Udyam Registration Number (optional)">
                              <InputWithIcon icon={Hash} type="text" placeholder="UDYAM-XX-00-0000000"
                                value={form.udyamNumber} onChange={(e) => update('udyamNumber', e.target.value.toUpperCase())} />
                            </Field>

                            <Field label="GSTIN (optional)">
                              <InputWithIcon icon={FileText} type="text" placeholder="15-digit GST number"
                                value={form.gstin} onChange={(e) => update('gstin', e.target.value.toUpperCase().slice(0, 15))} />
                            </Field>
                          </div>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Years in Business / Operation (optional)">
                              <InputWithIcon icon={Calendar} type="text" placeholder="e.g. 3"
                                value={form.yearsInOperation}
                                onChange={(e) => update('yearsInOperation', e.target.value.replace(/\D/g, ''))} />
                            </Field>

                            <Field label="Monthly Income (₹)" error={errors.monthlyIncome}>
                              <InputWithIcon icon={Banknote} error={errors.monthlyIncome} type="text" placeholder="25000"
                                value={form.monthlyIncome}
                                onChange={(e) => update('monthlyIncome', e.target.value.replace(/\D/g, ''))} />
                            </Field>
                          </div>

                          <Field label="Do you have any existing loans?" error={errors.hasExistingLoans}>
                            <div className="flex gap-3">
                              {['Yes', 'No'].map((opt) => (
                                <button
                                  type="button"
                                  key={opt}
                                  onClick={() => update('hasExistingLoans', opt)}
                                  className="flex-1 rounded-lg border py-2.5 text-[13px] font-semibold transition-all"
                                  style={{
                                    borderColor: form.hasExistingLoans === opt ? BLUE : GRAY,
                                    background: form.hasExistingLoans === opt ? BLUE_PALE : WHITE,
                                    color: form.hasExistingLoans === opt ? NAVY : SLATE,
                                  }}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </Field>

                          {form.hasExistingLoans === 'Yes' && (
                            <Field label="Existing Loan Amount (₹)" error={errors.existingLoanAmount}>
                              <InputWithIcon icon={Banknote} error={errors.existingLoanAmount} type="text" placeholder="100000"
                                value={form.existingLoanAmount}
                                onChange={(e) => update('existingLoanAmount', e.target.value.replace(/\D/g, ''))} />
                            </Field>
                          )}
                        </div>
                      )}

                      {/* ===== STEP 3: DOCUMENTS ===== */}
                      {step === 3 && (
                        <div className="space-y-4">
                          <Field label="Bank Name" error={errors.bankName}>
                            <InputWithIcon icon={Landmark} error={errors.bankName} type="text" placeholder="e.g. Central Bank of India"
                              value={form.bankName} onChange={(e) => update('bankName', e.target.value)} />
                          </Field>

                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <Field label="Account Number" error={errors.accountNumber}>
                              <InputWithIcon icon={CreditCard} error={errors.accountNumber} type="text" placeholder="Bank account number"
                                value={form.accountNumber}
                                onChange={(e) => update('accountNumber', e.target.value.replace(/\D/g, '').slice(0, 18))} />
                            </Field>

                            <Field label="IFSC Code" error={errors.ifsc}>
                              <InputWithIcon icon={ShieldCheck} error={errors.ifsc} type="text" placeholder="e.g. CBIN0284012"
                                value={form.ifsc} onChange={(e) => update('ifsc', e.target.value.toUpperCase().slice(0, 11))} />
                            </Field>
                          </div>

                          <div className="mt-2 h-px w-full" style={{ background: BLUE_TINT }} />

                          <p className="text-[12.5px] font-semibold" style={{ color: NAVY }}>Upload Documents</p>
                          <p className="text-[11.5px]" style={{ color: SLATE }}>
                            These are what a lender checks before sanctioning a loan — identity, address, income, and a bank statement are mandatory. Business proof is required only if you're borrowing for a registered business.
                          </p>

                          <div className="divide-y" style={{ borderColor: `${GRAY}45` }}>
                            {DOCUMENT_FIELDS.map(({ key, label, hint, icon: Icon, required }) => {
                              const file = files[key];
                              return (
                                <div
                                  key={key}
                                  className="flex items-center justify-between gap-3 py-3"
                                  style={{ borderColor: `${GRAY}45` }}
                                >
                                  <div className="flex min-w-0 items-center gap-3">
                                    <div
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                                      style={{ background: BLUE_PALE }}
                                    >
                                      <Icon className="h-4 w-4" style={{ color: BLUE }} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="truncate text-[12.5px] font-semibold" style={{ color: TEXT }}>
                                        {label}{required && <span style={{ color: RED }}> *</span>}
                                      </p>
                                      <p className="truncate text-[11px]" style={{ color: errors[key] ? RED : SLATE }}>
                                        {file ? file.name : (errors[key] || hint)}
                                      </p>
                                    </div>
                                  </div>

                                  {file ? (
                                    <button
                                      type="button"
                                      onClick={() => removeFile(key)}
                                      className="shrink-0 rounded-full p-2 text-slate-500 hover:bg-slate-100"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  ) : (
                                    <label
                                      className="shrink-0 cursor-pointer rounded-full px-3.5 py-2 text-[11.5px] font-semibold text-white"
                                      style={{ background: NAVY }}
                                    >
                                      Upload
                                      <input
                                        type="file"
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        onChange={(e) => e.target.files[0] && updateFile(key, e.target.files[0])}
                                      />
                                    </label>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ===== STEP 4: REVIEW ===== */}
                      {step === 4 && (
                        <div className="space-y-4">
                          <ReviewSection title="Personal Details">
                            <ReviewRow label="Name" value={form.fullName} />
                            <ReviewRow label="DOB" value={form.dob} />
                            <ReviewRow label="Gender" value={form.gender} />
                            <ReviewRow label="Mobile" value={form.mobile} />
                            <ReviewRow label="Email" value={form.email} />
                          </ReviewSection>

                          <ReviewSection title="Identity & Address">
                            <ReviewRow label="Aadhaar" value={form.aadhar} />
                            <ReviewRow label="PAN" value={form.pan} />
                            <ReviewRow label="Address" value={`${form.addressLine}, ${form.city}, ${form.state} - ${form.pincode}`} />
                          </ReviewSection>

                          <ReviewSection title="Loan & Business">
                            <ReviewRow label="Business Name" value={form.businessName || '—'} />
                            <ReviewRow label="Business Type" value={form.businessType} />
                            <ReviewRow label="Udyam No." value={form.udyamNumber || '—'} />
                            <ReviewRow label="GSTIN" value={form.gstin || '—'} />
                            <ReviewRow label="Monthly Income" value={form.monthlyIncome && `₹${form.monthlyIncome}`} />
                            <ReviewRow label="Existing Loans" value={form.hasExistingLoans === 'Yes' ? `Yes (₹${form.existingLoanAmount})` : 'No'} />
                          </ReviewSection>

                          <ReviewSection title="Bank Details">
                            <ReviewRow label="Bank" value={form.bankName} />
                            <ReviewRow label="Account No." value={form.accountNumber} />
                            <ReviewRow label="IFSC" value={form.ifsc} />
                          </ReviewSection>

                          <ReviewSection title="Documents">
                            {DOCUMENT_FIELDS.map(({ key, label }) => (
                              <ReviewRow key={key} label={label} value={files[key] ? files[key].name : 'Not uploaded'} />
                            ))}
                          </ReviewSection>

                          <div
                            className="flex items-start gap-2 rounded-lg p-3 text-[11.5px]"
                            style={{ background: BLUE_PALE, color: SLATE }}
                          >
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: BLUE }} />
                            By submitting, you confirm that the details provided above are accurate to the best of your knowledge.
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Navigation */}
                {submitError && (
                  <div
                    className="mt-6 rounded-lg p-3 text-[12.5px] font-semibold"
                    style={{ background: '#fdecea', color: RED, border: `1px solid #f6c6c0` }}
                  >
                    {submitError}
                  </div>
                )}
                <div className="mt-6 flex items-center justify-between gap-3 border-t pt-5" style={{ borderColor: `${GRAY}45` }}>
                  <button
                    type="button"
                    onClick={step === 0 ? resetAndClose : goBack}
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold hover:underline"
                    style={{ color: SLATE }}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {step === 0 ? 'Cancel' : 'Back'}
                  </button>

                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      onClick={goNext}
                      className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white"
                      style={{ background: `linear-gradient(135deg, ${BLUE}, ${NAVY})` }}
                    >
                      Continue
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={submitting}
                      className="inline-flex items-center gap-1.5 rounded-full px-6 py-2.5 text-[13px] font-semibold text-white disabled:opacity-60"
                      style={{ background: NAVY }}
                    >
                      {submitting ? 'Submitting…' : 'Submit Application'}
                      <CheckCircle2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </>
            )}
      </div>
      </div>
    </div>
  );
}

function ReviewSection({ title, children }) {
  return (
    <div className="border-b pb-4" style={{ borderColor: `${GRAY}45` }}>
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-wide" style={{ color: BLUE }}>{title}</p>
      <div className="space-y-1.5">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2 text-[12.5px]">
      <span style={{ color: SLATE }}>{label}</span>
      <span className="text-right font-semibold" style={{ color: TEXT }}>{value || '—'}</span>
    </div>
  );
}