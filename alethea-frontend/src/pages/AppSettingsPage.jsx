import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const AppSettingsPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

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

  const [saved, setSaved] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleNotificationToggle = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const Toggle = ({ value, onChange }) => (
    <div onClick={onChange}
      style={{ width: 44, height: 24, borderRadius: 12, backgroundColor: value ? c.dark : '#e0e0e0', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', backgroundColor: c.white, position: 'absolute', top: 3, left: value ? 23 : 3, transition: 'left 0.2s' }} />
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* header */}
      <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>App Settings</h1>
          <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Manage your app preferences and account</p>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '40px 32px' }}>

        {saved && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            ✅ Settings saved successfully!
          </div>
        )}

        {/* notifications */}
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.peach}`, backgroundColor: `${c.peach}10` }}>
            <h3 style={{ color: c.dark, fontWeight: 800, margin: 0, fontSize: 15 }}>🔔 Notifications</h3>
          </div>
          <div style={{ padding: '8px 0' }}>
            {[
              { key: 'meal_reminders', label: 'Meal Reminders', desc: 'Get reminded to log your meals daily' },
              { key: 'health_tips', label: 'Health Tips', desc: 'Receive daily health and nutrition tips' },
              { key: 'weekly_report', label: 'Weekly Report', desc: 'Get a weekly summary of your progress' },
              { key: 'diet_updates', label: 'Diet Plan Updates', desc: 'Notifications when your diet plan changes' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: i < 3 ? `1px solid ${c.peach}20` : 'none' }}>
                <div>
                  <p style={{ color: c.dark, fontWeight: 600, fontSize: 14, margin: 0 }}>{item.label}</p>
                  <p style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>{item.desc}</p>
                </div>
                <Toggle value={notifications[item.key]} onChange={() => handleNotificationToggle(item.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* units */}
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.peach}`, backgroundColor: `${c.peach}10` }}>
            <h3 style={{ color: c.dark, fontWeight: 800, margin: 0, fontSize: 15 }}>📏 Units & Measurements</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { key: 'weight', label: 'Weight Unit', options: [{ value: 'kg', label: 'Kilograms (kg)' }, { value: 'lbs', label: 'Pounds (lbs)' }] },
              { key: 'height', label: 'Height Unit', options: [{ value: 'cm', label: 'Centimeters (cm)' }, { value: 'ft', label: 'Feet/Inches (ft)' }] },
              { key: 'calories', label: 'Calorie Unit', options: [{ value: 'kcal', label: 'Kilocalories (kcal)' }, { value: 'kj', label: 'Kilojoules (kJ)' }] },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                <label style={{ color: c.dark, fontSize: 14, fontWeight: 600 }}>{item.label}</label>
                <select value={units[item.key]} onChange={(e) => setUnits({ ...units, [item.key]: e.target.value })}
                  style={{ border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '8px 12px', fontSize: 13, outline: 'none', backgroundColor: c.white, color: c.dark }}>
                  {item.options.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* account */}
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid ${c.peach}`, backgroundColor: `${c.peach}10` }}>
            <h3 style={{ color: c.dark, fontWeight: 800, margin: 0, fontSize: 15 }}>👤 Account</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: `1px solid ${c.peach}20` }}>
              <div>
                <p style={{ color: c.dark, fontWeight: 600, fontSize: 14, margin: 0 }}>Logged in as</p>
                <p style={{ color: c.taupe, fontSize: 13, marginTop: 2 }}>{user?.email}</p>
              </div>
              <button onClick={() => navigate('/profile-settings')}
                style={{ backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '8px 16px', fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>
                Edit Profile
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0' }}>
              <div>
                <p style={{ color: c.dark, fontWeight: 600, fontSize: 14, margin: 0 }}>Sign Out</p>
                <p style={{ color: c.taupe, fontSize: 13, marginTop: 2 }}>Sign out from your account</p>
              </div>
              <button onClick={handleLogout}
                style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '8px 16px', fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* danger zone */}
        <div style={{ border: `1px solid #f5c6c6`, borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: `1px solid #f5c6c6`, backgroundColor: '#fde8e8' }}>
            <h3 style={{ color: '#b91c1c', fontWeight: 800, margin: 0, fontSize: 15 }}>⚠️ Danger Zone</h3>
          </div>
          <div style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ color: c.dark, fontWeight: 600, fontSize: 14, margin: 0 }}>Delete Account</p>
              <p style={{ color: c.taupe, fontSize: 13, marginTop: 4 }}>Permanently delete your account and all data</p>
            </div>
            <button onClick={() => setShowDeleteModal(true)}
              style={{ backgroundColor: '#ef4444', color: c.white, border: 'none', padding: '10px 20px', fontSize: 13, cursor: 'pointer', borderRadius: 6, fontWeight: 600 }}>
              Delete Account
            </button>
          </div>
        </div>

        {/* save button */}
        <button onClick={handleSave}
          style={{ width: '100%', marginTop: 32, backgroundColor: c.dark, color: c.white, border: 'none', padding: '16px', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 1, textTransform: 'uppercase' }}>
          Save Settings →
        </button>
      </div>

      {/* delete modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: c.white, borderRadius: 12, padding: 32, maxWidth: 400, width: '90%' }}>
            <h3 style={{ color: c.dark, marginBottom: 12 }}>Delete Account?</h3>
            <p style={{ color: c.taupe, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              This will permanently delete your account and all your data including meals, health records, and diet plans. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, borderRadius: 8, cursor: 'pointer', color: c.taupe }}>
                Cancel
              </button>
              <button onClick={() => { logout(); navigate('/') }}
                style={{ flex: 1, padding: '12px', backgroundColor: '#ef4444', color: c.white, border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppSettingsPage