import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'
import API from '../services/authService'
import { 
  FiPlus, FiList, FiCpu, FiActivity, FiCalendar, 
  FiTarget, FiAward, FiTrendingUp, FiTrendingDown, 
  FiMinus, FiLogOut, FiMenu, FiX, FiBarChart2,
  FiUser, FiSettings, FiHeart, FiCoffee, FiBattery
} from 'react-icons/fi'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const DashboardPage = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recentMeals, setRecentMeals] = useState([])
  const [healthRecords, setHealthRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  // Fetch real user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user profile
        const profileResponse = await API.get('/users/me')
        setUserProfile(profileResponse.data)
        console.log('User profile:', profileResponse.data)
        
        // Fetch recent meals (will implement later)
        // const mealsResponse = await API.get('/meals')
        // setRecentMeals(mealsResponse.data)
        
        // Fetch health records (will implement later)
        // const healthResponse = await API.get('/health/records')
        // setHealthRecords(healthResponse.data)
        
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        setLoading(false)
      }
    }
    
    fetchUserData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  // Calculate BMI
  const calculateBMI = (weight, height) => {
    if (!weight || !height) return null
    const heightInMeters = height / 100
    return (weight / (heightInMeters * heightInMeters)).toFixed(1)
  }

  // Get BMI status
  const getBMIStatus = (bmi) => {
    if (!bmi) return 'Not available'
    if (bmi < 18.5) return 'Underweight'
    if (bmi >= 18.5 && bmi < 25) return 'Normal'
    if (bmi >= 25 && bmi < 30) return 'Overweight'
    return 'Obese'
  }

  const bmi = calculateBMI(userProfile?.weight, userProfile?.height)
  const bmiStatus = getBMIStatus(bmi)

  // Today's nutrition summary - using real data or defaults
  const todaysNutrition = {
    calories: { current: 0, target: 2000, percentage: 0 },
    protein: { current: 0, target: 120, percentage: 0 },
    carbs: { current: 0, target: 250, percentage: 0 },
    fats: { current: 0, target: 65, percentage: 0 },
  }

  const healthStats = {
    currentWeight: userProfile?.weight || 0,
    targetWeight: userProfile?.goal_weight || 65,
    bmi: bmi || 0,
    bmiStatus: bmiStatus,
    streak: 0,
    mealsLogged: 0
  }

  const quickActions = [
    { icon: FiPlus, label: 'Log Meal', path: '/log-meal', color: colors.peach },
    { icon: FiList, label: 'Meal History', path: '/meal-history', color: colors.taupe },
    { icon: FiCpu, label: 'AI Diet Plan', path: '/diet-plan', color: colors.dark },
    { icon: FiActivity, label: 'Health Analysis', path: '/health-prediction', color: colors.peach },
  ]

  const navLinks = [
    { icon: FiUser, label: 'Profile', path: '/profile-settings' },
    { icon: FiSettings, label: 'Settings', path: '/app-settings' },
    { icon: FiHeart, label: 'Health Reports', path: '/health-report' },
    { icon: FiCalendar, label: 'Weekly Plan', path: '/weekly-meal-plan' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, border: `3px solid ${colors.peach}`, borderTopColor: colors.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: colors.taupe }}>Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.white, fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
      )}
      
      {/* Sidebar */}
      <aside style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 260,
        height: '100%',
        backgroundColor: colors.dark,
        transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        zIndex: 50,
        overflowY: 'auto'
      }}>
        <div style={{ padding: '24px 20px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
            <div style={{ backgroundColor: colors.peach, width: 35, height: 35, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: colors.dark, fontWeight: 'bold', fontSize: 18 }}>A</span>
            </div>
            <span style={{ color: colors.white, fontWeight: 'bold', fontSize: 18 }}>Alethea</span>
          </div>
          
          {/* User Info */}
          <div style={{ backgroundColor: colors.taupe, padding: 15, borderRadius: 10, marginBottom: 30 }}>
            <p style={{ color: colors.white, fontSize: 14, fontWeight: 500 }}>{userProfile?.full_name || user?.full_name || user?.email}</p>
            <p style={{ color: colors.peach, fontSize: 12, marginTop: 5 }}>{userProfile?.role || 'Member'}</p>
          </div>
          
          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {navLinks.map((link, i) => (
              <Link key={i} to={link.path} style={{ display: 'flex', alignItems: 'center', gap: 12, color: colors.taupe, textDecoration: 'none', padding: '10px 12px', borderRadius: 8, transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.peach; e.currentTarget.style.color = colors.dark }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = colors.taupe }}>
                <link.icon size={18} />
                <span style={{ fontSize: 14 }}>{link.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Logout Button */}
          <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 12, backgroundColor: 'transparent', border: `1px solid ${colors.taupe}`, color: colors.taupe, padding: '10px 12px', borderRadius: 8, width: '100%', marginTop: 40, cursor: 'pointer', fontSize: 14 }}>
            <FiLogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main style={{ marginLeft: sidebarOpen ? 0 : 0, transition: 'margin-left 0.3s ease' }}>
        
        {/* Header */}
        <nav style={{ backgroundColor: colors.white, borderBottom: `1px solid ${colors.peach}`, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 30 }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: colors.dark }}>
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
            <span style={{ fontSize: 13, color: colors.taupe }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
            <div style={{ width: 40, height: 40, backgroundColor: colors.peach, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: colors.dark, fontWeight: 'bold' }}>{userProfile?.full_name?.charAt(0) || user?.full_name?.charAt(0) || user?.email?.charAt(0)}</span>
            </div>
          </div>
        </nav>
        
        {/* Dashboard Content */}
        <div style={{ padding: '24px' }}>
          
          {/* Welcome Section */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ color: colors.dark, fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
              Welcome back, {userProfile?.full_name?.split(' ')[0] || 'User'}! 👋
            </h1>
            <p style={{ color: colors.taupe }}>Here's your health summary for today</p>
          </div>
          
          {/* Quick Actions */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
            {quickActions.map((action, i) => (
              <Link key={i} to={action.path} style={{ textDecoration: 'none' }}>
                <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 12, padding: '20px', textAlign: 'center', transition: 'all 0.2s', cursor: 'pointer' }}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = colors.peach; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = colors.white; e.currentTarget.style.transform = 'translateY(0)' }}>
                  <action.icon size={28} color={action.color} style={{ marginBottom: 12 }} />
                  <h3 style={{ color: colors.dark, fontSize: 14, fontWeight: 600 }}>{action.label}</h3>
                </div>
              </Link>
            ))}
          </div>
          
          {/* Two Column Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24, marginBottom: 32 }}>
            
            {/* Nutrition Summary */}
            <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: colors.dark, fontSize: 18, fontWeight: 600 }}>Today's Nutrition</h2>
                <FiBarChart2 color={colors.peach} size={20} />
              </div>
              
              {Object.entries(todaysNutrition).map(([key, value]) => (
                <div key={key} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ color: colors.taupe, fontSize: 13, textTransform: 'capitalize' }}>{key}</span>
                    <span style={{ color: colors.dark, fontWeight: 500, fontSize: 13 }}>
                      {value.current} / {value.target} {key === 'calories' ? 'kcal' : 'g'}
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#f0f0f0', borderRadius: 10, overflow: 'hidden', height: 8 }}>
                    <div style={{ width: `${value.percentage}%`, backgroundColor: colors.peach, height: '100%', borderRadius: 10 }} />
                  </div>
                </div>
              ))}
              
              <p style={{ textAlign: 'center', marginTop: 20, color: colors.taupe, fontSize: 13 }}>
                No meals logged today. Click "Log Meal" to get started!
              </p>
            </div>
            
            {/* Health Stats Overview - USING REAL USER DATA */}
            <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: colors.dark, fontSize: 18, fontWeight: 600 }}>Your Health Overview</h2>
                <FiHeart color={colors.peach} size={20} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
                <div>
                  <p style={{ color: colors.taupe, fontSize: 12 }}>Current Weight</p>
                  <p style={{ color: colors.dark, fontSize: 28, fontWeight: 700 }}>{healthStats.currentWeight || '—'} kg</p>
                  <p style={{ color: colors.taupe, fontSize: 11 }}>Target: {healthStats.targetWeight || '—'} kg</p>
                </div>
                <div>
                  <p style={{ color: colors.taupe, fontSize: 12 }}>BMI</p>
                  <p style={{ color: colors.dark, fontSize: 28, fontWeight: 700 }}>{healthStats.bmi || '—'}</p>
                  <p style={{ color: colors.peach, fontSize: 11 }}>{healthStats.bmiStatus}</p>
                </div>
              </div>
              
              {/* Display other user info */}
              <div style={{ borderTop: `1px solid ${colors.peach}`, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: colors.taupe, fontSize: 13 }}>Height</span>
                  <span style={{ color: colors.dark, fontWeight: 500 }}>{userProfile?.height || '—'} cm</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ color: colors.taupe, fontSize: 13 }}>Age</span>
                  <span style={{ color: colors.dark, fontWeight: 500 }}>{userProfile?.age || '—'} years</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: colors.taupe, fontSize: 13 }}>Gender</span>
                  <span style={{ color: colors.dark, fontWeight: 500 }}>{userProfile?.gender ? userProfile.gender.charAt(0).toUpperCase() + userProfile.gender.slice(1) : '—'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Meals & Health Records */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 24 }}>
            
            {/* Recent Meals */}
            <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: colors.dark, fontSize: 18, fontWeight: 600 }}>Recent Meals</h2>
                <Link to="/meal-history" style={{ color: colors.peach, fontSize: 12, textDecoration: 'none' }}>View all →</Link>
              </div>
              
              {recentMeals.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <FiCoffee size={40} color={colors.taupe} style={{ marginBottom: 12 }} />
                  <p style={{ color: colors.taupe, fontSize: 14 }}>No meals logged yet</p>
                  <Link to="/log-meal" style={{ color: colors.peach, fontSize: 13, textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>
                    Log your first meal →
                  </Link>
                </div>
              ) : (
                recentMeals.map(meal => (
                  <div key={meal.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${colors.peach}` }}>
                    <div>
                      <p style={{ color: colors.dark, fontWeight: 500, marginBottom: 4 }}>{meal.meal_name}</p>
                      <p style={{ color: colors.taupe, fontSize: 12 }}>{meal.meal_type} • {new Date(meal.logged_at).toLocaleTimeString()}</p>
                    </div>
                    <p style={{ color: colors.peach, fontWeight: 600 }}>{meal.calories} kcal</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Health Goal Progress */}
            <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <h2 style={{ color: colors.dark, fontSize: 18, fontWeight: 600 }}>Your Health Goal</h2>
                <FiTarget color={colors.peach} size={20} />
              </div>
              
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <p style={{ color: colors.dark, fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
                  {userProfile?.goal === 'lose_weight' ? '🎯 Lose Weight' : 
                   userProfile?.goal === 'gain_muscle' ? '💪 Gain Muscle' :
                   userProfile?.goal === 'maintain_weight' ? '⚖️ Maintain Weight' :
                   userProfile?.goal === 'improve_health' ? '❤️ Improve Health' :
                   userProfile?.goal === 'increase_energy' ? '⚡ Increase Energy' : 'Set a goal'}
                </p>
                <p style={{ color: colors.taupe, fontSize: 13 }}>
                  Activity Level: {userProfile?.activity_level ? 
                    userProfile.activity_level.charAt(0).toUpperCase() + userProfile.activity_level.slice(1) : 'Not set'}
                </p>
              </div>
              
              {userProfile?.goal === 'lose_weight' && healthStats.currentWeight > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ color: colors.taupe, fontSize: 13 }}>Progress to goal</span>
                    <span style={{ color: colors.dark, fontSize: 13, fontWeight: 500 }}>
                      {Math.max(0, Math.min(100, ((healthStats.currentWeight - healthStats.targetWeight) / (healthStats.currentWeight - healthStats.targetWeight)) * 100))}%
                    </span>
                  </div>
                  <div style={{ backgroundColor: '#f0f0f0', borderRadius: 10, overflow: 'hidden', height: 8 }}>
                    <div style={{ width: '30%', backgroundColor: colors.peach, height: '100%', borderRadius: 10 }} />
                  </div>
                </div>
              )}
              
              <Link to="/goals-health" style={{ display: 'block', textAlign: 'center', marginTop: 20, color: colors.peach, fontSize: 13, textDecoration: 'none' }}>
                Update your goals →
              </Link>
            </div>
          </div>
          
          {/* AI Insight Card */}
          <div style={{ marginTop: 32, backgroundColor: colors.dark, borderRadius: 16, padding: 24, background: `linear-gradient(135deg, ${colors.dark} 0%, ${colors.taupe} 100%)` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <FiCpu size={24} color={colors.peach} />
              <h3 style={{ color: colors.white, fontSize: 16, fontWeight: 600 }}>AI Health Insight</h3>
            </div>
            <p style={{ color: colors.taupe, fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              {userProfile?.goal === 'lose_weight' 
                ? `Based on your profile, you're aiming to lose weight. Start by logging your daily meals to track calorie intake. We'll provide personalized recommendations soon!`
                : userProfile?.goal === 'gain_muscle'
                ? `Great goal to gain muscle! Focus on protein-rich foods and strength training. Log your meals to track your protein intake.`
                : `Welcome to Alethea! Complete your profile setup and start logging meals to receive personalized AI recommendations.`}
            </p>
            <Link to="/diet-plan" style={{ color: colors.peach, fontSize: 13, textDecoration: 'none', fontWeight: 500 }}>
              View personalized diet plan →
            </Link>
          </div>
          
        </div>
      </main>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default DashboardPage