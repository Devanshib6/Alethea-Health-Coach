import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import BasicInfoPage from './pages/profile/BasicInfoPage';
import GoalsPage from './pages/profile/GoalsPage';
import PreferencesPage from './pages/profile/PreferencesPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Profile Setup Routes */}
          <Route path="/profile/basic-info" element={
            <ProtectedRoute>
              <BasicInfoPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/goals" element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          } />
          <Route path="/profile/preferences" element={
            <ProtectedRoute>
              <PreferencesPage />
            </ProtectedRoute>
          } />

          {/* Dashboard placeholder */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-2xl font-bold text-green-600">
                  Dashboard Coming Soon! ✅
                </h1>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;