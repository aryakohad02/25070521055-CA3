const Application = require('../models/Application');
const Campaign = require('../models/Campaign');
const InfluencerProfile = require('../models/InfluencerProfile');

// @desc    Submit an application to a campaign
// @route   POST /api/applications
// @access  Private (Influencer role)
const submitApplication = async (req, res, next) => {
  try {
    const { campaignId, proposal, proposedPrice } = req.body;

    if (!campaignId || !proposal || proposedPrice === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide campaignId, proposal message, and proposed price.'
      });
    }

    // Verify campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'The campaign you are applying to does not exist.'
      });
    }

    // Cannot apply to draft or completed campaigns
    if (campaign.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: `Applications are closed for this campaign (Status: ${campaign.status}).`
      });
    }

    // Check if campaign deadline has passed
    if (new Date(campaign.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'The deadline for this campaign has expired.'
      });
    }

    // Check for duplicate application
    const existing = await Application.findOne({
      campaignId,
      influencerId: req.user._id
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted an application for this campaign.'
      });
    }

    const application = await Application.create({
      campaignId,
      influencerId: req.user._id,
      proposal: proposal.trim(),
      proposedPrice: Number(proposedPrice),
      status: 'pending'
    });

    const populatedApplication = await application.populate([
      { path: 'campaignId', populate: { path: 'brandId', select: 'name email' } },
      { path: 'influencerId', select: 'name email' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully!',
      application: populatedApplication
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications submitted by the logged-in influencer
// @route   GET /api/applications/my
// @access  Private (Influencer role)
const getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ influencerId: req.user._id })
      .populate({
        path: 'campaignId',
        populate: { path: 'brandId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all applications for a specific campaign (Brand owner only)
// @route   GET /api/applications/campaign/:campaignId
// @access  Private (Brand owner)
const getCampaignApplications = async (req, res, next) => {
  try {
    const { campaignId } = req.params;

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Verify ownership
    if (campaign.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only view applications for your own campaigns.'
      });
    }

    const applications = await Application.find({ campaignId })
      .populate('influencerId', 'name email')
      .sort({ createdAt: -1 });

    // Attach influencer profile details (followers, niche, etc.) to each application
    const enhancedApplications = await Promise.all(
      applications.map(async (app) => {
        const profile = await InfluencerProfile.findOne({ userId: app.influencerId._id });
        return {
          ...app.toObject(),
          influencerProfile: profile
        };
      })
    );

    res.json({
      success: true,
      count: enhancedApplications.length,
      applications: enhancedApplications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status (Brand accepts, rejects, or marks completed)
// @route   PATCH /api/applications/:id/status
// @access  Private (Brand owner)
const updateApplicationStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'accepted', 'rejected', or 'completed'."
      });
    }

    const application = await Application.findById(id).populate('campaignId');
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Verify that the logged in user is the owner of this campaign
    if (application.campaignId.brandId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized: You can only manage applications for campaigns created by your brand.'
      });
    }

    // State transition validations:
    // 1. Can only mark 'completed' if the application was previously 'accepted'
    if (status === 'completed' && application.status !== 'accepted') {
      return res.status(400).json({
        success: false,
        message: 'Only previously accepted collaborations can be marked as completed.'
      });
    }

    // 2. Cannot alter already completed applications
    if (application.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This collaboration is already marked as completed and cannot be modified.'
      });
    }

    application.status = status;
    await application.save();

    const populatedApp = await application.populate([
      { path: 'campaignId', populate: { path: 'brandId', select: 'name email' } },
      { path: 'influencerId', select: 'name email' }
    ]);

    res.json({
      success: true,
      message: `Collaboration status updated to ${status}!`,
      application: populatedApp
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Influencer Dashboard Statistics from real database records
// @route   GET /api/applications/stats/influencer
// @access  Private (Influencer role)
const getInfluencerStats = async (req, res, next) => {
  try {
    const influencerId = req.user._id;

    // Fetch influencer profile
    const profile = await InfluencerProfile.findOne({ userId: influencerId });

    // Calculate profile completion percentage
    let completedFields = 0;
    const totalFields = 6;
    if (profile) {
      if (profile.bio && profile.bio.trim().length > 10) completedFields++;
      if (profile.niche) completedFields++;
      if (profile.location && profile.location.trim().length > 0) completedFields++;
      if (profile.followerCount > 0) completedFields++;
      if (profile.collaborationPrice > 0) completedFields++;
      if (profile.profileImage || (profile.socialLinks && (profile.socialLinks.instagram || profile.socialLinks.youtube))) {
        completedFields++;
      }
    }
    const profileCompletionPercentage = Math.round((completedFields / totalFields) * 100);

    // Fetch applications
    const applications = await Application.find({ influencerId })
      .populate({
        path: 'campaignId',
        populate: { path: 'brandId', select: 'name email' }
      })
      .sort({ createdAt: -1 });

    const totalApplicationsSubmitted = applications.length;
    const pendingApplications = applications.filter((a) => a.status === 'pending').length;
    const acceptedCollaborations = applications.filter((a) => a.status === 'accepted').length;
    const completedCollaborations = applications.filter((a) => a.status === 'completed').length;

    // Available open campaigns
    const availableCampaigns = await Campaign.countDocuments({
      status: 'published',
      deadline: { $gte: new Date() }
    });

    const recentApplications = applications.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalApplicationsSubmitted,
        pendingApplications,
        acceptedCollaborations,
        completedCollaborations,
        availableCampaigns,
        profileCompletionPercentage
      },
      profile,
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitApplication,
  getMyApplications,
  getCampaignApplications,
  updateApplicationStatus,
  getInfluencerStats
};
