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
    name: '', category: '', calories_per_100g: '', protein_per_100g: '',
    carbs_per_100g: '', fats_per_100g: '', fiber_per_100g: ''
  })
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/dashboard')
    }
  }, [user])

  const searchFood = async () => {
    if (!search.trim()) return
    setSearching(true)
    try {
      const response = await API.get(`/food/search?query=${encodeURIComponent(search)}&limit=20`)
      setFoods(response.data.results || [])
    } catch (err) {
      console.error('Error searching food:', err)
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
    try {
      await API.post('/food/add', {
        name: formData.name,
        category: formData.category,
        calories_per_100g: formData.calories_per_100g ? parseFloat(formData.calories_per_100g) : null,
        protein_per_100g: formData.protein_per_100g ? parseFloat(formData.protein_per_100g) : null,
        carbs_per_100g: formData.carbs_per_100g ? parseFloat(formData.carbs_per_100g) : null,
        fats_per_100g: formData.fats_per_100g ? parseFloat(formData.fats_per_100g) : null,
        fiber_per_100g: formData.fiber_per_100g ? parseFloat(formData.fiber_per_100g) : null,
      })
      setSuccess('Food item added successfully!')
      setShowAddForm(false)
      setFormData({ name: '', category: '', calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fats_per_100g: '', fiber_per_100g: '' })
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error adding food:', err)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>

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
            <Link key={i} to={item.path} style={{ color: i === 2 ? c.peach : c.taupe, textDecoration: 'none', fontSize: 13, letterSpacing: 1 }}>{item.label}</Link>
          ))}
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 32px' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <p style={{ color: c.peach, fontSize: 11, letterSpacing: 4, textTransform: 'uppercase', marginBottom: 8 }}>Admin Panel</p>
            <h1 style={{ color: c.dark, fontSize: 32, fontWeight: 900, letterSpacing: -1, margin: 0 }}>Food Database</h1>
            <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Search and manage food items from Open Food Facts</p>
          </div>
          <button onClick={() => setShowAddForm(!showAddForm)}
            style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px 24px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: 1 }}>
            + Add Custom Food
          </button>
        </div>

        {success && (
          <div style={{ backgroundColor: '#d4edda', color: '#155724', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
            ✅ {success}
          </div>
        )}

        {/* add form */}
        {showAddForm && (
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 28, marginBottom: 32 }}>
            <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 20 }}>Add Custom Food Item</h3>
            <form onSubmit={handleAddFood}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 16 }}>
                {[
                  { name: 'name', label: 'Food Name', required: true },
                  { name: 'category', label: 'Category' },
                  { name: 'calories_per_100g', label: 'Calories / 100g' },
                  { name: 'protein_per_100g', label: 'Protein / 100g' },
                  { name: 'carbs_per_100g', label: 'Carbs / 100g' },
                  { name: 'fats_per_100g', label: 'Fat / 100g' },
                  { name: 'fiber_per_100g', label: 'Fiber / 100g' },
                ].map((field, i) => (
                  <div key={i}>
                    <label style={{ display: 'block', color: c.taupe, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{field.label}</label>
                    <input
                      type={field.name === 'name' || field.name === 'category' ? 'text' : 'number'}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required={field.required}
                      step="0.1"
                      style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 6, padding: '10px 12px', fontSize: 13, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <button type="button" onClick={() => setShowAddForm(false)}
                  style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '12px', cursor: 'pointer', borderRadius: 6 }}>
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  style={{ flex: 1, backgroundColor: c.dark, color: c.white, border: 'none', padding: '12px', cursor: 'pointer', borderRadius: 6, fontWeight: 700, opacity: saving ? 0.6 : 1 }}>
                  {saving ? 'Saving...' : 'Add Food Item'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Search food database (e.g. apple, rice, chicken)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchFood()}
            style={{ flex: 1, border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '12px 16px', fontSize: 14, outline: 'none' }}
          />
          <button onClick={searchFood} disabled={searching}
            style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '0 28px', cursor: searching ? 'not-allowed' : 'pointer', borderRadius: 8, fontWeight: 700, opacity: searching ? 0.6 : 1 }}>
            {searching ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* results */}
        {foods.length > 0 && (
          <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ backgroundColor: c.dark }}>
                  {['Food Name', 'Brand', 'Calories/100g', 'Protein', 'Carbs', 'Fat'].map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', color: i === 0 ? c.white : c.peach, textAlign: 'left', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {foods.map((food, i) => (
                  <tr key={i} style={{ borderTop: `1px solid ${c.peach}20`, backgroundColor: i % 2 === 0 ? c.white : `${c.peach}05` }}>
                    <td style={{ padding: '12px 16px', color: c.dark, fontWeight: 600 }}>{food.food_name || '-'}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.brand || '-'}</td>
                    <td style={{ padding: '12px 16px', color: c.dark }}>{food.calories ? `${Math.round(food.calories)} kcal` : '-'}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.protein ? `${food.protein}g` : '-'}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.carbs ? `${food.carbs}g` : '-'}</td>
                    <td style={{ padding: '12px 16px', color: c.taupe }}>{food.fat ? `${food.fat}g` : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {foods.length === 0 && !searching && (
          <div style={{ textAlign: 'center', padding: '60px 20px', border: `1px solid ${c.peach}`, borderRadius: 12 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🥗</div>
            <p style={{ color: c.taupe, fontSize: 15 }}>Search for food items above to browse the database</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDatabasePage