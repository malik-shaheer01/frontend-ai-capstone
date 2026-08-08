const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required';
  return null;
}

export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required';
  if (!EMAIL_RE.test(email.trim())) return 'Enter a valid email address';
  return null;
}

export function validateForm({ name, email }) {
  return {
    name: validateName(name),
    email: validateEmail(email),
  };
}
