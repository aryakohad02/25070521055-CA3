import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Megaphone,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
  Star,
  Award,
  Sparkles
} from 'lucide-react';
import '../styles/marketplace.css';

const LandingPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: '80px 0 60px', background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)' }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '9999px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '24px'
            }}
          >
            <Sparkles size={16} />
            <span>The Next-Generation Influencer Marketplace</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              lineHeight: 1.15,
              fontWeight: 800,
              marginBottom: '20px',
              letterSpacing: '-0.03em'
            }}
          >
            Where Brands Meet <span style={{ color: 'var(--primary)' }}>Influence</span>.
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: 'var(--text-muted)',
              lineHeight: 1.6,
              marginBottom: '36px',
              maxWidth: '720px',
              margin: '0 auto 36px'
            }}
          >
            CollabBridge simplifies high-impact influencer marketing. Discover verified creators, launch targeted campaigns, streamline proposals, and track collaborations from pitch to review.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started
              <ArrowRight size={18} />
            </Link>
            <Link to="/campaigns" className="btn btn-secondary btn-lg">
              Explore Campaigns
            </Link>
          </div>

          {/* Social Proof Badges */}
          <div
            style={{
              marginTop: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '32px',
              flexWrap: 'wrap',
              color: 'var(--text-muted)',
              fontSize: '0.9rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ShieldCheck size={18} color="var(--primary)" />
              <span>Verified Creator Data</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Star size={18} color="#d97706" fill="#d97706" />
              <span>Transparent Brand Reviews</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--primary)" />
              <span>Zero-Friction Proposals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section id="features" style={{ padding: '80px 0', backgroundColor: 'var(--bg-card)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 54px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>Everything You Need for Scaled Collaborations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Built specifically for modern marketing teams and ambitious creators to collaborate seamlessly.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '30px'
            }}
          >
            <div className="card" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--primary-light)',
                  color: 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Influencer Discovery</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Search and filter creators across multiple niches, follower ranges, engagement metrics, location, and collaboration rates with verified audience stats.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#ecfdf5',
                  color: 'var(--success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <Megaphone size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Campaign Management</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Create structured campaigns, define clear deliverable requirements, establish budgets, manage drafts, and evaluate inbound influencer proposals in real time.
              </p>
            </div>

            <div className="card" style={{ padding: '32px' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#f3e8ff',
                  color: '#9333ea',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}
              >
                <TrendingUp size={28} />
              </div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>Collaboration Tracking</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.95rem' }}>
                Track active partnerships from pending submission through brand approval, mark deliverables completed, and leave authenticated reviews.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 60px' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '12px' }}>How CollabBridge Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
              Four simple steps to launch your next high-converting influencer campaign.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '24px'
            }}
          >
            {[
              {
                step: '01',
                title: 'Create Your Profile',
                desc: 'Brands set up their marketing profiles. Creators showcase their niche, audience metrics, and rates.'
              },
              {
                step: '02',
                title: 'Publish or Browse',
                desc: 'Brands post campaign briefs with defined budgets; creators browse matching marketplace listings.'
              },
              {
                step: '03',
                title: 'Review & Collaborate',
                desc: 'Creators apply with customized pitches; brands accept ideal applicants and commence collaborations.'
              },
              {
                step: '04',
                title: 'Deliver & Review',
                desc: 'Collaborations are marked completed upon content delivery, unlocking verified brand reviews.'
              }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '28px',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <div
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    color: 'var(--primary)',
                    opacity: 0.25,
                    marginBottom: '10px'
                  }}
                >
                  {item.step}
                </div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '8px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits for Brands and Influencers */}
      <section style={{ padding: '80px 0', backgroundColor: 'var(--bg-card)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
              gap: '40px'
            }}
          >
            {/* For Brands */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '40px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Award size={26} color="var(--primary)" />
                <h3 style={{ fontSize: '1.5rem' }}>For Brands</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Targeted search by niche, engagement rate, and verified follower count',
                  'Post campaign briefs with deadlines and fixed or negotiable budgets',
                  'Compare creator proposals side-by-side with profile analytics',
                  'Track active collaborations and manage all applications in one dashboard',
                  'Leave authentic ratings that build trust across the creator ecosystem'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={18} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '28px' }}>
                <Link to="/register" className="btn btn-primary">
                  Start as a Brand
                </Link>
              </div>
            </div>

            {/* For Creators */}
            <div
              style={{
                backgroundColor: 'var(--bg-page)',
                padding: '40px',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <Sparkles size={26} color="var(--secondary)" />
                <h3 style={{ fontSize: '1.5rem' }}>For Creators</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  'Showcase your portfolio, social links, and engagement rates',
                  'Browse paid campaign opportunities filtered by budget and category',
                  'Submit tailored pitch proposals and propose custom rates',
                  'Track the exact status of your applications in your creator portal',
                  'Collect verified 5-star reviews to command higher brand partnership rates'
                ].map((text, i) => (
                  <li key={i} style={{ display: 'flex', gap: '10px', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                    <CheckCircle2 size={18} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: '28px' }}>
                <Link to="/register" className="btn btn-outline">
                  Join as a Creator
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '80px 0', background: 'var(--primary-gradient)', color: 'white', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ fontSize: '2.4rem', color: 'white', marginBottom: '16px' }}>
            Ready to Supercharge Your Partnerships?
          </h2>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '32px', lineHeight: '1.6' }}>
            Join thousands of brands and influencers growing together on CollabBridge. Start discovering partners today.
          </p>
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-secondary btn-lg" style={{ background: 'white', color: 'var(--primary)' }}>
              Create Free Account
            </Link>
            <Link to="/influencers" className="btn btn-outline btn-lg" style={{ borderColor: 'white', color: 'white' }}>
              Explore Creators
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
