import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout.jsx';
import DashboardLayout from '../layouts/DashboardLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import { ROLES } from '../utils/constants.js';

import HomePage from '../pages/HomePage.jsx';
import AboutPage from '../pages/AboutPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';

import ChallengesPage from '../pages/public/ChallengesPage.jsx';
import ChallengeDetailPage from '../pages/public/ChallengeDetailPage.jsx';
import UniversitiesPage from '../pages/public/UniversitiesPage.jsx';
import IndustryPage from '../pages/public/IndustryPage.jsx';
import ProjectsPage from '../pages/public/ProjectsPage.jsx';
import ProjectDetailPage from '../pages/public/ProjectDetailPage.jsx';
import ImpactPage from '../pages/public/ImpactPage.jsx';

import CitizenDashboard from '../pages/citizen/CitizenDashboard.jsx';
import CitizenChallenges from '../pages/citizen/CitizenChallenges.jsx';
import NewChallengePage from '../pages/citizen/NewChallengePage.jsx';
import CitizenChallengeDetail from '../pages/citizen/CitizenChallengeDetail.jsx';

import UniversityDashboard from '../pages/university/UniversityDashboard.jsx';
import GovernmentDashboard from '../pages/government/GovernmentDashboard.jsx';
import GovernmentAnalytics from '../pages/government/GovernmentAnalytics.jsx';
import GovernmentMap from '../pages/government/GovernmentMap.jsx';
import GovernmentChallenges from '../pages/government/GovernmentChallenges.jsx';
import GovernmentProjects from '../pages/government/GovernmentProjects.jsx';
import GovernmentImpact from '../pages/government/GovernmentImpact.jsx';
import AdminDashboard from '../pages/admin/AdminDashboard.jsx';

const citizenLinks = [
  { to: '/citizen/dashboard', label: 'Dashboard', end: true },
  { to: '/citizen/challenges', label: 'My Challenges' },
  { to: '/citizen/challenges/new', label: 'Report Challenge' },
];

const universityLinks = [
  { to: '/university/dashboard', label: 'Dashboard', end: true },
  { to: '/university/challenges', label: 'Assigned Challenges' },
  { to: '/university/projects', label: 'Projects' },
];

const governmentLinks = [
  { to: '/government/dashboard', label: 'Dashboard', end: true },
  { to: '/government/challenges', label: 'Challenges' },
  { to: '/government/projects', label: 'Projects' },
  { to: '/government/analytics', label: 'Analytics' },
  { to: '/government/map', label: 'District Map' },
  { to: '/government/impact', label: 'Impact' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', end: true },
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/challenges', label: 'Challenges' },
  { to: '/admin/audit-logs', label: 'Audit Logs' },
];

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="challenges" element={<ChallengesPage />} />
        <Route path="challenges/:id" element={<ChallengeDetailPage />} />
        <Route path="universities" element={<UniversitiesPage />} />
        <Route path="industry" element={<IndustryPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="impact" element={<ImpactPage />} />
      </Route>

      <Route path="/citizen" element={<ProtectedRoute roles={[ROLES.CITIZEN]}><DashboardLayout sidebarLinks={citizenLinks} /></ProtectedRoute>}>
        <Route path="dashboard" element={<CitizenDashboard />} />
        <Route path="challenges" element={<CitizenChallenges />} />
        <Route path="challenges/new" element={<NewChallengePage />} />
        <Route path="challenges/:id" element={<CitizenChallengeDetail />} />
      </Route>

      <Route path="/university" element={<ProtectedRoute roles={[ROLES.UNIVERSITY]}><DashboardLayout sidebarLinks={universityLinks} /></ProtectedRoute>}>
        <Route path="dashboard" element={<UniversityDashboard />} />
      </Route>

      <Route path="/government" element={<ProtectedRoute roles={[ROLES.GOVERNMENT, ROLES.ADMIN]}><DashboardLayout sidebarLinks={governmentLinks} /></ProtectedRoute>}>
        <Route path="dashboard" element={<GovernmentDashboard />} />
        <Route path="challenges" element={<GovernmentChallenges />} />
        <Route path="projects" element={<GovernmentProjects />} />
        <Route path="analytics" element={<GovernmentAnalytics />} />
        <Route path="map" element={<GovernmentMap />} />
        <Route path="impact" element={<GovernmentImpact />} />
      </Route>

      <Route path="/admin" element={<ProtectedRoute roles={[ROLES.ADMIN]}><DashboardLayout sidebarLinks={adminLinks} /></ProtectedRoute>}>
        <Route path="dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
