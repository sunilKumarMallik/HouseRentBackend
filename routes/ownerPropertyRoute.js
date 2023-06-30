const express = require('express');
const { addProperty, getAllProperties, updateProperty,updatePropertyById, deleteProperty, getPropertyById, getPropertyByOwner ,getSubscribedProperty, removePropertyFromUser, updateListUser,deleteTenant } = require('../controllers/ownerproperty');
const { verifyToken } = require('../helpers/auth');

const router = express.Router();

router.post("/addProperty", addProperty);
router.get("/getAllProperties", getAllProperties);
router.put("/updateProperty",verifyToken, updateProperty);
router.delete("/deleteProperty/:propertyId", verifyToken,deleteProperty);
router.post("/deleteTenant/:propertyId", verifyToken,deleteTenant);
router.delete("/removePropertyFromUser/:propertyId/:userId", verifyToken,removePropertyFromUser);
router.get("/getPropertyById/:propertyId",verifyToken, getPropertyById);
router.put("/updateListUser",verifyToken, updateListUser);
router.get("/getSubscribedProperty/:userId", verifyToken, getSubscribedProperty)
router.get('/getall/:userId',verifyToken,getPropertyByOwner)

module.exports = router;