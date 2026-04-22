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

const BasicInfoPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        full_name: user.full_name || '',
        age: user.age || '',
        gender: user.gender || '',
        height: user.height || '',
        weight: user.weight || '',
      })
    }
  }, [user])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await updateProfile({
        full_name: formData.full_name,
        age: formData.age ? parseInt(formData.age) : null,
        gender: formData.gender || null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
      })
      
      const freshUser = await getMyProfile()
      updateUser(freshUser)
      
      navigate('/goals-health')
    } catch (error) {
      console.error('Failed to save:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard')
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
      <div style={{
        position: 'absolute',
        top: '40%',
        left: '20%',
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${c.peach}08, transparent)`,
        pointerEvents: 'none',
      }} />

      {/* Simple Header */}
      <div style={{ position: 'relative', zIndex: 2, padding: '28px 40px' }}>
        <div style={{ maxWidth: 520, margin: '0 auto' }}>
          <Link to="/" style={{ color: c.dark, fontWeight: 700, fontSize: 26, letterSpacing: 2, textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
            Alethea
          </Link>
        </div>
      </div>

      {/* Main Form Container */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 20px 60px', position: 'relative', zIndex: 2 }}>
        <div style={{ 
          maxWidth: 560, 
          width: '100%', 
          backgroundColor: c.white, 
          borderRadius: 32, 
          padding: '48px 48px',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15)',
        }}>
          
          {/* Progress Indicator */}
          <div style={{ marginBottom: 40 }}>
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
                <div style={{ width: '50%', height: '100%', backgroundColor: c.dark, borderRadius: 4 }} />
              </div>
              <div style={{ 
                width: 40, 
                height: 40, 
                borderRadius: 40, 
                backgroundColor: `${c.peach}15`, 
                color: c.taupe, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: 16, 
                fontWeight: 600,
              }}>
                2
              </div>
            </div>
            <p style={{ color: c.taupe, fontSize: 13, marginTop: 8 }}>
              Step 1 of 2 · Basic Information
            </p>
          </div>

          <h1 style={{ color: c.dark, fontSize: 34, fontWeight: 800, letterSpacing: -1.5, marginBottom: 12 }}>
            Tell us about yourself
          </h1>
          <p style={{ color: c.taupe, fontSize: 16, marginBottom: 40, lineHeight: 1.5 }}>
            This helps us create a personalized health plan just for you.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: c.dark, marginBottom: 8 }}>
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                style={{
                  width: '100%',
                  border: `1.5px solid #e8e4e0`,
                  borderRadius: 16,
                  padding: '15px 18px',
                  fontSize: 15,
                  fontFamily: 'inherit',
                  color: c.dark,
                  outline: 'none',
                  backgroundColor: c.white,
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
                    border: `1.5px solid #e8e4e0`,
                    borderRadius: 16,
                    padding: '15px 18px',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    color: c.dark,
                    outline: 'none',
                    backgroundColor: c.white,
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
                    border: `1.5px solid #e8e4e0`,
                    borderRadius: 16,
                    padding: '15px 18px',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    color: c.dark,
                    outline: 'none',
                    backgroundColor: c.white,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.peach
                    e.target.style.boxShadow = `0 0 0 3px ${c.peach}20`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8e4e0'
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

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
                    border: `1.5px solid #e8e4e0`,
                    borderRadius: 16,
                    padding: '15px 18px',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    color: c.dark,
                    outline: 'none',
                    backgroundColor: c.white,
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
                    border: `1.5px solid #e8e4e0`,
                    borderRadius: 16,
                    padding: '15px 18px',
                    fontSize: 15,
                    fontFamily: 'inherit',
                    color: c.dark,
                    outline: 'none',
                    backgroundColor: c.white,
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
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16, marginTop: 28 }}>
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
                disabled={loading}
                style={{
                  flex: 1,
                  backgroundColor: c.dark,
                  color: c.white,
                  border: 'none',
                  padding: '15px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1,
                  borderRadius: 50,
                  transition: 'all 0.2s',
                  fontFamily: 'inherit',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.target.style.backgroundColor = c.charcoal
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.target.style.backgroundColor = c.dark
                }}
              >
                {loading ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </form>

          {/* Footer Note */}
          <div style={{ marginTop: 36, paddingTop: 24, borderTop: `1px solid ${c.peach}12`, textAlign: 'center' }}>
            <p style={{ color: c.taupe, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>🔒</span> Your information is secure and private
              <span style={{ width: 4, height: 4, backgroundColor: c.taupe, borderRadius: '50%', display: 'inline-block' }} />
              <span>💡</span> Update anytime in settings
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicInfoPage