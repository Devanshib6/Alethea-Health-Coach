import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const SystemAnalyticsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Food Database', path: '/admin/food-database' },
    { label: 'Analytics', path: '/admin/analytics' },
  ]

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchData()
  }, [user])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/stats'),
        API.get('/admin/users')
      ])
      setStats(statsRes.data)
      setUsers(usersRes.data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getGoalLabel = (goal) => {
    if (!goal) return 'Not Set'
    const labels = {
      'lose_weight': 'Lose Weight',
      'gain_muscle': 'Gain Muscle',
      'maintain': 'Maintain',
      'improve_health': 'Improve Health',
    }
    return labels[goal] || goal.replace(/_/g, ' ')
  }

  const getDietLabel = (diet) => {
    if (!diet) return 'Not Set'
    const labels = {
      'veg': 'Vegetarian',
      'eggitarian': 'Eggitarian',
      'non-veg': 'Non-Vegetarian',
    }
    return labels[diet] || diet
  }

  const getGenderLabel = (gender) => {
    if (!gender) return 'Not Set'
    return gender.charAt(0).toUpperCase() + gender.slice(1)
  }

  const getActivityLabel = (activity) => {
    if (!activity) return 'Not Set'
    const labels = {
      'sedentary': 'Sedentary',
      'light': 'Light',
      'moderate': 'Moderate',
      'active': 'Active',
      'very_active': 'Very Active',
    }
    return labels[activity] || activity
  }

  const getGoalDistribution = () => {
    const goals = {}
    users.forEach(u => {
      const goal = u.goal || 'not set'
      goals[goal] = (goals[goal] || 0) + 1
    })
    return Object.entries(goals).map(([goal, count]) => ({ goal, count }))
  }

  const getDietDistribution = () => {
    const diets = {}
    users.forEach(u => {
      const diet = u.diet_type || 'not set'
      diets[diet] = (diets[diet] || 0) + 1
    })
    return Object.entries(diets).map(([diet, count]) => ({ diet, count }))
  }

  const getGenderDistribution = () => {
    const genders = {}
    users.forEach(u => {
      const gender = u.gender || 'not set'
      genders[gender] = (genders[gender] || 0) + 1
    })
    return Object.entries(genders).map(([gender, count]) => ({ gender, count }))
  }

  const getActivityDistribution = () => {
    const activities = {}
    users.forEach(u => {
      const activity = u.activity_level || 'not set'
      activities[activity] = (activities[activity] || 0) + 1
    })
    return Object.entries(activities).map(([activity, count]) => ({ activity, count }))
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: c.taupe }}>Loading analytics...</p>
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
          <div style={{ color: c.white, fontWeight: 700, fontSize: sidebarCollapsed ? 20 : 22, letterSpacing: 2, textTransform: 'uppercase', textAlign: sidebarCollapsed ? 'center' : 'left' }}>
            {sidebarCollapsed ? 'A' : 'Alethea'}
          </div>
          {!sidebarCollapsed && (
            <div style={{ fontSize: 10, color: c.peach, marginTop: 4, letterSpacing: 1 }}>ADMIN</div>
          )}
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
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1 }}>
                <p style={{ color: c.white, fontWeight: 600, margin: 0, fontSize: 13 }}>{user?.full_name?.split(' ')[0] || 'Admin'}</p>
                <p style={{ color: c.taupe, fontSize: 11, margin: '4px 0 0' }}>Administrator</p>
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
        <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
          <div>
            <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: 0 }}>System Analytics</h1>
            <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>Overview of platform usage and user data</p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>

          {/* Overview Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { label: 'Total Users', value: stats?.total_users || 0, color: c.dark },
              { label: 'Active Users', value: stats?.active_users || 0, color: '#16a34a' },
              { label: 'Inactive', value: (stats?.total_users || 0) - (stats?.active_users || 0), color: c.taupe },
              { label: 'Admin Users', value: stats?.admin_users || 0, color: c.peach },
            ].map((stat, i) => (
              <div key={i} style={{ 
                backgroundColor: c.white, 
                borderRadius: 20, 
                padding: 24, 
                textAlign: 'center',
                border: `1px solid ${c.peach}15`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <p style={{ color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {stat.label}
                </p>
                <p style={{ color: stat.color, fontSize: 36, fontWeight: 800, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 24, marginBottom: 32 }}>

            {/* Goal Distribution */}
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 24, 
              border: `1px solid ${c.peach}15`,
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Goal Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {getGoalDistribution().map((item, i) => {
                  const percentage = users.length ? (item.count / users.length) * 100 : 0
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{getGoalLabel(item.goal)}</span>
                        <span style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{item.count}</span>
                      </div>
                      <div style={{ height: 6, backgroundColor: `${c.peach}20`, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: 6, backgroundColor: c.dark, borderRadius: 3, width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Diet Distribution */}
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 24, 
              border: `1px solid ${c.peach}15`,
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Diet Type Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {getDietDistribution().map((item, i) => {
                  const percentage = users.length ? (item.count / users.length) * 100 : 0
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: c.taupe, fontSize: 13 }}>{getDietLabel(item.diet)}</span>
                        <span style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{item.count}</span>
                      </div>
                      <div style={{ height: 6, backgroundColor: `${c.peach}20`, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: 6, backgroundColor: c.taupe, borderRadius: 3, width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Gender Distribution */}
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 24, 
              border: `1px solid ${c.peach}15`,
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Gender Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {getGenderDistribution().map((item, i) => {
                  const percentage = users.length ? (item.count / users.length) * 100 : 0
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{getGenderLabel(item.gender)}</span>
                        <span style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{item.count}</span>
                      </div>
                      <div style={{ height: 6, backgroundColor: `${c.peach}20`, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: 6, backgroundColor: c.peach, borderRadius: 3, width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Activity Distribution */}
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 24, 
              border: `1px solid ${c.peach}15`,
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Activity Level Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {getActivityDistribution().map((item, i) => {
                  const percentage = users.length ? (item.count / users.length) * 100 : 0
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ color: c.taupe, fontSize: 13, textTransform: 'capitalize' }}>{getActivityLabel(item.activity)}</span>
                        <span style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{item.count}</span>
                      </div>
                      <div style={{ height: 6, backgroundColor: `${c.peach}20`, borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: 6, backgroundColor: '#b45309', borderRadius: 3, width: `${percentage}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Recent Users Table */}
          <div style={{ 
            backgroundColor: c.white, 
            borderRadius: 20, 
            overflow: 'hidden',
            border: `1px solid ${c.peach}15`,
          }}>
            <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.peach}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, margin: 0 }}>Recent Users</h3>
              <Link to="/admin/users" style={{ color: c.peach, fontSize: 13, textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 600 }}>
                <thead>
                  <tr style={{ backgroundColor: `${c.peach}05` }}>
                    <th style={{ padding: '12px 20px', color: c.taupe, textAlign: 'left', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>Name</th>
                    <th style={{ padding: '12px 20px', color: c.taupe, textAlign: 'left', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>Email</th>
                    <th style={{ padding: '12px 20px', color: c.taupe, textAlign: 'left', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>Goal</th>
                    <th style={{ padding: '12px 20px', color: c.taupe, textAlign: 'left', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>Diet Type</th>
                    <th style={{ padding: '12px 20px', color: c.taupe, textAlign: 'left', fontWeight: 600, fontSize: 11, letterSpacing: 0.5 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 8).map((u, i) => (
                    <tr key={u.id} style={{ borderTop: `1px solid ${c.peach}10` }}>
                      <td style={{ padding: '14px 20px', color: c.dark, fontWeight: 500 }}>{u.full_name || '-'}</td>
                      <td style={{ padding: '14px 20px', color: c.taupe }}>{u.email || '-'}</td>
                      <td style={{ padding: '14px 20px', color: c.taupe, textTransform: 'capitalize' }}>{getGoalLabel(u.goal)}</td>
                      <td style={{ padding: '14px 20px', color: c.taupe }}>{getDietLabel(u.diet_type)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: 20, 
                          fontSize: 11, 
                          fontWeight: 500,
                          backgroundColor: u.is_active ? '#16a34a15' : '#dc262615',
                          color: u.is_active ? '#16a34a' : '#dc2626',
                        }}>
                          {u.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemAnalyticsPage