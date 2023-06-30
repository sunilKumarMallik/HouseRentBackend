const jwt = require("jsonwebtoken");
var shortid = require("shortid");
require("dotenv").config();
const expressJwt = require("express-jwt");
const User = require("../models/user");
const _ = require("lodash");
const { OAuth2Client } = require("google-auth-library");
const { sendEmail } = require("../helpers");
const UserToken = require("../models/userToken");
const randomize = require("randomatic");
var CryptoJS = require("crypto-js");
const operatingSystem = require("os");
const { default: axios } = require('axios');




exports.signup = async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email });
  if (userExists)
    return res.status(409).json({
      error: "This email has already been taken!",
    });
  const user = await new User(req.body);



  const userDoc = await user.save();

  sendConfirmEmail(userDoc.email, userDoc._id)
    .then((emailres) => {
      const resp_payload = {
        success: "true",
        message: "User created successfully. Please Check your Email For Confirmation",
      };
      console.log("mailresponse", emailres);
      return res.status(201).json(resp_payload);
    })
    .catch((err) => {
      console.log("eroorrrr", err);
      if (err) {
        User.findOneAndDelete(
          { _id: userDoc._id },
          function (errOnDelete, result) {
            if (errOnDelete) {
              console.log("errOnDelete", errOnDelete);
            } else {
              console.log(result);
              UserToken.findOneAndDelete(
                { user_id: userDoc._id },
                function (errorOnDeleteToken, userToken) {
                  if (errorOnDeleteToken) {
                    console.log("errorOnDeleteToken", errorOnDeleteToken);
                  } else {
                    console.log(userToken);
                    return res
                      .status(err.responseCode || 500)
                      .json({ error: "Error While Creating Account" });
                  }
                }
              );
            }
          }
        );
      }
    });
};

exports.confirmEmail = async (req, res, next) => {
  const email = req.body.email;
  const confirm_email_token = req.body.confirmEmailCode;

  const userToken = await UserToken.findOne({
    confirm_email_token,
    email,
  });

  if (!userToken) {
    const error = new Error("Invalid Email or Confirmation token");
    error.statusCode = 400;
    return res.status(400).json("Invalid Email or Confirmation token");
  }

  let user = await User.findOne({
    _id: userToken.user_id,
  });

  if (!user) {
    const error = new Error("Invalid Username or User not found");
    error.statusCode = 400;
    return res.status(400).json("Invalid Username or User not found");
  }

  let currentDate = new Date();
  let confirmTokenExipry = new Date(userToken.confirm_token_expires);

  let resp_payload = {
    success: true,
    message: "Email has been verified Successfully",
  };

  if (currentDate.getTime() <= confirmTokenExipry.getTime()) {
    if (confirm_email_token !== userToken.confirm_email_token) {
      resp_payload.success = false;
      resp_payload.message = "Invalid Confirm Email Token. Tokens do not match";
    }
  } else {
    resp_payload.success = false;
    resp_payload.message = "Invalid Confirm Email Token. Token has expired";
  }

  if (resp_payload.success) {
    // Update Email Verification Status

    user.email_verified = true;
    await user.save();

    userToken.confirm_token_verified = true;
    await userToken.save();

    return res.status(200).json(resp_payload);
  } else {
    const error = new Error(resp_payload.message);
    error.statusCode = 400;
    return res.status(401).json(resp_payload);
  }
};

const sendConfirmEmail = async (email, user_id) => {
  let confirm_email_token = randomize("0", 5);

  let userToken = new UserToken();
  userToken.email = email;
  userToken.user_id = user_id;
  userToken.confirm_email_token = confirm_email_token; // Generate token
  userToken.confirm_token_expires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  userToken = await userToken.save();

  let confirm_email_link =
    `${process.env.WEB_SITE_URL}` +
    "confirm-email?id=" +
    confirm_email_token +
    "&email=" +
    email;
  const emailData = {
    from: 'carehomerent@zohomail.in',
    to: email,

    subject: "Confirm your HOMERENT Account",
    text:
      `Your Confirmation code is ${confirm_email_token}` + operatingSystem.EOL,
    text: "Confirmation Link: " + confirm_email_link + operatingSystem.EOL,
  };

  const info = await sendEmail(emailData);
  return info;
};

exports.sendOtpPhone = async (req, res) => {

  const numberExists = await User.findOne({ mobile: req.body.number });
  if (!numberExists)
    return res.status(403).json({
      error: 'Do not have an account on this Number!'
    });

  axios.post(`https://2factor.in/API/V1/3ab22a6c-e622-11ec-9c12-0200cd936042/SMS/${req.body.number}/AUTOGEN`).then((result) => {

    if (!result) {
      return res.status(500).json({
        error: "unable to send sms"
      })
    } else {
      return res.status(200).json({
        message: "Successful",
        result: result.status,
        sessionId: result.data
      })
    }
  }).catch(err => {
    console.log(err)
  })



  //  sendOtp.send(91+req.body.mobile, req.body.name,  function (error, data) {
  //      console.log(data);
  //      res.status(200).json({ message: 'OTP sent successfully.' })

  //  });
};

exports.sendOtpMail = (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'No request body' });
  if (!req.body.email) return res.status(400).json({ message: 'No Email in request body' });

  console.log('Finding user with that email');
  const { email } = req.body;
  console.log('signin req.body', email);
  // find the user based on email
  let otp = "2000";
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status('401').json({
        error: 'User with that email does not exist!'
      });

    // generate a token with user id and secret
    //  const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);

    // email data
    let otp = Math.floor(1000 + Math.random() * 9000);
    const emailData = {
      from: 'noreply@node-react.com',
      to: email,
      subject: 'OTP to sign in',
      text: `your otp is ${otp}`,
      html: `your otp is ${otp}`
    };
    return user.updateOne({ $set: { "emailOtp": otp } }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `OTP has been sent to ${email} to sign in`
        });
      }
    });

  });
};

exports.verifyOtpPhone = async (req, res) => {

  axios.get(`https://2factor.in/API/V1/3ab22a6c-e622-11ec-9c12-0200cd936042/SMS/VERIFY/${req.body.sessionId}/${req.body.otp}`)
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          error: "unable to verify OTP"
        })
      } else {
        return res.status(200).json({
          message: "OTP verified successfully",
          result: result.status,
          sessionId: result.data
        })
      }
    }).catch(err => {
      console.log(err.response)
      return res.status(400).json({ error: err.response.data.Details })
    })
}



exports.validateEmailOtp = (req, res) => {
  if (!req.body) return res.status(400).json({ message: 'No request body' });
  if (!req.body.email) return res.status(400).json({ message: 'No Email in request body' });

  console.log('Finding user with that email');
  const { email } = req.body;
  console.log('signin req.body', email);
  // find the user based on email
  let otp = "2000";
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status('401').json({
        error: 'User with that email does not exist!'
      });

    // generate a token with user id and secret
    //  const token = jwt.sign({ _id: user._id, iss: process.env.APP_NAME }, process.env.JWT_SECRET);

    // email data
    let otp = req.body.otp;
    if (otp === user.emailOtp) {
      return res.status(200).json({
        message: `Email Successfully verified`
      });
    } else {
      return res.status(403).json({
        error: 'OTP does not matched'
      });
    }



  });
};


exports.signin = async (req, res) => {
  const { email, password } = req.body;
  var bytes = CryptoJS.AES.decrypt(
    password,
    process.env.REACT_APP_ENCRYPTION_SECRET_KEY
  );
  var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  console.log("req.body", req.body);
  console.log("decrepted", decryptedData);
  // find the user based on email
  let userTokenData = await UserToken.findOne({ email: email })

  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }

    if (userTokenData.confirm_token_verified == false) {
      return res.status(400).json({
        error: "please varify account",
      });
    }

    // console.log(verifedUser);

    // if user is found make sure the email and password match
    // create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and Password do not match",
      });
    }
    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, role: user.role },
      process.env.JWT_SECRET,
     {expiresIn:"7d"}
    );
    // persist the token as 't' in cookie with expiry date
    res.cookie("t", token, { expire: new Date() + 9999 });
    // retrun response with user and token to frontend client
    // const { _id, name, email, role, profileImageUrl } = user;
    return res.json({ token, user: user });


  });
};

exports.changepassword = async (req, res) => {
  const { email, password, newPassword } = req.body;
  // var bytes = CryptoJS.AES.decrypt(
  //   password,
  //   process.env.REACT_APP_ENCRYPTION_SECRET_KEY
  // );
  // var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  // console.log("req.body", req.body);
  // console.log("decrepted", decryptedData);
  // find the user based on email


  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user) {
      return res.status(401).json({
        error: "User with that email does not exist. Please signup.",
      });
    }

    // console.log(verifedUser);

    // if user is found make sure the email and password match
    // create authenticate method in model and use here
    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Please Enter Correct Password",
      });
    }
    else {
      const updatedFields = {
        password: newPassword,
        resetPasswordLink: "",
      };

      user = _.extend(user, updatedFields);
      user.updated = Date.now();

      user.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.status(200).json({
          message: `Great! Now you can login with your new password.`,
        });
      });
    }

  });
};

exports.signout = (req, res) => {

  res.clearCookie("t");
  return res.json({ message: "Signout success!" });
};

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,

  algorithms: ["HS256"],
});

exports.forgotPassword = (req, res) => {
  if (!req.body) return res.status(400).json({ message: "No request body" });
  if (!req.body.email)
    return res.status(400).json({ message: "No Email in request body" });

  console.log("forgot password finding user with that email");
  const { email } = req.body;
  console.log("signin req.body", email);
  // find the user based on email
  User.findOne({ email }, (err, user) => {
    // if err or no user
    if (err || !user)
      return res.status(401).json({
        error: "User with that email does not exist!",
      });

    // generate a token with user id and secret
    const token = jwt.sign(
      { _id: user._id, iss: process.env.APP_NAME },
      process.env.JWT_SECRET
    );

    // email data
    const emailData = {
      from: "carehomerent@zohomail.in",
      to: email,
      subject: "Password Reset Instructions",
      text: `Please use the following link to reset your password: ${process.env.WEB_SITE_URL}reset-password/${token}`,
      html: `<p>Please use the following link to reset your password:</p> <p>${process.env.WEB_SITE_URL}reset-password/${token}</p>`,
    };

    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
      if (err) {
        return res.json({ message: err });
      } else {
        sendEmail(emailData);
        return res.status(200).json({
          message: `Email has been sent to ${email}. Follow the instructions to reset your password.`,
        });
      }
    });
  });
};

// to allow user to reset password
// first you will find the user in the database with user's resetPasswordLink
// user model's resetPasswordLink's value must match the token
// if the user's resetPasswordLink(token) matches the incoming req.body.resetPasswordLink(token)
// then we got the right user

exports.resetPassword = (req, res) => {
  const { resetPasswordLink, newPassword } = req.body;

  User.findOne({ resetPasswordLink }, (err, user) => {
    console.log(err);
    console.log(user);
    // if err or no user
    if (err || !user)
      return res.status("401").json({
        error: "Invalid Link!",
      });

    const updatedFields = {
      password: newPassword,
      resetPasswordLink: "",
    };

    user = _.extend(user, updatedFields);
    user.updated = Date.now();

    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: `Great! Now you can login with your new password.`,
      });
    });
  });
};

const client = new OAuth2Client(process.env.REACT_APP_GOOGLE_CLIENT_ID);

exports.socialLogin = async (req, res) => {
  const idToken = req.body.tokenId;
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  });

  const {
    email_verified,
    email,
    name,
    picture,
    sub: googleid,
  } = ticket.getPayload();

  if (email_verified) {
    console.log(`email_verified > ${email_verified}`);

    const newUser = { email, name, password: googleid };
    // try signup by finding user with req.email
    let user = User.findOne({ email }, (err, user) => {
      if (err || !user) {
        // create a new user and login
        user = new User(newUser);
        req.profile = user;
        user.save();
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: user._id, iss: process.env.APP_NAME },
          process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      } else {
        // update existing user with new social info and login
        req.profile = user;
        user = _.extend(user, newUser);
        user.updated = Date.now();
        user.save();
        // generate a token with user id and secret
        const token = jwt.sign(
          { _id: user._id, iss: process.env.APP_NAME },
          process.env.JWT_SECRET
        );
        res.cookie("t", token, { expire: new Date() + 9999 });
        // return response with user and token to frontend client
        const { _id, name, email } = user;
        return res.json({ token, user: { _id, name, email } });
      }
    });
  }
};



