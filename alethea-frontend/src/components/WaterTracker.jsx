import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

const WaterTracker = () => {
    const navigate = useNavigate()
    const [totalMl, setTotalMl] = useState(0)
    const [percentage, setPercentage] = useState(0)
    const [goalMl] = useState(2500)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTodayWater()
    }, [])

    const fetchTodayWater = async () => {
        // Check if user is logged in
        const token = localStorage.getItem('token')
        if (!token) {
            return
        }
        
        try {
            const response = await API.get('/water/today')
            setTotalMl(response.data.total_ml)
            setPercentage(response.data.percentage)
        } catch (error) {
            console.error('Error fetching water data:', error)
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
            }
        }
    }

    const addWater = async (amount) => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('/login')
            return
        }
        
        setLoading(true)
        try {
            await API.post('/water/add', { amount_ml: amount })
            fetchTodayWater()
        } catch (error) {
            console.error('Error adding water:', error)
            if (error.response?.status === 401) {
                localStorage.removeItem('token')
                navigate('/login')
            } else if (error.response?.status === 404) {
                console.warn('Water tracking endpoint not available yet')
            }
        } finally {
            setLoading(false)
        }
    }

    const presets = [250, 500, 750, 1000]

    return (
        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 20, marginBottom: 24, backgroundColor: c.white }}>
            <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 16, fontSize: 18 }}>Water Intake</h3>
            
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto' }}>
                    <svg width="120" height="120" viewBox="0 0 120 120">
                        <circle cx="60" cy="60" r="54" fill="none" stroke={`${c.peach}30`} strokeWidth="8"/>
                        <circle 
                            cx="60" cy="60" r="54" fill="none" 
                            stroke={c.peach} strokeWidth="8" 
                            strokeDasharray={2 * Math.PI * 54}
                            strokeDashoffset={2 * Math.PI * 54 * (1 - percentage / 100)}
                            strokeLinecap="round"
                            transform="rotate(-90 60 60)"
                        />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <div style={{ fontSize: 24, fontWeight: 800, color: c.dark }}>{Math.round(totalMl)}</div>
                        <div style={{ fontSize: 10, color: c.taupe }}>ml</div>
                    </div>
                </div>
                <p style={{ color: c.taupe, fontSize: 12, marginTop: 8 }}>
                    Goal: {goalMl}ml
                </p>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                {presets.map(amount => (
                    <button
                        key={amount}
                        onClick={() => addWater(amount)}
                        disabled={loading}
                        style={{
                            backgroundColor: c.dark,
                            color: c.white,
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: 20,
                            cursor: loading ? 'not-allowed' : 'pointer',
                            fontSize: 13,
                            fontWeight: 600,
                            opacity: loading ? 0.6 : 1,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = c.charcoal
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) e.currentTarget.style.backgroundColor = c.dark
                        }}
                    >
                        +{amount}ml
                    </button>
                ))}
            </div>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                <input
                    type="number"
                    id="customAmount"
                    placeholder="Custom (ml)"
                    style={{
                        flex: 1,
                        border: `1.5px solid ${c.peach}20`,
                        borderRadius: 20,
                        padding: '10px 14px',
                        fontSize: 13,
                        outline: 'none',
                        transition: 'all 0.2s',
                    }}
                    onFocus={(e) => {
                        e.target.style.borderColor = c.peach
                        e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                    }}
                    onBlur={(e) => {
                        e.target.style.borderColor = `${c.peach}20`
                        e.target.style.boxShadow = 'none'
                    }}
                />
                <button
                    onClick={() => {
                        const input = document.getElementById('customAmount')
                        const amount = parseInt(input.value)
                        if (amount > 0) {
                            addWater(amount)
                            input.value = ''
                        }
                    }}
                    style={{
                        backgroundColor: c.peach,
                        color: c.dark,
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: 13,
                        transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = c.dark
                        e.currentTarget.style.color = c.white
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = c.peach
                        e.currentTarget.style.color = c.dark
                    }}
                >
                    Add
                </button>
            </div>
        </div>
    )
}

export default WaterTracker