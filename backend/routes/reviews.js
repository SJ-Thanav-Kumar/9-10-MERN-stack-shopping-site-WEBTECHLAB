const express = require('express');
const Review = require('../models/Review');
const User = require('../models/User');
const { auth, optionalAuth } = require('../middleware/auth');
const { isValidKey } = require('../lib/validate');

const router = express.Router();

// Steam-style summary label. Review-count thresholds are scaled down
// (Steam uses 500/50/10) because this shop has far fewer users.
function summarise(positive, negative) {
  const total = positive + negative;
  if (total === 0) return { positive, negative, total, percent: null, label: 'No reviews' };

  const percent = Math.round((positive / total) * 100);
  let label;
  if (total < 3) label = 'Need more reviews';
  else if (percent >= 95 && total >= 50) label = 'Overwhelmingly Positive';
  else if (percent >= 80 && total >= 10) label = 'Very Positive';
  else if (percent >= 80) label = 'Positive';
  else if (percent >= 70) label = 'Mostly Positive';
  else if (percent >= 40) label = 'Mixed';
  else if (percent >= 20) label = 'Mostly Negative';
  else if (total >= 50) label = 'Overwhelmingly Negative';
  else if (total >= 10) label = 'Very Negative';
  else label = 'Negative';

  return { positive, negative, total, percent, label };
}

async function summaries(keys) {
  const rows = await Review.aggregate([
    { $match: { productKey: { $in: keys } } },
    {
      $group: {
        _id: '$productKey',
        positive: { $sum: { $cond: ['$recommended', 1, 0] } },
        negative: { $sum: { $cond: ['$recommended', 0, 1] } }
      }
    }
  ]);
  const out = Object.fromEntries(keys.map((k) => [k, summarise(0, 0)]));
  rows.forEach((r) => {
    out[r._id] = summarise(r.positive, r.negative);
  });
  return out;
}

// Ratings for many products at once, e.g. ?keys=el-1,cl-2 (used by product cards)
router.get('/summary', async (req, res) => {
  const keys = typeof req.query.keys === 'string' ? [...new Set(req.query.keys.split(','))] : [];
  if (keys.length === 0 || keys.length > 60 || !keys.every(isValidKey))
    return res.status(400).json({ message: 'Provide 1 to 60 valid product keys' });

  res.json({ summaries: await summaries(keys) });
});

// Public: anyone can read reviews. A logged-in visitor also gets their own review back.
router.get('/:productKey', optionalAuth, async (req, res) => {
  const key = req.params.productKey;
  if (!isValidKey(key)) return res.status(400).json({ message: 'Invalid product' });

  const me = req.user?.emailId;
  const rows = await Review.find({ productKey: key }).sort({ updatedAt: -1 }).limit(50);
  const users = await User.find({ emailId: { $in: rows.map((r) => r.emailId) } });
  const names = Object.fromEntries(users.map((u) => [u.emailId, u.username]));
  const mine = me ? await Review.findOne({ productKey: key, emailId: me }) : null;

  res.json({
    summary: (await summaries([key]))[key],
    reviews: rows.map((r) => ({
      id: String(r._id),
      username: names[r.emailId] || 'Former user',
      recommended: r.recommended,
      text: r.text,
      createdAt: r.createdAt,
      mine: r.emailId === me
    })),
    mine: mine ? { recommended: mine.recommended, text: mine.text } : null
  });
});

// One review per user per product: posting again edits the existing one
router.put('/:productKey', auth, async (req, res) => {
  const key = req.params.productKey;
  if (!isValidKey(key)) return res.status(400).json({ message: 'Invalid product' });

  const { recommended, text = '' } = req.body;
  if (typeof recommended !== 'boolean')
    return res.status(400).json({ message: 'Choose Recommend or Not Recommend' });
  if (typeof text !== 'string' || text.trim().length > 1000)
    return res.status(400).json({ message: 'Review must be text of 1000 characters or fewer' });

  await Review.updateOne(
    { emailId: req.user.emailId, productKey: key },
    { $set: { recommended, text: text.trim() } },
    { upsert: true }
  );
  res.json({ message: 'Review saved', summary: (await summaries([key]))[key] });
});

router.delete('/:productKey', auth, async (req, res) => {
  const key = req.params.productKey;
  if (!isValidKey(key)) return res.status(400).json({ message: 'Invalid product' });

  await Review.deleteOne({ emailId: req.user.emailId, productKey: key });
  res.json({ message: 'Review deleted', summary: (await summaries([key]))[key] });
});

module.exports = router;
