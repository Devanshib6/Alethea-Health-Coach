import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const DietaryPreferencesPage = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    diet_type: '',
    allergies: [],
    dislikes: '',
    meals_per_day: '3',
    water_intake: '',
  })
  
  const [customAllergy, setCustomAllergy] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dietTypes = [
    { value: 'omnivore', label: 'Omnivore', icon: '🍖', description: 'Eat everything' },
    { value: 'vegetarian', label: 'Vegetarian', icon: '🥬', description: 'No meat, no fish' },
    { value: 'vegan', label: 'Vegan', icon: '🌱', description: 'No animal products' },
    { value: 'keto', label: 'Keto', icon: '🥑', description: 'Low carb, high fat' },
    { value: 'paleo', label: 'Paleo', icon: '🥩', description: 'Whole foods only' },
    { value: 'mediterranean', label: 'Mediterranean', icon: '🇬🇷', description: 'Healthy fats, fish' },
  ]

  const commonAllergies = [
    'Gluten', 'Dairy', 'Nuts', 'Eggs', 'Soy', 'Shellfish', 'Peanuts', 'Corn'
  ]

  const toggleAllergy = (allergy) => {
    if (formData.allergies.includes(allergy)) {
      setFormData({
        ...formData,
        allergies: formData.allergies.filter(a => a !== allergy)
      })
    } else {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, allergy]
      })
    }
  }

  const addCustomAllergy = () => {
    if (customAllergy && !formData.allergies.includes(customAllergy)) {
      setFormData({
        ...formData,
        allergies: [...formData.allergies, customAllergy]
      })
      setCustomAllergy('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await API.put('/users/me', {
        diet_type: formData.diet_type,
        allergies: formData.allergies.join(',')
      })
      navigate('/dashboard')
    } catch (err) {
      console.error('Error saving preferences:', err)
      setError(err.response?.data?.detail || 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.white }}>
      
      {/* Progress Bar */}
      <div style={{ backgroundColor: colors.dark, padding: '20px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h1 style={{ color: colors.white, fontSize: 24, fontWeight: 700 }}>Profile Setup</h1>
            <span style={{ color: colors.peach, fontSize: 14 }}>Step 3 of 3</span>
          </div>
          <div style={{ backgroundColor: colors.taupe, borderRadius: 10, height: 8, overflow: 'hidden' }}>
            <div style={{ width: '100%', backgroundColor: colors.peach, height: '100%', borderRadius: 10 }} />
          </div>
          <p style={{ color: colors.taupe, fontSize: 13, marginTop: 12 }}>Almost there! Tell us about your diet</p>
        </div>
      </div>
      
      {/* Form Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 32 }}>
          
          <h2 style={{ color: colors.dark, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Dietary Preferences</h2>
          <p style={{ color: colors.taupe, fontSize: 14, marginBottom: 32 }}>Help us personalize your meal plans</p>
          
          {error && (
            <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Diet Type */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 16 }}>
                Diet Type *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12 }}>
                {dietTypes.map(diet => (
                  <div
                    key={diet.value}
                    onClick={() => setFormData({ ...formData, diet_type: diet.value })}
                    style={{
                      padding: 16,
                      border: `2px solid ${formData.diet_type === diet.value ? colors.peach : colors.taupe}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      backgroundColor: formData.diet_type === diet.value ? `${colors.peach}10` : colors.white,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontSize: 32, marginBottom: 8 }}>{diet.icon}</div>
                    <div style={{ fontWeight: 600, color: colors.dark, marginBottom: 4 }}>{diet.label}</div>
                    <div style={{ fontSize: 11, color: colors.taupe }}>{diet.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Allergies */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 16 }}>
                Allergies & Intolerances
              </label>
              
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {commonAllergies.map(allergy => (
                  <button
                    key={allergy}
                    type="button"
                    onClick={() => toggleAllergy(allergy)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: formData.allergies.includes(allergy) ? colors.peach : colors.white,
                      border: `1.5px solid ${colors.peach}`,
                      borderRadius: 20,
                      cursor: 'pointer',
                      color: formData.allergies.includes(allergy) ? colors.dark : colors.taupe,
                      fontSize: 13,
                      fontWeight: formData.allergies.includes(allergy) ? 500 : 400
                    }}
                  >
                    {allergy}
                  </button>
                ))}
              </div>
              
              {/* Custom Allergy Input */}
              <div style={{ display: 'flex', gap: 8 }}>
                <input
                  type="text"
                  value={customAllergy}
                  onChange={(e) => setCustomAllergy(e.target.value)}
                  placeholder="Other allergies..."
                  style={{ flex: 1, padding: '10px 12px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
                  onKeyPress={(e) => e.key === 'Enter' && addCustomAllergy()}
                />
                <button
                  type="button"
                  onClick={addCustomAllergy}
                  style={{ backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '10px 20px', borderRadius: 8, cursor: 'pointer' }}
                >
                  Add
                </button>
              </div>
              
              {formData.allergies.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ color: colors.taupe, fontSize: 12 }}>Selected: {formData.allergies.join(', ')}</p>
                </div>
              )}
            </div>
            
            {/* Dislikes */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Foods You Dislike (Optional)
              </label>
              <textarea
                name="dislikes"
                value={formData.dislikes}
                onChange={(e) => setFormData({ ...formData, dislikes: e.target.value })}
                placeholder="e.g., Mushrooms, Olives, Cilantro..."
                rows="3"
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            
            {/* Meals Per Day */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Meals Per Day
              </label>
              <select
                name="meals_per_day"
                value={formData.meals_per_day}
                onChange={(e) => setFormData({ ...formData, meals_per_day: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, backgroundColor: colors.white }}
              >
                <option value="2">2 meals per day</option>
                <option value="3">3 meals per day</option>
                <option value="4">4 meals per day</option>
                <option value="5">5+ meals per day</option>
              </select>
            </div>
            
            {/* Water Intake */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Daily Water Intake
              </label>
              <select
                name="water_intake"
                value={formData.water_intake}
                onChange={(e) => setFormData({ ...formData, water_intake: e.target.value })}
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, backgroundColor: colors.white }}
              >
                <option value="">Select...</option>
                <option value="<1L">Less than 1 liter</option>
                <option value="1-2L">1-2 liters</option>
                <option value="2-3L">2-3 liters</option>
                <option value=">3L">More than 3 liters</option>
              </select>
            </div>
            
            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button
                type="button"
                onClick={() => navigate('/goals-health')}
                style={{ backgroundColor: 'transparent', border: `1.5px solid ${colors.peach}`, color: colors.taupe, padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                ← Back
              </button>
              
              <button
                type="submit"
                disabled={loading || !formData.diet_type}
                style={{ backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: (loading || !formData.diet_type) ? 'not-allowed' : 'pointer', opacity: (loading || !formData.diet_type) ? 0.6 : 1 }}
              >
                {loading ? 'Saving...' : 'Complete Setup →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default DietaryPreferencesPage