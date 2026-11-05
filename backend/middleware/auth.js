const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error('JWT_SECRET is missing from .env');

const signToken = (emailId) => jwt.sign({ emailId }, SECRET, { expiresIn: '1h' });

function emailFromToken(req) {
  const header = req.headers.authorization || '';
  if (!header.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(header.slice(7), SECRET).emailId;
  } catch {
    return null;
  }
}

function auth(req, res, next) {
  const emailId = emailFromToken(req);
  if (!emailId) return res.status(401).json({ message: 'Access denied. Please log in.' });
  req.user = { emailId };
  next();
}

// Same as auth, but logged-out visitors pass through (used for public review lists)
function optionalAuth(req, res, next) {
  const emailId = emailFromToken(req);
  if (emailId) req.user = { emailId };
  next();
}

module.exports = { auth, optionalAuth, signToken };
