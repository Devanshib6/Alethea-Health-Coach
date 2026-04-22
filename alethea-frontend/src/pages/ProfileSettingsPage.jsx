import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile, getMyProfile } from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const ProfileSettingsPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('personal')
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
      // Prepare update data
      const updateData = {
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        goal: formData.goal || null,
        activity_level: formData.activity_level || null,
        diet_type: formData.diet_type || null,
        allergies: formData.allergies || null,
      }

      console.log('Updating profile:', updateData) // Debug log

      // Update profile in database
      await updateProfile(updateData)

      // Fetch updated user profile
      const updatedUser = await getMyProfile()
      
      console.log('Updated user:', updatedUser) // Debug log

      // Update context with new user data
      updateUser(updatedUser)

      setSuccess('Profile updated successfully!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Failed to update profile:', err)
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
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link 
            to="/dashboard" 
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 13, marginBottom: 12, textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Profile Settings</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>Manage your personal information and health details</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px' }}>
        
        {/* Profile Card */}
        <div style={{ 
          backgroundColor: c.white, 
          borderRadius: 24, 
          padding: 24, 
          marginBottom: 32, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 24,
          border: `1px solid ${c.peach}15`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <div style={{ 
            width: 80, 
            height: 80, 
            borderRadius: '50%', 
            backgroundColor: c.dark, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            flexShrink: 0 
          }}>
            <span style={{ color: c.peach, fontSize: 32, fontWeight: 800 }}>
              {user?.full_name?.charAt(0) || 'U'}
            </span>
          </div>
          <div>
            <h2 style={{ color: c.dark, fontWeight: 700, fontSize: 22, margin: 0 }}>{user?.full_name}</h2>
            <p style={{ color: c.taupe, fontSize: 14, marginTop: 4, marginBottom: 8 }}>{user?.email}</p>
            <span style={{ 
              backgroundColor: `${c.peach}15`, 
              color: c.dark, 
              fontSize: 11, 
              padding: '3px 12px', 
              borderRadius: 20, 
              fontWeight: 600, 
              textTransform: 'uppercase', 
              letterSpacing: 1 
            }}>
              {user?.role === 'admin' ? 'Admin' : 'Member'}
            </span>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{ 
            backgroundColor: '#d4edda', 
            color: '#155724', 
            padding: '14px 18px', 
            borderRadius: 12, 
            marginBottom: 24, 
            fontSize: 14,
            borderLeft: `4px solid #28a745`,
          }}>
            {success}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ 
            backgroundColor: '#fde8e8', 
            color: '#b91c1c', 
            padding: '14px 18px', 
            borderRadius: 12, 
            marginBottom: 24, 
            fontSize: 14,
            borderLeft: `4px solid #dc2626`,
          }}>
            {error}
          </div>
        )}

        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: 0, 
          marginBottom: 32, 
          borderBottom: `1px solid ${c.peach}20`,
          backgroundColor: c.white,
          borderRadius: '16px 16px 0 0',
          padding: '0 8px',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '14px 28px',
                background: 'none',
                border: 'none',
                borderBottom: activeTab === tab.id ? `2px solid ${c.dark}` : '2px solid transparent',
                marginBottom: -1,
                color: activeTab === tab.id ? c.dark : c.taupe,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                fontSize: 14,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = c.dark
                }
              }}
              onMouseLeave={(e) => {
                if (activeTab !== tab.id) {
                  e.currentTarget.style.color = c.taupe
                }
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ 
            backgroundColor: c.white, 
            borderRadius: 20, 
            padding: '32px',
            border: `1px solid ${c.peach}15`,
          }}>
            
            {/* Personal Tab */}
            {activeTab === 'personal' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      border: `1.5px solid ${c.peach}20`, 
                      borderRadius: 14,
                      padding: '14px 18px', 
                      fontSize: 14, 
                      outline: 'none', 
                      backgroundColor: c.white,
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.peach
                      e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${c.peach}20`
                      e.target.style.boxShadow = 'none'
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                      Age
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      placeholder="25"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 14,
                        padding: '14px 18px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = c.peach
                        e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${c.peach}20`
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 14,
                        padding: '14px 18px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = c.peach
                        e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${c.peach}20`
                      }}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Health Tab */}
            {activeTab === 'health' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      placeholder="170"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 14,
                        padding: '14px 18px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = c.peach
                        e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${c.peach}20`
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleChange}
                      placeholder="70"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 14,
                        padding: '14px 18px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = c.peach
                        e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = `${c.peach}20`
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                    Health Goal
                  </label>
                  <select
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      border: `1.5px solid ${c.peach}20`, 
                      borderRadius: 14,
                      padding: '14px 18px', 
                      fontSize: 14, 
                      outline: 'none', 
                      backgroundColor: c.white,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.peach
                      e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${c.peach}20`
                    }}
                  >
                    <option value="">Select goal</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="improve_health">Improve Overall Health</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                    Activity Level
                  </label>
                  <select
                    name="activity_level"
                    value={formData.activity_level}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      border: `1.5px solid ${c.peach}20`, 
                      borderRadius: 14,
                      padding: '14px 18px', 
                      fontSize: 14, 
                      outline: 'none', 
                      backgroundColor: c.white,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.peach
                      e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${c.peach}20`
                    }}
                  >
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

            {/* Dietary Tab */}
            {activeTab === 'dietary' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                    Diet Type
                  </label>
                  <select
                    name="diet_type"
                    value={formData.diet_type}
                    onChange={handleChange}
                    style={{ 
                      width: '100%', 
                      border: `1.5px solid ${c.peach}20`, 
                      borderRadius: 14,
                      padding: '14px 18px', 
                      fontSize: 14, 
                      outline: 'none', 
                      backgroundColor: c.white,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.peach
                      e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${c.peach}20`
                    }}
                  >
                    <option value="">Select diet type</option>
                    <option value="veg">Vegetarian</option>
                    <option value="eggitarian">Eggitarian</option>
                    <option value="non-veg">Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                    Allergies / Intolerances
                  </label>
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    placeholder="e.g., nuts, dairy, gluten"
                    style={{ 
                      width: '100%', 
                      border: `1.5px solid ${c.peach}20`, 
                      borderRadius: 14,
                      padding: '14px 18px', 
                      fontSize: 14, 
                      outline: 'none', 
                      backgroundColor: c.white,
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = c.peach
                      e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = `${c.peach}20`
                    }}
                  />
                  <p style={{ color: c.taupe, fontSize: 12, marginTop: 8 }}>
                    Separate multiple items with commas
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 40 }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{ 
                  flex: 1, 
                  backgroundColor: 'transparent', 
                  border: `1.5px solid ${c.peach}`, 
                  color: c.taupe, 
                  padding: '14px 20px', 
                  fontSize: 14, 
                  fontWeight: 600,
                  cursor: 'pointer', 
                  borderRadius: 40,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${c.peach}08`
                  e.currentTarget.style.borderColor = c.dark
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = c.peach
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                style={{ 
                  flex: 1, 
                  backgroundColor: c.dark, 
                  color: c.white, 
                  border: 'none', 
                  padding: '14px 20px', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  opacity: loading ? 0.6 : 1, 
                  borderRadius: 40,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = c.charcoal
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = c.dark
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProfileSettingsPage