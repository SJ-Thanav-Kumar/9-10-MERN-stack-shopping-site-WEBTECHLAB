const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    emailId:    { type: String, required: true, lowercase: true, trim: true },
    productKey: { type: String, required: true }
  },
  { timestamps: true }
);

wishlistSchema.index({ emailId: 1, productKey: 1 }, { unique: true });

module.exports = mongoose.model('Wishlist', wishlistSchema);
