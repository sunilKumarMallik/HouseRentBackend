const _ = require("lodash");
const User = require("../models/user");
const formidable = require("formidable");
const fs = require("fs");
const operatingSystem = require("os");
const { sendEmail } = require("../helpers");
const otpGenerator = require("otp-generator");
const { default: axios } = require("axios");
const Property = require("../models/ownerPropertyModel");
exports.userById = (req, res, next, id) => {
  User.findById(id)
    .populate("listedProperty")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found",
        });
      }
      req.profile = user; // adds profile object in req with user info
      next();
    });
};

exports.hasAuthorization = (req, res, next) => {
  let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
  let adminUser = req.profile && req.auth && req.auth.role === "admin";

  const authorized = sameUser || adminUser;
  if (!authorized) {
    return res.status(403).json({
      error: "User is not authorized to perform this action",
    });
  }
  next();
};

exports.allUsers = (req, res) => {
  User.find((err, users) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json(users);
  });
};

exports.getUser = (req, res) => {
  User.findById({ _id: req.params.id })
    .populate("listedProperty")
    .then((response) => {
      return res.status(200).json(response);
    });
};

exports.selctedProperty = async (req, res) => {
  let addedProperty = await User.find(
    { _id: req.params.userId },
    { listedProperty: req.body.propertyId }
  );
  if (addedProperty) {
    return res.status(400).json({ error: "Already listed" });
  }

  User.update(
    { _id: req.params.userId },
    { $push: { listedProperty: req.body.propertyId } }
  ).then((response) => {
    console.log("selectedProperty", response);
    return res
      .status(200)
      .json({
        message: "Sucessfully updated",
        responseCode: "200",
      })
      .catch((error) => {
        console.log(er);
        return res(500).json({
          error: "Error while updating",
          responseCode: "500",
        });
      });
  });
};

exports.updateUser = (req, res) => {
  let user = req.profile;
  let newBody = req.body;
  let newTenantId;
  if (user.role === "tenant" && req.body.pan && req.body.Aadhar) {
    newTenantId = req.body.pan.slice(0, 4) + req.body.Aadhar.substr(-4);
    newBody.tenantNewId = newTenantId;
  }

  let newOwnerId;
  if (user.role === "owner" && req.body.pan && req.body.Aadhar) {
    newOwnerId = req.body.pan.slice(0, 4) + req.body.Aadhar.substr(-4);
    newBody.ownerNewId = newOwnerId;
  }
  user = _.extend(user, newBody);
  user.updated = Date.now();
  if (req.body.mobile != user.mobile) {
    user.mobile_verified = false;
  }
  user.save((err, result) => {
    console.log("err",err)
    if (err) {
       
      return res.status(400).json({
        error: err,
      });
    }
    user.hashed_password = undefined;
    user.salt = undefined;
    if (req.body.listedProperty && req.body.listedProperty.length > 0) {
      Property.findById({ _id: req.body.listedProperty })
        .populate("createdBy")
        .then((popertyData) => {
          const emailData = {
            from: " carehomerent@zohomail.in",
            to: popertyData.createdBy && popertyData.createdBy.email,
            subject: "New Booking",
            text: `${user.name} has booked your property`,
            text: `${user.name} has booked your property`,
          };
          sendEmail(emailData);
        }).catch((error)=>{console.log(error)});
    }
    res.json(user);
  });
};

exports.updatemaintainance = (req, res) => {};

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set(("Content-Type", req.profile.photo.contentType));
    return res.send(req.profile.photo.data);
  }
  next();
};

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ message: "User deleted successfully" });
  });
};

exports.approveProvider = async (req, res) => {
  let user = req.profile;
  user = _.extend(user, req.body);
  user.updated = Date.now();
  user.save(async (err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    } else {
      const emailData = {
        from: "noreply@node-react.com",
        to: user.email,
        subject: "Provider Account is approved",
        text: `Your provider account has been approved` + operatingSystem.EOL,
        text: `Your provider account has been approved` + operatingSystem.EOL,
      };
      if (user.isProviderApproved) {
        const info = await sendEmail(emailData);
        return res.status(200).json({ success: "Updated and mail sent", user });
      } else {
        return res.status(200).json({ success: "Updated ", user });
      }
    }
  });
};
exports.GenerateOtp = async (req, res) => {
  axios
    .post(
      `http://sms.hitechsms.com/app/smsapi/index.php?key=56215C12806C1F&campaign=0&routeid=13&type=text&contacts=${
        req.body.mobileNumber
      }&senderid=LMYSTR&msg=${otpGenerator.generate(4, {
        upperCaseAlphabets: false,
        specialChars: false,
        digits: true,
      })} is your OTP to verify phone number at loan mystery. Please do not share OTP with anyone.
&template_id=1707164725428392660`
    )
    .then((result) => {
      if (!result) {
        return res.status(500).json({
          error: "unable to send sms",
        });
      } else {
        return res.status(200).json({
          message: "Successful",
          result: result.status,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.verifyOtp = async (req, res) => {
  let user = req.profile;
  User.findOne({ _id: user._id, otp: req.body.otp })
    .then((otpRes) => {
      return res.status(200).json({ message: "succefull" });
    })
    .catch((err) => {
      return res.status(400).json({
        error: "Error",
      });
    });
};
