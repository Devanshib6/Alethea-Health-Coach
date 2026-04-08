import { Link } from 'react-router-dom'
import { useState } from 'react'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div style={{ backgroundColor: colors.white, fontFamily: "'Georgia', serif" }}>

      {/* navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: colors.white, borderBottom: `2px solid ${colors.dark}`, padding: '0 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: 3, color: colors.dark, textTransform: 'uppercase' }}>Alethea</span>

        <div className="hidden md:flex" style={{ gap: 40 }}>
          {['Features', 'How it Works', 'Testimonials'].map((item, i) => (
            <a key={i} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              style={{ color: colors.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              {item}
            </a>
          ))}
        </div>

        <div className="hidden md:flex" style={{ gap: 12, alignItems: 'center' }}>
          <Link to="/login" style={{ color: colors.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 1, fontFamily: 'sans-serif' }}>Login</Link>
          <Link to="/signup" style={{ backgroundColor: colors.dark, color: colors.white, padding: '10px 28px', textDecoration: 'none', fontSize: 13, letterSpacing: 1, fontFamily: 'sans-serif', textTransform: 'uppercase' }}>
            Get Started →
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', fontSize: 24, color: colors.dark, cursor: 'pointer' }}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ backgroundColor: colors.white, borderBottom: `1px solid ${colors.peach}`, padding: '24px 48px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Features', 'How it Works', 'Testimonials'].map((item, i) => (
            <a key={i} href={`#${item.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setMenuOpen(false)}
              style={{ color: colors.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 2, textTransform: 'uppercase' }}>{item}</a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} style={{ color: colors.taupe, textDecoration: 'none', fontSize: 13 }}>Login</Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}
            style={{ backgroundColor: colors.dark, color: colors.white, padding: '10px 20px', textDecoration: 'none', textAlign: 'center', fontSize: 13, textTransform: 'uppercase' }}>
            Get Started →
          </Link>
        </div>
      )}

      {/* hero */}
      <section style={{ backgroundColor: colors.dark, minHeight: '95vh', display: 'flex', alignItems: 'center', padding: '0 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', paddingTop: 60, paddingBottom: 60 }}>
          <p style={{ color: colors.peach, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 28 }}>
            — AI Powered Nutrition & Health Platform
          </p>
          <h1 style={{ color: colors.white, fontSize: 'clamp(3rem, 8vw, 7rem)', fontWeight: 900, lineHeight: 1, marginBottom: 32, letterSpacing: -2 }}>
            EAT SMART.<br />
            <span style={{ color: colors.peach }}>LIVE WELL.</span><br />
            FEEL GREAT.
          </h1>
          <p style={{ color: colors.taupe, fontSize: 16, maxWidth: 480, lineHeight: 1.9, fontFamily: 'sans-serif', marginBottom: 48 }}>
            Alethea is your intelligent health companion. Track meals, get AI-powered diet plans, monitor your vitals, and predict future health trends — beautifully simple.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ backgroundColor: colors.peach, color: colors.dark, padding: '16px 40px', textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              Start Free Today
            </Link>
            <a href="#features" style={{ border: `1px solid ${colors.taupe}`, color: colors.taupe, padding: '16px 40px', textDecoration: 'none', fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'sans-serif' }}>
              Explore Features
            </a>
          </div>

          {/* stats */}
          <div style={{ display: 'flex', gap: 64, marginTop: 96, flexWrap: 'wrap', borderTop: `1px solid ${colors.taupe}`, paddingTop: 40 }}>
            {[['10K+', 'Active Users'], ['500K+', 'Meals Tracked'], ['95%', 'Satisfaction Rate']].map(([val, label], i) => (
              <div key={i}>
                <p style={{ color: colors.peach, fontSize: 40, fontWeight: 900, lineHeight: 1 }}>{val}</p>
                <p style={{ color: colors.taupe, fontSize: 12, letterSpacing: 2, textTransform: 'uppercase', marginTop: 6, fontFamily: 'sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section id="features" style={{ backgroundColor: colors.white, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, flexWrap: 'wrap', gap: 20 }}>
            <div>
              <p style={{ color: colors.peach, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 12 }}>What We Offer</p>
              <h2 style={{ color: colors.dark, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>
                BUILT FOR<br />YOUR HEALTH.
              </h2>
            </div>
            <p style={{ color: colors.taupe, fontSize: 15, maxWidth: 320, lineHeight: 1.8, fontFamily: 'sans-serif' }}>
              Every feature is designed with one goal — to make your health journey smarter and easier.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 2 }}>
            {[
              { icon: '🥗', title: 'Meal Tracking', desc: 'Log your daily meals and get instant nutritional breakdowns with ease.' },
              { icon: '🤖', title: 'AI Diet Plans', desc: 'Smart personalized diet recommendations powered by machine learning.' },
              { icon: '📊', title: 'Health Analytics', desc: 'Beautiful charts to monitor your progress and spot trends.' },
              { icon: '🔮', title: 'Health Prediction', desc: 'Predict your future health using your own data and patterns.' },
              { icon: '🎯', title: 'Goal Tracking', desc: 'Define your goals and stay on track with daily progress updates.' },
              { icon: '📱', title: 'Simple Interface', desc: 'Designed for everyone — clean, fast, and intuitive to use.' },
            ].map((f, i) => (
              <div key={i} style={{ padding: 36, border: `1px solid ${colors.peach}`, backgroundColor: i % 2 === 0 ? colors.white : colors.dark }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = colors.peach}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = i % 2 === 0 ? colors.white : colors.dark}>
                <p style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</p>
                <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: -0.5, marginBottom: 10, color: i % 2 === 0 ? colors.dark : colors.white }}>{f.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.8, fontFamily: 'sans-serif', color: i % 2 === 0 ? colors.taupe : colors.taupe }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* how it works */}
      <section id="how-it-works" style={{ backgroundColor: colors.peach, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: colors.dark, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 12, opacity: 0.6 }}>Simple Process</p>
          <h2 style={{ color: colors.dark, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: -1, marginBottom: 64 }}>
            THREE STEPS.<br />THAT'S IT.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32 }}>
            {[
              { step: '01', title: 'Create Account', desc: 'Sign up and fill in your personal health profile and set your goals.' },
              { step: '02', title: 'Log Your Meals', desc: 'Track everything you eat daily and let our AI analyze your nutrition.' },
              { step: '03', title: 'Get Insights', desc: 'Receive smart recommendations and future health predictions.' },
            ].map((item, i) => (
              <div key={i} style={{ borderTop: `3px solid ${colors.dark}`, paddingTop: 28 }}>
                <p style={{ fontSize: 56, fontWeight: 900, color: colors.dark, opacity: 0.15, lineHeight: 1, marginBottom: 12 }}>{item.step}</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: colors.dark, marginBottom: 12, letterSpacing: -0.5 }}>{item.title}</h3>
                <p style={{ fontSize: 14, color: colors.dark, lineHeight: 1.8, fontFamily: 'sans-serif', opacity: 0.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* testimonials */}
      <section id="testimonials" style={{ backgroundColor: colors.dark, padding: '100px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ color: colors.peach, fontSize: 11, letterSpacing: 5, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 12 }}>User Reviews</p>
          <h2 style={{ color: colors.white, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: -1, marginBottom: 64 }}>
            REAL PEOPLE.<br />REAL RESULTS.
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Sarah K.', role: 'Fitness Enthusiast', text: 'Alethea completely changed how I think about food. The AI recommendations are always spot on.' },
              { name: 'Raj M.', role: 'Software Engineer', text: 'Lost 8kg in 3 months just following the meal plans. Simple, effective, and beautiful.' },
              { name: 'Priya T.', role: 'Nutritionist', text: 'I recommend Alethea to all my clients. The health predictions are genuinely impressive.' },
            ].map((t, i) => (
              <div key={i} style={{ border: `1px solid ${colors.taupe}`, padding: 36 }}>
                <p style={{ color: colors.taupe, fontSize: 32, marginBottom: 16, lineHeight: 1 }}>"</p>
                <p style={{ color: colors.white, fontSize: 15, lineHeight: 1.9, fontStyle: 'italic', marginBottom: 28, fontFamily: 'sans-serif' }}>{t.text}</p>
                <div style={{ borderTop: `1px solid ${colors.taupe}`, paddingTop: 20 }}>
                  <p style={{ color: colors.peach, fontWeight: 800, fontSize: 14 }}>{t.name}</p>
                  <p style={{ color: colors.taupe, fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'sans-serif', marginTop: 4 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* cta */}
      <section style={{ backgroundColor: colors.white, padding: '100px 48px', borderTop: `2px solid ${colors.dark}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 40 }}>
          <h2 style={{ color: colors.dark, fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: -1 }}>
            READY TO<br />START YOUR<br />JOURNEY?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <p style={{ color: colors.taupe, fontSize: 15, maxWidth: 320, lineHeight: 1.8, fontFamily: 'sans-serif' }}>
              Join thousands of users already transforming their health with Alethea. It is completely free to start.
            </p>
            <Link to="/signup" style={{ backgroundColor: colors.dark, color: colors.white, padding: '16px 40px', textDecoration: 'none', fontWeight: 700, fontSize: 14, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'sans-serif', display: 'inline-block' }}>
              Create Free Account →
            </Link>
          </div>
        </div>
      </section>

      {/* footer with Open Food Facts attribution */}
      <footer style={{ backgroundColor: colors.dark, padding: '32px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ backgroundColor: colors.peach, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: colors.dark, fontWeight: 'bold', fontSize: 14 }}>A</span>
          </div>
          <span style={{ color: colors.white, fontWeight: 700, letterSpacing: 1 }}>ALETHEA</span>
        </div>
        <p style={{ color: colors.taupe, fontSize: 13 }}>© 2024 Alethea Health Coach — Final Year Project</p>
        <p style={{ color: colors.taupe, fontSize: 11, textAlign: 'center' }}>
          Food data provided by{' '}
          <a 
            href="https://openfoodfacts.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ color: colors.peach, textDecoration: 'none' }}
          >
            Open Food Facts
          </a>
        </p>
      </footer>

    </div>
  )
}

export default LandingPage