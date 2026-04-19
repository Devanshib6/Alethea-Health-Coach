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

const BasicInfoPage = () => {
    const navigate = useNavigate()
    const { user, login, updateUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        age: '',
        gender: '',
        height: '',
        weight: '',
    })

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                age: user.age || '',
                gender: user.gender || '',
                height: user.height || '',
                weight: user.weight || '',
            })
        }
    }, [user])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const updatedUser = await updateProfile({
                full_name: formData.full_name,
                age: formData.age ? parseInt(formData.age) : null,
                gender: formData.gender || null,
                height: formData.height ? parseFloat(formData.height) : null,
                weight: formData.weight ? parseFloat(formData.weight) : null,
            })
            
            // Refresh user data
            const freshUser = await getMyProfile()
            updateUser(freshUser)
            
            // Redirect to goals page
            navigate('/goals-health')
        } catch (error) {
            console.error('Failed to save:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSkip = () => {
        navigate('/dashboard')
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
                <div style={{ maxWidth: 600, margin: '0 auto' }}>
                    <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Basic Information</h1>
                    <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Tell us about yourself</p>
                </div>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 32px' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    <div>
                        <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="full_name"
                            value={formData.full_name}
                            onChange={handleChange}
                            required
                            style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent' }}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>
                                Age
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="e.g., 25"
                                style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>
                                Gender
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent' }}
                            >
                                <option value="">Select gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>
                                Height (cm)
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                placeholder="e.g., 170"
                                style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent' }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: c.taupe, marginBottom: 8 }}>
                                Weight (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                placeholder="e.g., 70"
                                style={{ width: '100%', border: 'none', borderBottom: `2px solid ${c.dark}`, padding: '10px 0', fontSize: 15, outline: 'none', backgroundColor: 'transparent' }}
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, marginTop: 20 }}>
                        <button
                            type="button"
                            onClick={handleSkip}
                            style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '14px', fontSize: 14, cursor: 'pointer', borderRadius: 4 }}
                        >
                            Skip
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{ flex: 1, backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px', fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, borderRadius: 4 }}
                        >
                            {loading ? 'Saving...' : 'Continue →'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default BasicInfoPage