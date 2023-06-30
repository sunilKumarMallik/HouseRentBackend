const pricing = require("../models/pricing");
const ownerPropertyModel = require("../models/ownerPropertyModel");

exports.bcreatePricing = (req, res) => {
  pricing
    .create(req.body)
    .then((result) => {
      ownerPropertyModel
        .findOneAndUpdate(
          { _id: req.body.propertyId },
          { $set: { monthlyPayment: result._id } }
        )
        .then((newres) => {
          return res.status(200).json({ message: "Payment Submitted Successfully " });
        })
        .catch((newError) => {
          console.log("newError", newError);
          return res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(500).json({ error: "Internal server error" });
    });
};
