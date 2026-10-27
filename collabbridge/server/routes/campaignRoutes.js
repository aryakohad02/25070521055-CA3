const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getBrandStats
} = require('../controllers/campaignController');
const { protect, optionalAuth, authorize } = require('../middleware/auth');

router.get('/stats/brand', protect, authorize('brand'), getBrandStats);
router.get('/', optionalAuth, getCampaigns);
router.get('/:id', optionalAuth, getCampaignById);
router.post('/', protect, authorize('brand'), createCampaign);
router.put('/:id', protect, authorize('brand'), updateCampaign);
router.delete('/:id', protect, authorize('brand'), deleteCampaign);

module.exports = router;
