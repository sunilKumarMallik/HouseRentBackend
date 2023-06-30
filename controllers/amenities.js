const Amenities = require("../models/amenities")

exports.AddAmenities = async (req,res)=>{
    Amenities.create(req.body).then((response)=>{
            return res.status(200).json({ message: "Property Successfully Added", data: response })
    }).catch((err) => {
        return res.status(400).json({ error: "error in adding property", errorResponse: err })
    })

}
exports.updateAmenities = async (req,res)=>{
    const { _id } = req.body;
    let amenitiesData = await Amenities.findById(_id)

    // const updatedFields = {
    //     propertyType: req.body.propertyType,
    //     description: req.body.description,
    //     location: req.body.location,
    //     Price: req.body.price
    //   };

    amenitiesData = _.extend(amenitiesData, req.body);
    console.log("API extended" + amenitiesData)
    amenitiesData.updated = Date.now();

    //   if(req.body.mobile!=user.mobile){
    //       user.mobile_verified=false
    //           }
    amenitiesData.save((err, result) => {
        if (err) {
            return res.status(400).json({
                error: err
            });
        }
        //   user.hashed_password = undefined;
        //   user.salt = undefined;

        // console.log("user after update with formdata: ", user);
        res.json(amenitiesData);
    });

}