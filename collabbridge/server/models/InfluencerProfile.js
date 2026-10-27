const mongoose = require('mongoose');

const influencerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      default: '',
      maxlength: [1000, 'Bio cannot exceed 1000 characters']
    },
    niche: {
      type: String,
      required: [true, 'Niche is required'],
      default: 'Lifestyle',
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    socialLinks: {
      instagram: { type: String, default: '', trim: true },
      youtube: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
      tiktok: { type: String, default: '', trim: true },
      website: { type: String, default: '', trim: true }
    },
    followerCount: {
      type: Number,
      default: 0,
      min: [0, 'Follower count cannot be negative']
    },
    engagementRate: {
      type: Number,
      default: 0,
      min: [0, 'Engagement rate cannot be negative'],
      max: [100, 'Engagement rate cannot exceed 100%']
    },
    collaborationPrice: {
      type: Number,
      default: 0,
      min: [0, 'Collaboration price cannot be negative']
    },
    profileImage: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Indexes for high-performance searching and filtering in the directory
influencerProfileSchema.index({ niche: 1, followerCount: -1 });
influencerProfileSchema.index({ collaborationPrice: 1 });
influencerProfileSchema.index({ engagementRate: -1 });

module.exports = mongoose.model('InfluencerProfile', influencerProfileSchema);
