const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const Wishlist = require('./models/Wishlist');
const Review = require('./models/Review');
const { auth, signToken } = require('./middleware/auth');
const { validate } = require('./lib/validate');

const app = express();
const PORT = process.env.PORT || 3000;

// Security: only our React app is allowed to call this API from a browser
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Database connection error:', err.message));

// ---------- helpers ----------
const getEmail = (req) => (req.query.emailId || '').toLowerCase().trim();

// wraps async handlers so any error becomes a 500 response
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  });

// Security: a user may only change or delete their own account
function ownAccount(req, res, next) {
  const emailId = getEmail(req);
  if (!emailId) return res.status(400).json({ message: 'emailId query parameter is required' });
  if (emailId !== req.user.emailId)
    return res.status(403).json({ message: 'You can only modify your own account' });
  req.emailId = emailId;
  next();
}

// ---------- 1. Register ----------
app.post('/api/users', wrap(async (req, res) => {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });

  const emailId = req.body.emailId.toLowerCase().trim();
  if (await User.findOne({ emailId }))
    return res.status(409).json({ message: 'Email ID already registered' });

  const user = await User.create({
    username: req.body.username.trim(),
    emailId,
    age: Number(req.body.age),
    password: await bcrypt.hash(req.body.password, 10), // Security: store a hash, never the password
  });
  res.status(201).json({ message: `Successfully registered! Welcome, ${user.username}.` });
}));

// ---------- 2. Login ----------
app.post('/api/login', wrap(async (req, res) => {
  const emailId = (req.body.emailId || '').toLowerCase().trim();
  const { password } = req.body;
  if (!emailId || !password)
    return res.status(400).json({ message: 'Email ID and password are required' });

  const user = await User.findOne({ emailId });
  if (!user) return res.status(404).json({ message: 'User Not Registered' });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: 'Invalid Password' });

  res.json({ message: 'Login successful', token: signToken(user.emailId), username: user.username });
}));

// ---------- 3. Products (GET only, protected) ----------
app.get('/api/products', auth, wrap(async (req, res) => {
  const products = await Product.find();
  if (products.length === 0)
    return res.json({ message: 'No products available', products: [] });
  res.json({ products });
}));

// ---------- 4A. PUT: replace all editable fields ----------
app.put('/api/users', auth, ownAccount, wrap(async (req, res) => {
  const user = await User.findOne({ emailId: req.emailId });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const error = validate({ ...req.body, emailId: req.emailId });
  if (error) return res.status(400).json({ message: error });

  user.username = req.body.username.trim();
  user.age = Number(req.body.age);
  user.password = await bcrypt.hash(req.body.password, 10);
  await user.save();
  res.json({ message: 'User details updated successfully (PUT)' });
}));

// ---------- 4B. PATCH: update only the given fields ----------
app.patch('/api/users', auth, ownAccount, wrap(async (req, res) => {
  const user = await User.findOne({ emailId: req.emailId });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const updates = {};
  ['username', 'age', 'password'].forEach((f) => {
    if (req.body[f] !== undefined) updates[f] = req.body[f];
  });
  if (Object.keys(updates).length === 0)
    return res.status(400).json({ message: 'Provide at least one field to update' });

  const error = validate({ ...updates, emailId: req.emailId }, true);
  if (error) return res.status(400).json({ message: error });

  if (updates.username !== undefined) user.username = updates.username.trim();
  if (updates.age !== undefined) user.age = Number(updates.age);
  if (updates.password !== undefined) user.password = await bcrypt.hash(updates.password, 10);
  await user.save();
  res.json({ message: 'User details updated successfully (PATCH)' });
}));

// ---------- 4C. DELETE ----------
app.delete('/api/users', auth, ownAccount, wrap(async (req, res) => {
  const user = await User.findOne({ emailId: req.emailId });
  if (!user) return res.status(404).json({ message: 'User not found' });

  await User.deleteOne({ emailId: req.emailId });
  await Wishlist.deleteMany({ emailId: req.emailId });
  await Review.deleteMany({ emailId: req.emailId });
  res.json({ message: 'User deleted successfully' });
}));

// ---------- 5. Wishlist and reviews ----------
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/reviews', require('./routes/reviews'));

app.listen(PORT, () => console.log('Server running on http://localhost:' + PORT));
