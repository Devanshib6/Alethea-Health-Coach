import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

// Dark mode colors
const darkModeColors = {
  background: '#121212',
  surface: '#1e1e1e',
  text: '#ffffff',
  textSecondary: '#a0a0a0',
  border: '#333333',
  card: '#2d2d2d',
}

const AppSettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Load saved preferences from localStorage
  const [notifications, setNotifications] = useState({
    meal_reminders: true,
    health_tips: true,
    weekly_report: true,
    diet_updates: false,
  })

  const [units, setUnits] = useState({
    weight: 'kg',
    height: 'cm',
    calories: 'kcal',
  })

  const [theme, setTheme] = useState('light')
  const [language, setLanguage] = useState('en')
  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('app_notifications')
    const savedUnits = localStorage.getItem('app_units')
    const savedTheme = localStorage.getItem('app_theme')
    const savedLanguage = localStorage.getItem('app_language')

    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications))
    }
    if (savedUnits) {
      setUnits(JSON.parse(savedUnits))
    }
    if (savedTheme) {
      setTheme(savedTheme)
      applyTheme(savedTheme)
    }
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const applyTheme = (selectedTheme) => {
    if (selectedTheme === 'dark') {
      // Apply dark mode to body
      document.body.style.backgroundColor = darkModeColors.background
      document.body.style.color = darkModeColors.text
      
      // Add dark-mode class to html element for global styling
      document.documentElement.classList.add('dark-mode')
      
      // Store theme in localStorage
      localStorage.setItem('app_theme', 'dark')
    } else {
      // Apply light mode
      document.body.style.backgroundColor = c.cream
      document.body.style.color = c.dark
      
      // Remove dark-mode class
      document.documentElement.classList.remove('dark-mode')
      
      // Store theme in localStorage
      localStorage.setItem('app_theme', 'light')
    }
  }

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handleUnitChange = (key, value) => {
    setUnits({ ...units, [key]: value })
  }

  const handleThemeChange = (selectedTheme) => {
    setTheme(selectedTheme)
    applyTheme(selectedTheme)
  }

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('app_notifications', JSON.stringify(notifications))
    localStorage.setItem('app_units', JSON.stringify(units))
    localStorage.setItem('app_theme', theme)
    localStorage.setItem('app_language', language)

    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDeleteAccount = async () => {
    setShowDeleteModal(false)
    logout()
    navigate('/')
  }

  const Toggle = ({ value, onChange }) => (
    <div
      onClick={onChange}
      style={{
        width: 48,
        height: 24,
        borderRadius: 12,
        backgroundColor: value ? c.dark : '#e0e0e0',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 20,
          height: 20,
          borderRadius: '50%',
          backgroundColor: c.white,
          position: 'absolute',
          top: 2,
          left: value ? 26 : 2,
          transition: 'left 0.2s',
        }}
      />
    </div>
  )

  // Get dynamic styles based on theme
  const getBackgroundColor = () => {
    return theme === 'dark' ? darkModeColors.background : c.cream
  }

  const getSurfaceColor = () => {
    return theme === 'dark' ? darkModeColors.surface : c.white
  }

  const getTextColor = () => {
    return theme === 'dark' ? darkModeColors.text : c.dark
  }

  const getTextSecondaryColor = () => {
    return theme === 'dark' ? darkModeColors.textSecondary : c.taupe
  }

  const getBorderColor = () => {
    return theme === 'dark' ? darkModeColors.border : `${c.peach}15`
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: getBackgroundColor(), 
      fontFamily: "'Inter', system-ui, sans-serif",
      transition: 'background-color 0.3s ease',
    }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: getSurfaceColor(), 
        borderBottom: `1px solid ${getBorderColor()}`, 
        padding: '20px 32px',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              color: c.peach,
              cursor: 'pointer',
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ color: getTextColor(), fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>App Settings</h1>
          <p style={{ color: getTextSecondaryColor(), marginTop: 4, fontSize: 14 }}>Manage your application preferences</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px' }}>
        {/* Success Message */}
        {saved && (
          <div
            style={{
              backgroundColor: '#d4edda',
              color: '#155724',
              padding: '14px 18px',
              borderRadius: 12,
              marginBottom: 24,
              fontSize: 14,
              borderLeft: `4px solid #28a745`,
            }}
          >
            Settings saved successfully!
          </div>
        )}

        {/* Notifications Section */}
        <div
          style={{
            backgroundColor: getSurfaceColor(),
            borderRadius: 20,
            marginBottom: 24,
            border: `1px solid ${getBorderColor()}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${getBorderColor()}`,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : `${c.peach}10`,
            }}
          >
            <h3 style={{ color: getTextColor(), fontWeight: 700, margin: 0, fontSize: 16 }}>
              Notifications
            </h3>
          </div>
          <div style={{ padding: '8px 0' }}>
            {[
              { key: 'meal_reminders', label: 'Meal Reminders', desc: 'Get reminded to log your meals daily' },
              { key: 'health_tips', label: 'Health Tips', desc: 'Receive daily health and nutrition tips' },
              { key: 'weekly_report', label: 'Weekly Report', desc: 'Get a weekly summary of your progress' },
              { key: 'diet_updates', label: 'Diet Plan Updates', desc: 'Notifications when your diet plan changes' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderBottom: i < 3 ? `1px solid ${getBorderColor()}` : 'none',
                }}
              >
                <div>
                  <p style={{ color: getTextColor(), fontWeight: 600, fontSize: 14, margin: 0 }}>
                    {item.label}
                  </p>
                  <p style={{ color: getTextSecondaryColor(), fontSize: 12, marginTop: 4 }}>{item.desc}</p>
                </div>
                <Toggle value={notifications[item.key]} onChange={() => handleNotificationToggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Units & Measurements Section */}
        <div
          style={{
            backgroundColor: getSurfaceColor(),
            borderRadius: 20,
            marginBottom: 24,
            border: `1px solid ${getBorderColor()}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${getBorderColor()}`,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : `${c.peach}10`,
            }}
          >
            <h3 style={{ color: getTextColor(), fontWeight: 700, margin: 0, fontSize: 16 }}>
              Units & Measurements
            </h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <label style={{ color: getTextColor(), fontSize: 14, fontWeight: 600 }}>Weight Unit</label>
              <select
                value={units.weight}
                onChange={(e) => handleUnitChange('weight', e.target.value)}
                style={{
                  border: `1.5px solid ${c.peach}`,
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  outline: 'none',
                  backgroundColor: getSurfaceColor(),
                  color: getTextColor(),
                  cursor: 'pointer',
                }}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="lbs">Pounds (lbs)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <label style={{ color: getTextColor(), fontSize: 14, fontWeight: 600 }}>Height Unit</label>
              <select
                value={units.height}
                onChange={(e) => handleUnitChange('height', e.target.value)}
                style={{
                  border: `1.5px solid ${c.peach}`,
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  outline: 'none',
                  backgroundColor: getSurfaceColor(),
                  color: getTextColor(),
                  cursor: 'pointer',
                }}
              >
                <option value="cm">Centimeters (cm)</option>
                <option value="ft">Feet/Inches (ft)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <label style={{ color: getTextColor(), fontSize: 14, fontWeight: 600 }}>Calorie Unit</label>
              <select
                value={units.calories}
                onChange={(e) => handleUnitChange('calories', e.target.value)}
                style={{
                  border: `1.5px solid ${c.peach}`,
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  outline: 'none',
                  backgroundColor: getSurfaceColor(),
                  color: getTextColor(),
                  cursor: 'pointer',
                }}
              >
                <option value="kcal">Kilocalories (kcal)</option>
                <option value="kj">Kilojoules (kJ)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div
          style={{
            backgroundColor: getSurfaceColor(),
            borderRadius: 20,
            marginBottom: 24,
            border: `1px solid ${getBorderColor()}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${getBorderColor()}`,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : `${c.peach}10`,
            }}
          >
            <h3 style={{ color: getTextColor(), fontWeight: 700, margin: 0, fontSize: 16 }}>
              Appearance
            </h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <label style={{ color: getTextColor(), fontSize: 14, fontWeight: 600 }}>Theme</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => handleThemeChange('light')}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: theme === 'light' ? c.dark : 'transparent',
                    color: theme === 'light' ? c.white : c.taupe,
                    border: `1.5px solid ${c.peach}`,
                    borderRadius: 40,
                    cursor: 'pointer',
                    fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                >
                  Light
                </button>
                <button
                  onClick={() => handleThemeChange('dark')}
                  style={{
                    padding: '8px 20px',
                    backgroundColor: theme === 'dark' ? c.dark : 'transparent',
                    color: theme === 'dark' ? c.white : c.taupe,
                    border: `1.5px solid ${c.peach}`,
                    borderRadius: 40,
                    cursor: 'pointer',
                    fontSize: 13,
                    transition: 'all 0.2s',
                  }}
                >
                  Dark
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <label style={{ color: getTextColor(), fontSize: 14, fontWeight: 600 }}>Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                style={{
                  border: `1.5px solid ${c.peach}`,
                  borderRadius: 10,
                  padding: '10px 16px',
                  fontSize: 13,
                  outline: 'none',
                  backgroundColor: getSurfaceColor(),
                  color: getTextColor(),
                  cursor: 'pointer',
                }}
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ne">Nepali</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Section */}
        <div
          style={{
            backgroundColor: getSurfaceColor(),
            borderRadius: 20,
            marginBottom: 24,
            border: `1px solid ${getBorderColor()}`,
            overflow: 'hidden',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${getBorderColor()}`,
              backgroundColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : `${c.peach}10`,
            }}
          >
            <h3 style={{ color: getTextColor(), fontWeight: 700, margin: 0, fontSize: 16 }}>
              Account
            </h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: `1px solid ${getBorderColor()}`,
              }}
            >
              <div>
                <p style={{ color: getTextColor(), fontWeight: 600, fontSize: 14, margin: 0 }}>Logged in as</p>
                <p style={{ color: getTextSecondaryColor(), fontSize: 13, marginTop: 2 }}>{user?.email}</p>
              </div>
              <button
                onClick={() => navigate('/profile-settings')}
                style={{
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${c.peach}`,
                  color: c.taupe,
                  padding: '8px 20px',
                  fontSize: 12,
                  cursor: 'pointer',
                  borderRadius: 40,
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
                Edit Profile
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
              }}
            >
              <div>
                <p style={{ color: getTextColor(), fontWeight: 600, fontSize: 14, margin: 0 }}>Sign Out</p>
                <p style={{ color: getTextSecondaryColor(), fontSize: 13, marginTop: 2 }}>Sign out from your account</p>
              </div>
              <button
                onClick={logout}
                style={{
                  backgroundColor: c.dark,
                  color: c.white,
                  border: 'none',
                  padding: '8px 20px',
                  fontSize: 12,
                  cursor: 'pointer',
                  borderRadius: 40,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div
          style={{
            backgroundColor: getSurfaceColor(),
            borderRadius: 20,
            marginBottom: 24,
            border: `1px solid #f5c6c6`,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '16px 24px',
              borderBottom: `1px solid #f5c6c6`,
              backgroundColor: '#fde8e8',
            }}
          >
            <h3 style={{ color: '#b91c1c', fontWeight: 700, margin: 0, fontSize: 16 }}>
              Danger Zone
            </h3>
          </div>
          <div
            style={{
              padding: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <div>
              <p style={{ color: getTextColor(), fontWeight: 600, fontSize: 14, margin: 0 }}>Delete Account</p>
              <p style={{ color: getTextSecondaryColor(), fontSize: 13, marginTop: 2 }}>
                Permanently delete your account and all data
              </p>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              style={{
                backgroundColor: '#ef4444',
                color: c.white,
                border: 'none',
                padding: '10px 24px',
                fontSize: 13,
                cursor: 'pointer',
                borderRadius: 40,
                fontWeight: 600,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ef4444'}
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            backgroundColor: c.dark,
            color: c.white,
            border: 'none',
            padding: '16px',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            borderRadius: 40,
            transition: 'all 0.2s',
            marginTop: 8,
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
        >
          Save All Settings
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: getSurfaceColor(),
              borderRadius: 20,
              padding: 32,
              maxWidth: 400,
              width: '90%',
            }}
          >
            <h3 style={{ color: getTextColor(), marginBottom: 12, fontWeight: 800 }}>Delete Account?</h3>
            <p style={{ color: getTextSecondaryColor(), marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              This will permanently delete your account and all your data including meals, health records, and diet plans. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: 'transparent',
                  border: `1.5px solid ${c.peach}`,
                  borderRadius: 40,
                  cursor: 'pointer',
                  color: c.taupe,
                  fontSize: 14,
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: '#ef4444',
                  color: c.white,
                  border: 'none',
                  borderRadius: 40,
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global styles for dark mode */}
      <style>{`
        .dark-mode {
          background-color: #121212;
        }
        
        .dark-mode body {
          background-color: #121212;
          color: #ffffff;
        }
        
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>
    </div>
  )
}

export default AppSettingsPage