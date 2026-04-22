import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const links = [
    { path: '/dashboard', label: 'Dashboard', icon: '🏠' },
    { path: '/log-meal', label: 'Log Meal', icon: '🍽️' },
    { path: '/meal-history', label: 'Meal History', icon: '📋' },
    { path: '/diet-plan', label: 'Diet Plan', icon: '🥗' },
    { path: '/weekly-meal-plan', label: 'Weekly Plan', icon: '📅' },
    { path: '/health-prediction', label: 'Health', icon: '❤️' },
    { path: '/health-report', label: 'Report', icon: '📊' },
    { path: '/profile-settings', label: 'Profile', icon: '👤' },
    { path: '/app-settings', label: 'App Settings', icon: '⚙️' },  // Added
  ]

  return (
    <div style={{ width: 220, backgroundColor: c.dark, minHeight: '100vh', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '0 20px 24px', borderBottom: `1px solid ${c.taupe}30` }}>
        <p style={{ color: c.white, fontWeight: 900, fontSize: 16, letterSpacing: 2 }}>ALETHEA</p>
        <p style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>{user?.full_name}</p>
      </div>
      <div style={{ padding: '16px 0', flex: 1 }}>
        {links.map((link, i) => (
          <Link key={i} to={link.path} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px',
            backgroundColor: location.pathname === link.path ? `${c.peach}20` : 'transparent',
            borderLeft: location.pathname === link.path ? `3px solid ${c.peach}` : '3px solid transparent',
            color: location.pathname === link.path ? c.white : c.taupe,
            textDecoration: 'none', fontSize: 13, transition: 'all 0.2s'
          }}>
            <span>{link.icon}</span>
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Sidebar