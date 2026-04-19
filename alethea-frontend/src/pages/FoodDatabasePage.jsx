import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const FoodDatabasePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [foods, setFoods] = useState([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searching, setSearching] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    food_name: '',
    category: '',
    meal_type: '',
    diet_type: '',
    cuisine: '',
    calories_per_100g: '',
    protein_per_100g: '',
    carbs_per_100g: '',
    fat_per_100g: '',
    fiber_g: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user])

  const searchFood = async () => {
    if (!search.trim()) return
    setSearching(true)
    setError('')
    try {
      const response = await API.get(`/food/search?query=${encodeURIComponent(search)}&limit=50`)
      setFoods(response.data.results || [])
      if (response.data.results?.length === 0) {
        setError('No food items found. Try a different search term.')
      }
    } catch (err) {
      console.error('Error searching food:', err)
      setError('Failed to search. Please try again.')
    } finally {
      setSearching(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleAddFood = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await API.post('/food/add', {
        name: formData.food_name,
        category: formData.category || null,
        meal_type: formData.meal_type || null,
        diet_type: formData.diet_type || null,
        cuisine: formData.cuisine || null,
        calories_per_100g: formData.calories_per_100g ? parseFloat(formData.calories_per_100g) : null,
        protein_per_100g: formData.protein_per_100g ? parseFloat(formData.protein_per_100g) : null,
        carbs_per_100g: formData.carbs_per_100g ? parseFloat(formData.carbs_per_100g) : null,
        fat_per_100g: formData.fat_per_100g ? parseFloat(formData.fat_per_100g) : null,
        fiber_g: formData.fiber_g ? parseFloat(formData.fiber_g) : null,
      })
      setSuccess('Food item added successfully!')
      setShowAddForm(false)
      setFormData({
        food_name: '',
        category: '',
        meal_type: '',
        diet_type: '',
        cuisine: '',
        calories_per_100g: '',
        protein_per_100g: '',
        carbs_per_100g: '',
        fat_per_100g: '',
        fiber_g: ''
      })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error adding food:', err)
      setError(err.response?.data?.detail || 'Failed to add food item')
    } finally {
      setSaving(false)
    }
  }

  const getDietTypeLabel = (dietType) => {
    const labels = {
      'Veg': '🥗 Vegetarian',
      'Eggitarian': '🥚 Eggitarian',
      'Non-Veg': '🍗 Non-Veg'
    }
    return labels[dietType] || dietType || '-'
  }

  const getMealTypeLabel = (mealType) => {
    const labels = {
      breakfast: '🍳 Breakfast',
      lunch: '☀️ Lunch',
      dinner: '🌙 Dinner',
      snack: '🍎 Snack'
    }
    return labels[mealType] || mealType || '-'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFood()
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

      {/* Navigation Bar */}
      <nav style={{ backgroundColor: c.dark, padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: c.white, fontWeight: 900, fontSize: 20, letterSpacing: 2 }}>ALETHEA</span>
          <span style={{ backgroundColor: c.peach, color: c.dark, fontSize: 10, padding: '2px 8px', borderRadius: 20, fontWeight: 700, textTransform: 'uppercase' }}>Admin</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[
            { label: 'Dashboard', path: '/admin/dashboard' },
            { label: 'Users', path: '/admin/users' },
            { label: 'Food DB', path: '/admin/food-database' },
            { label: 'Analytics', path: '/admin/analytics' },
          ].map((item, i) => (
            <Link key={i} to={item.path} style={{ color: i === 2 ? c.peach : c.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 1 }}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: c.peach, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', fontFamily: 'sans-serif', marginBottom: 8 }}>
              Admin Panel
            </p>
            <h1 style={{ color: c.dark, fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: 0 }}>Food Database</h1>
            <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Search and manage food items from your database</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 1, borderRadius: 6 }}>
            + Add Custom Food
          </button>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            ✅ {success}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: '#fde8e8', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            ❌ {error}
          </div>
        )}

        {/* Add Food Form */}
        {showAddForm && (
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28, marginBottom: 32 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 20, fontSize: 18 }}>Add Custom Food Item</h3>
            <form onSubmit={handleAddFood}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Food Name *
                  </label>
                  <input
                    type="text"
                    name="food_name"
                    value={formData.food_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Butter Chicken"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Curry, Rice, Bread"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Meal Type
                  </label>
                  <select
                    name="meal_type"
                    value={formData.meal_type}
                    onChange={handleChange}
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', backgroundColor: c.white }}
                  >
                    <option value="">Select meal type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Diet Type
                  </label>
                  <select
                    name="diet_type"
                    value={formData.diet_type}
                    onChange={handleChange}
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', backgroundColor: c.white }}
                  >
                    <option value="">Select diet type</option>
                    <option value="Veg">Vegetarian</option>
                    <option value="Eggitarian">Eggitarian</option>
                    <option value="Non-Veg">Non-Vegetarian</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Cuisine
                  </label>
                  <select
                    name="cuisine"
                    value={formData.cuisine}
                    onChange={handleChange}
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', backgroundColor: c.white }}
                  >
                    <option value="">Select cuisine</option>
                    <option value="Indian">Indian</option>
                    <option value="Nepali">Nepali</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Global">Global</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Calories (per 100g)
                  </label>
                  <input
                    type="number"
                    name="calories_per_100g"
                    value={formData.calories_per_100g}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="e.g., 250"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    name="protein_per_100g"
                    value={formData.protein_per_100g}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="e.g., 20"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    name="carbs_per_100g"
                    value={formData.carbs_per_100g}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="e.g., 30"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    name="fat_per_100g"
                    value={formData.fat_per_100g}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="e.g., 12"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, fontWeight: 600 }}>
                    Fiber (g)
                  </label>
                  <input
                    type="number"
                    name="fiber_g"
                    value={formData.fiber_g}
                    onChange={handleChange}
                    step="0.1"
                    placeholder="e.g., 5"
                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '12px', cursor: 'pointer', borderRadius: 6, fontWeight: 600 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  style={{ flex: 1, backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px', cursor: saving ? 'not-allowed' : 'pointer', borderRadius: 6, fontWeight: 700, opacity: saving ? 0.6 : 1 }}
                >
                  {saving ? 'Saving...' : 'Add Food Item'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search Section */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search for food (e.g., apple, rice, chicken)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{ flex: 1, border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '12px 16px', fontSize: 14, outline: 'none' }}
          />
          <button 
            onClick={searchFood} 
            disabled={searching}
            style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '0 28px', cursor: searching ? 'not-allowed' : 'pointer', borderRadius: 8, fontWeight: 700, opacity: searching ? 0.6 : 1 }}
          >
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Results Table */}
        {foods.length > 0 && (
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 800 }}>
              <thead>
                <tr style={{ backgroundColor: c.dark }}>
                  <th style={{ padding: '12px 16px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Food Name</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Category</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Meal Type</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Diet Type</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Calories</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Protein</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Carbs</th>
                  <th style={{ padding: '12px 16px', color: c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>Fat</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((food, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${c.peach}20`, backgroundColor: i % 2 === 0 ? c.white : `${c.peach}05` }}>
                    <td style={{ padding: '12px 16px', color: c.dark, fontWeight: 600 }}>{food.food_name}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.category || '-'}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{getMealTypeLabel(food.meal_type)}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{getDietTypeLabel(food.diet_type)}</td>
                    <td style={{ padding: '12px 16px', color: c.dark }}>{food.calories || '-'} kcal</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.protein || '-'}g</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.carbs || '-'}g</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.fat || '-'}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {foods.length === 0 && !searching && !error && (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: `1px solid ${c.peach}30`, borderRadius: 12, backgroundColor: `${c.peach}05` }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
            <p style={{ color: c.taupe, fontSize: 15 }}>Search for food items above to browse the database</p>
            <p style={{ color: c.taupe, fontSize: 13, marginTop: 8 }}>Try searching for "rice", "chicken", "dal", or "momo"</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDatabasePage