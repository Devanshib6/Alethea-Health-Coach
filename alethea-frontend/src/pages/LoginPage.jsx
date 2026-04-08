import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser, getMyProfile } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
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
        console.log('Login response:', data)
        
        // Step 2: Store token in localStorage IMMEDIATELY
        const token = data.access_token
        localStorage.setItem('token', token)
        console.log('Token stored:', token)
        
        // Step 3: Now get profile (token will be in headers because of interceptor)
        const profile = await getMyProfile()
        console.log('Profile loaded:', profile)
        
        // Step 4: Update auth context
        login(token, profile)
        
        // Step 5: Check if profile is complete (has basic info)
        const isProfileComplete = profile.full_name && profile.age && profile.height && profile.weight
        
        if (isProfileComplete) {
            // Profile complete, go to dashboard
            navigate('/dashboard')
        } else {
            // Profile incomplete, start profile setup
            navigate('/basic-info')
        }
    } catch (err) {
        console.error('Login error:', err)
        setError(err.response?.data?.detail || 'Login failed. Please try again.')
        localStorage.removeItem('token')
    } finally {
        setLoading(false)
    }
}

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Georgia', serif" }}>

      {/* left panel */}
      <div style={{ flex: 1, backgroundColor: c.dark, padding: '60px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }} className="hidden md:flex">
        <Link to="/" style={{ color: c.white, fontWeight: 900, fontSize: 22, letterSpacing: 3, textTransform: 'uppercase', textDecoration: 'none' }}>
          Alethea
        </Link>
        <div>
          <p style={{ color: c.peach, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 20 }}>
            — Welcome Back
          </p>
          <h2 style={{ color: c.white, fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginBottom: 24 }}>
            YOUR HEALTH<br />JOURNEY<br />CONTINUES.
          </h2>
          <p style={{ color: c.taupe, fontSize: 15, lineHeight: 1.9, fontFamily: 'sans-serif', maxWidth: 340 }}>
            Log in to access your personalized meal plans, health analytics, and AI-powered recommendations.
          </p>
        </div>
        <p style={{ color: c.taupe, fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 1 }}>© 2024 Alethea Health Coach</p>
      </div>

      {/* right panel */}
      <div style={{ flex: 1, backgroundColor: c.white, padding: '60px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

        {/* mobile logo */}
        <Link to="/" style={{ color: c.dark, fontWeight: 900, fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', textDecoration: 'none', marginBottom: 48, display: 'block' }} className="md:hidden">
          Alethea
        </Link>

        <p style={{ color: c.peach, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 16 }}>
          Account Access
        </p>
        <h1 style={{ color: c.dark, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>
          Sign In
        </h1>
        <p style={{ color: c.taupe, fontSize: 14, fontFamily: 'sans-serif', marginBottom: 48 }}>
          Don't have an account?{' '}
          <Link to="/signup" style={{ color: c.dark, fontWeight: 700, textDecoration: 'underline' }}>Create one free</Link>
        </p>

        {error && (
          <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', fontSize: 14, fontFamily: 'sans-serif', marginBottom: 24 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, fontFamily: 'sans-serif', marginBottom: 8 }}>
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              style={{ width: '100%', borderBottom: `2px solid ${c.dark}`, border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '12px 0', fontSize: 15, fontFamily: 'sans-serif', color: c.dark, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, fontFamily: 'sans-serif', marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '12px 0', fontSize: 15, fontFamily: 'sans-serif', color: c.dark, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'sans-serif', fontSize: 13 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, color: c.taupe, cursor: 'pointer' }}>
              <input type="checkbox" style={{ accentColor: c.dark }} />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ color: c.taupe, textDecoration: 'underline', fontSize: 13 }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: c.dark, color: c.white, padding: '16px', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, marginTop: 8 }}>
            {loading ? 'Signing In...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage