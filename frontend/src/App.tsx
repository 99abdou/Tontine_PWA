import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { TontinesPage } from './pages/Tontines';
import { TontineCreatePage } from './pages/TontineCreate';
import { TontineDetailPage } from './pages/TontineDetail';
import { MembersPage, MemberDetailPage } from './pages/Members';
import { ContributionsPage } from './pages/Contributions';
import { PayoutsPage } from './pages/Payouts';
import { TransactionsPage } from './pages/Transactions';
import { NotificationsPage } from './pages/Notifications';
import { ReportsPage } from './pages/Reports';
import { ParticipantHomePage } from './pages/ParticipantHome';
import { AdminDashboardPage } from './pages/AdminDashboard';
import { SettingsPage } from './pages/Settings';
import { AppLayout } from './components/layout/AppLayout';
import { ToastContainer } from './components/ui/Toast';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Authenticated Routes wrapped in AppLayout */}
        <Route
          path="/dashboard"
          element={
            <AppLayout>
              <DashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/tontines"
          element={
            <AppLayout>
              <TontinesPage />
            </AppLayout>
          }
        />
        <Route
          path="/tontines/create"
          element={
            <AppLayout>
              <TontineCreatePage />
            </AppLayout>
          }
        />
        <Route
          path="/tontines/:id"
          element={
            <AppLayout>
              <TontineDetailPage />
            </AppLayout>
          }
        />
        <Route
          path="/members"
          element={
            <AppLayout>
              <MembersPage />
            </AppLayout>
          }
        />
        <Route
          path="/members/:id"
          element={
            <AppLayout>
              <MemberDetailPage />
            </AppLayout>
          }
        />
        <Route
          path="/contributions"
          element={
            <AppLayout>
              <ContributionsPage />
            </AppLayout>
          }
        />
        <Route
          path="/payouts"
          element={
            <AppLayout>
              <PayoutsPage />
            </AppLayout>
          }
        />
        <Route
          path="/transactions"
          element={
            <AppLayout>
              <TransactionsPage />
            </AppLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <AppLayout>
              <NotificationsPage />
            </AppLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <AppLayout>
              <ReportsPage />
            </AppLayout>
          }
        />
        <Route
          path="/participant"
          element={
            <AppLayout>
              <ParticipantHomePage />
            </AppLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <AppLayout>
              <AdminDashboardPage />
            </AppLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <AppLayout>
              <SettingsPage />
            </AppLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
