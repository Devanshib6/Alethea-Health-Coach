import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
  cream: '#faf7f2',
  charcoal: '#2c2c2c',
}

const LogMealPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedFood, setSelectedFood] = useState(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    food_name: '',
    meal_type: 'breakfast',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    quantity: 100,
    unit: 'g'
  })

  const userDiet = (user?.diet_type || 'Non-Veg').toLowerCase()

  const getDietTypeLabel = (dietType) => {
    const labels = {
      'Veg': 'Vegetarian',
      'Eggitarian': 'Eggitarian',
      'Non-Veg': 'Non-Veg'
    }
    return labels[dietType] || dietType
  }

  const getFilteredResults = () => {
    return searchResults.filter(food => {
      const foodDiet = food.diet_type || ''
      
      if (userDiet === 'veg') {
        return foodDiet === 'Veg'
      }
      if (userDiet === 'eggitarian') {
        return foodDiet === 'Veg' || foodDiet === 'Eggitarian'
      }
      return true
    })
  }

  const handleSearch = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to search for food')
      navigate('/login')
      return
    }
    
    if (!searchQuery.trim()) {
      setError('Please enter a food name to search')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const response = await API.get(`/food/search?query=${encodeURIComponent(searchQuery)}&limit=30`)
      
      if (response.data.results && response.data.results.length > 0) {
        setSearchResults(response.data.results)
        setError('')
      } else {
        setSearchResults([])
        setError('No food items found. Try a different search term.')
      }
    } catch (error) {
      console.error('Search failed:', error)
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        setError('Failed to search. Please try again.')
      }
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  const selectFood = (food) => {
    setSelectedFood(food)
    setFormData({
      food_name: food.food_name,
      meal_type: food.meal_type || 'breakfast',
      calories: food.calories || 0,
      protein: food.protein || 0,
      carbs: food.carbs || 0,
      fat: food.fat || 0,
      quantity: 100,
      unit: 'g'
    })
    setSearchResults([])
    setSearchQuery('')
    setError('')
  }

  const handleQuantityChange = (e) => {
    const newQuantity = parseFloat(e.target.value) || 0
    setFormData({ ...formData, quantity: newQuantity })
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Check if user is logged in
    const token = localStorage.getItem('token')
    if (!token) {
      setError('Please login to log a meal')
      navigate('/login')
      return
    }
    
    setLoading(true)
    setError('')
    
    try {
      const multiplier = formData.quantity / 100
      
      const mealData = {
        food_name: formData.food_name,
        meal_type: formData.meal_type,
        calories: Math.round(formData.calories * multiplier),
        protein: Math.round((formData.protein * multiplier) * 10) / 10,
        carbs: Math.round((formData.carbs * multiplier) * 10) / 10,
        fat: Math.round((formData.fat * multiplier) * 10) / 10,
        quantity: formData.quantity,
        unit: formData.unit
      }
      
      await API.post('/meals/', mealData)
      navigate('/meal-history')
    } catch (error) {
      console.error('Failed to log meal:', error)
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.')
        localStorage.removeItem('token')
        navigate('/login')
      } else {
        setError('Failed to save meal. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const getMealTypeLabel = (type) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    }
    return labels[type] || type
  }

  const filteredResults = getFilteredResults()

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
          <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: '8px 0 4px' }}>Log Meal</h1>
          <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>
            Diet: {userDiet === 'veg' ? 'Vegetarian' : userDiet === 'eggitarian' ? 'Eggitarian' : 'Non-Vegetarian'}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px' }}>
        
        {/* Error Message */}
        {error && (
          <div style={{ 
            backgroundColor: '#fee2e2', 
            borderLeft: `4px solid #dc2626`,
            color: '#b91c1c', 
            padding: '14px 18px', 
            borderRadius: 12, 
            marginBottom: 24,
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        {/* Search Section */}
        <div style={{ 
          backgroundColor: c.white, 
          borderRadius: 20, 
          padding: 28, 
          marginBottom: 32,
          border: `1px solid ${c.peach}15`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        }}>
          <h3 style={{ color: c.dark, fontWeight: 700, marginBottom: 12, fontSize: 18 }}>Search Food</h3>
          <p style={{ color: c.taupe, fontSize: 13, marginBottom: 20 }}>
            Search from our database of 400+ Indian and Nepali foods
            {userDiet !== 'non-veg' && (
              <span style={{ display: 'block', marginTop: 6, color: c.peach }}>
                {userDiet === 'veg' ? 'Showing only vegetarian items' : 'Showing vegetarian & eggitarian items'}
              </span>
            )}
          </p>
          
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g., Paneer, Dal, Rice, Momo..."
              style={{ 
                flex: 1, 
                border: `1.5px solid ${c.peach}20`, 
                borderRadius: 14, 
                padding: '14px 18px', 
                fontSize: 14, 
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = c.peach
                e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
              }}
              onBlur={(e) => {
                e.target.style.borderColor = `${c.peach}20`
                e.target.style.boxShadow = 'none'
              }}
            />
            <button 
              onClick={handleSearch}
              disabled={loading}
              style={{ 
                backgroundColor: c.dark, 
                color: c.white, 
                border: 'none', 
                padding: '14px 28px', 
                borderRadius: 40, 
                cursor: loading ? 'not-allowed' : 'pointer', 
                fontWeight: 600,
                fontSize: 14,
                opacity: loading ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = c.charcoal
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = c.dark
              }}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Search Results with Diet Filtering */}
          {filteredResults.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <p style={{ color: c.taupe, fontSize: 12, marginBottom: 12 }}>
                Found {filteredResults.length} result(s)
              </p>
              <div style={{ maxHeight: 400, overflowY: 'auto' }}>
                {filteredResults.map((food, i) => (
                  <div 
                    key={i} 
                    onClick={() => selectFood(food)}
                    style={{ 
                      padding: '16px', 
                      borderBottom: `1px solid ${c.peach}15`, 
                      cursor: 'pointer', 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = `${c.peach}05`}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                        <p style={{ color: c.dark, fontWeight: 600, margin: 0, fontSize: 15 }}>{food.food_name}</p>
                        <span style={{ 
                          backgroundColor: food.diet_type === 'Veg' ? '#22c55e15' : food.diet_type === 'Eggitarian' ? '#f59e0b15' : '#ef444415',
                          color: food.diet_type === 'Veg' ? '#16a34a' : food.diet_type === 'Eggitarian' ? '#d97706' : '#dc2626',
                          fontSize: 10, 
                          padding: '2px 10px', 
                          borderRadius: 20,
                          fontWeight: 500
                        }}>
                          {getDietTypeLabel(food.diet_type)}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                        <span style={{ color: c.taupe, fontSize: 12 }}>{food.calories} kcal</span>
                        <span style={{ color: c.taupe, fontSize: 12 }}>{food.protein}g protein</span>
                        <span style={{ color: c.taupe, fontSize: 12 }}>{food.carbs}g carbs</span>
                        <span style={{ color: c.taupe, fontSize: 12 }}>{food.fat}g fat</span>
                      </div>
                      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
                        {food.meal_type && (
                          <span style={{ 
                            backgroundColor: `${c.peach}12`, 
                            color: c.peach, 
                            fontSize: 10, 
                            padding: '2px 10px', 
                            borderRadius: 20,
                            fontWeight: 500
                          }}>
                            {getMealTypeLabel(food.meal_type)}
                          </span>
                        )}
                        {food.cuisine && (
                          <span style={{ 
                            backgroundColor: `${c.taupe}12`, 
                            color: c.taupe, 
                            fontSize: 10, 
                            padding: '2px 10px', 
                            borderRadius: 20
                          }}>
                            {food.cuisine}
                          </span>
                        )}
                      </div>
                    </div>
                    <span style={{ color: c.peach, fontSize: 14, fontWeight: 600 }}>Select →</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length > 0 && filteredResults.length === 0 && !loading && (
            <div style={{ 
              marginTop: 20, 
              padding: '20px', 
              textAlign: 'center', 
              backgroundColor: `${c.peach}05`, 
              borderRadius: 16 
            }}>
              <p style={{ color: c.taupe, marginBottom: 8 }}>
                Found {searchResults.length} items, but none match your diet.
              </p>
              <p style={{ color: c.taupe, fontSize: 12 }}>
                Try a different search term or update your dietary preferences.
              </p>
            </div>
          )}
        </div>

        {/* Meal Form - Shows after food is selected */}
        {selectedFood && (
          <form onSubmit={handleSubmit} style={{ 
            backgroundColor: c.white, 
            borderRadius: 20, 
            padding: 28,
            border: `1px solid ${c.peach}15`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h3 style={{ color: c.dark, fontWeight: 700, margin: 0, fontSize: 18 }}>Log This Meal</h3>
              <button 
                type="button" 
                onClick={() => setSelectedFood(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: c.taupe, 
                  cursor: 'pointer',
                  fontSize: 13,
                  textDecoration: 'underline',
                }}
              >
                Change Food
              </button>
            </div>
            
            <div style={{ 
              backgroundColor: `${c.peach}08`, 
              borderRadius: 16, 
              padding: 18, 
              marginBottom: 28,
              border: `1px solid ${c.peach}15`,
            }}>
              <p style={{ color: c.dark, fontWeight: 700, margin: 0, fontSize: 18 }}>
                {formData.food_name}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 28 }}>
              <div>
                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
                  Meal Type
                </label>
                <select 
                  name="meal_type" 
                  value={formData.meal_type} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    border: `1.5px solid ${c.peach}20`, 
                    borderRadius: 14, 
                    padding: '12px 16px', 
                    fontSize: 14,
                    backgroundColor: c.white,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.peach
                    e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${c.peach}20`
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="breakfast">Breakfast</option>
                  <option value="lunch">Lunch</option>
                  <option value="dinner">Dinner</option>
                  <option value="snack">Snack</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
                  Quantity
                </label>
                <input 
                  type="number" 
                  value={formData.quantity} 
                  onChange={handleQuantityChange}
                  min="1"
                  max="5000"
                  step="10"
                  style={{ 
                    width: '100%', 
                    border: `1.5px solid ${c.peach}20`, 
                    borderRadius: 14, 
                    padding: '12px 16px', 
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.peach
                    e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${c.peach}20`
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 8, fontWeight: 600 }}>
                  Unit
                </label>
                <select 
                  name="unit" 
                  value={formData.unit} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    border: `1.5px solid ${c.peach}20`, 
                    borderRadius: 14, 
                    padding: '12px 16px', 
                    fontSize: 14,
                    backgroundColor: c.white,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = c.peach
                    e.target.style.boxShadow = `0 0 0 3px ${c.peach}15`
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = `${c.peach}20`
                    e.target.style.boxShadow = 'none'
                  }}
                >
                  <option value="g">grams (g)</option>
                  <option value="kg">kilograms (kg)</option>
                  <option value="ml">milliliters (ml)</option>
                  <option value="piece">piece(s)</option>
                  <option value="cup">cup(s)</option>
                  <option value="bowl">bowl(s)</option>
                </select>
              </div>
            </div>

            {/* Nutrition Info Display */}
            <div style={{ backgroundColor: `${c.peach}05`, borderRadius: 16, padding: 20, marginBottom: 28 }}>
              <p style={{ color: c.taupe, fontSize: 12, marginBottom: 16, fontWeight: 600, letterSpacing: 0.5 }}>
                NUTRITION INFORMATION
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, textAlign: 'center' }}>
                <div>
                  <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>Calories</p>
                  <p style={{ color: c.dark, fontWeight: 700, fontSize: 18, margin: '6px 0 2px' }}>
                    {Math.round(formData.calories * (formData.quantity / 100))} kcal
                  </p>
                  <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.calories}/100g)</p>
                </div>
                <div>
                  <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>Protein</p>
                  <p style={{ color: c.dark, fontWeight: 700, fontSize: 18, margin: '6px 0 2px' }}>
                    {Math.round((formData.protein * (formData.quantity / 100)) * 10) / 10} g
                  </p>
                  <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.protein}/100g)</p>
                </div>
                <div>
                  <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>Carbs</p>
                  <p style={{ color: c.dark, fontWeight: 700, fontSize: 18, margin: '6px 0 2px' }}>
                    {Math.round((formData.carbs * (formData.quantity / 100)) * 10) / 10} g
                  </p>
                  <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.carbs}/100g)</p>
                </div>
                <div>
                  <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>Fat</p>
                  <p style={{ color: c.dark, fontWeight: 700, fontSize: 18, margin: '6px 0 2px' }}>
                    {Math.round((formData.fat * (formData.quantity / 100)) * 10) / 10} g
                  </p>
                  <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.fat}/100g)</p>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 16 }}>
              <button 
                type="button" 
                onClick={() => setSelectedFood(null)}
                style={{ 
                  flex: 1, 
                  backgroundColor: 'transparent', 
                  border: `1.5px solid ${c.peach}`, 
                  padding: '14px', 
                  borderRadius: 40, 
                  cursor: 'pointer', 
                  color: c.taupe,
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${c.peach}08`
                  e.currentTarget.style.borderColor = c.dark
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.borderColor = c.peach
                }}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                style={{ 
                  flex: 1, 
                  backgroundColor: c.dark, 
                  color: c.white, 
                  border: 'none', 
                  padding: '14px', 
                  borderRadius: 40, 
                  cursor: loading ? 'not-allowed' : 'pointer', 
                  fontWeight: 600,
                  fontSize: 14,
                  opacity: loading ? 0.6 : 1,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = c.charcoal
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = c.dark
                }}
              >
                {loading ? 'Saving...' : 'Log Meal'}
              </button>
            </div>
          </form>
        )}

        {!selectedFood && !searchResults.length && !loading && (
          <div style={{ 
            textAlign: 'center', 
            padding: '60px 20px',
            border: `1px solid ${c.peach}20`,
            borderRadius: 20,
            backgroundColor: c.white,
          }}>
            <p style={{ color: c.taupe, fontSize: 14, marginBottom: 12 }}>
              Search for a food item to start tracking
            </p>
            <p style={{ color: c.taupe, fontSize: 12 }}>
              Search our database of 400+ Indian and Nepali foods
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LogMealPage