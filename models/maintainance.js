const mongoose = require("mongoose");
const MaintenanceSchema = new mongoose.Schema({
  request: {
    type: String,
    defult: "",
  },
  reqDate: {
    type: Date,
    default: Date.now,
  },
  houseName: {
    type: String,
    ref: "Property",
  },
  houseNo:{
    type: String,
    required: true
},

// listedByUsers:[{
//   type:mongoose.Schema.Types.ObjectId,
//   ref:"User"
// }],

  maintenancebyuser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
  },
  newPropertyId:{
    type:String
   },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status:{
    type:String,
    default:"pending",
    enum:['pending','inprogress','complete','reject']
  }
});

module.exports = mongoose.model("Maintenance", MaintenanceSchema);
