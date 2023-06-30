const express = require('express');

const { updateCreditScore } = require('../controllers/updateCreditScore');
const router = express.Router();

router.put('/updateCreditData/:tenantId/',updateCreditScore)
module.exports = router;