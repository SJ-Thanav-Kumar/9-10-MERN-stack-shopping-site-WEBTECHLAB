const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productId:    { type: Number, required: true, unique: true },
  productName:  { type: String, required: true, trim: true },
  productPrice: { type: Number, required: true, min: 0 },
  category:     { type: String, required: true, trim: true },
  quantity:     { type: Number, required: true, min: 0 },
  description:  { type: String, required: true, trim: true },
  image:        { type: String, trim: true }
});

module.exports = mongoose.model('Product', productSchema);
