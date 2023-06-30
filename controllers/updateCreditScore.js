const updateCreditScore = require("../models/updateCreditScore");
exports.updateCreditScore = (req, res) => {
    //s let rentByCash = new RentbyCash(req.body);
    updateCreditScore.find({
      rentbyCashUser: req.params.tenantId,
    //   propertyId: req.params.propertyId,
    //   creditScore: req.body.creditScore,
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
  