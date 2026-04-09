import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const AdminDashboardPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
      return
    }
    fetchStats()
  }, [user])

  const fetchStats = async () => {
    try {
      const response = await API.get('/admin/stats')
      setStats(response.data)
    } catch (err) {
      console.error('Error fetching admin stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const adminModules = [
    { title: 'User Management', desc: 'View and manage all registered users', icon: '👥', path: '/admin/users', color: c.dark },
    { title: 'Food Database', desc: 'Manage the food items database', icon: '🥗', path: '/admin/food-database', color: c.taupe },
    { title: 'System Analytics', desc: 'View system usage and analytics', icon: '📊', path: '/admin/analytics', color: c.peach },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
        <p style={{ color: c.taupe }}>Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* header */}
      <nav style={{ backgroundColor: c.dark, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: c.white, fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>ALETHEA</span>
          <span style={{ backgroundColor: c.peach, color: c.dark, fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Food DB', path: '/admin/food-database' },
            { label: 'Analytics', path: '/admin/analytics' },
          ].map((item, i) => (
            <Link key={i} to={item.path} style={{ color: c.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 1 }}>{item.label}</Link>
          ))}
          <button onClick={() => { logout(); navigate('/login') }}
            style={{ background: 'none', border: `1px solid ${c.taupe}`, color: c.taupe, padding: '6px 16px', cursor: 'pointer', fontSize: 12, borderRadius: 4 }}>
            Logout
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        <div style={{ marginBottom: 40 }}>
          <p style={{ color: c.peach, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Admin Panel</p>
          <h1 style={{ color: c.dark, fontSize: 36, fontWeight: 900, letterSpacing: -1, margin: 0 }}>Dashboard</h1>
          <p style={{ color: c.taupe, marginTop: 8, fontSize: 14 }}>Welcome back, {user?.full_name}. Here is your system overview.</p>
        </div>

        {/* stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 48 }}>
          {[
            { label: 'Total Users', value: stats?.total_users || 0, icon: '👥' },
            { label: 'Active Users', value: stats?.active_users || 0, icon: '✅' },
            { label: 'Inactive Users', value: (stats?.total_users || 0) - (stats?.active_users || 0), icon: '⏸️' },
            { label: 'Admin Users', value: stats?.admin_users || 0, icon: '🔑' },
          ].map((stat, i) => (
            <div key={i} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>{stat.icon}</div>
              <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{stat.label}</p>
              <p style={{ color: c.dark, fontSize: 40, fontWeight: 900, margin: '4px 0 0', lineHeight: 1 }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* modules */}
        <h2 style={{ color: c.dark, fontWeight: 800, fontSize: 20, marginBottom: 24, letterSpacing: -0.5 }}>Admin Modules</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {adminModules.map((mod, i) => (
            <div key={i} onClick={() => navigate(mod.path)}
              style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28, cursor: 'pointer', transition: 'box-shadow 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = `0 8px 24px rgba(212,160,144,0.3)`}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{mod.icon}</div>
              <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 17, margin: '0 0 8px' }}>{mod.title}</h3>
              <p style={{ color: c.taupe, fontSize: 13, lineHeight: 1.6, margin: 0 }}>{mod.desc}</p>
              <p style={{ color: c.peach, fontSize: 13, marginTop: 16, fontWeight: 600 }}>Manage →</p>
            </div>
          ))}
        </div>

        {/* quick actions */}
        <div style={{ marginTop: 48, border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28 }}>
          <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 16, marginBottom: 20 }}>Quick Actions</h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'View All Users', path: '/admin/users' },
              { label: 'Manage Food Database', path: '/admin/food-database' },
              { label: 'System Analytics', path: '/admin/analytics' },
              { label: 'Back to App', path: '/dashboard' },
            ].map((action, i) => (
              <button key={i} onClick={() => navigate(action.path)}
                style={{ backgroundColor: i === 0 ? c.dark : 'transparent', color: i === 0 ? c.white : c.taupe, border: `1.5px solid ${i === 0 ? c.dark : c.peach}`, padding: '10px 20px', fontSize: 13, cursor: 'pointer', borderRadius: 6, fontWeight: i === 0 ? 700 : 400 }}>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage