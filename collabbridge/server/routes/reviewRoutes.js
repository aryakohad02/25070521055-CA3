const express = require('express');
const router = express.Router();
const { createReview, getInfluencerReviews } = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, authorize('brand'), createReview);
router.get('/influencer/:influencerId', getInfluencerReviews);

module.exports = router;
