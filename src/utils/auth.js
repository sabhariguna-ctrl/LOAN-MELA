// Simple localStorage-backed "auth" layer.
//
// NOTE: This stores the password in plain text in the browser's
// localStorage. That's fine for a demo / front-end-only prototype, but it
// is NOT secure and should never be used for a real production app —
// a real app needs a backend that hashes passwords and issues real
// session tokens.

const USERS_KEY = 'loanapp_users';
const SESSION_KEY = 'loanapp_session';
const APPLICATIONS_KEY = 'loanapp_applications';

function safeParse(raw, fallback) {
  try {
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

export function getUsers() {
  return safeParse(localStorage.getItem(USERS_KEY), []);
}

function saveUsers(users) {
  try {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return { success: true };
  } catch (err) {
    // Most commonly a QuotaExceededError — localStorage caps out around
    // 5-10MB per origin, and base64-encoded document uploads (see
    // Register's Documents step / Profile's Documents section) can blow
    // past that fast. Without this catch, the error was thrown straight
    // out of registerUser/updateUserProfile and silently aborted whatever
    // the caller was doing next (e.g. Profile's Save button would just
    // stop, leaving the page stuck in editing mode with no explanation).
    console.error('Failed to save users to localStorage:', err);
    return {
      success: false,
      message:
        "Couldn't save — your uploaded documents are too large for browser storage. Try smaller files (a compressed PDF or a resized photo works best).",
    };
  }
}

/**
 * Registers a new user in localStorage.
 * `formData` is the full Register form state (includes confirmPassword,
 * which is stripped before saving).
 */
export function registerUser(formData) {
  const email = formData.email.trim().toLowerCase();
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    return {
      success: false,
      message: 'An account with this email already exists. Please log in instead.',
    };
  }

  const { confirmPassword, ...rest } = formData;
  const newUser = { ...rest, email, registeredAt: new Date().toISOString() };

  users.push(newUser);
  const saveResult = saveUsers(users);
  if (!saveResult.success) {
    return saveResult;
  }
  setSession(newUser);

  return { success: true, user: newUser };
}

/**
 * Logs a user in against the records saved by registerUser.
 */
export function loginUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const user = users.find((u) => u.email === normalizedEmail && u.password === password);

  if (!user) {
    return { success: false, message: 'Invalid email or password.' };
  }

  setSession(user);
  return { success: true, user };
}

export function setSession(user) {
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify({ email: user.email, fullName: user.fullName })
  );
  window.dispatchEvent(new Event('authchange'));
}

export function getSession() {
  return safeParse(localStorage.getItem(SESSION_KEY), null);
}

export function logoutUser() {
  localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event('authchange'));
}

/**
 * Looks up the full registered record for an email (everything the user
 * entered on the Register page — not just the small { email, fullName }
 * pair that lives in the session).
 */
export function getUserByEmail(email) {
  if (!email) return null;
  const normalizedEmail = email.trim().toLowerCase();
  return getUsers().find((u) => u.email === normalizedEmail) || null;
}

/**
 * Updates a registered user's stored profile fields (e.g. from the Profile
 * page's Edit → Save flow). Email is intentionally never changed here since
 * it's the record's lookup key and login identifier. Also refreshes the
 * session's cached fullName so the navbar / greeting stay in sync.
 */
export function updateUserProfile(email, updates) {
  const normalizedEmail = email.trim().toLowerCase();
  const users = getUsers();
  const index = users.findIndex((u) => u.email === normalizedEmail);

  if (index === -1) {
    return { success: false, message: 'Could not find your account to update.' };
  }

  const { email: _ignoredEmail, password: _ignoredPassword, confirmPassword, ...safeUpdates } = updates;
  const updatedUser = { ...users[index], ...safeUpdates };
  users[index] = updatedUser;
  const saveResult = saveUsers(users);
  if (!saveResult.success) {
    return saveResult;
  }

  // Keep the session pill / dropdown showing the latest name immediately.
  const session = getSession();
  if (session && session.email === normalizedEmail) {
    setSession(updatedUser);
  }

  return { success: true, user: updatedUser };
}

/**
 * ---- Loan applications ----
 * Every time a user submits the "Apply Now" form on the Loan Scheme page,
 * a record is appended here so the My Applications page can show, per
 * scheme, what was applied for and its current status.
 */
export function getApplications() {
  return safeParse(localStorage.getItem(APPLICATIONS_KEY), []);
}

function saveApplications(applications) {
  localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
}

/**
 * Saves a new loan application. `application` should include at least
 * schemeTitle + the applicant's contact fields; id/appliedAt/status are
 * filled in here so callers don't have to think about them.
 */
export function submitApplication(application) {
  const applications = getApplications();

  const newApplication = {
    id: `APP-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 900 + 100)}`,
    status: 'Pending',
    appliedAt: new Date().toISOString(),
    ...application,
    userEmail: application.userEmail ? application.userEmail.trim().toLowerCase() : '',
  };

  applications.push(newApplication);
  saveApplications(applications);
  window.dispatchEvent(new Event('applicationschange'));

  return newApplication;
}

/**
 * Returns every application filed by a given email, most recent first.
 */
export function getApplicationsByEmail(email) {
  if (!email) return [];
  const normalizedEmail = email.trim().toLowerCase();
  return getApplications()
    .filter((a) => a.userEmail === normalizedEmail)
    .sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
}

/**
 * Updates a single application's status (the admin Applications page's
 * Approve / Reject / Mark Pending action). This is the only place an
 * application's status ever changes after submission, so the borrower's
 * My Applications page and the admin dashboard/analytics both reflect it
 * as soon as it happens.
 */
export function updateApplicationStatus(id, status) {
  const applications = getApplications();
  const index = applications.findIndex((a) => a.id === id);
  if (index === -1) {
    return { success: false, message: 'Could not find that application.' };
  }

  applications[index] = {
    ...applications[index],
    status,
    statusUpdatedAt: new Date().toISOString(),
  };
  saveApplications(applications);
  window.dispatchEvent(new Event('applicationschange'));

  return { success: true, application: applications[index] };
}