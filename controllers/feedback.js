const feedBack = require("../models/feedBack");
const ownerPropertyModel = require("../models/ownerPropertyModel");

exports.createfeedback = (req, res) => {
  feedBack
    .create(req.body)
    .then((result) => {
      ownerPropertyModel
        .findOneAndUpdate(
          { _id: req.body.propertyId },
          { $set: { feedback: result._id } }
        )
        .then((newres) => {
          return res
            .status(200)
            .json({ message: "feedback submited successfully" });
        })
        .catch((newError) => {
          console.log("newEWrror", newError);
          return res.status(500).json({ error: "Internal server error" });
        });
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(500).json({ error: "Internal server error" });
    });
};
exports.getall = async (req, res) => {
  let allfeedbacks = await feedBack.find();
  return res.status(200).json({ message: "successfull", data: allfeedbacks });
};
exports.getbyid = async (req, res) => {
  feedBack
    .find({ propertyId: req.params.propertyId })
    .populate("feedBackbyuser")
    .then(
      (result) => {
        return res.status(200).json({ message: "Successfull", result });
      }
      // response=> {res.status(200).json(response)}
    )
    .catch((err) => {
      console.log("err");
    });
};
exports.getFeedbackByPropertyId = async (req, res) => {
  feedBack
    .find({ propertyId: req.body.propertyId })
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log("err");
    });
};

// exports.getLeadsByProviderId = async (req,res)=>{
//     Leads.find({providerId:req.body.providerId}).then((result)=>{
//         return res.status(200).json({message:"successfull",result})
//     }).catch((err)=>{
//         console.log(err)
//         return res.status(400).json({error:"Unable to get data"})
//     })
//     }
