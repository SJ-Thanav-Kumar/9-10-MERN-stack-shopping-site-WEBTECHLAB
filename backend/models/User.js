const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, trim: true },
  emailId:  { type: String, required: true, unique: true, lowercase: true, trim: true },
  age:      { type: Number, required: true, min: 1, max: 120 },
  password: { type: String, required: true }
});

module.exports = mongoose.model("User", userSchema);