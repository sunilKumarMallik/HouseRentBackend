const express = require("express");
const { createPricing } = require("../controllers/pricing");
const router = express.Router();

router.get("/pricing/create", createPricing);

module.exports = router;
