import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
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

// Check if user has completed profile setup
const isProfileComplete = (user) => {
    return user && user.age && user.height && user.weight && user.goal && user.diet_type
}

// Protected route with profile completion check
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth()
    
    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" />
    
    if (!isProfileComplete(user)) {
        return <Navigate to="/basic-info" />
    }
    
    return children
}

// Admin route
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" />
    if (user.role !== 'admin') return <Navigate to="/dashboard" />
    return children
}

// Simple auth route
const AuthRoute = ({ children }) => {
    const { user, loading } = useAuth()
    if (loading) return <div>Loading...</div>
    if (!user) return <Navigate to="/login" />
    return children
}

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Profile Setup Routes */}
            <Route path="/basic-info" element={
                <AuthRoute>
                    <BasicInfoPage />
                </AuthRoute>
            } />
            <Route path="/goals-health" element={
                <AuthRoute>
                    <GoalsHealthPage />
                </AuthRoute>
            } />
            <Route path="/dietary-preferences" element={
                <AuthRoute>
                    <DietaryPreferencesPage />
                </AuthRoute>
            } />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="/log-meal" element={
                <ProtectedRoute>
                    <LogMealPage />
                </ProtectedRoute>
            } />
            <Route path="/meal-history" element={
                <ProtectedRoute>
                    <MealHistoryPage />
                </ProtectedRoute>
            } />
            <Route path="/diet-plan" element={
                <ProtectedRoute>
                    <DietPlanPage />
                </ProtectedRoute>
            } />
            <Route path="/weekly-meal-plan" element={
                <ProtectedRoute>
                    <WeeklyMealPlanPage />
                </ProtectedRoute>
            } />
            <Route path="/health-prediction" element={
                <ProtectedRoute>
                    <HealthPredictionPage />
                </ProtectedRoute>
            } />
            <Route path="/health-report" element={
                <ProtectedRoute>
                    <HealthReportPage />
                </ProtectedRoute>
            } />
            <Route path="/profile-settings" element={
                <ProtectedRoute>
                    <ProfileSettingsPage />
                </ProtectedRoute>
            } />
            <Route path="/app-settings" element={
                <ProtectedRoute>
                    <AppSettingsPage />
                </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
                <AdminRoute>
                    <AdminDashboardPage />
                </AdminRoute>
            } />
            <Route path="/admin/users" element={
                <AdminRoute>
                    <AdminUserManagementPage />
                </AdminRoute>
            } />
            <Route path="/admin/food-database" element={
                <AdminRoute>
                    <FoodDatabasePage />
                </AdminRoute>
            } />
            <Route path="/admin/analytics" element={
                <AdminRoute>
                    <SystemAnalyticsPage />
                </AdminRoute>
            } />
        </Routes>
    )
}

export default AppRoutes