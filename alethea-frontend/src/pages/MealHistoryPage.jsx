import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useMeals } from '../context/MealContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const MealHistoryPage = () => {
  const navigate = useNavigate()
  const { meals, fetchMeals, removeMeal } = useMeals()
  const [filter, setFilter] = useState('all')
  const [showConfirmDelete, setShowConfirmDelete] = useState(null)

  useEffect(() => {
    fetchMeals()
  }, [])

  const handleDelete = async (id) => {
    try {
      await api.delete(`/meals/${id}`)
      removeMeal(id)
      toast.success('Meal deleted successfully')
      setShowConfirmDelete(null)
    } catch (error) {
      toast.error('Failed to delete meal')
    }
  }

  const filteredMeals = meals.filter(meal => {
    if (filter !== 'all') {
      let mealType = (meal.meal_type || '').toLowerCase()
      let filterType = filter.toLowerCase()
      if (mealType !== filterType) return false
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

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif" }}>
      
      {/* Header */}
      <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link 
            to="/dashboard" 
            style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 13, marginBottom: 12, textDecoration: 'none', display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Meal History</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>Track all your logged meals and nutrition</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px' }}>
        <div style={{ 
          backgroundColor: c.white, 
          borderRadius: 24, 
          overflow: 'hidden',
          border: `1px solid ${c.peach}15`,
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
        }}>
          
          {/* Nutrition Summary */}
          <div style={{ backgroundColor: c.dark, padding: '28px 24px' }}>
            <h3 style={{ color: c.white, fontWeight: 600, fontSize: 14, marginBottom: 20, letterSpacing: 1, textTransform: 'uppercase' }}>
              Total Nutrition ({filteredMeals.length} meals)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, textAlign: 'center' }}>
              <div>
                <div style={{ color: c.peach, fontSize: 32, fontWeight: 800 }}>{Math.round(totalNutrition.calories)}</div>
                <div style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>Calories (kcal)</div>
              </div>
              <div>
                <div style={{ color: c.peach, fontSize: 32, fontWeight: 800 }}>{Math.round(totalNutrition.protein)}</div>
                <div style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>Protein (g)</div>
              </div>
              <div>
                <div style={{ color: c.peach, fontSize: 32, fontWeight: 800 }}>{Math.round(totalNutrition.carbs)}</div>
                <div style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>Carbs (g)</div>
              </div>
              <div>
                <div style={{ color: c.peach, fontSize: 32, fontWeight: 800 }}>{Math.round(totalNutrition.fat)}</div>
                <div style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>Fat (g)</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div style={{ padding: '20px 24px', borderBottom: `1px solid ${c.peach}15`, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['all', 'breakfast', 'lunch', 'dinner', 'snack'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                style={{
                  padding: '8px 20px',
                  borderRadius: 40,
                  textTransform: 'capitalize',
                  backgroundColor: filter === type ? c.dark : 'transparent',
                  color: filter === type ? c.white : c.taupe,
                  border: filter === type ? 'none' : `1px solid ${c.peach}30`,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: filter === type ? 600 : 500,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (filter !== type) {
                    e.currentTarget.style.borderColor = c.peach
                    e.currentTarget.style.color = c.dark
                  }
                }}
                onMouseLeave={(e) => {
                  if (filter !== type) {
                    e.currentTarget.style.borderColor = `${c.peach}30`
                    e.currentTarget.style.color = c.taupe
                  }
                }}
              >
                {type === 'all' ? 'All Meals' : getMealTypeName(type)}
              </button>
            ))}
          </div>

          {/* Meal List */}
          <div style={{ maxHeight: 'calc(100vh - 400px)', overflowY: 'auto' }}>
            {filteredMeals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                <p style={{ color: c.taupe, fontSize: 14, marginBottom: 20 }}>No meals logged yet</p>
                <button 
                  onClick={() => navigate('/log-meal')} 
                  style={{ 
                    backgroundColor: c.dark, 
                    color: c.white, 
                    border: 'none', 
                    padding: '12px 28px', 
                    borderRadius: 40, 
                    cursor: 'pointer', 
                    fontWeight: 600,
                    fontSize: 14,
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
                >
                  Log Your First Meal
                </button>
              </div>
            ) : (
              filteredMeals.map((meal) => (
                <div 
                  key={meal.id} 
                  style={{ 
                    padding: '20px 24px', 
                    borderBottom: `1px solid ${c.peach}12`,
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = `${c.peach}04`}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        <span style={{ 
                          fontSize: 12, 
                          fontWeight: 600, 
                          color: c.peach,
                          textTransform: 'uppercase',
                          letterSpacing: 0.5,
                        }}>
                          {getMealTypeName(meal.meal_type)}
                        </span>
                        <span style={{ 
                          width: 4, 
                          height: 4, 
                          borderRadius: '50%', 
                          backgroundColor: c.taupe,
                          display: 'inline-block',
                        }} />
                        <span style={{ fontSize: 12, color: c.taupe }}>
                          {new Date(meal.created_at).toLocaleDateString()} at {new Date(meal.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <h3 style={{ color: c.dark, fontWeight: 700, margin: '0 0 10px', fontSize: 18 }}>
                        {meal.food_name}
                      </h3>
                      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 13, color: c.taupe }}>
                          Calories: <strong style={{ color: c.dark }}>{Math.round(meal.calories || 0)} kcal</strong>
                        </span>
                        <span style={{ fontSize: 13, color: c.taupe }}>
                          Protein: <strong style={{ color: c.dark }}>{meal.protein || 0}g</strong>
                        </span>
                        <span style={{ fontSize: 13, color: c.taupe }}>
                          Carbs: <strong style={{ color: c.dark }}>{meal.carbs || 0}g</strong>
                        </span>
                        <span style={{ fontSize: 13, color: c.taupe }}>
                          Fat: <strong style={{ color: c.dark }}>{meal.fat || 0}g</strong>
                        </span>
                        {meal.quantity && (
                          <span style={{ fontSize: 13, color: c.taupe }}>
                            Quantity: <strong style={{ color: c.dark }}>{meal.quantity}{meal.unit}</strong>
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {showConfirmDelete === meal.id ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button 
                          onClick={() => handleDelete(meal.id)} 
                          style={{ 
                            backgroundColor: '#dc2626', 
                            color: c.white, 
                            border: 'none', 
                            padding: '6px 12px', 
                            borderRadius: 8, 
                            cursor: 'pointer',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          Confirm
                        </button>
                        <button 
                          onClick={() => setShowConfirmDelete(null)} 
                          style={{ 
                            backgroundColor: 'transparent', 
                            border: `1px solid ${c.peach}`, 
                            color: c.taupe, 
                            padding: '6px 12px', 
                            borderRadius: 8, 
                            cursor: 'pointer',
                            fontSize: 12,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setShowConfirmDelete(meal.id)} 
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: '#dc2626', 
                          cursor: 'pointer', 
                          padding: '8px 12px',
                          fontSize: 14,
                          fontWeight: 500,
                          borderRadius: 8,
                          transition: 'background 0.2s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Button */}
          {filteredMeals.length > 0 && (
            <div style={{ padding: '20px 24px', borderTop: `1px solid ${c.peach}15`, backgroundColor: c.white }}>
              <button 
                onClick={() => navigate('/log-meal')} 
                style={{ 
                  width: '100%', 
                  backgroundColor: c.dark, 
                  color: c.white, 
                  border: 'none', 
                  padding: '14px 20px', 
                  borderRadius: 40, 
                  cursor: 'pointer', 
                  fontWeight: 600, 
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
              >
                + Log Another Meal
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MealHistoryPage