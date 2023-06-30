const mongoose = require("mongoose");
const PricingSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    default: "",
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  newPropertyId: {
    type: String,
  },
  tenantNewId: {
    type: String,
  },
  monthlyPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
