const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true
  },
  otp: {
    type: String,
    trim: true
  },
  mobile: {
    type: String,
    default: ""
  },
  hashed_password: {
    type: String,
    required: true
  },
  salt: String,
  created: {
    type: Date,
    default: Date.now
  },
  updated: Date,
  photo: {
    data: Buffer,
    contentType: String
  },
  address: {
    type: String,
    default: ""
  },
  District: {
    type: String,
    default: ""
  },
  email_verified: {
    type: Boolean,
    default: false
  },
  mobile_verified: {
    type: Boolean,
    default: false
  },
  serviceArea: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  pinCode: {
    type: String,
    default: ""
  },
  State: {
    type: String,
    default: ""
  },
  profileImageUrl: {
    type: String,
    default: ""
  },
  DOB: {
    type: Date,
    default: Date.now
  },
  pan: {
    type: String,
    default: ""
  },
  about: {
    type: String,
    trim: true
  },
  confirm_token_verified: {
    type: Boolean,
    trim: true,
    default: false
  },
  resetPasswordLink: {
    data: String,
    default: ""
  },
  listedProperty: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property"
  }],
  creditScore:{type:Number},
  role: {
    type: String,
    default: "tenant"
  },
  isOwnerApproved: {
    type: Boolean,
    default: false
  },
  isPropertyAssigned:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property"
  },
  incomeSource: {
    type: String,
  },
  empAddress: {
    type: String,
  },
  monthlyIncome: {
    type: Number,
  },
  AadharCard: {
    number: {
      type: Number,
    },
    adharFrontUrl: {
      type: String,
    },
    adharBackUrl: {
      type: String,
    }
  },
  PanCard: {
    number: {
      type: String,
    },
    panCardUrl: {
      type: String
    }
  },
  Account: {
    number: {
      type: String,
    },
    ifscNumber: {
      type: String,
    },
    accountUrl: {
      type: String
    }
  },



  // feedback api

  Feedback: {
   type:String,

  },
  tenantNewId: {
   type:String,
  },
  ownerNewId: {
   type:String,
  },

   // maintenance api
  maintenance: {
    type:String,
}
});

/**
 * Virtual fields are additional fields for a given model.
 * Their values can be set manually or automatically with defined functionality.
 * Keep in mind: virtual properties (password) don’t get persisted in the database.
 * They only exist logically and are not written to the document’s collection.
 */

// virtual field
userSchema
  .virtual("password")
  .set(function (password) {
    // create temporary variable called _password
    this._password = password;
    // generate a timestamp
    this.salt = uuidv4();
    // encryptPassword()
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// methods
userSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);
