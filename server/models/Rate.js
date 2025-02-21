const mongoose = require("mongoose");

const RateSchema = new mongoose.Schema({
  currency: { type: String, required: true, unique: true },
  rate: { type: Number, required: true },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Rate", RateSchema);