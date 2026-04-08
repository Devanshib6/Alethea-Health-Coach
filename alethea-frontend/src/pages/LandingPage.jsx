import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

const colors = {
  ice: '#B8E3E9',
  mist: '#93B1B5',
  deep: '#4F7C82',
  night: '#0B2E33',
  snow: '#F0F7F8',
  frost: '#D9ECEF',
  white: '#FFFFFF',
  charcoal: '#1A2F33',
};

const chip = {
  display: 'inline-block',
  background: colors.ice,
  color: colors.night,
  fontSize: '11px',
  fontWeight: 500,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  padding: '6px 16px',
  borderRadius: '30px',
  marginBottom: '20px',
};

const LandingPage = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{ 
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
      color: colors.night, 
      backgroundColor: colors.snow,
      overflowX: 'hidden'
    }}>

      {/* Floating Navigation */}
      <nav style={{ 
        position: 'fixed', 
        top: '20px', 
        left: '50%', 
        transform: 'translateX(-50%)',
        width: 'calc(100% - 40px)',
        maxWidth: '1200px',
        zIndex: 1000,
        backgroundColor: scrolled ? 'rgba(255,255,255,0.92)' : colors.white,
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderRadius: '80px',
        padding: '0 28px',
        boxShadow: scrolled ? '0 4px 20px rgba(11,46,51,0.08)' : '0 2px 12px rgba(11,46,51,0.05)',
        transition: 'all 0.3s ease',
        border: `1px solid ${colors.frost}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          <Link to="/" style={{ 
            fontFamily: "'Playfair Display', 'Georgia', serif", 
            fontSize: '24px', 
            fontWeight: 600, 
            letterSpacing: '-0.3px', 
            textDecoration: 'none', 
            color: colors.night
          }}>❄️ Alethea</Link>

          <div style={{ display: 'flex', gap: '32px' }}>
            {['Features', 'Process', 'Stories'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: colors.deep, 
                textDecoration: 'none',
                transition: 'color 0.2s'
              }}>{item}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <Link to="/login" style={{ 
              fontSize: '14px', 
              fontWeight: 500, 
              color: colors.deep, 
              textDecoration: 'none'
            }}>Log in</Link>
            <Link to="/signup" style={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              background: colors.night, 
              color: colors.white, 
              padding: '8px 22px', 
              borderRadius: '40px', 
              textDecoration: 'none'
            }}>Get started</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Split with winter imagery */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center',
        padding: '120px 40px 80px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={chip}>❄️ Winter wellness edition</div>
            <h1 style={{ 
              fontFamily: "'Playfair Display', 'Georgia', serif", 
              fontSize: '72px', 
              fontWeight: 600, 
              lineHeight: 1.1, 
              letterSpacing: '-0.02em', 
              marginBottom: '24px',
              color: colors.night
            }}>
              Find your calm<br />
              <span style={{ color: colors.deep, borderBottom: `3px solid ${colors.ice}` }}>in the cold</span>
            </h1>
            <p style={{ fontSize: '18px', lineHeight: 1.7, color: colors.deep, marginBottom: '40px', maxWidth: '480px' }}>
              Alethea brings warmth to your wellness journey — personalized nutrition guidance wrapped in winter's gentle embrace.
            </p>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/signup" style={{ 
                background: colors.night, 
                color: colors.white, 
                padding: '14px 32px', 
                borderRadius: '50px', 
                fontSize: '15px', 
                fontWeight: 600,
                textDecoration: 'none'
              }}>Begin your journey →</Link>
              <a href="#process" style={{ 
                fontSize: '14px', 
                fontWeight: 500, 
                color: colors.deep, 
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>❄️ How it works</a>
            </div>
            <div style={{ display: 'flex', gap: '32px', marginTop: '48px', paddingTop: '32px', borderTop: `1px solid ${colors.frost}` }}>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: colors.night }}>10k+</div>
                <div style={{ fontSize: '13px', color: colors.mist }}>Active members</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: colors.night }}>4.9★</div>
                <div style={{ fontSize: '13px', color: colors.mist }}>User rating</div>
              </div>
              <div>
                <div style={{ fontSize: '28px', fontWeight: 700, color: colors.night }}>89%</div>
                <div style={{ fontSize: '13px', color: colors.mist }}>Success rate</div>
              </div>
            </div>
          </div>
          <div style={{ 
            background: `linear-gradient(135deg, ${colors.ice} 0%, ${colors.mist} 100%)`,
            borderRadius: '60px',
            padding: '40px',
            position: 'relative'
          }}>
            <div style={{ 
              background: `rgba(255,255,255,0.9)`,
              backdropFilter: 'blur(10px)',
              borderRadius: '40px',
              padding: '32px',
              border: `1px solid ${colors.white}`
            }}>
              <div style={{ fontSize: '13px', color: colors.deep, marginBottom: '16px' }}>✨ Today's insight</div>
              <div style={{ fontSize: '20px', fontWeight: 600, marginBottom: '20px', color: colors.night }}>Your winter resilience score</div>
              <div style={{ fontSize: '56px', fontWeight: 700, color: colors.night, marginBottom: '12px' }}>87<span style={{ fontSize: '24px' }}>%</span></div>
              <div style={{ fontSize: '14px', color: colors.mist, marginBottom: '20px' }}>↑ 8% from last week</div>
              <div style={{ height: '6px', background: colors.frost, borderRadius: '3px', marginBottom: '24px' }}>
                <div style={{ width: '87%', height: '6px', background: colors.deep, borderRadius: '3px' }}></div>
              </div>
              <div style={{ fontSize: '14px', color: colors.deep, lineHeight: 1.6 }}>
                "Your consistency during colder months has improved significantly. Keep going!"
              </div>
            </div>
            <div style={{ position: 'absolute', top: -20, right: -20, fontSize: '80px', opacity: 0.3 }}>❄️</div>
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: `linear-gradient(to top, ${colors.snow}, transparent)` }}></div>
      </div>

      {/* Floating cards section - Winter benefits */}
      <div id="features" style={{ padding: '80px 40px', background: colors.white }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={chip}>❄️ Winter features</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: colors.night, marginBottom: '16px' }}>
              Nourish through the chill
            </h2>
            <p style={{ fontSize: '18px', color: colors.mist, maxWidth: '560px', margin: '0 auto' }}>
              Tools designed to keep you healthy and warm all season long
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '30px' }}>
            {[
              { icon: '🍲', title: 'Winter meal plans', desc: 'Warm, nourishing recipes optimized for cold weather nutrition.', bg: colors.snow },
              { icon: '📈', title: 'Seasonal insights', desc: 'Track how winter affects your energy and adjust accordingly.', bg: colors.snow },
              { icon: '🧣', title: 'Cold weather coach', desc: 'Tips for staying active and motivated when it\'s freezing outside.', bg: colors.snow },
              { icon: '💧', title: 'Hydration tracker', desc: 'Never forget to drink water, even when you don\'t feel thirsty.', bg: colors.snow },
              { icon: '😴', title: 'Sleep optimizer', desc: 'Better rest during longer winter nights with smart scheduling.', bg: colors.snow },
              { icon: '🎯', title: 'Habit stacking', desc: 'Build sustainable routines that stick through any weather.', bg: colors.snow },
            ].map((f, i) => (
              <div key={i} style={{ 
                background: f.bg, 
                padding: '32px', 
                borderRadius: '28px',
                border: `1px solid ${colors.frost}`,
                transition: 'transform 0.2s'
              }}>
                <div style={{ fontSize: '44px', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: colors.night }}>{f.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: colors.deep }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Process Timeline - Winter journey */}
      <div id="process" style={{ padding: '80px 40px', background: colors.frost }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={chip}>❄️ Your winter journey</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: colors.night, marginBottom: '16px' }}>
              Three steps to winter wellness
            </h2>
            <p style={{ fontSize: '18px', color: colors.deep }}>Simple. Warm. Effective.</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', flexWrap: 'wrap', gap: '20px' }}>
            {[
              { step: '01', icon: '🌨️', title: 'Embrace the season', desc: 'Share your winter goals — from staying active to eating warmer meals.' },
              { step: '02', icon: '📱', title: 'Log with ease', desc: 'Snap, speak, or type your meals. We handle the rest.' },
              { step: '03', icon: '🔥', title: 'Receive warmth', desc: 'Get cozy recommendations tailored to winter\'s unique challenges.' },
            ].map((item, i) => (
              <div key={i} style={{ flex: 1, textAlign: 'center', padding: '0 20px', position: 'relative' }}>
                {i < 2 && (
                  <div style={{ 
                    position: 'absolute', 
                    right: -30, 
                    top: '40px', 
                    fontSize: '30px', 
                    color: colors.ice,
                    display: { xs: 'none', md: 'block' }
                  }}>→</div>
                )}
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  background: colors.white, 
                  borderRadius: '50%', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  fontSize: '48px',
                  boxShadow: '0 8px 20px rgba(11,46,51,0.1)'
                }}>{item.icon}</div>
                <div style={{ fontSize: '14px', color: colors.mist, marginBottom: '12px' }}>Step {item.step}</div>
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '12px', color: colors.night }}>{item.title}</h3>
                <p style={{ fontSize: '14px', lineHeight: 1.6, color: colors.deep }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials - Winter stories */}
      <div id="stories" style={{ padding: '80px 40px', background: colors.white }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={chip}>❄️ Warm stories</div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', fontWeight: 600, color: colors.night, marginBottom: '16px' }}>
              Voices from our community
            </h2>
            <p style={{ fontSize: '18px', color: colors.mist }}>Real people, real transformations</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { quote: "Alethea made winter nutrition feel possible. The warm meal suggestions are incredible!", name: "Emma W.", role: "Yoga instructor", snowflake: "❄️" },
              { quote: "Finally, an app that understands seasonal changes. My energy levels have never been better.", name: "James L.", role: "Teacher", snowflake: "❄️" },
              { quote: "The winter resilience score keeps me motivated when I'd rather stay under blankets.", name: "Sofia R.", role: "Remote worker", snowflake: "❄️" },
            ].map((t, i) => (
              <div key={i} style={{ 
                background: colors.snow, 
                padding: '36px', 
                borderRadius: '32px', 
                border: `1px solid ${colors.frost}`,
                position: 'relative'
              }}>
                <div style={{ fontSize: '40px', position: 'absolute', top: 20, right: 20, opacity: 0.3 }}>{t.snowflake}</div>
                <div style={{ fontSize: '48px', marginBottom: '20px' }}>“</div>
                <p style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '28px', fontStyle: 'italic', color: colors.deep }}>{t.quote}</p>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '15px', color: colors.night }}>{t.name}</div>
                  <div style={{ fontSize: '13px', color: colors.mist, marginTop: '4px' }}>{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats showcase - Winter metrics */}
      <div style={{ padding: '60px 40px', background: `linear-gradient(135deg, ${colors.night} 0%, ${colors.deep} 100%)` }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
          {[
            { value: '50k+', label: 'Winter meals logged', icon: '🍲' },
            { value: '10k+', label: 'Active members', icon: '👥' },
            { value: '4.9★', label: 'App store rating', icon: '⭐' },
            { value: '94%', label: 'Would recommend', icon: '💙' },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>{stat.icon}</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '42px', fontWeight: 600, color: colors.ice, marginBottom: '8px' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: colors.mist }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA - Winter call to action */}
      <div style={{ padding: '100px 40px', background: colors.snow, textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>❄️🔥</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '52px', fontWeight: 600, color: colors.night, marginBottom: '20px', lineHeight: 1.2 }}>
            Ready to embrace winter wellness?
          </h2>
          <p style={{ fontSize: '18px', lineHeight: 1.7, color: colors.deep, marginBottom: '40px' }}>
            Join thousands finding warmth and health through the coldest months.
          </p>
          <Link to="/signup" style={{ 
            display: 'inline-block',
            background: colors.night, 
            color: colors.white, 
            padding: '16px 44px', 
            borderRadius: '60px', 
            fontSize: '16px', 
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '20px'
          }}>
            Start your winter journey →
          </Link>
          <p style={{ fontSize: '13px', color: colors.mist }}>Free for 14 days • Cancel anytime</p>
        </div>
      </div>

      {/* Footer - Winter minimal */}
      <footer style={{ padding: '48px 40px 40px', borderTop: `1px solid ${colors.frost}`, background: colors.white }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', marginBottom: '48px' }}>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', fontWeight: 600, color: colors.night, marginBottom: '12px' }}>❄️ Alethea</div>
              <p style={{ fontSize: '13px', color: colors.mist, lineHeight: 1.6 }}>Your gentle companion through every season.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: colors.night }}>Product</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Features', 'Pricing', 'Stories'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '13px', color: colors.deep, textDecoration: 'none' }}>{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: colors.night }}>Company</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['About', 'Blog', 'Careers'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '13px', color: colors.deep, textDecoration: 'none' }}>{item}</a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px', color: colors.night }}>Legal</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Privacy', 'Terms', 'Security'].map(item => (
                  <a key={item} href="#" style={{ fontSize: '13px', color: colors.deep, textDecoration: 'none' }}>{item}</a>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${colors.frost}`, paddingTop: '24px', textAlign: 'center' }}>
            <span style={{ fontSize: '12px', color: colors.mist }}>© 2024 Alethea — Winter wellness for modern lives ❄️</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default LandingPage;