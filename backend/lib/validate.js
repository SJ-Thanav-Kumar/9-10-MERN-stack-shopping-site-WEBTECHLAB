const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Product ids are short letters, digits and dashes only
const isValidKey = (key) => typeof key === 'string' && /^[a-z0-9-]{1,40}$/i.test(key);

// partial = true: only validate fields that are present (used by PATCH)
function validate(b, partial = false) {
  const need = (f) => !partial || b[f] !== undefined;
  if (need('username') && (typeof b.username !== 'string' || b.username.trim().length < 2))
    return 'Username must be at least 2 characters';
  if (need('emailId') && !emailRegex.test(b.emailId || ''))
    return 'Enter a valid email ID';
  if (need('age') && !(Number(b.age) >= 1 && Number(b.age) <= 120))
    return 'Age must be a number between 1 and 120';
  if (need('password') && (typeof b.password !== 'string' || b.password.length < 8))
    return 'Password must be at least 8 characters';
  return null;
}

module.exports = { validate, isValidKey };
