const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    emailId:     { type: String, required: true, lowercase: true, trim: true },
    productKey:  { type: String, required: true, index: true },
    recommended: { type: Boolean, required: true },
    text:        { type: String, default: '', maxlength: 1000 }
  },
  { timestamps: true }
);

reviewSchema.index({ emailId: 1, productKey: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
