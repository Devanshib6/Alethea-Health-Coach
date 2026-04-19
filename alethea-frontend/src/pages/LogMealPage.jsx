import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../services/authService'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
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
            'Veg': '🥗 Vegetarian',
            'Eggitarian': '🥚 Eggitarian',
            'Non-Veg': '🍗 Non-Veg'
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
            setError('Failed to search. Please try again.')
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
            setError('Failed to save meal. Please try again.')
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
            breakfast: '🍳 Breakfast',
            lunch: '☀️ Lunch',
            dinner: '🌙 Dinner',
            snack: '🍎 Snack'
        }
        return labels[type] || type
    }

    const filteredResults = getFilteredResults()

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
                <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: c.peach, 
                            cursor: 'pointer', 
                            fontSize: 14, 
                            marginBottom: 12,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6
                        }}>
                        ← Back to Dashboard
                    </button>
                    <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>Log Meal</h1>
                    <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>
                        Your Diet: {userDiet === 'veg' ? '🥗 Vegetarian' : userDiet === 'eggitarian' ? '🥚 Eggitarian' : '🍗 Non-Veg'}
                    </p>
                </div>
            </div>

            <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>
                
                {/* Error Message */}
                {error && (
                    <div style={{ 
                        backgroundColor: '#fde8e8', 
                        border: '1px solid #f5c6c6', 
                        color: '#b91c1c', 
                        padding: '12px 16px', 
                        borderRadius: 8, 
                        marginBottom: 24,
                        fontSize: 14
                    }}>
                        {error}
                    </div>
                )}

                {/* Search Section */}
                <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
                    <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 16, fontSize: 18 }}>🔍 Search Food</h3>
                    <p style={{ color: c.taupe, fontSize: 13, marginBottom: 16 }}>
                        Search from our database of 400+ Indian and Nepali foods
                        {userDiet !== 'non-veg' && (
                            <span style={{ display: 'block', marginTop: 4, color: c.peach }}>
                                {userDiet === 'veg' ? '🥗 Showing only vegetarian items' : '🥚 Showing vegetarian & eggitarian items'}
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
                                border: `1.5px solid ${c.peach}`, 
                                borderRadius: 8, 
                                padding: '12px 16px', 
                                fontSize: 14, 
                                outline: 'none',
                                fontFamily: 'sans-serif'
                            }}
                        />
                        <button 
                            onClick={handleSearch}
                            disabled={loading}
                            style={{ 
                                backgroundColor: c.dark, 
                                color: c.white, 
                                border: 'none', 
                                padding: '12px 24px', 
                                borderRadius: 8, 
                                cursor: loading ? 'not-allowed' : 'pointer', 
                                fontWeight: 600,
                                opacity: loading ? 0.6 : 1
                            }}>
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Search Results with Diet Filtering */}
                    {filteredResults.length > 0 && (
                        <div style={{ marginTop: 20 }}>
                            <p style={{ color: c.taupe, fontSize: 12, marginBottom: 12 }}>
                                Found {filteredResults.length} result(s)
                            </p>
                            {filteredResults.map((food, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => selectFood(food)}
                                    style={{ 
                                        padding: '14px 16px', 
                                        borderBottom: `1px solid ${c.peach}30`, 
                                        cursor: 'pointer', 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        alignItems: 'center',
                                        transition: 'background 0.2s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = `${c.peach}10`}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <p style={{ color: c.dark, fontWeight: 600, margin: 0 }}>{food.food_name}</p>
                                            <span style={{ 
                                                backgroundColor: food.diet_type === 'Veg' ? '#22c55e20' : food.diet_type === 'Eggitarian' ? '#f59e0b20' : '#ef444420',
                                                color: food.diet_type === 'Veg' ? '#16a34a' : food.diet_type === 'Eggitarian' ? '#d97706' : '#dc2626',
                                                fontSize: 10, 
                                                padding: '2px 8px', 
                                                borderRadius: 12,
                                                fontWeight: 600
                                            }}>
                                                {getDietTypeLabel(food.diet_type)}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                                            <p style={{ color: c.taupe, fontSize: 12, margin: 0 }}>🔥 {food.calories} kcal</p>
                                            <p style={{ color: c.taupe, fontSize: 12, margin: 0 }}>💪 {food.protein}g protein</p>
                                            <p style={{ color: c.taupe, fontSize: 12, margin: 0 }}>🌾 {food.carbs}g carbs</p>
                                            <p style={{ color: c.taupe, fontSize: 12, margin: 0 }}>🥑 {food.fat}g fat</p>
                                        </div>
                                        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
                                            {food.meal_type && (
                                                <span style={{ 
                                                    backgroundColor: `${c.peach}20`, 
                                                    color: c.dark, 
                                                    fontSize: 10, 
                                                    padding: '2px 8px', 
                                                    borderRadius: 12,
                                                    fontWeight: 600
                                                }}>
                                                    {getMealTypeLabel(food.meal_type)}
                                                </span>
                                            )}
                                            {food.cuisine && (
                                                <span style={{ 
                                                    backgroundColor: `${c.taupe}20`, 
                                                    color: c.taupe, 
                                                    fontSize: 10, 
                                                    padding: '2px 8px', 
                                                    borderRadius: 12
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
                    )}

                    {searchResults.length > 0 && filteredResults.length === 0 && !loading && (
                        <div style={{ 
                            marginTop: 20, 
                            padding: '20px', 
                            textAlign: 'center', 
                            backgroundColor: `${c.peach}10`, 
                            borderRadius: 8 
                        }}>
                            <p style={{ color: c.taupe }}>
                                Found {searchResults.length} items, but none match your diet.
                            </p>
                            <p style={{ color: c.taupe, fontSize: 12, marginTop: 4 }}>
                                Try a different search term or update your dietary preferences.
                            </p>
                        </div>
                    )}
                </div>

                {/* Meal Form - Shows after food is selected */}
                {selectedFood && (
                    <form onSubmit={handleSubmit} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ color: c.dark, fontWeight: 800, margin: 0 }}>📝 Log This Meal</h3>
                            <button 
                                type="button" 
                                onClick={() => setSelectedFood(null)}
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: c.taupe, 
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    textDecoration: 'underline'
                                }}>
                                Change Food
                            </button>
                        </div>
                        
                        <div style={{ 
                            backgroundColor: `${c.peach}10`, 
                            borderRadius: 8, 
                            padding: 16, 
                            marginBottom: 24,
                            border: `1px solid ${c.peach}`
                        }}>
                            <p style={{ color: c.dark, fontWeight: 700, margin: 0, fontSize: 18 }}>
                                {formData.food_name}
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
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
                                        border: `1.5px solid ${c.peach}`, 
                                        borderRadius: 8, 
                                        padding: '10px 12px', 
                                        fontSize: 14,
                                        backgroundColor: c.white,
                                        cursor: 'pointer'
                                    }}>
                                    <option value="breakfast">🍳 Breakfast</option>
                                    <option value="lunch">☀️ Lunch</option>
                                    <option value="dinner">🌙 Dinner</option>
                                    <option value="snack">🍎 Snack</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
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
                                        border: `1.5px solid ${c.peach}`, 
                                        borderRadius: 8, 
                                        padding: '10px 12px', 
                                        fontSize: 14,
                                        outline: 'none'
                                    }} />
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>
                                    Unit
                                </label>
                                <select 
                                    name="unit" 
                                    value={formData.unit} 
                                    onChange={handleChange}
                                    style={{ 
                                        width: '100%', 
                                        border: `1.5px solid ${c.peach}`, 
                                        borderRadius: 8, 
                                        padding: '10px 12px', 
                                        fontSize: 14,
                                        backgroundColor: c.white,
                                        cursor: 'pointer'
                                    }}>
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
                        <div style={{ backgroundColor: `${c.peach}10`, borderRadius: 8, padding: 16, marginBottom: 24 }}>
                            <p style={{ color: c.taupe, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>
                                📊 Nutrition Information
                            </p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                                <div>
                                    <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>🔥 Calories</p>
                                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, margin: '4px 0 0' }}>
                                        {Math.round(formData.calories * (formData.quantity / 100))} kcal
                                    </p>
                                    <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.calories}/100g)</p>
                                </div>
                                <div>
                                    <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>💪 Protein</p>
                                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, margin: '4px 0 0' }}>
                                        {Math.round((formData.protein * (formData.quantity / 100)) * 10) / 10} g
                                    </p>
                                    <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.protein}/100g)</p>
                                </div>
                                <div>
                                    <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>🌾 Carbs</p>
                                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, margin: '4px 0 0' }}>
                                        {Math.round((formData.carbs * (formData.quantity / 100)) * 10) / 10} g
                                    </p>
                                    <p style={{ color: c.taupe, fontSize: 10, margin: 0 }}>({formData.carbs}/100g)</p>
                                </div>
                                <div>
                                    <p style={{ color: c.taupe, fontSize: 11, margin: 0 }}>🥑 Fat</p>
                                    <p style={{ color: c.dark, fontWeight: 700, fontSize: 16, margin: '4px 0 0' }}>
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
                                    borderRadius: 8, 
                                    cursor: 'pointer', 
                                    color: c.taupe,
                                    fontWeight: 600,
                                    fontSize: 14
                                }}>
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
                                    borderRadius: 8, 
                                    cursor: loading ? 'not-allowed' : 'pointer', 
                                    fontWeight: 700,
                                    fontSize: 14,
                                    opacity: loading ? 0.6 : 1
                                }}>
                                {loading ? 'Saving...' : '✓ Log Meal'}
                            </button>
                        </div>
                    </form>
                )}

                {!selectedFood && !searchResults.length && !loading && (
                    <div style={{ 
                        textAlign: 'center', 
                        padding: '60px 20px',
                        border: `1px solid ${c.peach}30`,
                        borderRadius: 12,
                        backgroundColor: `${c.peach}05`
                    }}>
                        <div style={{ fontSize: 64, marginBottom: 16 }}>🍽️</div>
                        <h3 style={{ color: c.dark, fontWeight: 700, marginBottom: 8 }}>Search for a food item</h3>
                        <p style={{ color: c.taupe, fontSize: 14, maxWidth: 300, margin: '0 auto' }}>
                            Search our database of 400+ Indian and Nepali foods to start tracking your meals
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default LogMealPage