const Property = require("../models/ownerPropertyModel");
const User = require("../models/user");
const _ = require("lodash");
const { sendEmail } = require("../helpers");
const { result } = require("lodash");

exports.addProperty = async (req, res) => {
  let newBody = req.body;
  let myNewPropertyId;
  let ownerData = await User.findOne({ _id: req.body.createdBy });
  let randomNumber = Math.floor(1000 + Math.random() * 9000);
  myNewPropertyId =
    ownerData.name.slice(0, 4) + req.body.houseName.slice(0, 4) + randomNumber;
  newBody.newPropertyId = myNewPropertyId;
  Property.create(newBody)
    .then((response) => {
      return res
        .status(200)
        .json({ message: "Property Successfully Added", data: response });
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: "error in adding property", errorResponse: err });
    });
};

exports.getAllProperties = (req, res) => {
  Property
    .find()
    .populate("createdBy")
    .populate("listedByUsers")
    .populate("feedback")
    .then((response) => {
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log("error", error);
      return res.status(400).json({
        error: error,
      });
    });
};

exports.updateProperty = async (req, res) => {
  const { _id } = req.body;
  console.log("requestBody", req.body);
  Property.findById(
    _id,
    //{"$push":{listedByUsers:req.body.listedByUsers}},
    function (err, propertyData) {
      console.log("propertyData", propertyData);

      console.log("API extended" + propertyData);
      propertyData.updated = Date.now();
      // if(req.body.houseName){
      //     propertyData.houseName = req.body.houseName
      // }
      Object.keys(req.body).forEach((key) => {
        propertyData[key] = req.body[key];
      });
      propertyData.save((error, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        if (req.body.isBookedByUser) {
          console.log(
            " req.body.listedProperty.createdBy",
            req.body.isBookedByUser
          );
          User.findById({ _id: req.body.isBookedByUser }).then((userData) => {
            const emailData = {
              from: " carehomerent@zohomail.in",
              to: userData.email,
              subject: "New Booking",
              text: `Owner Mr./Mrs. ${propertyData.ownerName} has assigned your property`,
            };
            sendEmail(emailData);
          });
        }
        return res.status(200).json({
          propertyData,
        });
      });
    }
  ).populate('createdBy').populate('isBookedByUser');
  //console.log("property DAta",propertyData);
  //console.log(propertyData)
  // const updatedFields = {
  //     propertyType: req.body.propertyType,
  //     description: req.body.description,
  //     location: req.body.location,
  //     Price: req.body.price
  //   };

  //   if(req.body.mobile!=user.mobile){
  //       user.mobile_verified=false
  //           }
  // Property.save(Property)((err, result) => {

  //     //   user.hashed_password = undefined;
  //     //   user.salt = undefined;

  //     // console.log("user after update with formdata: ", user);
  //     res.json(propertyData);
  // });
};
// exports.updatePropertyById= async (req, res) => {
//     const { _id } = req.body;
//     console.log("requestBody" ,req.body);
//     if(_id){
//         return res.status(200).json({message:"Updated"})
//     }else{
//         return res.status(400).json({error:"Already Paid"})
//     }
// }

exports.updateListUser = async (req, res) => {
  let property = await Property.findOne({ _id: req.body._id });
  if (property) {
    if (property.listedByUsers.length) {
      if (property.listedByUsers.includes(req.body.listedByUsers)) {
        return res.status(400).json({ error: "Already Added" });
      }
    }
  }
  Property.findOneAndUpdate(
    { _id: req.body._id },
    { $push: { listedByUsers: req.body.listedByUsers } },
    function (err, propres) {
      if (err) {
        return res.status(500).json({ error: "Internal server error" });
      } else {
        return res.status(200).json({ message: "Updated" });
      }
    }
  );
};
exports.removePropertyFromUser = async (req, res) => {
  User.findOneAndUpdate(
    { _id: req.params.userId },
    { $pull: { listedProperty: req.params.propertyId } },
    function (error, result) {
      if (error) {
        return res.status(500).json({ error: "Internal server error" });
      } else {
        Property.findOneAndUpdate(
          { _id: req.params.propertyId },
          { $pull: { listedByUsers: req.params.userId } },
          function (err, propres) {
            if (err) {
              return res.status(500).json({ error: "Internal server error" });
            } else {
              return res.status(200).json({ message: "Deleted" });
            }
          }
        );
      }
    }
  );
};

exports.deleteProperty = async (req, res) => {
  let property = await Property.findById(req.params.propertyId);
  property.remove((err, propertyData) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    res.json({ message: "Property deleted successfully" });
  });
};

exports.deleteTenant = async (req, res) => {
  try{
  let property= await Property.findById(req.params.propertyId);
  property.isBooked=false;
  property.transactionId=null;
  // property.creditScore = 0;
  property.listedByUsers= property.listedByUsers.filter(x=>{
    return x._id != req.body.tenantId
  })

property.save();
res.status(200).json({message:"tenant deleted successfully"})
  }catch(err){
console.log(err)
res.status(500).json({
  error:err
})
  }
}

exports.getPropertyById = (req, res) => {
  Property.findById(req.params.propertyId)
    .populate("createdBy")
    .then((propertyResult) => {
      console.log("PPPP", propertyResult);
      res.status(200).json(propertyResult);
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ error: "Property not found", errorResponse: err });
    });
};
exports.getSubscribedProperty = (req, res) => {
  Property.find(
    { listedByUsers: { $in: [req.params.userId] } },
    (err, properties) => {
      if (err) {
        return res.status(500).json({
          message: err,
        });
      }
      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        data: properties,
      });
    }
  )
};
exports.getPropertyByOwner = (req, res) => {
  Property.findById({ createdBy: req.params.userId })
    .then((response) => {
      return res.status(200).json({
        message: "Success",
        statusCode: 200,
        data: response,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        error: "Unable to get property associate with this you",
        statusCode: 400,
      });
    });
};
