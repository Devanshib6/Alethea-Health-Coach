import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const BasicInfoPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    age: user?.age || '',
    gender: user?.gender || '',
    height: user?.height || '',
    weight: user?.weight || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // If user already has profile info, show skip option
  const hasExistingData = user?.full_name && user?.age && user?.height && user?.weight

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      // Save basic info to backend
      const response = await API.put('/users/me', formData)
      console.log('Profile updated:', response.data)
      
      // Refresh user profile in context
      const updatedProfile = await API.get('/users/me')
      login(localStorage.getItem('token'), updatedProfile.data)
      
      // Navigate to next page
      navigate('/goals-health')
    } catch (err) {
      console.error('Error saving profile:', err)
      setError(err.response?.data?.detail || 'Failed to save information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.white }}>
      
      {/* Progress Bar */}
      <div style={{ backgroundColor: colors.dark, padding: '20px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 style={{ color: colors.white, fontSize: 24, fontWeight: 700 }}>Complete Your Profile</h1>
            <span style={{ color: colors.peach, fontSize: 14 }}>Step 1 of 3</span>
          </div>
          <div style={{ backgroundColor: colors.taupe, borderRadius: 10, height: 8, overflow: 'hidden' }}>
            <div style={{ width: '33%', backgroundColor: colors.peach, height: '100%', borderRadius: 10 }} />
          </div>
          <p style={{ color: colors.taupe, fontSize: 13, marginTop: 12 }}>Let's get to know you better</p>
        </div>
      </div>
      
      {/* Form Content */}
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 32 }}>
          
          <h2 style={{ color: colors.dark, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Basic Information</h2>
          <p style={{ color: colors.taupe, fontSize: 14, marginBottom: 32 }}>Tell us about yourself to personalize your health journey</p>
          
          {error && (
            <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Full Name */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Full Name *
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = colors.dark}
                onBlur={e => e.target.style.borderColor = colors.peach}
              />
            </div>
            
            {/* Age */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="1"
                max="120"
                placeholder="Enter your age"
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = colors.dark}
                onBlur={e => e.target.style.borderColor = colors.peach}
              />
            </div>
            
            {/* Gender */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Gender *
              </label>
              <div style={{ display: 'flex', gap: 16 }}>
                {['Male', 'Female', 'Other'].map(option => (
                  <label key={option} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                    <input
                      type="radio"
                      name="gender"
                      value={option.toLowerCase()}
                      checked={formData.gender === option.toLowerCase()}
                      onChange={handleChange}
                      style={{ accentColor: colors.peach }}
                    />
                    <span style={{ color: colors.taupe, fontSize: 14 }}>{option}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Height & Weight Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                  Height (cm) *
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  step="0.1"
                  placeholder="e.g., 170"
                  style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = colors.dark}
                  onBlur={e => e.target.style.borderColor = colors.peach}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  step="0.1"
                  placeholder="e.g., 65"
                  style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  onFocus={e => e.target.style.borderColor = colors.dark}
                  onBlur={e => e.target.style.borderColor = colors.peach}
                />
              </div>
            </div>
            
            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              {hasExistingData && (
                <button
                  type="button"
                  onClick={() => navigate('/dashboard')}
                  style={{ backgroundColor: 'transparent', border: `1.5px solid ${colors.peach}`, color: colors.taupe, padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
                >
                  Skip to Dashboard
                </button>
              )}
              
              {!hasExistingData && <div />}
              
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
              >
                {loading ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoPage