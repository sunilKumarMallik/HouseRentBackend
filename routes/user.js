const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    userPhoto,
    approveProvider,
    GenerateOtp,
    verifyOtp,
    selctedProperty,
 
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.get("/users", allUsers);
router.get("/user/:id", getUser);
router.post("/user/:userId", updateUser);
router.post("/approveprovider/:userId", approveProvider);
router.post("/selctedProperty/:userId", selctedProperty);
router.post('/generateotp',GenerateOtp)
router.post('/verifyotp',verifyOtp)

router.delete("/user/:userId", deleteUser);
router.get("/user/photo/:userId", userPhoto);

router.param("userId", userById);


module.exports = router;
