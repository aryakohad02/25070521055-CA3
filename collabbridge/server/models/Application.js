const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    campaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campaign',
      required: [true, 'Campaign reference is required']
    },
    influencerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Influencer reference is required']
    },
    proposal: {
      type: String,
      required: [true, 'Proposal message is required'],
      trim: true,
      minlength: [10, 'Proposal message must be at least 10 characters']
    },
    proposedPrice: {
      type: Number,
      required: [true, 'Proposed collaboration price is required'],
      min: [0, 'Proposed price cannot be negative']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'completed'],
        message: 'Application status must be pending, accepted, rejected, or completed'
      },
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Enforce unique application per influencer per campaign
applicationSchema.index({ campaignId: 1, influencerId: 1 }, { unique: true });
applicationSchema.index({ influencerId: 1, status: 1 });
applicationSchema.index({ campaignId: 1, status: 1 });

module.exports = mongoose.model('Application', applicationSchema);
