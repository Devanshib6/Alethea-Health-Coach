import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

const WeeklyMealPlanPage = () => {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [weeklyPlan, setWeeklyPlan] = useState(null)
    const [dailyCalories, setDailyCalories] = useState(null)
    const [selectedDay, setSelectedDay] = useState('Monday')
    const [loading, setLoading] = useState(true)

    const userDiet = user?.diet_type || 'Non-Veg'

    const getDietTypeLabel = (dietType) => {
        const labels = {
            'Veg': 'Vegetarian',
            'Eggitarian': 'Eggitarian',
            'Non-Veg': 'Non-Vegetarian'
        }
        return labels[dietType] || dietType
    }

    const isMealAllowed = (meal) => {
        if (!meal) return false
        
        const mealDietType = meal.diet_type || 'Non-Veg'
        
        if (userDiet === 'Veg') {
            return mealDietType === 'Veg'
        }
        if (userDiet === 'Eggitarian') {
            return mealDietType === 'Veg' || mealDietType === 'Eggitarian'
        }
        return true
    }

    const getFilteredDayMeals = (day) => {
        if (!weeklyPlan || !weeklyPlan[day]) return {}
        
        const filtered = {}
        const dayMeals = weeklyPlan[day]
        
        for (const mealType in dayMeals) {
            const meal = dayMeals[mealType]
            if (isMealAllowed(meal)) {
                filtered[mealType] = meal
            }
        }
        
        return filtered
    }

    useEffect(() => {
        fetchWeeklyPlan()
    }, [])

    const fetchWeeklyPlan = async () => {
        try {
            const response = await api.get('/diet/weekly')
            if (response.data.weekly_plan) {
                setWeeklyPlan(response.data.weekly_plan)
                setDailyCalories(response.data.daily_calories)
            }
        } catch (error) {
            console.error('Failed to fetch weekly plan:', error)
        } finally {
            setLoading(false)
        }
    }

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']
    const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }
    const mealNames = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' }

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                    <p style={{ color: c.taupe }}>Loading your weekly meal plan...</p>
                    <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                </div>
            </div>
        )
    }

    if (!weeklyPlan) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📅</div>
                    <p style={{ color: c.taupe, marginBottom: 20 }}>No weekly plan found. Generate a diet plan first.</p>
                    <button 
                        onClick={() => navigate('/diet-plan')} 
                        style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                        Go to Diet Plan
                    </button>
                </div>
            </div>
        )
    }

    const filteredDayMeals = getFilteredDayMeals(selectedDay)
    const hasMeals = Object.keys(filteredDayMeals).length > 0

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <button 
                        onClick={() => navigate('/diet-plan')} 
                        style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
                        ← Back to Diet Plan
                    </button>
                    <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Weekly Meal Plan</h1>
                    <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>
                        Your personalized 7-day meal guide • Diet: {getDietTypeLabel(userDiet)}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>
                {/* Day Selector */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
                    {days.map(day => {
                        const dayMeals = getFilteredDayMeals(day)
                        const mealCount = Object.keys(dayMeals).length
                        
                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(day)}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: selectedDay === day ? c.dark : c.white,
                                    color: selectedDay === day ? c.white : c.taupe,
                                    border: `1.5px solid ${selectedDay === day ? c.dark : c.peach}`,
                                    cursor: 'pointer',
                                    fontSize: 13,
                                    fontWeight: selectedDay === day ? 700 : 400,
                                    whiteSpace: 'nowrap',
                                    borderRadius: 6
                                }}>
                                <div>{day.slice(0, 3)}</div>
                                <div style={{ fontSize: 10, marginTop: 2, color: selectedDay === day ? c.peach : c.taupe }}>
                                    {mealCount} meals
                                </div>
                            </button>
                        )
                    })}
                </div>

                {/* Selected Day Meals */}
                <h2 style={{ color: c.dark, fontWeight: 800, fontSize: 22, marginBottom: 24 }}>{selectedDay}</h2>

                {!hasMeals ? (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px',
                        border: `1px solid ${c.peach}30`,
                        borderRadius: 12,
                        backgroundColor: `${c.peach}05`
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
                        <p style={{ color: c.taupe, fontSize: 14 }}>
                            No meals available for {selectedDay} based on your {getDietTypeLabel(userDiet)} diet.
                        </p>
                        <p style={{ color: c.taupe, fontSize: 12, marginTop: 8 }}>
                            Try regenerating your diet plan or update your dietary preferences.
                        </p>
                        <button 
                            onClick={() => navigate('/diet-plan')}
                            style={{ marginTop: 20, backgroundColor: c.dark, color: c.white, border: 'none', padding: '10px 24px', borderRadius: 8, cursor: 'pointer' }}>
                            Regenerate Diet Plan
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
                        {mealTypes.map(type => {
                            const meal = filteredDayMeals[type]
                            if (!meal) return null
                            
                            return (
                                <div key={type} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                                        <span style={{ fontSize: 24 }}>{mealIcons[type]}</span>
                                        <span style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                                            {mealNames[type]}
                                        </span>
                                    </div>
                                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 15, marginBottom: 14, lineHeight: 1.4 }}>
                                        {meal.meal}
                                    </p>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                                        <div style={{ backgroundColor: `${c.peach}15`, borderRadius: 6, padding: '6px 10px' }}>
                                            <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase' }}>Calories</p>
                                            <p style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{meal.calories} kcal</p>
                                        </div>
                                        <div style={{ backgroundColor: `${c.peach}15`, borderRadius: 6, padding: '6px 10px' }}>
                                            <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase' }}>Protein</p>
                                            <p style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{meal.protein}g</p>
                                        </div>
                                        <div style={{ backgroundColor: `${c.peach}15`, borderRadius: 6, padding: '6px 10px' }}>
                                            <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase' }}>Carbs</p>
                                            <p style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{meal.carbs}g</p>
                                        </div>
                                        <div style={{ backgroundColor: `${c.peach}15`, borderRadius: 6, padding: '6px 10px' }}>
                                            <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase' }}>Fat</p>
                                            <p style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{meal.fat}g</p>
                                        </div>
                                    </div>
                                    {meal.diet_type && (
                                        <div style={{ marginTop: 12 }}>
                                            <span style={{ 
                                                backgroundColor: meal.diet_type === 'Veg' ? '#22c55e20' : meal.diet_type === 'Eggitarian' ? '#f59e0b20' : '#ef444420',
                                                color: meal.diet_type === 'Veg' ? '#16a34a' : meal.diet_type === 'Eggitarian' ? '#d97706' : '#dc2626',
                                                fontSize: 10, 
                                                padding: '2px 8px', 
                                                borderRadius: 12,
                                                fontWeight: 600
                                            }}>
                                                {getDietTypeLabel(meal.diet_type)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                )}

                {/* Weekly Overview Table */}
                <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Weekly Overview</h3>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                        <thead>
                            <tr style={{ backgroundColor: c.dark }}>
                                <th style={{ padding: '12px 16px', color: c.white, textAlign: 'left', fontWeight: 600 }}>Day</th>
                                {mealTypes.map(type => (
                                    <th key={type} style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, textTransform: 'capitalize' }}>
                                        {mealIcons[type]} {mealNames[type]}
                                    </th>
                                ))}
                                <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600 }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {days.map((day, i) => {
                                const dayMeals = getFilteredDayMeals(day)
                                const mealCount = Object.keys(dayMeals).length
                                
                                return (
                                    <tr 
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        style={{ 
                                            backgroundColor: selectedDay === day ? `${c.peach}15` : i % 2 === 0 ? c.white : `${c.peach}05`, 
                                            cursor: 'pointer',
                                            borderBottom: `1px solid ${c.peach}20`
                                        }}>
                                        <td style={{ padding: '12px 16px', color: c.dark, fontWeight: selectedDay === day ? 700 : 400 }}>
                                            {day}
                                        </td>
                                        {mealTypes.map(type => {
                                            const meal = dayMeals[type]
                                            return (
                                                <td key={type} style={{ padding: '12px 16px', color: c.taupe }}>
                                                    {meal ? (meal.meal?.length > 25 ? meal.meal.substring(0, 25) + '...' : meal.meal) : '-'}
                                                </td>
                                            )
                                        })}
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{ 
                                                color: mealCount === 4 ? '#16a34a' : mealCount > 0 ? '#f59e0b' : '#dc2626',
                                                fontWeight: 600,
                                                fontSize: 12
                                            }}>
                                                {mealCount}/4 meals
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default WeeklyMealPlanPage