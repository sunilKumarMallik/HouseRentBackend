const RentbyCash = require("../models/rentbyCash");
exports.createRentByCash = (req, res) => {
  let rentByCash = new RentbyCash({
    ...req.body,
    propertyId: req.params.propertyId,
    rentbyCashUser: req.params.tenantId,
    ownerId:req.body.ownerId
  });
  rentByCash
    .save(rentByCash)
    // .find({
    //     rentbyCashUser: req.params.tenantId,
    //   })
    // .exec()
    .then((result) => {
      return res.status(200).json({ message: "Data submitted successfully" });
    })
    .catch((error) => {
      console.log("error", error);
      return res
        .status(500)
        .json({ error: "Internal server error", message: error.message });
    });
};
exports.getCreditScore = (req, res) => {
  //s let rentByCash = new RentbyCash(req.body);
  RentbyCash.find({
    rentbyCashUser: req.params.tenantId,
    propertyId: req.params.propertyId,
    
  })
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
