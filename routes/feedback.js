const express = require('express');
const { createfeedback ,getall,getbyid, getFeedbackByPropertyId} = require('../controllers/feedback');
const router = express.Router();

router.post('/feedback/create',createfeedback)
router.get('/feedback/all',getall)
router.get('/feedback/:propertyId',getbyid)
router.get('/getFeedbackByPropertyId', getFeedbackByPropertyId)
module.exports = router;