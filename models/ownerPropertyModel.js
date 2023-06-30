const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const propertySchema = new mongoose.Schema({
  houseName: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: Array,
    default: [],
  },
  pdfUrl: {
    type: Array,
    default: [],
  },
  noOfBedRooms: {
    type: String,
    required: true,
  },
  noOfBathRoom: {
    type: String,
    required: true,
  },
  interiorSize: {
    type: Number,
    required: true,
  },
  interiorLength: {
    type: String,
    required: true,
  },
  noOfParking: {
    type: Number,
    required: true,
  },
  propertyType: {
    type: String,
    required: true,
  },
  furnishingStatus: {
    type: String,
    required: true,
  },
  availableFor: {
    type: String,
    required: true,
  },
  availableFrom: {
    type: String,
    required: true,
  },
  zone: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  pinCode: {
    type: Number,
    required: true,
  },
  district: {
    type: String,
    required: true,
  },
  postOffice: {
    type: String,
    required: true,
  },
  localities: {
    type: String,
    required: true,
  },
  landMark: {
    type: String,
    required: true,
  },
  PoliceStation: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  lane: {
    type: String,
    required: true,
  },
  houseNo: {
    type: String,
    required: true,
  },
  monthlyRent: {
    type: Number,
    required: true,
  },
  securityDeposit: {
    type: Number,
    required: true,
  },
  leaseDuration: {
    type: Number,
    required: true,
  },
  leaseDurationTime: {
    type: String,
    required: true,
  },
  amenities: {
    type: [],
    required: true,
  },
  furnishingAmenities: {
    type: [],
    required: true,
  },
  transactionId: {
    type: String,
    default: "",
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  listedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  
  newPropertyId: {
    type: String,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },

  isBookedByUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  aggrementUpdatedbyUser: {
    type: String,
  },
  dateOfBooking: {
    type: Date,
    default: Date.now(),
  },
  feedback: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FeedBack",
  },
  feedBackForTenant: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FeedBackTenant",
    },
  ],
});

module.exports = mongoose.model("Property", propertySchema);
