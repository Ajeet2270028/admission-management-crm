import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import Dashboard from './pages/dashboard/Dashboard.jsx';
import MasterSetup from './pages/master/MasterSetup.jsx';
import ProgramsPage from './pages/master/ProgramsPage.jsx';
import ApplicantsPage from './pages/applicants/ApplicantsPage.jsx';
import ApplicantDetail from './pages/applicants/ApplicantDetail.jsx';
import NewApplicantPage from './pages/applicants/NewApplicantPage.jsx';

function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={
            <PrivateRoute><Layout /></PrivateRoute>
          }>
            <Route index element={<Navigate to="/dashboard" />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="master" element={
              <PrivateRoute roles={['ADMIN']}><MasterSetup /></PrivateRoute>
            } />
            <Route path="programs" element={
              <PrivateRoute roles={['ADMIN']}><ProgramsPage /></PrivateRoute>
            } />
            <Route path="applicants" element={<ApplicantsPage />} />
            <Route path="applicants/new" element={
              <PrivateRoute roles={['ADMIN','ADMISSION_OFFICER']}><NewApplicantPage /></PrivateRoute>
            } />
            <Route path="applicants/:id" element={<ApplicantDetail />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
