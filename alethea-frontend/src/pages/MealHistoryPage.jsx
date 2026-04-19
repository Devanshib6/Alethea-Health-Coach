import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMeals } from '../context/MealContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

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

  // Case-insensitive filtering
  const filteredMeals = meals.filter(meal => {
    if (filter !== 'all') {
        // Convert both to lowercase for case-insensitive comparison
        let mealType = (meal.meal_type || '').toLowerCase();
        let filterType = filter.toLowerCase();
        if (mealType !== filterType) return false;
    }
    return true
  })

  const totalNutrition = filteredMeals.reduce((acc, meal) => ({
    calories: acc.calories + (meal.calories || 0),
    protein: acc.protein + (meal.protein || 0),
    carbs: acc.carbs + (meal.carbs || 0),
    fat: acc.fat + (meal.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  const getMealTypeName = (type) => {
    const lowerType = (type || '').toLowerCase();
    switch(lowerType) {
        case 'breakfast':
        case 'morning':
            return 'Breakfast';
        case 'lunch': return 'Lunch';
        case 'dinner': return 'Dinner';
        case 'snack': return 'Snack';
        default: return type || 'Meal';
    }
  }

  const getMealTypeIcon = (type) => {
    const lowerType = (type || '').toLowerCase();
    switch(lowerType) {
        case 'breakfast':
        case 'morning':
            return '🍳';
        case 'lunch': return '☀️';
        case 'dinner': return '🌙';
        case 'snack': return '🍎';
        default: return '🍽️';
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif', padding: '48px 24px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ backgroundColor: c.white, borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          
          {/* Header */}
          <div style={{ backgroundColor: c.dark, padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <button 
                onClick={() => navigate('/dashboard')} 
                style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14 }}>
                ← Back to Dashboard
              </button>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <h1 style={{ color: c.white, fontSize: 24, fontWeight: 800, margin: 0 }}>Meal History</h1>
              </div>
            </div>
            
            {/* Nutrition Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
              <div>
                <div style={{ color: c.peach, fontSize: 28, fontWeight: 800 }}>{Math.round(totalNutrition.calories)}</div>
                <div style={{ color: c.taupe, fontSize: 12 }}>Calories</div>
              </div>
              <div>
                <div style={{ color: c.peach, fontSize: 28, fontWeight: 800 }}>{Math.round(totalNutrition.protein)}g</div>
                <div style={{ color: c.taupe, fontSize: 12 }}>Protein</div>
              </div>
              <div>
                <div style={{ color: c.peach, fontSize: 28, fontWeight: 800 }}>{Math.round(totalNutrition.carbs)}g</div>
                <div style={{ color: c.taupe, fontSize: 12 }}>Carbs</div>
              </div>
              <div>
                <div style={{ color: c.peach, fontSize: 28, fontWeight: 800 }}>{Math.round(totalNutrition.fat)}g</div>
                <div style={{ color: c.taupe, fontSize: 12 }}>Fat</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: '16px 20px', borderBottom: `1px solid ${c.peach}30`, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 20,
                  textTransform: 'capitalize',
                  backgroundColor: filter === type ? c.dark : `${c.peach}15`,
                  color: filter === type ? c.white : c.taupe,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: filter === type ? 600 : 400,
                  transition: 'all 0.2s'
                }}
              >
                {type === 'all' ? 'All' : getMealTypeIcon(type) + ' ' + getMealTypeName(type)}
              </button>
            ))}
          </div>

          {/* Meal List */}
          <div>
            {filteredMeals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: c.taupe }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
                <p style={{ marginBottom: 20 }}>No meals logged yet</p>
                <button 
                  onClick={() => navigate('/log-meal')} 
                  style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px 28px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
                  Log Your First Meal
                </button>
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <div key={meal.id} style={{ padding: '16px 20px', borderBottom: `1px solid ${c.peach}20`, transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = `${c.peach}05`}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 14, fontWeight: 500, color: c.peach, textTransform: 'capitalize' }}>
                          {getMealTypeIcon(meal.meal_type)} {getMealTypeName(meal.meal_type)}
                        </span>
                        <span style={{ fontSize: 11, color: c.taupe }}>
                          {new Date(meal.created_at).toLocaleString()}
                        </span>
                      </div>
                      <h3 style={{ color: c.dark, fontWeight: 700, margin: '0 0 6px', fontSize: 16 }}>{meal.food_name}</h3>
                      <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: 12, color: c.taupe }}>
                        <span>🔥 {Math.round(meal.calories || 0)} kcal</span>
                        <span>💪 {meal.protein || 0}g P</span>
                        <span>🌾 {meal.carbs || 0}g C</span>
                        <span>🥑 {meal.fat || 0}g F</span>
                        {meal.quantity && <span>📦 {meal.quantity}{meal.unit}</span>}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(meal.id)} 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '8px', fontSize: 18 }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Button */}
          <div style={{ padding: '16px 20px', borderTop: `1px solid ${c.peach}30` }}>
            <button 
              onClick={() => navigate('/log-meal')} 
              style={{ width: '100%', backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              + Log Another Meal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MealHistoryPage