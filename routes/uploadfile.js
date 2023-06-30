const express = require("express");
const multer = require('multer');
const { imageUpload } = require("../controllers/uploadfile");
const inMemoryStorage = multer.memoryStorage();
const singleFileUpload = multer({ storage: inMemoryStorage });

const router = express.Router();


router.post("/filestos3", singleFileUpload.array('file'),imageUpload)


module.exports = router;