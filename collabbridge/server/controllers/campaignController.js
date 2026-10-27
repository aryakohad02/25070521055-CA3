const Campaign = require('../models/Campaign');
const Application = require('../models/Application');
const Review = require('../models/Review');

// @desc    Get campaigns (Marketplace or Brand's own)
// @route   GET /api/campaigns
// @access  Public / Private
const getCampaigns = async (req, res, next) => {
  try {
    const {
      search,
      niche,
      minBudget,
      maxBudget,
      status,
      brandOnly,
      sort,
      page = 1,
      limit = 9
    } = req.query;

    const query = {};

    // If brand is viewing their own campaigns
    if (brandOnly === 'true' && req.user && req.user.role === 'brand') {
      query.brandId = req.user._id;
      if (status && ['draft', 'published', 'completed'].includes(status)) {
        query.status = status;
      }
    } else {
      // Marketplace browsing: show only published campaigns by default
      if (status && ['draft', 'published', 'completed'].includes(status)) {
        query.status = status;
      } else {
        query.status = 'published';
      }
    }

    // Filter by niche
    if (niche && niche !== 'All') {
      query.niche = { $regex: new RegExp(`^${niche}$`, 'i') };
    }

    // Filter by budget
    if (minBudget !== undefined && minBudget !== '') {
      query.budget = { ...query.budget, $gte: Number(minBudget) };
    }
    if (maxBudget !== undefined && maxBudget !== '') {
      query.budget = { ...query.budget, $lte: Number(maxBudget) };
    }

    // Search by title or description
    if (search && search.trim()) {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'budget_desc') sortOption = { budget: -1 };
    else if (sort === 'budget_asc') sortOption = { budget: 1 };
    else if (sort === 'deadline_asc') sortOption = { deadline: 1 };
    else if (sort === 'oldest') sortOption = { createdAt: 1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await Campaign.countDocuments(query);
    const campaigns = await Campaign.find(query)
      .populate('brandId', 'name email')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Attach application counts for each campaign
    const campaignsWithCounts = await Promise.all(
      campaigns.map(async (c) => {
        const applicationCount = await Application.countDocuments({ campaignId: c._id });
        return {
          ...c.toObject(),
          applicationCount
        };
      })
    );

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      count: campaignsWithCounts.length,
      campaigns: campaignsWithCounts
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single campaign details
// @route   GET /api/campaigns/:id
// @access  Public / Private
const getCampaignById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id).populate('brandId', 'name email');

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Campaign not found'
      });
    }

    // Fetch applications count
    const applicationCount = await Application.countDocuments({ campaignId: campaign._id });

    // If the requester is an influencer, check if they have already applied
    let myApplication = null;
    if (req.user && req.user.role === 'influencer') {
      myApplication = await Application.findOne({
        campaignId: campaign._id,
        influencerId: req.user._id
      });
    }

    // If requester is the brand owner, include applications list
    let applications = [];
    if (req.user && req.user.role === 'brand' && campaign.brandId._id.toString() === req.user._id.toString()) {
      applications = await Application.find({ campaignId: campaign._id })
        .populate('influencerId', 'name email')
        .sort({ createdAt: -1 });
    }

    res.json({
      success: true,
      campaign: {
        ...campaign.toObject(),
        applicationCount,
        myApplication,
        applications
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (Brand only)
const createCampaign = async (req, res, next) => {
  try {
    const { title, description, niche, budget, requirements, deadline, status } = req.body;

    if (!title || !description || !niche || budget === undefined || !requirements || !deadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, description, niche, budget, requirements, and deadline.'
      });
    }

    if (new Date(deadline) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be a future date.'
      });
    }

    const campaign = await Campaign.create({
      brandId: req.user._id,
      title: title.trim(),
      description: description.trim(),
      niche: niche.trim(),
      budget: Number(budget),
      requirements: requirements.trim(),
      deadline: new Date(deadline),
      status: status && ['draft', 'published'].includes(status) ? status : 'draft'
    });

    const populatedCampaign = await campaign.populate('brandId', 'name email');

    res.status(201).json({
      success: true,
      message: `Campaign created successfully as ${campaign.status}!`,
      campaign: populatedCampaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing campaign
// @route   PUT /api/campaigns/:id
// @access  Private (Brand owner only)
const updateCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    let campaign = await Campaign.findById(id);

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
        message: 'Not authorized: You can only edit campaigns created by your brand.'
      });
    }

    const { title, description, niche, budget, requirements, deadline, status } = req.body;

    if (deadline && new Date(deadline) <= new Date() && status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Deadline must be a future date.'
      });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (description !== undefined) updateFields.description = description.trim();
    if (niche !== undefined) updateFields.niche = niche.trim();
    if (budget !== undefined) updateFields.budget = Number(budget);
    if (requirements !== undefined) updateFields.requirements = requirements.trim();
    if (deadline !== undefined) updateFields.deadline = new Date(deadline);
    if (status !== undefined && ['draft', 'published', 'completed'].includes(status)) {
      updateFields.status = status;
    }

    campaign = await Campaign.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true
    }).populate('brandId', 'name email');

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      campaign
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private (Brand owner only)
const deleteCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);

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
        message: 'Not authorized: You can only delete your own campaigns.'
      });
    }

    // Delete associated applications and reviews to prevent orphaned records
    await Application.deleteMany({ campaignId: campaign._id });
    await Review.deleteMany({ campaignId: campaign._id });
    await campaign.deleteOne();

    res.json({
      success: true,
      message: 'Campaign and associated applications deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get Brand Dashboard Statistics from real database records
// @route   GET /api/campaigns/stats/brand
// @access  Private (Brand role)
const getBrandStats = async (req, res, next) => {
  try {
    const brandId = req.user._id;

    const brandCampaigns = await Campaign.find({ brandId }).sort({ createdAt: -1 });
    const campaignIds = brandCampaigns.map((c) => c._id);

    const totalCampaigns = brandCampaigns.length;
    const activeCampaigns = brandCampaigns.filter((c) => c.status === 'published').length;
    const completedCampaigns = brandCampaigns.filter((c) => c.status === 'completed').length;
    const draftCampaigns = brandCampaigns.filter((c) => c.status === 'draft').length;

    // Fetch all applications across brand campaigns
    const allApplications = await Application.find({ campaignId: { $in: campaignIds } })
      .populate('influencerId', 'name email')
      .populate('campaignId', 'title budget status')
      .sort({ createdAt: -1 });

    const totalApplicationsReceived = allApplications.length;
    const acceptedCollaborations = allApplications.filter(
      (app) => app.status === 'accepted' || app.status === 'completed'
    ).length;
    const pendingApplications = allApplications.filter((app) => app.status === 'pending').length;

    // Recent 5 applications
    const recentApplications = allApplications.slice(0, 5);

    // Recent 5 campaigns
    const recentCampaigns = brandCampaigns.slice(0, 5);

    res.json({
      success: true,
      stats: {
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        draftCampaigns,
        totalApplicationsReceived,
        acceptedCollaborations,
        pendingApplications
      },
      recentCampaigns,
      recentApplications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getBrandStats
};
