const express = require('express');
const { createfeedback, getall, getbyid, getFeedbackByPropertyId, getTenantFeedBack, getTenantForFeedBack, getFeedback, getFeedbackForTenant } = require('../controllers/feedBacktoTenant')
const router = express.Router();

router.post('/feedBacktoTenant/create',createfeedback)
router.get('/feedBacktoTenant/all',getall)
router.get('/feedBacktoTenant/:propertyId',getbyid)
router.get('/getFeedbackByPropertyId', getFeedbackByPropertyId)
// Frowm owner to tenant feedback,here tenant only see the feedback i.e get api
router.get('/feedbackfortenant/:tenantId/:propertyId/', getTenantFeedBack)
router.get('/getallfeedfortenant/:tenantId',getTenantForFeedBack)
// Frowm owner to tenant feedback,here owner only see the feedback i.e get api
router.get('/feedback/get/:tenantId/:propertyId',getFeedback)
router.get('/getownerreview/:tenantId',getFeedbackForTenant)

module.exports = router;