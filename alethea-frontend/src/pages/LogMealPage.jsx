import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMeals } from '../context/MealContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const LogMealPage = () => {
  const navigate = useNavigate()
  const { addMeal } = useMeals()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    food_name: '',
    meal_type: 'lunch',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
  })

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { value: 'lunch', label: 'Lunch', icon: '☀️' },
    { value: 'dinner', label: 'Dinner', icon: '🌙' },
    { value: 'snack', label: 'Snack', icon: '🍎' },
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.food_name) {
      toast.error('Please enter food name')
      return
    }
    setLoading(true)
    try {
      const response = await api.post('/meals/', formData)
      addMeal(response.data)
      toast.success('Meal logged!')
      // Redirect to meal history after successful log
      navigate('/meal-history')
    } catch (error) {
      toast.error('Failed to log meal')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={handleCancel} className="text-gray-500 hover:text-gray-700">← Back</button>
            <div className="flex-1 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl">🍽️</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Log Your Meal</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Food Name</label>
              <input
                type="text"
                value={formData.food_name}
                onChange={(e) => setFormData({ ...formData, food_name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                placeholder="Enter food name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Meal Type</label>
              <div className="grid grid-cols-4 gap-2">
                {mealTypes.map((type) => (
                  <div
                    key={type.value}
                    onClick={() => setFormData({ ...formData, meal_type: type.value })}
                    className={`p-3 rounded-xl text-center cursor-pointer transition-all ${formData.meal_type === type.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    <div className="text-xl">{type.icon}</div>
                    <div className="text-xs font-medium">{type.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Calories (kcal)</label>
                <input
                  type="number"
                  value={formData.calories}
                  onChange={(e) => setFormData({ ...formData, calories: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Protein (g)</label>
                <input
                  type="number"
                  value={formData.protein}
                  onChange={(e) => setFormData({ ...formData, protein: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carbs (g)</label>
                <input
                  type="number"
                  value={formData.carbs}
                  onChange={(e) => setFormData({ ...formData, carbs: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fat (g)</label>
                <input
                  type="number"
                  value={formData.fat}
                  onChange={(e) => setFormData({ ...formData, fat: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button type="button" onClick={handleCancel} className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50">
                {loading ? 'Logging...' : 'Log Meal →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default LogMealPage