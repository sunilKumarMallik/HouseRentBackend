const mongoose = require("mongoose");
const FeedbackSchema = new mongoose.Schema({
  rateHouseOwner: {
    rating:{
      type: String,
      default: ''
    },
    comment:{
      type:String,
      default: ''
    }
  },
  rateNeighbours: {
    rating:{
      type: String,
      default: ''
    },
    comment:{
      type:String,
      default: ''
    }
  },
  availableContract: {
    rating:{
      type: String,
      default: ''
    },
    comment:{
      type:String,
      default: ''
    }
  },
  fromSociety: {
    rating:{
      type: String,
      default: ''
    },
    comment:{
      type:String,
      default: ''
    }
  },
  maintenanceByOwner: {
    rating:{
      type: String,
      default: ''
    },
    comment:{
      type:String,
      default: ''
    }
  },
  improve:{
    comment:{
      type:String,
      default: ''
    }
  },
  contact:{
      type:Boolean,
      default: true
  },
  feedBackbyuser:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  propertyId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Property"
  },
  newPropertyId:{
   type:String
  }
  
})

module.exports = mongoose.model("FeedBack", FeedbackSchema);