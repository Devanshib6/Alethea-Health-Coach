import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser } from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const SignupPage = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

 const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirm_password) {
        setError('Passwords do not match.')
        return
    }

    if (formData.password.length < 6) {
        setError('Password must be at least 6 characters.')
        return
    }

    setLoading(true)
    try {
        await registerUser(formData.full_name, formData.email, formData.password)
        // After registration, redirect to login
        navigate('/login?registered=true')
    } catch (err) {
        setError(err.response?.data?.detail || 'Registration failed. Please try again.')
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
            — Join Alethea
          </p>
          <h2 style={{ color: c.white, fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 900, lineHeight: 1, letterSpacing: -2, marginBottom: 24 }}>
            START YOUR<br />HEALTH<br />JOURNEY.
          </h2>
          <p style={{ color: c.taupe, fontSize: 15, lineHeight: 1.9, fontFamily: 'sans-serif', maxWidth: 340 }}>
            Create your free account and get access to AI-powered meal tracking, personalized diet plans, and health predictions.
          </p>

          <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['Free forever — no credit card needed', 'AI-powered personalized diet plans', 'Health predictions based on your data'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.peach, flexShrink: 0 }} />
                <p style={{ color: c.taupe, fontSize: 14, fontFamily: 'sans-serif' }}>{item}</p>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: c.taupe, fontSize: 12, fontFamily: 'sans-serif', letterSpacing: 1 }}>© 2024 Alethea Health Coach</p>
      </div>

      {/* right panel */}
      <div style={{ flex: 1, backgroundColor: c.white, padding: '60px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center', overflowY: 'auto' }}>

        {/* mobile logo */}
        <Link to="/" style={{ color: c.dark, fontWeight: 900, fontSize: 20, letterSpacing: 3, textTransform: 'uppercase', textDecoration: 'none', marginBottom: 48, display: 'block' }} className="md:hidden">
          Alethea
        </Link>

        <p style={{ color: c.peach, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 16 }}>
          New Account
        </p>
        <h1 style={{ color: c.dark, fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, letterSpacing: -1, marginBottom: 8 }}>
          Create Account
        </h1>
        <p style={{ color: c.taupe, fontSize: 14, fontFamily: 'sans-serif', marginBottom: 48 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: c.dark, fontWeight: 700, textDecoration: 'underline' }}>Sign in here</Link>
        </p>

        {error && (
          <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', fontSize: 14, fontFamily: 'sans-serif', marginBottom: 24 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, fontFamily: 'sans-serif', marginBottom: 8 }}>
              Full Name
            </label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '12px 0', fontSize: 15, fontFamily: 'sans-serif', color: c.dark, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
            />
          </div>

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
              style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '12px 0', fontSize: 15, fontFamily: 'sans-serif', color: c.dark, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
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
              placeholder="Min. 6 characters"
              style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '12px 0', fontSize: 15, fontFamily: 'sans-serif', color: c.dark, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, fontFamily: 'sans-serif', marginBottom: 8 }}>
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
              style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '12px 0', fontSize: 15, fontFamily: 'sans-serif', color: c.dark, outline: 'none', backgroundColor: 'transparent', boxSizing: 'border-box' }}
            />
          </div>

          <p style={{ color: c.taupe, fontSize: 12, fontFamily: 'sans-serif', lineHeight: 1.7 }}>
            By creating an account you agree to our{' '}
            <span style={{ color: c.dark, textDecoration: 'underline', cursor: 'pointer' }}>Terms of Service</span>{' '}
            and{' '}
            <span style={{ color: c.dark, textDecoration: 'underline', cursor: 'pointer' }}>Privacy Policy</span>.
          </p>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: c.dark, color: c.white, padding: '16px', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'sans-serif', fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, marginTop: 8 }}>
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage