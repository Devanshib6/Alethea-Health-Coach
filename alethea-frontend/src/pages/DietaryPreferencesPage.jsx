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

const DietaryPreferencesPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    diet_type: '',
    allergies: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        diet_type: user.diet_type || '',
        allergies: user.allergies || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleDietSelect = (dietType) => {
    setFormData({ ...formData, diet_type: dietType })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile({
        diet_type: formData.diet_type,
        allergies: formData.allergies || null,
      })
      
      const freshUser = await getMyProfile()
      updateUser(freshUser)
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to save dietary preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard')
  }

  const dietOptions = [
    { 
      value: 'veg', 
      label: 'Vegetarian', 
      icon: '🥗',
      description: 'No meat, fish, or eggs. Includes dairy and plant-based foods.'
    },
    { 
      value: 'non-veg', 
      label: 'Non-Vegetarian', 
      icon: '🍗',
      description: 'Includes meat, fish, eggs, and all other foods.'
    },
    { 
      value: 'eggitarian', 
      label: 'Eggitarian', 
      icon: '🥚',
      description: 'No meat or fish, but includes eggs and dairy products.'
    },
  ]

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${c.cream} 0%, #f0e8e4 100%)`,
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decorative elements */}
      <div style={{
        position: 'absolute',
        top: -150,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.peach}15, transparent 70%)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        bottom: -100,
        left: -80,
        width: 350,
        height: 350,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.taupe}10, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Simple Header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '28px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Link to="/" style={{ color: c.dark, fontWeight: 700, fontSize: 26, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
            Alethea
          </Link>
        </div>
      </div>

      {/* Main Horizontal Layout */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 40px 60px', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          maxWidth: 1000, 
          width: '100%', 
          backgroundColor: c.white, 
          borderRadius: 32, 
          padding: '48px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        }}>
          
          {/* Progress Indicator - Completed */}
          <div style={{ marginBottom: 40, maxWidth: 500, margin: '0 auto 40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 40, 
                backgroundColor: c.dark, 
                color: c.white, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 16, 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                ✓
              </div>
              <div style={{ flex: 1, height: 4, backgroundColor: `${c.peach}25`, borderRadius: 4 }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: c.dark, borderRadius: 4 }} />
              </div>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 40, 
                backgroundColor: c.dark, 
                color: c.white, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 16, 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                2
              </div>
              <div style={{ flex: 1, height: 4, backgroundColor: `${c.peach}25`, borderRadius: 4 }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: c.dark, borderRadius: 4 }} />
              </div>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 40, 
                backgroundColor: c.dark, 
                color: c.white, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 16, 
                fontWeight: 700,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>
                3
              </div>
            </div>
            <p style={{ color: c.taupe, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
              Final Step · Dietary Preferences
            </p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ 
              width: 72, 
              height: 72, 
              background: `linear-gradient(135deg, ${c.dark} 0%, ${c.charcoal} 100%)`,
              borderRadius: 24, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 20px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
            }}>
              <span style={{ fontSize: 32 }}>🍽️</span>
            </div>
            <h1 style={{ color: c.dark, fontSize: 32, fontWeight: 800, letterSpacing: -1.5, marginBottom: 12 }}>
              Dietary Preferences
            </h1>
            <p style={{ color: c.taupe, fontSize: 16, lineHeight: 1.5 }}>
              Tell us about your eating habits
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Diet Type Options - Horizontal Cards */}
            <div style={{ marginBottom: 40 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.dark, marginBottom: 20 }}>
                Diet Type <span style={{ color: c.peach }}>*</span>
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                {dietOptions.map((option) => (
                  <div
                    key={option.value}
                    onClick={() => handleDietSelect(option.value)}
                    style={{
                      border: `2px solid ${formData.diet_type === option.value ? c.peach : '#e8e4e0'}`,
                      borderRadius: 24,
                      padding: '24px 20px',
                      cursor: 'pointer',
                      backgroundColor: formData.diet_type === option.value ? `${c.peach}08` : c.white,
                      transition: 'all 0.2s',
                      textAlign: 'center',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => {
                      if (formData.diet_type !== option.value) {
                        e.currentTarget.style.borderColor = c.peach
                        e.currentTarget.style.backgroundColor = `${c.peach}04`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (formData.diet_type !== option.value) {
                        e.currentTarget.style.borderColor = '#e8e4e0'
                        e.currentTarget.style.backgroundColor = c.white
                      }
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 16 }}>{option.icon}</div>
                    <h4 style={{ color: c.dark, fontWeight: 700, marginBottom: 10, fontSize: 18 }}>
                      {option.label}
                    </h4>
                    <p style={{ color: c.taupe, fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                      {option.description}
                    </p>
                    {formData.diet_type === option.value && (
                      <div style={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: c.peach, 
                        fontSize: 20,
                        fontWeight: 600
                      }}>
                        ✓
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Allergies Section - Full Width */}
            <div style={{ marginBottom: 40 }}>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                Allergies / Intolerances
              </label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleChange}
                placeholder="e.g., nuts, dairy, gluten, shellfish"
                style={{ 
                  width: '100%', 
                  border: `1.5px solid #e8e4e0`,
                  borderRadius: 16,
                  padding: '15px 18px', 
                  fontSize: 15, 
                  outline: 'none', 
                  backgroundColor: c.white,
                  fontFamily: 'inherit',
                  transition: 'all 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = c.peach
                  e.target.style.boxShadow = `0 0 0 3px ${c.peach}20`
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e8e4e0'
                  e.target.style.boxShadow = 'none'
                }}
              />
              <p style={{ color: c.taupe, fontSize: 12, marginTop: 8 }}>
                Separate multiple items with commas
              </p>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
              <button
                type="button"
                onClick={handleSkip}
                style={{ 
                  flex: 1, 
                  backgroundColor: 'transparent', 
                  border: `1.5px solid ${c.peach}`, 
                  color: c.taupe, 
                  padding: '15px 20px', 
                  fontSize: 14, 
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderRadius: 50,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = `${c.peach}08`
                  e.target.style.borderColor = c.dark
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent'
                  e.target.style.borderColor = c.peach
                }}
              >
                Skip for now
              </button>
              <button
                type="submit"
                disabled={loading || !formData.diet_type}
                style={{ 
                  flex: 1, 
                  backgroundColor: c.dark, 
                  color: c.white, 
                  border: 'none', 
                  padding: '15px 20px', 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: (loading || !formData.diet_type) ? 'not-allowed' : 'pointer', 
                  opacity: (loading || !formData.diet_type) ? 0.5 : 1,
                  borderRadius: 50,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && formData.diet_type) {
                    e.target.style.backgroundColor = c.charcoal
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && formData.diet_type) {
                    e.target.style.backgroundColor = c.dark
                  }
                }}
              >
                {loading ? 'Saving...' : 'Complete Setup →'}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${c.peach}12`, textAlign: 'center' }}>
            <p style={{ color: c.taupe, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span>🥗</span> Your preferences help us personalize meal recommendations
              <span style={{ width: 4, height: 4, backgroundColor: c.taupe, borderRadius: '50%', display: 'inline-block' }} />
              <span>🔒</span> We keep your data private and secure
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DietaryPreferencesPage