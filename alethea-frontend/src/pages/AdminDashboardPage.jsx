import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [recentUsers, setRecentUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchAdminData()
  }, [user])

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ])
      setStats(statsRes.data)
      setRecentUsers(usersRes.data.slice(0, 5))
    } catch (error) {
      console.error('Failed to fetch admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Food Database', path: '/admin/food-database' },
    { label: 'Analytics', path: '/admin/analytics' },
  ]

  const chartData = [
    { name: 'Mon', users: 120, meals: 450 },
    { name: 'Tue', users: 135, meals: 520 },
    { name: 'Wed', users: 148, meals: 580 },
    { name: 'Thu', users: 160, meals: 610 },
    { name: 'Fri', users: 175, meals: 650 },
    { name: 'Sat', users: 190, meals: 700 },
    { name: 'Sun', users: 210, meals: 780 },
  ]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: c.taupe }}>Loading admin dashboard...</p>
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
            <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: 0 }}>Dashboard Overview</h1>
            <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>
              Welcome back, {user?.full_name}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>
          
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            {[
              { label: 'Total Users', value: stats?.total_users || 0, color: c.dark },
              { label: 'Active Users', value: stats?.active_users || 0, color: '#16a34a' },
              { label: 'Total Meals', value: stats?.total_meals || 0, color: c.peach },
              { label: 'Admin Users', value: stats?.admin_users || 0, color: '#8b5cf6' },
            ].map((stat, i) => (
              <div key={i} style={{ 
                backgroundColor: c.white, 
                borderRadius: 20, 
                padding: 24, 
                border: `1px solid ${c.peach}15`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}>
                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  {stat.label}
                </p>
                <p style={{ color: stat.color, fontSize: 36, fontWeight: 800, margin: 0 }}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24, marginBottom: 32 }}>
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 24, 
              border: `1px solid ${c.peach}15`,
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 20 }}>User Growth (Weekly)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={`${c.peach}20`} />
                  <XAxis dataKey="name" stroke={c.taupe} fontSize={11} />
                  <YAxis stroke={c.taupe} fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: c.white, 
                      border: `1px solid ${c.peach}20`,
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="users" stroke={c.dark} strokeWidth={2.5} dot={{ fill: c.peach, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 24, 
              border: `1px solid ${c.peach}15`,
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, marginBottom: 20 }}>Meals Logged (Weekly)</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={`${c.peach}20`} />
                  <XAxis dataKey="name" stroke={c.taupe} fontSize={11} />
                  <YAxis stroke={c.taupe} fontSize={11} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: c.white, 
                      border: `1px solid ${c.peach}20`,
                      borderRadius: 12,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="meals" fill={c.peach} radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Users */}
          <div style={{ 
            backgroundColor: c.white, 
            borderRadius: 20, 
            overflow: 'hidden',
            border: `1px solid ${c.peach}15`,
          }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${c.peach}15`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: c.dark, fontWeight: 600, fontSize: 16, margin: 0 }}>Recent Users</h3>
              <Link to="/admin/users" style={{ color: c.peach, fontSize: 13, textDecoration: 'none' }}>
                View All →
              </Link>
            </div>
            <div>
              {recentUsers.map((u, i) => (
                <div key={i} style={{ 
                  padding: '16px 24px', 
                  borderBottom: i < recentUsers.length - 1 ? `1px solid ${c.peach}10` : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{ color: c.dark, fontWeight: 600, fontSize: 14 }}>{u.full_name}</div>
                    <div style={{ color: c.taupe, fontSize: 12, marginTop: 2 }}>{u.email}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: 20, 
                      fontSize: 11, 
                      fontWeight: 500,
                      backgroundColor: u.role === 'admin' ? `${c.peach}15` : `${c.taupe}15`,
                      color: u.role === 'admin' ? c.peach : c.taupe,
                    }}>
                      {u.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage