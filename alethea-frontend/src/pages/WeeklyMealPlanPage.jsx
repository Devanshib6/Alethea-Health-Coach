import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const WeeklyMealPlanPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [weeklyPlan, setWeeklyPlan] = useState(null)
  const [dailyCalories, setDailyCalories] = useState(null)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [loading, setLoading] = useState(true)

  const userDiet = user?.diet_type || 'non-veg'

  const getDietTypeLabel = (dietType) => {
    const labels = {
      'veg': 'Vegetarian',
      'eggitarian': 'Eggitarian',
      'non-veg': 'Non-Vegetarian'
    }
    return labels[dietType?.toLowerCase()] || dietType || 'Non-Vegetarian'
  }

  const isMealAllowed = (meal) => {
    if (!meal) return false
    
    const mealDietType = (meal.diet_type || 'non-veg').toLowerCase()
    const userDietLower = (userDiet || 'non-veg').toLowerCase()
    
    if (userDietLower === 'veg') {
      return mealDietType === 'veg'
    }
    if (userDietLower === 'eggitarian') {
      return mealDietType === 'veg' || mealDietType === 'eggitarian'
    }
    return true
  }

  const getFilteredDayMeals = (day) => {
    if (!weeklyPlan || !weeklyPlan[day]) return {}
    
    const filtered = {}
    const dayMeals = weeklyPlan[day]
    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']
    
    for (const mealType of mealTypes) {
      const meal = dayMeals[mealType]
      if (meal && isMealAllowed(meal)) {
        filtered[mealType] = meal
      }
    }
    
    return filtered
  }

  const getMealCountForDay = (day) => {
    const dayMeals = getFilteredDayMeals(day)
    return Object.keys(dayMeals).length
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
  const mealNames = { breakfast: 'Breakfast', lunch: 'Lunch', dinner: 'Dinner', snack: 'Snack' }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.cream }}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: c.taupe, marginBottom: 20 }}>No weekly plan found. Generate a diet plan first.</p>
          <button 
            onClick={() => navigate('/diet-plan')} 
            style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px 28px', borderRadius: 40, cursor: 'pointer', fontWeight: 600 }}>
            Go to Diet Plan
          </button>
        </div>
      </div>
    )
  }

  const filteredDayMeals = getFilteredDayMeals(selectedDay)
  const hasMeals = Object.keys(filteredDayMeals).length > 0

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Link 
            to="/diet-plan" 
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 13, marginBottom: 12, textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Diet Plan
          </Link>
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Weekly Meal Plan</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>
            Your personalized 7-day meal guide • Diet: {getDietTypeLabel(userDiet)}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px' }}>
        
        {/* Day Selector */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 32, overflowX: 'auto', paddingBottom: 8, flexWrap: 'wrap' }}>
          {days.map(day => {
            const mealCount = getMealCountForDay(day)
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                style={{
                  padding: '10px 22px',
                  backgroundColor: selectedDay === day ? c.dark : c.white,
                  color: selectedDay === day ? c.white : c.taupe,
                  border: `1.5px solid ${selectedDay === day ? c.dark : c.peach}`,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: selectedDay === day ? 600 : 500,
                  whiteSpace: 'nowrap',
                  borderRadius: 40,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (selectedDay !== day) {
                    e.currentTarget.style.borderColor = c.dark
                    e.currentTarget.style.backgroundColor = `${c.peach}05`
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedDay !== day) {
                    e.currentTarget.style.borderColor = c.peach
                    e.currentTarget.style.backgroundColor = c.white
                  }
                }}
              >
                <div>{day.slice(0, 3)}</div>
                <div style={{ fontSize: 10, marginTop: 2, color: selectedDay === day ? c.peach : c.taupe }}>
                  {mealCount}/4
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Day Meals */}
        <h2 style={{ color: c.dark, fontWeight: 700, fontSize: 24, marginBottom: 24, letterSpacing: -0.5 }}>{selectedDay}</h2>

        {!hasMeals ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            border: `1px solid ${c.peach}25`,
            borderRadius: 20,
            backgroundColor: c.white,
          }}>
            <p style={{ color: c.taupe, fontSize: 14, marginBottom: 12 }}>
              No meals available for {selectedDay} based on your {getDietTypeLabel(userDiet)} diet.
            </p>
            <p style={{ color: c.taupe, fontSize: 12, marginBottom: 20 }}>
              Try regenerating your diet plan or update your dietary preferences.
            </p>
            <button 
              onClick={() => navigate('/diet-plan')}
              style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '10px 24px', borderRadius: 40, cursor: 'pointer', fontWeight: 500 }}>
              Regenerate Diet Plan
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 48 }}>
            {mealTypes.map(type => {
              const meal = filteredDayMeals[type]
              if (!meal) return null
              
              return (
                <div key={type} style={{ 
                  backgroundColor: c.white, 
                  borderRadius: 20, 
                  padding: 24, 
                  border: `1px solid ${c.peach}15`,
                  transition: 'all 0.3s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                    <div style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      backgroundColor: c.peach,
                    }} />
                    <span style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>
                      {mealNames[type]}
                    </span>
                  </div>
                  
                  <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, marginBottom: 16, lineHeight: 1.4 }}>
                    {meal.meal}
                  </p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div style={{ backgroundColor: `${c.peach}08`, borderRadius: 10, padding: '8px 12px' }}>
                      <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Calories</p>
                      <p style={{ color: c.dark, fontWeight: 600, fontSize: 14 }}>{meal.calories} kcal</p>
                    </div>
                    <div style={{ backgroundColor: `${c.peach}08`, borderRadius: 10, padding: '8px 12px' }}>
                      <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Protein</p>
                      <p style={{ color: c.dark, fontWeight: 600, fontSize: 14 }}>{meal.protein}g</p>
                    </div>
                    <div style={{ backgroundColor: `${c.peach}08`, borderRadius: 10, padding: '8px 12px' }}>
                      <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Carbs</p>
                      <p style={{ color: c.dark, fontWeight: 600, fontSize: 14 }}>{meal.carbs}g</p>
                    </div>
                    <div style={{ backgroundColor: `${c.peach}08`, borderRadius: 10, padding: '8px 12px' }}>
                      <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase', marginBottom: 2 }}>Fat</p>
                      <p style={{ color: c.dark, fontWeight: 600, fontSize: 14 }}>{meal.fat}g</p>
                    </div>
                  </div>
                  
                  {meal.diet_type && (
                    <span style={{ 
                      backgroundColor: meal.diet_type === 'veg' ? '#22c55e15' : meal.diet_type === 'eggitarian' ? '#f59e0b15' : '#ef444415',
                      color: meal.diet_type === 'veg' ? '#16a34a' : meal.diet_type === 'eggitarian' ? '#d97706' : '#dc2626',
                      fontSize: 10, 
                      padding: '3px 10px', 
                      borderRadius: 20,
                      fontWeight: 500,
                      display: 'inline-block'
                    }}>
                      {getDietTypeLabel(meal.diet_type)}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Weekly Overview Table */}
        <h3 style={{ color: c.dark, fontWeight: 700, fontSize: 18, marginBottom: 20 }}>Weekly Overview</h3>
        <div style={{ overflowX: 'auto', backgroundColor: c.white, borderRadius: 20, border: `1px solid ${c.peach}15` }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
            <thead>
              <tr style={{ backgroundColor: c.dark }}>
                <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, borderTopLeftRadius: 20 }}>Day</th>
                {mealTypes.map(type => (
                  <th key={type} style={{ padding: '14px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, textTransform: 'capitalize' }}>
                    {mealNames[type]}
                  </th>
                ))}
                <th style={{ padding: '14px 20px', color: c.peach, textAlign: 'left', fontWeight: 600, borderTopRightRadius: 20 }}>Status</th>
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
                      backgroundColor: selectedDay === day ? `${c.peach}08` : i % 2 === 0 ? c.white : `${c.peach}03`, 
                      cursor: 'pointer',
                      borderBottom: `1px solid ${c.peach}10`,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedDay !== day) {
                        e.currentTarget.style.backgroundColor = `${c.peach}05`
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedDay !== day) {
                        e.currentTarget.style.backgroundColor = i % 2 === 0 ? c.white : `${c.peach}03`
                      }
                    }}
                  >
                    <td style={{ padding: '14px 20px', color: c.dark, fontWeight: selectedDay === day ? 600 : 400 }}>
                      {day}
                    </td>
                    {mealTypes.map(type => {
                      const meal = dayMeals[type]
                      return (
                        <td key={type} style={{ padding: '14px 16px', color: c.taupe }}>
                          {meal ? (meal.meal?.length > 30 ? meal.meal.substring(0, 30) + '...' : meal.meal) : '—'}
                        </td>
                      )
                    })}
                    <td style={{ padding: '14px 20px' }}>
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