const express = require('express');
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');
const { isValidKey } = require('../lib/validate');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const rows = await Wishlist.find({ emailId: req.user.emailId }).sort({ createdAt: -1 });
  res.json({ items: rows.map((r) => r.productKey) });
});

router.post('/', async (req, res) => {
  const key = req.body.productKey;
  if (!isValidKey(key)) return res.status(400).json({ message: 'Invalid product' });

  await Wishlist.updateOne({ emailId: req.user.emailId, productKey: key }, {}, { upsert: true });
  res.status(201).json({ message: 'Added to wishlist' });
});

router.delete('/:productKey', async (req, res) => {
  if (!isValidKey(req.params.productKey)) return res.status(400).json({ message: 'Invalid product' });

  await Wishlist.deleteOne({ emailId: req.user.emailId, productKey: req.params.productKey });
  res.json({ message: 'Removed from wishlist' });
});

module.exports = router;
