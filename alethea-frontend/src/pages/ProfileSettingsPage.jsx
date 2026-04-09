import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const ProfileSettingsPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    activity_level: '',
    diet_type: '',
    allergies: '',
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('personal')

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        age: user.age || '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
        goal: user.goal || '',
        activity_level: user.activity_level || '',
        diet_type: user.diet_type || '',
        allergies: user.allergies || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      await API.put('/users/me', {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        goal: formData.goal || null,
        activity_level: formData.activity_level || null,
        diet_type: formData.diet_type || null,
        allergies: formData.allergies || null,
      })
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const tabs = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'health', label: 'Health & Goals' },
    { id: 'dietary', label: 'Dietary' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* header */}
      <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button onClick={() => navigate('/dashboard')}
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
            ← Back to Dashboard
          </button>
          <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Profile Settings</h1>
          <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Manage your personal information and health details</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>

        {/* profile card */}
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', backgroundColor: c.dark, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: c.peach, fontSize: 28, fontWeight: 900 }}>
              {user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 style={{ color: c.dark, fontWeight: 800, fontSize: 20, margin: 0 }}>{user?.full_name}</h2>
            <p style={{ color: c.taupe, fontSize: 14, marginTop: 4 }}>{user?.email}</p>
            <span style={{ backgroundColor: `${c.peach}20`, color: c.dark, fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
              {user?.role || 'user'}
            </span>
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: `2px solid ${c.peach}` }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 24px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${c.dark}` : '2px solid transparent',
                marginBottom: -2,
                color: activeTab === tab.id ? c.dark : c.taupe,
                fontWeight: activeTab === tab.id ? 700 : 400,
                cursor: 'pointer',
                fontSize: 14
              }}>
              {tab.label}
            </button>
          ))}
        </div>

        {success && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            ✅ {success}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fde8e8', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* personal tab */}
          {activeTab === 'personal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Full Name</label>
                <input type="text" name="full_name" value={formData.full_name} onChange={handleChange}
                  style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Age</label>
                  <input type="number" name="age" value={formData.age} onChange={handleChange} placeholder="e.g., 25"
                    style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Gender</label>
                  <select name="gender" value={formData.gender} onChange={handleChange}
                    style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}>
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* health tab */}
          {activeTab === 'health' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Height (cm)</label>
                  <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="e.g., 170"
                    style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Weight (kg)</label>
                  <input type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="e.g., 70"
                    style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Health Goal</label>
                <select name="goal" value={formData.goal} onChange={handleChange}
                  style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}>
                  <option value="">Select goal</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="gain_muscle">Gain Muscle</option>
                  <option value="maintain">Maintain Weight</option>
                  <option value="improve_health">Improve Overall Health</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Activity Level</label>
                <select name="activity_level" value={formData.activity_level} onChange={handleChange}
                  style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}>
                  <option value="">Select activity level</option>
                  <option value="sedentary">Sedentary — little or no exercise</option>
                  <option value="light">Light — exercise 1-3 days/week</option>
                  <option value="moderate">Moderate — exercise 3-5 days/week</option>
                  <option value="active">Active — exercise 6-7 days/week</option>
                  <option value="very_active">Very Active — intense exercise daily</option>
                </select>
              </div>
            </div>
          )}

          {/* dietary tab */}
          {activeTab === 'dietary' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Diet Type</label>
                <select name="diet_type" value={formData.diet_type} onChange={handleChange}
                  style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}>
                  <option value="">Select diet type</option>
                  <option value="balanced">Balanced</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="vegan">Vegan</option>
                  <option value="keto">Keto</option>
                  <option value="paleo">Paleo</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="low_carb">Low Carb</option>
                  <option value="high_protein">High Protein</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>Allergies / Intolerances</label>
                <input type="text" name="allergies" value={formData.allergies} onChange={handleChange}
                  placeholder="e.g., nuts, dairy, gluten"
                  style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }} />
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
            <button type="button" onClick={() => navigate('/dashboard')}
              style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '14px', fontSize: 14, cursor: 'pointer' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading}
              style={{ flex: 1, backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, letterSpacing: 1, textTransform: 'uppercase' }}>
              {loading ? 'Saving...' : 'Save Changes →'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettingsPage