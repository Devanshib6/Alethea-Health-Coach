import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { updateProfile, getMyProfile } from '../services/authService'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

const DietaryPreferencesPage = () => {
    const navigate = useNavigate()
    const { user, updateUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        diet_type: '',
        allergies: '',
    })

    useEffect(() => {
        if (user) {
            setFormData({
                diet_type: user.diet_type || '',
                allergies: user.allergies || '',
            })
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleDietSelect = (dietType) => {
        setFormData({ ...formData, diet_type: dietType })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            await updateProfile({
                diet_type: formData.diet_type,
                allergies: formData.allergies || null,
            })
            
            const freshUser = await getMyProfile()
            updateUser(freshUser)
            
            navigate('/dashboard')
        } catch (error) {
            console.error('Failed to save dietary preferences:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSkip = () => {
        navigate('/dashboard')
    }

    const dietOptions = [
        { 
            value: 'veg', 
            label: 'Vegetarian', 
            icon: '🥗',
            description: 'No meat, fish, or eggs. Includes dairy and plant-based foods.'
        },
        { 
            value: 'non-veg', 
            label: 'Non-Vegetarian', 
            icon: '🍗',
            description: 'Includes meat, fish, eggs, and all other foods.'
        },
        { 
            value: 'eggitarian', 
            label: 'Eggitarian', 
            icon: '🥚',
            description: 'No meat or fish, but includes eggs and dairy products.'
        },
    ]

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Dietary Preferences</h1>
                    <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Tell us about your eating habits</p>
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>
                <form onSubmit={handleSubmit}>
                    {/* Diet Type Selection */}
                    <div style={{ marginBottom: 32 }}>
                        <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 16, fontSize: 18 }}>Diet Type</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
                            {dietOptions.map((option) => (
                                <div
                                    key={option.value}
                                    onClick={() => handleDietSelect(option.value)}
                                    style={{
                                        border: formData.diet_type === option.value 
                                            ? `2px solid ${c.peach}` 
                                            : `1.5px solid ${c.taupe}30`,
                                        borderRadius: 12,
                                        padding: 20,
                                        cursor: 'pointer',
                                        backgroundColor: formData.diet_type === option.value 
                                            ? `${c.peach}10` 
                                            : c.white,
                                        transition: 'all 0.2s',
                                        textAlign: 'center'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.borderColor = c.peach}
                                    onMouseLeave={e => {
                                        if (formData.diet_type !== option.value) {
                                            e.currentTarget.style.borderColor = `${c.taupe}30`
                                        }
                                    }}
                                >
                                    <div style={{ fontSize: 40, marginBottom: 12 }}>{option.icon}</div>
                                    <h4 style={{ color: c.dark, fontWeight: 700, marginBottom: 8, fontSize: 16 }}>
                                        {option.label}
                                    </h4>
                                    <p style={{ color: c.taupe, fontSize: 12, lineHeight: 1.5, margin: 0 }}>
                                        {option.description}
                                    </p>
                                    {formData.diet_type === option.value && (
                                        <div style={{ 
                                            marginTop: 12, 
                                            color: c.peach, 
                                            fontSize: 20,
                                            fontWeight: 600
                                        }}>
                                            ✓ Selected
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Allergies */}
                    <div style={{ marginBottom: 32 }}>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>
                            Allergies / Intolerances
                        </label>
                        <input
                            type="text"
                            name="allergies"
                            value={formData.allergies}
                            onChange={handleChange}
                            placeholder="e.g., nuts, dairy, gluten, shellfish"
                            style={{ 
                                width: '100%', 
                                border: 'none', 
                                borderBottom: `2px solid ${c.dark}`, 
                                padding: '12px 0', 
                                fontSize: 15, 
                                outline: 'none', 
                                backgroundColor: 'transparent',
                                fontFamily: 'sans-serif'
                            }}
                        />
                        <p style={{ color: c.taupe, fontSize: 12, marginTop: 6 }}>
                            Separate multiple items with commas
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                        <button
                            type="button"
                            onClick={handleSkip}
                            style={{ 
                                flex: 1, 
                                backgroundColor: 'transparent', 
                                border: `1.5px solid ${c.peach}`, 
                                color: c.taupe, 
                                padding: '14px', 
                                fontSize: 14, 
                                cursor: 'pointer',
                                borderRadius: 8,
                                fontWeight: 600
                            }}
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !formData.diet_type}
                            style={{ 
                                flex: 1, 
                                backgroundColor: c.dark, 
                                color: c.white, 
                                border: 'none', 
                                padding: '14px', 
                                fontSize: 14, 
                                fontWeight: 700, 
                                cursor: (loading || !formData.diet_type) ? 'not-allowed' : 'pointer', 
                                opacity: (loading || !formData.diet_type) ? 0.6 : 1,
                                borderRadius: 8
                            }}
                        >
                            {loading ? 'Saving...' : 'Complete Setup →'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default DietaryPreferencesPage