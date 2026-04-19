import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useMeals } from '../context/MealContext'
import API from '../services/authService'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

const DashboardPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { meals, fetchMeals } = useMeals()
    const [stats, setStats] = useState({
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        mealsByType: {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            snack: 0
        }
    })
    const [recentMeals, setRecentMeals] = useState([])
    const [healthScore, setHealthScore] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            await fetchMeals()
            await fetchHealthScore()
            setLoading(false)
        }
        loadData()
    }, [])

    useEffect(() => {
        if (meals && meals.length > 0) {
            calculateStats()
            setRecentMeals(meals.slice(0, 5))
        } else if (meals && meals.length === 0) {
            setLoading(false)
        }
    }, [meals])

    const fetchHealthScore = async () => {
        try {
            const response = await API.get('/health/predict')
            if (response.data && response.data.prediction) {
                setHealthScore(response.data.prediction)
            }
        } catch (error) {
            console.error('Error fetching health score:', error)
        }
    }

    const calculateStats = () => {
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFat = 0
        let mealsByType = {
            breakfast: 0,
            lunch: 0,
            dinner: 0,
            snack: 0
        }

        if (meals && meals.length > 0) {
            meals.forEach(meal => {
                totalCalories += meal.calories || 0
                totalProtein += meal.protein || 0
                totalCarbs += meal.carbs || 0
                totalFat += meal.fat || 0
                
                const mealType = (meal.meal_type || '').toLowerCase()
                if (mealsByType.hasOwnProperty(mealType)) {
                    mealsByType[mealType]++
                }
            })
        }

        setStats({
            totalCalories,
            totalProtein,
            totalCarbs,
            totalFat,
            mealsByType
        })
    }

    const getMealTypeIcon = (type) => {
        const lowerType = (type || '').toLowerCase()
        switch(lowerType) {
            case 'breakfast':
            case 'morning':
                return '🍳'
            case 'lunch': return '☀️'
            case 'dinner': return '🌙'
            case 'snack': return '🍎'
            default: return '🍽️'
        }
    }

    const getMealTypeName = (type) => {
        const lowerType = (type || '').toLowerCase()
        switch(lowerType) {
            case 'breakfast':
            case 'morning':
                return 'Breakfast'
            case 'lunch': return 'Lunch'
            case 'dinner': return 'Dinner'
            case 'snack': return 'Snack'
            default: return type || 'Meal'
        }
    }

    const getHealthScoreColor = (score) => {
        if (score >= 80) return '#22c55e'
        if (score >= 60) return '#f59e0b'
        return '#ef4444'
    }

    // Show loading state
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: c.taupe }}>Loading your dashboard...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            
            {/* Header */}
            <div style={{ backgroundColor: c.dark, padding: '24px 32px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div>
                            <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>
                                Welcome back, {user?.full_name?.split(' ')[0] || 'User'}!
                            </h1>
                            <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>
                                Track your nutrition and stay healthy
                            </p>
                        </div>
                        <button 
                            onClick={() => navigate('/log-meal')}
                            style={{ backgroundColor: c.peach, color: c.dark, border: 'none', padding: '12px 24px', borderRadius: 8, fontWeight: 700, cursor: 'pointer' }}>
                            + Log Meal
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px' }}>

                {/* Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                    {[
                        { label: 'Total Calories', value: Math.round(stats.totalCalories), unit: 'kcal', icon: '🔥', color: c.peach },
                        { label: 'Total Protein', value: Math.round(stats.totalProtein), unit: 'g', icon: '💪', color: c.taupe },
                        { label: 'Total Carbs', value: Math.round(stats.totalCarbs), unit: 'g', icon: '🌾', color: c.dark },
                        { label: 'Total Fat', value: Math.round(stats.totalFat), unit: 'g', icon: '🥑', color: '#b45309' },
                    ].map((stat, i) => (
                        <div key={i} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 20, backgroundColor: c.white }}>
                            <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
                            <p style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, margin: 0 }}>{stat.label}</p>
                            <p style={{ color: stat.color, fontSize: 32, fontWeight: 800, margin: '4px 0 0', lineHeight: 1 }}>{stat.value}</p>
                            <p style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>{stat.unit}</p>
                        </div>
                    ))}
                </div>

                {/* Two Column Layout */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 32 }}>
                    
                    {/* Left Column - Meal Distribution */}
                    <div>
                        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
                            <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 20, fontSize: 18 }}>📊 Meal Distribution</h3>
                            {meals && meals.length === 0 ? (
                                <p style={{ color: c.taupe, textAlign: 'center', padding: '20px 0' }}>No meals logged yet</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {Object.entries(stats.mealsByType).map(([type, count]) => (
                                        <div key={type}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                                <span style={{ color: c.taupe, fontSize: 13 }}>
                                                    {getMealTypeIcon(type)} {getMealTypeName(type)}
                                                </span>
                                                <span style={{ color: c.dark, fontWeight: 700, fontSize: 13 }}>{count} meals</span>
                                            </div>
                                            <div style={{ height: 8, backgroundColor: `${c.peach}30`, borderRadius: 4 }}>
                                                <div style={{ 
                                                    height: 8, 
                                                    backgroundColor: c.peach, 
                                                    borderRadius: 4, 
                                                    width: meals.length ? `${(count / meals.length) * 100}%` : '0%',
                                                    transition: 'width 0.5s'
                                                }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Health Score Card */}
                        {healthScore && healthScore.health_score !== undefined && (
                            <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                                <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 20, fontSize: 18 }}>❤️ Health Score</h3>
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ 
                                        width: 120, 
                                        height: 120, 
                                        borderRadius: '50%', 
                                        border: `8px solid ${getHealthScoreColor(healthScore.health_score)}`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px'
                                    }}>
                                        <span style={{ fontSize: 36, fontWeight: 900, color: getHealthScoreColor(healthScore.health_score) }}>
                                            {healthScore.health_score}
                                        </span>
                                    </div>
                                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 16 }}>
                                        {healthScore.health_score >= 80 ? 'Excellent' : healthScore.health_score >= 60 ? 'Good' : 'Needs Attention'}
                                    </p>
                                    <p style={{ color: c.taupe, fontSize: 13, marginTop: 8 }}>
                                        Based on {healthScore.total_records || 0} health records
                                    </p>
                                    <button 
                                        onClick={() => navigate('/health-prediction')}
                                        style={{ marginTop: 16, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '8px 20px', borderRadius: 20, cursor: 'pointer', fontSize: 12 }}>
                                        View Details →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column - Recent Meals */}
                    <div>
                        <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                                <h3 style={{ color: c.dark, fontWeight: 800, margin: 0, fontSize: 18 }}>🕒 Recent Meals</h3>
                                <button 
                                    onClick={() => navigate('/meal-history')}
                                    style={{ color: c.peach, fontSize: 12, background: 'none', border: 'none', cursor: 'pointer' }}>
                                    View All →
                                </button>
                            </div>
                            
                            {recentMeals.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                    <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
                                    <p style={{ color: c.taupe, fontSize: 14 }}>No meals logged yet</p>
                                    <button 
                                        onClick={() => navigate('/log-meal')}
                                        style={{ marginTop: 16, backgroundColor: c.dark, color: c.white, border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>
                                        Log Your First Meal
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    {recentMeals.map((meal, i) => (
                                        <div key={i} style={{ borderBottom: i < recentMeals.length - 1 ? `1px solid ${c.peach}20` : 'none', paddingBottom: i < recentMeals.length - 1 ? 12 : 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                                        <span style={{ fontSize: 12, color: c.peach }}>
                                                            {getMealTypeIcon(meal.meal_type)} {getMealTypeName(meal.meal_type)}
                                                        </span>
                                                        <span style={{ fontSize: 10, color: c.taupe }}>
                                                            {new Date(meal.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p style={{ color: c.dark, fontWeight: 600, margin: 0, fontSize: 14 }}>{meal.food_name}</p>
                                                    <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
                                                        <span style={{ color: c.taupe, fontSize: 11 }}>🔥 {Math.round(meal.calories || 0)} kcal</span>
                                                        <span style={{ color: c.taupe, fontSize: 11 }}>💪 {meal.protein || 0}g</span>
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => navigate('/log-meal')}
                                                    style={{ color: c.peach, fontSize: 11, background: 'none', border: 'none', cursor: 'pointer' }}>
                                                    Log Similar
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                            {[
                                { label: 'Log Meal', icon: '🍽️', path: '/log-meal', color: c.dark },
                                { label: 'View Diet Plan', icon: '🥗', path: '/diet-plan', color: c.taupe },
                                { label: 'Health Prediction', icon: '❤️', path: '/health-prediction', color: c.peach },
                                { label: 'Profile Settings', icon: '⚙️', path: '/profile-settings', color: '#b45309' },
                            ].map((action, i) => (
                                <button 
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        border: `1.5px solid ${c.peach}`, 
                                        borderRadius: 12, 
                                        padding: '16px',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = `${c.peach}10`}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div style={{ fontSize: 24, marginBottom: 8 }}>{action.icon}</div>
                                    <p style={{ color: action.color, fontWeight: 600, margin: 0, fontSize: 13 }}>{action.label}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardPage