// Bank + Branch persistence — same low-tech localStorage approach
// schemesService.js uses for loan schemes, scoped to its own keys so this
// feature can be dropped in without touching that file.
//
// Two separate stores, matching the two separate admin forms:
//   - Banks:    identity only — name, logo, active/inactive ("Add Bank")
//   - Branches: everything branch-specific — type, IFSC, branch name,
//               description, and one or more branch managers
//               ("Add Branch Manager"), each pointing back at its bank
//               via bankId. A branch's active/inactive state follows its
//               parent bank's status; branches aren't toggled separately.

const BANK_STORAGE_KEY = 'loan_admin_banks';
export const BANK_CHANGE_EVENT = 'bankschange';

const BRANCH_STORAGE_KEY = 'loan_admin_bank_branches';
export const BRANCH_CHANGE_EVENT = 'bankbrancheschange';

export const BANK_TYPES = ['Public Sector', 'Private Sector', 'Cooperative Bank', 'Regional Rural Bank', 'Foreign Bank'];

function monthsAgo(n) {
  const d = new Date();
  d.setMonth(d.getMonth() - n);
  return d.toISOString();
}

// One seed list, split into its Bank half and Branch half below, so the
// two stores start out cross-referenced by id the same way real entries
// added through the two forms will be.
const SEED = [
  { bankId: 'BNK-001', name: 'State Bank of India', shortName: 'SBI', bankType: 'Public Sector', ifscCode: 'SBIN0001234', branchName: 'Chennai Main', shortDescription: "India's largest public sector bank offering nationwide branch coverage.", managerName: 'R. Kumaresan', phone: '1800 123 4567', status: 'Active', monthsAgo: 0 },
  { bankId: 'BNK-002', name: 'HDFC Bank', shortName: 'HDFC', bankType: 'Private Sector', ifscCode: 'HDFC0005678', branchName: 'Anna Nagar', shortDescription: 'Leading private sector bank known for digital banking services.', managerName: 'Priya Raman', phone: '1800 202 6161', status: 'Active', monthsAgo: 0 },
  { bankId: 'BNK-003', name: 'ICICI Bank', shortName: 'ICICI', bankType: 'Private Sector', ifscCode: 'ICIC0009876', branchName: 'T. Nagar', shortDescription: 'Private sector bank offering retail and corporate banking solutions.', managerName: 'Arvind Selvam', phone: '1800 1080 1080', status: 'Active', monthsAgo: 0 },
  { bankId: 'BNK-004', name: 'Axis Bank', shortName: 'AXIS', bankType: 'Private Sector', ifscCode: 'UTIB0003456', branchName: 'Velachery', shortDescription: 'Private sector bank with a strong retail and SME lending portfolio.', managerName: 'Divya Shankar', phone: '1800 419 5959', status: 'Inactive', monthsAgo: 1 },
  { bankId: 'BNK-005', name: 'Punjab National Bank', shortName: 'PNB', bankType: 'Public Sector', ifscCode: 'PUNB0123456', branchName: 'Chromepet', shortDescription: 'Public sector bank with a wide rural and semi-urban reach.', managerName: 'Ganesh Iyer', phone: '1800 180 2222', status: 'Active', monthsAgo: 1 },
  { bankId: 'BNK-006', name: 'Bank of Baroda', shortName: 'BOB', bankType: 'Public Sector', ifscCode: 'BARB0CHENNAI', branchName: 'Guindy', shortDescription: 'Public sector bank offering competitive rates on retail loans.', managerName: 'Meena Pillai', phone: '1800 258 4455', status: 'Active', monthsAgo: 2 },
  { bankId: 'BNK-007', name: 'Kotak Mahindra Bank', shortName: 'KOTAK', bankType: 'Private Sector', ifscCode: 'KKBK0001122', branchName: 'Adyar', shortDescription: 'Private sector bank with fast-track personal loan processing.', managerName: 'Sanjay Mehta', phone: '1800 274 0110', status: 'Active', monthsAgo: 2 },
  { bankId: 'BNK-008', name: 'Tamil Nadu State Apex Cooperative Bank', shortName: 'TNSC', bankType: 'Cooperative Bank', ifscCode: 'TNSC0000045', branchName: 'Egmore', shortDescription: 'Apex cooperative bank supporting agriculture and rural credit.', managerName: 'Lakshmi Narayanan', phone: '1800 425 1122', status: 'Active', monthsAgo: 3 },
  { bankId: 'BNK-009', name: 'Pandyan Grama Bank', shortName: 'PGB', bankType: 'Regional Rural Bank', ifscCode: 'PGBK0002233', branchName: 'Madurai Main', shortDescription: 'Regional rural bank focused on agriculture and small enterprise credit.', managerName: 'Muthu Vel', phone: '1800 425 3344', status: 'Active', monthsAgo: 3 },
  { bankId: 'BNK-010', name: 'HSBC Bank', shortName: 'HSBC', bankType: 'Foreign Bank', ifscCode: 'HSBC0400002', branchName: 'Nungambakkam', shortDescription: 'Foreign bank offering premium and NRI banking services.', managerName: 'Karthik Rao', phone: '1800 267 3456', status: 'Inactive', monthsAgo: 4 },
  { bankId: 'BNK-011', name: 'Canara Bank', shortName: 'CANARA', bankType: 'Public Sector', ifscCode: 'CNRB0001987', branchName: 'Mylapore', shortDescription: 'Public sector bank with strong education and housing loan schemes.', managerName: 'Revathi Suresh', phone: '1800 425 0018', status: 'Active', monthsAgo: 4 },
  { bankId: 'BNK-012', name: 'IDFC FIRST Bank', shortName: 'IDFC', bankType: 'Private Sector', ifscCode: 'IDFB0041234', branchName: 'Porur', shortDescription: 'Private sector bank with digital-first personal loan products.', managerName: 'Naveen Kumar', phone: '1800 419 4332', status: 'Active', monthsAgo: 5 },
  { bankId: 'BNK-013', name: 'Standard Chartered Bank', shortName: 'SCB', bankType: 'Foreign Bank', ifscCode: 'SCBL0036001', branchName: 'RK Salai', shortDescription: 'Foreign bank offering wealth management and business banking.', managerName: 'Anitha Bose', phone: '1800 419 5555', status: 'Inactive', monthsAgo: 5 },
  { bankId: 'BNK-014', name: 'Tamil Nadu Grama Bank', shortName: 'TNGB', bankType: 'Regional Rural Bank', ifscCode: 'TNGB0000567', branchName: 'Vellore', shortDescription: 'Regional rural bank serving farmers and small traders across the state.', managerName: 'Balamurugan S', phone: '1800 425 9988', status: 'Inactive', monthsAgo: 6 },
];

function seedBanks() {
  return SEED.map((s) => ({
    id: s.bankId,
    name: s.name,
    shortName: s.shortName,
    logo: null,
    status: s.status,
    createdAt: monthsAgo(s.monthsAgo),
  }));
}

function seedBranches() {
  return SEED.map((s, i) => ({
    id: `BR-${String(i + 1).padStart(3, '0')}`,
    bankId: s.bankId,
    bankName: s.name,
    branchName: s.branchName,
    ifscCode: s.ifscCode,
    bankType: s.bankType,
    shortDescription: s.shortDescription,
    managers: [{ name: s.managerName, phone: s.phone }],
    createdAt: monthsAgo(s.monthsAgo),
  }));
}

function readStore() {
  try {
    const raw = localStorage.getItem(BANK_STORAGE_KEY);
    if (!raw) {
      const seeded = seedBanks();
      localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedBanks();
  }
}

function writeStore(list) {
  localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(BANK_CHANGE_EVENT));
}

function nextId(list) {
  const nums = list.map((b) => parseInt(String(b.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `BNK-${String(next).padStart(3, '0')}`;
}

export function getBanks() {
  return readStore();
}

// Adds a new bank when `data.id` is absent, otherwise updates the
// matching row in place. Returns the full, refreshed list.
export function saveBank(data) {
  const list = readStore();
  let next;
  if (data.id) {
    next = list.map((b) => (b.id === data.id ? { ...b, ...data } : b));
  } else {
    next = [...list, { ...data, id: nextId(list), createdAt: new Date().toISOString() }];
  }
  writeStore(next);
  return next;
}

export function toggleBankStatus(id) {
  const list = readStore();
  const next = list.map((b) => (b.id === id ? { ...b, status: b.status === 'Active' ? 'Inactive' : 'Active' } : b));
  writeStore(next);
  return next;
}

export function deleteBank(id) {
  const list = readStore();
  const next = list.filter((b) => b.id !== id);
  writeStore(next);
  return next;
}

// --- Branches (each belongs to one bank, added via "Add Branch Manager") ---

function readBranchStore() {
  try {
    const raw = localStorage.getItem(BRANCH_STORAGE_KEY);
    if (!raw) {
      const seeded = seedBranches();
      localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw);
  } catch {
    return seedBranches();
  }
}

function writeBranchStore(list) {
  localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(BRANCH_CHANGE_EVENT));
}

function nextBranchId(list) {
  const nums = list.map((b) => parseInt(String(b.id).replace(/\D/g, ''), 10)).filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `BR-${String(next).padStart(3, '0')}`;
}

export function getBranches() {
  return readBranchStore();
}

// Adds a new branch when `data.id` is absent, otherwise updates the
// matching row in place. Returns the full, refreshed list.
export function saveBranch(data) {
  const list = readBranchStore();
  let next;
  if (data.id) {
    next = list.map((b) => (b.id === data.id ? { ...b, ...data } : b));
  } else {
    next = [...list, { ...data, id: nextBranchId(list), createdAt: new Date().toISOString() }];
  }
  writeBranchStore(next);
  return next;
}

export function deleteBranch(id) {
  const list = readBranchStore();
  const next = list.filter((b) => b.id !== id);
  writeBranchStore(next);
  return next;
}