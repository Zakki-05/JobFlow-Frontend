import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './layouts/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import DashboardPage from './pages/DashboardPage';
import SuitableJobsPage from './pages/SuitableJobsPage';
import JobsPage from './pages/JobsPage';
import JobDetailPage from './pages/JobDetailPage';
import ApplicationsPage from './pages/ApplicationsPage';
import JobAnalyzerPage from './pages/JobAnalyzerPage';
import ResumeManagerPage from './pages/ResumeManagerPage';
import SkillsPage from './pages/SkillsPage';
import SkillGapPage from './pages/SkillGapPage';
import InterviewsPage from './pages/InterviewsPage';
import QuestionBankPage from './pages/QuestionBankPage';
import FollowUpsPage from './pages/FollowUpsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Marketing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Core Application Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/suitable-jobs" element={<SuitableJobsPage />} />
                <Route path="/jobs" element={<JobsPage />} />
                <Route path="/jobs/:id" element={<JobDetailPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/job-analyzer" element={<JobAnalyzerPage />} />
                <Route path="/resumes" element={<ResumeManagerPage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/skill-gap" element={<SkillGapPage />} />
                <Route path="/interviews" element={<InterviewsPage />} />
                <Route path="/questions" element={<QuestionBankPage />} />
                <Route path="/followups" element={<FollowUpsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Fallback Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
