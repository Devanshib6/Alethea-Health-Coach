import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const c = { dark: '#1a0405', taupe: '#7a6058', peach: '#d4a090', white: '#ffffff' }

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={{ 
      backgroundColor: c.dark, 
      padding: '0 32px', 
      height: 60, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between', 
      position: 'sticky', 
      top: 0, 
      zIndex: 50 
    }}>
      <Link to="/dashboard" style={{ color: c.white, fontWeight: 900, fontSize: 18, letterSpacing: 2, textDecoration: 'none' }}>
        ALETHEA
      </Link>
      
      <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <Link to="/diet-plan" style={{ color: c.taupe, textDecoration: 'none', fontSize: 13 }}>Diet Plan</Link>
        <Link to="/meal-history" style={{ color: c.taupe, textDecoration: 'none', fontSize: 13 }}>Meals</Link>
        <Link to="/health-prediction" style={{ color: c.taupe, textDecoration: 'none', fontSize: 13 }}>Health</Link>
        <Link to="/profile-settings" style={{ color: c.taupe, textDecoration: 'none', fontSize: 13 }}>{user?.full_name?.split(' ')[0]}</Link>
        
        {/* App Settings Link - Added */}
        <Link to="/app-settings" style={{ color: c.peach, textDecoration: 'none', fontSize: 13 }}>
          ⚙️ Settings
        </Link>
        
        <button 
          onClick={handleLogout} 
          style={{ background: 'none', border: `1px solid ${c.taupe}`, color: c.taupe, padding: '6px 14px', cursor: 'pointer', fontSize: 12, borderRadius: 4 }}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar