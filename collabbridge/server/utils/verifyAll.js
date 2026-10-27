const BASE_URL = 'http://localhost:5001/api';

const runVerification = async () => {
  console.log('\n======================================================');
  console.log('🧪 RUNNING COMPLETE COLLABBRIDGE VERIFICATION SUITE');
  console.log('======================================================\n');

  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(`   Error: ${err.message}`);
      failed++;
    }
  };

  const request = async (endpoint, options = {}) => {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const data = await res.json().catch(() => ({}));
    return { status: res.status, ok: res.ok, data };
  };

  let brandToken = '';
  let brandUser = null;
  let influencerToken = '';
  let influencerUser = null;
  let createdCampaignId = '';
  let applicationId = '';

  // 1. Health check
  await test('GET /api/health returns database connected and healthy status', async () => {
    const res = await request('/health');
    if (res.data.status !== 'healthy' || res.data.database !== 'connected') {
      throw new Error(`Unexpected health payload: ${JSON.stringify(res.data)}`);
    }
  });

  // 2. Register Brand
  const testBrandEmail = `brand_${Date.now()}@apexgear.test`;
  await test('POST /api/auth/register registers brand account with role=brand', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Apex Athletic Gear',
        email: testBrandEmail,
        password: 'Password123!',
        role: 'brand'
      })
    });
    if (!res.data.success || !res.data.token || res.data.user.role !== 'brand') {
      throw new Error(`Brand registration failed: ${res.data.message}`);
    }
    brandToken = res.data.token;
    brandUser = res.data.user;
  });

  // 3. Register Influencer
  const testInfluencerEmail = `creator_${Date.now()}@fitnesspro.test`;
  await test('POST /api/auth/register registers influencer and initializes InfluencerProfile', async () => {
    const res = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Maya Lin',
        email: testInfluencerEmail,
        password: 'Password123!',
        role: 'influencer'
      })
    });
    if (!res.data.success || !res.data.token || res.data.user.role !== 'influencer') {
      throw new Error(`Influencer registration failed: ${res.data.message}`);
    }
    influencerToken = res.data.token;
    influencerUser = res.data.user;
  });

  // 4. Login Brand
  await test('POST /api/auth/login authenticates with valid credentials', async () => {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testBrandEmail,
        password: 'Password123!'
      })
    });
    if (!res.data.success || !res.data.token) {
      throw new Error('Login failed');
    }
  });

  // 5. Influencer Profile Update
  await test('PUT /api/influencers/profile updates influencer metrics and social links', async () => {
    const res = await request('/influencers/profile', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${influencerToken}` },
      body: JSON.stringify({
        bio: 'Marathon runner and hybrid athlete documenting performance gear.',
        niche: 'Fitness',
        location: 'Denver, CO',
        followerCount: 95000,
        engagementRate: 5.8,
        collaborationPrice: 750,
        socialLinks: {
          instagram: 'https://instagram.com/mayafit',
          youtube: 'https://youtube.com/@mayafitness'
        }
      })
    });
    if (!res.data.success || res.data.profile.followerCount !== 95000) {
      throw new Error(`Profile update failed: ${res.data.message}`);
    }
  });

  // 6. Discover and Filter Influencers
  await test('GET /api/influencers filters by niche and minimum followers', async () => {
    const res = await request('/influencers?niche=Fitness&minFollowers=50000');
    if (!res.data.success || res.data.influencers.length === 0) {
      throw new Error('Directory filter returned no results');
    }
    const found = res.data.influencers.some((i) => i.userId?._id === influencerUser._id);
    if (!found) throw new Error('Newly created influencer not found in directory');
  });

  // 7. Brand creates a campaign
  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);
  await test('POST /api/campaigns creates a new campaign (as Brand)', async () => {
    const res = await request('/campaigns', {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
      body: JSON.stringify({
        title: 'Apex Carbon Velocity Running Shoe Launch',
        description: 'Launching our elite carbon-plate marathon racing shoes.',
        niche: 'Fitness',
        budget: 1800,
        requirements: '1x Longform YouTube shoe breakdown + 2x Instagram Reels testing cadence.',
        deadline,
        status: 'published'
      })
    });
    if (!res.data.success || !res.data.campaign._id) {
      throw new Error(`Campaign creation failed: ${res.data.message}`);
    }
    createdCampaignId = res.data.campaign._id;
  });

  // 8. Influencer browses marketplace
  await test('GET /api/campaigns marketplace lists the published campaign', async () => {
    const res = await request('/campaigns?niche=Fitness');
    if (!res.data.success) throw new Error('Marketplace query failed');
    const match = res.data.campaigns.some((c) => c._id === createdCampaignId);
    if (!match) throw new Error('Created campaign was not listed in marketplace');
  });

  // 9. Influencer submits application
  await test('POST /api/applications submits collaboration proposal', async () => {
    const res = await request('/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${influencerToken}` },
      body: JSON.stringify({
        campaignId: createdCampaignId,
        proposal: 'I am training for the Chicago Marathon. I will do an on-track pace test comparison.',
        proposedPrice: 1500
      })
    });
    if (!res.data.success || res.data.application.status !== 'pending') {
      throw new Error(`Application submission failed: ${res.data.message}`);
    }
    applicationId = res.data.application._id;
  });

  // 10. Prevent duplicate applications
  await test('Duplicate application to same campaign is rejected with 400', async () => {
    const res = await request('/applications', {
      method: 'POST',
      headers: { Authorization: `Bearer ${influencerToken}` },
      body: JSON.stringify({
        campaignId: createdCampaignId,
        proposal: 'Trying to apply a second time.',
        proposedPrice: 1500
      })
    });
    if (res.status !== 400 || res.data.success !== false) {
      throw new Error(`Duplicate application should return 400, got ${res.status}`);
    }
  });

  // 11. Unauthorized user cannot manage application status
  await test('Unauthorized user cannot change application status (rejected with 403)', async () => {
    const res = await request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${influencerToken}` },
      body: JSON.stringify({ status: 'accepted' })
    });
    if (res.status !== 403) {
      throw new Error(`Unauthorized status update should return 403, got ${res.status}`);
    }
  });

  // 12. Campaign-owning brand accepts application
  await test('PATCH /api/applications/:id/status Brand owner accepts application', async () => {
    const res = await request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${brandToken}` },
      body: JSON.stringify({ status: 'accepted' })
    });
    if (!res.data.success || res.data.application.status !== 'accepted') {
      throw new Error(`Status transition to accepted failed: ${res.data.message}`);
    }
  });

  // 13. Brand marks accepted collaboration as completed
  await test('PATCH /api/applications/:id/status Brand owner marks collaboration completed', async () => {
    const res = await request(`/applications/${applicationId}/status`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${brandToken}` },
      body: JSON.stringify({ status: 'completed' })
    });
    if (!res.data.success || res.data.application.status !== 'completed') {
      throw new Error(`Status transition to completed failed: ${res.data.message}`);
    }
  });

  // 14. Brand submits review for completed collaboration
  await test('POST /api/reviews Brand submits 5-star review for completed collaboration', async () => {
    const res = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
      body: JSON.stringify({
        campaignId: createdCampaignId,
        influencerId: influencerUser._id,
        rating: 5,
        comment: 'Maya delivered phenomenal content with exceptional pacing and camera work! Highest praise.'
      })
    });
    if (!res.data.success || res.data.review.rating !== 5) {
      throw new Error(`Review submission failed: ${res.data.message}`);
    }
  });

  // 15. Prevent duplicate review for the same collaboration
  await test('Duplicate review for same collaboration is rejected with 400', async () => {
    const res = await request('/reviews', {
      method: 'POST',
      headers: { Authorization: `Bearer ${brandToken}` },
      body: JSON.stringify({
        campaignId: createdCampaignId,
        influencerId: influencerUser._id,
        rating: 4,
        comment: 'Attempting duplicate review.'
      })
    });
    if (res.status !== 400 || res.data.success !== false) {
      throw new Error(`Duplicate review should return 400, got ${res.status}`);
    }
  });

  // 16. Verify review appears on influencer profile
  await test('GET /api/influencers/:id profile reflects updated rating and reviews', async () => {
    const res = await request(`/influencers/${influencerUser._id}`);
    if (!res.data.success || res.data.influencer.averageRating !== 5 || res.data.influencer.reviewCount !== 1) {
      throw new Error('Review did not propagate to influencer profile metrics');
    }
  });

  // 17. Brand Dashboard statistics calculate from real records
  await test('GET /api/campaigns/stats/brand calculates real DB statistics', async () => {
    const res = await request('/campaigns/stats/brand', {
      headers: { Authorization: `Bearer ${brandToken}` }
    });
    if (!res.data.success) throw new Error('Brand stats query failed');
    const { stats } = res.data;
    if (stats.totalCampaigns < 1 || stats.acceptedCollaborations < 1) {
      throw new Error(`Inaccurate statistics: ${JSON.stringify(stats)}`);
    }
  });

  // 18. Influencer Dashboard statistics calculate from real records
  await test('GET /api/applications/stats/influencer calculates real DB statistics', async () => {
    const res = await request('/applications/stats/influencer', {
      headers: { Authorization: `Bearer ${influencerToken}` }
    });
    if (!res.data.success) throw new Error('Influencer stats query failed');
    const { stats } = res.data;
    if (stats.totalApplicationsSubmitted < 1 || stats.completedCollaborations < 1) {
      throw new Error(`Inaccurate influencer statistics: ${JSON.stringify(stats)}`);
    }
  });

  console.log('\n======================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');

  if (failed > 0) process.exit(1);
  process.exit(0);
};

runVerification();
