// Simple localStorage-backed "auth" layer.
//
// NOTE: This stores the password in plain text in the browser's
// localStorage. That's fine for a demo / front-end-only prototype, but it
// is NOT secure and should never be used for a real production app —
// a real app needs a backend that hashes passwords and issues real
// session tokens.

const USERS_KEY = 'loanapp_users';
const SESSION_KEY = 'loanapp_session';

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
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
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
  saveUsers(users);
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