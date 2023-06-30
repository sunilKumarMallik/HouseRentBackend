const mongoose = require('mongoose');
const furnishingAmenitiesSchema = new mongoose.Schema({
    Name: {
        type: String,
       required: true,
    }
})

module.exports = mongoose.model("furnishingAmenities", furnishingAmenitiesSchema);