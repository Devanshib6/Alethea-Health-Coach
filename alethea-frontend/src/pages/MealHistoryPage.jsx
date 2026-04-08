import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const MealHistoryPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    fetchMeals()
  }, [])

  const fetchMeals = async () => {
    try {
      const response = await API.get('/meals')
      setMeals(response.data)
      console.log('Meals loaded:', response.data)
    } catch (error) {
      console.error('Error fetching meals:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedMeal) return
    
    try {
      await API.delete(`/meals/${selectedMeal.id}`)
      setMeals(meals.filter(m => m.id !== selectedMeal.id))
      setShowDeleteModal(false)
      setSelectedMeal(null)
    } catch (error) {
      console.error('Error deleting meal:', error)
    }
  }

  const getMealTypeIcon = (type) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    }
    return icons[type] || '🍽️'
  }

  const filteredMeals = filter === 'all' 
    ? meals 
    : meals.filter(meal => meal.meal_type === filter)

  const totalCalories = filteredMeals.reduce((sum, meal) => sum + (meal.calories || 0), 0)
  const totalProtein = filteredMeals.reduce((sum, meal) => sum + (meal.protein || 0), 0)
  const totalCarbs = filteredMeals.reduce((sum, meal) => sum + (meal.carbs || 0), 0)
  const totalFat = filteredMeals.reduce((sum, meal) => sum + (meal.fat || 0), 0)

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.white, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 50, height: 50, border: `3px solid ${colors.peach}`, borderTopColor: colors.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
          <p style={{ color: colors.taupe }}>Loading your meals...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.white }}>
      
      {/* Header */}
      <div style={{ backgroundColor: colors.dark, padding: '20px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: 'transparent', border: 'none', color: colors.peach, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ color: colors.white, fontSize: 28, fontWeight: 700 }}>Meal History</h1>
          <p style={{ color: colors.taupe, marginTop: 8 }}>Track your eating habits over time</p>
        </div>
      </div>
      
      {/* Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
        
        {/* Summary Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ backgroundColor: `${colors.peach}10`, border: `1px solid ${colors.peach}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <p style={{ color: colors.taupe, fontSize: 12 }}>Total Meals</p>
            <p style={{ color: colors.dark, fontSize: 32, fontWeight: 700 }}>{filteredMeals.length}</p>
          </div>
          <div style={{ backgroundColor: `${colors.peach}10`, border: `1px solid ${colors.peach}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <p style={{ color: colors.taupe, fontSize: 12 }}>Total Calories</p>
            <p style={{ color: colors.dark, fontSize: 32, fontWeight: 700 }}>{totalCalories}</p>
            <p style={{ color: colors.taupe, fontSize: 11 }}>kcal</p>
          </div>
          <div style={{ backgroundColor: `${colors.peach}10`, border: `1px solid ${colors.peach}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <p style={{ color: colors.taupe, fontSize: 12 }}>Protein</p>
            <p style={{ color: colors.dark, fontSize: 32, fontWeight: 700 }}>{totalProtein}</p>
            <p style={{ color: colors.taupe, fontSize: 11 }}>grams</p>
          </div>
          <div style={{ backgroundColor: `${colors.peach}10`, border: `1px solid ${colors.peach}`, borderRadius: 12, padding: 20, textAlign: 'center' }}>
            <p style={{ color: colors.taupe, fontSize: 12 }}>Carbs / Fat</p>
            <p style={{ color: colors.dark, fontSize: 20, fontWeight: 700 }}>{totalCarbs}g / {totalFat}g</p>
          </div>
        </div>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
          {[
            { value: 'all', label: 'All Meals' },
            { value: 'breakfast', label: '🌅 Breakfast' },
            { value: 'lunch', label: '☀️ Lunch' },
            { value: 'dinner', label: '🌙 Dinner' },
            { value: 'snack', label: '🍎 Snack' },
          ].map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: '8px 20px',
                backgroundColor: filter === f.value ? colors.peach : 'transparent',
                border: `1.5px solid ${colors.peach}`,
                borderRadius: 20,
                cursor: 'pointer',
                color: filter === f.value ? colors.dark : colors.taupe,
                fontWeight: filter === f.value ? 600 : 400,
                fontSize: 13
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
        
        {/* Add Meal Button */}
        <Link to="/log-meal" style={{ textDecoration: 'none' }}>
          <div style={{ backgroundColor: colors.dark, borderRadius: 12, padding: 16, marginBottom: 24, textAlign: 'center', cursor: 'pointer' }}>
            <span style={{ color: colors.white, fontSize: 14, fontWeight: 500 }}>+ Log a New Meal</span>
          </div>
        </Link>
        
        {/* Meals List */}
        {filteredMeals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: `${colors.peach}05`, borderRadius: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍽️</div>
            <p style={{ color: colors.taupe, fontSize: 16 }}>No meals logged yet</p>
            <Link to="/log-meal" style={{ color: colors.peach, textDecoration: 'none', marginTop: 12, display: 'inline-block' }}>
              Log your first meal →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {filteredMeals.map(meal => (
              <div key={meal.id} style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 12, padding: 20, transition: 'box-shadow 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 28 }}>{getMealTypeIcon(meal.meal_type)}</span>
                      <div>
                        <h3 style={{ color: colors.dark, fontSize: 18, fontWeight: 600, margin: 0 }}>{meal.food_name}</h3>
                        <p style={{ color: colors.taupe, fontSize: 12, marginTop: 4 }}>
                          {meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1)}
                          {meal.quantity && ` • ${meal.quantity} ${meal.unit}`}
                        </p>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 12 }}>
                      {meal.calories && (
                        <div>
                          <p style={{ color: colors.taupe, fontSize: 11 }}>Calories</p>
                          <p style={{ color: colors.dark, fontWeight: 600 }}>{meal.calories} kcal</p>
                        </div>
                      )}
                      {meal.protein && (
                        <div>
                          <p style={{ color: colors.taupe, fontSize: 11 }}>Protein</p>
                          <p style={{ color: colors.dark, fontWeight: 600 }}>{meal.protein}g</p>
                        </div>
                      )}
                      {meal.carbs && (
                        <div>
                          <p style={{ color: colors.taupe, fontSize: 11 }}>Carbs</p>
                          <p style={{ color: colors.dark, fontWeight: 600 }}>{meal.carbs}g</p>
                        </div>
                      )}
                      {meal.fat && (
                        <div>
                          <p style={{ color: colors.taupe, fontSize: 11 }}>Fat</p>
                          <p style={{ color: colors.dark, fontWeight: 600 }}>{meal.fat}g</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: colors.taupe, fontSize: 12 }}>
                      {meal.logged_at ? new Date(meal.logged_at).toLocaleDateString() : 'Today'}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedMeal(meal)
                        setShowDeleteModal(true)
                      }}
                      style={{ backgroundColor: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', fontSize: 20, marginTop: 8 }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: colors.white, borderRadius: 16, padding: 32, maxWidth: 400, width: '90%' }}>
            <h3 style={{ color: colors.dark, marginBottom: 16 }}>Delete Meal?</h3>
            <p style={{ color: colors.taupe, marginBottom: 24 }}>
              Are you sure you want to delete "{selectedMeal?.food_name}"? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'transparent', border: `1.5px solid ${colors.peach}`, borderRadius: 8, cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                style={{ flex: 1, padding: '12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default MealHistoryPage