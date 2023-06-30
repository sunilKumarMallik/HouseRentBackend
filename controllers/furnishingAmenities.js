const furnishingAmenities = require("../models/furnishingAmenities")

exports.AddFurnishingAmenities = async (req,res)=>{
    furnishingAmenities.create(req.body).then((response)=>{
            return res.status(200).json({ message: "Property Successfully Added", data: response })
    }).catch((err) => {
        return res.status(400).json({ error: "error in adding property", errorResponse: err })
    })

}
exports.updateFurnishingAmenities = async (req,res)=>{
    const { _id } = req.body;
    let furnishingAmenitiesData = await Amenities.findById(_id)

    // const updatedFields = {
    //     propertyType: req.body.propertyType,
    //     description: req.body.description,
    //     location: req.body.location,
    //     Price: req.body.price
    //   };

    furnishingAmenitiesData = _.extend(furnishingAmenitiesData, req.body);
    console.log("API extended" + furnishingAmenitiesData)
    furnishingAmenitiesData.updated = Date.now();

    //   if(req.body.mobile!=user.mobile){
    //       user.mobile_verified=false
    //           }
    furnishingAmenitiesData.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        //   user.hashed_password = undefined;
        //   user.salt = undefined;

        // console.log("user after update with formdata: ", user);
        res.json(furnishingAmenitiesData);
    });

}