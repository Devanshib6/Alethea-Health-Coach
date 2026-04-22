import { useState, useEffect } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
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

const FoodDatabasePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Users', path: '/admin/users' },
    { label: 'Food Database', path: '/admin/food-database' },
    { label: 'Analytics', path: '/admin/analytics' },
  ]

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
      'Veg': 'Vegetarian',
      'Eggitarian': 'Eggitarian',
      'Non-Veg': 'Non-Veg'
    }
    return labels[dietType] || dietType || '-'
  }

  const getMealTypeLabel = (mealType) => {
    const labels = {
      breakfast: 'Breakfast',
      lunch: 'Lunch',
      dinner: 'Dinner',
      snack: 'Snack'
    }
    return labels[mealType] || mealType || '-'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchFood()
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.cream, fontFamily: "'Inter', system-ui, sans-serif", display: 'flex' }}>
      
      {/* Sidebar Navigation */}
      <div style={{
        width: sidebarCollapsed ? 80 : 260,
        backgroundColor: c.dark,
        minHeight: '100vh',
        transition: 'width 0.3s ease',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Logo */}
        <div style={{ padding: sidebarCollapsed ? '24px 0' : '24px 20px', borderBottom: `1px solid ${c.taupe}30`, marginBottom: 24 }}>
          <div style={{ color: c.white, fontWeight: 700, fontSize: sidebarCollapsed ? 20 : 22, letterSpacing: 2, textTransform: 'uppercase', textAlign: sidebarCollapsed ? 'center' : 'left' }}>
            {sidebarCollapsed ? 'A' : 'Alethea'}
          </div>
          {!sidebarCollapsed && (
            <div style={{ fontSize: 10, color: c.peach, marginTop: 4, letterSpacing: 1 }}>ADMIN</div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          style={{
            position: 'absolute',
            right: -12,
            top: 80,
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: c.peach,
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: c.dark,
            fontSize: 12,
          }}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>

        {/* Nav Items */}
        <nav style={{ flex: 1 }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: sidebarCollapsed ? '14px 0' : '12px 20px',
                margin: '4px 12px',
                borderRadius: 12,
                textDecoration: 'none',
                backgroundColor: location.pathname === item.path ? `${c.peach}20` : 'transparent',
                color: location.pathname === item.path ? c.peach : c.taupe,
                transition: 'all 0.2s',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = `${c.white}10`
                  e.currentTarget.style.color = c.white
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== item.path) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                  e.currentTarget.style.color = c.taupe
                }
              }}
            >
              {!sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label}</span>}
              {sidebarCollapsed && <span style={{ fontSize: 14, fontWeight: 500 }}>{item.label.charAt(0)}</span>}
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div style={{ padding: sidebarCollapsed ? '20px 0' : '20px', borderTop: `1px solid ${c.taupe}30` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: sidebarCollapsed ? 'center' : 'flex-start' }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: c.peach,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              fontWeight: 700,
              color: c.dark,
            }}>
              {user?.full_name?.charAt(0) || 'A'}
            </div>
            {!sidebarCollapsed && (
              <div style={{ flex: 1 }}>
                <p style={{ color: c.white, fontWeight: 600, margin: 0, fontSize: 13 }}>{user?.full_name?.split(' ')[0] || 'Admin'}</p>
                <p style={{ color: c.taupe, fontSize: 11, margin: '4px 0 0' }}>Administrator</p>
              </div>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                marginTop: 16,
                padding: '10px',
                backgroundColor: 'transparent',
                border: `1px solid ${c.taupe}40`,
                borderRadius: 8,
                color: c.taupe,
                cursor: 'pointer',
                fontSize: 13,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `${c.peach}20`
                e.currentTarget.style.borderColor = c.peach
                e.currentTarget.style.color = c.peach
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = `${c.taupe}40`
                e.currentTarget.style.color = c.taupe
              }}
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        marginLeft: sidebarCollapsed ? 80 : 260,
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
      }}>
        
        {/* Header */}
        <div style={{ backgroundColor: c.white, borderBottom: `1px solid ${c.peach}15`, padding: '20px 32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 style={{ color: c.dark, fontSize: 28, fontWeight: 800, margin: 0 }}>Food Database</h1>
              <p style={{ color: c.taupe, marginTop: 4, fontSize: 14 }}>Search and manage food items from your database</p>
            </div>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              style={{ 
                backgroundColor: c.dark, 
                color: c.white, 
                border: 'none', 
                padding: '10px 24px', 
                fontSize: 13, 
                fontWeight: 600, 
                cursor: 'pointer', 
                borderRadius: 40,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.charcoal}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.dark}
            >
              + Add Custom Food
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '32px' }}>

          {/* Success/Error Messages */}
          {success && (
            <div style={{ 
              backgroundColor: '#d4edda', 
              color: '#155724', 
              padding: '14px 18px', 
              borderRadius: 12, 
              marginBottom: 24, 
              fontSize: 14,
              borderLeft: `4px solid #28a745`,
            }}>
              {success}
            </div>
          )}

          {error && (
            <div style={{ 
              backgroundColor: '#fee2e2', 
              color: '#b91c1c', 
              padding: '14px 18px', 
              borderRadius: 12, 
              marginBottom: 24, 
              fontSize: 14,
              borderLeft: `4px solid #dc2626`,
            }}>
              {error}
            </div>
          )}

          {/* Add Food Form */}
          {showAddForm && (
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              padding: 28, 
              marginBottom: 32,
              border: `1px solid ${c.peach}15`,
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}>
              <h3 style={{ color: c.dark, fontWeight: 600, marginBottom: 20, fontSize: 18 }}>Add Custom Food Item</h3>
              <form onSubmit={handleAddFood}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Food Name *
                    </label>
                    <input
                      type="text"
                      name="food_name"
                      value={formData.food_name}
                      onChange={handleChange}
                      required
                      placeholder="e.g., Butter Chicken"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Category
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="e.g., Curry, Rice, Bread"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Meal Type
                    </label>
                    <select
                      name="meal_type"
                      value={formData.meal_type}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
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
                      <option value="">Select meal type</option>
                      <option value="breakfast">Breakfast</option>
                      <option value="lunch">Lunch</option>
                      <option value="dinner">Dinner</option>
                      <option value="snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Diet Type
                    </label>
                    <select
                      name="diet_type"
                      value={formData.diet_type}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
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
                      <option value="">Select diet type</option>
                      <option value="Veg">Vegetarian</option>
                      <option value="Eggitarian">Eggitarian</option>
                      <option value="Non-Veg">Non-Vegetarian</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Cuisine
                    </label>
                    <select
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleChange}
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none', 
                        backgroundColor: c.white,
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
                      <option value="">Select cuisine</option>
                      <option value="Indian">Indian</option>
                      <option value="Nepali">Nepali</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Global">Global</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 24 }}>
                  <div>
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Calories (per 100g)
                    </label>
                    <input
                      type="number"
                      name="calories_per_100g"
                      value={formData.calories_per_100g}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="250"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      name="protein_per_100g"
                      value={formData.protein_per_100g}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="20"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      name="carbs_per_100g"
                      value={formData.carbs_per_100g}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="30"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Fat (g)
                    </label>
                    <input
                      type="number"
                      name="fat_per_100g"
                      value={formData.fat_per_100g}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="12"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                    <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                      Fiber (g)
                    </label>
                    <input
                      type="number"
                      name="fiber_g"
                      value={formData.fiber_g}
                      onChange={handleChange}
                      step="0.1"
                      placeholder="5"
                      style={{ 
                        width: '100%', 
                        border: `1.5px solid ${c.peach}20`, 
                        borderRadius: 12, 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        outline: 'none',
                        transition: 'all 0.2s',
                        boxSizing: 'border-box',
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
                </div>

                <div style={{ display: 'flex', gap: 16 }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    style={{ 
                      flex: 1, 
                      backgroundColor: 'transparent', 
                      border: `1.5px solid ${c.peach}`, 
                      color: c.taupe, 
                      padding: '12px', 
                      cursor: 'pointer', 
                      borderRadius: 40, 
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
                    disabled={saving}
                    style={{ 
                      flex: 1, 
                      backgroundColor: c.dark, 
                      color: c.white, 
                      border: 'none', 
                      padding: '12px', 
                      cursor: saving ? 'not-allowed' : 'pointer', 
                      borderRadius: 40, 
                      fontWeight: 600,
                      fontSize: 14,
                      opacity: saving ? 0.6 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!saving) e.currentTarget.style.backgroundColor = c.charcoal
                    }}
                    onMouseLeave={(e) => {
                      if (!saving) e.currentTarget.style.backgroundColor = c.dark
                    }}
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
              style={{ 
                flex: 1, 
                border: `1.5px solid ${c.peach}20`, 
                borderRadius: 40, 
                padding: '14px 20px', 
                fontSize: 14, 
                outline: 'none',
                transition: 'all 0.2s',
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
            />
            <button 
              onClick={searchFood} 
              disabled={searching}
              style={{ 
                backgroundColor: c.dark, 
                color: c.white, 
                border: 'none', 
                padding: '0 32px', 
                cursor: searching ? 'not-allowed' : 'pointer', 
                borderRadius: 40, 
                fontWeight: 600,
                fontSize: 14,
                opacity: searching ? 0.6 : 1,
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                if (!searching) e.currentTarget.style.backgroundColor = c.charcoal
              }}
              onMouseLeave={(e) => {
                if (!searching) e.currentTarget.style.backgroundColor = c.dark
              }}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Results Table */}
          {foods.length > 0 && (
            <div style={{ 
              backgroundColor: c.white, 
              borderRadius: 20, 
              overflow: 'hidden',
              border: `1px solid ${c.peach}15`,
            }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 900 }}>
                  <thead>
                    <tr style={{ backgroundColor: c.dark }}>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Food Name</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Category</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Meal Type</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Diet Type</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Calories</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Protein</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Carbs</th>
                      <th style={{ padding: '14px 20px', color: c.white, textAlign: 'left', fontWeight: 600, fontSize: 12 }}>Fat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((food, i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${c.peach}10`, backgroundColor: i % 2 === 0 ? c.white : `${c.peach}02` }}>
                        <td style={{ padding: '14px 20px', color: c.dark, fontWeight: 500 }}>{food.food_name}</td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{food.category || '-'}</td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{getMealTypeLabel(food.meal_type)}</td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{getDietTypeLabel(food.diet_type)}</td>
                        <td style={{ padding: '14px 20px', color: c.dark }}>{food.calories || '-'} kcal</td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{food.protein || '-'}g</td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{food.carbs || '-'}g</td>
                        <td style={{ padding: '14px 20px', color: c.taupe }}>{food.fat || '-'}g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {foods.length === 0 && !searching && !error && (
            <div style={{ 
              textAlign: 'center', 
              padding: '80px 20px', 
              border: `1px solid ${c.peach}20`, 
              borderRadius: 20, 
              backgroundColor: c.white,
            }}>
              <p style={{ color: c.taupe, fontSize: 14, marginBottom: 12 }}>
                Search for food items above to browse the database
              </p>
              <p style={{ color: c.taupe, fontSize: 12 }}>
                Try searching for "rice", "chicken", "dal", or "momo"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default FoodDatabasePage