const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema(
  {
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Brand reference is required']
    },
    title: {
      type: String,
      required: [true, 'Campaign title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Campaign description is required'],
      trim: true
    },
    niche: {
      type: String,
      required: [true, 'Niche is required'],
      trim: true
    },
    budget: {
      type: Number,
      required: [true, 'Budget is required'],
      min: [0, 'Budget cannot be negative']
    },
    requirements: {
      type: String,
      required: [true, 'Deliverables and requirements are required'],
      trim: true
    },
    deadline: {
      type: Date,
      required: [true, 'Campaign deadline is required']
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published', 'completed'],
        message: 'Status must be draft, published, or completed'
      },
      default: 'draft'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for search and marketplace filtering
campaignSchema.index({ status: 1, niche: 1, budget: -1 });
campaignSchema.index({ brandId: 1, createdAt: -1 });
campaignSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Campaign', campaignSchema);
