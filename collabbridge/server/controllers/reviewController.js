const Review = require('../models/Review');
const Campaign = require('../models/Campaign');
const Application = require('../models/Application');

// @desc    Submit a review for an influencer after a completed collaboration
// @route   POST /api/reviews
// @access  Private (Brand role)
const createReview = async (req, res, next) => {
  try {
    const { campaignId, influencerId, rating, comment } = req.body;

    if (!campaignId || !influencerId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide campaignId, influencerId, rating, and written comment.'
      });
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be a numeric score between 1 and 5.'
      });
    }

    if (comment.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: 'Review comment must be at least 5 characters long.'
      });
    }

    // 1. Verify that the campaign exists and belongs to the reviewer (brand)
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found.'
      });
    }

    if (campaign.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only review collaborations for your own brand campaigns.'
      });
    }

    // 2. Verify that there is a COMPLETED collaboration between this brand campaign and the influencer
    const collaboration = await Application.findOne({
      campaignId,
      influencerId,
      status: 'completed'
    });

    if (!collaboration) {
      return res.status(400).json({
        success: false,
        message: 'Reviews are permitted only after a collaboration has been marked as completed.'
      });
    }

    // 3. Prevent duplicate reviews for the same collaboration
    const existingReview = await Review.findOne({
      campaignId,
      reviewerId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this collaboration.'
      });
    }

    // Create review
    const review = await Review.create({
      campaignId,
      reviewerId: req.user._id,
      influencerId,
      rating: Math.round(numRating),
      comment: comment.trim()
    });

    const populatedReview = await review.populate([
      { path: 'reviewerId', select: 'name email' },
      { path: 'campaignId', select: 'title' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review: populatedReview
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews for an influencer
// @route   GET /api/reviews/influencer/:influencerId
// @access  Public
const getInfluencerReviews = async (req, res, next) => {
  try {
    const { influencerId } = req.params;

    const reviews = await Review.find({ influencerId })
      .populate('reviewerId', 'name email')
      .populate('campaignId', 'title')
      .sort({ createdAt: -1 });

    const reviewCount = reviews.length;
    const averageRating =
      reviewCount > 0
        ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1))
        : 0;

    res.json({
      success: true,
      count: reviewCount,
      averageRating,
      reviews
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getInfluencerReviews
};
