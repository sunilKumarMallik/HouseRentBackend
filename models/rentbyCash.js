const mongoose = require("mongoose");
const rentbyCashSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  creditscore: {
    type: Number,
  },
  remcreditScore: {
    type: Number,
  },
monthlyRent: {
    type: Number,
  },
  time: {
    type: String,
  },
  duration: {
    type: Number,
  },
  free: {
    type: Number,
  },
  subTotalDsuration: {
    type: Number,
  },
  total: {
    type: Number,
    
  },
  rentbyCashUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("RentbyCash", rentbyCashSchema);
