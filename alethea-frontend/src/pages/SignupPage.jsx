import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/authService';

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  rose: '#e8cbc0',
  charcoal: '#2c2c2c',
};

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: '',
    role: 'user',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.full_name.trim()) {
      setError('Full name is required');
      return;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.full_name, formData.email, formData.password, formData.role);
      navigate('/login', { state: { message: 'Account created successfully! Please login.' } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
              — Join Alethea
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
            START YOUR
            <br />
            HEALTH
            <br />
            JOURNEY.
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
            Create your free account and get access to AI-powered meal tracking,
            personalized diet plans, and health predictions.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[
              'Free forever — no credit card needed',
              'AI-powered personalized diet plans',
              'Health predictions based on your data',
              'Track meals and get nutrition insights',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: c.peach,
                    flexShrink: 0,
                    boxShadow: `0 0 8px ${c.peach}`,
                  }}
                />
                <p style={{ color: c.cream, fontSize: 14, opacity: 0.9 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: c.taupe, fontSize: 12, letterSpacing: 1, position: 'relative', zIndex: 2 }}>
          © 2024 Alethea Health Coach
        </p>
      </div>

      {/* Right Panel - Signup Form */}
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
            Get Started
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
            Create Account
          </h1>
          <p style={{ color: c.taupe, fontSize: 15 }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{ color: c.dark, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 4 }}
            >
              Sign in here
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
              Account Type
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
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
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => (e.target.style.borderColor = c.peach)}
              onBlur={(e) => (e.target.style.borderColor = '#e2e0dd')}
            >
              <option value="user">👤 Regular User - Track meals, get diet plans</option>
              <option value="admin">👑 Admin User - Manage users, food database, analytics</option>
            </select>
            <p
              style={{
                color: c.taupe,
                fontSize: 12,
                marginTop: 8,
                lineHeight: 1.4,
              }}
            >
              {formData.role === 'admin'
                ? '⚠️ Admin accounts have full access to user management and system settings.'
                : 'Regular users can track meals, get diet plans, and monitor health.'}
            </p>
          </div>

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
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Min. 6 characters"
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
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm_password"
              value={formData.confirm_password}
              onChange={handleChange}
              required
              placeholder="Re-enter password"
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

          <p
            style={{
              color: c.taupe,
              fontSize: 13,
              lineHeight: 1.6,
              marginTop: 4,
            }}
          >
            By creating an account you agree to our{' '}
            <span style={{ color: c.dark, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
              Terms of Service
            </span>{' '}
            and{' '}
            <span style={{ color: c.dark, fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}>
              Privacy Policy
            </span>
            .
          </p>

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
              if (!loading) e.target.style.backgroundColor = c.charcoal;
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = c.dark;
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;