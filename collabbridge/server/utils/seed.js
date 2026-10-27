const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const InfluencerProfile = require('../models/InfluencerProfile');
const Campaign = require('../models/Campaign');
const Application = require('../models/Application');
const Review = require('../models/Review');

const seedData = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collabbridge';
  try {
    console.log(`[Seed Script] Connecting to MongoDB at ${uri}...`);
    await mongoose.connect(uri);
    console.log('[Seed Script] Connected successfully.');

    // Common password for all demo accounts
    const password = 'Password123!';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 1. Seed Brands
    const brandData = [
      {
        name: 'Aura Audio Co.',
        email: 'brand@auraaudio.com',
        passwordHash,
        role: 'brand'
      },
      {
        name: 'Lumina Skin Lab',
        email: 'contact@luminaskin.com',
        passwordHash,
        role: 'brand'
      }
    ];

    const brands = [];
    for (const b of brandData) {
      let user = await User.findOne({ email: b.email });
      if (!user) {
        user = await User.create(b);
        console.log(`[Seed] Created Brand user: ${user.name} (${user.email})`);
      } else {
        console.log(`[Seed] Existing Brand found: ${user.name} (${user.email})`);
      }
      brands.push(user);
    }

    // 2. Seed Influencers
    const influencerData = [
      {
        name: 'Marcus Chen',
        email: 'marcus@techcreator.io',
        passwordHash,
        role: 'influencer',
        profile: {
          bio: 'Tech reviewer, software engineer, and minimalist workspace enthusiast. Creating honest, in-depth breakdowns of modern hardware and gadgets.',
          niche: 'Technology',
          location: 'San Francisco, CA',
          followerCount: 145000,
          engagementRate: 4.8,
          collaborationPrice: 850,
          profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          socialLinks: {
            youtube: 'https://youtube.com/@marcustech',
            instagram: 'https://instagram.com/marcuschen',
            twitter: 'https://x.com/marcuschen'
          }
        }
      },
      {
        name: 'Sophia Rodriguez',
        email: 'sophia@stylejourney.com',
        passwordHash,
        role: 'influencer',
        profile: {
          bio: 'Fashion stylist and creative director sharing curated wardrobe edits, sustainable brands, and high-aesthetic city lifestyle stories.',
          niche: 'Fashion',
          location: 'New York, NY',
          followerCount: 320000,
          engagementRate: 5.2,
          collaborationPrice: 1500,
          profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
          socialLinks: {
            instagram: 'https://instagram.com/sophiarodriguez',
            tiktok: 'https://tiktok.com/@sophiastyle'
          }
        }
      },
      {
        name: 'Devon Miller',
        email: 'devon@peakfitness.fit',
        passwordHash,
        role: 'influencer',
        profile: {
          bio: 'Certified strength and conditioning coach helping everyday athletes hit peak physical and mental performance through evidence-based habits.',
          niche: 'Fitness',
          location: 'Austin, TX',
          followerCount: 89000,
          engagementRate: 6.1,
          collaborationPrice: 600,
          profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
          socialLinks: {
            youtube: 'https://youtube.com/@devonpeak',
            instagram: 'https://instagram.com/devonfitness'
          }
        }
      },
      {
        name: 'Elena Rostova',
        email: 'elena@wanderlustvisuals.com',
        passwordHash,
        role: 'influencer',
        profile: {
          bio: 'Travel photographer and expedition documentarian exploring hidden destinations, boutique stays, and backcountry gear worldwide.',
          niche: 'Travel',
          location: 'Seattle, WA',
          followerCount: 210000,
          engagementRate: 4.3,
          collaborationPrice: 1200,
          profileImage: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80',
          socialLinks: {
            instagram: 'https://instagram.com/elenarostova',
            website: 'https://wanderlustvisuals.com'
          }
        }
      },
      {
        name: 'Kai Tanaka',
        email: 'kai@gamereviewspro.com',
        passwordHash,
        role: 'influencer',
        profile: {
          bio: 'Competitive esports caster and game hardware reviewer. Daily Twitch streamer with high-engagement gaming community.',
          niche: 'Gaming',
          location: 'Los Angeles, CA',
          followerCount: 450000,
          engagementRate: 7.4,
          collaborationPrice: 2000,
          profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
          socialLinks: {
            youtube: 'https://youtube.com/@kaigaming',
            twitter: 'https://x.com/kaitanaka'
          }
        }
      }
    ];

    const influencers = [];
    for (const item of influencerData) {
      let user = await User.findOne({ email: item.email });
      if (!user) {
        user = await User.create({
          name: item.name,
          email: item.email,
          passwordHash: item.passwordHash,
          role: item.role
        });
        console.log(`[Seed] Created Influencer user: ${user.name} (${user.email})`);
      }

      let profile = await InfluencerProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await InfluencerProfile.create({
          userId: user._id,
          ...item.profile
        });
        console.log(`[Seed] Created Profile for: ${user.name}`);
      }
      influencers.push({ user, profile });
    }

    // 3. Seed Campaigns for Aura Audio (Brand 0) and Lumina Skin (Brand 1)
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 30);
    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 45);
    const futureDate3 = new Date();
    futureDate3.setDate(futureDate3.getDate() + 60);

    const campaignData = [
      {
        brandId: brands[0]._id,
        title: 'Aura Flow Wireless Earbuds Launch Campaign',
        description:
          'We are unveiling our next-generation true wireless earbuds featuring adaptive ANC, spatial audio, and 40-hour battery life. Seeking tech and lifestyle creators for unboxing, sound quality comparison, and aesthetic daily-carry integrations.',
        niche: 'Technology',
        budget: 2500,
        requirements: '1x YouTube long-form video or 2x Instagram Reels showcasing active noise cancellation and design aesthetic.',
        deadline: futureDate1,
        status: 'published'
      },
      {
        brandId: brands[0]._id,
        title: 'Studio Master ANC Headphones Review',
        description:
          'Deep dive into audio fidelity, comfort during extended work sessions, and microphone clarity for remote professionals and audiophiles.',
        niche: 'Technology',
        budget: 1800,
        requirements: '1 dedicated review video or carousel post highlighting sound signatures and battery endurance.',
        deadline: futureDate2,
        status: 'published'
      },
      {
        brandId: brands[1]._id,
        title: 'Pure Glow Vitamin C Serum Spring Showcase',
        description:
          'Promote our dermatologically tested Vitamin C + Ferulic Acid brightening serum. Looking for clean skincare advocates focusing on radiant, healthy skin routines.',
        niche: 'Beauty',
        budget: 3200,
        requirements: '3-week before & after progress stories + 1 high-resolution tutorial reel showing product texture.',
        deadline: futureDate1,
        status: 'published'
      },
      {
        brandId: brands[0]._id,
        title: 'Summer Sustainable Streetwear Capsule',
        description:
          'Launching our eco-friendly, organic cotton apparel drop. Seeking fashion curators to style 3 unique urban looks.',
        niche: 'Fashion',
        budget: 1500,
        requirements: '1 carousel lookbook and 2 styling TikTok/Reels showcasing fabric quality and movement.',
        deadline: futureDate2,
        status: 'published'
      },
      {
        brandId: brands[1]._id,
        title: 'Holistic Daily Wellness Routine Integration',
        description:
          'Partnering with wellness creators to showcase how mindful skincare and hydration elevate everyday vitality.',
        niche: 'Fitness',
        budget: 950,
        requirements: 'Morning routine integration Reel highlighting daily SPF and antioxidant barrier shield.',
        deadline: futureDate3,
        status: 'published'
      },
      {
        brandId: brands[0]._id,
        title: 'Next-Gen Ultralight Travel Audio Gear (Q3 Draft)',
        description:
          'Early planning stage for waterproof compact portable travel speakers. Reserved for international nomads.',
        niche: 'Travel',
        budget: 2000,
        requirements: 'Field testing during outdoor adventure or campsite.',
        deadline: futureDate3,
        status: 'draft'
      }
    ];

    const campaigns = [];
    for (const c of campaignData) {
      let campaign = await Campaign.findOne({ title: c.title, brandId: c.brandId });
      if (!campaign) {
        campaign = await Campaign.create(c);
        console.log(`[Seed] Created Campaign: ${campaign.title}`);
      }
      campaigns.push(campaign);
    }

    // 4. Seed Applications demonstrating different statuses (accepted, completed, pending)
    // Application 1: Marcus applied to Aura Flow Earbuds -> ACCEPTED
    let app1 = await Application.findOne({
      campaignId: campaigns[0]._id,
      influencerId: influencers[0].user._id
    });
    if (!app1) {
      app1 = await Application.create({
        campaignId: campaigns[0]._id,
        influencerId: influencers[0].user._id,
        proposal:
          'I have tested over 30 pairs of ANC earbuds. I will do a direct frequency curve and mic isolation test in bustling coffee shop environments.',
        proposedPrice: 850,
        status: 'accepted'
      });
      console.log(`[Seed] Created Application: Marcus -> Aura Flow (ACCEPTED)`);
    }

    // Application 2: Sophia applied to Summer Sustainable Streetwear -> COMPLETED
    let app2 = await Application.findOne({
      campaignId: campaigns[3]._id,
      influencerId: influencers[1].user._id
    });
    if (!app2) {
      app2 = await Application.create({
        campaignId: campaigns[3]._id,
        influencerId: influencers[1].user._id,
        proposal:
          'My audience loves sustainable fashion. I will curate 3 minimalist capsule outfits with your apparel in Soho, NYC.',
        proposedPrice: 1500,
        status: 'completed'
      });
      console.log(`[Seed] Created Application: Sophia -> Streetwear (COMPLETED)`);
    }

    // Application 3: Elena applied to Pure Glow Vitamin C -> PENDING
    let app3 = await Application.findOne({
      campaignId: campaigns[2]._id,
      influencerId: influencers[3].user._id
    });
    if (!app3) {
      app3 = await Application.create({
        campaignId: campaigns[2]._id,
        influencerId: influencers[3].user._id,
        proposal:
          'Skincare is vital during high-altitude travel. Would love to feature your serum during my upcoming Pacific Northwest shoot.',
        proposedPrice: 1200,
        status: 'pending'
      });
      console.log(`[Seed] Created Application: Elena -> Pure Glow (PENDING)`);
    }

    // Application 4: Kai applied to Studio Master ANC -> PENDING
    let app4 = await Application.findOne({
      campaignId: campaigns[1]._id,
      influencerId: influencers[4].user._id
    });
    if (!app4) {
      app4 = await Application.create({
        campaignId: campaigns[1]._id,
        influencerId: influencers[4].user._id,
        proposal:
          'I stream 6 hours daily to 450k followers. Will test spatial audio in tactical FPS games on stream.',
        proposedPrice: 1800,
        status: 'pending'
      });
      console.log(`[Seed] Created Application: Kai -> Studio Master (PENDING)`);
    }

    // 5. Seed Review for the COMPLETED collaboration (Sophia Rodriguez reviewed by Aura Audio)
    let review1 = await Review.findOne({
      campaignId: campaigns[3]._id,
      reviewerId: brands[0]._id
    });
    if (!review1) {
      review1 = await Review.create({
        campaignId: campaigns[3]._id,
        reviewerId: brands[0]._id,
        influencerId: influencers[1].user._id,
        rating: 5,
        comment:
          'Sophia exceeded all our expectations! Her storytelling and reels generated incredible engagement, driving strong click-through rates. Highly professional, communicative, and delivered ahead of schedule.'
      });
      console.log(`[Seed] Created Review for Sophia Rodriguez (5 stars)`);
    }

    console.log('\n======================================================');
    console.log('✅ Demo Seed Data Loaded Successfully!');
    console.log('======================================================');
    console.log('Demo Credentials (All accounts use password: Password123!)');
    console.log('Brands:');
    console.log('  1. brand@auraaudio.com   (Aura Audio Co.)');
    console.log('  2. contact@luminaskin.com (Lumina Skin Lab)');
    console.log('Influencers:');
    console.log('  1. marcus@techcreator.io     (Technology, San Francisco)');
    console.log('  2. sophia@stylejourney.com   (Fashion, New York)');
    console.log('  3. devon@peakfitness.fit     (Fitness, Austin)');
    console.log('  4. elena@wanderlustvisuals.com (Travel, Seattle)');
    console.log('  5. kai@gamereviewspro.com    (Gaming, Los Angeles)');
    console.log('======================================================\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  }
};

seedData();
