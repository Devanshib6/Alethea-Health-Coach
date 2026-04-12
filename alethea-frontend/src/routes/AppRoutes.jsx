import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Pages
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import DashboardPage from '../pages/DashboardPage'
import BasicInfoPage from '../pages/BasicInfoPage'
import GoalsHealthPage from '../pages/GoalsHealthPage'
import DietaryPreferencesPage from '../pages/DietaryPreferencesPage'
import LogMealPage from '../pages/LogMealPage'
import MealHistoryPage from '../pages/MealHistoryPage'
import DietPlanPage from '../pages/DietPlanPage'
import WeeklyMealPlanPage from '../pages/WeeklyMealPlanPage'
import HealthPredictionPage from '../pages/HealthPredictionPage'
import HealthReportPage from '../pages/HealthReportPage'
import ProfileSettingsPage from '../pages/ProfileSettingsPage'
import AppSettingsPage from '../pages/AppSettingsPage'
import AdminDashboardPage from '../pages/AdminDashboardPage'
import AdminUserManagementPage from '../pages/AdminUserManagementPage'
import FoodDatabasePage from '../pages/FoodDatabasePage'
import SystemAnalyticsPage from '../pages/SystemAnalyticsPage'

// Protected Route Component
const ProtectedRoute = ({ children, requireProfile = false }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (requireProfile && (!user.age || !user.goal)) {
    return <Navigate to="/basic-info" replace />
  }
  
  return children
}

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

// Public Route - Landing page is always accessible
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  const pathname = window.location.pathname
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }
  
  // If user is logged in and trying to access login or signup, redirect to dashboard
  if (user && (pathname === '/login' || pathname === '/signup')) {
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />
    }
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Landing page - always accessible */}
      <Route path="/" element={<LandingPage />} />
      
      {/* Auth pages */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
      
      {/* User Routes (Protected) */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      
      {/* Profile Setup */}
      <Route path="/basic-info" element={<ProtectedRoute><BasicInfoPage /></ProtectedRoute>} />
      <Route path="/goals-health" element={<ProtectedRoute><GoalsHealthPage /></ProtectedRoute>} />
      <Route path="/dietary-preferences" element={<ProtectedRoute><DietaryPreferencesPage /></ProtectedRoute>} />
      
      {/* Meal Tracking */}
      <Route path="/log-meal" element={<ProtectedRoute><LogMealPage /></ProtectedRoute>} />
      <Route path="/meal-history" element={<ProtectedRoute><MealHistoryPage /></ProtectedRoute>} />
      
      {/* Diet Plan */}
      <Route path="/diet-plan" element={<ProtectedRoute><DietPlanPage /></ProtectedRoute>} />
      <Route path="/weekly-meal-plan" element={<ProtectedRoute><WeeklyMealPlanPage /></ProtectedRoute>} />
      
      {/* Health Analysis */}
      <Route path="/health-prediction" element={<ProtectedRoute><HealthPredictionPage /></ProtectedRoute>} />
      <Route path="/health-report" element={<ProtectedRoute><HealthReportPage /></ProtectedRoute>} />
      
      {/* Settings */}
      <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettingsPage /></ProtectedRoute>} />
      <Route path="/app-settings" element={<ProtectedRoute><AppSettingsPage /></ProtectedRoute>} />
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUserManagementPage /></AdminRoute>} />
      <Route path="/admin/food-database" element={<AdminRoute><FoodDatabasePage /></AdminRoute>} />
      <Route path="/admin/analytics" element={<AdminRoute><SystemAnalyticsPage /></AdminRoute>} />
      
      {/* 404 - Page Not Found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes