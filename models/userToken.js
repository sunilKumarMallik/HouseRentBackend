const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserTokensSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  email: { type: String, required: true, unique:true },
  confirm_email_token: { type: String  },
  confirm_token_expires: { type: Date },
  confirm_token_verified: { type: Boolean, default: false },
  reset_password_token: { type: String  },
  reset_token_expires: { type: Date },
  created_at: { type: Date, default: Date.now},
  otpEmail:{type: String}
});


module.exports = mongoose.model("UserToken", UserTokensSchema);