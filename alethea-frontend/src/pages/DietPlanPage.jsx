import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'
import { getMyProfile } from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const DietPlanPage = () => {
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState('')

  // Fetch latest user data on page load
  useEffect(() => {
    const loadUserAndPlan = async () => {
      setLoading(true)
      try {
        // Fetch latest user profile from database
        const latestUser = await getMyProfile()
        updateUser(latestUser)
        await fetchPlan()
      } catch (err) {
        console.error('Error loading data:', err)
      } finally {
        setLoading(false)
      }
    }
    loadUserAndPlan()
  }, [])

  const fetchPlan = async () => {
    try {
      const response = await API.get('/diet/plan')
      if (response.data.plan_data) {
        setPlan(response.data.plan_data)
      }
    } catch (err) {
      console.error('Error fetching plan:', err)
    }
  }

  const generatePlan = async () => {
    setGenerating(true)
    setError('')
    try {
      // Fetch latest user data before generating
      const latestUser = await getMyProfile()
      updateUser(latestUser)
      
      const response = await API.post('/diet/generate')
      setPlan(response.data.plan_data)
    } catch (err) {
      console.error('Error generating plan:', err)
      setError('Failed to generate plan. Please complete your profile first.')
    } finally {
      setGenerating(false)
    }
  }

  const userDiet = user?.diet_type || 'non-veg'

  const getDietTypeLabel = (dietType) => {
    const labels = {
      'veg': 'Vegetarian',
      'eggitarian': 'Eggitarian',
      'non-veg': 'Non-Vegetarian',
      'Veg': 'Vegetarian',
      'Eggitarian': 'Eggitarian',
      'Non-Veg': 'Non-Vegetarian'
    }
    return labels[dietType] || dietType
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: c.taupe }}>Loading your diet plan...</p>
          <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <Link 
            to="/dashboard" 
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 13, marginBottom: 12, textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Your Diet Plan</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>
            Diet Type: {getDietTypeLabel(userDiet)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '32px' }}>
        
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            borderLeft: `4px solid #dc2626`,
            color: '#b91c1c', 
            padding: '14px 18px', 
            borderRadius: 12, 
            marginBottom: 24, 
            fontSize: 14 
          }}>
            {error}
          </div>
        )}

        {!plan ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '80px 40px',
            backgroundColor: c.white,
            borderRadius: 24,
            border: `1px solid ${c.peach}15`,
          }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              backgroundColor: `${c.peach}10`, 
              borderRadius: 40, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 24px' 
            }}>
              <span style={{ fontSize: 40 }}>🥗</span>
            </div>
            <h2 style={{ color: c.dark, fontSize: 24, fontWeight: 700, marginBottom: 12 }}>No Diet Plan Yet</h2>
            <p style={{ color: c.taupe, fontSize: 15, marginBottom: 32, maxWidth: 450, margin: '0 auto 32px' }}>
              Generate your personalized AI diet plan based on your health profile and {getDietTypeLabel(userDiet)} diet.
            </p>
            <button 
              onClick={generatePlan} 
              disabled={generating}
              style={{ 
                backgroundColor: c.dark, 
                color: c.white, 
                border: 'none', 
                padding: '14px 40px', 
                borderRadius: 40, 
                fontSize: 15, 
                fontWeight: 600, 
                cursor: generating ? 'not-allowed' : 'pointer', 
                opacity: generating ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!generating) e.currentTarget.style.backgroundColor = c.charcoal
              }}
              onMouseLeave={(e) => {
                if (!generating) e.currentTarget.style.backgroundColor = c.dark
              }}
            >
              {generating ? 'Generating...' : 'Generate My Diet Plan →'}
            </button>
          </div>
        ) : (
          <>
            {/* Nutrition Stats */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: 20, 
              marginBottom: 32 
            }}>
              {[
                { label: 'Daily Calories', value: plan.daily_calories, unit: 'kcal' },
                { label: 'Protein', value: plan.protein_g, unit: 'g / day' },
                { label: 'Carbs', value: plan.carbs_g, unit: 'g / day' },
                { label: 'Fat', value: plan.fat_g, unit: 'g / day' },
              ].map((item, i) => (
                <div key={i} style={{ 
                  backgroundColor: c.white, 
                  borderRadius: 20, 
                  padding: 24, 
                  textAlign: 'center',
                  border: `1px solid ${c.peach}15`,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                    {item.label}
                  </p>
                  <p style={{ color: c.dark, fontSize: 36, fontWeight: 800, margin: '8px 0 4px' }}>
                    {item.value}
                  </p>
                  <p style={{ color: c.taupe, fontSize: 13 }}>{item.unit}</p>
                </div>
              ))}
            </div>

            {/* Info Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: 20, 
              marginBottom: 32 
            }}>
              <div style={{ 
                backgroundColor: c.white, 
                borderRadius: 20, 
                padding: 20,
                border: `1px solid ${c.peach}15`,
              }}>
                <p style={{ color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Your Goal
                </p>
                <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, margin: 0 }}>
                  {plan.goal || 'Maintain Weight'}
                </p>
              </div>
              <div style={{ 
                backgroundColor: c.white, 
                borderRadius: 20, 
                padding: 20,
                border: `1px solid ${c.peach}15`,
              }}>
                <p style={{ color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
                  Diet Type
                </p>
                <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, margin: 0 }}>
                  {getDietTypeLabel(userDiet)}
                </p>
              </div>
            </div>

            {/* Nutrition Tips */}
            {plan.tips && plan.tips.length > 0 && (
              <div style={{ 
                backgroundColor: c.white, 
                borderRadius: 20, 
                padding: 28,
                marginBottom: 32,
                border: `1px solid ${c.peach}15`,
              }}>
                <h3 style={{ color: c.dark, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Nutrition Tips</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {plan.tips.map((tip, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: c.peach, 
                        flexShrink: 0, 
                        marginTop: 8 
                      }} />
                      <p style={{ color: c.taupe, fontSize: 14, lineHeight: 1.6, margin: 0 }}>{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <button 
                onClick={() => navigate('/weekly-meal-plan')}
                style={{ 
                  backgroundColor: c.dark, 
                  color: c.white, 
                  border: 'none', 
                  padding: '14px 32px', 
                  borderRadius: 40, 
                  fontSize: 14, 
                  fontWeight: 600, 
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
              >
                View Weekly Meal Plan →
              </button>
              <button 
                onClick={generatePlan} 
                disabled={generating}
                style={{ 
                  backgroundColor: 'transparent', 
                  color: c.taupe, 
                  border: `1.5px solid ${c.peach}`, 
                  padding: '14px 32px', 
                  borderRadius: 40, 
                  fontSize: 14, 
                  fontWeight: 500,
                  cursor: generating ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!generating) {
                    e.currentTarget.style.backgroundColor = `${c.peach}08`
                    e.currentTarget.style.borderColor = c.dark
                  }
                }}
                onMouseLeave={(e) => {
                  if (!generating) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = c.peach
                  }
                }}
              >
                {generating ? 'Regenerating...' : 'Regenerate Plan'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DietPlanPage