const mongoose = require("mongoose");
const updateCreditScoreSchema = new mongoose.Schema({

  creditscore: {
    type: Number,
  },

//   total: {
//     type: Number,
    
//   },
  rentbyCashUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
//   propertyId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "Property",
//   },
//   ownerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//   },
});

module.exports = mongoose.model("updateCreditScore", updateCreditScoreSchema);
