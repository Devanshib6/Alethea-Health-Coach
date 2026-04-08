import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LandingPage from '../pages/LandingPage'
import LoginPage from '../pages/LoginPage'
import SignupPage from '../pages/SignupPage'
import DashboardPage from '../pages/DashboardPage'
import BasicInfoPage from '../pages/BasicInfoPage'
import GoalsHealthPage from '../pages/GoalsHealthPage'
import DietaryPreferencesPage from '../pages/DietaryPreferencesPage'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  return user ? children : <Navigate to="/login" />
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/basic-info" element={
          <ProtectedRoute>
            <BasicInfoPage />
          </ProtectedRoute>
        } />
        <Route path="/goals-health" element={
          <ProtectedRoute>
            <GoalsHealthPage />
          </ProtectedRoute>
        } />
        <Route path="/dietary-preferences" element={
          <ProtectedRoute>
            <DietaryPreferencesPage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes