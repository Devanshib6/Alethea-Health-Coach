import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

const WeeklyMealPlanPage = () => {
  const navigate = useNavigate()
  const [weeklyPlan, setWeeklyPlan] = useState(null)
  const [selectedDay, setSelectedDay] = useState('Monday')

  useEffect(() => {
    fetchWeeklyPlan()
  }, [])

  const fetchWeeklyPlan = async () => {
    try {
      const response = await api.get('/diet/weekly')
      if (response.data.weekly_plan) setWeeklyPlan(response.data.weekly_plan)
    } catch (error) {
      console.error('Failed to fetch weekly plan:', error)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const mealIcons = { breakfast: '🌅', lunch: '☀️', dinner: '🌙', snack: '🍎' }

  if (!weeklyPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">No weekly plan found. Generate a diet plan first.</p>
          <button onClick={() => navigate('/diet-plan')} className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-xl">
            Go to Diet Plan
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-6">
            <button onClick={() => navigate('/diet-plan')} className="mb-4 text-white hover:text-gray-200">← Back</button>
            <h1 className="text-2xl font-bold">Weekly Meal Plan</h1>
            <p className="text-indigo-100 mt-1">Your personalized 7-day meal guide</p>
          </div>

          <div className="p-6">
            {/* Day Selector */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${selectedDay === day ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {day}
                </button>
              ))}
            </div>

            {/* Meals for Selected Day */}
            <h2 className="text-xl font-bold mb-4">{selectedDay}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {weeklyPlan[selectedDay] && Object.entries(weeklyPlan[selectedDay]).map(([type, meal]) => (
                <div key={type} className="border rounded-xl p-4 hover:shadow-lg transition">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{mealIcons[type]}</span>
                    <span className="font-semibold capitalize text-indigo-600">{type}</span>
                  </div>
                  <h3 className="font-medium mb-2">{meal.meal}</h3>
                  <div className="text-sm text-gray-500">
                    <div>🔥 {meal.calories} kcal</div>
                    <div>💪 {meal.protein}g P • 🌾 {meal.carbs}g C • 🥑 {meal.fat}g F</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeeklyMealPlanPage