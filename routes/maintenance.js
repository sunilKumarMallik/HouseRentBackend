const express = require('express');

const { createmaintenance, getall, getbyUserid , getbyPropertyid,getbyOwnerid, updateMaintenanceStatus} = require('../controllers/maintenance');
const router = express.Router();

router.post('/maintenance/create',createmaintenance)
router.put('/maintenanceStatus',updateMaintenanceStatus)
router.get('/maintenance/all',getall)
router.get('/maintenanceByPropertyId/:propertyId',getbyPropertyid)
router.get('/maintenanceByOwnerId/:ownerId',getbyOwnerid)
router.get('/maintenanceByUserId/:maintenancebyuser',getbyUserid)
module.exports = router;