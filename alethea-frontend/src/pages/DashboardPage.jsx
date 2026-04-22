import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMeals } from '../context/MealContext'
import API from '../services/authService'
import WaterTracker from '../components/WaterTracker'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const DashboardPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { meals, fetchMeals } = useMeals()
  const [stats, setStats] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0,
    mealsByType: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    }
  })
  const [recentMeals, setRecentMeals] = useState([])
  const [healthScore, setHealthScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Log Meal', path: '/log-meal' },
    { label: 'AI Snap', path: '/ai-snap' },
    { label: 'AI Coach', path: '/virtual-coach' },
    { label: 'Diet Plan', path: '/diet-plan' },
    { label: 'Weekly Meal Plan', path: '/weekly-meal-plan' },
    { label: 'Health Prediction', path: '/health-prediction' },
    { label: 'Health Report', path: '/health-report' },
    { label: 'Meal History', path: '/meal-history' },
    { label: 'Profile Settings', path: '/profile-settings' },
    { label: 'App Settings', path: '/app-settings' },  // Added App Settings
  ]

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await fetchMeals()
      await fetchHealthScore()
      setLoading(false)
    }
    loadData()
  }, [])

  useEffect(() => {
    if (meals && meals.length > 0) {
      calculateStats()
      setRecentMeals(meals.slice(0, 5))
    } else if (meals && meals.length === 0) {
      setLoading(false)
    }
  }, [meals])

  const fetchHealthScore = async () => {
    try {
      const response = await API.get('/health/predict')
      if (response.data && response.data.prediction) {
        setHealthScore(response.data.prediction)
      }
    } catch (error) {
      console.error('Error fetching health score:', error)
    }
  }

  const calculateStats = () => {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let mealsByType = {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snack: 0
    }

    if (meals && meals.length > 0) {
      meals.forEach(meal => {
        totalCalories += meal.calories || 0
        totalProtein += meal.protein || 0
        totalCarbs += meal.carbs || 0
        totalFat += meal.fat || 0
        
        const mealType = (meal.meal_type || '').toLowerCase()
        if (mealsByType.hasOwnProperty(mealType)) {
          mealsByType[mealType]++
        }
      })
    }

    setStats({
      totalCalories,
      totalProtein,
      totalCarbs,
      totalFat,
      mealsByType
    })
  }

  const getMealTypeName = (type) => {
    const lowerType = (type || '').toLowerCase()
    switch(lowerType) {
      case 'breakfast':
      case 'morning':
        return 'Breakfast'
      case 'lunch': return 'Lunch'
      case 'dinner': return 'Dinner'
      case 'snack': return 'Snack'
      default: return type || 'Meal'
    }
  }

  const getHealthScoreColor = (score) => {
    if (score >= 80) return '#22c55e'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: c.taupe }}>Loading your dashboard...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif", display: 'flex' }}>
      
      {/* Sidebar Navigation */}
      <div style={{
        width: sidebarCollapsed ? 80 : 260,
        backgroundColor: c.dark,
        minHeight: '100vh',
        transition: 'width 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? '24px 0' : '24px 20px', borderBottom: `1px solid ${c.taupe}30`, marginBottom: 24 }}>
          <Link to="/" style={{ color: c.white, fontWeight: 700, fontSize: sidebarCollapsed ? 20 : 22, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', display: 'block', textAlign: sidebarCollapsed ? 'center' : 'left' }}>
            {sidebarCollapsed ? 'A' : 'Alethea'}
          </Link>
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            right: -12,
            top: 80,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: c.peach,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.dark,
            fontSize: 12,
          }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '14px 0' : '12px 20px',
                margin: '4px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                backgroundColor: location.pathname === item.path ? `${c.peach}20` : 'transparent',
                color: location.pathname === item.path ? c.peach : c.taupe,
                transition: 'all 0.2s',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = `${c.white}10`
                  e.currentTarget.style.color = c.white
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = c.taupe
                }
              }}
            >
              {!sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              {sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label.charAt(0)}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ padding: sidebarCollapsed ? '20px 0' : '20px', borderTop: `1px solid ${c.taupe}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: c.peach,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: c.dark,
            }}>
              {user?.full_name?.charAt(0) || 'U'}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1 }}>
                <p style={{ color: c.white, fontWeight: 600, margin: 0, fontSize: 13 }}>{user?.full_name?.split(' ')[0] || 'User'}</p>
                <p style={{ color: c.taupe, fontSize: 11, margin: '4px 0 0' }}>{user?.role === 'admin' ? 'Admin' : 'Member'}</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '10px',
                backgroundColor: 'transparent',
                border: `1px solid ${c.taupe}40`,
                borderRadius: 8,
                color: c.taupe,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${c.peach}20`
                e.currentTarget.style.borderColor = c.peach
                e.currentTarget.style.color = c.peach
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = `${c.taupe}40`
                e.currentTarget.style.color = c.taupe
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 80 : 260,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
      }}>
        {/* Header */}
        <div style={{ backgroundColor: c.white, padding: '24px 32px', borderBottom: `1px solid ${c.peach}15` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: 0 }}>
                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
              </h1>
              <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>
                Track your nutrition and stay healthy
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => navigate('/ai-snap')}
                style={{ 
                  backgroundColor: '#8b5cf6', 
                  color: c.white, 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: 40, 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#7c3aed'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8b5cf6'}
              >
                AI Snap
              </button>
              <button 
                onClick={() => navigate('/log-meal')}
                style={{ 
                  backgroundColor: c.peach, 
                  color: c.dark, 
                  border: 'none', 
                  padding: '12px 24px', 
                  borderRadius: 40, 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c49080'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.peach}
              >
                + Log Meal
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px' }}>

          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { label: 'Total Calories', value: Math.round(stats.totalCalories), unit: 'kcal', color: c.peach },
              { label: 'Total Protein', value: Math.round(stats.totalProtein), unit: 'g', color: c.taupe },
              { label: 'Total Carbs', value: Math.round(stats.totalCarbs), unit: 'g', color: c.dark },
              { label: 'Total Fat', value: Math.round(stats.totalFat), unit: 'g', color: '#b45309' },
            ].map((stat, i) => (
              <div key={i} style={{ 
                backgroundColor: c.white, 
                borderRadius: 20, 
                padding: 24, 
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: `1px solid ${c.peach}15`,
              }}>
                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{stat.label}</p>
                <p style={{ color: stat.color, fontSize: 36, fontWeight: 800, margin: '8px 0 0', lineHeight: 1 }}>{stat.value}</p>
                <p style={{ color: c.taupe, fontSize: 12, marginTop: 8 }}>{stat.unit}</p>
              </div>
            ))}
          </div>

          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 32 }}>
            
            {/* Left Column */}
            <div>
              {/* Water Tracker */}
              <WaterTracker />

              {/* Meal Distribution */}
              <div style={{ backgroundColor: c.white, borderRadius: 20, padding: 24, marginBottom: 32, border: `1px solid ${c.peach}15` }}>
                <h3 style={{ color: c.dark, fontWeight: 700, marginBottom: 20, fontSize: 18 }}>Meal Distribution</h3>
                {meals && meals.length === 0 ? (
                  <p style={{ color: c.taupe, textAlign: 'center', padding: '30px 0' }}>No meals logged yet</p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {Object.entries(stats.mealsByType).map(([type, count]) => (
                      <div key={type}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ color: c.taupe, fontSize: 13 }}>
                            {getMealTypeName(type)}
                          </span>
                          <span style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{count} meals</span>
                        </div>
                        <div style={{ height: 8, backgroundColor: `${c.peach}20`, borderRadius: 4, overflow: 'hidden' }}>
                          <div style={{ 
                            height: 8, 
                            backgroundColor: c.peach, 
                            borderRadius: 4, 
                            width: meals.length ? `${(count / meals.length) * 100}%` : '0%',
                            transition: 'width 0.5s'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Health Score Card */}
              {healthScore && healthScore.health_score !== undefined && (
                <div style={{ backgroundColor: c.white, borderRadius: 20, padding: 24, border: `1px solid ${c.peach}15` }}>
                  <h3 style={{ color: c.dark, fontWeight: 700, marginBottom: 20, fontSize: 18 }}>Health Score</h3>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ 
                      width: 130, 
                      height: 130, 
                      borderRadius: '50%', 
                      border: `8px solid ${getHealthScoreColor(healthScore.health_score)}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 16px',
                      backgroundColor: `${getHealthScoreColor(healthScore.health_score)}10`,
                    }}>
                      <span style={{ fontSize: 42, fontWeight: 900, color: getHealthScoreColor(healthScore.health_score) }}>
                        {healthScore.health_score}
                      </span>
                    </div>
                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                      {healthScore.health_score >= 80 ? 'Excellent' : healthScore.health_score >= 60 ? 'Good' : 'Needs Attention'}
                    </p>
                    <p style={{ color: c.taupe, fontSize: 13 }}>
                      Based on {healthScore.total_records || 0} health records
                    </p>
                    <button 
                      onClick={() => navigate('/health-prediction')}
                      style={{ 
                        marginTop: 16, 
                        backgroundColor: 'transparent', 
                        border: `1.5px solid ${c.peach}`, 
                        color: c.taupe, 
                        padding: '8px 24px', 
                        borderRadius: 40, 
                        cursor: 'pointer', 
                        fontSize: 13,
                        fontWeight: 500,
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = `${c.peach}10`
                        e.currentTarget.style.borderColor = c.dark
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                        e.currentTarget.style.borderColor = c.peach
                      }}
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Recent Meals */}
            <div>
              <div style={{ backgroundColor: c.white, borderRadius: 20, padding: 24, border: `1px solid ${c.peach}15` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <h3 style={{ color: c.dark, fontWeight: 700, margin: 0, fontSize: 18 }}>Recent Meals</h3>
                  <button 
                    onClick={() => navigate('/meal-history')}
                    style={{ color: c.peach, fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                    View All →
                  </button>
                </div>
                
                {recentMeals.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '50px 20px' }}>
                    <p style={{ color: c.taupe, fontSize: 14, marginBottom: 20 }}>No meals logged yet</p>
                    <button 
                      onClick={() => navigate('/log-meal')}
                      style={{ 
                        backgroundColor: c.dark, 
                        color: c.white, 
                        border: 'none', 
                        padding: '12px 28px', 
                        borderRadius: 40, 
                        cursor: 'pointer', 
                        fontSize: 13,
                        fontWeight: 600,
                      }}>
                      Log Your First Meal
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                    {recentMeals.map((meal, i) => (
                      <div key={i} style={{ borderBottom: i < recentMeals.length - 1 ? `1px solid ${c.peach}15` : 'none', paddingBottom: i < recentMeals.length - 1 ? 16 : 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                              <span style={{ fontSize: 13, color: c.peach, fontWeight: 500 }}>
                                {getMealTypeName(meal.meal_type)}
                              </span>
                              <span style={{ fontSize: 11, color: c.taupe }}>
                                {new Date(meal.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p style={{ color: c.dark, fontWeight: 600, margin: 0, fontSize: 15 }}>{meal.food_name}</p>
                            <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
                              <span style={{ color: c.taupe, fontSize: 12 }}>{Math.round(meal.calories || 0)} kcal</span>
                              <span style={{ color: c.taupe, fontSize: 12 }}>{meal.protein || 0}g protein</span>
                              <span style={{ color: c.taupe, fontSize: 12 }}>{meal.carbs || 0}g carbs</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigate('/log-meal')}
                            style={{ 
                              color: c.peach, 
                              fontSize: 12, 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}>
                            Log Similar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions Grid with App Settings */}
              <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                <button 
                  onClick={() => navigate('/profile-settings')}
                  style={{ 
                    backgroundColor: c.white, 
                    border: `1.5px solid ${c.peach}`, 
                    borderRadius: 16, 
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${c.peach}10`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.white}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>👤</div>
                  <p style={{ color: c.dark, fontWeight: 600, margin: 0, fontSize: 13 }}>Profile</p>
                </button>
                <button 
                  onClick={() => navigate('/app-settings')}
                  style={{ 
                    backgroundColor: c.white, 
                    border: `1.5px solid ${c.peach}`, 
                    borderRadius: 16, 
                    padding: '16px',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${c.peach}10`}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.white}
                >
                  <div style={{ fontSize: 24, marginBottom: 8 }}>⚙️</div>
                  <p style={{ color: c.dark, fontWeight: 600, margin: 0, fontSize: 13 }}>App Settings</p>
                </button>
              </div>

              {/* Daily Inspiration */}
              <div style={{ marginTop: 32, backgroundColor: `${c.peach}10`, borderRadius: 20, padding: 24, border: `1px solid ${c.peach}20` }}>
                <p style={{ color: c.dark, fontWeight: 600, fontSize: 15, marginBottom: 8 }}>
                  "Small steps every day lead to big results."
                </p>
                <p style={{ color: c.taupe, fontSize: 13 }}>
                  Keep tracking your meals and stay consistent with your health goals!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage