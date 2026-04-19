import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

const DietPlanPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [plan, setPlan] = useState(null)
    const [loading, setLoading] = useState(true)
    const [generating, setGenerating] = useState(false)
    const [error, setError] = useState('')

    const userDiet = user?.diet_type || 'Non-Veg'

    const getDietTypeLabel = (dietType) => {
        const labels = {
            'Veg': 'Vegetarian',
            'Eggitarian': 'Eggitarian',
            'Non-Veg': 'Non-Vegetarian'
        }
        return labels[dietType] || dietType
    }

    useEffect(() => {
        fetchPlan()
    }, [])

    const fetchPlan = async () => {
        try {
            const response = await API.get('/diet/plan')
            if (response.data.plan_data) {
                setPlan(response.data.plan_data)
            }
        } catch (err) {
            console.error('Error fetching plan:', err)
        } finally {
            setLoading(false)
        }
    }

    const generatePlan = async () => {
        setGenerating(true)
        setError('')
        try {
            const response = await API.post('/diet/generate')
            setPlan(response.data.plan_data)
        } catch (err) {
            setError('Failed to generate plan. Please complete your profile first.')
        } finally {
            setGenerating(false)
        }
    }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
                <p style={{ color: c.taupe }}>Loading your diet plan...</p>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <button onClick={() => navigate('/dashboard')}
                        style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
                        ← Back to Dashboard
                    </button>
                    <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Your Diet Plan</h1>
                    <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>
                        Diet Type: {getDietTypeLabel(userDiet)}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>
                {error && (
                    <div style={{ backgroundColor: '#fde8e8', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
                        {error}
                    </div>
                )}

                {!plan ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                        <div style={{ fontSize: 64, marginBottom: 24 }}>🥗</div>
                        <h2 style={{ color: c.dark, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No Diet Plan Yet</h2>
                        <p style={{ color: c.taupe, fontSize: 15, marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                            Generate your personalized AI diet plan based on your health profile and {getDietTypeLabel(userDiet)} diet.
                        </p>
                        <button onClick={generatePlan} disabled={generating}
                            style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '16px 48px', fontSize: 15, fontWeight: 700, cursor: generating ? 'not-allowed' : 'pointer', opacity: generating ? 0.6 : 1, letterSpacing: 1 }}>
                            {generating ? 'Generating...' : 'Generate My Diet Plan →'}
                        </button>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
                            {[
                                { label: 'Daily Calories', value: plan.daily_calories, unit: 'kcal', icon: '🔥' },
                                { label: 'Protein', value: plan.protein_g, unit: 'g/day', icon: '💪' },
                                { label: 'Carbs', value: plan.carbs_g, unit: 'g/day', icon: '🌾' },
                                { label: 'Fat', value: plan.fat_g, unit: 'g/day', icon: '🥑' },
                            ].map((item, i) => (
                                <div key={i} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
                                    <div style={{ fontSize: 28, marginBottom: 8 }}>{item.icon}</div>
                                    <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</p>
                                    <p style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '4px 0' }}>{item.value}</p>
                                    <p style={{ color: c.taupe, fontSize: 12 }}>{item.unit}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32, display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                            <div>
                                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Your Goal</p>
                                <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, marginTop: 4 }}>{plan.goal || 'Maintain Weight'}</p>
                            </div>
                            <div>
                                <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Diet Type</p>
                                <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, marginTop: 4 }}>{getDietTypeLabel(userDiet)}</p>
                            </div>
                        </div>

                        {plan.tips && (
                            <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
                                <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 16, marginBottom: 16 }}>💡 Nutrition Tips</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    {plan.tips.map((tip, i) => (
                                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: c.peach, flexShrink: 0, marginTop: 6 }} />
                                            <p style={{ color: c.taupe, fontSize: 14, lineHeight: 1.6 }}>{tip}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                            <button onClick={() => navigate('/weekly-meal-plan')}
                                style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px 32px', fontSize: 14, fontWeight: 700, cursor: 'pointer', letterSpacing: 1 }}>
                                View Weekly Meal Plan →
                            </button>
                            <button onClick={generatePlan} disabled={generating}
                                style={{ backgroundColor: 'transparent', color: c.taupe, border: `1.5px solid ${c.peach}`, padding: '14px 32px', fontSize: 14, cursor: 'pointer' }}>
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