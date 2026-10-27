const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getMyApplications,
  getCampaignApplications,
  updateApplicationStatus,
  getInfluencerStats
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats/influencer', protect, authorize('influencer'), getInfluencerStats);
router.post('/', protect, authorize('influencer'), submitApplication);
router.get('/my', protect, authorize('influencer'), getMyApplications);
router.get('/campaign/:campaignId', protect, authorize('brand'), getCampaignApplications);
router.patch('/:id/status', protect, authorize('brand'), updateApplicationStatus);

module.exports = router;
