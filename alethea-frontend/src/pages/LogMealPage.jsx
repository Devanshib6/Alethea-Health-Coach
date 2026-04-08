import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const LogMealPage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  
  const [formData, setFormData] = useState({
    food_name: '',
    meal_type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    quantity: '',
    unit: 'grams'
  })
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [searching, setSearching] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', icon: '🌅', time: '6:00 - 10:00 AM' },
    { value: 'lunch', label: 'Lunch', icon: '☀️', time: '12:00 - 2:00 PM' },
    { value: 'dinner', label: 'Dinner', icon: '🌙', time: '6:00 - 9:00 PM' },
    { value: 'snack', label: 'Snack', icon: '🍎', time: 'Anytime' }
  ]

  const units = [
    { value: 'grams', label: 'Grams (g)' },
    { value: 'kg', label: 'Kilograms (kg)' },
    { value: 'ml', label: 'Milliliters (ml)' },
    { value: 'cup', label: 'Cup' },
    { value: 'piece', label: 'Piece' },
    { value: 'bowl', label: 'Bowl' }
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const searchFood = async () => {
    if (!searchQuery.trim()) {
      return
    }
    
    setSearching(true)
    setShowResults(true)
    
    try {
      const response = await API.get(`/food/search?query=${encodeURIComponent(searchQuery)}&limit=10`)
      setSearchResults(response.data.results)
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setSearching(false)
    }
  }

 const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    
    try {
        // Prepare data to match backend schema
        const mealData = {
            food_name: formData.food_name,
            meal_type: formData.meal_type,
            calories: formData.calories ? parseFloat(formData.calories) : null,
            protein: formData.protein ? parseFloat(formData.protein) : null,
            carbs: formData.carbs ? parseFloat(formData.carbs) : null,
            fat: formData.fat ? parseFloat(formData.fat) : null,  // Make sure this matches backend
            quantity: formData.quantity ? parseFloat(formData.quantity) : null,
            unit: formData.unit || null
        }
        
        console.log('Sending meal data:', mealData)  // Debug log
        
        const response = await API.post('/meals', mealData)
        console.log('Meal logged:', response.data)
        setSuccess('Meal logged successfully!')
        
        setTimeout(() => {
            navigate('/meal-history')
        }, 1500)
    } catch (err) {
        console.error('Error logging meal:', err)
        console.error('Error response:', err.response?.data)
        setError(err.response?.data?.detail || 'Failed to log meal')
    } finally {
        setLoading(false)
    }
}

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.white }}>
      
      {/* Header */}
      <div style={{ backgroundColor: colors.dark, padding: '20px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ backgroundColor: 'transparent', border: 'none', color: colors.peach, cursor: 'pointer', marginBottom: 16, fontSize: 14 }}
          >
            ← Back to Dashboard
          </button>
          <h1 style={{ color: colors.white, fontSize: 28, fontWeight: 700 }}>Log Your Meal</h1>
          <p style={{ color: colors.taupe, marginTop: 8 }}>Track what you eat to get personalized insights</p>
        </div>
      </div>
      
      {/* Form Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 32 }}>
          
          {error && (
            <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{ backgroundColor: '#d4edda', border: '1px solid #c3e6cb', color: '#155724', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              {success}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Food Name */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Food Name *
              </label>
              <input
                type="text"
                name="food_name"
                value={formData.food_name}
                onChange={handleChange}
                required
                placeholder="e.g., Grilled Chicken Salad, Oatmeal, Smoothie"
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                onFocus={e => e.target.style.borderColor = colors.dark}
                onBlur={e => e.target.style.borderColor = colors.peach}
              />
            </div>
            
            {/* Search for Food */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                🔍 Or Search from Database
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && searchFood()}
                  placeholder="e.g., apple, pizza, coca cola, bread..."
                  style={{ flex: 1, padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
                <button
                  type="button"
                  onClick={searchFood}
                  disabled={searching}
                  style={{ backgroundColor: colors.taupe, color: colors.white, border: 'none', padding: '0 24px', borderRadius: 8, cursor: searching ? 'not-allowed' : 'pointer', opacity: searching ? 0.6 : 1 }}
                >
                  {searching ? '...' : 'Search'}
                </button>
              </div>
              
              {/* Search Results Dropdown */}
              {showResults && (
                <div style={{ 
                  marginTop: 12, 
                  border: `1px solid ${colors.peach}`, 
                  borderRadius: 8, 
                  maxHeight: 300, 
                  overflowY: 'auto',
                  backgroundColor: colors.white,
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                  {searching ? (
                    <div style={{ padding: 20, textAlign: 'center', color: colors.taupe }}>Searching...</div>
                  ) : searchResults.length === 0 ? (
                    <div style={{ padding: 20, textAlign: 'center', color: colors.taupe }}>
                      No results found. Try a different search term.
                    </div>
                  ) : (
                    searchResults.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            food_name: item.food_name || item.brand || 'Unknown',
                            calories: item.calories || '',
                            protein: item.protein || '',
                            carbs: item.carbs || '',
                            fat: item.fat || ''
                          })
                          setShowResults(false)
                          setSearchQuery('')
                        }}
                        style={{ 
                          padding: '12px 16px', 
                          borderBottom: `1px solid ${colors.peach}`,
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${colors.peach}20`}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div style={{ fontWeight: 500, color: colors.dark }}>{item.food_name || 'Unknown'}</div>
                        <div style={{ fontSize: 12, color: colors.taupe, marginTop: 4 }}>
                          {item.brand && `Brand: ${item.brand} • `}
                          {item.calories ? `${Math.round(item.calories)} kcal per 100g` : 'Nutrition data available'}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
            
            {/* Meal Type */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 14 }}>
                Meal Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
                {mealTypes.map(type => (
                  <div
                    key={type.value}
                    onClick={() => setFormData({ ...formData, meal_type: type.value })}
                    style={{
                      padding: '12px',
                      border: `2px solid ${formData.meal_type === type.value ? colors.peach : colors.taupe}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      backgroundColor: formData.meal_type === type.value ? `${colors.peach}10` : colors.white,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: 24, marginBottom: 4 }}>{type.icon}</div>
                    <div style={{ fontWeight: 600, color: colors.dark, fontSize: 13 }}>{type.label}</div>
                    <div style={{ fontSize: 10, color: colors.taupe }}>{type.time}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Nutrition Row */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 14 }}>
                Nutrition Information
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', color: colors.taupe, fontSize: 12, marginBottom: 4 }}>Calories (kcal)</label>
                  <input
                    type="number"
                    name="calories"
                    value={formData.calories}
                    onChange={handleChange}
                    placeholder="e.g., 450"
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: colors.taupe, fontSize: 12, marginBottom: 4 }}>Protein (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={formData.protein}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: colors.taupe, fontSize: 12, marginBottom: 4 }}>Carbs (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={formData.carbs}
                    onChange={handleChange}
                    placeholder="e.g., 45"
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: colors.taupe, fontSize: 12, marginBottom: 4 }}>Fat (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={formData.fat}
                    onChange={handleChange}
                    placeholder="e.g., 15"
                    style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  />
                </div>
              </div>
            </div>
            
            {/* Quantity & Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  step="0.1"
                  placeholder="e.g., 200"
                  style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                  Unit
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, backgroundColor: colors.white }}
                >
                  {units.map(unit => (
                    <option key={unit.value} value={unit.value}>{unit.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Quick Add Suggestions */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 14 }}>
                Quick Add Common Meals
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {[
                  { name: '🥗 Grilled Chicken Salad', calories: 350, protein: 35, carbs: 15, fat: 18 },
                  { name: '🍚 Rice & Beans', calories: 400, protein: 12, carbs: 70, fat: 8 },
                  { name: '🥑 Avocado Toast', calories: 320, protein: 8, carbs: 35, fat: 18 },
                  { name: '🍎 Apple', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
                  { name: '🥛 Protein Shake', calories: 150, protein: 25, carbs: 8, fat: 3 },
                  { name: '🥚 Eggs (2)', calories: 140, protein: 12, carbs: 1, fat: 10 },
                ].map((meal, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        food_name: meal.name,
                        calories: meal.calories,
                        protein: meal.protein,
                        carbs: meal.carbs,
                        fat: meal.fat
                      })
                    }}
                    style={{ backgroundColor: `${colors.peach}20`, border: `1px solid ${colors.peach}`, borderRadius: 20, padding: '8px 16px', fontSize: 12, cursor: 'pointer', color: colors.dark }}
                  >
                    {meal.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Buttons */}
            <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${colors.peach}`, color: colors.taupe, padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading || !formData.food_name}
                style={{ flex: 1, backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: (loading || !formData.food_name) ? 'not-allowed' : 'pointer', opacity: (loading || !formData.food_name) ? 0.6 : 1 }}
              >
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