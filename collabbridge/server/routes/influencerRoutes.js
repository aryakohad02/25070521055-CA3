const express = require('express');
const router = express.Router();
const {
  getInfluencers,
  getInfluencerById,
  updateProfile
} = require('../controllers/influencerController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getInfluencers);
router.put('/profile', protect, authorize('influencer'), updateProfile);
router.get('/:id', getInfluencerById);

module.exports = router;
