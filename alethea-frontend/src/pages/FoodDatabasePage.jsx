import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

const FoodDatabasePage = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newFood, setNewFood] = useState({
    name: '', category: '', calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fats_per_100g: ''
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const response = await api.get(`/food/search?query=${searchQuery}`)
      setResults(response.data.results || [])
    } catch (error) {
      toast.error('Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleAddFood = async (e) => {
    e.preventDefault()
    try {
      await api.post('/food/add', newFood)
      toast.success('Food item added!')
      setShowAddForm(false)
      setNewFood({ name: '', category: '', calories_per_100g: '', protein_per_100g: '', carbs_per_100g: '', fats_per_100g: '' })
    } catch (error) {
      toast.error('Failed to add food')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Navbar */}
      <nav className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-indigo-900 font-bold">A</span>
            </div>
            <span className="font-bold text-xl">Alethea Admin</span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/admin/dashboard" className="hover:text-indigo-300">Dashboard</Link>
            <Link to="/admin/users" className="hover:text-indigo-300">Users</Link>
            <Link to="/admin/food-database" className="text-indigo-300">Food DB</Link>
            <Link to="/admin/analytics" className="hover:text-indigo-300">Analytics</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Food Database</h1>
            <p className="text-gray-600 mt-1">Search and manage food items</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Custom Food
          </button>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search for food (e.g., apple, rice, chicken)..."
              className="flex-1 px-4 py-3 border rounded-lg"
            />
            <button onClick={handleSearch} disabled={loading} className="btn-primary px-6 py-3">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>

        {/* Add Food Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Add Custom Food Item</h3>
            <form onSubmit={handleAddFood} className="grid grid-cols-2 gap-4">
              <input type="text" placeholder="Food Name" value={newFood.name} onChange={(e) => setNewFood({ ...newFood, name: e.target.value })} className="input-modern" required />
              <input type="text" placeholder="Category" value={newFood.category} onChange={(e) => setNewFood({ ...newFood, category: e.target.value })} className="input-modern" />
              <input type="number" placeholder="Calories per 100g" value={newFood.calories_per_100g} onChange={(e) => setNewFood({ ...newFood, calories_per_100g: e.target.value })} className="input-modern" />
              <input type="number" placeholder="Protein per 100g" value={newFood.protein_per_100g} onChange={(e) => setNewFood({ ...newFood, protein_per_100g: e.target.value })} className="input-modern" />
              <input type="number" placeholder="Carbs per 100g" value={newFood.carbs_per_100g} onChange={(e) => setNewFood({ ...newFood, carbs_per_100g: e.target.value })} className="input-modern" />
              <input type="number" placeholder="Fat per 100g" value={newFood.fats_per_100g} onChange={(e) => setNewFood({ ...newFood, fats_per_100g: e.target.value })} className="input-modern" />
              <div className="col-span-2 flex gap-4">
                <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-6 py-3 border rounded-lg">Cancel</button>
                <button type="submit" className="flex-1 btn-primary py-3">Add Food Item</button>
              </div>
            </form>
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="font-semibold">Search Results ({results.length})</h3>
            </div>
            <div className="divide-y">
              {results.map((food, i) => (
                <div key={i} className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{food.food_name}</div>
                      <div className="text-sm text-gray-500">{food.brand || 'Generic'}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{food.calories ? `${Math.round(food.calories)} kcal` : '-'}</div>
                      <div className="text-xs text-gray-400">
                        P: {food.protein || 0}g | C: {food.carbs || 0}g | F: {food.fat || 0}g
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && searchQuery && (
          <div className="text-center py-12 bg-white rounded-xl shadow-md">
            <div className="text-4xl mb-2">🍽️</div>
            <p className="text-gray-500">No food items found. Try a different search term.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FoodDatabasePage