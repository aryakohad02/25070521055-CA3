import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public & Marketplace Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import InfluencerDirectory from './pages/InfluencerDirectory';
import InfluencerProfileDetail from './pages/InfluencerProfileDetail';
import CampaignMarketplace from './pages/CampaignMarketplace';
import CampaignDetail from './pages/CampaignDetail';

// Brand Pages
import BrandDashboard from './pages/BrandDashboard';
import BrandCampaignsPage from './pages/BrandCampaignsPage';
import CreateCampaignPage from './pages/CreateCampaignPage';
import EditCampaignPage from './pages/EditCampaignPage';

// Influencer Pages
import InfluencerDashboard from './pages/InfluencerDashboard';
import MyApplicationsPage from './pages/MyApplicationsPage';

// Shared Settings Page
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Routes>
      {/* Public Pages with Top Navigation and Footer */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/influencers" element={<InfluencerDirectory />} />
        <Route path="/influencers/:id" element={<InfluencerProfileDetail />} />
        <Route path="/campaigns" element={<CampaignMarketplace />} />
        <Route path="/campaigns/:id" element={<CampaignDetail />} />
      </Route>

      {/* Brand Dashboard Routes (Protected) */}
      <Route element={<DashboardLayout allowedRole="brand" />}>
        <Route path="/brand/dashboard" element={<BrandDashboard />} />
        <Route path="/brand/campaigns" element={<BrandCampaignsPage />} />
        <Route path="/brand/campaigns/create" element={<CreateCampaignPage />} />
        <Route path="/brand/campaigns/edit/:id" element={<EditCampaignPage />} />
      </Route>

      {/* Influencer Dashboard Routes (Protected) */}
      <Route element={<DashboardLayout allowedRole="influencer" />}>
        <Route path="/influencer/dashboard" element={<InfluencerDashboard />} />
        <Route path="/influencer/applications" element={<MyApplicationsPage />} />
      </Route>

      {/* Shared Settings Route */}
      <Route element={<DashboardLayout />}>
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
