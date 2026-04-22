import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Webcam from 'react-webcam'
import API from '../services/authService'

const c = {
    dark: '#1a0405',
    taupe: '#7a6058',
    peach: '#d4a090',
    white: '#ffffff',
}

const AISnapPage = () => {
    const navigate = useNavigate()
    const webcamRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [showCamera, setShowCamera] = useState(false)
    const [capturedImage, setCapturedImage] = useState(null)
    const [detectedFoods, setDetectedFoods] = useState([])
    const [selectedFood, setSelectedFood] = useState(null)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [formData, setFormData] = useState({
        food_name: '',
        meal_type: 'lunch',
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        quantity: 100,
        unit: 'g'
    })
    const [error, setError] = useState('')

    const capturePhoto = () => {
        const imageSrc = webcamRef.current.getScreenshot()
        setCapturedImage(imageSrc)
        setShowCamera(false)
        recognizeFood(imageSrc)
    }

    const recognizeFood = async (imageBase64) => {
        setLoading(true)
        setError('')
        try {
            const response = await API.post('/ai-snap/recognize', {
                image_base64: imageBase64
            })
            if (response.data.detected_foods && response.data.detected_foods.length > 0) {
                setDetectedFoods(response.data.detected_foods)
            } else {
                setError('No food detected. Try taking a clearer photo.')
            }
        } catch (error) {
            console.error('Recognition failed:', error)
            setError('Failed to recognize food. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const selectDetectedFood = (food) => {
        setSelectedFood(food)
        setFormData({
            food_name: food.food_name,
            meal_type: 'lunch',
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            quantity: 100,
            unit: 'g'
        })
        setDetectedFoods([])
    }

    const searchFood = async () => {
        if (!searchQuery.trim()) return
        setLoading(true)
        try {
            const response = await API.get(`/ai-snap/search?query=${encodeURIComponent(searchQuery)}`)
            setSearchResults(response.data.results || [])
        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setLoading(false)
        }
    }

    const selectSearchResult = (food) => {
        setSelectedFood(food)
        setFormData({
            food_name: food.food_name,
            meal_type: food.meal_type || 'lunch',
            calories: food.calories,
            protein: food.protein,
            carbs: food.carbs,
            fat: food.fat,
            quantity: 100,
            unit: 'g'
        })
        setSearchResults([])
        setSearchQuery('')
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

    const getMealTypeIcon = (type) => {
        const icons = { breakfast: '🍳', lunch: '☀️', dinner: '🌙', snack: '🍎' }
        return icons[type] || '🍽️'
    }

    const getDietTypeLabel = (dietType) => {
        const labels = { 'Veg': '🥗', 'Eggitarian': '🥚', 'Non-Veg': '🍗' }
        return labels[dietType] || ''
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: c.white, fontFamily: 'sans-serif' }}>
            {/* Header */}
            <div style={{ backgroundColor: c.dark, padding: '20px 32px' }}>
                <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <button onClick={() => navigate('/dashboard')}
                        style={{ background: 'none', border: 'none', color: c.peach, cursor: 'pointer', fontSize: 14, marginBottom: 12 }}>
                        ← Back to Dashboard
                    </button>
                    <h1 style={{ color: c.white, fontSize: 28, fontWeight: 800, margin: 0 }}>📸 AI Snap</h1>
                    <p style={{ color: c.taupe, marginTop: 6, fontSize: 14 }}>Take a photo of your meal and let AI detect calories</p>
                </div>
            </div>

            <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 32px' }}>

                {error && (
                    <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24 }}>
                        {error}
                    </div>
                )}

                {/* Camera Section */}
                {!selectedFood && !detectedFoods.length && (
                    <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32, textAlign: 'center' }}>
                        <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 16 }}>📷 Take a Photo</h3>
                        
                        {!showCamera && !capturedImage && (
                            <button onClick={() => setShowCamera(true)}
                                style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '16px 32px', borderRadius: 12, cursor: 'pointer', fontSize: 16, fontWeight: 600 }}>
                                📸 Open Camera
                            </button>
                        )}

                        {showCamera && (
                            <div>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    style={{ width: '100%', maxWidth: 500, borderRadius: 12, marginBottom: 16 }}
                                />
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button onClick={() => setShowCamera(false)}
                                        style={{ backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                                        Cancel
                                    </button>
                                    <button onClick={capturePhoto}
                                        style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                                        Capture Photo
                                    </button>
                                </div>
                            </div>
                        )}

                        {capturedImage && !showCamera && (
                            <div>
                                <img src={capturedImage} alt="Captured" style={{ width: '100%', maxWidth: 300, borderRadius: 12, marginBottom: 16 }} />
                                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                                    <button onClick={() => { setCapturedImage(null); setShowCamera(true) }}
                                        style={{ backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, color: c.taupe, padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                                        Retake
                                    </button>
                                    <button onClick={() => recognizeFood(capturedImage)} disabled={loading}
                                        style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                                        {loading ? 'Recognizing...' : 'Recognize Food'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {loading && !detectedFoods.length && (
                            <div style={{ marginTop: 20 }}>
                                <div style={{ width: 48, height: 48, border: `3px solid ${c.peach}`, borderTopColor: c.dark, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }} />
                                <p style={{ color: c.taupe, marginTop: 12 }}>Analyzing your food...</p>
                                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
                            </div>
                        )}

                        {/* Search Alternative */}
                        <div style={{ marginTop: 32, paddingTop: 24, borderTop: `1px solid ${c.peach}30` }}>
                            <p style={{ color: c.taupe, fontSize: 13, marginBottom: 12 }}>Or search manually:</p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && searchFood()}
                                    placeholder="Search for food..."
                                    style={{ flex: 1, border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none' }}
                                />
                                <button onClick={searchFood}
                                    style={{ backgroundColor: c.dark, color: c.white, border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}>
                                    Search
                                </button>
                            </div>
                            {searchResults.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                    {searchResults.map((food, i) => (
                                        <div key={i} onClick={() => selectSearchResult(food)}
                                            style={{ padding: '12px', borderBottom: `1px solid ${c.peach}30`, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ color: c.dark, fontWeight: 600 }}>{food.food_name}</p>
                                                <p style={{ color: c.taupe, fontSize: 12 }}>🔥 {food.calories} kcal</p>
                                            </div>
                                            <span style={{ color: c.peach }}>Select →</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Detected Foods */}
                {detectedFoods.length > 0 && !selectedFood && (
                    <div style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24, marginBottom: 32 }}>
                        <h3 style={{ color: c.dark, fontWeight: 800, marginBottom: 16 }}>🍽️ Detected Foods</h3>
                        {detectedFoods.map((food, i) => (
                            <div key={i} onClick={() => selectDetectedFood(food)}
                                style={{ padding: '16px', borderBottom: i < detectedFoods.length - 1 ? `1px solid ${c.peach}30` : 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ color: c.dark, fontWeight: 600 }}>{food.food_name}</p>
                                    <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
                                        <span style={{ color: c.taupe, fontSize: 12 }}>🔥 {food.calories} kcal</span>
                                        <span style={{ color: c.taupe, fontSize: 12 }}>💪 {food.protein}g</span>
                                        <span style={{ color: c.taupe, fontSize: 12 }}>🌾 {food.carbs}g</span>
                                        <span style={{ color: c.taupe, fontSize: 12 }}>🥑 {food.fat}g</span>
                                    </div>
                                    <span style={{ color: c.peach, fontSize: 11 }}>Confidence: {food.confidence}%</span>
                                </div>
                                <span style={{ color: c.peach }}>Select →</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Meal Form */}
                {selectedFood && (
                    <form onSubmit={handleSubmit} style={{ border: `1px solid ${c.peach}`, borderRadius: 12, padding: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h3 style={{ color: c.dark, fontWeight: 800, margin: 0 }}>📝 Log This Meal</h3>
                            <button type="button" onClick={() => { setSelectedFood(null); setCapturedImage(null) }}
                                style={{ background: 'none', border: 'none', color: c.taupe, cursor: 'pointer', fontSize: 12, textDecoration: 'underline' }}>
                                Take Another Photo
                            </button>
                        </div>

                        <div style={{ backgroundColor: `${c.peach}10`, borderRadius: 8, padding: 16, marginBottom: 24, border: `1px solid ${c.peach}` }}>
                            <p style={{ color: c.dark, fontWeight: 700, margin: 0, fontSize: 18 }}>{formData.food_name}</p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                            <div>
                                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>Meal Type</label>
                                <select name="meal_type" value={formData.meal_type} onChange={handleChange}
                                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, backgroundColor: c.white }}>
                                    <option value="breakfast">🍳 Breakfast</option>
                                    <option value="lunch">☀️ Lunch</option>
                                    <option value="dinner">🌙 Dinner</option>
                                    <option value="snack">🍎 Snack</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>Quantity</label>
                                <input type="number" value={formData.quantity} onChange={handleQuantityChange} min="1" max="5000" step="10"
                                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 12px', fontSize: 14 }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', color: c.taupe, fontSize: 12, marginBottom: 6, fontWeight: 600 }}>Unit</label>
                                <select name="unit" value={formData.unit} onChange={handleChange}
                                    style={{ width: '100%', border: `1.5px solid ${c.peach}`, borderRadius: 8, padding: '10px 12px', fontSize: 14, backgroundColor: c.white }}>
                                    <option value="g">grams (g)</option>
                                    <option value="kg">kilograms (kg)</option>
                                    <option value="ml">milliliters (ml)</option>
                                    <option value="piece">piece(s)</option>
                                    <option value="cup">cup(s)</option>
                                    <option value="bowl">bowl(s)</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ backgroundColor: `${c.peach}10`, borderRadius: 8, padding: 16, marginBottom: 24 }}>
                            <p style={{ color: c.taupe, fontSize: 12, marginBottom: 12, fontWeight: 600 }}>📊 Nutrition Information (per 100g)</p>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, textAlign: 'center' }}>
                                <div><p style={{ color: c.taupe, fontSize: 11 }}>🔥 Calories</p><p style={{ color: c.dark, fontWeight: 700 }}>{formData.calories} kcal</p></div>
                                <div><p style={{ color: c.taupe, fontSize: 11 }}>💪 Protein</p><p style={{ color: c.dark, fontWeight: 700 }}>{formData.protein} g</p></div>
                                <div><p style={{ color: c.taupe, fontSize: 11 }}>🌾 Carbs</p><p style={{ color: c.dark, fontWeight: 700 }}>{formData.carbs} g</p></div>
                                <div><p style={{ color: c.taupe, fontSize: 11 }}>🥑 Fat</p><p style={{ color: c.dark, fontWeight: 700 }}>{formData.fat} g</p></div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: 16 }}>
                            <button type="button" onClick={() => setSelectedFood(null)}
                                style={{ flex: 1, backgroundColor: 'transparent', border: `1.5px solid ${c.peach}`, padding: '14px', borderRadius: 8, cursor: 'pointer', color: c.taupe, fontWeight: 600 }}>
                                Cancel
                            </button>
                            <button type="submit" disabled={loading}
                                style={{ flex: 1, backgroundColor: c.dark, color: c.white, border: 'none', padding: '14px', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, opacity: loading ? 0.6 : 1 }}>
                                {loading ? 'Saving...' : '✓ Log Meal'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}

export default AISnapPage