// Loan scheme persistence — same low-tech localStorage approach
// utils/auth.js uses for users and applications, scoped to its own key
// so this feature can be dropped in without touching that file.

const STORAGE_KEY = 'loan_admin_schemes';
export const SCHEME_CHANGE_EVENT = 'schemeschange';

export const LOAN_TYPES = ['Personal Loan', 'Home Loan', 'Business Loan', 'Vehicle Loan', 'Education Loan', 'Agriculture Loan'];
export const CATEGORIES = ['Personal', 'Housing', 'Business', 'Automotive', 'Education', 'Agriculture'];
export const TENURE_OPTIONS = ['6 - 12 months', '12 - 24 months', '12 - 60 months', '12 - 84 months', '12 - 96 months', '12 - 120 months', '60 - 240 months'];
export const COLLATERAL_OPTIONS = ['Not Required', 'Required', 'Partially Secured', 'Depends on Profile'];

function monthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}

function seedSchemes() {
  return [
    { id: 'LS-001', name: 'Personal Loan Plus', loanType: 'Personal Loan', category: 'Personal', shortDescription: 'Quick, unsecured funding for weddings, travel or medical expenses.', bannerImage: null, keywords: ['personal', 'quick', 'unsecured'], interestRate: 10.5, minAmount: 25000, maxAmount: 1000000, tenure: '12 - 60 months', eligibility: 'Age 21-58, minimum net monthly income of ₹20,000, at least 1 year of employment.', documents: 'PAN card, Aadhaar card, salary slips (3 months), bank statement (6 months).', collateral: 'Not Required', status: 'Active', createdAt: monthsAgo(0) },
    { id: 'LS-002', name: 'Home Loan Prime', loanType: 'Home Loan', category: 'Housing', shortDescription: 'Long-tenure financing to buy, build or extend a home.', bannerImage: null, keywords: ['home', 'housing', 'property'], interestRate: 8.2, minAmount: 500000, maxAmount: 7500000, tenure: '60 - 240 months', eligibility: 'Age 23-65, stable income source, property under approved projects preferred.', documents: 'Identity & address proof, income proof, property documents.', collateral: 'Required', status: 'Active', createdAt: monthsAgo(0) },
    { id: 'LS-003', name: 'Business Growth Loan', loanType: 'Business Loan', category: 'Business', shortDescription: 'Working capital and expansion funding for growing businesses.', bannerImage: null, keywords: ['business', 'growth', 'working capital'], interestRate: 11.0, minAmount: 100000, maxAmount: 5000000, tenure: '12 - 84 months', eligibility: 'Business vintage of 2+ years, minimum annual turnover of ₹10 lakh.', documents: 'GST returns, ITR (2 years), bank statements, business registration proof.', collateral: 'Partially Secured', status: 'Active', createdAt: monthsAgo(1) },
    { id: 'LS-004', name: 'Vehicle Loan Drive', loanType: 'Vehicle Loan', category: 'Automotive', shortDescription: 'Finance new or used cars with flexible EMI options.', bannerImage: null, keywords: ['vehicle', 'car', 'auto'], interestRate: 9.5, minAmount: 50000, maxAmount: 2000000, tenure: '12 - 84 months', eligibility: 'Age 21-60, valid driving license, minimum income of ₹15,000/month.', documents: 'PAN card, Aadhaar card, income proof, vehicle quotation.', collateral: 'Required', status: 'Active', createdAt: monthsAgo(1) },
    { id: 'LS-005', name: 'Education Loan Support', loanType: 'Education Loan', category: 'Education', shortDescription: 'Covers tuition, hostel and travel costs for higher studies.', bannerImage: null, keywords: ['education', 'student', 'study'], interestRate: 7.8, minAmount: 50000, maxAmount: 3000000, tenure: '12 - 120 months', eligibility: 'Admission confirmation letter, co-applicant with stable income.', documents: 'Admission letter, fee structure, co-applicant income proof.', collateral: 'Depends on Profile', status: 'Inactive', createdAt: monthsAgo(2) },
    { id: 'LS-006', name: 'Agri Loan Scheme', loanType: 'Agriculture Loan', category: 'Agriculture', shortDescription: 'Seasonal and equipment financing for farmers and agri-businesses.', bannerImage: null, keywords: ['agriculture', 'farming', 'rural'], interestRate: 8.9, minAmount: 50000, maxAmount: 2500000, tenure: '12 - 96 months', eligibility: 'Land ownership or lease proof, active farming activity.', documents: 'Land records, Aadhaar card, bank statement.', collateral: 'Partially Secured', status: 'Active', createdAt: monthsAgo(2) },
    { id: 'LS-007', name: 'MSME Loan Boost', loanType: 'Business Loan', category: 'Business', shortDescription: 'Collateral-light credit for registered micro and small enterprises.', bannerImage: null, keywords: ['msme', 'sme', 'business'], interestRate: 9.0, minAmount: 200000, maxAmount: 10000000, tenure: '12 - 120 months', eligibility: 'Udyam registration, 1+ year of operations.', documents: 'Udyam certificate, GST returns, bank statements.', collateral: 'Partially Secured', status: 'Inactive', createdAt: monthsAgo(3) },
    { id: 'LS-008', name: 'Gold Loan Instant', loanType: 'Personal Loan', category: 'Personal', shortDescription: 'Same-day disbursal against gold jewellery, minimal paperwork.', bannerImage: null, keywords: ['gold', 'instant', 'quick'], interestRate: 9.8, minAmount: 10000, maxAmount: 2000000, tenure: '6 - 12 months', eligibility: 'Age 18+, valid ID proof, ownership of gold ornaments.', documents: 'PAN or Aadhaar card, gold ownership declaration.', collateral: 'Required', status: 'Active', createdAt: monthsAgo(3) },
    { id: 'LS-009', name: 'Home Renovation Loan', loanType: 'Home Loan', category: 'Housing', shortDescription: 'Funds repairs, interiors and structural upgrades to an existing home.', bannerImage: null, keywords: ['renovation', 'home', 'repair'], interestRate: 9.0, minAmount: 100000, maxAmount: 1500000, tenure: '12 - 84 months', eligibility: 'Existing homeowner, minimum income of ₹18,000/month.', documents: 'Property ownership proof, renovation estimate, income proof.', collateral: 'Depends on Profile', status: 'Active', createdAt: monthsAgo(4) },
    { id: 'LS-010', name: 'Two Wheeler Loan', loanType: 'Vehicle Loan', category: 'Automotive', shortDescription: 'Low down-payment financing for scooters and motorcycles.', bannerImage: null, keywords: ['two wheeler', 'bike', 'scooter'], interestRate: 10.2, minAmount: 20000, maxAmount: 300000, tenure: '12 - 60 months', eligibility: 'Age 18+, valid driving license.', documents: 'PAN or Aadhaar card, vehicle quotation.', collateral: 'Required', status: 'Active', createdAt: monthsAgo(4) },
    { id: 'LS-011', name: 'Working Capital Loan', loanType: 'Business Loan', category: 'Business', shortDescription: 'Short-term liquidity to cover day-to-day operating expenses.', bannerImage: null, keywords: ['working capital', 'business', 'liquidity'], interestRate: 10.5, minAmount: 100000, maxAmount: 3000000, tenure: '12 - 60 months', eligibility: 'Business vintage of 1+ year, positive cash flow.', documents: 'Bank statements, GST returns, business proof.', collateral: 'Partially Secured', status: 'Active', createdAt: monthsAgo(5) },
    { id: 'LS-012', name: 'Higher Studies Abroad Loan', loanType: 'Education Loan', category: 'Education', shortDescription: 'Larger-ticket funding for tuition and living costs overseas.', bannerImage: null, keywords: ['abroad', 'education', 'overseas'], interestRate: 8.4, minAmount: 300000, maxAmount: 5000000, tenure: '12 - 120 months', eligibility: 'Confirmed offer letter from a recognised university, co-applicant required.', documents: 'Offer letter, visa documents, co-applicant income proof.', collateral: 'Required', status: 'Active', createdAt: monthsAgo(5) },
  ];
}

function readStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded = seedSchemes();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedSchemes();
  }
}

function writeStore(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(SCHEME_CHANGE_EVENT));
}

function nextId(list) {
  const nums = list.map((s) => parseInt(String(s.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `LS-${String(next).padStart(3, '0')}`;
}

export function getSchemes() {
  return readStore();
}

// Adds a new scheme when `data.id` is absent, otherwise updates the
// matching row in place. Returns the full, refreshed list.
export function saveScheme(data) {
  const list = readStore();
  let next;
  if (data.id) {
    next = list.map((s) => (s.id === data.id ? { ...s, ...data } : s));
  } else {
    next = [...list, { ...data, id: nextId(list), createdAt: new Date().toISOString() }];
  }
  writeStore(next);
  return next;
}

export function toggleSchemeStatus(id) {
  const list = readStore();
  const next = list.map((s) => (s.id === id ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' } : s));
  writeStore(next);
  return next;
}

export function deleteScheme(id) {
  const list = readStore();
  const next = list.filter((s) => s.id !== id);
  writeStore(next);
  return next;
}