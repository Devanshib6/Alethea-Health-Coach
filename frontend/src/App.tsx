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
import DashboardPage from './pages/dashboard/DashboardPage';
import AddMealPage from './pages/meals/AddMealPage';
import MealHistoryPage from './pages/meals/MealHistoryPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          <Route path="/profile/basic-info" element={
            <ProtectedRoute><BasicInfoPage /></ProtectedRoute>
          } />
          <Route path="/profile/goals" element={
            <ProtectedRoute><GoalsPage /></ProtectedRoute>
          } />
          <Route path="/profile/preferences" element={
            <ProtectedRoute><PreferencesPage /></ProtectedRoute>
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          <Route path="/meals/add" element={
            <ProtectedRoute><AddMealPage /></ProtectedRoute>
          } />
          <Route path="/meals/history" element={
            <ProtectedRoute><MealHistoryPage /></ProtectedRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;