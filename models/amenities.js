const mongoose = require('mongoose');
const amenitiesSchema = new mongoose.Schema({
    Name: {
        type: String,
       required: true,
    }
})

module.exports = mongoose.model("amenities", amenitiesSchema);