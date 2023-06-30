const express = require('express');

const { createRentByCash, getCreditScore} = require('../controllers/rentbyCash');
const router = express.Router();

router.post('/rentbyCash/create/:tenantId/:propertyId',createRentByCash)
router.get('/getCreditScore/:tenantId/:propertyId',getCreditScore)
// router.put('/maintenanceStatus',updateMaintenanceStatus)
// router.get('/maintenance/all',getall)
module.exports = router;