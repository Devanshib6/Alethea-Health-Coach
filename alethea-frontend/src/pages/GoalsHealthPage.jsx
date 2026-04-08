import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../services/authService'

const colors = {
  dark: '#1a0405',
  taupe: '#7a6058',
  peach: '#d4a090',
  white: '#ffffff',
}

const GoalsHealthPage = () => {
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    goal: '',
    activity_level: '',
    health_conditions: '',
    sleep_hours: '',
    stress_level: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const goals = [
    { value: 'lose_weight', label: 'Lose Weight', icon: '🎯', description: 'Lose 0.5-1 kg per week' },
    { value: 'maintain_weight', label: 'Maintain Weight', icon: '⚖️', description: 'Stay healthy and fit' },
    { value: 'gain_muscle', label: 'Gain Muscle', icon: '💪', description: 'Build strength and mass' },
    { value: 'improve_health', label: 'Improve Health', icon: '❤️', description: 'Better overall wellness' },
    { value: 'increase_energy', label: 'Increase Energy', icon: '⚡', description: 'Feel more energetic' },
  ]

  const activityLevels = [
    { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
    { value: 'light', label: 'Lightly Active', description: 'Exercise 1-3 days/week' },
    { value: 'moderate', label: 'Moderately Active', description: 'Exercise 3-5 days/week' },
    { value: 'very', label: 'Very Active', description: 'Exercise 6-7 days/week' },
    { value: 'extra', label: 'Extra Active', description: 'Physical job + exercise' },
  ]

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await API.put('/users/me', formData)
      navigate('/dietary-preferences')
    } catch (err) {
      console.error('Error saving goals:', err)
      setError(err.response?.data?.detail || 'Failed to save information')
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
            <span style={{ color: colors.peach, fontSize: 14 }}>Step 2 of 3</span>
          </div>
          <div style={{ backgroundColor: colors.taupe, borderRadius: 10, height: 8, overflow: 'hidden' }}>
            <div style={{ width: '66%', backgroundColor: colors.peach, height: '100%', borderRadius: 10 }} />
          </div>
          <p style={{ color: colors.taupe, fontSize: 13, marginTop: 12 }}>Set your health goals</p>
        </div>
      </div>
      
      {/* Form Content */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        
        <div style={{ backgroundColor: colors.white, border: `1px solid ${colors.peach}`, borderRadius: 16, padding: 32 }}>
          
          <h2 style={{ color: colors.dark, fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Health Goals</h2>
          <p style={{ color: colors.taupe, fontSize: 14, marginBottom: 32 }}>What would you like to achieve?</p>
          
          {error && (
            <div style={{ backgroundColor: '#fde8e8', border: '1px solid #f5c6c6', color: '#b91c1c', padding: '12px 16px', borderRadius: 8, marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Health Goal */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 16 }}>
                Primary Health Goal *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {goals.map(goal => (
                  <div
                    key={goal.value}
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    style={{
                      padding: 16,
                      border: `2px solid ${formData.goal === goal.value ? colors.peach : colors.taupe}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      backgroundColor: formData.goal === goal.value ? `${colors.peach}10` : colors.white,
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{goal.icon}</div>
                    <div style={{ fontWeight: 600, color: colors.dark, marginBottom: 4 }}>{goal.label}</div>
                    <div style={{ fontSize: 11, color: colors.taupe }}>{goal.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Activity Level */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 12, fontSize: 16 }}>
                Activity Level *
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
                {activityLevels.map(level => (
                  <div
                    key={level.value}
                    onClick={() => setFormData({ ...formData, activity_level: level.value })}
                    style={{
                      padding: 16,
                      border: `2px solid ${formData.activity_level === level.value ? colors.peach : colors.taupe}`,
                      borderRadius: 12,
                      cursor: 'pointer',
                      backgroundColor: formData.activity_level === level.value ? `${colors.peach}10` : colors.white,
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 600, color: colors.dark, marginBottom: 4 }}>{level.label}</div>
                    <div style={{ fontSize: 11, color: colors.taupe }}>{level.description}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Health Info */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Health Conditions (Optional)
              </label>
              <input
                type="text"
                name="health_conditions"
                value={formData.health_conditions}
                onChange={handleChange}
                placeholder="e.g., Diabetes, High BP, None"
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, outline: 'none' }}
              />
            </div>
            
            {/* Sleep Hours */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Average Sleep (hours/night)
              </label>
              <select
                name="sleep_hours"
                value={formData.sleep_hours}
                onChange={handleChange}
                style={{ width: '100%', padding: '12px 16px', border: `1.5px solid ${colors.peach}`, borderRadius: 8, fontSize: 14, backgroundColor: colors.white }}
              >
                <option value="">Select...</option>
                <option value="<5">Less than 5 hours</option>
                <option value="5-6">5-6 hours</option>
                <option value="6-7">6-7 hours</option>
                <option value="7-8">7-8 hours</option>
                <option value=">8">More than 8 hours</option>
              </select>
            </div>
            
            {/* Stress Level */}
            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', color: colors.dark, fontWeight: 500, marginBottom: 8, fontSize: 14 }}>
                Stress Level
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, stress_level: level })}
                    style={{
                      flex: 1,
                      padding: '10px',
                      backgroundColor: formData.stress_level == level ? colors.peach : colors.white,
                      border: `1.5px solid ${colors.peach}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      color: formData.stress_level == level ? colors.dark : colors.taupe,
                      fontWeight: formData.stress_level == level ? 600 : 400
                    }}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p style={{ color: colors.taupe, fontSize: 12, marginTop: 8, textAlign: 'center' }}>
                1 = Low Stress → 5 = High Stress
              </p>
            </div>
            
            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
              <button
                type="button"
                onClick={() => navigate('/basic-info')}
                style={{ backgroundColor: 'transparent', border: `1.5px solid ${colors.peach}`, color: colors.taupe, padding: '12px 24px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                ← Back
              </button>
              
              <button
                type="submit"
                disabled={loading || !formData.goal || !formData.activity_level}
                style={{ backgroundColor: colors.dark, color: colors.white, border: 'none', padding: '12px 32px', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: (loading || !formData.goal || !formData.activity_level) ? 'not-allowed' : 'pointer', opacity: (loading || !formData.goal || !formData.activity_level) ? 0.6 : 1 }}
              >
                {loading ? 'Saving...' : 'Continue →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default GoalsHealthPage