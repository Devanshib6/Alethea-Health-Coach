import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack']
const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

const WeeklyMealPlanPage = () => {
  const navigate = useNavigate()
  const [weeklyPlan, setWeeklyPlan] = useState(null)
  const [dailyCalories, setDailyCalories] = useState(null)
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWeeklyPlan()
  }, [])

  const fetchWeeklyPlan = async () => {
    try {
      const response = await API.get('/diet/weekly')
      if (response.data.weekly_plan) {
        setWeeklyPlan(response.data.weekly_plan)
        setDailyCalories(response.data.daily_calories)
      }
    } catch (err) {
      console.error('Error fetching weekly plan:', err)
    } finally {
      setLoading(false)
    }
  }

  const getDayCalories = (day) => {
    if (!weeklyPlan || !weeklyPlan[day]) return 0
    return Object.values(weeklyPlan[day]).reduce((sum, meal) => sum + (meal.calories || 0), 0)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: c.white }}>
        <p style={{ color: c.taupe }}>Loading weekly meal plan...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* header */}
      <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => navigate('/diet-plan')}
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
            ← Back to Diet Plan
          </button>
          <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Weekly Meal Plan</h1>
          <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>
            {dailyCalories && `Target: ${dailyCalories} calories per day`}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        {!weeklyPlan ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ fontSize: 64, marginBottom: 24 }}>📅</div>
            <h2 style={{ color: c.dark, fontSize: 24, fontWeight: 800, marginBottom: 12 }}>No Weekly Plan Found</h2>
            <p style={{ color: c.taupe, fontSize: 15, marginBottom: 32 }}>
              Please generate your diet plan first.
            </p>
            <button onClick={() => navigate('/diet-plan')}
              style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px 36px', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Go to Diet Plan →
            </button>
          </div>
        ) : (
          <>
            {/* day selector */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 32, overflowX: 'auto', paddingBottom: 8 }}>
              {days.map(day => (
                <button key={day} onClick={() => setSelectedDay(day)}
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
                  <div style={{ fontSize: 11, marginTop: 2, color: selectedDay === day ? c.peach : c.taupe }}>
                    {getDayCalories(day)} kcal
                  </div>
                </button>
              ))}
            </div>

            {/* selected day meals */}
            <h2 style={{ color: c.dark, fontWeight: 800, fontSize: 22, marginBottom: 24 }}>{selectedDay}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, marginBottom: 40 }}>
              {weeklyPlan[selectedDay] && mealTypes.map(type => {
                const meal = weeklyPlan[selectedDay][type]
                if (!meal) return null
                return (
                  <div key={type} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <span style={{ fontSize: 24 }}>{mealIcons[type]}</span>
                      <span style={{ color: c.taupe, fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, fontWeight: 600 }}>{type}</span>
                    </div>
                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 15, marginBottom: 14, lineHeight: 1.4 }}>{meal.meal}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {[
                        { label: 'Calories', value: `${meal.calories} kcal` },
                        { label: 'Protein', value: `${meal.protein}g` },
                        { label: 'Carbs', value: `${meal.carbs}g` },
                        { label: 'Fat', value: `${meal.fat}g` },
                      ].map((n, i) => (
                        <div key={i} style={{ backgroundColor: `${c.peach}15`, borderRadius: 6, padding: '6px 10px' }}>
                          <p style={{ color: c.taupe, fontSize: 10, textTransform: 'uppercase' }}>{n.label}</p>
                          <p style={{ color: c.dark, fontWeight: 600, fontSize: 13 }}>{n.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* weekly overview table */}
            <h3 style={{ color: c.dark, fontWeight: 800, fontSize: 18, marginBottom: 16 }}>Weekly Overview</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: c.dark }}>
                    <th style={{ padding: '12px 16px', color: c.white, textAlign: 'left', fontWeight: 600 }}>Day</th>
                    {mealTypes.map(type => (
                      <th key={type} style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, textTransform: 'capitalize' }}>
                        {mealIcons[type]} {type}
                      </th>
                    ))}
                    <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600 }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((day, i) => (
                    <tr key={day}
                      onClick={() => setSelectedDay(day)}
                      style={{ backgroundColor: selectedDay === day ? `${c.peach}15` : i % 2 === 0 ? c.white : `${c.peach}05`, cursor: 'pointer' }}>
                      <td style={{ padding: '12px 16px', color: c.dark, fontWeight: selectedDay === day ? 700 : 400 }}>{day}</td>
                      {mealTypes.map(type => (
                        <td key={type} style={{ padding: '12px 16px', color: c.taupe }}>
                          {weeklyPlan[day]?.[type]?.meal?.split(' ').slice(0, 3).join(' ') + '...' || '-'}
                        </td>
                      ))}
                      <td style={{ padding: '12px 16px', color: c.dark, fontWeight: 600 }}>{getDayCalories(day)} kcal</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default WeeklyMealPlanPage