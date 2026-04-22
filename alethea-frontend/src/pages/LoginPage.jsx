import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, getMyProfile } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  rose: '#e8cbc0',
  charcoal: '#2c2c2c',
}

// Check if user has completed profile setup
const isProfileComplete = (user) => {
  return user && user.age && user.height && user.weight && user.goal && user.diet_type
}

const LoginPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Step 1: Login to get token
      const data = await loginUser(formData.email, formData.password)
      
      // Step 2: Save token to localStorage
      localStorage.setItem('token', data.access_token)
      
      // Step 3: Get user profile with role and profile data
      const profile = await getMyProfile()
      
      // Step 4: Store in context
      login(data.access_token, profile)
      
      // Step 5: Redirect based on role AND profile completion
      if (profile.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        // Check if profile is complete
        if (isProfileComplete(profile)) {
          navigate('/dashboard')
        } else {
          navigate('/basic-info')
        }
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Left Panel - Brand & Info */}
      <div
        style={{
          flex: 1,
          background: `linear-gradient(135deg, ${c.dark} 0%, #2d1a1a 100%)`,
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
        className="hidden md:flex"
      >
        {/* Decorative abstract shapes */}
        <div
          style={{
            position: 'absolute',
            top: -80,
            right: -80,
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.peach}30, transparent)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            left: -60,
            width: 180,
            height: 180,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c.taupe}30, transparent)`,
          }}
        />

        <Link
          to="/"
          style={{
            color: c.white,
            fontWeight: 700,
            fontSize: 28,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textDecoration: 'none',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Alethea
        </Link>

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: 32 }}>
            <span
              style={{
                color: c.peach,
                fontSize: 12,
                letterSpacing: 4,
                textTransform: 'uppercase',
                fontWeight: 500,
                background: `${c.white}10`,
                padding: '6px 14px',
                borderRadius: 40,
                display: 'inline-block',
              }}
            >
              — Welcome Back
            </span>
          </div>

          <h2
            style={{
              color: c.white,
              fontSize: 'clamp(2.8rem, 5vw, 4.5rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              letterSpacing: -2,
              marginBottom: 28,
            }}
          >
            YOUR HEALTH
            <br />
            JOURNEY
            <br />
            CONTINUES.
          </h2>

          <p
            style={{
              color: c.cream,
              fontSize: 15,
              lineHeight: 1.7,
              maxWidth: 360,
              opacity: 0.85,
              marginBottom: 48,
            }}
          >
            Log in to access your personalized meal plans, health analytics, and AI-powered recommendations.
          </p>

          {/* Profile completion info */}
          <div
            style={{
              padding: 20,
              background: `${c.white}08`,
              borderRadius: 16,
              borderLeft: `3px solid ${c.peach}`,
            }}
          >
            <p style={{ color: c.white, fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
              📝 New User?
            </p>
            <p style={{ color: c.taupe, fontSize: 13, lineHeight: 1.5 }}>
              First time logging in? You'll be guided through profile setup to personalize your experience.
            </p>
          </div>
        </div>

        <p style={{ color: c.taupe, fontSize: 12, letterSpacing: 1, position: 'relative', zIndex: 2 }}>
          © 2024 Alethea Health Coach
        </p>
      </div>

      {/* Right Panel - Login Form */}
      <div
        style={{
          flex: 1,
          backgroundColor: c.cream,
          padding: '48px 56px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        <Link
          to="/"
          style={{
            color: c.dark,
            fontWeight: 700,
            fontSize: 24,
            letterSpacing: 2,
            textTransform: 'uppercase',
            textDecoration: 'none',
            marginBottom: 32,
            display: 'inline-block',
          }}
          className="md:hidden"
        >
          Alethea
        </Link>

        <div style={{ marginBottom: 40 }}>
          <span
            style={{
              color: c.peach,
              fontSize: 12,
              letterSpacing: 3,
              textTransform: 'uppercase',
              fontWeight: 600,
              background: `${c.peach}15`,
              padding: '4px 12px',
              borderRadius: 40,
              display: 'inline-block',
              marginBottom: 20,
            }}
          >
            Account Access
          </span>
          <h1
            style={{
              color: c.dark,
              fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
              fontWeight: 800,
              letterSpacing: -1,
              marginBottom: 12,
            }}
          >
            Sign In
          </h1>
          <p style={{ color: c.taupe, fontSize: 15 }}>
            Don't have an account?{' '}
            <Link
              to="/signup"
              style={{ color: c.dark, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              Create one free
            </Link>
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              borderLeft: `4px solid ${c.peach}`,
              color: '#b91c1c',
              padding: '14px 18px',
              fontSize: 14,
              marginBottom: 28,
              borderRadius: 12,
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 440 }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: 0.5,
                textTransform: 'uppercase',
                color: c.dark,
                marginBottom: 8,
              }}
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={{
                width: '100%',
                border: '1px solid #e2e0dd',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 15,
                fontFamily: 'inherit',
                color: c.dark,
                outline: 'none',
                backgroundColor: c.white,
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = c.peach)}
              onBlur={(e) => (e.target.style.borderColor = '#e2e0dd')}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  textTransform: 'uppercase',
                  color: c.dark,
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  color: c.taupe,
                  fontSize: 12,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                border: '1px solid #e2e0dd',
                borderRadius: 12,
                padding: '14px 16px',
                fontSize: 15,
                fontFamily: 'inherit',
                color: c.dark,
                outline: 'none',
                backgroundColor: c.white,
                transition: 'all 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = c.peach)}
              onBlur={(e) => (e.target.style.borderColor = '#e2e0dd')}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
            <input
              type="checkbox"
              id="remember"
              style={{
                width: 18,
                height: 18,
                accentColor: c.dark,
                cursor: 'pointer',
              }}
            />
            <label
              htmlFor="remember"
              style={{
                color: c.taupe,
                fontSize: 14,
                cursor: 'pointer',
              }}
            >
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: c.dark,
              color: c.white,
              padding: '16px 24px',
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              border: 'none',
              borderRadius: 40,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
              marginTop: 8,
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = c.charcoal
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = c.dark
            }}
          >
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>

        {/* Demo credentials hint */}
        <div
          style={{
            marginTop: 32,
            padding: '16px 20px',
            background: `${c.peach}10`,
            borderRadius: 12,
            maxWidth: 440,
            border: `1px solid ${c.peach}20`,
          }}
        >
          <p style={{ color: c.dark, fontSize: 12, marginBottom: 8, fontWeight: 600, letterSpacing: 0.5 }}>
            🔐 Demo Credentials
          </p>
          <p style={{ color: c.taupe, fontSize: 12, marginBottom: 4 }}>
            <strong>Email:</strong> test@example.com
          </p>
          <p style={{ color: c.taupe, fontSize: 12 }}>
            <strong>Password:</strong> test123
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage