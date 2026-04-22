import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile } from '../services/authService'
import toast from 'react-hot-toast'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const GoalsHealthPage = () => {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    goal: user?.goal || '',
    activity_level: user?.activity_level || '',
  })

  const goals = [
    { value: 'lose_weight', label: 'Lose Weight', icon: '⚖️', desc: 'Shed those extra pounds' },
    { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪', desc: 'Build strength and mass' },
    { value: 'maintain', label: 'Maintain Weight', icon: '🎯', desc: 'Stay fit and healthy' },
    { value: 'improve_health', label: 'Improve Health', icon: '❤️', desc: 'Better overall wellness' },
  ]

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', icon: '🛋️', desc: 'Little or no exercise' },
    { value: 'light', label: 'Light', icon: '🚶', desc: 'Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderate', icon: '🏃', desc: 'Exercise 3-5 days/week' },
    { value: 'active', label: 'Active', icon: '🏋️', desc: 'Exercise 6-7 days/week' },
    { value: 'very_active', label: 'Very Active', icon: '⚡', desc: 'Intense daily exercise' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const updatedUser = await updateProfile(formData)
      login(localStorage.getItem('token'), { ...user, ...updatedUser })
      toast.success('Goals saved!')
      navigate('/dietary-preferences')
    } catch (error) {
      toast.error('Failed to save')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/basic-info')
  }

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
          maxWidth: 1200, 
          width: '100%', 
          backgroundColor: c.white, 
          borderRadius: 32, 
          padding: '48px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        }}>
          
          {/* Progress Indicator */}
          <div style={{ marginBottom: 40, maxWidth: 400, margin: '0 auto 40px' }}>
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
                1
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
            </div>
            <p style={{ color: c.taupe, fontSize: 13, marginTop: 8, textAlign: 'center' }}>
              Step 2 of 2 · Health Goals & Activity
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
              <span style={{ fontSize: 32 }}>🎯</span>
            </div>
            <h1 style={{ color: c.dark, fontSize: 32, fontWeight: 800, letterSpacing: -1.5, marginBottom: 12 }}>
              Your Health Goals
            </h1>
            <p style={{ color: c.taupe, fontSize: 16, lineHeight: 1.5 }}>
              What do you want to achieve?
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Horizontal Two-Column Layout */}
            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
              {/* Goals Section - Left Column */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.dark, marginBottom: 20 }}>
                  Primary Goal
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {goals.map((goal) => (
                    <div
                      key={goal.value}
                      onClick={() => setFormData({ ...formData, goal: goal.value })}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 20,
                        border: `2px solid ${formData.goal === goal.value ? c.peach : '#e8e4e0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: formData.goal === goal.value ? `${c.peach}08` : c.white,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                      onMouseEnter={(e) => {
                        if (formData.goal !== goal.value) {
                          e.currentTarget.style.borderColor = c.peach
                          e.currentTarget.style.backgroundColor = `${c.peach}04`
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.goal !== goal.value) {
                          e.currentTarget.style.borderColor = '#e8e4e0'
                          e.currentTarget.style.backgroundColor = c.white
                        }
                      }}
                    >
                      <div style={{ fontSize: 32 }}>{goal.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: c.dark, marginBottom: 4 }}>{goal.label}</div>
                        <div style={{ fontSize: 12, color: c.taupe }}>{goal.desc}</div>
                      </div>
                      {formData.goal === goal.value && (
                        <div style={{ color: c.peach, fontSize: 22 }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Level Section - Right Column */}
              <div style={{ flex: 1, minWidth: 280 }}>
                <label style={{ display: 'block', fontSize: 14, fontWeight: 600, color: c.dark, marginBottom: 20 }}>
                  Activity Level
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {activityLevels.map((level) => (
                    <div
                      key={level.value}
                      onClick={() => setFormData({ ...formData, activity_level: level.value })}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 20,
                        border: `2px solid ${formData.activity_level === level.value ? c.peach : '#e8e4e0'}`,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: formData.activity_level === level.value ? `${c.peach}08` : c.white,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 16,
                      }}
                      onMouseEnter={(e) => {
                        if (formData.activity_level !== level.value) {
                          e.currentTarget.style.borderColor = c.peach
                          e.currentTarget.style.backgroundColor = `${c.peach}04`
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (formData.activity_level !== level.value) {
                          e.currentTarget.style.borderColor = '#e8e4e0'
                          e.currentTarget.style.backgroundColor = c.white
                        }
                      }}
                    >
                      <div style={{ fontSize: 28 }}>{level.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: c.dark, marginBottom: 4 }}>{level.label}</div>
                        <div style={{ fontSize: 12, color: c.taupe }}>{level.desc}</div>
                      </div>
                      {formData.activity_level === level.value && (
                        <div style={{ color: c.peach, fontSize: 22 }}>✓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 48 }}>
              <button
                type="button"
                onClick={handleBack}
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
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading || !formData.goal || !formData.activity_level}
                style={{
                  flex: 1,
                  backgroundColor: c.dark,
                  color: c.white,
                  border: 'none',
                  padding: '15px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: (loading || !formData.goal || !formData.activity_level) ? 'not-allowed' : 'pointer',
                  opacity: (loading || !formData.goal || !formData.activity_level) ? 0.5 : 1,
                  borderRadius: 50,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading && formData.goal && formData.activity_level) {
                    e.target.style.backgroundColor = c.charcoal
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && formData.goal && formData.activity_level) {
                    e.target.style.backgroundColor = c.dark
                  }
                }}
              >
                {loading ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${c.peach}12`, textAlign: 'center' }}>
            <p style={{ color: c.taupe, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span>🏃‍♂️</span> This helps us create a personalized plan for you
              <span style={{ width: 4, height: 4, backgroundColor: c.taupe, borderRadius: '50%', display: 'inline-block' }} />
              <span>📊</span> Update anytime in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoalsHealthPage