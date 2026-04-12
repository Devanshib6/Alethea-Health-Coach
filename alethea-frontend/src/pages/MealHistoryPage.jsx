import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMeals } from '../context/MealContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const MealHistoryPage = () => {
  const navigate = useNavigate()
  const { meals, fetchMeals, removeMeal } = useMeals()
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchMeals()
  }, [])

  const handleDelete = async (id) => {
    if (confirm('Delete this meal?')) {
      try {
        await api.delete(`/meals/${id}`)
        removeMeal(id)
        toast.success('Meal deleted')
      } catch (error) {
        toast.error('Delete failed')
      }
    }
  }

  const filteredMeals = meals.filter(meal => {
    if (filter !== 'all' && meal.meal_type !== filter) return false
    return true
  })

  const totalNutrition = filteredMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-pink-600 text-white p-6">
            <div className="flex items-center gap-4 mb-4">
              <button onClick={() => navigate('/dashboard')} className="text-white hover:text-gray-200">← Back</button>
              <div className="flex-1 text-center">
                <h1 className="text-2xl font-bold">Meal History</h1>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div><div className="text-2xl font-bold">{Math.round(totalNutrition.calories)}</div><div className="text-sm opacity-90">Calories</div></div>
              <div><div className="text-2xl font-bold">{Math.round(totalNutrition.protein)}g</div><div className="text-sm opacity-90">Protein</div></div>
              <div><div className="text-2xl font-bold">{Math.round(totalNutrition.carbs)}g</div><div className="text-sm opacity-90">Carbs</div></div>
              <div><div className="text-2xl font-bold">{Math.round(totalNutrition.fat)}g</div><div className="text-sm opacity-90">Fat</div></div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-4 border-b flex flex-wrap gap-2">
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg capitalize ${filter === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            ))}
          </div>

          {/* Meal List */}
          <div className="divide-y">
            {filteredMeals.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">🍽️</div>
                <p>No meals logged yet</p>
                <button onClick={() => navigate('/log-meal')} className="mt-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-6 py-2 rounded-xl">
                  Log Your First Meal
                </button>
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <div key={meal.id} className="p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-indigo-600 capitalize">{meal.meal_type}</span>
                        <span className="text-xs text-gray-400">{new Date(meal.created_at).toLocaleString()}</span>
                      </div>
                      <h3 className="font-semibold text-gray-800">{meal.food_name}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>🔥 {Math.round(meal.calories || 0)} kcal</span>
                        <span>💪 {meal.protein || 0}g P</span>
                        <span>🌾 {meal.carbs || 0}g C</span>
                        <span>🥑 {meal.fat || 0}g F</span>
                      </div>
                    </div>
                    <button onClick={() => handleDelete(meal.id)} className="text-red-500 hover:text-red-700 p-2">
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 border-t">
            <button onClick={() => navigate('/log-meal')} className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-3 rounded-xl">
              + Log Another Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealHistoryPage