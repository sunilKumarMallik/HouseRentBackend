const mongoose = require("mongoose");
const FeedbacktoTenantSchema = new mongoose.Schema({
  maintainedByTenant: {
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  behaviour: {
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  neighbours: {
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  contract: {
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  monthlyRent: {
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },
  completionofContract: {
    rating: {
      type: String,
      default: "",
    },
    comment: {
      type: String,
      default: "",
    },
  },

  feedBackToTenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  newPropertyId: {
    type: String,
  },
});

module.exports = mongoose.model("FeedBackTenant", FeedbacktoTenantSchema);
