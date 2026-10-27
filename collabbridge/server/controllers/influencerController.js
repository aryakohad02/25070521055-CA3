const InfluencerProfile = require('../models/InfluencerProfile');
const User = require('../models/User');
const Review = require('../models/Review');

// @desc    Get all influencers with search, filters, sorting, and pagination
// @route   GET /api/influencers
// @access  Public
const getInfluencers = async (req, res, next) => {
  try {
    const {
      search,
      niche,
      location,
      minFollowers,
      maxFollowers,
      minEngagement,
      maxPrice,
      sort,
      page = 1,
      limit = 9
    } = req.query;

    const query = {};

    // Filter by niche
    if (niche && niche !== 'All') {
      query.niche = { $regex: new RegExp(`^${niche}$`, 'i') };
    }

    // Filter by location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Filter by followers
    if (minFollowers !== undefined && minFollowers !== '') {
      query.followerCount = { ...query.followerCount, $gte: Number(minFollowers) };
    }
    if (maxFollowers !== undefined && maxFollowers !== '') {
      query.followerCount = { ...query.followerCount, $lte: Number(maxFollowers) };
    }

    // Filter by engagement rate
    if (minEngagement !== undefined && minEngagement !== '') {
      query.engagementRate = { ...query.engagementRate, $gte: Number(minEngagement) };
    }

    // Filter by price
    if (maxPrice !== undefined && maxPrice !== '') {
      query.collaborationPrice = { ...query.collaborationPrice, $lte: Number(maxPrice) };
    }

    // If search keyword is given, find matching users first
    if (search && search.trim()) {
      const matchingUsers = await User.find({
        role: 'influencer',
        name: { $regex: search.trim(), $options: 'i' }
      }).select('_id');
      const userIds = matchingUsers.map((u) => u._id);
      query.userId = { $in: userIds };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'followers_desc') sortOption = { followerCount: -1 };
    else if (sort === 'followers_asc') sortOption = { followerCount: 1 };
    else if (sort === 'price_asc') sortOption = { collaborationPrice: 1 };
    else if (sort === 'price_desc') sortOption = { collaborationPrice: -1 };
    else if (sort === 'engagement_desc') sortOption = { engagementRate: -1 };

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 9;
    const skip = (pageNum - 1) * limitNum;

    const total = await InfluencerProfile.countDocuments(query);
    const profiles = await InfluencerProfile.find(query)
      .populate('userId', 'name email role createdAt')
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum);

    // Filter out any profiles where user document was deleted
    const validProfiles = profiles.filter((p) => p.userId != null);

    // Attach review ratings summary
    const enhancedProfiles = await Promise.all(
      validProfiles.map(async (profile) => {
        const reviews = await Review.find({ influencerId: profile.userId._id });
        const reviewCount = reviews.length;
        const averageRating =
          reviewCount > 0
            ? Number((reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviewCount).toFixed(1))
            : 0;

        return {
          ...profile.toObject(),
          averageRating,
          reviewCount
        };
      })
    );

    // If sorting by rating
    if (sort === 'rating_desc') {
      enhancedProfiles.sort((a, b) => b.averageRating - a.averageRating);
    }

    res.json({
      success: true,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum) || 1,
      count: enhancedProfiles.length,
      influencers: enhancedProfiles
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single influencer details by User ID or Profile ID
// @route   GET /api/influencers/:id
// @access  Public
const getInfluencerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if ID matches userId or profile _id
    let profile = await InfluencerProfile.findOne({
      $or: [{ userId: id }, { _id: id }]
    }).populate('userId', 'name email role createdAt');

    if (!profile) {
      // Check if user exists as influencer without a profile yet
      const user = await User.findById(id).select('-passwordHash');
      if (user && user.role === 'influencer') {
        profile = await InfluencerProfile.create({
          userId: user._id,
          bio: `Hi, I'm ${user.name}! Excited to collaborate with great brands.`,
          niche: 'Lifestyle'
        });
        profile = await profile.populate('userId', 'name email role createdAt');
      } else {
        return res.status(404).json({
          success: false,
          message: 'Influencer profile not found'
        });
      }
    }

    // Fetch real reviews
    const reviews = await Review.find({ influencerId: profile.userId._id })
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
      influencer: {
        ...profile.toObject(),
        averageRating,
        reviewCount,
        reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update influencer's own profile
// @route   PUT /api/influencers/profile
// @access  Private (Influencer role only)
const updateProfile = async (req, res, next) => {
  try {
    const {
      bio,
      niche,
      location,
      socialLinks,
      followerCount,
      engagementRate,
      collaborationPrice,
      profileImage
    } = req.body;

    let profile = await InfluencerProfile.findOne({ userId: req.user._id });

    const updateData = {
      bio: bio !== undefined ? bio : profile?.bio,
      niche: niche || profile?.niche || 'Lifestyle',
      location: location !== undefined ? location : profile?.location,
      followerCount: followerCount !== undefined ? Math.max(0, Number(followerCount)) : profile?.followerCount,
      engagementRate: engagementRate !== undefined ? Math.max(0, Math.min(100, Number(engagementRate))) : profile?.engagementRate,
      collaborationPrice: collaborationPrice !== undefined ? Math.max(0, Number(collaborationPrice)) : profile?.collaborationPrice,
      profileImage: profileImage !== undefined ? profileImage : profile?.profileImage,
      socialLinks: {
        instagram: socialLinks?.instagram !== undefined ? socialLinks.instagram : profile?.socialLinks?.instagram || '',
        youtube: socialLinks?.youtube !== undefined ? socialLinks.youtube : profile?.socialLinks?.youtube || '',
        twitter: socialLinks?.twitter !== undefined ? socialLinks.twitter : profile?.socialLinks?.twitter || '',
        tiktok: socialLinks?.tiktok !== undefined ? socialLinks.tiktok : profile?.socialLinks?.tiktok || '',
        website: socialLinks?.website !== undefined ? socialLinks.website : profile?.socialLinks?.website || ''
      }
    };

    if (!profile) {
      profile = await InfluencerProfile.create({
        userId: req.user._id,
        ...updateData
      });
    } else {
      profile = await InfluencerProfile.findOneAndUpdate(
        { userId: req.user._id },
        updateData,
        { new: true, runValidators: true }
      );
    }

    profile = await profile.populate('userId', 'name email role');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getInfluencers,
  getInfluencerById,
  updateProfile
};
