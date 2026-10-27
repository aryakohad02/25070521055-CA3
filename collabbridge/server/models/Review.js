const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required']
    },
    reviewerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reviewer reference is required']
    },
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Influencer reference is required']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [5, 'Review comment must be at least 5 characters'],
      maxlength: [1000, 'Review comment cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

// Enforce one review per brand per collaboration campaign
reviewSchema.index({ campaignId: 1, reviewerId: 1 }, { unique: true });
reviewSchema.index({ influencerId: 1, createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);
