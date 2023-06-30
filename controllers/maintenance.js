const maintenance = require("../models/maintainance");
const _ = require("lodash");
exports.createmaintenance = (req, res) => {
  maintenance
    .create(req.body)
    .then((result) => {
      return res
        .status(200)
        .json({ message: "maintenance request submited successfully" });
    })
    .catch((error) => {
      console.log("error", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    });
};
exports.updateMaintenanceStatus = async (req, res) => {
  const { maintainanceId } = req.body;
  let maintainanceData = await maintenance.findById(maintainanceId);
  maintainanceData = _.extend(maintainanceData, req.body);
  console.log("API extended" + maintainanceData);
  maintainanceData.updated = Date.now();
  maintainanceData.save((err, result) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    // console.log("user after update with formdata: ", user);
    res.json(result);
  });
};
exports.getall = async (req, res) => {
  let allmaintainance = await maintenance.find();
  return res
    .status(200)
    .json({ message: "successfull", data: allmaintainance });
};
exports.getbyPropertyid = async (req, res) => {
  maintenance
    .find({ propertyId: req.params.propertyId })
    .then((result) => {
      return res.status(200).json({ message: "Successfull", result });
    })
    .catch((err) => {
      return (
        res.status(500).json({ message: "error", err }), console.log("err")
      );
    });
};
exports.getbyOwnerid = async (req, res) => {
  maintenance
    .find({ ownerId: req.params.ownerId })
    .populate("maintenancebyuser")
    .then((result) => {
      return res.status(200).json({ message: "Successfull", result });
    })
    .catch((err) => {
      return (
        res.status(500).json({ message: "error", err }), console.log("err")
      );
    });
};

exports.getbyUserid = async (req, res) => {
  maintenance
    .find({ maintenancebyuser: req.params.maintenancebyuser })
    .populate("propertyId")
    .then((result) => {
      return res.status(200).json({ message: "Successfull", result });
    })
    .catch((err) => {
      return (
        res.status(500).json({ message: "error", err }), console.log("err")
      );
    });
};
