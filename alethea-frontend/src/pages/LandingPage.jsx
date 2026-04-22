import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { title: 'Smart Meal Tracking', desc: 'Log meals with AI-powered nutrition analysis' },
    { title: 'AI Diet Plans', desc: 'Personalized meal plans based on your goals' },
    { title: 'Health Analytics', desc: 'Track your progress with beautiful insights' },
    { title: 'Health Predictions', desc: 'AI forecasts your future health trends' },
    { title: 'Goal Setting', desc: 'Set and achieve your wellness targets' },
    { title: 'Fitness Integration', desc: 'Sync with your daily activities' },
  ]

  const stats = [
    { value: '10K+', label: 'Active Users' },
    { value: '50K+', label: 'Meals Logged' },
    { value: '95%', label: 'Satisfaction Rate' },
  ]

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Navbar */}
      <nav style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 50,
        transition: 'all 0.3s',
        backgroundColor: scrolled ? c.white : 'transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
        padding: '16px 0',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{
              width: 36,
              height: 36,
              backgroundColor: c.dark,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: c.white, fontWeight: 800, fontSize: 18 }}>A</span>
            </div>
            <span style={{ fontSize: 22, fontWeight: 700, color: c.dark, letterSpacing: 1 }}>Alethea</span>
          </Link>
          
          <div style={{ display: 'none', gap: 32, alignItems: 'center' }} className="nav-links">
            {['Features', 'How It Works', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ color: c.taupe, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>
                {item}
              </a>
            ))}
          </div>
          
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link to="/login" style={{ color: c.taupe, textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'color 0.2s' }}>
              Sign In
            </Link>
            <Link to="/signup" style={{
              backgroundColor: c.dark,
              color: c.white,
              padding: '10px 24px',
              borderRadius: 40,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 16px',
            backgroundColor: `${c.peach}15`,
            borderRadius: 40,
            marginBottom: 24,
          }}>
            <span style={{ color: c.peach, fontSize: 13, fontWeight: 500 }}>AI-Powered Health Coach</span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            letterSpacing: -2,
            color: c.dark,
            marginBottom: 20,
            lineHeight: 1.1,
          }}>
            Your Personal{' '}
            <span style={{ color: c.peach }}>Nutrition</span>
            <br />& Health Companion
          </h1>
          
          <p style={{
            fontSize: 18,
            color: c.taupe,
            maxWidth: 600,
            margin: '0 auto 32px',
            lineHeight: 1.6,
          }}>
            Track meals, get AI-powered diet plans, monitor health metrics, and predict future trends — all in one beautiful platform.
          </p>
          
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{
              backgroundColor: c.dark,
              color: c.white,
              padding: '14px 32px',
              borderRadius: 50,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 15,
              transition: 'all 0.2s',
            }}>
              Start Your Journey Free →
            </Link>
            <a href="#features" style={{
              backgroundColor: 'transparent',
              color: c.dark,
              padding: '14px 32px',
              borderRadius: 50,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 15,
              border: `1.5px solid ${c.peach}`,
              transition: 'all 0.2s',
            }}>
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div style={{
            marginTop: 60,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 32,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            {stats.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: c.peach, marginBottom: 8 }}>{stat.value}</div>
                <div style={{ color: c.taupe, fontSize: 14 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '80px 24px', backgroundColor: c.white }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: c.dark, marginBottom: 12, letterSpacing: -1 }}>Everything You Need</h2>
            <p style={{ color: c.taupe, fontSize: 18 }}>Powerful features to transform your health journey</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 32,
          }}>
            {features.map((feature, i) => (
              <div key={i} style={{
                padding: '28px',
                backgroundColor: c.white,
                borderRadius: 20,
                border: `1px solid ${c.peach}15`,
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: 48,
                  height: 48,
                  backgroundColor: `${c.peach}10`,
                  borderRadius: 16,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 20,
                }}>
                  <span style={{ fontSize: 20, color: c.peach, fontWeight: 600 }}>✦</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: c.dark, marginBottom: 10 }}>{feature.title}</h3>
                <p style={{ color: c.taupe, fontSize: 14, lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{ padding: '80px 24px', backgroundColor: `${c.peach}05` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: c.dark, marginBottom: 12, letterSpacing: -1 }}>Simple 3-Step Process</h2>
            <p style={{ color: c.taupe, fontSize: 18 }}>Get started in minutes</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: 48,
          }}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and set your health goals' },
              { step: '02', title: 'Track Meals', desc: 'Log what you eat with AI assistance' },
              { step: '03', title: 'Get Insights', desc: 'Receive personalized recommendations' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 80,
                  height: 80,
                  backgroundColor: c.dark,
                  borderRadius: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <span style={{ fontSize: 28, color: c.white, fontWeight: 700 }}>{item.step}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: c.dark, marginBottom: 10 }}>{item.title}</h3>
                <p style={{ color: c.taupe, fontSize: 14 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" style={{ padding: '80px 24px', backgroundColor: c.white }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 700, color: c.dark, marginBottom: 12, letterSpacing: -1 }}>What Our Users Say</h2>
            <p style={{ color: c.taupe, fontSize: 18 }}>Real people, real results</p>
          </div>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
          }}>
            {[
              { name: 'Priyanka Agarwal', role: 'Fitness Enthusiast', text: 'Alethea has completely transformed my relationship with food. The AI recommendations are spot on!' },
              { name: 'Rahul Singhal', role: 'Software Engineer', text: 'Lost 15kg in 3 months. The meal tracking is so easy and the diet plans are very practical.' },
              { name: 'Dr. Neha Bhandari', role: 'Nutritionist', text: 'I recommend Alethea to all my patients. The health predictions are surprisingly accurate.' },
            ].map((testimonial, i) => (
              <div key={i} style={{
                padding: '32px',
                backgroundColor: `${c.peach}05`,
                borderRadius: 20,
                border: `1px solid ${c.peach}10`,
                transition: 'all 0.3s',
              }}>
                <div style={{ color: c.peach, fontSize: 16, marginBottom: 20, letterSpacing: 1 }}>★ ★ ★ ★ ★</div>
                <p style={{ color: c.taupe, fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>"{testimonial.text}"</p>
                <div style={{ fontWeight: 700, color: c.dark, fontSize: 16 }}>{testimonial.name}</div>
                <div style={{ fontSize: 13, color: c.peach, marginTop: 4 }}>{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          textAlign: 'center',
          backgroundColor: c.dark,
          borderRadius: 32,
          padding: '60px 40px',
        }}>
          <h2 style={{ fontSize: 32, fontWeight: 700, color: c.white, marginBottom: 16, letterSpacing: -1 }}>
            Ready to Transform Your Health?
          </h2>
          <p style={{ color: c.taupe, fontSize: 16, marginBottom: 32, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Join thousands of users already improving their lives with Alethea
          </p>
          <Link to="/signup" style={{
            backgroundColor: c.white,
            color: c.dark,
            padding: '14px 36px',
            borderRadius: 50,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 15,
            display: 'inline-block',
            transition: 'all 0.2s',
          }}>
            Start Free Trial →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: c.dark, padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
            <div style={{
              width: 32,
              height: 32,
              backgroundColor: c.peach,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: c.dark, fontWeight: 800 }}>A</span>
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, color: c.white }}>Alethea Health Coach</span>
          </div>
          <p style={{ color: c.taupe, fontSize: 13 }}>© 2024 Alethea — Final Year Project</p>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }
      `}</style>
    </div>
  )
}

export default LandingPage